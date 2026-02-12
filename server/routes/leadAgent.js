import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();
const BASE_URL = 'https://techmehash--lead-agent-api.modal.run';

const forwardRequest = async (path, req, res) => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    const contentType = response.headers.get('content-type') || '';
    const raw = await response.text();

    if (contentType.includes('application/json')) {
      try {
        const data = raw ? JSON.parse(raw) : {};
        return res.status(response.status).json(data);
      } catch (error) {
        logger.error(`Lead Agent proxy JSON parse failed for ${path}`, { error: error.message });
        return res.status(response.status).send(raw);
      }
    }

    return res.status(response.status).send(raw);
  } catch (error) {
    logger.error(`Lead Agent proxy error for ${path}`, { error: error.message });
    return res.status(502).json({
      success: false,
      message: 'Lead Agent proxy error',
      error: error.message,
    });
  }
};

router.post('/scrape', (req, res) => forwardRequest('/scrape', req, res));
router.post('/email', (req, res) => forwardRequest('/email', req, res));
router.post('/clean', (req, res) => forwardRequest('/clean', req, res));

export default router;
