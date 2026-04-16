/**
 * CEO Agent - Request Decomposition & Task Orchestration
 *
 * The CEO Agent determines whether a request needs decomposition into sub-tasks
 * or can be handled directly. If decomposition is needed, it creates subtasks
 * with appropriate agent type assignments.
 */

import { GoogleGenAI } from '@google/genai';
import { getAgentProfile, AGENT_PROFILES } from './agentRegistry.js';

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
};

const generateResponse = async ({ system, prompt, temperature = 0.3, maxOutputTokens = 1500 }) => {
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

/**
 * Determines if a request is complex enough to benefit from decomposition
 */
export const shouldOrchestrate = async (request) => {
  // Quick heuristics: if request mentions multiple domains or has complex keywords
  const complexKeywords = [
    'and',
    'research',
    'analyze',
    'compare',
    'plan',
    'strategy',
    'report',
    'coordinate',
    'schedule',
    'email',
    'draft',
    'list',
    'summary',
  ];

  const hasComplexity = complexKeywords.some((kw) => request.toLowerCase().includes(kw));

  // If short and simple, don't orchestrate
  if (request.length < 50) return false;

  // If no AI, don't orchestrate
  if (!getClient()) return false;

  // Use LLM to decide
  if (hasComplexity) {
    const decisionPrompt = `Given this user request, is it complex enough to benefit from multi-step orchestration?
Consider: Does it require multiple specialized tasks? Are there sequential or parallel sub-tasks?

Request: "${request}"

Respond with just "yes" or "no".`;

    const decision = await generateResponse({
      system: 'You are a request complexity analyzer. Respond with only "yes" or "no".',
      prompt: decisionPrompt,
      temperature: 0.1,
      maxOutputTokens: 10,
    });

    return decision?.toLowerCase().startsWith('yes');
  }

  return false;
};

/**
 * Decomposes a complex request into ordered subtasks
 * Returns: { subtasks: [...], synthesis_prompt: string, complexity: string }
 */
export const decomposeRequest = async ({ request, workspace = 'default', skills = [] }) => {
  if (!getClient()) {
    // Fallback: direct execution without decomposition
    return {
      subtasks: [
        {
          request,
          agent_type: 'general',
          parallel: false,
          rationale: 'No AI configured; executing directly',
        },
      ],
      synthesis_prompt: 'Return the result as-is',
      complexity: 'simple',
      fallback: true,
    };
  }

  const skillSummary = skills.length > 0 ? `Available skills: ${skills.map((s) => s.name).join(', ')}` : 'No skills available';

  const decompositionPrompt = `You are the CEO agent decomposing a complex user request into subtasks.

User Request: "${request}"

${skillSummary}

Analyze this request and create 1-5 subtasks. Assign each to the best agent:
- sales: for lead research, prospecting, scheduling
- support: for customer issues, troubleshooting, help
- content: for writing, publishing, marketing materials
- research: for analysis, market research, competitive intelligence
- general: for other tasks

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "objective": "The core goal",
  "complexity": "simple|moderate|complex",
  "subtasks": [
    {
      "request": "Specific, self-contained request",
      "agent_type": "sales|support|content|research|general",
      "parallel": true or false,
      "rationale": "Why this assignment"
    }
  ],
  "synthesis_prompt": "How to combine results into final answer"
}`;

  const ceoPrompt = AGENT_PROFILES.ceo.systemPrompt;

  try {
    const response = await generateResponse({
      system: ceoPrompt,
      prompt: decompositionPrompt,
      temperature: 0.2,
      maxOutputTokens: 1500,
    });

    if (!response) {
      // Fallback on error
      return {
        subtasks: [
          {
            request,
            agent_type: 'general',
            parallel: false,
            rationale: 'Decomposition failed; executing directly',
          },
        ],
        synthesis_prompt: 'Return the result as-is',
        complexity: 'simple',
        fallback: true,
      };
    }

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        subtasks: [
          {
            request,
            agent_type: 'general',
            parallel: false,
            rationale: 'Could not parse decomposition; executing directly',
          },
        ],
        synthesis_prompt: 'Return the result as-is',
        complexity: 'simple',
        fallback: true,
      };
    }

    const decomposition = JSON.parse(jsonMatch[0]);

    // Validate subtasks
    if (!Array.isArray(decomposition.subtasks) || decomposition.subtasks.length === 0) {
      throw new Error('No subtasks in decomposition');
    }

    return {
      objective: decomposition.objective || request,
      subtasks: decomposition.subtasks.map((st) => ({
        request: String(st.request),
        agent_type: String(st.agent_type || 'general'),
        parallel: Boolean(st.parallel),
        rationale: String(st.rationale || 'N/A'),
      })),
      synthesis_prompt: String(decomposition.synthesis_prompt || 'Summarize all results'),
      complexity: decomposition.complexity || 'moderate',
    };
  } catch (error) {
    console.error('[CEO] Decomposition error:', error.message);

    // Safe fallback
    return {
      subtasks: [
        {
          request,
          agent_type: 'general',
          parallel: false,
          rationale: 'Decomposition error; executing directly',
        },
      ],
      synthesis_prompt: 'Return the result as-is',
      complexity: 'simple',
      fallback: true,
    };
  }
};

/**
 * Aggregates results from multiple subtasks into a coherent final answer
 */
export const aggregateResults = async ({ originalRequest, results, synthesisPrompt }) => {
  if (!getClient()) {
    // Simple concatenation fallback
    return {
      summary: results.map((r) => `[${r.agent_type}]\n${JSON.stringify(r.result)}`).join('\n\n'),
      confidence: 0.3,
    };
  }

  const resultsSummary = results
    .map((r) => `[${r.agent_type || 'general'} agent result]\n${String(r.result).slice(0, 500)}`)
    .join('\n\n---\n\n');

  const aggregationPrompt = `You are the CEO agent synthesizing subtask results into a final, coherent answer.

Original Request: "${originalRequest}"

Synthesis Instructions: "${synthesisPrompt}"

Subtask Results:
${resultsSummary}

Create a clear, actionable final response that addresses the original request using all the subtask results.
Be concise, well-organized, and focus on what matters to the user.`;

  try {
    const response = await generateResponse({
      system: `You are Viktron's CEO agent. Synthesize subtask results into a clear, actionable final answer.
Be concise, well-organized, and directly address the user's original request.
Use results from all subtasks intelligently.`,
      prompt: aggregationPrompt,
      temperature: 0.2,
      maxOutputTokens: 1200,
    });

    return {
      summary: response || 'Could not aggregate results',
      confidence: response ? 0.8 : 0.2,
    };
  } catch (error) {
    console.error('[CEO] Aggregation error:', error.message);

    return {
      summary: resultsSummary,
      confidence: 0.4,
      error: error.message,
    };
  }
};
