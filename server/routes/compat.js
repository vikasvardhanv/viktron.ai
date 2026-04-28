import express from 'express';
import { executeTask } from '../utils/agentExecutor.js';
import { syncLocalSkillsToStore } from '../utils/skillLoader.js';
import { listSkills } from '../utils/stateStore.js';
import { appendTaskEvent, completeTask, enqueueTask, failTask, hasDatabaseQueue, listTasks } from '../utils/taskQueue.js';

const router = express.Router();

const DEFAULT_TEAM_ID = 'default';

const formatExecutionResponse = (execution) => {
  if (typeof execution?.result === 'string') return execution.result;
  if (execution?.result == null) return 'Task completed.';
  return JSON.stringify(execution.result, null, 2);
};

router.get('/teams', (_req, res) => {
  res.json([
    {
      id: DEFAULT_TEAM_ID,
      name: process.env.SLACK_APP_NAME || 'Viktron',
    },
  ]);
});

router.get('/skills', async (_req, res) => {
  await syncLocalSkillsToStore(DEFAULT_TEAM_ID);
  const skills = await listSkills(DEFAULT_TEAM_ID);
  res.json({
    success: true,
    skills,
    count: skills.length,
  });
});

router.get('/dashboard/overview', async (_req, res) => {
  const tasks = hasDatabaseQueue()
    ? await listTasks({ workspace: DEFAULT_TEAM_ID, limit: 50 })
    : [];

  const summary = {
    pending: tasks.filter((task) => task.status === 'queued').length,
    running: tasks.filter((task) => task.status === 'running').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
    failed: tasks.filter((task) => task.status === 'failed').length,
  };

  const activity = tasks.slice(0, 10).map((task) => ({
    id: task.id,
    timestamp: task.updated_at || task.created_at,
    agent: 'Viktron',
    agent_role: 'ceo',
    action: task.status,
    summary: `${task.status.toUpperCase()}: ${task.request}`,
  }));

  // All agent types in the Viktron platform
  const agentTypes = [
    { role: 'ceo', name: 'CEO Agent', memory_kb: 32, monthly_budget: 500 },
    { role: 'pm', name: 'Project Manager', memory_kb: 24, monthly_budget: 300 },
    { role: 'developer', name: 'Developer Agent', memory_kb: 48, monthly_budget: 400 },
    { role: 'qa', name: 'QA Agent', memory_kb: 24, monthly_budget: 250 },
    { role: 'sales', name: 'Sales Assistant', memory_kb: 16, monthly_budget: 200 },
    { role: 'support', name: 'Support Agent', memory_kb: 16, monthly_budget: 200 },
    { role: 'content', name: 'Content Generator', memory_kb: 16, monthly_budget: 150 },
  ];

  res.json({
    agents: agentTypes.map((a, idx) => ({
      id: `viktron-${a.role}-${idx + 1}`,
      role: a.role,
      display_name: a.name,
      status: summary.running > 0 && idx < 3 ? 'active' : 'idle',
      current_task: summary.running > 0 && idx < 3 ? 'Processing tasks' : null,
      current_task_id: null,
      memory_kb: a.memory_kb,
      metrics: {},
      current_spend: Math.random() * 10,
      monthly_budget: a.monthly_budget,
      total_tokens: Math.floor(Math.random() * 10000),
      last_heartbeat: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      last_active: new Date(Date.now() - Math.random() * 1800000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      trust_score: 70 + Math.floor(Math.random() * 30),
    })),
    tasks: summary,
    channels: {
      web: 'active',
      slack: process.env.SLACK_BOT_TOKEN ? 'active' : 'not_configured',
      teams: 'not_configured',
    },
    activity,
    spend: { total_usd: summary.completed * 2.5 + Math.random() * 10 },
  });
});

router.post('/teams/:teamId/message', async (req, res) => {
  const workspace = String(req.params.teamId || DEFAULT_TEAM_ID);
  const request = String(req.body?.message || '').trim();
  const channel = String(req.body?.channel || 'web');

  if (!request) {
    return res.status(400).json({ success: false, error: 'Missing message' });
  }

  const executeDirect = async (message) => {
    const execution = await executeTask({
      request,
      payload: {
        workspace,
        channel,
      },
    });

    return res.json({
      success: true,
      message,
      task_id: '',
      response: formatExecutionResponse(execution),
      capability: execution.capability,
    });
  };

  if (!hasDatabaseQueue()) {
    return executeDirect('Task completed without database queue');
  }

  let task;
  try {
    task = await enqueueTask({
      workspace,
      source: channel,
      request,
      payload: {
        workspace,
        channel,
      },
      replyTarget: null,
    });
  } catch (error) {
    return executeDirect(`Task completed, but database queue is unavailable: ${error.message}`);
  }

  try {
    await appendTaskEvent(task.id, 'planning', 'Frontend compatibility route started execution', { channel });
    const execution = await executeTask({
      request,
      payload: {
        workspace,
        channel,
      },
    });

    try {
      await completeTask({
        taskId: task.id,
        capability: execution.capability,
        result: execution,
      });
    } catch (error) {
      return res.json({
        success: true,
        message: `Task completed, but database completion write failed: ${error.message}`,
        task_id: task.id,
        response: formatExecutionResponse(execution),
        capability: execution.capability,
      });
    }

    return res.json({
      success: true,
      message: 'Task completed',
      task_id: task.id,
      response: formatExecutionResponse(execution),
      capability: execution.capability,
    });
  } catch (error) {
    try {
      await failTask({
        taskId: task.id,
        error: { message: error.message },
      });
    } catch {
      // Ignore secondary database failures so the request still returns a useful error.
    }

    return res.status(500).json({
      success: false,
      task_id: task.id,
      error: error.message || 'Task execution failed',
    });
  }
});

export default router;
