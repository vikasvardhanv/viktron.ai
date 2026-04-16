/**
 * Skill Evolution - Self-Learning from Task Outcomes
 *
 * After each task completes (success or failure), analyze the outcome
 * and suggest improvements to the skill/prompt that was used.
 * This enables agents to improve their own capabilities over time.
 */

import { GoogleGenAI } from '@google/genai';
import { upsertSkill } from './stateStore.js';
import { addMemory } from './stateStore.js';
import logger from './logger.js';

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
};

const generateResponse = async ({ system, prompt, temperature = 0.3, maxOutputTokens = 1000 }) => {
  const client = getClient();
  if (!client) return null;

  try {
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
  } catch (error) {
    logger.error('[SkillEvolution] generateResponse failed', { error: error.message });
    return null;
  }
};

/**
 * Analyzes task outcome and generates improvement suggestions
 * Returns: { should_update: bool, updated_content: string | null, pattern: string, confidence: 0-1 }
 */
export const learnFromOutcome = async ({ capability, request, result, status, workspace = 'default', skillContent = null }) => {
  if (!getClient()) {
    return {
      should_update: false,
      updated_content: null,
      pattern: 'no_ai_configured',
      confidence: 0,
    };
  }

  // Only learn from completed tasks
  if (status !== 'completed' && status !== 'failed') {
    return {
      should_update: false,
      updated_content: null,
      pattern: 'not_terminal_state',
      confidence: 0,
    };
  }

  const learningPrompt = `You are an AI coach analyzing task outcomes to improve agent skills.

Task Details:
- Capability: ${capability}
- Status: ${status}
- Request: "${request}"
- Result Length: ${result ? String(result).length : 0} chars

${skillContent ? `Current Skill Content:\n${skillContent}\n` : ''}

Based on this ${status} task outcome, answer:
1. Should the skill/prompt for "${capability}" be improved? (yes/no)
2. If yes, what specific pattern or insight did this task reveal?
3. What 1-2 sentence improvement would make the agent more effective for similar requests?

Format your response as JSON:
{
  "should_update": boolean,
  "pattern": "brief pattern name",
  "improvement_suggestion": "1-2 sentence improvement"
}`;

  try {
    const response = await generateResponse({
      system: `You are an expert at analyzing task outcomes and improving AI agent prompts.
Your goal: extract learning patterns and suggest prompt improvements that generalize to similar future tasks.
Output ONLY valid JSON, no markdown or extra text.`,
      prompt: learningPrompt,
      temperature: 0.2,
      maxOutputTokens: 500,
    });

    if (!response) {
      return {
        should_update: false,
        updated_content: null,
        pattern: 'no_response',
        confidence: 0,
      };
    }

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        should_update: false,
        updated_content: null,
        pattern: 'parse_error',
        confidence: 0,
      };
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // If should_update is true, generate improved skill content
    let updatedContent = null;
    if (analysis.should_update && skillContent) {
      const improvementPrompt = `You are improving an AI agent skill prompt based on real task outcome analysis.

Current Skill Prompt:
${skillContent}

Improvement to apply:
${analysis.improvement_suggestion}

Task Status: ${status}
Capability: ${capability}

Generate an improved version of the skill prompt that incorporates this learning while maintaining the original structure and tone.
Output ONLY the improved prompt, no preamble or explanation.`;

      updatedContent = await generateResponse({
        system: `You are an expert at improving AI agent prompts based on task outcome analysis.
Your improvements should be specific, actionable, and maintain the original prompt's intent and structure.
Output ONLY the improved prompt, no explanation.`,
        prompt: improvementPrompt,
        temperature: 0.1,
        maxOutputTokens: 800,
      });
    }

    return {
      should_update: Boolean(analysis.should_update),
      updated_content: updatedContent,
      pattern: analysis.pattern || 'unknown',
      confidence: status === 'completed' ? 0.8 : 0.6,
      improvement_suggestion: analysis.improvement_suggestion || null,
    };
  } catch (error) {
    logger.error('[SkillEvolution] learnFromOutcome failed', { error: error.message });
    return {
      should_update: false,
      updated_content: null,
      pattern: 'error',
      confidence: 0,
    };
  }
};

/**
 * Saves evolved skill with version bump and previous content tracking
 * Returns: { id, workspace, key, version, updated_at, previous_version }
 */
export const evolveSkill = async ({ workspace = 'default', key, updatedContent, pattern = null, metadata = {} }) => {
  if (!key || !updatedContent) {
    return null;
  }

  try {
    const evolved = await upsertSkill({
      workspace,
      key,
      name: key,
      description: `Evolved from pattern: ${pattern}`,
      content: updatedContent,
      enabled: true,
      source: 'ai_learning',
    });

    // Store learning event in memories
    await addMemory({
      workspace,
      source: 'ai_learning',
      content: `Evolved skill "${key}" based on pattern "${pattern}"`,
      tags: ['learned', key, 'skill_evolution'],
      metadata: {
        pattern,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    }).catch((err) => {
      logger.warn('[SkillEvolution] failed to store learning memory', { error: err.message });
    });

    logger.info('[SkillEvolution] skill evolved', {
      workspace,
      key,
      pattern,
    });

    return evolved;
  } catch (error) {
    logger.error('[SkillEvolution] evolveSkill failed', {
      key,
      error: error.message,
    });
    return null;
  }
};

/**
 * Records outcome analysis in memories for future reflection
 */
export const recordOutcomeAnalysis = async ({
  workspace = 'default',
  taskId,
  capability,
  request,
  status,
  learningPattern,
  confidence,
}) => {
  try {
    await addMemory({
      workspace,
      source: 'outcome_analysis',
      content: `Task ${taskId} (${capability}): ${status} - Pattern: ${learningPattern}`,
      tags: ['outcome', capability, status, learningPattern],
      metadata: {
        taskId,
        capability,
        confidence,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.warn('[SkillEvolution] failed to record outcome analysis', { error: error.message });
  }
};
