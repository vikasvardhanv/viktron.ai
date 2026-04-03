const DEFAULT_BROWSER_USE_BASE_URL = 'https://api.browser-use.com/api/v3';
const TERMINAL_STATUSES = new Set(['idle', 'stopped', 'error', 'timed_out', 'finished', 'completed']);

const getBaseUrl = () => (process.env.BROWSER_USE_BASE_URL || DEFAULT_BROWSER_USE_BASE_URL).replace(/\/$/, '');

export const isBrowserUseConfigured = () => Boolean(process.env.BROWSER_USE_API_KEY);

const browserUseFetch = async (path, options = {}) => {
  const apiKey = process.env.BROWSER_USE_API_KEY;
  if (!apiKey) {
    throw new Error('Browser Use is not configured. Set BROWSER_USE_API_KEY to enable browser automation.');
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'X-Browser-Use-API-Key': apiKey,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.detail || data?.error || `Browser Use request failed (${response.status})`);
  }

  return data;
};

const buildBrowserTask = ({ request, payload = {} }) => {
  const lines = [];
  const summary = String(request || '').trim();

  if (summary) {
    lines.push(summary);
  }

  const startUrl = payload.start_url || payload.url || payload.target_url;
  if (startUrl) {
    lines.push(`Start at this URL: ${startUrl}`);
  }

  if (payload.allowed_domains && Array.isArray(payload.allowed_domains) && payload.allowed_domains.length > 0) {
    lines.push(`Restrict navigation to these domains: ${payload.allowed_domains.join(', ')}`);
  }

  if (payload.source_data) {
    lines.push(`Use this source data when filling or entering information:\n${JSON.stringify(payload.source_data, null, 2)}`);
  }

  if (payload.form_fields) {
    lines.push(`Target form fields and expected mapping:\n${JSON.stringify(payload.form_fields, null, 2)}`);
  }

  if (payload.expected_output) {
    lines.push(`Expected output format or acceptance criteria:\n${JSON.stringify(payload.expected_output, null, 2)}`);
  }

  if (payload.instructions) {
    lines.push(String(payload.instructions).trim());
  }

  if (!lines.length) {
    lines.push('Browse the web and complete the requested task.');
  }

  if (payload.capability === 'form_filling' || /form/i.test(summary)) {
    lines.push(
      [
        'This is a form-filling workflow.',
        'Collect any missing values from the provided data or source pages.',
        'Map the values into the form fields carefully.',
        'Verify submission success and return the final confirmation, submitted values, and any blockers.',
      ].join(' ')
    );
  }

  return lines.join('\n\n');
};

const pollSession = async (sessionId, { timeoutMs = 120000, pollMs = 2000 } = {}) => {
  const startedAt = Date.now();
  let session = null;
  let messages = null;

  while (Date.now() - startedAt < timeoutMs) {
    session = await browserUseFetch(`/sessions/${sessionId}`);
    messages = await browserUseFetch(`/sessions/${sessionId}/messages?limit=100`).catch(() => null);

    const status = String(session?.status || '').toLowerCase();
    if (TERMINAL_STATUSES.has(status)) {
      return { session, messages };
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  throw new Error(`Browser Use session ${sessionId} timed out after ${timeoutMs}ms`);
};

export const executeBrowserUseTask = async ({ request, payload = {}, workspace = 'default' }) => {
  if (!isBrowserUseConfigured()) {
    return {
      status: 'needs_configuration',
      result: 'Browser Use is not configured. Set BROWSER_USE_API_KEY and optionally BROWSER_USE_BASE_URL to enable browser automation.',
    };
  }

  const task = buildBrowserTask({ request, payload });
  const body = {
    task,
    model: payload.model || 'bu-mini',
    sessionId: payload.session_id || payload.sessionId || undefined,
    startUrl: payload.start_url || payload.url || payload.target_url || null,
    allowedDomains: Array.isArray(payload.allowed_domains) ? payload.allowed_domains : undefined,
    outputSchema: payload.output_schema || undefined,
    persistMemory: payload.persist_memory ?? true,
    keepAlive: payload.keep_alive ?? false,
    enableRecording: payload.enable_recording ?? false,
    proxyCountryCode: payload.proxy_country_code || 'us',
    browserScreenWidth: payload.browser_screen_width || 1440,
    browserScreenHeight: payload.browser_screen_height || 900,
    flashMode: payload.flash_mode ?? false,
    thinking: payload.thinking ?? true,
    judge: payload.judge ?? true,
    vision: payload.vision ?? true,
    metadata: {
      workspace,
      capability: payload.capability || 'browser_automation',
      source: payload.source || 'viktron',
    },
  };

  const session = await browserUseFetch('/sessions', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const sessionId = session?.id;
  if (!sessionId) {
    return {
      status: 'needs_configuration',
      result: 'Browser Use did not return a session id.',
    };
  }

  const { session: finalSession, messages } = await pollSession(sessionId, {
    timeoutMs: Number(payload.timeout_ms || payload.timeoutMs || 180000),
    pollMs: Number(payload.poll_ms || payload.pollMs || 2000),
  });

  const output = finalSession?.output ?? null;
  const liveUrl = finalSession?.liveUrl || finalSession?.live_url || null;
  const recordingUrl = finalSession?.recordingUrl || finalSession?.recording_url || null;
  const status = String(finalSession?.status || '').toLowerCase();

  return {
    status: status === 'error' ? 'failed' : 'completed',
    result: {
      session_id: sessionId,
      status,
      live_url: liveUrl,
      recording_url: recordingUrl,
      output,
      messages: messages?.messages || [],
    },
  };
};
