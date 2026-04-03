import { listMemories, listTools, addMemory } from './stateStore.js';

const scoreSignals = (request = '', payload = {}) => {
  const lower = String(request || '').toLowerCase();

  return {
    browser: Number(
      /browser|website|web form|form fill|form_filling|login|navigate|click|scrape|screenshot|browse the web/.test(lower) ||
      payload.form_fields ||
      payload.source_data ||
      payload.start_url ||
      payload.url ||
      payload.target_url
    ),
    research: Number(
      /research|compare|market|pricing|competitor|report|analytics|dashboard|find companies|lead|prospect/.test(lower)
    ),
    shell: Number(
      /code|script|bash|terminal|repo|branch|pull request|test|debug|engineering|build app/.test(lower)
    ),
    scheduling: Number(
      /schedule|book|appointment|calendar|availability/.test(lower) || payload.schedule_request || payload.start_time
    ),
  };
};

const buildCandidates = ({ request, payload = {}, browserConfigured = false }) => {
  const signals = scoreSignals(request, payload);

  return [
    {
      id: 'browser_first',
      route: 'browser',
      capability: signals.browser ? 'browser_automation' : 'research_intelligence',
      score: signals.browser + Number(browserConfigured),
      reason: 'Use a browser runtime for website interaction, scraping, login flows, screenshots, or form filling.',
    },
    {
      id: 'api_first',
      route: 'api',
      capability: signals.scheduling ? 'scheduling' : signals.research ? 'research_intelligence' : 'analytics_reporting',
      score: signals.scheduling + signals.research + Number(!signals.browser),
      reason: 'Prefer API, modal service, or direct backend tools when the task is mostly data or workflow driven.',
    },
    {
      id: 'workspace_first',
      route: 'workspace',
      capability: signals.shell ? 'shell_workspace' : 'engineering',
      score: signals.shell + Number(payload.workspace_mode === 'workspace'),
      reason: 'Use the Linux workspace for scripts, code, repo work, and deterministic automation.',
    },
  ].sort((a, b) => b.score - a.score);
};

export const LIGHTAGENT_ARCHITECTURE = {
  planner: 'Intent detection, decomposition, and route selection',
  memory: 'Persistent workspace memory with retrieval and writeback',
  tools: 'Tool registry and capability-aware routing',
  reflection: 'Branch generation and score-based selection',
  collaborators: ['planner', 'researcher', 'browser operator', 'executor', 'critic'],
  browser_runtime: 'Pluggable browser runtime owned by Viktron',
};

export const buildOrchestrationPlan = async ({ request, payload = {}, workspace = 'default', browserConfigured = false }) => {
  const [memories, tools] = await Promise.all([
    listMemories(workspace),
    listTools(workspace),
  ]);

  const candidatePlans = buildCandidates({ request, payload, browserConfigured });
  const selectedPlan = candidatePlans[0];

  return {
    architecture: LIGHTAGENT_ARCHITECTURE,
    workspace,
    memory_hits: memories.slice(0, 5),
    tools,
    candidates: candidatePlans,
    selected: selectedPlan,
  };
};

export const recordOrchestrationMemory = async ({ workspace = 'default', request, selected, result, status }) => {
  const summary = [
    `Request: ${request}`,
    `Selected route: ${selected?.route || 'unknown'}`,
    `Selected capability: ${selected?.capability || 'unknown'}`,
    `Status: ${status || 'unknown'}`,
    result ? `Result: ${typeof result === 'string' ? result : JSON.stringify(result).slice(0, 2000)}` : null,
  ].filter(Boolean).join('\n');

  return addMemory({
    workspace,
    source: 'orchestration',
    content: summary,
    tags: ['orchestration', selected?.route || 'unknown', selected?.capability || 'unknown'],
    metadata: {
      selected,
      status,
    },
  });
};
