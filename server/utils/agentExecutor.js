import { GoogleGenAI } from '@google/genai';
import { addTaskRun, listSkills, listTools, searchMemories, upsertSkill } from './stateStore.js';
import { syncLocalSkillsToStore } from './skillLoader.js';
import { ensureWorkspace, getWorkspacePaths } from './workspaceManager.js';
import { executeBrowserRuntimeTask, isBrowserRuntimeConfigured } from './browserRuntime.js';
import { buildOrchestrationPlan, recordOrchestrationMemory } from './orchestrationEngine.js';
import { runBashInWorkspace } from './workspaceExecutor.js';
import { reflectOnOutcome, shouldReflect } from './agentReflector.js';
import { decomposeRequest, aggregateResults } from './ceoAgent.js';
import { enqueueTask, getChildTasks, getChildrenStatus } from './taskQueue.js';
import { learnFromOutcome, evolveSkill, recordOutcomeAnalysis } from './skillEvolution.js';

const LEAD_AGENT_BASE = 'https://techmehash--lead-agent-api.modal.run';
const SCHEDULING_ENDPOINT = 'https://techmehash--scheduling-messaging-agent-schedule-appointment.modal.run';
const AVAILABILITY_ENDPOINT = 'https://techmehash--scheduling-messaging-agent-check-availability.modal.run';

export const CAPABILITIES = [
  {
    id: 'ceo_orchestrate',
    title: 'CEO Orchestration',
    status: 'available',
    description: 'Intelligently decompose complex requests into parallel sub-tasks, coordinate execution, and synthesize results.',
  },
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
    id: 'form_filling',
    title: 'Form filling',
    status: 'available',
    description: 'Discover, map, and submit web or PDF forms using browser automation and source data.',
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
    status: 'available',
    description: 'Automate browser workflows, scraping, screenshots, and website interactions through Browser Use.',
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
  if (payload.form_fields || payload.source_data || /form|fill out|fill in|submit form|pdf form|web form/.test(lower)) return 'form_filling';
  if (/browser|screenshot|scrape website|navigate|website|login|click through|website interaction|browse the web/.test(lower)) return 'browser_automation';
  return 'research_intelligence';
};

const buildBrowserResearchRequest = (request, payload = {}, thinkingSummary = '') => {
  const lines = [
    'Use a real browser to research the request on the public web.',
    'Open the most relevant sources, gather current facts, and return concise findings with any URLs or evidence that matter.',
  ];

  if (request) {
    lines.unshift(String(request).trim());
  }

  if (payload.allowed_domains && Array.isArray(payload.allowed_domains) && payload.allowed_domains.length > 0) {
    lines.push(`Prefer these domains when they are relevant: ${payload.allowed_domains.join(', ')}`);
  }

  if (thinkingSummary) {
    lines.push(`Planning summary:\n${thinkingSummary}`);
  }

  return lines.join('\n\n');
};

const executeBrowserAutomationTask = async ({ request, payload = {}, workspace }) => {
  if (!isBrowserRuntimeConfigured()) {
    return {
      status: 'needs_configuration',
      result: 'Browser Use is not configured. Set BROWSER_USE_API_KEY to enable browser automation and form filling.',
    };
  }

  return executeBrowserRuntimeTask({
    request,
    payload: {
      ...payload,
      capability: payload.capability || 'browser_automation',
    },
    workspace,
  });
};

const executeFormFillingTask = async ({ request, payload = {}, workspace }) => {
  const formRequest = [
    request,
    payload.source_data ? `Source data:\n${JSON.stringify(payload.source_data, null, 2)}` : '',
    payload.form_fields ? `Target fields:\n${JSON.stringify(payload.form_fields, null, 2)}` : '',
    payload.expected_output ? `Expected output:\n${JSON.stringify(payload.expected_output, null, 2)}` : '',
    'Complete the form carefully, verify the submission, and report the confirmation details plus any blockers.',
  ]
    .filter(Boolean)
    .join('\n\n');

  return executeBrowserAutomationTask({
    request: formRequest,
    payload: {
      ...payload,
      capability: 'form_filling',
    },
    workspace,
  });
};

const executeWebFirstResearchTask = async ({ request, payload = {}, workspace, thinkingSummary = '' }) => {
  if (!isBrowserRuntimeConfigured() || payload.web_first === false) {
    return completeResearchTask(request, workspace, thinkingSummary);
  }

  const browserResult = await executeBrowserRuntimeTask({
    request: buildBrowserResearchRequest(request, payload, thinkingSummary),
    payload: {
      ...payload,
      capability: 'web_research',
      keep_alive: payload.keep_alive ?? false,
      enable_recording: payload.enable_recording ?? false,
      persist_memory: payload.persist_memory ?? true,
    },
    workspace,
  });

  if (browserResult.status !== 'completed') {
    const fallback = await completeResearchTask(request, workspace, thinkingSummary);
    return {
      ...fallback,
      browser_fallback: browserResult.result,
    };
  }

  const browserSummary = JSON.stringify(browserResult.result, null, 2);
  const synthesized = await generateText({
    system: `You are Viktron's execution engine. Use browser findings to answer the user's request with current, grounded information. Keep it concise and practical. If the browser output already answers the question, return that answer without adding fluff.`,
    prompt: `${request}\n\nBrowser findings:\n${browserSummary}`,
    temperature: 0.2,
    maxOutputTokens: 900,
  });

  return {
    status: synthesized ? 'completed' : browserResult.status,
    result: synthesized || browserResult.result,
  };
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
  const orchestration = await buildOrchestrationPlan({
    request,
    payload,
    workspace,
    browserConfigured: isBrowserRuntimeConfigured(),
  });
  const capability = payload.capability || orchestration.selected.capability || inferCapability(request, payload);
  const thinking = await thinkTask({ request, workspace });
  let outcome;

  switch (capability) {
    case 'ceo_orchestrate': {
      // Phase 2: CEO Agent Orchestration
      const currentSkills = await listSkills(workspace);
      const decomposition = await decomposeRequest({
        request,
        workspace,
        skills: currentSkills,
      });

      // Enqueue child tasks
      const childTaskIds = [];
      for (const subtask of decomposition.subtasks) {
        const childTask = await enqueueTask({
          workspace,
          source: 'ceo',
          request: subtask.request,
          payload: { ...payload, agent_type: subtask.agent_type },
          parentTaskId: payload._currentTaskId || null, // Will be set by caller
          depth: (payload.depth || 0) + 1,
          agentType: subtask.agent_type,
        });
        childTaskIds.push({ taskId: childTask.id, agent_type: subtask.agent_type });
      }

      // Wait for all children to complete (with timeout)
      const MAX_WAIT_MS = 5 * 60 * 1000; // 5 minutes max wait
      const START_TIME = Date.now();
      let allDone = false;
      let childResults = [];

      while (!allDone && Date.now() - START_TIME < MAX_WAIT_MS) {
        const status = await getChildrenStatus(payload._currentTaskId);

        if (status.total > 0 && status.completed + status.failed === status.total) {
          allDone = true;
          childResults = await getChildTasks(payload._currentTaskId);
          break;
        }

        if (status.failed > 0) {
          // Early exit if children failed
          break;
        }

        // Wait a bit before checking again
        await new Promise((r) => setTimeout(r, 2000));
      }

      // Aggregate results
      const aggregation = await aggregateResults({
        originalRequest: request,
        results: childResults.map((ct) => ({
          agent_type: ct.agent_type,
          result: ct.result,
        })),
        synthesisPrompt: decomposition.synthesis_prompt,
      });

      outcome = {
        capability: 'ceo_orchestrate',
        status: 'completed',
        result: {
          summary: aggregation.summary,
          child_tasks: childTaskIds.length,
          decomposition_complexity: decomposition.complexity,
          synthesis_confidence: aggregation.confidence,
        },
      };
      break;
    }

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
      outcome = {
        capability,
        ...(await executeWebFirstResearchTask({ request, payload, workspace, thinkingSummary: thinking.summary })),
      };
      break;
    case 'research_intelligence':
      outcome = {
        capability,
        ...(await executeWebFirstResearchTask({ request, payload, workspace, thinkingSummary: thinking.summary })),
      };
      break;
    case 'form_filling':
      outcome = {
        capability,
        ...(await executeFormFillingTask({ request, payload, workspace })),
      };
      break;
    case 'proactive_automation':
    case 'scheduled_tasks':
    case 'app_building':
    case 'engineering':
    case 'browser_automation':
      outcome = {
        capability,
        ...(await executeBrowserAutomationTask({ request, payload, workspace })),
      };
      break;
    default:
      outcome = {
        capability,
        ...(await completeResearchTask(request, workspace, thinking.summary)),
      };
      break;
  }

  await recordOrchestrationMemory({
    workspace,
    request,
    selected: {
      ...orchestration.selected,
      capability,
    },
    result: outcome.result,
    status: outcome.status,
  });

  await addTaskRun({
    workspace,
    request,
    capability: outcome.capability,
    status: outcome.status,
    result: outcome.result,
  });

  // ==========================================
  // Phase 1: Autonomous Reflection & Follow-up
  // ==========================================
  let reflection = null;
  let followupTaskId = null;

  if (shouldReflect({ capability, depth: payload.depth || 0 })) {
    reflection = await reflectOnOutcome({
      request,
      result: outcome.result,
      capability,
      status: outcome.status,
      workspace,
    });

    // If reflection suggests follow-up and we haven't exceeded depth limit
    if (
      reflection &&
      !reflection.complete &&
      reflection.followup_request &&
      (payload.depth || 0) < 3
    ) {
      // For now, just record the follow-up suggestion
      // The CEO agent in Phase 2 will handle automatic follow-up spawning
      // In Phase 1, this is captured for observability
    }
  }

  // ==========================================
  // Phase 3: Self-Learning from Outcomes
  // ==========================================
  let learningOutcome = null;
  try {
    // Analyze task outcome to extract learning patterns
    learningOutcome = await learnFromOutcome({
      capability,
      request,
      result: outcome.result,
      status: outcome.status,
      workspace,
    });

    // If learning suggests skill improvement, evolve it
    if (learningOutcome && learningOutcome.should_update && learningOutcome.updated_content) {
      await evolveSkill({
        workspace,
        key: capability,
        updatedContent: learningOutcome.updated_content,
        pattern: learningOutcome.pattern,
        metadata: {
          taskId: payload.taskId,
          request: request.substring(0, 200),
          previousStatus: outcome.status,
        },
      });
    }

    // Record the learning event for future analysis
    await recordOutcomeAnalysis({
      workspace,
      taskId: payload.taskId || 'unknown',
      capability,
      request: request.substring(0, 200),
      status: outcome.status,
      learningPattern: learningOutcome?.pattern || 'unknown',
      confidence: learningOutcome?.confidence || 0,
    }).catch(() => {
      // Silently fail if recording analysis fails
    });
  } catch (learningError) {
    // Log but don't fail task execution due to learning errors
    console.error('[ExecuteTask] skill evolution error:', learningError.message);
  }

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
    orchestration: {
      architecture: orchestration.architecture,
      selected: orchestration.selected,
      candidates: orchestration.candidates,
      memory_hits: orchestration.memory_hits,
    },
    reflection: reflection || null,
    learning: learningOutcome ? {
      pattern: learningOutcome.pattern,
      should_update: learningOutcome.should_update,
      confidence: learningOutcome.confidence,
      improvement_suggestion: learningOutcome.improvement_suggestion,
    } : null,
  };
};

export const getCapabilities = () => ({
  product: 'Viktron',
  execution_mode: 'complete_the_task',
  has_ai: hasAi(),
  capabilities: CAPABILITIES,
});
