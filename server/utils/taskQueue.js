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

export const enqueueTask = async ({ workspace = 'default', source = 'api', request, payload = {}, replyTarget = null }) => {
  await ensureTaskQueueTables();
  const id = crypto.randomUUID();
  const result = await query(
    `INSERT INTO agent_tasks (id, workspace, source, request, payload, reply_target, status)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, 'queued')
     RETURNING *`,
    [id, workspace, source, request, JSON.stringify(payload), JSON.stringify(replyTarget)]
  );

  await appendTaskEvent(id, 'queued', 'Task queued', { source });
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

export const hasDatabaseQueue = () => Boolean(process.env.DATABASE_URL);

export const logQueueMode = () => {
  logger.info('[Queue] task queue initialized', {
    mode: hasDatabaseQueue() ? 'postgres' : 'disabled',
  });
};
