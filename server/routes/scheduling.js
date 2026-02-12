import express from 'express';

const router = express.Router();

const SCHEDULING_ENDPOINT = 'https://techmehash--scheduling-messaging-agent-schedule-appointment.modal.run';
const AVAILABILITY_ENDPOINT = 'https://techmehash--scheduling-messaging-agent-check-availability.modal.run';
// No direct health endpoint provided in new list, so comment out or update as needed
// const HEALTH_CHECK_ENDPOINT = 'https://techmehash--scheduling-messaging-agent-health.modal.run';
const HEALTH_CHECK_ENDPOINT = undefined; // Update if new health endpoint is available

// Response cache to deduplicate identical requests
const responseCache = new Map();
const CACHE_DURATION = 2000; // 2 seconds

// Per-IP request rate limiting (1 request per 1 second per IP)
const ipRequestTimestamps = new Map();
const RATE_LIMIT_WINDOW = 1000; // 1 second per request

/**
 * Get client IP address
 */
function getClientIp(req) {
  return req.ip || req.connection.remoteAddress || 'unknown';
}

/**
 * Check if IP is rate limited
 */
function isRateLimited(ip) {
  const now = Date.now();
  const lastRequest = ipRequestTimestamps.get(ip) || 0;
  const timeSinceLastRequest = now - lastRequest;
  
  if (timeSinceLastRequest < RATE_LIMIT_WINDOW) {
    return true;
  }
  
  ipRequestTimestamps.set(ip, now);
  return false;
}

/**
 * Forward response to client with proper formatting
 */
const forwardResponse = async (res, status, text, contentType) => {
  res.status(status);

  if (contentType.includes('application/json')) {
    try {
      res.json(JSON.parse(text));
      return;
    } catch {
      // Fall through to text response
    }
  }

  res.type(contentType || 'text/plain').send(text);
};

router.post('/availability', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    
    // Check per-IP rate limiting
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: 'Please wait before making another request.',
        retryAfter: 1,
      });
    }

    // Create a cache key from request body
    const cacheKey = `availability:${JSON.stringify(req.body)}`;

    // Check cache first
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return forwardResponse(res, cached.status, JSON.stringify(cached.data), 'application/json');
    }

    // Make request to Modal
    const upstreamResponse = await fetch(AVAILABILITY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const text = await upstreamResponse.text();

    // Cache successful responses
    if (upstreamResponse.ok && contentType.includes('application/json')) {
      try {
        const data = JSON.parse(text);
        responseCache.set(cacheKey, {
          data,
          status: upstreamResponse.status,
          timestamp: Date.now(),
        });
      } catch (e) {
        // Ignore cache errors
      }
    }

    await forwardResponse(res, upstreamResponse.status, text, contentType);
  } catch (error) {
    console.error('Availability proxy error:', error);
    res.status(502).json({
      success: false,
      error: 'Availability proxy failed',
      message: error?.message || 'Failed to reach availability service',
    });
  }
});

router.post('/schedule', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    
    // Check per-IP rate limiting
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: 'Please wait before making another request.',
        retryAfter: 1,
      });
    }

    const upstreamResponse = await fetch(SCHEDULING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const text = await upstreamResponse.text();

    await forwardResponse(res, upstreamResponse.status, text, contentType);
  } catch (error) {
    console.error('Scheduling proxy error:', error);
    res.status(502).json({
      success: false,
      error: 'Scheduling proxy failed',
      message: error?.message || 'Failed to reach scheduling service',
    });
  }
});

router.get('/health', async (_req, res) => {
  try {
    const upstreamResponse = await fetch(HEALTH_CHECK_ENDPOINT, {
      method: 'GET',
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const text = await upstreamResponse.text();

    await forwardResponse(res, upstreamResponse.status, text, contentType);
  } catch (error) {
    console.error('Health proxy error:', error);
    res.status(502).json({
      success: false,
      error: 'Health proxy failed',
      message: error?.message || 'Failed to reach health service',
    });
  }
});

export default router;
