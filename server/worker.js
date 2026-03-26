import 'dotenv/config';
import { executeTask } from './utils/agentExecutor.js';
import logger from './utils/logger.js';
import { getSlackConfig, postSlackMessage } from './utils/slackClient.js';
import { appendTaskEvent, claimNextTask, completeTask, ensureTaskQueueTables, failTask, heartbeatTask, logQueueMode } from './utils/taskQueue.js';

const WORKER_ID = process.env.WORKER_ID || `worker-${process.pid}`;
const POLL_MS = Number(process.env.WORKER_POLL_MS || 3000);

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
  const task = await claimNextTask(WORKER_ID);
  if (!task) return false;

  logger.info('[Worker] claimed task', {
    workerId: WORKER_ID,
    taskId: task.id,
    source: task.source,
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

    await notifySlackIfNeeded(task, execution, false);
  } catch (error) {
    logger.error('[Worker] task failed', {
      workerId: WORKER_ID,
      taskId: task.id,
      message: error.message,
    });
    await failTask({
      taskId: task.id,
      capability: task.payload?.capability || null,
      error: { message: error.message },
    });
    await notifySlackIfNeeded(task, { message: error.message }, true);
  } finally {
    clearInterval(heartbeat);
  }

  return true;
};

const main = async () => {
  await ensureTaskQueueTables();
  logQueueMode();
  logger.startup('Worker started', {
    workerId: WORKER_ID,
    pollMs: POLL_MS,
  });

  while (true) {
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
