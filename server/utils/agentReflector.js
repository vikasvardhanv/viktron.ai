/**
 * Agent Reflector - Autonomous Decision Loop
 *
 * After task execution, the agent observes the result and decides:
 * 1. Is the task complete?
 * 2. If not, what should the next step be?
 * 3. Should I spawn a follow-up task?
 */

import { GoogleGenAI } from '@google/genai';

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
};

const generateReflection = async ({ system, prompt, temperature = 0.3, maxOutputTokens = 500 }) => {
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
 * Reflects on task outcome and decides if more work is needed
 *
 * Returns:
 * {
 *   complete: boolean,
 *   confidence: 0-1,
 *   followup_request: string | null,
 *   reasoning: string,
 *   suggested_capability: string | null
 * }
 */
export const reflectOnOutcome = async ({
  request,
  result,
  capability,
  status,
  workspace = 'default',
}) => {
  // Skip reflection if task failed or isn't completed
  if (status !== 'completed') {
    return {
      complete: false,
      confidence: 0,
      followup_request: null,
      reasoning: 'Task did not complete successfully; no reflection needed.',
      suggested_capability: null,
    };
  }

  // If no AI available, mark as complete
  if (!getClient()) {
    return {
      complete: true,
      confidence: 0.8,
      followup_request: null,
      reasoning: 'No AI configured; marking task complete.',
      suggested_capability: null,
    };
  }

  const reflectionPrompt = `You are an autonomous agent evaluating the outcome of a completed task.

Original Request: ${request}

Capability Used: ${capability}

Task Result:
${typeof result === 'string' ? result : JSON.stringify(result, null, 2)}

Analyze the result and decide:
1. Is the original request fully satisfied by this result?
2. If not, what follow-up work would complete the request?
3. What capability should be used for follow-up (if needed)?

Respond in JSON format:
{
  "complete": boolean,
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of your assessment",
  "followup_request": "Specific follow-up request if needed, or null",
  "suggested_capability": "Suggested capability for follow-up, or null"
}

IMPORTANT: Only suggest follow-up if genuinely needed. Avoid micro-tasks. Max 3 levels of depth.`;

  const systemPrompt = `You are Viktron's reflection engine. Evaluate task outcomes with pragmatism.
If a task is substantially complete (even if not perfect), mark it complete.
Only suggest follow-up for significant gaps that materially impact the original request.
Avoid perfectionism that leads to infinite loops of tiny refinements.`;

  try {
    const reflectionText = await generateReflection({
      system: systemPrompt,
      prompt: reflectionPrompt,
      temperature: 0.2,
      maxOutputTokens: 500,
    });

    if (!reflectionText) {
      return {
        complete: true,
        confidence: 0.5,
        followup_request: null,
        reasoning: 'Reflection failed; marking complete as default.',
        suggested_capability: null,
      };
    }

    // Extract JSON from response
    const jsonMatch = reflectionText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        complete: true,
        confidence: 0.5,
        followup_request: null,
        reasoning: 'Could not parse reflection; marking complete.',
        suggested_capability: null,
      };
    }

    const reflection = JSON.parse(jsonMatch[0]);

    return {
      complete: Boolean(reflection.complete),
      confidence: Number(reflection.confidence) || 0.5,
      followup_request: reflection.followup_request || null,
      reasoning: String(reflection.reasoning) || 'No reasoning provided',
      suggested_capability: reflection.suggested_capability || null,
    };
  } catch (error) {
    // Safe fallback on error
    return {
      complete: true,
      confidence: 0.3,
      followup_request: null,
      reasoning: `Reflection errored: ${error.message}`,
      suggested_capability: null,
    };
  }
};

/**
 * Evaluates if a task has enough depth/breadth to benefit from autonomous reflection
 * Avoids excessive overhead for simple, single-step tasks
 */
export const shouldReflect = ({ capability, depth = 0 }) => {
  // Don't reflect on 2nd+ level child tasks (they're already sub-divided)
  if (depth > 0) return false;

  // Don't reflect on simple capabilities that are inherently atomic
  const atomicCapabilities = [
    'scheduling',          // Scheduling is binary: scheduled or not
    'lead_research',       // Lead scraping returns what it returns
    'form_filling',        // Forms are filled or error
    'shell_workspace',     // Shell output is deterministic
  ];

  if (atomicCapabilities.includes(capability)) {
    return false;
  }

  // Reflect on research, analysis, browser automation (higher-value targets)
  const reflectiveCapabilities = [
    'research_intelligence',
    'analytics_reporting',
    'browser_automation',
    'app_building',
    'ceo_orchestrate',
  ];

  return reflectiveCapabilities.includes(capability);
};
