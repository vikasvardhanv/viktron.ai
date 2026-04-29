/**
 * Viktron Analytics Platform — analytics.viktron.ai
 * Full onboarding → snippet install → live dashboard flow.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart3, Brain, CheckCircle2, ChevronRight,
  Copy, Database, Globe, Loader2, RefreshCw, Search, Settings,
  Shield, ShieldCheck, Sparkles, Terminal, TrendingUp, AlertCircle,
  LayoutDashboard, Zap, Send,
} from 'lucide-react';
import { authFetch, useAuth } from '../../context/AuthContext';

// ── API base ──────────────────────────────────────────────────────────────────

const getApiBase = (): string => {
  if (typeof window === 'undefined') return '/api';
  const host = window.location.hostname.replace(/^www\./, '');
  if (host === 'viktron.ai' || host.endsWith('.viktron.ai')) return 'https://viktron.ai/api';
  const env = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return env ? `${env}/api` : '/api';
};

const API = getApiBase();
const WS_KEY = 'viktron_analytics_workspace_id';

// ── Types ─────────────────────────────────────────────────────────────────────

type OnboardQuestion = { id: string; label: string; type: 'text' | 'select'; options?: string[] };
type SdkConfig = { workspace_id: string; install_method: string; snippet: string; install_steps: string[]; verification_event: string; docs_url: string };
type Kpi = { label: string; value: string | number; delta: string; trend: 'up' | 'down' | 'flat' };
type OverviewData = { kpis: Kpi[]; time_series: { labels: string[]; events_per_day: number[] }; top_tool_failures: { tool: string; count: number }[] };

type Phase =
  | { name: 'auth_loading' }
  | { name: 'onboard_step1' }
  | { name: 'onboard_step2'; jobId: string; questions: OnboardQuestion[]; blueprint: Record<string, unknown> }
  | { name: 'snippet'; sdkConfig: SdkConfig; workspaceId: string }
  | { name: 'verify'; workspaceId: string; sdkConfig: SdkConfig }
  | { name: 'dashboard'; workspaceId: string; data: OverviewData | null; loading: boolean }
  | { name: 'error'; message: string };

// ── Shared UI ─────────────────────────────────────────────────────────────────

const FU: React.FC<{ d?: number; children: React.ReactNode; className?: string }> = ({ d = 0, children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Panel: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`obsidian-panel p-6 border border-white/5 ${className}`}>
    {title && (
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">{title}</span>
      </div>
    )}
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.3em] uppercase font-bold mb-4">
    <div className="w-8 h-px bg-primary" />
    {children}
  </div>
);

// ── Step 1: URL Input ─────────────────────────────────────────────────────────

const OnboardStep1: React.FC<{ onNext: (url: string, mode: string, jobId: string, questions: OnboardQuestion[], blueprint: Record<string, unknown>) => void }> = ({ onNext }) => {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'product_intelligence' | 'ai_visibility'>('product_intelligence');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMode, setInfoMode] = useState<'product_intelligence' | 'ai_visibility' | null>(null);

  const definitions = {
    product_intelligence: {
      title: 'Product Intelligence',
      desc: 'Deep-dive analytics focused on user behavior, conversion funnels, and feature retention. Use natural language to query your raw event data and get instant insights into user drop-offs and engagement drivers.'
    },
    ai_visibility: {
      title: 'AI Visibility',
      desc: 'Specialized tracking to measure how your brand is being cited within AI search engines and LLM-powered answer engines. Understand your "Share of Voice" in the age of generative search and optimize for AI discovery.'
    }
  };

  const submit = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError('Enter your product URL'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/analytics/onboard/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed, mode }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || 'URL analysis failed');
      }
      const data = await res.json();
      onNext(trimmed, mode, data.job_id, data.onboarding_questions || [], data.blueprint || {});
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto space-y-10">
      <FU>
        <Label>ANALYTICS_ONBOARDING // STEP 1</Label>
        <h1 className="heading-precision text-5xl text-white uppercase tracking-tighter leading-none">
          CONNECT<br /><span className="text-zinc-700">YOUR PRODUCT.</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-6 leading-relaxed">
          Enter your product URL. We'll analyze it, detect your stack, and configure the right tracking setup automatically.
        </p>
      </FU>

      <FU d={0.1}>
        <Panel>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">PRODUCT_URL</label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="https://yourapp.com"
                className="w-full bg-[#080808] border border-white/5 px-5 py-4 font-mono text-sm text-white outline-none focus:border-primary transition-all placeholder-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">ANALYTICS_MODE</label>
              <div className="grid grid-cols-2 gap-3">
                {(['product_intelligence', 'ai_visibility'] as const).map(m => (
                  <div key={m} className="relative group">
                    <button
                      onClick={() => setMode(m)}
                      className={`w-full p-4 border text-left transition-all relative ${mode === m ? 'border-primary bg-primary/5 text-white' : 'border-white/5 text-zinc-500 hover:border-white/20'}`}
                    >
                      <div className="font-mono text-[10px] uppercase tracking-widest font-bold mb-1">
                        {m === 'product_intelligence' ? 'Product Intelligence' : 'AI Visibility'}
                      </div>
                      <div className="text-[9px] text-zinc-600 leading-relaxed pr-6">
                        {m === 'product_intelligence' ? 'Events, funnels, retention, AI ask' : 'Track brand mentions in AI search engines'}
                      </div>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setInfoMode(m); }}
                      className="absolute top-3 right-3 p-1 text-zinc-700 hover:text-primary transition-colors"
                      title="Learn more"
                    >
                      <AlertCircle size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {infoMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                  onClick={() => setInfoMode(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="max-w-md w-full obsidian-panel p-8 border-primary/20 shadow-[0_0_50px_rgba(204,255,0,0.1)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 font-mono text-[10px] text-primary mb-4 tracking-[0.3em] uppercase font-bold">
                       <div className="w-6 h-px bg-primary" />
                       Mode_Definition
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-4">{definitions[infoMode].title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed font-light mb-8">
                      {definitions[infoMode].desc}
                    </p>
                    <button 
                      onClick={() => setInfoMode(null)}
                      className="w-full btn-obsidian py-3 text-[10px] font-black uppercase tracking-widest"
                    >
                      Close Definition
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full btn-acid py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : <>Analyze Product <ArrowRight size={16} /></>}
            </button>
          </div>
        </Panel>
      </FU>
    </div>
  );
};

// ── Step 2: Blueprint + Questions ─────────────────────────────────────────────

const OnboardStep2: React.FC<{
  jobId: string;
  questions: OnboardQuestion[];
  blueprint: Record<string, unknown>;
  onNext: (workspaceId: string, sdkConfig: SdkConfig) => void;
  onBack: () => void;
}> = ({ jobId, questions, blueprint, onNext, onBack }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const provision = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch(`${API}/analytics/onboard/provision`, {
        method: 'POST',
        body: JSON.stringify({ job_id: jobId, answers }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || 'Provisioning failed');
      }
      const data = await res.json();
      localStorage.setItem(WS_KEY, data.workspace_id);
      onNext(data.workspace_id, data.sdk_config);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Provisioning failed');
    } finally {
      setLoading(false);
    }
  };

  const bp = blueprint as Record<string, string>;

  return (
    <div className="max-w-2xl w-full mx-auto space-y-8">
      <FU>
        <Label>ANALYTICS_ONBOARDING // STEP 2</Label>
        <h1 className="heading-precision text-5xl text-white uppercase tracking-tighter leading-none">
          BLUEPRINT<br /><span className="text-zinc-700">DETECTED.</span>
        </h1>
      </FU>

      {bp.product_name && (
        <FU d={0.05}>
          <Panel title="PRODUCT_INTEL">
            <div className="space-y-3 font-mono text-[11px]">
              {bp.product_name && <div className="flex justify-between"><span className="text-zinc-600 uppercase tracking-widest">Product</span><span className="text-white">{bp.product_name}</span></div>}
              {bp.category && <div className="flex justify-between"><span className="text-zinc-600 uppercase tracking-widest">Category</span><span className="text-zinc-300">{bp.category}</span></div>}
              {bp.value_proposition && <div className="flex justify-between"><span className="text-zinc-600 uppercase tracking-widest">Positioning</span><span className="text-zinc-400 text-right max-w-xs">{bp.value_proposition}</span></div>}
            </div>
          </Panel>
        </FU>
      )}

      {questions.length > 0 && (
        <FU d={0.1}>
          <Panel title="ONBOARDING_QUESTIONS">
            <div className="space-y-5">
              {questions.map((q, i) => (
                <div key={q.id || i} className="space-y-2">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{q.label}</label>
                  {q.type === 'select' && q.options ? (
                    <select
                      className="w-full bg-[#080808] border border-white/5 px-4 py-3 font-mono text-[11px] text-zinc-300 outline-none focus:border-primary transition-all"
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-[#080808] border border-white/5 px-4 py-3 font-mono text-[11px] text-white outline-none focus:border-primary transition-all"
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </Panel>
        </FU>
      )}

      {error && (
        <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <FU d={0.15}>
        <div className="flex gap-4">
          <button onClick={onBack} className="btn-obsidian flex-1 py-5 text-xs uppercase tracking-widest font-black">
            Back
          </button>
          <button
            onClick={provision}
            disabled={loading}
            className="btn-acid flex-[2] py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Provisioning…</> : <>Provision Workspace <ArrowRight size={16} /></>}
          </button>
        </div>
      </FU>
    </div>
  );
};

// ── Snippet Step ──────────────────────────────────────────────────────────────

const SnippetStep: React.FC<{ sdkConfig: SdkConfig; workspaceId: string; onDone: () => void }> = ({ sdkConfig, workspaceId, onDone }) => {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const copy = () => {
    navigator.clipboard.writeText(sdkConfig.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verify = async () => {
    setVerifying(true);
    setVerifyError('');
    try {
      const res = await authFetch(`${API}/analytics/agents/verify/${workspaceId}`);
      if (!res.ok) throw new Error('No events detected yet');
      const d = await res.json();
      if (d.events_detected === false) throw new Error('No events detected yet — deploy your snippet and generate traffic first');
      setVerified(true);
    } catch (e: unknown) {
      setVerifyError(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto space-y-8">
      <FU>
        <Label>INSTALL_SDK // STEP 3</Label>
        <h1 className="heading-precision text-5xl text-white uppercase tracking-tighter leading-none">
          INSTALL<br /><span className="text-zinc-700">SNIPPET.</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
          Add this snippet to your product. Events stream to your dashboard automatically within 60 seconds of deployment.
        </p>
      </FU>

      <FU d={0.1}>
        <Panel title={`WORKSPACE_ID: ${workspaceId.slice(0, 8)}…`}>
          <div className="relative bg-[#060606] border border-white/5 p-4 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap break-all leading-relaxed">
            {sdkConfig.snippet}
            <button
              onClick={copy}
              className="absolute top-3 right-3 p-2 bg-[#0a0a0a] border border-white/5 hover:border-primary/40 text-zinc-500 hover:text-primary transition-all"
            >
              {copied ? <CheckCircle2 size={14} className="text-primary" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {sdkConfig.install_steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <div className="w-5 h-5 border border-white/10 flex items-center justify-center text-[9px] text-primary font-black">{i + 1}</div>
                {step}
              </div>
            ))}
          </div>
        </Panel>
      </FU>

      {verifyError && (
        <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          <AlertCircle size={14} /> {verifyError}
        </div>
      )}

      <FU d={0.15}>
        <div className="flex gap-4">
          <button
            onClick={verify}
            disabled={verifying || verified}
            className="btn-obsidian flex-1 py-5 flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-black disabled:opacity-50"
          >
            {verifying ? <><Loader2 size={14} className="animate-spin" /> Verifying…</> : verified ? <><CheckCircle2 size={14} className="text-primary" /> Verified</> : 'Verify Installation'}
          </button>
          <button
            onClick={onDone}
            className="btn-acid flex-[2] py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em]"
          >
            Open Dashboard <ArrowRight size={16} />
          </button>
        </div>
      </FU>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

const Dashboard: React.FC<{ workspaceId: string; onReset: () => void }> = ({ workspaceId, onReset }) => {
  const { user } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // AI Ask state
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const fetchOverview = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await authFetch(`${API}/saas/overview?workspace_id=${encodeURIComponent(workspaceId)}&lookback_days=30`);
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const d = await res.json();
      setData(d);
    } catch (e: unknown) {
      setFetchError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOverview(); }, [workspaceId]);

  const askAI = async () => {
    if (!question.trim()) return;
    setAiLoading(true);
    setAiError('');
    setAiAnswer('');
    try {
      const res = await authFetch(`${API}/saas/ai/ask`, {
        method: 'POST',
        body: JSON.stringify({ workspace_id: workspaceId, question: question.trim() }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const d = await res.json();
      setAiAnswer(d.answer);
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : 'AI unavailable');
    } finally {
      setAiLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Activity },
    { id: 'ai-ask', label: 'AI Ask', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-[#080808]/60 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 obsidian-inset flex items-center justify-center border border-primary/20">
              <img src="/visuals/viktronlogo.png" alt="Logo" className="w-5 h-5 grayscale" />
            </div>
            <span className="font-mono font-black uppercase tracking-[0.25em] text-xs">Analytics</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 transition-all ${
                activeTab === item.id ? 'bg-primary text-black font-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={15} />
              <span className="text-[10px] font-mono uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={12} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest truncate">
            WS: {workspaceId.slice(0, 12)}…
          </div>
          <button
            onClick={onReset}
            className="text-[9px] font-mono text-zinc-600 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            Disconnect Workspace
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-[#050505]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(204,255,0,0.8)]" />
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em]">LIVE</span>
            </div>
            <div className="w-px h-4 bg-white/5" />
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{today}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchOverview} disabled={loading} className="obsidian-inset p-2 text-zinc-500 hover:text-primary transition-colors disabled:opacity-30">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <span className="text-[10px] font-mono text-zinc-600 truncate max-w-xs">{user?.email || ''}</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 space-y-8"
              >
                {fetchError && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
                    <AlertCircle size={16} /> {fetchError}
                    <button onClick={fetchOverview} className="ml-auto underline text-xs">Retry</button>
                  </div>
                )}

                {/* KPI Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Panel key={i} className="animate-pulse">
                          <div className="h-8 bg-white/5 rounded mb-2" />
                          <div className="h-3 bg-white/5 rounded w-1/2" />
                        </Panel>
                      ))
                    : (data?.kpis || []).map((kpi, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                          <Panel title={kpi.label.toUpperCase()}>
                            <div className="flex items-end justify-between mt-2">
                              <span className="text-3xl font-black tracking-tighter text-white">{kpi.value}</span>
                              <span className={`text-[10px] font-mono font-bold ${kpi.trend === 'up' ? 'text-primary' : kpi.trend === 'down' ? 'text-red-400' : 'text-zinc-500'}`}>
                                {kpi.delta}
                              </span>
                            </div>
                          </Panel>
                        </motion.div>
                      ))
                  }
                </div>

                {/* Time Series Chart */}
                {data?.time_series && (
                  <Panel title="EVENTS_OVER_TIME">
                    {data.time_series.events_per_day.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                        No events yet — install the snippet and generate traffic
                      </div>
                    ) : (
                      <div className="mt-4 h-48 flex items-end gap-1.5 px-2">
                        {data.time_series.events_per_day.map((v, i) => {
                          const max = Math.max(...data.time_series.events_per_day, 1);
                          const pct = (v / max) * 100;
                          return (
                            <motion.div
                              key={i}
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ delay: i * 0.03, duration: 0.5 }}
                              className="flex-1 bg-primary/20 border-t border-primary/40 relative group cursor-pointer"
                              style={{ height: `${Math.max(pct, 2)}%` }}
                              title={`${v} events — ${data.time_series.labels[i] || ''}`}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black border border-primary/20 px-2 py-1 text-[9px] font-mono text-primary whitespace-nowrap z-10">
                                {v} events
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                    {data.time_series.labels.length > 0 && (
                      <div className="mt-3 flex justify-between font-mono text-[9px] text-zinc-700 uppercase px-2">
                        <span>{data.time_series.labels[0]}</span>
                        <span>{data.time_series.labels[data.time_series.labels.length - 1]}</span>
                      </div>
                    )}
                  </Panel>
                )}

                {/* Tool Failures */}
                {(data?.top_tool_failures || []).length > 0 && (
                  <Panel title="TOP_TOOL_FAILURES">
                    <div className="space-y-3 mt-2">
                      {data!.top_tool_failures.map((f, i) => (
                        <div key={i} className="flex justify-between items-center font-mono text-[11px]">
                          <span className="text-zinc-400 uppercase tracking-wider">{f.tool}</span>
                          <span className="text-red-400 font-bold">{f.count}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
                <Panel title="LIVE_EVENT_STREAM">
                  {loading ? (
                    <div className="flex items-center justify-center h-40 text-zinc-600 font-mono text-xs">Loading…</div>
                  ) : (data?.time_series?.events_per_day || []).reduce((a, b) => a + b, 0) === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
                      <Terminal size={24} className="text-zinc-700" />
                      <div>
                        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No events yet</p>
                        <p className="text-zinc-700 font-mono text-[10px] mt-1">Deploy your snippet and generate traffic to see events here</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2 font-mono text-[11px]">
                      {data?.time_series?.labels.slice(-10).map((label, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 text-zinc-400">
                          <span className="text-zinc-600">{label}</span>
                          <span className="text-white font-bold">{data.time_series.events_per_day[i]} events</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              </motion.div>
            )}

            {activeTab === 'ai-ask' && (
              <motion.div key="ai-ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 space-y-6">
                <Panel title="AI_ANALYTICS_ASSISTANT">
                  <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                    Ask anything about your analytics data. The AI has access to your last 30 days of events, missions, LLM calls, and tool failures.
                  </p>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !aiLoading && askAI()}
                        placeholder="What's my mission success rate this week?"
                        className="w-full bg-[#060606] border border-white/5 px-5 py-4 pr-14 font-mono text-sm text-white outline-none focus:border-primary transition-all placeholder-zinc-700"
                      />
                      <button
                        onClick={askAI}
                        disabled={aiLoading || !question.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-primary transition-colors disabled:opacity-30"
                      >
                        {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['What are my top failing tools?', 'How many events this week?', 'Summarize mission performance'].map(q => (
                        <button
                          key={q}
                          onClick={() => setQuestion(q)}
                          className="text-[10px] font-mono text-zinc-600 hover:text-primary border border-white/5 hover:border-primary/20 px-3 py-1.5 transition-all uppercase tracking-wider"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </Panel>

                {(aiAnswer || aiError || aiLoading) && (
                  <Panel title="AI_RESPONSE">
                    {aiLoading && (
                      <div className="flex items-center gap-3 text-zinc-500 font-mono text-sm">
                        <Loader2 size={16} className="animate-spin text-primary" /> Analyzing your data…
                      </div>
                    )}
                    {aiError && (
                      <div className="flex items-center gap-3 text-red-400 font-mono text-sm">
                        <AlertCircle size={16} /> {aiError}
                      </div>
                    )}
                    {aiAnswer && (
                      <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-light">{aiAnswer}</div>
                    )}
                  </Panel>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
                <Panel title="WORKSPACE_SETTINGS">
                  <div className="space-y-5 font-mono text-[11px]">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-zinc-500 uppercase tracking-widest">Workspace ID</span>
                      <span className="text-white">{workspaceId}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-zinc-500 uppercase tracking-widest">Docs</span>
                      <a href="https://docs.viktron.ai/sdk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">docs.viktron.ai/sdk</a>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={onReset}
                        className="text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-4 py-2.5 transition-all text-[10px] uppercase tracking-widest"
                      >
                        Disconnect Workspace
                      </button>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// ── Root Component ────────────────────────────────────────────────────────────

export const AnalyticsApp: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>({ name: 'auth_loading' });

  // Auth gate
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    // Check for existing workspace
    const storedWs = localStorage.getItem(WS_KEY);
    if (storedWs) {
      setPhase({ name: 'dashboard', workspaceId: storedWs, data: null, loading: true });
    } else {
      setPhase({ name: 'onboard_step1' });
    }
  }, [user, authLoading]);

  const resetWorkspace = () => {
    localStorage.removeItem(WS_KEY);
    setPhase({ name: 'onboard_step1' });
  };

  if (phase.name === 'auth_loading' || authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex items-center gap-4 font-mono text-[11px] text-zinc-600 uppercase tracking-widest">
          <Loader2 size={20} className="animate-spin text-primary" />
          Initializing…
        </div>
      </div>
    );
  }

  if (phase.name === 'dashboard') {
    return <Dashboard workspaceId={phase.workspaceId} onReset={resetWorkspace} />;
  }

  // Onboarding shell (centered layout)
  return (
    <div className="min-h-screen bg-[#050505] flex items-start justify-center pt-20 pb-20 px-6 relative overflow-x-hidden">
      <div className="absolute inset-0 grid-paper opacity-[0.04] pointer-events-none" />
      <div className="w-full relative z-10">
        <AnimatePresence mode="wait">
          {phase.name === 'onboard_step1' && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OnboardStep1
                onNext={(_, __, jobId, questions, blueprint) =>
                  setPhase({ name: 'onboard_step2', jobId, questions, blueprint })
                }
              />
            </motion.div>
          )}

          {phase.name === 'onboard_step2' && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OnboardStep2
                jobId={phase.jobId}
                questions={phase.questions}
                blueprint={phase.blueprint}
                onNext={(workspaceId, sdkConfig) =>
                  setPhase({ name: 'snippet', sdkConfig, workspaceId })
                }
                onBack={() => setPhase({ name: 'onboard_step1' })}
              />
            </motion.div>
          )}

          {phase.name === 'snippet' && (
            <motion.div key="snippet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SnippetStep
                sdkConfig={phase.sdkConfig}
                workspaceId={phase.workspaceId}
                onDone={() => setPhase({ name: 'dashboard', workspaceId: phase.workspaceId, data: null, loading: true })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyticsApp;
