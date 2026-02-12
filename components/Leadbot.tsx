import React, { useRef, useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const API_ROOT = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const LEAD_AGENT_URL = (import.meta.env.VITE_LEAD_AGENT_API_URL || '').replace(/\/$/, '');
const API_BASE_URL = LEAD_AGENT_URL || `${API_ROOT}/lead-agent`;
const DEFAULT_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1xSsV00b69t8jJD69ZhEoZf28cha13TPODYK1n9eHrZs/edit?pli=1&gid=0#gid=0';
const HIGHSHIFT_TEMPLATE = `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<p>Hi,</p>
<p>I noticed {{business_name}} online and wanted to reach out.</p>
<p>At Viktron.ai, we work with businesses in your industry to streamline operations using AI automation - things like handling customer inquiries, managing bookings, and follow-ups.</p>
<p>If you're curious how this might help {{business_name}}, I'd be happy to walk you through it in 15 minutes.</p>
<p>Would that be worth a quick conversation?</p>
<p>Here's my calendar if you'd like to pick a time:<br>
<a href="https://viktron.ai/contact">https://viktron.ai/contact</a></p>
<p>Best,<br>
<strong>Viktron.ai Team</strong><br>
<a href="mailto:info@viktron.ai">info@viktron.ai</a></p>
</body>
</html>`;

type LeadbotMode = 'widget' | 'page';
type IntentAction =
  | 'scrape'
  | 'send'
  | 'preview'
  | 'open_rates'
  | 'follow_up'
  | 'clean'
  | 'help'
  | 'unknown';
type PostScrapeAction = 'none' | 'preview' | 'send';
type BatchMeta = {
  remainingAfter: number;
  total: number;
  isFinalBatch: boolean;
  autoRun: boolean;
};

type BatchPlan = {
  search: string;
  total: number;
  remaining: number;
  batchSize: number;
  postAction: PostScrapeAction;
  autoRun: boolean;
};

interface LeadbotIntent {
  action: IntentAction;
  search?: string;
}

interface LeadbotProps {
  mode?: LeadbotMode;
  className?: string;
}

const initialMessages = [
  {
    sender: 'bot',
    text: `Hi! I'm LeadBot, your lead generation assistant.\n\nI can find leads from Google Maps, Yelp, or Nextdoor, enrich data, clean sheets, and send outreach with tracking and follow-ups.\n\nTell me the business type and location (city, zip, or county). Example: "Roofers in Chicago". For all businesses, use "All businesses in <location>".\n\nI'll keep appending new leads to your default Google Sheet unless you paste a different URL.`
  }
];

const MAX_BATCH_SIZE = 50;
const AUTO_BATCH_DELAY_MS = 2000;

export const Leadbot: React.FC<LeadbotProps> = ({ mode = 'widget', className }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'discovery' | 'confirm-send' | 'done'>('discovery');
  const [sheetUrl, setSheetUrl] = useState<string | null>(DEFAULT_SHEET_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [industryInput, setIndustryInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [limitInput, setLimitInput] = useState(20);
  const [confirmSend, setConfirmSend] = useState(false);
  const [formError, setFormError] = useState('');
  const [batchPlan, setBatchPlan] = useState<BatchPlan | null>(null);
  const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBusy = isLoading || isThinking;

  const extractSheetUrl = (text: string) => {
    const match = text.match(/https?:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+[^\s]*/);
    return match ? match[0] : null;
  };

  const normalizeSearchQuery = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return trimmed;
    let normalized = trimmed.replace(/\ball\s+business(es)?\b/gi, 'businesses');
    normalized = normalized.replace(/\bbusinesses?\s+in\s+all\b/gi, 'businesses in');
    if (/^businesses\s+/i.test(normalized) && !/\bin\b/i.test(normalized)) {
      normalized = normalized.replace(/^businesses\s+/i, 'businesses in ');
    }
    return normalized;
  };

  const summarizeHtmlError = (text: string) => {
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) return titleMatch[1].trim();
    if (/error code 524|524: a timeout occurred/i.test(text)) {
      return 'Cloudflare timeout (524)';
    }
    return '';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1)}…`;
  };

  const readErrorDetails = async (response: Response) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        const detail = data?.message || data?.error || data?.detail || data?.data?.message;
        return detail ? truncateText(String(detail).trim(), 300) : '';
      }
      const text = await response.text();
      if (!text) return '';
      if (contentType.includes('text/html') || text.includes('<html')) {
        const summary = summarizeHtmlError(text);
        return summary ? truncateText(summary, 300) : '';
      }
      return truncateText(text.replace(/\s+/g, ' ').trim(), 300);
    } catch (error) {
      return '';
    }
  };

  const formatScrapeError = async (response: Response) => {
    if (response.status === 524) {
      return [
        'Scrape timed out at the edge (524). The provider may still be working in the background.',
        'Check the sheet in a minute to see if leads appear.',
        'If it keeps timing out, lower the total to 20-50 or use a city/zip.',
        'You can click "Run next batch" to continue once the sheet updates.'
      ].join(' ');
    }
    const details = await readErrorDetails(response);
    if (details) {
      return `Scraping failed (status ${response.status}). API message: ${details}\n\nTip: Try a narrower niche, use a city or zip, or lower the limit (20-50). Example: "HVAC in Elgin, IL". For all businesses, try "Businesses in <city>".`;
    }
    return `Scraping failed (status ${response.status}).\n\nTip: Try a narrower niche, use a city or zip, or lower the limit (20-50). Example: "HVAC in Elgin, IL". For all businesses, try "Businesses in <city>".`;
  };

  const formatSendError = async (response: Response) => {
    const details = await readErrorDetails(response);
    if (details) {
      return `Email send failed (status ${response.status}). API message: ${details}`;
    }
    return `Email send failed (status ${response.status}). Please try again.`;
  };

  const formatCleanError = async (response: Response) => {
    const details = await readErrorDetails(response);
    if (details) {
      return `Sheet clean failed (status ${response.status}). API message: ${details}`;
    }
    return `Sheet clean failed (status ${response.status}). Please try again.`;
  };

  const clearBatchTimer = () => {
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
      batchTimerRef.current = null;
    }
  };

  const parseIntentRuleBased = (text: string): LeadbotIntent => {
    const normalized = text.trim();
    const lower = normalized.toLowerCase();

    if (!normalized) return { action: 'unknown' };
    if (lower.includes('open rate') || lower.includes('open rates')) return { action: 'open_rates' };
    if (lower.includes('follow up') || lower.includes('follow-up')) return { action: 'follow_up' };
    if (/(preview|dry run|dry-run)/.test(lower)) return { action: 'preview' };
    if (/(\bsend\b|\blaunch\b|\bstart\b).*(email|campaign|outreach)/.test(lower) || /^send( it| them| emails)?$/.test(lower)) {
      return { action: 'send' };
    }
    if (/(clean|dedupe|deduplicate|remove duplicates)/.test(lower)) return { action: 'clean' };
    if (/(help|what can you do|how does this work|what do you do)/.test(lower)) return { action: 'help' };

    const hasLeadIntent = /(lead|leads|scrape|find|search|prospect)/.test(lower);
    const hasLocation = /\b(in|near)\b/.test(lower) || /,\s*[a-z]{2}\b/.test(lower);

    if (hasLeadIntent && hasLocation) return { action: 'scrape', search: normalizeSearchQuery(normalized) };
    if (hasLeadIntent) return { action: 'scrape' };

    const looksLikeQuery = hasLocation && normalized.split(/\s+/).length >= 2;
    if (looksLikeQuery) return { action: 'scrape', search: normalizeSearchQuery(normalized) };

    return { action: 'unknown' };
  };

  const resolveIntent = async (text: string): Promise<LeadbotIntent> => {
    const ruleBased = parseIntentRuleBased(text);
    if (ruleBased.action !== 'unknown' || ruleBased.search) return ruleBased;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) return ruleBased;

    try {
      const client = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text }]
          }
        ],
        config: {
          systemInstruction: {
            parts: [
              {
                text: 'You are an intent parser for a lead generation assistant. Return JSON only with keys: action and search. action must be one of: scrape, send, preview, open_rates, follow_up, clean, help, unknown. If the user wants leads, set action to scrape and set search to a concise query like "roofers in Austin, TX". If the user wants to send outreach, action is send. If they ask for a dry run, action is preview. If the user asks to find leads and send emails in one request, return action "scrape" with a search query. If unsure, action is help.'
              }
            ]
          }
        }
      });

      const raw = response.text || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return ruleBased;

      const parsed = JSON.parse(jsonMatch[0]);
      const action = (parsed.action || '').toString().toLowerCase() as IntentAction;
      const allowedActions: IntentAction[] = [
        'scrape',
        'send',
        'preview',
        'open_rates',
        'follow_up',
        'clean',
        'help',
        'unknown'
      ];

      if (!allowedActions.includes(action)) return ruleBased;

      const search = typeof parsed.search === 'string' ? normalizeSearchQuery(parsed.search.trim()) : undefined;
      return { action, search };
    } catch (error) {
      return ruleBased;
    }
  };

  const isAffirmative = (text: string) => {
    const normalized = text.toLowerCase().trim();
    if (!normalized) return false;
    return /^(y|yes|yeah|yep|sure|ok|okay|go ahead|please|do it|send it|launch it|start it|proceed)$/.test(normalized);
  };

  const isNegative = (text: string) => {
    const normalized = text.toLowerCase().trim();
    if (!normalized) return false;
    return /^(n|no|nope|not now|later|stop|cancel)$/.test(normalized);
  };

  const isPreviewRequest = (text: string) => {
    const normalized = text.toLowerCase().trim();
    return /(preview|dry run|dry-run)/.test(normalized);
  };

  const handleScrapeLeads = async (
    query: string,
    targetSheetUrl?: string | null,
    limit: number = 20,
    postAction: PostScrapeAction = 'none',
    batchMeta?: BatchMeta
  ) => {
    setIsLoading(true);
    const normalizedQuery = normalizeSearchQuery(query);
    const activeSheetUrl = targetSheetUrl || sheetUrl;
    const requiresButtonChoice = mode === 'page' && postAction === 'none';
    const actionNote =
      postAction === 'send'
        ? batchMeta && !batchMeta.isFinalBatch
          ? 'I will finish all batches, then send outreach with tracking and follow-ups.'
          : 'I will send outreach with tracking and follow-ups after the leads are ready.'
        : postAction === 'preview'
          ? batchMeta && !batchMeta.isFinalBatch
            ? 'I will finish all batches, then run a preview.'
            : 'I will run a preview after the leads are ready.'
          : null;
    setMessages((msgs) => [
      ...msgs,
      {
        sender: 'bot',
        text: activeSheetUrl
          ? `Got it. I'll append new leads to your existing sheet.`
          : `Got it. I'll create a new Google Sheet for you.`
      },
      { sender: 'bot', text: `Scraping leads for: ${normalizedQuery}...` },
      ...(actionNote ? [{ sender: 'bot', text: actionNote }] : [])
    ]);

    try {
      const payload: {
        search: string;
        limit: number;
        enrich: boolean;
        use_free_scraper: boolean;
        sheet_url?: string;
      } = {
        search: normalizedQuery,
        limit,
        enrich: true,
        use_free_scraper: false
      };

      if (activeSheetUrl) {
        payload.sheet_url = activeSheetUrl;
      }

      const response = await fetch(`${API_BASE_URL}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorMessage = await formatScrapeError(response);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const sheet = data.sheet_url || data.sheetUrl || data.url;

      if (!sheet) {
        throw new Error('Sheet URL missing from response');
      }

      setSheetUrl(sheet);
      const createdNewSheet = activeSheetUrl && sheet !== activeSheetUrl;
      const nextStepText = batchMeta && !batchMeta.isFinalBatch
        ? `Batch complete. ${batchMeta.remainingAfter} of ${batchMeta.total} remaining.\nNext batch will start shortly. You can also click "Run next batch" to continue.`
        : postAction === 'send'
          ? 'Sending outreach now...'
          : postAction === 'preview'
            ? 'Starting a preview now...'
            : requiresButtonChoice
              ? 'Use the Preview or Send buttons above to continue.'
              : 'Do you want to launch the outreach campaign now? (yes/no)\nTip: Run another search anytime to append more leads.';
      setMessages((msgs) => [
        ...msgs,
        {
          sender: 'bot',
          text: createdNewSheet
            ? `I created a new Google Sheet for the latest leads: [Open Sheet](${sheet})\n\n${nextStepText}`
            : `Done. Here's your Google Sheet with leads: [Open Sheet](${sheet})\n\n${nextStepText}`
        }
      ]);
      if (batchMeta && !batchMeta.isFinalBatch) {
        return { success: true, sheet };
      }
      if (postAction === 'none') {
        setStep(requiresButtonChoice ? 'done' : 'confirm-send');
      }
      if (postAction === 'preview') {
        await handleSendEmails(true, sheet);
      }
      if (postAction === 'send') {
        await handleSendEmails(false, sheet);
      }
      return { success: true, sheet };
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : '';
      const message = rawMessage.includes('Failed to fetch')
        ? 'Network error while contacting the lead service. Make sure the server proxy is running, then try again.'
        : rawMessage || 'Scraping failed. Try a different location or niche.';
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: message }
      ]);
      if (!batchMeta) {
        setStep('discovery');
      }
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmails = async (dryRun: boolean, overrideSheetUrl?: string | null) => {
    const activeSheetUrl = overrideSheetUrl || sheetUrl;
    if (!activeSheetUrl) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: 'bot',
          text: `I need a Google Sheet first. Tell me the business type and location, or paste a sheet URL. Example: "Roofers in Austin".`
        }
      ]);
      setStep('discovery');
      return;
    }

    setIsLoading(true);
    setMessages((msgs) => [
      ...msgs,
      {
        sender: 'bot',
        text: dryRun
          ? 'Previewing the campaign (dry run) with the Viktron.ai template. No emails will be sent.'
          : "I'm sending emails using the Viktron.ai template. Tracking and follow-ups are active."
      }
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet_url: activeSheetUrl,
          body: HIGHSHIFT_TEMPLATE,
          dry_run: dryRun
        })
      });

      if (!response.ok) {
        const errorMessage = await formatSendError(response);
        throw new Error(errorMessage);
      }

      if (dryRun) {
        setMessages((msgs) => [
          ...msgs,
          { sender: 'bot', text: `Preview ready. No emails were sent.\n\nDo you want to send the real campaign now? (yes/no)` }
        ]);
        setStep('confirm-send');
      } else {
        setMessages((msgs) => [
          ...msgs,
          { sender: 'bot', text: `Emails sent.\n\nTracking and follow-ups are active. You can monitor email_sent, email_opened, and link_clicked columns in your Sheet in real time.` }
        ]);
        setStep('done');
      }
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : '';
      const message = rawMessage.includes('Failed to fetch')
        ? 'Network error while sending emails. Make sure the server proxy is running, then try again.'
        : rawMessage || 'Sorry, sending failed. Want me to try again or run a preview first?';
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: message }
      ]);
      setStep('confirm-send');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanLeads = async () => {
    if (!sheetUrl) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: `I need a Google Sheet first. Paste a sheet URL or run a lead scrape.` }
      ]);
      return;
    }

    setIsLoading(true);
    setMessages((msgs) => [
      ...msgs,
      { sender: 'bot', text: `Cleaning and deduplicating your sheet. This can take a minute...` }
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/clean`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet_url: sheetUrl,
          dedupe: true,
          min_quality_score: 50
        })
      });

      if (!response.ok) {
        const errorMessage = await formatCleanError(response);
        throw new Error(errorMessage);
      }

      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: `Done. Your sheet has been cleaned and deduped.` }
      ]);
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : '';
      const message = rawMessage.includes('Failed to fetch')
        ? 'Network error while cleaning the sheet. Make sure the server proxy is running, then try again.'
        : rawMessage || `Sorry, I couldn't clean the sheet. Want me to try again?`;
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: message }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const runNextBatch = async (planOverride?: BatchPlan) => {
    const plan = planOverride || batchPlan;
    if (!plan || isBusy) return;

    clearBatchTimer();

    const batchLimit = Math.min(plan.batchSize, plan.remaining);
    const remainingAfter = plan.remaining - batchLimit;
    const isFinalBatch = remainingAfter <= 0;
    const postAction = isFinalBatch ? plan.postAction : 'none';

    const result = await handleScrapeLeads(
      plan.search,
      sheetUrl,
      batchLimit,
      postAction,
      {
        remainingAfter,
        total: plan.total,
        isFinalBatch,
        autoRun: plan.autoRun,
      }
    );

    if (!result?.success) {
      return;
    }

    if (isFinalBatch) {
      setBatchPlan(null);
      return;
    }

    const nextPlan: BatchPlan = {
      ...plan,
      remaining: remainingAfter,
    };
    setBatchPlan(nextPlan);

    if (nextPlan.autoRun) {
      batchTimerRef.current = setTimeout(() => {
        runNextBatch(nextPlan);
      }, AUTO_BATCH_DELAY_MS);
    }
  };

  const handleFormAction = async (action: PostScrapeAction) => {
    if (isBusy) return;
    const trimmedIndustry = industryInput.trim();
    const trimmedLocation = locationInput.trim();
    const normalizedLimit = Number.isFinite(limitInput) ? Math.max(1, Math.min(200, limitInput)) : 20;

    if (!trimmedIndustry || !trimmedLocation) {
      setFormError('Please add a business type and location.');
      return;
    }

    if (action === 'send' && !confirmSend) {
      setFormError('Please confirm sending real emails before launching outreach.');
      return;
    }

    setFormError('');
    const search = normalizeSearchQuery(`${trimmedIndustry} in ${trimmedLocation}`);
    setMessages((msgs) => [
      ...msgs,
      { sender: 'user', text: `Lead request: ${search} (limit ${normalizedLimit})` }
    ]);
    const plan: BatchPlan = {
      search,
      total: normalizedLimit,
      remaining: normalizedLimit,
      batchSize: Math.min(MAX_BATCH_SIZE, normalizedLimit),
      postAction: action,
      autoRun: true,
    };
    setBatchPlan(plan);
    await runNextBatch(plan);
  };

  const handleUserInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBusy) return;

    const rawInput = input.trim();
    setMessages((msgs) => [...msgs, { sender: 'user', text: rawInput }]);
    setInput('');

    const lower = rawInput.toLowerCase();
    const providedSheetUrl = extractSheetUrl(rawInput);
    const cleanedInput = providedSheetUrl ? rawInput.replace(providedSheetUrl, '').trim() : rawInput.trim();

    if (providedSheetUrl) {
      setSheetUrl(providedSheetUrl);
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: `Sheet received. I'll keep appending new leads to it.` }
      ]);
    }

    if (step === 'confirm-send') {
      if (mode === 'page') {
        setMessages((msgs) => [
          ...msgs,
          { sender: 'bot', text: 'Use the Preview or Send buttons above to take action.' }
        ]);
        return;
      }
      if (isAffirmative(cleanedInput) || lower.startsWith('y')) {
        handleSendEmails(false);
        return;
      }
      if (isPreviewRequest(cleanedInput)) {
        handleSendEmails(true);
        return;
      }
      if (isNegative(cleanedInput) || lower.startsWith('n')) {
        setMessages((msgs) => [
          ...msgs,
          { sender: 'bot', text: `No problem. You can launch the campaign anytime by typing "send emails" or "preview".` }
        ]);
        setStep('done');
        return;
      }
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: `Please reply with yes/no, or type "preview" for a dry run.` }
      ]);
      return;
    }

    if (!cleanedInput) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: `What kind of businesses are you looking for, and in which city? Example: Roofers in Austin.` }
      ]);
      return;
    }

    setIsThinking(true);
    const intent = await resolveIntent(cleanedInput);
    setIsThinking(false);

    if (intent.action === 'open_rates') {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: `Check your Google Sheet for live updates. Open and click tracking appears in the email_opened and link_clicked columns.` }
      ]);
      return;
    }

    if (intent.action === 'follow_up') {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: `Yes, the system automatically sends a follow-up after 3 days if they have not opened the first email.` }
      ]);
      return;
    }

    if (intent.action === 'send') {
      if (mode === 'page') {
        setMessages((msgs) => [
          ...msgs,
          { sender: 'bot', text: 'Use the Preview or Send buttons above to take action.' }
        ]);
        return;
      }
      handleSendEmails(false);
      return;
    }

    if (intent.action === 'preview') {
      if (mode === 'page') {
        setMessages((msgs) => [
          ...msgs,
          { sender: 'bot', text: 'Use the Preview or Send buttons above to take action.' }
        ]);
        return;
      }
      handleSendEmails(true);
      return;
    }

    if (intent.action === 'clean') {
      handleCleanLeads();
      return;
    }

    if (intent.action === 'help') {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: 'bot',
          text: `I can find leads from Google Maps, Yelp, or Nextdoor, enrich data, clean duplicates, and send or preview outreach.\n\nTell me the business type and location (city, zip, or county). Example: "Med spas in Aurora, IL". For all businesses, use "All businesses in <location>".`
        }
      ]);
      return;
    }

    if (intent.action === 'scrape') {
      const search = normalizeSearchQuery(intent.search || cleanedInput);
      handleScrapeLeads(search, providedSheetUrl);
      return;
    }

    setMessages((msgs) => [
      ...msgs,
      { sender: 'bot', text: `Tell me the business type and location you'd like to target, or ask me to send or preview outreach.` }
    ]);
  };

  const containerClassName = [
    mode === 'page'
      ? 'relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden'
      : 'fixed bottom-4 right-4 z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const messagesMaxHeight = mode === 'page' ? 440 : 320;

  return (
    <div className={containerClassName}>
      <div className="bg-gray-900 text-white px-4 py-2 font-bold text-lg">LeadBot</div>
      {mode === 'page' ? (
        <div className="border-b border-gray-200 bg-gray-50/80 px-4 py-4">
          <p className="text-xs text-gray-600">
            Enter an industry and a location (city, zip, or county). For all businesses, enter "All businesses".
          </p>
          <div className="mt-3 space-y-3">
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Business type (e.g., Roofers, Med Spas, All businesses)"
              value={industryInput}
              onChange={(e) => {
                setIndustryInput(e.target.value);
                if (formError) setFormError('');
              }}
              disabled={isBusy}
            />
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Location (city, zip, or county)"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                if (formError) setFormError('');
              }}
              disabled={isBusy}
            />
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={200}
                className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                value={limitInput}
                onChange={(e) => setLimitInput(Number(e.target.value))}
                disabled={isBusy}
              />
              <span className="text-xs text-gray-500">Total leads (max 200). Requests over 50 run in batches.</span>
            </div>
            <label className="flex items-start gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={confirmSend}
                onChange={(e) => {
                  setConfirmSend(e.target.checked);
                  if (formError) setFormError('');
                }}
                disabled={isBusy}
              />
              I confirm sending real emails with tracking and follow-ups.
            </label>
            {formError ? <p className="text-xs text-rose-600">{formError}</p> : null}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                onClick={() => handleFormAction('none')}
                disabled={isBusy}
              >
                Find leads
              </button>
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                onClick={() => handleFormAction('preview')}
                disabled={isBusy}
              >
                Preview outreach
              </button>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                onClick={() => handleFormAction('send')}
                disabled={isBusy || !confirmSend}
              >
                Send outreach
              </button>
            </div>
            {batchPlan && batchPlan.remaining > 0 ? (
              <div className="pt-2">
                <button
                  type="button"
                  className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                  onClick={() => runNextBatch()}
                  disabled={isBusy}
                >
                  Run next batch
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto" style={{ maxHeight: messagesMaxHeight }}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'bot' ? 'text-left' : 'text-right'}>
            <span className={msg.sender === 'bot' ? 'bg-gray-100 text-gray-900 px-3 py-2 rounded-lg inline-block' : 'bg-blue-500 text-white px-3 py-2 rounded-lg inline-block'}>
              {msg.text.includes('[Open Sheet]') ? (
                <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\[Open Sheet\]\(([^)]+)\)/g, '<a href="$1" target="_blank" class="underline text-blue-600">Open Sheet</a>') }} />
              ) : (
                msg.text
              )}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleUserInput} className="flex border-t border-gray-200">
        <input
          className="flex-1 px-3 py-2 outline-none text-gray-900 placeholder:text-gray-500 bg-white"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isBusy}
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold" disabled={isBusy}>
          Send
        </button>
      </form>
    </div>
  );
};
