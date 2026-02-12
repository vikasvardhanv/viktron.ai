import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// Default Modal endpoint (can be overridden in Coolify env vars)
const DEFAULT_DEMO_API = 'https://techmehash--one-click-demo-agent-fastapi-app.modal.run';

const resolveDemoEndpoint = () => {
  const configured = process.env.DEMO_AGENT_API_URL || process.env.DEMO_API_URL;
  const base = (configured && configured.trim()) || DEFAULT_DEMO_API;

  // Allow either a base URL or a full /create-demo URL.
  if (base.includes('/create-demo')) return base;
  return `${base.replace(/\/$/, '')}/create-demo`;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isModalStoppedMessage = (bodyText) => {
  if (!bodyText || typeof bodyText !== 'string') return false;
  return bodyText.toLowerCase().includes('app for invoked web endpoint is stopped');
};

const fetchWithRetries = async ({ endpoint, payload }) => {
  const maxAttempts = Math.max(1, Number(process.env.DEMO_PROXY_MAX_ATTEMPTS || 4));
  const retryDelayMs = Math.max(0, Number(process.env.DEMO_PROXY_RETRY_DELAY_MS || 1500));
  const timeoutMs = Math.max(1000, Number(process.env.DEMO_PROXY_TIMEOUT_MS || 15000));

  let last = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload || {}),
        signal: controller.signal,
      });

      const text = await response.text();

      // Modal sometimes returns a 404 text body while the app is cold/stopped.
      if (response.status === 404 && isModalStoppedMessage(text)) {
        last = { response, text, json: null, reason: 'stopped' };
        if (attempt < maxAttempts) await sleep(retryDelayMs);
        continue;
      }

      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      return { response, text, json };
    } catch (error) {
      last = { error };
      if (attempt < maxAttempts) await sleep(retryDelayMs);
    } finally {
      clearTimeout(timeout);
    }
  }

  return { response: last?.response || null, text: last?.text || '', json: last?.json || null, error: last?.error || null, exhausted: true, reason: last?.reason };
};

router.post('/create-demo', async (req, res) => {
  try {
    const endpoint = resolveDemoEndpoint();

    logger.info('[Demos] create-demo proxy request');

    const { response, text, json, exhausted, reason } = await fetchWithRetries({
      endpoint,
      payload: req.body || {},
    });

    if (exhausted && reason === 'stopped') {
      logger.error('[Demos] upstream is stopped/cold after retries');
      return res.status(503).json({
        success: false,
        error: 'Demo service is starting up. Please retry in a few seconds.',
      });
    }

    if (!response) {
      logger.error('[Demos] upstream request failed (no response)');
      return res.status(502).json({
        success: false,
        error: 'Could not reach demo service',
      });
    }

    if (!json || typeof json !== 'object') {
      logger.error(`[Demos] upstream returned non-JSON (status ${response.status})`);
      return res.status(502).json({
        success: false,
        error: 'Demo service returned an invalid response',
      });
    }

    if (!response.ok) {
      logger.error(`[Demos] upstream error ${response.status}: ${text?.slice(0, 300)}`);
      return res.status(502).json({
        success: false,
        error: json?.error || `Upstream demo service error (${response.status})`,
      });
    }

    return res.json(json);
  } catch (error) {
    logger.error(`[Demos] proxy failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to create demo. Please try again.',
    });
  }
});

export default router;
