import crypto from 'crypto';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { getCapabilities } from '../utils/agentExecutor.js';
import { enqueueTask, hasDatabaseQueue, listSkills } from '../utils/taskQueue.js';
import { shouldOrchestrate } from '../utils/ceoAgent.js';
import { getSlackConfig, normalizeSlackMessageText, postSlackMessage } from '../utils/slackClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

const processedEvents = new Map();
const greetedConversations = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60;
const GREETING_INPUTS = new Set(['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening']);

const pruneCache = (cache) => {
  const cutoff = Date.now() - CACHE_TTL_MS;
  for (const [key, timestamp] of cache.entries()) {
    if (timestamp < cutoff) cache.delete(key);
  }
};

const safeCompare = (a, b) => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
};

const verifySlackSignature = (req, signingSecret) => {
  const timestamp = req.get('x-slack-request-timestamp');
  const signature = req.get('x-slack-signature');
  const rawBody = req.rawBody?.toString('utf8') || '';

  if (!timestamp || !signature || !rawBody) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - Number(timestamp)) > 60 * 5) {
    logger.warn('[Slack] rejected request outside timestamp window');
    return false;
  }

  const base = `v0:${timestamp}:${rawBody}`;
  const digest = crypto.createHmac('sha256', signingSecret).update(base).digest('hex');
  const expected = `v0=${digest}`;
  return safeCompare(expected, signature);
};

const stripSlackMentions = (text, botUserId) => {
  if (!text) return '';
  const mentionPattern = botUserId
    ? new RegExp(`<@${botUserId}>`, 'g')
    : /<@[A-Z0-9]+>/g;

  return text
    .replace(mentionPattern, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const shouldIgnoreEvent = (event, botUserId) => {
  if (!event) return true;
  if (event.subtype) return true;
  if (event.bot_id) return true;
  if (botUserId && event.user === botUserId) return true;
  if (event.hidden) return true;
  return false;
};

const isDirectSlackConversation = (event) => event?.channel_type === 'im';

const isGreetingOnly = (text) => GREETING_INPUTS.has((text || '').trim().toLowerCase());

const buildConversationKey = (event) => {
  const threadRoot = event.thread_ts || event.ts || 'no-thread';
  return `${event.channel || 'unknown'}:${threadRoot}:${event.user || 'unknown'}`;
};

const buildChannelKey = (event) => `${event.channel || 'unknown'}:${event.user || 'unknown'}`;

const buildInitialDmIntro = (appName) => {
  return [
    `Hi, I'm ${appName}.`,
    'DM me like a coworker or mention me in a thread.',
    'I can summarize discussions, research options, draft replies, and help move work forward.',
    'Send me the first task when you are ready.',
  ].join('\n');
};

const buildGreetingReply = (appName, isDirectMessage) => {
  if (isDirectMessage) {
    return [
      `Hi, I'm ${appName}.`,
      'Send me the task in plain English and I will handle it here.',
      'What do you want done first?',
    ].join('\n');
  }

  return `Hi, I'm ${appName}. Send me the task and I will handle it in this thread.`;
};

const buildSlackSystemPrompt = (appName) => `
You are ${appName}, an AI coworker that lives in Slack.

Behavior rules:
- Sound like a competent teammate, not a website chatbot.
- Keep replies concise, plain text, and Slack-native.
- In channels, respond to the user's request directly without repeating a generic greeting.
- If the user only says "hi" or "hello", reply briefly, introduce what you can help with, and ask one short follow-up.
- Do not say "welcome to our platform" or "how can we assist you today on this platform".
- Prefer one tight paragraph or a short list when useful.
- If the request is ambiguous, ask one clarifying question.
- If asked to do something operational, explain the next step clearly.
- If asked what you can do, describe yourself as an execution system that completes tasks and list the major capabilities actually exposed by the backend.
- If asked how you work, explain the backend honestly: LLM runtime, Express API, Slack event ingestion, routed task execution, and connected services.

Company context:
- Viktron builds AI agents, automations, chat systems, voice systems, and internal workflow tools.
- Slack should feel like the main operating surface for interacting with Viktron.
`.trim();

const generateAssistantReply = async ({ text, appName }) => {
  if (isGreetingOnly(text)) {
    return buildGreetingReply(appName, true);
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return `I received that in Slack. I can help with workflows, integrations, and operational questions, but the AI response provider is not configured yet.`;
  }

  const client = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
  const response = await client.models.generateContent({
    model: process.env.SLACK_ASSISTANT_MODEL || 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text }] }],
    config: {
      systemInstruction: {
        parts: [{ text: buildSlackSystemPrompt(appName) }],
      },
      temperature: 0.4,
      maxOutputTokens: 300,
    },
  });

  return normalizeSlackMessageText(response.text || '') || `I'm here. What do you need help with?`;
};

router.post('/events', async (req, res) => {
  const { signingSecret, botToken, botUserId, appName } = getSlackConfig();

  if (!signingSecret || !botToken) {
    logger.error('[Slack] missing required environment variables');
    return res.status(500).json({ ok: false, error: 'Slack backend is not configured' });
  }

  if (!verifySlackSignature(req, signingSecret)) {
    return res.status(401).json({ ok: false, error: 'Invalid Slack signature' });
  }

  if (req.body?.type === 'url_verification' && req.body?.challenge) {
    return res.status(200).send(req.body.challenge);
  }

  if (req.body?.type !== 'event_callback') {
    return res.status(200).json({ ok: true, ignored: true });
  }

  const { event, event_id: eventId } = req.body;
  pruneCache(processedEvents);
  pruneCache(greetedConversations);

  if (eventId && processedEvents.has(eventId)) {
    return res.status(200).json({ ok: true, duplicate: true });
  }
  if (eventId) processedEvents.set(eventId, Date.now());

  const shouldHandle = event?.type === 'app_mention' || (event?.type === 'message' && isDirectSlackConversation(event));
  if (!shouldHandle || shouldIgnoreEvent(event, botUserId)) {
    return res.status(200).json({ ok: true, ignored: true });
  }

  const cleanedText = stripSlackMentions(event.text || '', botUserId);
  if (!cleanedText) {
    return res.status(200).json({ ok: true, ignored: true });
  }

  res.status(200).json({ ok: true });

  const conversationKey = buildConversationKey(event);
  const channelKey = buildChannelKey(event);
  const greetingKey = isDirectSlackConversation(event) ? channelKey : conversationKey;
  const hasGreetedConversation = greetedConversations.has(greetingKey);

  try {
    let replyText;

    if (!hasGreetedConversation && isGreetingOnly(cleanedText)) {
      greetedConversations.set(greetingKey, Date.now());
      replyText = isDirectSlackConversation(event)
        ? buildInitialDmIntro(appName)
        : buildGreetingReply(appName, false);
    } else if (/what can you do|what are you|how do you work|core infrastructure|backend/i.test(cleanedText)) {
      const capabilities = getCapabilities();
      replyText = [
        `I'm ${appName}, an AI coworker running on Viktron's backend.`,
        '',
        'Core infrastructure:',
        '- LLM runtime for reasoning and deliverables',
        '- Express backend for task routing and API execution',
        '- Slack event ingestion with mention and DM handling',
        '- Postgres-backed task queue with separate worker process execution',
        '- Connected execution paths for research, lead research, and scheduling',
        '',
        'What I can do right now:',
        ...capabilities.capabilities
          .filter((item) => item.status !== 'planned')
          .map((item) => `- ${item.title}: ${item.description}`),
        '',
        'When you give me a task, I try to complete it and return the result, not just suggest next steps.',
      ].join('\n');
    } else {
      if (hasDatabaseQueue()) {
        // Check if request needs CEO orchestration (complex multi-step task)
        const needsOrchestration = await shouldOrchestrate(cleanedText);

        // Get available skills for task planning
        const skills = await listSkills('default').catch(() => []);

        const task = await enqueueTask({
          workspace: 'default',
          source: 'slack',
          request: cleanedText,
          payload: {
            channel_type: event.channel_type,
            skills: skills.map(s => ({ name: s.key, description: s.description })),
          },
          replyTarget: {
            type: 'slack',
            channel: event.channel,
            thread_ts: event.thread_ts || event.ts,
            user: event.user,
          },
          agentType: needsOrchestration ? 'ceo' : 'general',
          ...(needsOrchestration && { capability: 'ceo_orchestrate' }),
        });

        replyText = needsOrchestration
          ? `🚀 Starting orchestration. Decomposing into specialized tasks and executing in parallel...\n\nTask ID: ${task.id}`
          : `Working on it. I queued that task and will post the result here when it completes.\n\nTask ID: ${task.id}`;
      } else {
        replyText = await generateAssistantReply({ text: cleanedText, appName });
      }
    }

    await postSlackMessage({
      botToken,
      channel: event.channel,
      text: replyText,
      threadTs: event.thread_ts || event.ts,
    });
  } catch (error) {
    logger.error('[Slack] failed to process event', {
      message: error.message,
      channel: event?.channel,
      user: event?.user,
      eventType: event?.type,
    });

    try {
      await postSlackMessage({
        botToken,
        channel: event.channel,
        text: `I hit an internal error handling that Slack message. Please try again in a moment.`,
        threadTs: event.thread_ts || event.ts,
      });
    } catch (postError) {
      logger.error('[Slack] failed to post fallback message', {
        message: postError.message,
      });
    }
  }
});

export default router;
