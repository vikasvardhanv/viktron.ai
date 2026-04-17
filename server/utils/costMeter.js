import crypto from 'crypto';
import { query } from '../config/database.js';
import logger from './logger.js';

// Gemini pricing as of April 2026
// https://ai.google.dev/pricing
const PRICING = {
  'gemini-2.5-flash': {
    input: 0.075 / 1_000_000,   // $0.075 per 1M input tokens
    output: 0.30 / 1_000_000,   // $0.30 per 1M output tokens
  },
  'gemini-2.5-pro': {
    input: 1.25 / 1_000_000,    // $1.25 per 1M input tokens
    output: 10.0 / 1_000_000,   // $10.00 per 1M output tokens
  },
};

/**
 * Calculate cost for an LLM call
 * @param {string} model - Model name (e.g., 'gemini-2.5-flash')
 * @param {number} tokensInput - Input token count
 * @param {number} tokensOutput - Output token count
 * @returns {number} Cost in USD
 */
export const calculateCost = (model, tokensInput, tokensOutput) => {
  const pricing = PRICING[model] || PRICING['gemini-2.5-flash'];
  const inputCost = (tokensInput || 0) * pricing.input;
  const outputCost = (tokensOutput || 0) * pricing.output;
  return inputCost + outputCost;
};

/**
 * Record an LLM API call and update task costs
 * @param {object} params
 * @param {string} params.taskId - Task ID that made the call
 * @param {string} params.workspace - Workspace ID
 * @param {string} params.agentType - Agent type ('ceo', 'sales', 'research', etc.)
 * @param {string} params.model - Model name
 * @param {number} params.tokensInput - Input tokens
 * @param {number} params.tokensOutput - Output tokens
 * @param {number} params.latencyMs - Latency in milliseconds
 * @param {string} params.purpose - Purpose of the call ('think', 'reflect', 'decompose', 'execute', etc.)
 */
export const recordLLMCall = async ({
  taskId,
  workspace,
  agentType,
  model,
  tokensInput = 0,
  tokensOutput = 0,
  latencyMs,
  purpose = 'execute',
}) => {
  if (!taskId || !workspace || !model) {
    logger.warn('[CostMeter] Missing required fields for LLM call recording', {
      taskId, workspace, model,
    });
    return;
  }

  const costUsd = calculateCost(model, tokensInput, tokensOutput);
  const eventId = crypto.randomUUID();

  try {
    // Insert cost event
    await query(
      `INSERT INTO agent_cost_events (id, task_id, workspace, agent_type, model, tokens_input, tokens_output, cost_usd, latency_ms, call_purpose)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [eventId, taskId, workspace, agentType || null, model, tokensInput, tokensOutput, costUsd, latencyMs || null, purpose]
    );

    // Update task aggregates
    await query(
      `UPDATE agent_tasks
       SET total_tokens_input = total_tokens_input + $1,
           total_tokens_output = total_tokens_output + $2,
           total_cost_usd = total_cost_usd + $3,
           llm_calls = llm_calls + 1,
           updated_at = NOW()
       WHERE id = $4`,
      [tokensInput, tokensOutput, costUsd, taskId]
    );

    logger.debug('[CostMeter] LLM call recorded', {
      taskId, model, tokensInput, tokensOutput, costUsd, purpose,
    });
  } catch (error) {
    logger.error('[CostMeter] Failed to record LLM call', {
      error: error.message, taskId, model,
    });
  }
};

/**
 * Get total cost for a task
 * @param {string} taskId - Task ID
 * @returns {Promise<{tokens_input: number, tokens_output: number, cost_usd: number, llm_calls: number}>}
 */
export const getTaskCosts = async (taskId) => {
  if (!taskId) return null;

  try {
    const result = await query(
      `SELECT total_tokens_input, total_tokens_output, total_cost_usd, llm_calls FROM agent_tasks WHERE id = $1`,
      [taskId]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      tokens_input: row.total_tokens_input || 0,
      tokens_output: row.total_tokens_output || 0,
      cost_usd: parseFloat(row.total_cost_usd || 0),
      llm_calls: row.llm_calls || 0,
    };
  } catch (error) {
    logger.error('[CostMeter] Failed to get task costs', { error: error.message, taskId });
    return null;
  }
};

/**
 * Get total workspace costs (for the current month)
 * @param {string} workspace - Workspace ID
 * @param {Date} sinceDate - Start date (default: start of current month)
 * @returns {Promise<{total_cost_usd: number, total_tokens: number, llm_calls: number, by_model: object}>}
 */
export const getWorkspaceCosts = async (workspace, sinceDate = null) => {
  if (!workspace) return null;

  try {
    // Default to start of current month
    const startDate = sinceDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const result = await query(
      `SELECT
         SUM(cost_usd)::NUMERIC as total_cost_usd,
         SUM(tokens_input + tokens_output) as total_tokens,
         COUNT(*) as llm_calls,
         model,
         COUNT(*) FILTER (WHERE model = $2) as flash_calls,
         SUM(cost_usd) FILTER (WHERE model = $2)::NUMERIC as flash_cost,
         COUNT(*) FILTER (WHERE model = $3) as pro_calls,
         SUM(cost_usd) FILTER (WHERE model = $3)::NUMERIC as pro_cost
       FROM agent_cost_events
       WHERE workspace = $1 AND created_at >= $4
       GROUP BY model`,
      [workspace, 'gemini-2.5-flash', 'gemini-2.5-pro', startDate.toISOString()]
    );

    if (result.rows.length === 0) {
      return {
        total_cost_usd: 0,
        total_tokens: 0,
        llm_calls: 0,
        by_model: {},
      };
    }

    // Aggregate across all models
    let totalCost = 0;
    let totalTokens = 0;
    let totalCalls = 0;
    const byModel = {};

    for (const row of result.rows) {
      totalCost += parseFloat(row.total_cost_usd || 0);
      totalTokens += parseInt(row.total_tokens || 0);
      totalCalls += parseInt(row.llm_calls || 0);
      byModel[row.model] = {
        calls: parseInt(row.llm_calls || 0),
        cost_usd: parseFloat(row.total_cost_usd || 0),
      };
    }

    return {
      total_cost_usd: totalCost,
      total_tokens: totalTokens,
      llm_calls: totalCalls,
      by_model: byModel,
    };
  } catch (error) {
    logger.error('[CostMeter] Failed to get workspace costs', {
      error: error.message, workspace,
    });
    return null;
  }
};

/**
 * Get costs by agent type for a workspace
 * @param {string} workspace - Workspace ID
 * @returns {Promise<object>}
 */
export const getCostsByAgent = async (workspace) => {
  if (!workspace) return null;

  try {
    const result = await query(
      `SELECT
         agent_type,
         COUNT(*) as llm_calls,
         SUM(tokens_input) as total_tokens_input,
         SUM(tokens_output) as total_tokens_output,
         SUM(cost_usd)::NUMERIC as total_cost_usd
       FROM agent_cost_events
       WHERE workspace = $1
       GROUP BY agent_type
       ORDER BY total_cost_usd DESC`,
      [workspace]
    );

    const byAgent = {};
    for (const row of result.rows) {
      byAgent[row.agent_type || 'unknown'] = {
        llm_calls: parseInt(row.llm_calls || 0),
        tokens_input: parseInt(row.total_tokens_input || 0),
        tokens_output: parseInt(row.total_tokens_output || 0),
        cost_usd: parseFloat(row.total_cost_usd || 0),
      };
    }

    return byAgent;
  } catch (error) {
    logger.error('[CostMeter] Failed to get costs by agent', {
      error: error.message, workspace,
    });
    return null;
  }
};
