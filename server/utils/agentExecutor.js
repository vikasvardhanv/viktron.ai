import { GoogleGenAI } from '@google/genai';
import { addTaskRun, listSkills, listTools, searchMemories, upsertSkill } from './stateStore.js';
import { syncLocalSkillsToStore } from './skillLoader.js';
import { ensureWorkspace, getWorkspacePaths } from './workspaceManager.js';
import { runBashInWorkspace } from './workspaceExecutor.js';

const LEAD_AGENT_BASE = 'https://techmehash--lead-agent-api.modal.run';
const SCHEDULING_ENDPOINT = 'https://techmehash--scheduling-messaging-agent-schedule-appointment.modal.run';
const AVAILABILITY_ENDPOINT = 'https://techmehash--scheduling-messaging-agent-check-availability.modal.run';

export const CAPABILITIES = [
  {
    id: 'analytics_reporting',
    title: 'Analytics & reporting',
    status: 'available',
    description: 'Summarize business questions, compare data points, and produce concise reports and action items.',
  },
  {
    id: 'proactive_automation',
    title: 'Proactive automation',
    status: 'scaffolded',
    description: 'Define recurring automation suggestions and convert approved patterns into repeatable workflows.',
  },
  {
    id: 'scheduled_tasks',
    title: 'Scheduled tasks',
    status: 'scaffolded',
    description: 'Represent recurring jobs, delivery cadences, and scheduled execution metadata.',
  },
  {
    id: 'research_intelligence',
    title: 'Research & intelligence',
    status: 'available',
    description: 'Produce research briefs, comparisons, market summaries, and decision-ready recommendations.',
  },
  {
    id: 'lead_research',
    title: 'Lead research',
    status: 'available',
    description: 'Scrape leads for a business query and location, then return structured results.',
  },
  {
    id: 'scheduling',
    title: 'Scheduling',
    status: 'available',
    description: 'Check availability and schedule appointments through the connected scheduling service.',
  },
  {
    id: 'app_building',
    title: 'App building',
    status: 'planned',
    description: 'Generate app specifications, delivery plans, and implementation scopes for internal tools and dashboards.',
  },
  {
    id: 'engineering',
    title: 'Code & engineering',
    status: 'scaffolded',
    description: 'Repository-aware code execution, testing, branch creation, and pull request workflows.',
  },
  {
    id: 'browser_automation',
    title: 'Browser automation',
    status: 'planned',
    description: 'Automate browser workflows, form filling, scraping, and screenshots once the browser executor is connected.',
  },
  {
    id: 'shell_workspace',
    title: 'Linux workspace',
    status: 'available',
    description: 'Run shell scripts in a persistent per-workspace filesystem on the backend worker.',
  },
];

const BUILTIN_SKILLS = [
  {
    key: 'human-thinking',
    name: 'Human Thinking',
    description: 'Question, contextualize, compare options, predict outcomes, then execute.',
    source: 'builtin',
    content: [
      'Use a 5-phase cognitive loop before significant actions:',
      '1. Question: restate the ask, identify the real goal, assumptions, and missing info.',
      '2. Context: identify stakeholders, constraints, and prior context.',
      '3. Alternatives: consider obvious, contrarian, creative, and do-nothing paths.',
      '4. Predict: estimate best case, worst case, likely outcome, and blind spots.',
      '5. Execute: commit to the best path with success criteria and checkpoints.',
      'For critical or irreversible actions, favor caution and explicit checkpoints.',
    ].join('\n'),
  },
];

const hasAi = () => Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY);

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
};

const ensureBuiltinSkills = async (workspace = 'default') => {
  await syncLocalSkillsToStore(workspace);
  for (const skill of BUILTIN_SKILLS) {
    await upsertSkill({
      workspace,
      ...skill,
      enabled: true,
    });
  }
};

const generateText = async ({ system, prompt, temperature = 0.3, maxOutputTokens = 700 }) => {
  const client = getClient();
  if (!client) return null;

  const response = await client.models.generateContent({
    model: process.env.AGENT_EXECUTOR_MODEL || process.env.SLACK_ASSISTANT_MODEL || 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: {
        parts: [{ text: system }],
      },
      temperature,
      maxOutputTokens,
    },
  });

  return (response.text || '').trim() || null;
};

const fallbackHumanThink = (request) => ({
  question: {
    what: request,
    why: 'Complete the user request with a concrete deliverable.',
    assumptions: ['The user wants execution, not generic advice.', 'Existing tools should be used when available.'],
    missing: [],
  },
  context: {
    stakeholders: ['requesting user', 'Viktron backend'],
    constraints: ['Use only currently connected capabilities', 'Avoid claiming unsupported actions'],
  },
  alternatives: [
    'Directly execute with available tools',
    'Ask for clarification before acting',
    'Return a scoped plan if execution is not yet possible',
  ],
  predict: {
    best_case: 'Task is completed with a useful result.',
    worst_case: 'Task is overscoped for current capabilities.',
    likely_case: 'A partial but concrete result is delivered now.',
  },
  execute: {
    decision: 'Use available tools first, then augment with AI reasoning.',
    success_criteria: 'Return a usable result or a precise limitation.',
  },
});

const thinkTask = async ({ request, workspace = 'default' }) => {
  await ensureBuiltinSkills(workspace);
  const skills = (await listSkills(workspace)).filter((item) => item.enabled);
  const activeSkillText = skills.map((skill) => `[${skill.name}]\n${skill.content}`).join('\n\n');

  const text = await generateText({
    system: `You are Viktron's planning layer. Think before acting. Use enabled skills to produce a concise execution brief in JSON-like text with these sections: question, context, alternatives, predict, execute. Do not be verbose.\n\nEnabled skills:\n${activeSkillText || 'none'}`,
    prompt: request,
    temperature: 0.2,
    maxOutputTokens: 800,
  });

  return {
    skills,
    summary: text || JSON.stringify(fallbackHumanThink(request), null, 2),
  };
};

const inferCapability = (request, payload = {}) => {
  const lower = (request || '').toLowerCase();

  if (payload.query && payload.location) return 'lead_research';
  if (payload.schedule_request || payload.start_time || /schedule|book|appointment|availability|calendar/.test(lower)) return 'scheduling';
  if (/lead|prospect|scrape|list companies|find companies/.test(lower)) return 'lead_research';
  if (/report|dashboard|metric|revenue|analytics|performance/.test(lower)) return 'analytics_reporting';
  if (/research|compare|competitor|market|pricing|analy(s|z)e/.test(lower)) return 'research_intelligence';
  if (/automate|automation|recurring|daily|weekly|monthly/.test(lower)) return 'proactive_automation';
  if (/build app|dashboard app|internal tool|web app|calculator/.test(lower)) return 'app_building';
  if (/code|repo|repository|pull request|pr|branch|test suite|engineering/.test(lower)) return 'engineering';
  if (/browser|form|screenshot|scrape website|navigate/.test(lower)) return 'browser_automation';
  return 'research_intelligence';
};

const completeResearchTask = async (request, workspace = 'default', thinkingSummary = '') => {
  const memories = await searchMemories({ workspace, query: request, limit: 5 });
  const tools = await listTools(workspace);
  const connectedTools = tools.map((tool) => `${tool.name} (${tool.key})`).join(', ') || 'none';
  const memorySummary = memories.map((memory) => `- ${memory.content}`).join('\n') || '- none';
  const text = await generateText({
    system: `You are Viktron's execution engine. Think like an operator, not a chatbot. Complete the user's task, not just chat.

Response rules:
- Be dynamic and specific to the request. Do not use canned greetings or reusable filler.
- Lead with the answer or deliverable, not scene-setting.
- Vary structure based on the task. Use a tight paragraph for simple asks and a short list only when it improves clarity.
- If the request is research or analysis, produce:
1. direct answer
2. key findings
3. recommended next action
- If the request is ambiguous, make the minimum reasonable assumption and state it in one short sentence.
- Sound like someone doing the work with ownership. No hype, no platform language, no generic encouragement.
- Keep it plain text and decision-ready.

Use available workspace context when relevant.
Connected tools: ${connectedTools}
Relevant memories:
${memorySummary}
Thinking summary:
${thinkingSummary || 'none'}`,
    prompt: request,
    temperature: 0.2,
    maxOutputTokens: 900,
  });

  return {
    status: text ? 'completed' : 'needs_configuration',
    result: text || 'AI research execution is not configured yet. Set GEMINI_API_KEY to enable research deliverables.',
  };
};

const executeLeadResearch = async (payload) => {
  const response = await fetch(`${LEAD_AGENT_BASE}/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: payload.query,
      location: payload.location,
      radius: payload.radius ?? 5000,
      limit: payload.limit ?? 20,
    }),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `Lead research failed (${response.status})`);
  }

  return {
    status: 'completed',
    result: {
      count: data?.leads?.length || 0,
      leads: data?.leads || [],
      sheet_url: data?.sheet_url || null,
    },
  };
};

const executeSchedulingTask = async (request, payload) => {
  const isAvailability = payload.mode === 'availability' || /availability|available|open slots/.test((request || '').toLowerCase());
  const endpoint = isAvailability ? AVAILABILITY_ENDPOINT : SCHEDULING_ENDPOINT;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `Scheduling failed (${response.status})`);
  }

  return {
    status: 'completed',
    result: data || text,
  };
};

const executeShellTask = async ({ workspace = 'default', payload = {} }) => {
  const script = String(payload.script || payload.command || '').trim();
  if (!script) {
    throw new Error('Shell execution requires payload.script or payload.command');
  }

  const result = await runBashInWorkspace({
    workspace,
    script,
    cwd: payload.cwd || 'work',
    timeoutMs: Number(payload.timeout_ms || payload.timeoutMs || 120000),
    env: payload.env || {},
  });

  return {
    status: result.exit_code === 0 ? 'completed' : 'failed',
    result: {
      run_id: result.run_id,
      cwd: result.cwd,
      exit_code: result.exit_code,
      stdout: result.stdout,
      stderr: result.stderr,
      log_file: result.log_file,
    },
  };
};

const buildPlannedCapabilityResponse = (capability, request) => ({
  status: 'planned',
  result: `Capability "${capability}" is not fully wired yet. Viktron captured the request and can return an execution plan now.\n\nRequest: ${request}`,
});

export const executeTask = async ({ request, payload = {} }) => {
  const workspace = payload.workspace || 'default';
  await ensureWorkspace(workspace);
  const workspacePaths = getWorkspacePaths(workspace);
  const capability = payload.capability || inferCapability(request, payload);
  const thinking = await thinkTask({ request, workspace });
  let outcome;

  switch (capability) {
    case 'shell_workspace':
      outcome = {
        capability,
        ...(await executeShellTask({ workspace, payload })),
      };
      break;
    case 'lead_research':
      outcome = {
        capability,
        ...(await executeLeadResearch(payload)),
      };
      break;
    case 'scheduling':
      outcome = {
        capability,
        ...(await executeSchedulingTask(request, payload)),
      };
      break;
    case 'analytics_reporting':
    case 'research_intelligence':
      outcome = {
        capability,
        ...(await completeResearchTask(request, workspace, thinking.summary)),
      };
      break;
    case 'proactive_automation':
    case 'scheduled_tasks':
    case 'app_building':
    case 'engineering':
    case 'browser_automation':
      outcome = {
        capability,
        ...buildPlannedCapabilityResponse(capability, request),
      };
      break;
    default:
      outcome = {
        capability,
        ...(await completeResearchTask(request, workspace, thinking.summary)),
      };
      break;
  }

  await addTaskRun({
    workspace,
    request,
    capability: outcome.capability,
    status: outcome.status,
    result: outcome.result,
  });

  return {
    ...outcome,
    workspace: {
      name: workspace,
      root: workspacePaths.root,
      work_dir: workspacePaths.workDir,
      repos_dir: workspacePaths.reposDir,
      logs_dir: workspacePaths.logsDir,
    },
    thinking: {
      skills_used: thinking.skills.map((skill) => skill.key),
      summary: thinking.summary,
    },
  };
};

export const getCapabilities = () => ({
  product: 'Viktron',
  execution_mode: 'complete_the_task',
  has_ai: hasAi(),
  capabilities: CAPABILITIES,
});
