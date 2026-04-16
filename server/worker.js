import 'dotenv/config';
import { executeTask } from './utils/agentExecutor.js';
import logger from './utils/logger.js';
import { getSlackConfig, postSlackMessage } from './utils/slackClient.js';
import {
  appendTaskEvent,
  claimNextTask,
  claimRetryableTasks,
  completeTask,
  ensureTaskQueueTables,
  failTask,
  heartbeatTask,
  incrementChildrenDone,
  logQueueMode,
  reclaimStaleTasks,
  requeueForRetry,
} from './utils/taskQueue.js';

const WORKER_ID = process.env.WORKER_ID || `worker-${process.pid}`;
const POLL_MS = Number(process.env.WORKER_POLL_MS || 3000);
const STALE_THRESHOLD_MS = Number(process.env.WORKER_STALE_THRESHOLD_MS || 45000);
const STALE_RECOVERY_INTERVAL = Number(process.env.WORKER_STALE_RECOVERY_INTERVAL || 30);

const formatTaskResult = (execution) => {
  if (typeof execution.result === 'string') return execution.result;
  return `Completed via ${execution.capability}.\n\n${JSON.stringify(execution.result, null, 2)}`;
};

const notifySlackIfNeeded = async (task, execution, failed = false) => {
  const replyTarget = task.reply_target || null;
  if (!replyTarget || replyTarget.type !== 'slack') return;

  const { botToken } = getSlackConfig();
  if (!botToken) return;

  const text = failed
    ? `I hit an internal error while working on that task.\n\n${execution?.message || execution || 'Unknown error'}`
    : formatTaskResult(execution);

  await postSlackMessage({
    botToken,
    channel: replyTarget.channel,
    threadTs: replyTarget.thread_ts,
    text,
  });
};

const runOnce = async () => {
  // Try to claim a normal task first
  let task = await claimNextTask(WORKER_ID);

  // If no normal task, try retryable tasks
  if (!task) {
    task = await claimRetryableTasks(WORKER_ID);
  }

  if (!task) return false;

  logger.info('[Worker] claimed task', {
    workerId: WORKER_ID,
    taskId: task.id,
    source: task.source,
    parentTaskId: task.parent_task_id || null,
    retryCount: task.retry_count || 0,
  });

  const heartbeat = setInterval(() => {
    void heartbeatTask(task.id);
  }, 5000);

  try {
    await appendTaskEvent(task.id, 'planning', 'Worker started execution', { workerId: WORKER_ID });
    const execution = await executeTask({
      request: task.request,
      payload: {
        ...(task.payload || {}),
        workspace: task.workspace,
      },
    });

    await completeTask({
      taskId: task.id,
      capability: execution.capability,
      result: execution,
    });

    // If this is a child task, notify parent
    if (task.parent_task_id) {
      await incrementChildrenDone(task.parent_task_id);
    }

    await notifySlackIfNeeded(task, execution, false);
  } catch (error) {
    logger.error('[Worker] task failed', {
      workerId: WORKER_ID,
      taskId: task.id,
      message: error.message,
      retryCount: task.retry_count || 0,
      maxRetries: task.max_retries || 2,
    });

    // Check if this should be retried
    if (task.retry_count < task.max_retries) {
      await requeueForRetry({
        taskId: task.id,
        error: { message: error.message, stack: error.stack },
      });
      logger.info('[Worker] task requeued for retry', {
        taskId: task.id,
        nextAttempt: task.retry_count + 1,
      });
    } else {
      await failTask({
        taskId: task.id,
        capability: task.payload?.capability || null,
        error: { message: error.message },
      });
      await notifySlackIfNeeded(task, { message: error.message }, true);
    }
  } finally {
    clearInterval(heartbeat);
  }

  return true;
};

/**
 * Periodically recover stale tasks (worker crash recovery)
 * Runs every STALE_RECOVERY_INTERVAL poll cycles
 */
let pollCount = 0;
const recoverStaleTasks = async () => {
  try {
    const recovered = await reclaimStaleTasks(WORKER_ID, STALE_THRESHOLD_MS);
    if (recovered.length > 0) {
      logger.info('[Worker] recovered stale tasks', {
        count: recovered.length,
        taskIds: recovered.map(t => t.id),
      });
    }
  } catch (error) {
    logger.error('[Worker] stale task recovery failed', {
      message: error.message,
    });
  }
};

const main = async () => {
  await ensureTaskQueueTables();
  logQueueMode();
  logger.startup('Worker started', {
    workerId: WORKER_ID,
    pollMs: POLL_MS,
    staleThresholdMs: STALE_THRESHOLD_MS,
  });

  while (true) {
    // Periodically recover stale tasks
    if (pollCount % STALE_RECOVERY_INTERVAL === 0) {
      await recoverStaleTasks();
    }
    pollCount++;

    const didWork = await runOnce();
    if (!didWork) {
      await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    }
  }
};

main().catch((error) => {
  logger.error('[Worker] fatal error', {
    workerId: WORKER_ID,
    message: error.message,
  });
  process.exit(1);
});
