const SLACK_API_BASE = 'https://slack.com/api';

const TRANSCRIPT_HEADER_RE = /^[^\n\[]+?\s+\[\d{1,2}:\d{2}\s?(?:AM|PM)\]\s*$/i;
const TIMESTAMP_PREFIX_RE = /^\[\d{1,2}:\d{2}\s?(?:AM|PM)\]\s*/i;
const PURE_TIMESTAMP_LINE_RE = /^\[\d{1,2}:\d{2}\s?(?:AM|PM)\]\s*$/i;

const normalizeLineForDedupe = (line) => line
  .toLowerCase()
  .replace(/your (company|business|workspace)'?s? (?:software needs|needs)/g, '')
  .replace(/how can i assist you today\??/g, 'assist-today')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

export const normalizeSlackMessageText = (text) => {
  const raw = String(text || '').replace(/\r/g, '').trim();
  if (!raw) return '';

  const cleanedLines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !TRANSCRIPT_HEADER_RE.test(line))
    .map((line) => line.replace(TIMESTAMP_PREFIX_RE, '').trim())
    .filter((line) => line && !PURE_TIMESTAMP_LINE_RE.test(line));

  const dedupedLines = [];
  const seen = new Set();

  for (const line of cleanedLines) {
    const key = normalizeLineForDedupe(line);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    dedupedLines.push(line);
  }

  return dedupedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
};

export const getSlackConfig = () => ({
  botToken: process.env.SLACK_BOT_TOKEN || '',
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  botUserId: process.env.SLACK_BOT_USER_ID || '',
  appName: process.env.SLACK_APP_NAME || 'Viktron',
});

export const postSlackMessage = async ({ botToken, channel, text, threadTs }) => {
  const normalizedText = normalizeSlackMessageText(text);
  const response = await fetch(`${SLACK_API_BASE}/chat.postMessage`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${botToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      channel,
      text: normalizedText,
      thread_ts: threadTs,
      unfurl_links: false,
      unfurl_media: false,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Slack API error (${response.status})`);
  }

  return payload;
};
