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
import { getAuthToken, useAuth } from '../../context/AuthContext';

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


type OnboardingStage = 'url' | 'analyzing' | 'blueprint' | 'logs';

type BusinessBlueprint = {
  product_name: string;
  category: string;
  icp: string;
  value_proposition: string;
  conversion_pathway: string[];
  competitors: string[];
};

type OnboardingQuestion = {
  id: string;
  question: string;
  type: 'choice' | 'text';
  options?: string[];
};
\ntype View = 'overview' | 'product' | 'engagement' | 'sources' | 'reddit' | 'pricing';

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
  const { user } = useAuth();
  const workspaceId = user?.id ? `ws-${user.id}` : null;

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
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessType, setBusinessType] = useState('saas');
  const [onboardingStage, setOnboardingStage] = useState<OnboardingStage>('url');
  const [blueprint, setBlueprint] = useState<BusinessBlueprint | null>(null);
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isProvisioning, setIsProvisioning] = useState(false);

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
    if (!workspaceId) return;
    setLoadingOverview(true);
    try {
      const res = await apiFetch(`/saas/overview?workspace_id=${encodeURIComponent(workspaceId)}`);
      const data = await res.json();
      setOverview(data as OverviewPayload);
    } catch {
      setOverview(fallbackOverview);
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    if (!workspaceId) return;
    void loadOverview();
    void loadSources();
  }, [workspaceId]);

  const loadSources = async () => {
    if (!workspaceId) return;
    try {
      const res = await apiFetch(`/saas/sources?workspace_id=${encodeURIComponent(workspaceId)}`);
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
  
  if (!user) {
    return (
      <div className="min-h-screen bg-[#081019] text-white flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center mx-auto mb-5">
            <BarChart3 className="w-7 h-7 text-[#062330]" />
          </div>
          <h2 className="text-xl font-bold mb-2">Sign in to access Analytics</h2>
          <p className="text-slate-400 text-sm mb-6">Your analytics workspace is tied to your account. Please sign in to view your data.</p>
          <a href="/login?redirect=/analytics" className="inline-flex items-center justify-center gap-2 rounded-xl h-11 px-6 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">
            Sign in
          </a>
        </div>
      </div>
    );
  }


  const handleStartAnalysis = async () => {
    if (!websiteUrl) return;
    setOnboardingStage('analyzing');
    try {
      const res = await apiFetch('/saas/setup/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspaceId, website_url: websiteUrl })
      });
      const data = await res.json();
      if (data.success) {
        setBlueprint(data.blueprint);
        setQuestions(data.questions);
        setOnboardingStage('blueprint');
      } else {
        throw new Error(data.detail);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      // Fallback
      setBlueprint({
        product_name: 'Custom Product',
        category: 'SaaS',
        icp: 'Enterprise Teams',
        value_proposition: 'AI-powered optimization',
        conversion_pathway: ['Landing', 'Pricing', 'Sign Up'],
        competitors: []
      });
      setQuestions([{ id: 'q1', question: 'What is your main conversion goal?', type: 'choice', options: ['Sales', 'Demos'] }]);
      setOnboardingStage('blueprint');
    }
  };

  const handleFinalizeOnboarding = async () => {
    setIsProvisioning(true);
    try {
      await apiFetch('/saas/setup/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          answers,
          blueprint
        })
      });
      setIsSetupComplete(true);
      void loadOverview();
    } catch (err) {
      console.error('Finalization failed:', err);
      setIsSetupComplete(true); // Fallback for demo
    } finally {
      setIsProvisioning(false);
    }
  };
\n  const handleSetup = async () => {
    if (!websiteUrl) {
      setSourcesMessage('Please enter your website URL to begin intelligence ingestion.');
      return;
    }
    try {
      const res = await apiFetch('/saas/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          website_url: websiteUrl,
          business_type: businessType
        })
      });
      if (res.ok) {
        setIsSetupComplete(true);
        setSourcesMessage('Viktron Intelligence Layer provisioned for ' + websiteUrl + '. Scanning market signals...');
        void loadOverview();
      } else {
        throw new Error('Provisioning failed');
      }
    } catch {
      // Fallback for demo
      setIsSetupComplete(true);
      setSourcesMessage('Infrastructure provisioned (fallback mode). Starting signal ingestion.');
    }
  };

  
  if (!isSetupComplete && user) {
    return (
      <div className="min-h-screen bg-[#040d16] text-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-[#0d131b] border border-white/10 rounded-[32px] p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          {onboardingStage === 'url' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 border border-blue-500/20">
                <Globe className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Initialize Intelligence</h2>
              <p className="text-slate-400 text-base mb-10 leading-relaxed">
                Enter your website URL. Our Intelligence Layer will scrape and audit your business context to provision your environment.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Platform Domain</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="https://your-product.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleStartAnalysis}
                  disabled={!websiteUrl}
                  className="w-full py-5 bg-white text-black hover:bg-slate-100 disabled:opacity-50 rounded-2xl font-bold text-sm shadow-xl transition-all mt-4 flex items-center justify-center gap-2 group"
                >
                  Start Context Discovery
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {onboardingStage === 'analyzing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 relative z-10">
              <div className="relative w-24 h-24 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border-4 border-t-blue-400 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Radar className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Analyzing Business Logic</h2>
              <div className="space-y-3 max-w-xs mx-auto">
                <motion.p 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-blue-400 font-mono"
                >
                  [Scraping {websiteUrl}]
                </motion.p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Extracting product ICP, conversion pathways, and market positioning...
                </p>
              </div>
            </motion.div>
          )}

          {onboardingStage === 'blueprint' && blueprint && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Business Blueprint</h2>
                  <p className="text-xs text-slate-500">Intelligence layer findings for {websiteUrl}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                  AUDIT COMPLETE
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 space-y-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-600 mb-1">Product</label>
                    <p className="text-sm font-semibold">{blueprint.product_name}</p>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-600 mb-1">Category</label>
                    <p className="text-sm font-semibold">{blueprint.category}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-600 mb-1">Detected ICP</label>
                  <p className="text-xs text-slate-300 leading-relaxed">{blueprint.icp}</p>
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-slate-600 mb-1">Conversion Pathway</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {blueprint.conversion_pathway.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-slate-400">{step}</span>
                        {i < blueprint.conversion_pathway.length - 1 && <ArrowRight className="w-3 h-3 text-slate-700" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <h3 className="text-sm font-bold text-slate-200">Refining Intelligence (Q&A)</h3>
                {questions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-xs text-slate-400 mb-3">{q.question}</label>
                    {q.type === 'choice' ? (
                      <div className="grid grid-cols-2 gap-3">
                        {q.options?.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                            className={`px-4 py-3 rounded-xl border text-[11px] font-medium transition-all ${
                              answers[q.id] === opt 
                                ? 'bg-blue-600 border-blue-500 text-white' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input 
                        type="text"
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setOnboardingStage('logs')}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Verify & Continue
              </button>
            </motion.div>
          )}

          {onboardingStage === 'logs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20">
                <Activity className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Connect Live Data</h2>
              <p className="text-slate-400 text-base mb-10 leading-relaxed">
                Final step: expose your application logs. We'll map your raw events to the business blueprint we just verified.
              </p>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 mb-10 flex items-start gap-4">
                <Shield className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  Viktron uses PII redaction by default. Your logs are scrubbed before they hit our storage, ensuring SOC2 and GDPR compliance out of the box.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <button className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold">API Logs</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Database className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold">PostgreSQL Sync</span>
                </button>
              </div>

              <button 
                onClick={handleFinalizeOnboarding}
                disabled={isProvisioning}
                className="w-full py-5 bg-white text-black hover:bg-slate-100 disabled:opacity-50 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isProvisioning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Provisioning Cloud...
                  </>
                ) : (
                  'Complete & Launch Profound Intelligence'
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }
;
