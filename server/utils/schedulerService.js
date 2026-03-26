import logger from './logger.js';
import { executeTask } from './agentExecutor.js';
import { addTaskRun, listDueSchedules, updateSchedule } from './stateStore.js';

let schedulerTimer = null;
let schedulerRunning = false;

const computeNextRunAt = (schedule) => {
  const now = new Date();
  const next = new Date(now);

  switch (schedule.cadence) {
    case 'hourly':
      next.setHours(next.getHours() + 1, 0, 0, 0);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'daily':
    default:
      next.setDate(next.getDate() + 1);
      break;
  }

  return next.toISOString();
};

const runDueSchedules = async () => {
  if (schedulerRunning) return;
  schedulerRunning = true;

  try {
    const dueSchedules = await listDueSchedules();
    for (const schedule of dueSchedules) {
      try {
        const execution = await executeTask({
          request: schedule.prompt,
          payload: {
            ...(schedule.payload || {}),
            capability: schedule.capability,
            workspace: schedule.workspace,
          },
        });

        await addTaskRun({
          workspace: schedule.workspace,
          schedule_id: schedule.id,
          request: schedule.prompt,
          capability: execution.capability,
          status: execution.status,
          result: execution.result,
        });

        await updateSchedule(schedule.id, {
          last_run_at: new Date().toISOString(),
          last_result: execution.result,
          next_run_at: computeNextRunAt(schedule),
        });

        logger.info('[Scheduler] schedule executed', {
          scheduleId: schedule.id,
          title: schedule.title,
          capability: execution.capability,
          status: execution.status,
        });
      } catch (error) {
        await updateSchedule(schedule.id, {
          last_run_at: new Date().toISOString(),
          last_result: { error: error.message },
          next_run_at: computeNextRunAt(schedule),
        });
        logger.error('[Scheduler] schedule execution failed', {
          scheduleId: schedule.id,
          message: error.message,
        });
      }
    }
  } finally {
    schedulerRunning = false;
  }
};

export const startScheduler = () => {
  if (schedulerTimer) return;
  schedulerTimer = setInterval(() => {
    void runDueSchedules();
  }, 30 * 1000);
  logger.startup('Scheduler started', { intervalSeconds: 30 });
};

export const stopScheduler = () => {
  if (schedulerTimer) clearInterval(schedulerTimer);
  schedulerTimer = null;
};

export const triggerSchedulerTick = async () => {
  await runDueSchedules();
};
