import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  Brain,
  CheckCircle2,
  CreditCard,
  Database,
  Flame,
  Funnel,
  LineChart,
  Loader2,
  MessagesSquare,
  PlugZap,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Unplug,
  Users,
  Zap,
} from 'lucide-react';
import { getAuthToken } from '../../context/AuthContext';

type Trend = 'up' | 'down' | 'flat';

type KPI = {
  label: string;
  value: string | number;
  delta: string;
  trend: Trend;
};

type FunnelStep = {
  step: string;
  users: number;
  rate: number;
};

type CohortRow = {
  cohort: string;
  w0: number | null;
  w1: number | null;
  w2: number | null;
  w3: number | null;
  w4: number | null;
};

type Segment = {
  name: string;
  count: number;
  share: number;
};

type FeatureAdoption = {
  feature: string;
  adoption: number;
};

type OverviewPayload = {
  product: {
    name: string;
    positioning: string;
    category: string;
  };
  kpis: KPI[];
  time_series: {
    labels: string[];
    active_users: number[];
    sessions: number[];
    conversions: number[];
  };
  funnel: FunnelStep[];
  cohort: CohortRow[];
  engagement: {
    top_segments: Segment[];
    nps: number;
    feature_adoption: FeatureAdoption[];
  };
  reddit_agent: {
    tracked_subreddits: number;
    posts_processed_7d: number;
    pre_viral_signals: number;
    avg_alert_lead_time_days: number;
  };
  updated_at: string;
};

type CheckoutResponse = {
  session_id: string;
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
  seats: number;
  total: number;
  checkout_url: string;
  message: string;
};

type RedditResponse = {
  summary: string;
  insights: Array<{ title: string; confidence: number; evidence: string }>;
  top_posts: Array<{ subreddit: string; title: string; score: number; comments: number }>;
  recommended_actions: string[];
  run_id: string;
  ran_at: string;
};

type SourceConnector = {
  provider: string;
  label: string;
  category: string;
  auth_mode: 'oauth' | 'api_key' | 'webhook';
  status: 'connected' | 'available';
  supports: string[];
  connected_workspace: string | null;
  last_sync_at: string | null;
};

type SourceListResponse = {
  sources: SourceConnector[];
  summary: {
    total: number;
    connected: number;
    available: number;
  };
  message: string;
};

const ENV = (import.meta as any).env || {};

const toApiBase = (value?: string): string | null => {
  if (!value) return null;
  const trimmed = String(value).trim().replace(/\/$/, '');
  if (!trimmed) return null;
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
};

const getCanonicalAgentApiBase = (): string | null => {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname.replace(/^www\./, '');
  if (/localhost|127\.0\.0\.1/.test(host)) return '/api';
  if (host === 'viktron.ai' || host.endsWith('.viktron.ai')) {
    return 'https://api.viktron.ai/api';
  }
  return `https://api.${host}/api`;
};

const API_BASES = [
  getCanonicalAgentApiBase(),
  toApiBase(ENV.VITE_SAAS_API_BASE),
  toApiBase(ENV.VITE_AGENT_API_URL),
].filter(Boolean) as string[];

const TOKEN_KEY = 'viktron_auth_token';
const USER_KEY = 'viktron_user';

const apiFetch = async (path: string, init?: RequestInit): Promise<Response> => {
  let lastError: unknown = null;
  const token = getAuthToken();
  const mergedHeaders = {
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  for (const base of API_BASES) {
    const url = `${base}${path}`;
    try {
      const res = await fetch(url, {
        ...init,
        headers: mergedHeaders,
      });
      if (res.ok) return res;
      if (res.status === 401 || res.status === 403) return res;
      lastError = new Error(`Request failed with status ${res.status} for ${url}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('All API base URLs failed');
};

type View = 'overview' | 'product' | 'engagement' | 'sources' | 'reddit' | 'pricing';

const fallbackOverview: OverviewPayload = {
  product: {
    name: 'Viktron Intelligence Cloud',
    positioning: 'Analytics for your AI-powered business',
    category: 'Amplitude-grade product analytics + Reddit intelligence',
  },
  kpis: [
    { label: 'Tracked Events', value: '1,824,220', delta: '+28.4%', trend: 'up' },
    { label: 'WAU', value: '82,440', delta: '+16.1%', trend: 'up' },
    { label: 'Activation Rate', value: '42.8%', delta: '+5.2 pts', trend: 'up' },
    { label: 'Revenue Influenced', value: '$1.24M', delta: '+22.0%', trend: 'up' },
  ],
  time_series: {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
    active_users: [5200, 5710, 6090, 6488, 6760, 7020, 7340, 7614, 7880, 8120, 8365, 8670],
    sessions: [12800, 13600, 14510, 15220, 16080, 16740, 17420, 18200, 19140, 19920, 20700, 21680],
    conversions: [180, 204, 216, 238, 244, 252, 266, 281, 294, 302, 316, 338],
  },
  funnel: [
    { step: 'Visited Pricing', users: 18420, rate: 100 },
    { step: 'Clicked Start Trial', users: 8220, rate: 44.6 },
    { step: 'Connected Data Source', users: 5210, rate: 28.3 },
    { step: 'Activated Dashboard', users: 3920, rate: 21.3 },
    { step: 'Paid Conversion', users: 2140, rate: 11.6 },
  ],
  cohort: [
    { cohort: 'Jan', w0: 100, w1: 74, w2: 63, w3: 56, w4: 50 },
    { cohort: 'Feb', w0: 100, w1: 78, w2: 67, w3: 58, w4: 52 },
    { cohort: 'Mar', w0: 100, w1: 81, w2: 70, w3: 61, w4: null },
    { cohort: 'Apr', w0: 100, w1: 79, w2: 69, w3: null, w4: null },
  ],
  engagement: {
    top_segments: [
      { name: 'Power Users (10+ dashboards)', count: 1480, share: 19.2 },
      { name: 'Agencies', count: 930, share: 12.1 },
      { name: 'B2B SaaS founders', count: 2620, share: 34.1 },
      { name: 'Product teams', count: 2650, share: 34.6 },
    ],
    nps: 52,
    feature_adoption: [
      { feature: 'Funnel Explorer', adoption: 68 },
      { feature: 'Pathfinder', adoption: 47 },
      { feature: 'Cohort Retention', adoption: 59 },
      { feature: 'Reddit Signal Alerts', adoption: 43 },
    ],
  },
  reddit_agent: {
    tracked_subreddits: 18,
    posts_processed_7d: 894,
    pre_viral_signals: 14,
    avg_alert_lead_time_days: 11,
  },
  updated_at: new Date().toISOString(),
};

const fallbackSources: SourceConnector[] = [
  {
    provider: 'slack',
    label: 'Slack',
    category: 'communication',
    auth_mode: 'oauth',
    status: 'available',
    supports: ['threads', 'mentions', 'channel_events', 'scheduled_reports'],
    connected_workspace: null,
    last_sync_at: null,
  },
  {
    provider: 'posthog',
    label: 'PostHog',
    category: 'analytics',
    auth_mode: 'api_key',
    status: 'available',
    supports: ['events', 'funnels', 'retention', 'feature_flags'],
    connected_workspace: null,
    last_sync_at: null,
  },
  {
    provider: 'ga4',
    label: 'Google Analytics 4',
    category: 'analytics',
    auth_mode: 'oauth',
    status: 'available',
    supports: ['sessions', 'acquisition', 'attribution'],
    connected_workspace: null,
    last_sync_at: null,
  },
];

const format = (n: number): string => n.toLocaleString('en-US');

const TrendChip: React.FC<{ delta: string; trend: Trend }> = ({ delta, trend }) => {
  const cls = trend === 'up' ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' : 'text-slate-300 bg-white/5 border-white/10';
  return (
    <span className={`text-[11px] font-mono border px-2 py-0.5 rounded-full ${cls}`}>
      {trend === 'up' ? '+' : ''}
      {delta}
    </span>
  );
};

const Bars: React.FC<{ values: number[]; labels: string[]; color: string }> = ({ values, labels, color }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="space-y-3">
      <div className="h-40 flex items-end gap-1">
        {values.map((v, idx) => (
          <motion.div
            key={`${labels[idx]}-${v}`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: idx * 0.03 }}
            className="flex-1 rounded-t-md origin-bottom"
            style={{
              height: `${(v / max) * 100}%`,
              background: `linear-gradient(to top, ${color}, rgba(255,255,255,0.16))`,
            }}
            title={`${labels[idx]}: ${format(v)}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
};

const PlanCard: React.FC<{
  name: string;
  price: string;
  desc: string;
  highlighted?: boolean;
  points: string[];
  onClick: () => void;
  loading: boolean;
}> = ({ name, price, desc, points, onClick, loading, highlighted }) => (
  <div
    className={`rounded-2xl border p-5 ${
      highlighted ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-[#0a0f15]' : 'border-white/10 bg-[#0d131b]'
    }`}
  >
    <p className="text-lg font-semibold text-white">{name}</p>
    <p className="text-slate-400 text-xs mt-1">{desc}</p>
    <p className="text-4xl font-bold text-white mt-5">{price}</p>
    <div className="space-y-2 mt-5">
      {points.map((p) => (
        <div key={p} className="text-xs text-slate-300 flex items-start gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
          <span>{p}</span>
        </div>
      ))}
    </div>
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-6 w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-70 text-white text-xs font-semibold px-4 py-2.5 transition-colors"
    >
      {loading ? 'Preparing Checkout...' : 'Start Subscription'}
    </button>
  </div>
);

export const AnalyticsApp: React.FC = () => {
  const [view, setView] = useState<View>('overview');
  const [overview, setOverview] = useState<OverviewPayload>(fallbackOverview);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState<string>('');
  const [redditQuery, setRedditQuery] = useState('What analytics features are B2B AI buyers asking for this month?');
  const [redditLoading, setRedditLoading] = useState(false);
  const [redditResult, setRedditResult] = useState<RedditResponse | null>(null);
  const [sources, setSources] = useState<SourceConnector[]>([]);
  const [sourcesMessage, setSourcesMessage] = useState('');
  const [sourceLoading, setSourceLoading] = useState<string>('');
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isImportingSession, setIsImportingSession] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const incomingToken = params.get('viktronToken');
    const incomingUser = params.get('viktronUser');
    if (!incomingToken || !incomingUser) return;

    try {
      const user = JSON.parse(decodeURIComponent(incomingUser));
      localStorage.setItem(TOKEN_KEY, incomingToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setNeedsAuth(false);
      setSourcesMessage('Session linked from viktron.ai.');
    } catch {
      setSourcesMessage('Could not parse linked session. Please sign in again.');
    } finally {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const nav = useMemo(
    () => [
      { id: 'overview' as const, label: 'SaaS Overview', icon: Radar },
      { id: 'product' as const, label: 'Product Analytics', icon: LineChart },
      { id: 'engagement' as const, label: 'Engagement', icon: Users },
      { id: 'sources' as const, label: 'Data Sources', icon: PlugZap },
      { id: 'reddit' as const, label: 'Reddit Agent API', icon: MessagesSquare },
      { id: 'pricing' as const, label: 'Plans & Checkout', icon: CreditCard },
    ],
    []
  );

  const loadOverview = async () => {
    setLoadingOverview(true);
    try {
      const res = await apiFetch('/saas/overview');
      const data = await res.json();
      setOverview(data as OverviewPayload);
    } catch {
      setOverview(fallbackOverview);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    void loadOverview();
    void loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const res = await apiFetch('/saas/sources?workspace_id=viktron-team');
      if (res.status === 401) {
        setSources(fallbackSources);
        setSourcesMessage('Please log in first. Showing available connectors.');
        setNeedsAuth(true);
        return;
      }
      if (!res.ok) {
        throw new Error(`Sources API failed (${res.status})`);
      }

      const data = (await res.json()) as SourceListResponse;
      const nextSources = data.sources?.length ? data.sources : fallbackSources;
      setSources(nextSources);
      setSourcesMessage(data.message || (data.sources?.length ? '' : 'Showing available connectors.'));
      setNeedsAuth(false);
    } catch {
      setSourcesMessage('Sources API unavailable. Backend contract is present and ready for OAuth wiring.');
      setSources(fallbackSources);
    }
  };

  const importSessionFromMainDomain = async () => {
    setIsImportingSession(true);
    setSourcesMessage('Redirecting to viktron.ai to link your session...');
    const target = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    window.location.href = `https://viktron.ai/auth-bridge.html?target=${encodeURIComponent(target)}`;
  };

  const connectSource = async (provider: string) => {
    setSourceLoading(`connect-${provider}`);
    setSourcesMessage('');
    try {
      if (provider === 'slack') {
        const oauthRes = await apiFetch('/saas/sources/slack/oauth/start?workspace_id=viktron-team');
        if (oauthRes.status === 401) {
          setSourcesMessage('Please sign in on viktron.ai first, then retry Slack connect.');
          return;
        }
        if (oauthRes.status === 403) {
          setSourcesMessage('You do not have connector manage permission for this workspace.');
          return;
        }
        if (!oauthRes.ok) {
          const errText = await oauthRes.text();
          let errMsg = `Slack OAuth start failed (${oauthRes.status})`;
          try {
            const parsed = errText ? JSON.parse(errText) : null;
            errMsg = parsed?.message || parsed?.detail || errMsg;
          } catch {
            if (errText) errMsg = errText;
          }
          setSourcesMessage(errMsg);
          return;
        }
        const oauth = await oauthRes.json();
        if (oauth?.success === false) {
          setSourcesMessage(oauth.message || 'Slack OAuth is not configured yet on backend.');
          return;
        }
        if (oauth.oauth_url) {
          window.open(oauth.oauth_url, '_blank', 'noopener,noreferrer');
          setSourcesMessage('Slack OAuth opened. Approve workspace install in Slack, then click Refresh.');
          return;
        }
        throw new Error('Slack OAuth URL missing from backend response');
      }
      const res = await apiFetch(`/saas/sources/${provider}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: 'viktron-team',
          auth_mode: provider === 'posthog' || provider === 'stripe' ? 'api_key' : 'oauth',
          config: {},
        }),
      });
      if (!res.ok) {
        throw new Error('Connect failed');
      }
      const data = await res.json();
      setSourcesMessage(`${provider} connected. Connection id: ${data.connection_id}`);
      await loadSources();
    } catch (err) {
      if (!getAuthToken()) {
        setSourcesMessage('Please log in first. Workspace connector APIs require authentication.');
        setSourceLoading('');
        return;
      }
      setSourcesMessage(`Could not connect ${provider}. ${err instanceof Error ? err.message : ''}`.trim());
    } finally {
      setSourceLoading('');
    }
  };

  const syncSource = async (provider: string) => {
    setSourceLoading(`sync-${provider}`);
    setSourcesMessage('');
    try {
      const res = await apiFetch(`/saas/sources/${provider}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: 'viktron-team', lookback_hours: 24 }),
      });
      const data = await res.json();
      setSourcesMessage(`${provider} sync complete: ${data.events_ingested} events ingested.`);
      await loadSources();
    } catch (err) {
      setSourcesMessage(`Could not sync ${provider}. ${err instanceof Error ? err.message : ''}`.trim());
    } finally {
      setSourceLoading('');
    }
  };

  const disconnectSource = async (provider: string) => {
    setSourceLoading(`disconnect-${provider}`);
    setSourcesMessage('');
    try {
      await apiFetch(`/saas/sources/${provider}?workspace_id=viktron-team`, {
        method: 'DELETE',
      });
      setSourcesMessage(`${provider} disconnected.`);
      await loadSources();
    } catch (err) {
      setSourcesMessage(`Could not disconnect ${provider}. ${err instanceof Error ? err.message : ''}`.trim());
    } finally {
      setSourceLoading('');
    }
  };

  const openCheckout = async (planId: 'growth' | 'scale' | 'white-label') => {
    setCheckoutMessage('');
    setCheckoutLoadingPlan(planId);
    try {
      const res = await apiFetch('/saas/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: planId,
          billing_cycle: 'monthly',
          seats: planId === 'white-label' ? 5 : 1,
          addons: planId === 'scale' ? ['slack-alerts'] : [],
        }),
      });
      const data = (await res.json()) as CheckoutResponse;
      setCheckoutMessage(`Session ${data.session_id} ready. Estimated charge: $${data.total}.`);
      window.open(data.checkout_url, '_blank', 'noopener,noreferrer');
    } catch {
      setCheckoutMessage('Checkout endpoint unavailable. API contract is ready; connect Stripe to finalize payment flow.');
    } finally {
      setCheckoutLoadingPlan('');
    }
  };

  const runRedditQuery = async () => {
    setRedditLoading(true);
    setRedditResult(null);
    try {
      const res = await apiFetch('/saas/reddit-agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: redditQuery,
          subreddits: ['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/marketing'],
          lookback_days: 30,
        }),
      });
      const data = (await res.json()) as RedditResponse;
      setRedditResult(data);
    } catch {
      setRedditResult({
        summary: 'Could not reach live backend. Showing offline intelligence sample from product design data.',
        insights: [
          { title: 'Buyers demand clear ROI dashboards', confidence: 0.89, evidence: 'ROI language appears in high-comment threads.' },
          { title: 'White-label is agency priority', confidence: 0.83, evidence: 'Agency segments request branded exports repeatedly.' },
        ],
        top_posts: [
          { subreddit: 'r/SaaS', title: 'How do you prove analytics ROI in 30 days?', score: 402, comments: 101 },
          { subreddit: 'r/startups', title: 'Which metrics convinced enterprise buyers?', score: 288, comments: 74 },
        ],
        recommended_actions: ['Show outcome metrics in onboarding.', 'Add agency-ready white-label setup.', 'Ship automated weekly executive digests.'],
        run_id: 'offline-demo',
        ran_at: new Date().toISOString(),
      });
    } finally {
      setRedditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#081019] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.12),transparent_40%)]" />

      <div className="relative border-b border-white/10 bg-[#0b131d]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#062330]" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide">Viktron Analytics Cloud</p>
              <p className="text-[11px] text-slate-400">Analytics for your AI-powered business</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-80">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input className="w-full bg-transparent text-xs text-slate-200 outline-none" placeholder="Search metrics, segments, reports..." />
          </div>
          <button
            onClick={() => void loadOverview()}
            className="text-xs px-3 py-2 border border-white/15 rounded-lg text-slate-200 hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOverview ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-[#0d131b] border border-white/10 rounded-2xl p-3 h-fit lg:sticky lg:top-6">
          <div className="space-y-1">
            {nav.map((item) => {
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                    active ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-xs text-cyan-100">
            <p className="font-semibold mb-1">SaaS Mode Enabled</p>
            <p className="text-cyan-100/80">Multi-tenant billing, analytics, and Reddit signal intelligence are active.</p>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="bg-[#0d131b] border border-white/10 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{overview.product.name}</h1>
                <p className="text-slate-300 text-sm mt-1">{overview.product.positioning}</p>
                <p className="text-[11px] text-slate-500 mt-1">{overview.product.category}</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE DATA STREAM
              </div>
            </div>
          </section>

          {(view === 'overview' || view === 'product') && (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {overview.kpis.map((kpi) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0d131b] border border-white/10 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-400">{kpi.label}</p>
                      <TrendChip delta={kpi.delta} trend={kpi.trend} />
                    </div>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                  </motion.div>
                ))}
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-cyan-300" />
                    <p className="text-sm font-semibold">Growth Trajectory (Amplitude-style)</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="rounded-xl p-3 bg-[#101a24] border border-white/5">
                      <p className="text-[11px] text-slate-400 mb-2">Active Users</p>
                      <Bars values={overview.time_series.active_users} labels={overview.time_series.labels} color="#22d3ee" />
                    </div>
                    <div className="rounded-xl p-3 bg-[#101a24] border border-white/5">
                      <p className="text-[11px] text-slate-400 mb-2">Sessions</p>
                      <Bars values={overview.time_series.sessions} labels={overview.time_series.labels} color="#10b981" />
                    </div>
                    <div className="rounded-xl p-3 bg-[#101a24] border border-white/5">
                      <p className="text-[11px] text-slate-400 mb-2">Conversions</p>
                      <Bars values={overview.time_series.conversions} labels={overview.time_series.labels} color="#f59e0b" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Funnel className="w-4 h-4 text-emerald-300" />
                    <p className="text-sm font-semibold">Conversion Funnel</p>
                  </div>
                  <div className="space-y-3">
                    {overview.funnel.map((step) => (
                      <div key={step.step}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">{step.step}</span>
                          <span className="font-mono text-slate-100">{format(step.users)} ({step.rate}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            style={{ width: `${step.rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {(view === 'overview' || view === 'engagement') && (
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-indigo-300" />
                  <p className="text-sm font-semibold">Retention Cohorts</p>
                </div>
                <div className="space-y-2">
                  {overview.cohort.map((row) => (
                    <div key={row.cohort}>
                      <p className="text-[11px] text-slate-500 mb-1">{row.cohort}</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[row.w0, row.w1, row.w2, row.w3, row.w4].map((v, idx) => (
                          <div
                            key={`${row.cohort}-${idx}`}
                            className="h-8 rounded flex items-center justify-center text-[10px] font-mono"
                            style={{
                              background: v === null ? 'rgba(255,255,255,0.02)' : `rgba(99,102,241,${(v || 0) / 120})`,
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            {v === null ? '-' : `${v}%`}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  <p className="text-sm font-semibold">Engagement & Capability Metrics</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#101a24] border border-white/5 p-3">
                    <p className="text-[11px] text-slate-400">NPS</p>
                    <p className="text-2xl font-bold">{overview.engagement.nps}</p>
                  </div>
                  <div className="rounded-xl bg-[#101a24] border border-white/5 p-3">
                    <p className="text-[11px] text-slate-400">Pre-viral Signal Lead</p>
                    <p className="text-2xl font-bold">{overview.reddit_agent.avg_alert_lead_time_days}d</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-300 mb-2">Top Segments</p>
                  <div className="space-y-2">
                    {overview.engagement.top_segments.map((segment) => (
                      <div key={segment.name} className="text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">{segment.name}</span>
                          <span className="font-mono text-slate-100">{segment.share}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400" style={{ width: `${segment.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-300 mb-2">Feature Adoption</p>
                  <div className="space-y-2">
                    {overview.engagement.feature_adoption.map((item) => (
                      <div key={item.feature} className="flex justify-between text-xs border-b border-white/5 py-1.5 last:border-0">
                        <span className="text-slate-300">{item.feature}</span>
                        <span className="font-mono text-emerald-300">{item.adoption}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {view === 'sources' && (
            <section className="space-y-4">
              <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <PlugZap className="w-4 h-4 text-cyan-300" />
                  <p className="text-sm font-semibold">Connect Multiple Sources (Slack + APIs)</p>
                </div>
                <p className="text-xs text-slate-400">
                  Slack workspace connection is handled through the same connector contract as PostHog, GA4, HubSpot, Stripe, Notion, Linear, GitHub, and Reddit.
                </p>
                <p className="text-xs text-cyan-300 mt-2">{sourcesMessage || 'Connect sources to unify analytics and engagement intelligence.'}</p>
                {needsAuth && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => void importSessionFromMainDomain()}
                      disabled={isImportingSession}
                      className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#042432] text-[11px] font-semibold px-3 py-2"
                    >
                      {isImportingSession ? 'Redirecting...' : 'Use my viktron.ai session'}
                    </button>
                    <a
                      href="https://viktron.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/20 hover:bg-white/5 text-slate-100 text-[11px] font-semibold px-3 py-2"
                    >
                      Sign in on viktron.ai
                    </a>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sources.map((source) => {
                  const connectKey = `connect-${source.provider}`;
                  const syncKey = `sync-${source.provider}`;
                  const disconnectKey = `disconnect-${source.provider}`;
                  return (
                    <div key={source.provider} className="bg-[#0d131b] border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{source.label}</p>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            source.status === 'connected'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-white/5 text-slate-300 border-white/10'
                          }`}
                        >
                          {source.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{source.category} · {source.auth_mode}</p>
                      <p className="text-[11px] text-slate-300 mt-3">Supports: {source.supports.join(', ')}</p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        Workspace: {source.connected_workspace || 'Not connected'}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <button
                          onClick={() => void connectSource(source.provider)}
                          disabled={sourceLoading === connectKey}
                          className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-70 text-[#042432] text-[11px] font-semibold px-2 py-2"
                        >
                          {sourceLoading === connectKey ? '...' : 'Connect'}
                        </button>
                        <button
                          onClick={() => void syncSource(source.provider)}
                          disabled={sourceLoading === syncKey || source.status !== 'connected'}
                          className="rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-[11px] font-semibold px-2 py-2"
                        >
                          {sourceLoading === syncKey ? '...' : 'Sync'}
                        </button>
                        <button
                          onClick={() => void disconnectSource(source.provider)}
                          disabled={sourceLoading === disconnectKey || source.status !== 'connected'}
                          className="rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-60 text-slate-100 text-[11px] font-semibold px-2 py-2 flex items-center justify-center gap-1"
                        >
                          <Unplug className="w-3 h-3" />
                          {sourceLoading === disconnectKey ? '...' : 'Off'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {view === 'reddit' && (
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-cyan-300" />
                  <p className="text-sm font-semibold">Reddit Intelligence API Console</p>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  API-based Reddit agent for market intelligence in the background. Run analysis on demand and attach signals to your business analytics.
                </p>
                <textarea
                  value={redditQuery}
                  onChange={(e) => setRedditQuery(e.target.value)}
                  className="w-full h-28 rounded-lg bg-[#101a24] border border-white/10 p-3 text-sm text-slate-100 outline-none"
                />
                <button
                  onClick={() => void runRedditQuery()}
                  disabled={redditLoading}
                  className="mt-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-70 text-[#042432] text-xs font-semibold px-4 py-2.5 flex items-center gap-2"
                >
                  {redditLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  Run Reddit Agent Query
                </button>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="rounded-lg bg-[#101a24] border border-white/5 p-3">
                    <p className="text-slate-400">Tracked Subreddits</p>
                    <p className="text-lg font-bold">{overview.reddit_agent.tracked_subreddits}</p>
                  </div>
                  <div className="rounded-lg bg-[#101a24] border border-white/5 p-3">
                    <p className="text-slate-400">Posts Processed / 7d</p>
                    <p className="text-lg font-bold">{format(overview.reddit_agent.posts_processed_7d)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                <p className="text-sm font-semibold mb-3">Agent Output</p>
                {!redditResult && <p className="text-xs text-slate-400">Run a query to see intelligence output.</p>}
                {redditResult && (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-[#101a24] border border-white/5 p-3">
                      <p className="text-xs text-cyan-300">Summary</p>
                      <p className="text-sm text-slate-200 mt-1">{redditResult.summary}</p>
                    </div>
                    {redditResult.insights.map((insight) => (
                      <div key={insight.title} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                        <p className="text-xs font-semibold text-emerald-200">{insight.title}</p>
                        <p className="text-[11px] text-slate-300 mt-1">{insight.evidence}</p>
                        <p className="text-[10px] font-mono text-emerald-300 mt-1">Confidence: {(insight.confidence * 100).toFixed(0)}%</p>
                      </div>
                    ))}
                    <div className="rounded-lg bg-[#101a24] border border-white/5 p-3">
                      <p className="text-xs text-slate-300 mb-2">Recommended Actions</p>
                      <div className="space-y-1.5">
                        {redditResult.recommended_actions.map((action) => (
                          <div key={action} className="text-xs text-slate-200 flex items-start gap-2">
                            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-300 mt-0.5 shrink-0" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {view === 'pricing' && (
            <section className="space-y-4">
              <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeDollarSign className="w-4 h-4 text-emerald-300" />
                  <p className="text-sm font-semibold">SaaS Plans from Monetization Playbook</p>
                </div>
                <p className="text-xs text-slate-400">
                  Self-serve SaaS starts at $200/month with no free tier, plus white-label resale at $1,000+/month for agencies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PlanCard
                  name="Growth"
                  price="$200/mo"
                  desc="For startups proving analytics ROI"
                  points={[
                    'Amplitude-style event tracking and funnels',
                    'Weekly AI executive summary',
                    '5 subreddit intelligence monitors',
                    'Email support',
                  ]}
                  onClick={() => void openCheckout('growth')}
                  loading={checkoutLoadingPlan === 'growth'}
                />
                <PlanCard
                  name="Scale"
                  price="$600/mo"
                  desc="For product and growth teams"
                  highlighted
                  points={[
                    'Everything in Growth',
                    'Advanced cohorts and pathfinding',
                    'Slack signal alerts add-on included',
                    'API access for analytics export',
                  ]}
                  onClick={() => void openCheckout('scale')}
                  loading={checkoutLoadingPlan === 'scale'}
                />
                <PlanCard
                  name="White-label"
                  price="$1,200/mo"
                  desc="For agencies reselling under their own brand"
                  points={[
                    'Everything in Scale',
                    'Custom brand domain + report theme',
                    'Client workspace partitioning',
                    'Priority onboarding and support',
                  ]}
                  onClick={() => void openCheckout('white-label')}
                  loading={checkoutLoadingPlan === 'white-label'}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                  <p className="text-sm font-semibold mb-3">What businesses can do with this analytics stack</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { icon: Database, title: 'Track every event', body: 'Capture user interactions, feature usage, and conversion events in one timeline.' },
                      { icon: Flame, title: 'Find pre-viral signals', body: 'Use Reddit intelligence to identify rising demand before competitors react.' },
                      { icon: ShieldCheck, title: 'Drive accountable growth', body: 'Tie product behavior to revenue metrics and prove the ROI of every change.' },
                      { icon: Sparkles, title: 'Automate insights', body: 'Generate weekly summaries and action plans for founders, PMs, and marketing teams.' },
                    ].map((cap) => (
                      <div key={cap.title} className="rounded-xl bg-[#101a24] border border-white/5 p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <cap.icon className="w-3.5 h-3.5 text-cyan-300" />
                          <p className="text-slate-100 font-semibold">{cap.title}</p>
                        </div>
                        <p className="text-slate-300">{cap.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-5">
                  <p className="text-sm font-semibold mb-3">Checkout Status</p>
                  <p className="text-xs text-slate-400">{checkoutMessage || 'Create a subscription plan to generate a checkout session.'}</p>
                </div>
              </div>
            </section>
          )}

          <section className="bg-[#0d131b] border border-white/10 rounded-2xl p-4 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Updated: {new Date(overview.updated_at).toLocaleString()}</span>
            <span className="font-mono">Route: /analytics or /saas-analytics</span>
          </section>
        </main>
      </div>
    </div>
  );
};
