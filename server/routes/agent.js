import express from 'express';
import { executeTask, getCapabilities } from '../utils/agentExecutor.js';
import { syncLocalSkillsToStore } from '../utils/skillLoader.js';
import { triggerSchedulerTick } from '../utils/schedulerService.js';
import { addMemory, createSchedule, listMemories, listSchedules, listSkills, listTaskRuns, listTools, searchMemories, upsertSkill, upsertTool } from '../utils/stateStore.js';
import { enqueueTask, getTask, hasDatabaseQueue, listTaskEvents, listTasks, listDeadLetterTasks, manuallyRetryTask, getTaskMetrics } from '../utils/taskQueue.js';
import { ensureWorkspace, getWorkspacePaths } from '../utils/workspaceManager.js';
import logger from '../utils/logger.js';

const router = express.Router();

const buildInfrastructureOverview = async () => {
  await ensureWorkspace('default');
  const workspacePaths = getWorkspacePaths('default');
  return ({
  identity: {
    name: process.env.SLACK_APP_NAME || 'Viktron',
    category: 'autonomous AI coworker',
    interaction_surfaces: ['Slack', 'HTTP API'],
  },
  core_infrastructure: {
    llm_runtime: {
      provider: 'Google GenAI',
      model: process.env.AGENT_EXECUTOR_MODEL || process.env.SLACK_ASSISTANT_MODEL || 'gemini-2.5-flash',
      configured: Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY),
    },
    backend: {
      framework: 'Express',
      runtime: 'Node.js',
      execution_mode: 'complete_the_task',
    },
    workspace_runtime: {
      model: 'persistent per-workspace filesystem on backend worker',
      root: workspacePaths.root,
      work_dir: workspacePaths.workDir,
      repos_dir: workspacePaths.reposDir,
      logs_dir: workspacePaths.logsDir,
      shell: '/bin/bash',
    },
    channels: {
      slack_events: '/api/channels/slack/events',
      api_execute: '/api/agent/execute',
    },
    connected_services: [
      'lead scraping modal service',
      'scheduling modal service',
      'browser runtime automation',
      'Twilio SMS',
    ],
    memory_and_state: {
      current_state: 'persistent file-backed memory, tools, skills, schedules, and task runs',
      next_step: 'database-backed retrieval, semantic indexing, and cross-workspace auth boundaries',
    },
    orchestration: {
      current_state: 'LightAgent-style planner, memory, tool routing, and capability-based task execution',
      next_step: 'ephemeral per-task containers, pluggable browser runtime, code executor, and tool auth vault',
    },
  },
});
};

router.get('/overview', (_req, res) => {
  buildInfrastructureOverview().then((overview) => res.json({
    success: true,
    overview,
    capabilities: getCapabilities(),
  })).catch((error) => res.status(500).json({ success: false, error: error.message }));
});

router.get('/capabilities', (_req, res) => {
  res.json({
    success: true,
    ...getCapabilities(),
  });
});

router.get('/skills', async (req, res) => {
  const workspace = String(req.query.workspace || 'default');
  await syncLocalSkillsToStore(workspace);
  const skills = await listSkills(workspace);
  res.json({
    success: true,
    workspace,
    skills,
  });
});

router.get('/runtime', async (req, res) => {
  const workspace = String(req.query.workspace || 'default');
  await ensureWorkspace(workspace);
  const paths = getWorkspacePaths(workspace);
  res.json({
    success: true,
    workspace,
    runtime: {
      root: paths.root,
      work_dir: paths.workDir,
      repos_dir: paths.reposDir,
      downloads_dir: paths.downloadsDir,
      logs_dir: paths.logsDir,
      shell: '/bin/bash',
      queue_mode: hasDatabaseQueue() ? 'postgres-worker' : 'direct-only',
    },
  });
});

router.post('/shell', async (req, res) => {
  const internalToken = process.env.VIKTRON_INTERNAL_API_TOKEN || '';
  if (!internalToken || req.get('x-viktron-internal-token') !== internalToken) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  const script = String(req.body?.script || req.body?.command || '').trim();
  if (!script) {
    return res.status(400).json({ success: false, error: 'Missing script' });
  }

  const workspace = String(req.body?.workspace || 'default');
  const payload = {
    capability: 'shell_workspace',
    workspace,
    script,
    cwd: req.body?.cwd || 'work',
    env: req.body?.env || {},
    timeout_ms: req.body?.timeout_ms,
  };

  if (req.body?.async === true) {
    if (!hasDatabaseQueue()) {
      return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL for async execution' });
    }

    const task = await enqueueTask({
      workspace,
      source: 'internal-shell',
      request: `Run shell task in workspace ${workspace}`,
      payload,
      replyTarget: null,
    });

    return res.status(202).json({ success: true, queued: true, task });
  }

  const result = await executeTask({
    request: `Run shell task in workspace ${workspace}`,
    payload,
  });

  return res.json({ success: true, ...result });
});

router.post('/skills', async (req, res) => {
  const key = String(req.body?.key || '').trim();
  const name = String(req.body?.name || '').trim();
  const content = String(req.body?.content || '').trim();

  if (!key || !name || !content) {
    return res.status(400).json({ success: false, error: 'Missing skill key, name, or content' });
  }

  const skill = await upsertSkill({
    workspace: req.body?.workspace || 'default',
    key,
    name,
    description: req.body?.description || '',
    content,
    enabled: req.body?.enabled ?? true,
    source: req.body?.source || 'api',
  });

  return res.json({ success: true, skill });
});

router.post('/skills/sync', async (req, res) => {
  const workspace = String(req.body?.workspace || 'default');
  const imported = await syncLocalSkillsToStore(workspace);
  const skills = await listSkills(workspace);
  return res.json({
    success: true,
    workspace,
    imported,
    skills,
  });
});

router.get('/memory', async (req, res) => {
  const workspace = String(req.query.workspace || 'default');
  const query = String(req.query.query || '');
  const memories = query
    ? await searchMemories({ workspace, query, limit: 20 })
    : await listMemories(workspace);

  res.json({
    success: true,
    workspace,
    memories,
  });
});

router.post('/memory', async (req, res) => {
  const content = String(req.body?.content || '').trim();
  if (!content) {
    return res.status(400).json({ success: false, error: 'Missing content' });
  }

  const memory = await addMemory({
    workspace: req.body?.workspace || 'default',
    source: req.body?.source || 'api',
    content,
    tags: Array.isArray(req.body?.tags) ? req.body.tags : [],
    metadata: req.body?.metadata || {},
  });

  return res.json({ success: true, memory });
});

router.get('/tools', async (req, res) => {
  const workspace = String(req.query.workspace || 'default');
  const tools = await listTools(workspace);
  res.json({
    success: true,
    workspace,
    tools,
  });
});

router.post('/tools', async (req, res) => {
  const key = String(req.body?.key || '').trim();
  const name = String(req.body?.name || '').trim();

  if (!key || !name) {
    return res.status(400).json({ success: false, error: 'Missing tool key or name' });
  }

  const tool = await upsertTool({
    workspace: req.body?.workspace || 'default',
    key,
    name,
    category: req.body?.category || 'general',
    status: req.body?.status || 'connected',
    description: req.body?.description || '',
    config: req.body?.config || {},
  });

  return res.json({ success: true, tool });
});

router.get('/schedules', async (req, res) => {
  const workspace = String(req.query.workspace || 'default');
  const schedules = await listSchedules(workspace);
  res.json({
    success: true,
    workspace,
    schedules,
  });
});

router.post('/schedules', async (req, res) => {
  const title = String(req.body?.title || '').trim();
  const prompt = String(req.body?.prompt || '').trim();

  if (!title || !prompt) {
    return res.status(400).json({ success: false, error: 'Missing title or prompt' });
  }

  const nextRunAt = req.body?.next_run_at || new Date(Date.now() + 60 * 1000).toISOString();
  const schedule = await createSchedule({
    workspace: req.body?.workspace || 'default',
    title,
    cadence: req.body?.cadence || 'daily',
    prompt,
    capability: req.body?.capability || 'research_intelligence',
    payload: req.body?.payload || {},
    next_run_at: nextRunAt,
    delivery: req.body?.delivery || { channel: 'api' },
    active: req.body?.active ?? true,
  });

  return res.json({ success: true, schedule });
});

router.post('/schedules/run', async (_req, res) => {
  await triggerSchedulerTick();
  return res.json({ success: true, message: 'Scheduler tick completed' });
});

router.get('/runs', async (req, res) => {
  const workspace = String(req.query.workspace || 'default');
  const runs = await listTaskRuns(workspace);
  res.json({
    success: true,
    workspace,
    runs,
  });
});

router.get('/tasks', async (req, res) => {
  if (!hasDatabaseQueue()) {
    return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL' });
  }

  const workspace = String(req.query.workspace || 'default');
  const tasks = await listTasks({ workspace, limit: Number(req.query.limit || 50) });
  res.json({ success: true, workspace, tasks });
});

router.get('/tasks/:id', async (req, res) => {
  if (!hasDatabaseQueue()) {
    return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL' });
  }

  const task = await getTask(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  const events = await listTaskEvents(req.params.id);
  return res.json({ success: true, task, events });
});

router.get('/tasks/:id/stream', async (req, res) => {
  if (!hasDatabaseQueue()) {
    return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendSnapshot = async () => {
    const task = await getTask(req.params.id);
    const events = task ? await listTaskEvents(req.params.id) : [];
    res.write(`data: ${JSON.stringify({ task, events })}\n\n`);
    if (!task || task.status === 'completed' || task.status === 'failed') {
      clearInterval(interval);
      res.end();
    }
  };

  const interval = setInterval(() => {
    void sendSnapshot();
  }, 2000);

  req.on('close', () => {
    clearInterval(interval);
  });

  await sendSnapshot();
});

router.post('/tasks', async (req, res) => {
  if (!hasDatabaseQueue()) {
    return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL' });
  }

  const request = String(req.body?.request || '').trim();
  if (!request) {
    return res.status(400).json({ success: false, error: 'Missing request' });
  }

  const task = await enqueueTask({
    workspace: req.body?.workspace || 'default',
    source: req.body?.source || 'api',
    request,
    payload: req.body?.payload || {},
    replyTarget: req.body?.reply_target || null,
  });

  return res.status(202).json({
    success: true,
    task,
  });
});

router.post('/execute', async (req, res) => {
  try {
    const request = String(req.body?.request || '').trim();
    const payload = req.body?.payload || {};

    if (!request && !payload.query) {
      return res.status(400).json({
        success: false,
        error: 'Missing request',
      });
    }

    if (req.body?.async === true) {
      if (!hasDatabaseQueue()) {
        return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL for async execution' });
      }

      const task = await enqueueTask({
        workspace: req.body?.workspace || payload.workspace || 'default',
        source: req.body?.source || 'api',
        request,
        payload,
        replyTarget: req.body?.reply_target || null,
      });

      return res.status(202).json({
        success: true,
        queued: true,
        task,
      });
    }

    const result = await executeTask({ request, payload });
    return res.json({
      success: true,
      request,
      ...result,
    });
  } catch (error) {
    logger.error('[Agent] execute failed', {
      message: error.message,
    });
    return res.status(500).json({
      success: false,
      error: error.message || 'Task execution failed',
    });
  }
});

// ==========================================
// Phase 4: Dead Letter Queue & Metrics
// ==========================================

router.get('/metrics', async (req, res) => {
  if (!hasDatabaseQueue()) {
    return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL' });
  }

  const workspace = String(req.query.workspace || 'default');
  const metrics = await getTaskMetrics(workspace);
  res.json({ success: true, workspace, metrics });
});

router.get('/dead-letter', async (req, res) => {
  if (!hasDatabaseQueue()) {
    return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL' });
  }

  const workspace = String(req.query.workspace || 'default');
  const limit = Number(req.query.limit || 50);
  const tasks = await listDeadLetterTasks(workspace, limit);
  res.json({ success: true, workspace, tasks });
});

router.post('/tasks/:id/retry', async (req, res) => {
  if (!hasDatabaseQueue()) {
    return res.status(503).json({ success: false, error: 'Task queue requires DATABASE_URL' });
  }

  const task = await manuallyRetryTask(req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  return res.json({ success: true, task, message: 'Task queued for retry' });
});

export default router;
