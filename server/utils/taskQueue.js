import crypto from 'crypto';
import { query } from '../config/database.js';
import logger from './logger.js';

let initialized = false;

const normalizeTask = (row = {}) => ({
  ...row,
  payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload,
  reply_target: typeof row.reply_target === 'string' ? JSON.parse(row.reply_target) : row.reply_target,
  result: typeof row.result === 'string' ? JSON.parse(row.result) : row.result,
  error: typeof row.error === 'string' ? JSON.parse(row.error) : row.error,
});

export const ensureTaskQueueTables = async () => {
  if (initialized) return;
  await query(`
    CREATE TABLE IF NOT EXISTS agent_tasks (
      id TEXT PRIMARY KEY,
      workspace TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'api',
      request TEXT NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      reply_target JSONB,
      status TEXT NOT NULL DEFAULT 'queued',
      capability TEXT,
      worker_id TEXT,
      result JSONB,
      error JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS agent_task_events (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES agent_tasks(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      data JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS agent_tasks_status_created_idx ON agent_tasks(status, created_at)`);
  await query(`CREATE INDEX IF NOT EXISTS agent_task_events_task_created_idx ON agent_task_events(task_id, created_at)`);
  initialized = true;
};

export const enqueueTask = async ({
  workspace = 'default',
  source = 'api',
  request,
  payload = {},
  replyTarget = null,
  parentTaskId = null,
  depth = 0,
  agentType = 'general',
  maxRetries = 2,
}) => {
  await ensureTaskQueueTables();
  const id = crypto.randomUUID();

  // If this is a child task, increment parent's children_total
  if (parentTaskId) {
    await query(
      `UPDATE agent_tasks SET children_total = children_total + 1 WHERE id = $1`,
      [parentTaskId]
    );
  }

  const result = await query(
    `INSERT INTO agent_tasks (id, workspace, source, request, payload, reply_target, status, parent_task_id, depth, agent_type, max_retries)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, 'queued', $7, $8, $9, $10)
     RETURNING *`,
    [id, workspace, source, request, JSON.stringify(payload), JSON.stringify(replyTarget), parentTaskId, depth, agentType, maxRetries]
  );

  await appendTaskEvent(id, 'queued', 'Task queued', { source, parentTaskId, depth });
  return normalizeTask(result.rows[0]);
};

export const appendTaskEvent = async (taskId, type, message, data = null) => {
  await ensureTaskQueueTables();
  await query(
    `INSERT INTO agent_task_events (id, task_id, type, message, data)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [crypto.randomUUID(), taskId, type, message, JSON.stringify(data)]
  );
};

export const getTask = async (taskId) => {
  await ensureTaskQueueTables();
  const result = await query(`SELECT * FROM agent_tasks WHERE id = $1`, [taskId]);
  return result.rows[0] ? normalizeTask(result.rows[0]) : null;
};

export const listTasks = async ({ workspace = 'default', limit = 50 }) => {
  await ensureTaskQueueTables();
  const result = await query(
    `SELECT * FROM agent_tasks WHERE workspace = $1 ORDER BY created_at DESC LIMIT $2`,
    [workspace, limit]
  );
  return result.rows.map(normalizeTask);
};

export const listTaskEvents = async (taskId) => {
  await ensureTaskQueueTables();
  const result = await query(
    `SELECT * FROM agent_task_events WHERE task_id = $1 ORDER BY created_at ASC`,
    [taskId]
  );
  return result.rows;
};

export const claimNextTask = async (workerId) => {
  await ensureTaskQueueTables();
  const result = await query(
    `WITH next_task AS (
       SELECT id
       FROM agent_tasks
       WHERE status = 'queued'
       ORDER BY created_at ASC
       FOR UPDATE SKIP LOCKED
       LIMIT 1
     )
     UPDATE agent_tasks AS tasks
     SET status = 'running',
         worker_id = $1,
         started_at = NOW(),
         updated_at = NOW()
     FROM next_task
     WHERE tasks.id = next_task.id
     RETURNING tasks.*`,
    [workerId]
  );

  const task = result.rows[0] ? normalizeTask(result.rows[0]) : null;
  if (task) {
    await appendTaskEvent(task.id, 'running', 'Task claimed by worker', { workerId });
  }
  return task;
};

export const completeTask = async ({ taskId, capability, result: taskResult }) => {
  await ensureTaskQueueTables();
  const result = await query(
    `UPDATE agent_tasks
     SET status = 'completed',
         capability = $2,
         result = $3::jsonb,
         updated_at = NOW(),
         completed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [taskId, capability || null, JSON.stringify(taskResult)]
  );
  await appendTaskEvent(taskId, 'completed', 'Task completed', { capability });
  return result.rows[0] ? normalizeTask(result.rows[0]) : null;
};

export const failTask = async ({ taskId, error, capability = null }) => {
  await ensureTaskQueueTables();
  const payload = typeof error === 'string' ? { message: error } : error;
  const result = await query(
    `UPDATE agent_tasks
     SET status = 'failed',
         capability = $2,
         error = $3::jsonb,
         updated_at = NOW(),
         completed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [taskId, capability, JSON.stringify(payload)]
  );
  await appendTaskEvent(taskId, 'failed', 'Task failed', payload);
  return result.rows[0] ? normalizeTask(result.rows[0]) : null;
};

export const heartbeatTask = async (taskId) => {
  await ensureTaskQueueTables();
  await query(`UPDATE agent_tasks SET updated_at = NOW() WHERE id = $1`, [taskId]);
};

// ==========================================
// Phase 1: Parent-Child Task Coordination
// ==========================================

export const incrementChildrenDone = async (parentTaskId) => {
  if (!parentTaskId) return null;

  await ensureTaskQueueTables();
  const result = await query(
    `UPDATE agent_tasks
     SET children_done = children_done + 1, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [parentTaskId]
  );

  return result.rows[0] ? normalizeTask(result.rows[0]) : null;
};

export const getChildrenStatus = async (parentTaskId) => {
  await ensureTaskQueueTables();
  const result = await query(
    `SELECT COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
            SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running
     FROM agent_tasks
     WHERE parent_task_id = $1`,
    [parentTaskId]
  );

  const row = result.rows[0];
  return {
    total: parseInt(row.total) || 0,
    completed: parseInt(row.completed) || 0,
    failed: parseInt(row.failed) || 0,
    running: parseInt(row.running) || 0,
  };
};

export const getChildTasks = async (parentTaskId, { limit = 100 } = {}) => {
  await ensureTaskQueueTables();
  const result = await query(
    `SELECT * FROM agent_tasks
     WHERE parent_task_id = $1
     ORDER BY created_at ASC
     LIMIT $2`,
    [parentTaskId, limit]
  );

  return result.rows.map(normalizeTask);
};

// ==========================================
// Phase 1 & 4: Retry Logic & Recovery
// ==========================================

/**
 * Exponential backoff: 15s, 60s, 300s
 */
const getBackoffDelay = (retryCount) => {
  const delays = [15000, 60000, 300000]; // 15s, 60s, 5min
  return delays[Math.min(retryCount, delays.length - 1)];
};

export const requeueForRetry = async ({ taskId, error = null }) => {
  await ensureTaskQueueTables();

  // Get current task to check retry count
  const taskResult = await query(
    `SELECT retry_count, max_retries FROM agent_tasks WHERE id = $1`,
    [taskId]
  );

  if (!taskResult.rows[0]) return null;

  const { retry_count, max_retries } = taskResult.rows[0];

  // If max retries exceeded, move to dead letter queue
  if (retry_count >= max_retries) {
    const result = await query(
      `UPDATE agent_tasks
       SET status = 'dead',
           error = $2::jsonb,
           updated_at = NOW(),
           completed_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [taskId, JSON.stringify(error || { message: 'Max retries exceeded' })]
    );
    await appendTaskEvent(taskId, 'dead', 'Max retries exceeded', error);
    return result.rows[0] ? normalizeTask(result.rows[0]) : null;
  }

  // Requeue for retry with exponential backoff
  const backoffMs = getBackoffDelay(retry_count);
  const nextRetryAt = new Date(Date.now() + backoffMs).toISOString();

  const result = await query(
    `UPDATE agent_tasks
     SET status = 'queued',
         retry_count = retry_count + 1,
         next_retry_at = $2,
         error = $3::jsonb,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [taskId, nextRetryAt, JSON.stringify(error || { message: 'Retrying' })]
  );

  const newRetryCount = (retry_count || 0) + 1;
  await appendTaskEvent(taskId, 'retry_queued', `Requeued for retry ${newRetryCount}/${max_retries}`, {
    nextRetryAt,
    backoffMs,
  });

  return result.rows[0] ? normalizeTask(result.rows[0]) : null;
};

export const claimRetryableTasks = async (workerId) => {
  await ensureTaskQueueTables();
  const result = await query(
    `WITH retryable AS (
       SELECT id
       FROM agent_tasks
       WHERE status = 'queued'
         AND retry_count > 0
         AND next_retry_at IS NOT NULL
         AND next_retry_at <= NOW()
       ORDER BY next_retry_at ASC
       FOR UPDATE SKIP LOCKED
       LIMIT 1
     )
     UPDATE agent_tasks AS tasks
     SET status = 'running',
         worker_id = $1,
         started_at = NOW(),
         updated_at = NOW()
     FROM retryable
     WHERE tasks.id = retryable.id
     RETURNING tasks.*`,
    [workerId]
  );

  const task = result.rows[0] ? normalizeTask(result.rows[0]) : null;
  if (task) {
    await appendTaskEvent(task.id, 'retry_running', 'Retry attempt in progress', { workerId, attemptNumber: task.retry_count + 1 });
  }
  return task;
};

export const reclaimStaleTasks = async (workerId, staleThresholdMs = 45000) => {
  await ensureTaskQueueTables();
  const staleTime = new Date(Date.now() - staleThresholdMs).toISOString();

  const result = await query(
    `WITH stale AS (
       SELECT id
       FROM agent_tasks
       WHERE status = 'running'
         AND updated_at < $2
       FOR UPDATE SKIP LOCKED
       LIMIT 10
     )
     UPDATE agent_tasks AS tasks
     SET status = 'queued',
         worker_id = NULL,
         updated_at = NOW()
     FROM stale
     WHERE tasks.id = stale.id
     RETURNING tasks.*`,
    [workerId, staleTime]
  );

  const tasks = result.rows.map(normalizeTask);

  for (const task of tasks) {
    await appendTaskEvent(task.id, 'stale_recovered', 'Recovered from stale state (worker timeout)', {
      previousWorker: task.worker_id,
      staleThresholdMs,
    });
  }

  return tasks;
};

export const hasDatabaseQueue = () => Boolean(process.env.DATABASE_URL);

export const logQueueMode = () => {
  logger.info('[Queue] task queue initialized', {
    mode: hasDatabaseQueue() ? 'postgres' : 'disabled',
  });
};

// ==========================================
// Skills Management (Phase 3 prep)
// ==========================================

export const listSkills = async (workspace = 'default') => {
  await ensureTaskQueueTables();
  try {
    const result = await query(
      `SELECT key, name, description, enabled FROM agent_skills WHERE workspace = $1 AND enabled = true ORDER BY updated_at DESC`,
      [workspace]
    );
    return result.rows || [];
  } catch (error) {
    // Skills table may not exist yet; return empty list
    logger.warn('[Skills] listSkills table not ready', { error: error.message });
    return [];
  }
};

// ==========================================
// Phase 4: Dead Letter Queue & Manual Retry
// ==========================================

/**
 * List dead letter (permanently failed) tasks
 */
export const listDeadLetterTasks = async (workspace = 'default', limit = 50) => {
  await ensureTaskQueueTables();
  const result = await query(
    `SELECT * FROM agent_tasks
     WHERE workspace = $1 AND status = 'dead'
     ORDER BY updated_at DESC LIMIT $2`,
    [workspace, limit]
  );
  return result.rows.map(normalizeTask);
};

/**
 * Manually retry a dead letter task
 * Resets retry_count to 0, status to 'queued', and clears the error
 */
export const manuallyRetryTask = async (taskId) => {
  await ensureTaskQueueTables();

  const task = await query(
    `SELECT * FROM agent_tasks WHERE id = $1`,
    [taskId]
  );

  if (!task.rows[0]) return null;

  const result = await query(
    `UPDATE agent_tasks
     SET status = 'queued',
         retry_count = 0,
         next_retry_at = NOW(),
         error = NULL,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [taskId]
  );

  if (result.rows[0]) {
    await appendTaskEvent(taskId, 'manual_retry', 'Task manually retried from dead letter queue', {
      retriedAt: new Date().toISOString(),
    });
  }

  return result.rows[0] ? normalizeTask(result.rows[0]) : null;
};

/**
 * Get task metrics for dashboard
 */
export const getTaskMetrics = async (workspace = 'default') => {
  await ensureTaskQueueTables();
  const result = await query(
    `SELECT
       COUNT(*) as total,
       SUM(CASE WHEN status = 'queued' THEN 1 ELSE 0 END) as queued,
       SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
       SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
       SUM(CASE WHEN status = 'dead' THEN 1 ELSE 0 END) as dead
     FROM agent_tasks
     WHERE workspace = $1`,
    [workspace]
  );

  const row = result.rows[0];
  return {
    total: parseInt(row.total) || 0,
    queued: parseInt(row.queued) || 0,
    running: parseInt(row.running) || 0,
    completed: parseInt(row.completed) || 0,
    failed: parseInt(row.failed) || 0,
    dead: parseInt(row.dead) || 0,
  };
};
