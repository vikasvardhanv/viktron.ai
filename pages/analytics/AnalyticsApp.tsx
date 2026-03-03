import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart3, Brain, TrendingUp, Users, Activity, Eye, Zap,
  ArrowRight, ArrowUpRight, ArrowDownRight, ChevronRight,
  Globe, MessageSquare, Target, Layers, Sparkles, Shield,
  Bell, Settings, Home, PieChart, FileText, Radio,
  Filter, Download, RefreshCw, Search, Star, AlertTriangle,
  CheckCircle2, Clock, DollarSign, Hash, ThumbsUp, Flame,
  MousePointer, Funnel, RotateCcw, TrendingDown, Cpu,
  BookOpen, Send, ExternalLink, ChevronDown, LogOut
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
type View = 'dashboard' | 'community' | 'users' | 'reports' | 'pricing';

// ── Sparkline mini-chart ───────────────────────────────────────────────────────
const Sparkline: React.FC<{ data: number[]; color: string; height?: number }> = ({
  data, color, height = 32
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = height;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20" style={{ height }}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"
        strokeLinejoin="round" points={pts} />
    </svg>
  );
};

// ── Bar mini-chart ─────────────────────────────────────────────────────────────
const MiniBar: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.03 }}
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color }}
          className="flex-1 rounded-sm origin-bottom opacity-80"
        />
      ))}
    </div>
  );
};

// ── KPI Card ───────────────────────────────────────────────────────────────────
const KPICard: React.FC<{
  label: string; value: string; change: string; positive: boolean;
  subtext: string; sparkData: number[]; color: string; icon: React.ReactNode;
}> = ({ label, value, change, positive, subtext, sparkData, color, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5 hover:border-white/20 transition-colors"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <span className={`text-xs font-mono flex items-center gap-1 px-2 py-0.5 rounded-full ${positive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </span>
    </div>
    <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    <p className="text-xs text-slate-500 mt-0.5 mb-3">{label}</p>
    <div className="flex items-end justify-between">
      <p className="text-[10px] text-slate-600 font-mono">{subtext}</p>
      <Sparkline data={sparkData} color={color} />
    </div>
  </motion.div>
);

// ── Signal Badge ───────────────────────────────────────────────────────────────
const strength: Record<string, { cls: string; label: string }> = {
  red:    { cls: 'bg-red-500/20 text-red-400 border-red-500/30',     label: 'TRENDING' },
  yellow: { cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'RISING' },
  green:  { cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'EMERGING' },
};
const SignalBadge: React.FC<{ level: 'red' | 'yellow' | 'green' }> = ({ level }) => {
  const { cls, label } = strength[level];
  return (
    <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded ${cls}`}>{label}</span>
  );
};

// ── Community Intelligence View ────────────────────────────────────────────────
const CommunityIntelligenceView: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState(0);

  const themes = [
    {
      title: 'OpenAI/Pentagon Schism & Anthropic Surge',
      signal: 'red' as const,
      upvotes: '100,000+',
      subreddits: ['r/ChatGPT', 'r/OpenAI', 'r/ClaudeAI', 'r/Futurology'],
      summary: 'OpenAI signed a deal with the U.S. Department of War. Anthropic refused and was designated a supply chain risk. Triggered mass ChatGPT cancellations and drove Claude to #1 on the Apple App Store.',
      prediction: 'This event is actively reshaping user behavior NOW. The tribalism between OpenAI and Anthropic communities will define the competitive landscape for months.',
      actions: ['Claude now #1 on App Store', '50k+ combined upvotes on cancellation posts', 'Brand surge for Anthropic'],
    },
    {
      title: 'Vibe Coding: From Meme to Movement',
      signal: 'yellow' as const,
      upvotes: '1,720',
      subreddits: ['r/vibecoding', 'r/SideProject'],
      summary: 'Vibe coding has crossed from niche hacker culture into a self-sustaining community with its own identity and economy. Real revenue ("vibe revenue") is being reported.',
      prediction: '"Vibe coding economics" — real revenue from AI-built products — is the next viral content category. Get ahead of it now.',
      actions: ['3D GitHub cities going viral', 'Claude Code birthday post: 1,885 upvotes', 'Vibe revenue emerging'],
    },
    {
      title: 'Token Cost as the New Competitive Battleground',
      signal: 'green' as const,
      upvotes: '166',
      subreddits: ['r/mcp', 'r/ChatGPTPro'],
      summary: '94% token reduction via MCP CLI generation. Charlotte browser MCP with 136x smaller footprint than Playwright. Performance optimization is becoming a competitive differentiator.',
      prediction: 'Token cost optimization tools will have strong B2B demand within 90 days. This will be a top-5 theme in AI dev communities within 30–60 days.',
      actions: ['94% token reduction demonstrated', '136x smaller MCP footprint', 'Enterprise adoption imminent'],
    },
    {
      title: 'Multi-Agent Communication Infrastructure',
      signal: 'green' as const,
      upvotes: '1,720',
      subreddits: ['r/vibecoding', 'r/automation'],
      summary: 'Builders creating chat rooms so multiple AI agents can talk to each other. Grassroots solution to a real pain point — agents don\'t natively communicate.',
      prediction: 'Agent communication protocols will be a hot topic at AI conferences within 90 days. A product company that solves this natively has a major opportunity.',
      actions: ['Cross-community signal confirmation', 'Infrastructure gap identified', 'VC interest expected'],
    },
    {
      title: 'Hallucination Root Cause Found?',
      signal: 'yellow' as const,
      upvotes: '663',
      subreddits: ['r/accelerate'],
      summary: 'Chinese researchers claim to have found the root cause of hallucinations in LLMs. Relatively modest engagement for a potentially massive claim.',
      prediction: 'If validated, this would be the most significant LLM research breakthrough in years. Watch for follow-up papers and replications.',
      actions: ['663 upvotes on r/accelerate', 'Peer review pending', 'Mainstream pickup incoming'],
    },
  ];

  const topPosts = [
    { sub: 'r/ChatGPT', post: "You're now training a war machine. Let's see proof of cancellation.", score: 30848, theme: 'OpenAI/Pentagon backlash' },
    { sub: 'r/Futurology', post: '"Cancel ChatGPT" movement goes mainstream after OpenAI/DoW deal', score: 31953, theme: 'AI ethics / politics' },
    { sub: 'r/ClaudeAI', post: 'Outside Anthropic Office in SF "Thank You"', score: 5845, theme: 'Anthropic brand surge' },
    { sub: 'r/vibecoding', post: "I got tired of copy pasting between agents. I made a chat room so they can talk to each other", score: 1720, theme: 'Multi-agent architecture' },
    { sub: 'r/accelerate', post: "Dario Amodei — The public is not aware of what's about to happen", score: 1100, theme: 'AGI urgency' },
    { sub: 'r/mcp', post: '7 MCPs that genuinely made me quicker', score: 651, theme: 'MCP productivity' },
    { sub: 'r/singularity', post: 'Cancel your ChatGPT subscriptions and pick up a Claude subscription.', score: 7502, theme: 'Platform migration' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Community Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">
            AI-extracted signals from <span className="text-emerald-400 font-mono">878 posts</span> across{' '}
            <span className="text-emerald-400 font-mono">18 subreddits</span> — March 2, 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE MONITORING
          </div>
          <button className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Posts Analyzed', value: '878', sub: 'past 7 days' },
          { label: 'Subreddits', value: '18', sub: 'monitored' },
          { label: 'Pre-viral Signals', value: '12', sub: 'detected' },
          { label: 'Audience Reach', value: '20M+', sub: 'subscribers represented' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0f1117] border border-white/[0.07] rounded-xl p-4">
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            <p className="text-[10px] text-slate-600 font-mono">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Theme list */}
        <div className="col-span-2 space-y-2">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">Trending Themes</p>
          {themes.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTheme(i)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                activeTheme === i
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-[#0f1117] border-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-semibold text-white leading-tight flex-1">{t.title}</p>
                <SignalBadge level={t.signal} />
              </div>
              <p className="text-[10px] text-slate-500 font-mono">{t.subreddits.slice(0, 2).join(', ')}</p>
            </button>
          ))}
        </div>

        {/* Theme Detail */}
        <div className="col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTheme}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5 h-full"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <SignalBadge level={themes[activeTheme].signal} />
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <ThumbsUp className="w-3 h-3" /> {themes[activeTheme].upvotes} upvotes
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">{themes[activeTheme].title}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {themes[activeTheme].subreddits.map(s => (
                  <span key={s} className="text-[10px] font-mono bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1.5 tracking-wider">Summary</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{themes[activeTheme].summary}</p>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-amber-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3" /> AI Prediction
                  </p>
                  <p className="text-sm text-amber-200/80 leading-relaxed">{themes[activeTheme].prediction}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1.5 tracking-wider">Key Signals</p>
                  {themes[activeTheme].actions.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Top Posts Table */}
      <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Top Posts This Week</p>
          <button className="text-xs text-slate-500 flex items-center gap-1 hover:text-slate-300">
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-5 py-2.5 font-mono text-slate-600 uppercase tracking-wider">Subreddit</th>
                <th className="text-left px-4 py-2.5 font-mono text-slate-600 uppercase tracking-wider">Post</th>
                <th className="text-right px-4 py-2.5 font-mono text-slate-600 uppercase tracking-wider">Score</th>
                <th className="text-left px-4 py-2.5 font-mono text-slate-600 uppercase tracking-wider">Theme</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((p, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-emerald-400 whitespace-nowrap">{p.sub}</td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs">
                    <p className="truncate">{p.post}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white font-mono whitespace-nowrap">
                    {p.score.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full">
                      {p.theme}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── User Analytics View (Amplitude-like) ──────────────────────────────────────
const UserAnalyticsView: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'users' | 'sessions' | 'events'>('users');
  const [activeFunnel, setActiveFunnel] = useState(0);

  const funnels = [
    {
      name: 'Visitor → Agent Trial',
      steps: [
        { name: 'Landed on Site', count: 8420, pct: 100 },
        { name: 'Viewed Agent Demo', count: 3286, pct: 39 },
        { name: 'Clicked "Try Now"', count: 1102, pct: 13 },
        { name: 'Started Trial', count: 441, pct: 5.2 },
        { name: 'Activated Agent', count: 198, pct: 2.4 },
      ],
    },
    {
      name: 'Chatbot → Conversion',
      steps: [
        { name: 'Chatbot Opened', count: 4210, pct: 100 },
        { name: 'First Message Sent', count: 3368, pct: 80 },
        { name: 'Reached 3+ Turns', count: 1726, pct: 41 },
        { name: 'Submitted Contact', count: 527, pct: 12.5 },
        { name: 'Booked Demo', count: 132, pct: 3.1 },
      ],
    },
  ];

  const cohortData = [
    { week: 'Week 1', w0: 100, w1: 68, w2: 52, w3: 44, w4: 40 },
    { week: 'Week 2', w0: 100, w1: 72, w2: 58, w3: 47, w4: null },
    { week: 'Week 3', w0: 100, w1: 75, w2: 61, w3: null, w4: null },
    { week: 'Week 4', w0: 100, w1: 70, w2: null, w3: null, w4: null },
  ];

  const aiInsights = [
    { type: 'opportunity', icon: Sparkles, title: 'Drop-off after Demo page is AI-detectable', body: 'Users who watch >60% of the agent demo convert at 3.4× the rate. Add a persistent CTA overlay after the 60% mark.' },
    { type: 'warning', icon: AlertTriangle, title: 'Mobile chatbot engagement declining', body: 'Mobile users send 41% fewer messages since the last UI update (March 1). The new input field appears below the fold on iOS 17.' },
    { type: 'success', icon: TrendingUp, title: 'Tuesday afternoon peak discovered', body: 'AI agent interactions peak at 2–4 PM on Tuesdays. Scheduling proactive outreach for that window could increase conversions by ~18%.' },
    { type: 'info', icon: Brain, title: 'High-intent behavior cluster identified', body: '320 users have visited Pricing + Demo + Agents pages in a single session this week. Trigger direct outreach to this segment.' },
  ];

  const insightColor: Record<string, string> = {
    opportunity: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
    success: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
    info: 'text-purple-400 bg-purple-400/10 border-purple-500/20',
  };

  const sparkValues: Record<'users' | 'sessions' | 'events', number[]> = {
    users: [420, 480, 390, 520, 610, 580, 670, 720, 690, 810, 760, 880, 840, 920, 980],
    sessions: [1200, 1350, 1100, 1480, 1620, 1590, 1740, 1820, 1780, 1950, 1900, 2100, 2050, 2280, 2420],
    events: [8400, 9100, 7800, 10200, 11800, 11200, 12400, 13100, 12900, 14200, 13800, 15600, 15100, 16800, 17400],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">AI-powered behavioral intelligence — every click, session, and conversion explained</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white/5 border border-white/10 text-slate-400 text-xs rounded-lg px-3 py-1.5 outline-none">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </div>
      </div>

      {/* Metric tabs + Sparkline chart */}
      <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center gap-1 mb-5">
          {(['users', 'sessions', 'events'] as const).map(m => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeMetric === m ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl font-bold text-white">
            {activeMetric === 'users' ? '8,420' : activeMetric === 'sessions' ? '24,200' : '171,400'}
          </span>
          <span className="text-emerald-400 text-sm font-mono">+23.4% vs prior period</span>
        </div>
        {/* Full-width bar chart */}
        <div className="flex items-end gap-1 h-24">
          {sparkValues[activeMetric].map((v, i) => {
            const max = Math.max(...sparkValues[activeMetric]);
            return (
              <motion.div
                key={`${activeMetric}-${i}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex-1 rounded-sm origin-bottom"
                style={{
                  height: `${(v / max) * 100}%`,
                  background: i === sparkValues[activeMetric].length - 1
                    ? 'linear-gradient(to top, #10b981, #34d399)'
                    : 'linear-gradient(to top, #1e3a2e, #2a5c42)',
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-slate-600 font-mono">Feb 1</span>
          <span className="text-[10px] text-slate-600 font-mono">Mar 2</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Funnel */}
        <div className="col-span-2 bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white">Conversion Funnels</p>
            <div className="flex gap-1">
              {funnels.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFunnel(i)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    activeFunnel === i ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-white/10 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeFunnel} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {funnels[activeFunnel].steps.map((step, i) => (
                <div key={i} className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">{step.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white font-mono">{step.count.toLocaleString()}</span>
                      <span className="text-[10px] font-mono w-10 text-right text-slate-500">{step.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${step.pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(to right, #10b981, #3b82f6)`,
                        opacity: 1 - i * 0.12,
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Retention Cohort */}
        <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Retention Cohort</p>
          <div className="space-y-2">
            {cohortData.map((row, r) => (
              <div key={r}>
                <p className="text-[9px] font-mono text-slate-600 mb-1">{row.week}</p>
                <div className="flex gap-1">
                  {[row.w0, row.w1, row.w2, row.w3, row.w4].map((v, c) => (
                    <div
                      key={c}
                      className="flex-1 h-7 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: v === null ? 'transparent' : `rgba(16,185,129,${(v || 0) / 120})`,
                        border: v === null ? '1px solid transparent' : '1px solid rgba(16,185,129,0.1)',
                      }}
                    >
                      {v !== null && <span className="text-[9px] font-mono text-white">{v}%</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-3">
            {['W0', 'W1', 'W2', 'W3', 'W4'].map(w => (
              <div key={w} className="flex-1 text-center text-[9px] font-mono text-slate-600">{w}</div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-purple-400" />
          <p className="text-sm font-semibold text-white">AI-Generated Insights</p>
          <span className="text-[10px] font-mono bg-purple-400/10 text-purple-400 border border-purple-400/20 px-2 py-0.5 rounded-full">4 new today</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {aiInsights.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`p-4 rounded-xl border ${insightColor[ins.type]}`}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-current/10">
                  <ins.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">{ins.title}</p>
                  <p className="text-[11px] opacity-75 leading-relaxed">{ins.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Intelligence Reports View ──────────────────────────────────────────────────
const ReportsView: React.FC = () => {
  const plans = [
    {
      name: 'Creator',
      price: '$49',
      period: '/mo',
      desc: 'For individual AI creators & founders',
      features: ['Weekly AI Community Brief', '5 subreddit monitors', 'Pre-viral signal alerts', 'Email delivery'],
      highlight: false,
      cta: 'Start Free Trial',
    },
    {
      name: 'Pro',
      price: '$199',
      period: '/mo',
      desc: 'For teams and agencies',
      features: ['Everything in Creator', 'Custom subreddit sets', 'Competitive sentiment reports', 'Team seats (5)', 'Slack/Notion integration', 'API access'],
      highlight: true,
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: '$999',
      period: '/mo',
      desc: 'For AI companies & VC funds',
      features: ['Everything in Pro', 'Custom intelligence pipeline', 'White-label reports', 'Monthly retainer calls', 'Deal flow signals', 'Custom integrations'],
      highlight: false,
      cta: 'Contact Sales',
    },
  ];

  const sampleReport = {
    week: 'Week of March 2, 2026',
    headline: 'The Pentagon Schism Rewrites the AI Loyalty Map',
    signals: [
      { icon: Flame, label: 'OpenAI/Pentagon Backlash', trend: '↑ 340%', note: 'Claude now #1 on App Store' },
      { icon: TrendingUp, label: 'Token Efficiency Race', trend: '↑ EMERGING', note: '90-day window to market' },
      { icon: Zap, label: 'Vibe Coding Economics', trend: '↑ RISING', note: 'Real revenue appearing' },
      { icon: AlertTriangle, label: 'Hallucination Root Cause?', trend: '⚡ WATCH', note: 'Chinese researchers claim breakthrough' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Intelligence Reports</h1>
          <p className="text-slate-400 text-sm mt-1">Weekly AI community briefs, custom sentiment reports, and deal-flow signals</p>
        </div>
      </div>

      {/* Sample Report Preview */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0a1a0e] border border-emerald-500/20 rounded-2xl overflow-hidden">
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">AI Community Intelligence Brief</span>
          </div>
          <span className="text-xs font-mono text-slate-500">{sampleReport.week}</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-1">{sampleReport.headline}</h3>
          <p className="text-sm text-slate-400 mb-5">
            878 posts · 18 subreddits · 1 dominant story · 12 pre-viral signals
          </p>
          <div className="grid grid-cols-2 gap-3">
            {sampleReport.signals.map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{s.label}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono text-emerald-400">{s.trend}</span>
                    <span className="text-[10px] text-slate-500">· {s.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              <Send className="w-3.5 h-3.5" /> Subscribe to Weekly Brief
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-white text-xs border border-white/10 px-4 py-2 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" /> Download Sample PDF
            </button>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <p className="text-sm font-semibold text-white mb-4">Intelligence Report Plans</p>
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl p-5 border ${
                plan.highlight
                  ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/30'
                  : 'bg-[#0f1117] border-white/[0.07]'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <p className="text-sm font-bold text-white mb-0.5">{plan.name}</p>
              <p className="text-[10px] text-slate-500 mb-3">{plan.desc}</p>
              <div className="flex items-baseline gap-0.5 mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-500 text-xs">{plan.period}</span>
              </div>
              <div className="space-y-1.5 mb-5">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <button className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                plan.highlight ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            icon: Users,
            title: 'AI Content Creators & YouTubers',
            body: 'Know what topics are about to blow up before they peak. The creator who makes the video this week beats the one who makes it in 3 weeks.',
            tag: 'B2C',
          },
          {
            icon: DollarSign,
            title: 'VC Funds & Investors',
            body: 'Translate Reddit intelligence into investment theses. Surface builder-level signals from the ground up — the kind impossible to get in a boardroom.',
            tag: 'Enterprise',
          },
          {
            icon: Cpu,
            title: 'AI Product Teams',
            body: 'Monitor what your users are actually saying, surface emerging issues before they become PR crises, and identify feature requests before they hit your support queue.',
            tag: 'B2B',
          },
          {
            icon: Globe,
            title: 'Marketing Agencies',
            body: 'A weekly "What to Create This Week" brief tells you the 3–5 topics about to blow up with supporting data. Ride emerging waves rather than chasing them after they peak.',
            tag: 'Agency',
          },
        ].map((uc, i) => (
          <div key={i} className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <uc.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-white">{uc.title}</p>
                  <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-slate-500 px-1.5 py-0.5 rounded">{uc.tag}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{uc.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Dashboard Overview ─────────────────────────────────────────────────────────
const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Your AI-powered analytics command center</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </div>
          <span className="text-xs text-slate-500 font-mono">Updated Mar 2, 2026 · 14:32 UTC</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Unique Visitors" value="8,420" change="23.4%" positive sparkData={[420,480,390,520,610,580,670,720,690,810,760,880,840,920,980]} color="#10b981" icon={<Eye className="w-4 h-4" />} subtext="30-day rolling" />
        <KPICard label="AI Conversations" value="4,204" change="41.2%" positive sparkData={[180,220,160,290,340,310,380,420,400,470,450,520,490,560,610]} color="#3b82f6" icon={<MessageSquare className="w-4 h-4" />} subtext="30-day rolling" />
        <KPICard label="Conversions" value="312" change="18.1%" positive sparkData={[14,18,11,22,27,24,29,33,30,38,34,41,38,45,50]} color="#8b5cf6" icon={<Target className="w-4 h-4" />} subtext="30-day rolling" />
        <KPICard label="Community Signals" value="12" change="4" positive sparkData={[3,4,3,5,6,5,7,6,7,8,8,9,10,11,12]} color="#f59e0b" icon={<Radio className="w-4 h-4" />} subtext="pre-viral detected" />
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Live event stream */}
        <div className="col-span-1 bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white">Live Events</p>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2.5">
            {[
              { icon: MousePointer, label: 'Pricing page view', time: '2s ago', color: '#3b82f6' },
              { icon: MessageSquare, label: 'Chatbot conversation started', time: '8s ago', color: '#10b981' },
              { icon: Target, label: 'Demo form submitted', time: '24s ago', color: '#8b5cf6' },
              { icon: Eye, label: 'Agent page viewed', time: '41s ago', color: '#f59e0b' },
              { icon: Users, label: 'New user registered', time: '1m ago', color: '#10b981' },
              { icon: Activity, label: 'Agent activated in trial', time: '2m ago', color: '#ef4444' },
              { icon: MousePointer, label: 'Feature clicked: Voice Agent', time: '3m ago', color: '#3b82f6' },
            ].map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${e.color}22` }}>
                  <e.icon className="w-3 h-3" style={{ color: e.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 truncate">{e.label}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap">{e.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="col-span-2 bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Traffic Sources & Conversion</p>
          <div className="space-y-3">
            {[
              { source: 'Direct / Organic', visitors: 3210, sessions: 4820, conv: '4.8%', bar: 80 },
              { source: 'LinkedIn Organic', visitors: 1840, sessions: 2410, conv: '6.2%', bar: 60 },
              { source: 'Google Search', visitors: 1420, sessions: 1980, conv: '3.1%', bar: 48 },
              { source: 'Reddit Communities', visitors: 890, sessions: 1240, conv: '7.8%', bar: 34 },
              { source: 'X / Twitter', visitors: 640, sessions: 810, conv: '2.4%', bar: 24 },
              { source: 'Referrals', visitors: 420, sessions: 530, conv: '5.1%', bar: 18 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <p className="text-xs text-slate-400 w-36 shrink-0 truncate">{s.source}</p>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.bar}%` }}
                    transition={{ delay: i * 0.07, duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-blue-500"
                  />
                </div>
                <span className="text-xs font-mono text-white w-14 text-right shrink-0">{s.visitors.toLocaleString()}</span>
                <span className="text-xs font-mono text-emerald-400 w-10 text-right shrink-0">{s.conv}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
            <span className="text-[10px] font-mono text-slate-600">Source · Visitors · Conv. Rate</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Brain className="w-3 h-3" /> Reddit converts 2.4× above avg
            </span>
          </div>
        </div>
      </div>

      {/* Bottom: Top pages + AI recommended actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Top Pages</p>
          {[
            { page: '/ (Home)', views: 3840, bounce: '28%' },
            { page: '/agents', views: 2210, bounce: '22%' },
            { page: '/pricing', views: 1680, bounce: '41%' },
            { page: '/demos', views: 1340, bounce: '19%' },
            { page: '/contact', views: 890, bounce: '35%' },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <p className="text-xs font-mono text-slate-400">{p.page}</p>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-white font-mono">{p.views.toLocaleString()}</span>
                <span className="text-[10px] text-slate-600 font-mono w-10 text-right">{p.bounce}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-purple-400" />
            <p className="text-sm font-semibold text-white">AI Recommended Actions</p>
          </div>
          {[
            { pri: 'HIGH', title: 'Add sticky CTA after 60% demo scroll', impact: '+~18% conversions', color: 'text-red-400' },
            { pri: 'MED', title: 'Fix mobile chatbot input field (iOS 17)', impact: 'Stop 41% drop-off', color: 'text-amber-400' },
            { pri: 'MED', title: 'Target 320 high-intent multi-page visitors', impact: '~$12K pipeline', color: 'text-amber-400' },
            { pri: 'LOW', title: 'A/B test "Try Free" vs "Start Trial" CTA', impact: '+est. 8% CTR', color: 'text-blue-400' },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
              <span className={`text-[9px] font-mono font-bold pt-0.5 w-8 shrink-0 ${a.color}`}>{a.pri}</span>
              <div className="flex-1">
                <p className="text-xs text-slate-300">{a.title}</p>
                <p className="text-[10px] text-emerald-400 font-mono">{a.impact}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Marketing Landing (Hero when not in app mode) ────────────────────────────
const AnalyticsLanding: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const features = [
    { icon: Globe, title: 'Community Intelligence', desc: 'AI-extracted signals from Reddit, X, LinkedIn and Hacker News. Pre-viral detection 3–30 days before mainstream pickup.' },
    { icon: Activity, title: 'User Analytics', desc: 'Amplitude-grade behavioral tracking rebuilt for the AI era. Every click, session, funnel, and cohort — explained by AI.' },
    { icon: Brain, title: 'AI-Generated Insights', desc: 'Not just dashboards — actionable recommendations. Your AI analyst that never sleeps, flags anomalies, and surfaces opportunities.' },
    { icon: FileText, title: 'Intelligence Reports', desc: 'Weekly briefs for founders, VCs, and content creators. Know what will trend before it does.' },
    { icon: Target, title: 'Conversion Funnels', desc: 'From page view to agent interaction to sale. See exactly where visitors drop off and why — with AI root-cause analysis.' },
    { icon: Radio, title: 'Real-Time Monitoring', desc: 'Live event streams, live community tracking, live sentiment shifts. Your AI-powered mission control.' },
  ];

  return (
    <div className="min-h-screen bg-[#080c10] text-white relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="relative border-b border-white/[0.06] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">Viktron</span>
            <span className="text-sm font-bold text-emerald-400"> Analytics</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://viktron.ai" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> viktron.ai
          </a>
          <button onClick={onEnterApp} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
            Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-6">
            <Sparkles className="w-3 h-3" />
            AI-Powered Analytics · Built for the AI Era
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-none">
            Analytics that thinks<br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              like your best analyst
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Amplitude-grade user analytics + AI community intelligence in one platform.
            Know what your users do, know what the market will do next.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Explore the Platform <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 px-6 py-3 rounded-xl transition-colors text-sm">
              View Sample Report <FileText className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Hero dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-14 bg-[#0f1117] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 text-left"
        >
          <div className="bg-white/[0.03] border-b border-white/[0.06] px-5 py-3 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="text-[10px] font-mono text-slate-600 ml-3">analytics.viktron.ai — Dashboard</span>
            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </div>
          </div>
          <div className="p-5 grid grid-cols-4 gap-3">
            {[
              { label: 'Visitors', value: '8,420', change: '+23%', color: '#10b981', data: [420,480,390,520,610,580,670,720,690,810,760,880,840,920,980] },
              { label: 'AI Conversations', value: '4,204', change: '+41%', color: '#3b82f6', data: [180,220,160,290,340,310,380,420,400,470,450,520,490,560,610] },
              { label: 'Conversions', value: '312', change: '+18%', color: '#8b5cf6', data: [14,18,11,22,27,24,29,33,30,38,34,41,38,45,50] },
              { label: 'Pre-viral Signals', value: '12', change: '+4', color: '#f59e0b', data: [3,4,3,5,6,5,7,6,7,8,8,9,10,11,12] },
            ].map((c, i) => (
              <div key={i} className="bg-[#080c10] rounded-xl p-3 border border-white/[0.05]">
                <p className="text-lg font-bold text-white">{c.value}</p>
                <p className="text-[10px] text-slate-500 mb-2">{c.label}</p>
                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-mono text-emerald-400">{c.change}</span>
                  <Sparkline data={c.data} color={c.color} height={24} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-3 flex items-start gap-3">
              <Brain className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-purple-300 font-semibold">AI Insight: </span>
                Reddit traffic converts at 2.4× site average. The OpenAI/Pentagon narrative is driving 340% surge in AI tool comparisons. Strike window: next 72 hours.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">Platform Capabilities</p>
          <h2 className="text-3xl font-bold text-white">Everything in one AI-native platform</h2>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#0f1117] border border-white/[0.07] rounded-2xl p-5 hover:border-emerald-500/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <f.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-8 py-12">
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to see what's happening in your market?</h2>
          <p className="text-slate-400 text-sm mb-6">Start with a free Intelligence Brief. No credit card required.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onEnterApp} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/contact" className="text-slate-400 hover:text-white text-sm border border-white/10 hover:border-white/20 px-6 py-3 rounded-xl transition-colors">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-6 px-8 flex items-center justify-between text-xs text-slate-600">
        <p>© 2026 Viktron Analytics · A Viktron AI product</p>
        <div className="flex items-center gap-4">
          <Link to="/legal/privacy" className="hover:text-slate-400">Privacy</Link>
          <Link to="/legal/terms" className="hover:text-slate-400">Terms</Link>
          <a href="https://viktron.ai" className="hover:text-slate-400 flex items-center gap-1">
            viktron.ai <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </footer>
    </div>
  );
};

// ── Main App Shell ─────────────────────────────────────────────────────────────
export const AnalyticsApp: React.FC = () => {
  const [appMode, setAppMode] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');

  const nav: { id: View; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'community', label: 'Community Intel', icon: Globe },
    { id: 'users', label: 'User Analytics', icon: Users },
    { id: 'reports', label: 'Reports & Pricing', icon: FileText },
  ];

  if (!appMode) return <AnalyticsLanding onEnterApp={() => setAppMode(true)} />;

  return (
    <div className="min-h-screen bg-[#080c10] flex text-white">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/[0.06] flex flex-col py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="leading-none">
            <p className="text-xs font-bold text-white">Viktron</p>
            <p className="text-xs font-bold text-emerald-400">Analytics</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map(item => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] pt-4 space-y-1">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]">
            <Bell className="w-3.5 h-3.5" /> Alerts
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]">
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
          <button
            onClick={() => setAppMode(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
          >
            <LogOut className="w-3.5 h-3.5" /> Back to Site
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#080c10]/90 backdrop-blur-xl border-b border-white/[0.06] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 w-72">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input placeholder="Search signals, metrics, pages…" className="bg-transparent text-xs text-slate-400 placeholder-slate-600 outline-none flex-1" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </div>
            <button className="relative text-slate-500 hover:text-slate-300 w-8 h-8 flex items-center justify-center">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">
              V
            </div>
          </div>
        </div>

        {/* View content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'community' && <CommunityIntelligenceView />}
              {activeView === 'users' && <UserAnalyticsView />}
              {activeView === 'reports' && <ReportsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
