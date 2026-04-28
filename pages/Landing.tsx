import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, Activity, Lock, ArrowRight, CheckCircle2,
  BarChart3, Cpu, Network, Zap, Users, TrendingUp,
  Server, GitBranch, KeyRound, FileCheck, Gauge,
  ChevronRight, Play, Star, Eye, BrainCircuit,
  Database, Globe, Layers, Sparkles, Terminal,
  AlertTriangle, RefreshCw, LineChart, Fingerprint,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ─── Animation Variants ───────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay, ease: EASE },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Trust Fabric Terminal Visual ────────────────────────────────────────────
const TrustTerminal = () => {
  const [step, setStep] = useState(0);
  const lines = [
    { prefix: '❯', text: 'agentirl verify --agent ceo-agent-42', color: 'text-white/70' },
    { prefix: '✓', text: 'Identity: Cryptographic token verified', color: 'text-emerald-400' },
    { prefix: '✓', text: 'Trust Score: 87/100 [AUTONOMOUS]', color: 'text-emerald-400' },
    { prefix: '❯', text: 'agentirl policy check --action data_write --risk high', color: 'text-white/70' },
    { prefix: '⚠', text: 'Policy: REQUIRE_APPROVAL (risk=high, trust=87)', color: 'text-amber-400' },
    { prefix: '✓', text: 'Human approved — delegation token issued', color: 'text-blue-400' },
    { prefix: '❯', text: 'agentirl provenance verify --chain sha256', color: 'text-white/70' },
    { prefix: '✓', text: 'Ledger: 1,247 entries, chain intact ✓', color: 'text-emerald-400' },
    { prefix: '■', text: 'FABRIC STATUS: SECURE & GOVERNED', color: 'text-purple-400' },
  ];

  useEffect(() => {
    if (step < lines.length) {
      const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 800 : 500 + Math.random() * 300);
      return () => clearTimeout(t);
    }
    const restart = setTimeout(() => setStep(0), 3000);
    return () => clearTimeout(restart);
  }, [step]);

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
      <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-emerald-500/15 rounded-3xl blur-2xl" />
      <div className="relative glass-panel rounded-2xl overflow-hidden border border-white/10">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
          </div>
          <div className="flex-1 text-center font-mono text-[10px] text-white/30 tracking-widest uppercase">
            agentirl — trust-fabric — control-plane
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[9px] text-emerald-400">LIVE</span>
          </div>
        </div>

        {/* Terminal body */}
        <div className="p-5 font-mono text-xs space-y-2 min-h-[280px] bg-[#060810]/60">
          <AnimatePresence initial={false}>
            {lines.slice(0, step).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-2 ${line.color}`}
              >
                <span className="shrink-0 w-4">{line.prefix}</span>
                <span className="leading-relaxed">{line.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {step < lines.length && (
            <div className="flex items-center gap-1 text-white/40">
              <span className="text-blue-400">❯</span>
              <span className="w-2 h-4 bg-white/60 animate-pulse" />
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-3 text-white/30">
            <span>POLICY: STRICT</span>
            <span>CHAIN: SHA-256</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <Shield size={9} />
            <span>SOC2 MODE</span>
          </div>
        </div>
      </div>

      {/* Floating trust score badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="absolute -bottom-4 -right-4 glass-panel rounded-xl p-3 border-glow-emerald"
      >
        <div className="flex items-center gap-2">
          <TrustRing score={87} size={40} />
          <div>
            <div className="text-[10px] text-white/50 font-mono">TRUST SCORE</div>
            <div className="text-white font-bold text-sm">87 / 100</div>
            <div className="text-emerald-400 text-[9px]">AUTONOMOUS</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Trust Score Ring ─────────────────────────────────────────────────────────
const TrustRing = ({ score, size = 48 }: { score: number; size?: number }) => {
  const r = (size / 2) - 4;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
};

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ text, color = 'blue' }: { text: string; color?: 'blue' | 'emerald' | 'purple' | 'amber' }) => {
  const colors = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };
  const dots = { blue: 'bg-blue-400', emerald: 'bg-emerald-400', purple: 'bg-purple-400', amber: 'bg-amber-400' };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-widest mb-5 ${colors[color]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dots[color]}`} />
      {text}
    </motion.div>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '60%', label: 'LLM cost reduction' },
  { value: '5 layers', label: 'Trust governance' },
  { value: 'SOC2', label: 'Ready' },
  { value: '<50ms', label: 'Policy evaluation' },
  { value: 'SHA-256', label: 'Provenance chain' },
];

// ─── Trust Fabric Pillars ─────────────────────────────────────────────────────
const trustPillars = [
  {
    icon: Fingerprint,
    title: 'Cryptographic Agent Identity',
    desc: 'Every agent gets a verifiable identity token. No impersonation. No rogue agents pretending to be trusted ones.',
    color: 'text-blue-400',
    glow: 'blue',
  },
  {
    icon: Gauge,
    title: 'Dynamic Trust Scoring',
    desc: 'Real-time 0–100 trust score per agent. Mission success rate, override frequency, error recovery — all feed into autonomous permission levels.',
    color: 'text-emerald-400',
    glow: 'emerald',
  },
  {
    icon: KeyRound,
    title: 'Delegation Token Engine',
    desc: 'Task-scoped JWT tokens with scope attenuation. Child tokens can only narrow parent scope. Revocation cascades instantly.',
    color: 'text-purple-400',
    glow: 'purple',
  },
  {
    icon: Shield,
    title: 'Adaptive Policy Engine',
    desc: 'Pre-action governance checks. Every agent action evaluated against runtime policies — allow, deny, or require human approval.',
    color: 'text-amber-400',
    glow: 'amber',
  },
  {
    icon: FileCheck,
    title: 'Provenance Ledger',
    desc: 'SHA-256 hash-chained tamper-evident audit trail. Answers: who authorized, what goal, what agent saw, why it acted, what changed.',
    color: 'text-blue-400',
    glow: 'blue',
  },
  {
    icon: Database,
    title: 'Memory Governance',
    desc: 'Policy-governed agent memory with sensitivity labels, retention policies, and access boundaries. Confidential data stays confidential.',
    color: 'text-emerald-400',
    glow: 'emerald',
  },
];

// ─── Cloud Features ───────────────────────────────────────────────────────────
const cloudFeatures = [
  { icon: Cpu, title: 'Agent Deployment', desc: 'Deploy any agent to production in minutes. Auto-scaling, zero-downtime, global edge.' },
  { icon: Network, title: 'Multi-Agent Orchestration', desc: 'Distributed task queues with capability routing. CEO delegates to Sales, Support, Content agents automatically.' },
  { icon: RefreshCw, title: 'Error Auto-Recovery', desc: 'Circuit breakers, intelligent retries, and fallback chains keep uptime through partial failures.' },
  { icon: Globe, title: '100+ Integrations', desc: 'Salesforce, SAP, Slack, databases, and every major SaaS — pre-built adapters, zero glue code.' },
  { icon: Users, title: 'Agent Rental', desc: 'Rent best-in-class pre-trained agents by the task. CEO, PM, Developer, QA, Sales, Support, Content.' },
  { icon: Zap, title: 'Cost Optimization', desc: 'Prompt caching, model routing, and token budgets reduce LLM spend by up to 60% automatically.' },
];

// ─── Analytics Features ───────────────────────────────────────────────────────
const analyticsFeatures = [
  { icon: Activity, title: 'Real-time Telemetry', desc: 'OTLP traces, latency histograms, per-node cost attribution. See exactly what every agent does.' },
  { icon: Eye, title: 'Session Replay', desc: 'Full agent session replay. Review every decision, tool call, and reasoning step post-hoc.' },
  { icon: BarChart3, title: 'Bot Crawl Analytics', desc: 'Track web agent behavior, crawl patterns, and data extraction quality across runs.' },
  { icon: LineChart, title: 'Advanced Experimentation', desc: 'A/B test agent prompts, models, and workflows. Statistical significance built in.' },
];

// ─── Competitor Comparison ────────────────────────────────────────────────────
const comparisonRows = [
  { feature: 'Agent Trust Scoring', viktron: true, langchain: false, crewai: false, autogen: false },
  { feature: 'Cryptographic Identity', viktron: true, langchain: false, crewai: false, autogen: false },
  { feature: 'Delegation Token Attenuation', viktron: true, langchain: false, crewai: false, autogen: false },
  { feature: 'Policy Engine (pre-action)', viktron: true, langchain: false, crewai: false, autogen: false },
  { feature: 'Provenance Hash Chain', viktron: true, langchain: false, crewai: false, autogen: false },
  { feature: 'Memory Governance + Sensitivity', viktron: true, langchain: false, crewai: false, autogen: false },
  { feature: 'Human-in-Loop (risk-aware)', viktron: true, langchain: true, crewai: true, autogen: true },
  { feature: 'Framework Agnostic', viktron: true, langchain: false, crewai: false, autogen: false },
  { feature: 'Session Replay Analytics', viktron: true, langchain: false, crewai: false, autogen: false },
];

// ─── Rental Agent Types ───────────────────────────────────────────────────────
const agentTypes = [
  { name: 'CEO Agent', role: 'Strategic planning, OKR management, cross-team coordination', icon: BrainCircuit, color: 'text-purple-400' },
  { name: 'Developer Agent', role: 'Code generation, PR review, architecture decisions', icon: Terminal, color: 'text-blue-400' },
  { name: 'Sales Agent', role: 'Lead qualification, outreach sequencing, CRM updates', icon: TrendingUp, color: 'text-emerald-400' },
  { name: 'Support Agent', role: 'Ticket triage, resolution, escalation routing', icon: Users, color: 'text-amber-400' },
  { name: 'QA Agent', role: 'Test generation, coverage analysis, regression detection', icon: CheckCircle2, color: 'text-blue-400' },
  { name: 'Content Agent', role: 'Blog, social, email copy, brand voice enforcement', icon: Sparkles, color: 'text-purple-400' },
];

// ─── Video Section ────────────────────────────────────────────────────────────
const VideoDemo = () => {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); } else { ref.current.play().catch(() => {}); }
    setPlaying(!playing);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/40 cursor-pointer group"
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-label="Play video demo"
      onKeyDown={e => e.key === 'Enter' && toggle()}
    >
      <video
        ref={ref}
        src="/AI_Agents_Orchestrated_into_a_System.mp4"
        className="w-full h-full object-cover opacity-80"
        loop
        muted
        playsInline
      />
      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center">
          <Play size={24} className="text-white ml-1" />
        </div>
      </div>
      {!playing && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="text-white/60 text-xs font-mono">AI Agents Orchestrated Into a System</span>
          <span className="text-white/40 text-xs font-mono">Click to play</span>
        </div>
      )}
    </div>
  );
};

// ─── Main Landing Page ────────────────────────────────────────────────────────
export const Landing: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.3 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <Layout showBackground={false}>
      <SEO
        title="Viktron AI — The Trust Fabric for Enterprise AI Agents"
        description="AgentIRL Trust Fabric: cryptographic identity, dynamic trust scoring, policy enforcement, and provenance ledger for autonomous AI agents. The governance layer your enterprise demands."
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#060810]" />
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at ${30 + mousePos.x * 10}% ${20 + mousePos.y * 10}%, rgba(99,102,241,0.12) 0%, transparent 60%),
                         radial-gradient(ellipse 60% 50% at ${70 + mousePos.x * 5}% ${70 + mousePos.y * 5}%, rgba(139,92,246,0.08) 0%, transparent 60%),
                         radial-gradient(ellipse 50% 40% at 10% 80%, rgba(16,185,129,0.08) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="container-custom relative z-10 pt-24 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
              <motion.div variants={fadeUp} custom={0}>
                <div className="moat-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono mb-8">
                  <Shield size={12} className="text-purple-400" />
                  <span className="text-purple-300 uppercase tracking-widest">AgentIRL Trust Fabric — Our Moat</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={0.1}
                className="font-jakarta text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
              >
                <span className="text-white">The Control Plane</span>
                <br />
                <span className="text-white">for </span>
                <span className="shimmer-text">Autonomous</span>
                <br />
                <span className="text-white">Enterprise Agents</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={0.2}
                className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl"
              >
                Viktron gives you the only enterprise-grade trust fabric that makes AI agents
                <strong className="text-white/90"> provably safe to run autonomously</strong> —
                with cryptographic identity, dynamic trust scoring, adaptive policy enforcement,
                and tamper-evident provenance. Plus cloud deployment and AI analytics.
              </motion.p>

              <motion.div variants={fadeUp} custom={0.3} className="flex flex-wrap gap-3 mb-10">
                {['Cryptographic Identity', 'Policy Engine', 'Provenance Chain', 'SOC2 Ready'].map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 text-xs text-white/60 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} custom={0.4} className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="btn-premium btn-primary-glow flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                >
                  Book Enterprise Demo
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/services/agentirl"
                  className="btn-premium flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                >
                  <Layers size={16} className="text-purple-400" />
                  Explore Trust Fabric
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} custom={0.5} className="mt-10 flex items-center gap-4 text-sm text-white/40">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-[#060810] bg-gradient-to-br from-indigo-500 to-purple-600"
                      style={{ opacity: 1 - i * 0.15 }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span>Trusted by enterprise teams deploying AI at scale</span>
              </motion.div>
            </motion.div>

            {/* Right: Trust Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <TrustTerminal />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#060810] to-transparent pointer-events-none" />
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────────────────── */}
      <div className="section-divider" />
      <section className="py-8 bg-[#060810] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.03] via-transparent to-emerald-500/[0.03]" />
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i * 0.05} className="text-center">
                <div className="text-2xl font-jakarta font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <div className="section-divider" />

      {/* ── Three Products ────────────────────────────────────────────────────── */}
      <section className="py-28 bg-[#060810] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <SectionLabel text="The Platform" />
            <motion.h2 variants={fadeUp} className="font-jakarta text-4xl md:text-5xl font-extrabold text-white mb-5">
              Three layers. One platform.
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.1} className="text-white/50 text-lg max-w-2xl mx-auto">
              AgentIRL is our moat. Cloud is our delivery. Analytics is our intelligence. Together they make autonomous AI agents enterprise-ready.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* AgentIRL — Featured / Moat */}
            <motion.div
              variants={fadeUp}
              className="relative rounded-2xl overflow-hidden border border-purple-500/25 bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-transparent p-8 group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[10px] font-mono uppercase tracking-widest mb-6">
                  <Star size={9} className="fill-current" />
                  Our Moat
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                  <Shield size={22} className="text-purple-400" />
                </div>
                <h3 className="font-jakarta text-2xl font-bold text-white mb-3">AgentIRL</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  The trust governance layer that no competitor has. Cryptographic identity, dynamic trust scoring, delegation tokens, policy engine, and tamper-evident provenance chain.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Trust Fabric', 'Policy Engine', 'Provenance Ledger', 'Memory Governance'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 size={12} className="text-purple-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/services/agentirl" className="inline-flex items-center gap-2 text-purple-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  Explore Trust Fabric <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Viktron Cloud */}
            <motion.div
              variants={fadeUp}
              custom={0.08}
              className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-950/30 via-indigo-950/20 to-transparent p-8 group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                  <Server size={22} className="text-blue-400" />
                </div>
                <h3 className="font-jakarta text-2xl font-bold text-white mb-3">Viktron Cloud</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Deploy, scale, and orchestrate AI agents across your enterprise. Multi-agent task queues, capability routing, and 100+ integrations out of the box.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Multi-Agent Orchestration', 'Agent Rental Marketplace', 'Auto-scaling', '100+ Integrations'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 size={12} className="text-blue-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/enterprise" className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  See Cloud Platform <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* AI Analytics */}
            <motion.div
              variants={fadeUp}
              custom={0.16}
              className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-teal-950/20 to-transparent p-8 group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <BarChart3 size={22} className="text-emerald-400" />
                </div>
                <h3 className="font-jakarta text-2xl font-bold text-white mb-3">AI Analytics</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Amplitude for AI agents. Real-time OTLP telemetry, session replay, bot crawl analytics, and advanced experimentation for continuous improvement.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Session Replay', 'Real-time Telemetry', 'Experimentation', 'Bot Analytics'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/analytics" className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
                  View Analytics Suite <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── AgentIRL Deep Dive: The Moat ─────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden bg-[#060810]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(139,92,246,0.06)_0%,transparent_70%)]" />
          <div className="bg-grid absolute inset-0 opacity-30" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <SectionLabel text="AgentIRL Trust Fabric" color="purple" />
              <motion.h2 variants={fadeUp} className="font-jakarta text-4xl md:text-5xl font-extrabold text-white mb-6">
                The governance layer <br />
                <span className="text-gradient-primary">no competitor has built</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={0.1} className="text-white/50 text-lg leading-relaxed mb-8">
                LangChain, CrewAI, and AutoGen give you tools to build agents. They don't give you
                the trust infrastructure to run them autonomously at enterprise scale. We do.
              </motion.p>

              <motion.div variants={stagger} className="space-y-4">
                {trustPillars.slice(0, 3).map((p, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    custom={0.25 + i * 0.05}
                    className="flex gap-4 p-4 rounded-xl feature-card"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 ${p.color}`}>
                      <p.icon size={18} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">{p.title}</div>
                      <div className="text-white/45 text-xs leading-relaxed">{p.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="space-y-4 pt-4 lg:pt-20"
            >
              {trustPillars.slice(3).map((p, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i * 0.05}
                  className="flex gap-4 p-4 rounded-xl feature-card"
                >
                  <div className={`w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 ${p.color}`}>
                    <p.icon size={18} />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-1">{p.title}</div>
                    <div className="text-white/45 text-xs leading-relaxed">{p.desc}</div>
                  </div>
                </motion.div>
              ))}

              {/* Trust score visual */}
              <motion.div variants={fadeUp} custom={0.3} className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/20">
                <div className="flex items-center gap-4 mb-4">
                  <TrustRing score={87} size={56} />
                  <div>
                    <div className="text-white font-bold text-lg">Trust Score: 87</div>
                    <div className="text-emerald-400 text-xs font-mono">AUTONOMOUS MODE</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    { label: 'mission_success_rate', val: '94%', color: 'text-emerald-400', width: '94%', bg: 'bg-emerald-500' },
                    { label: 'error_recovery_rate', val: '89%', color: 'text-blue-400', width: '89%', bg: 'bg-blue-500' },
                    { label: 'human_override_rate', val: '6%', color: 'text-amber-400', width: '6%', bg: 'bg-amber-500' },
                  ].map((m, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-white/40 mb-1">
                        <span>{m.label}</span>
                        <span className={m.color}>{m.val}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: m.width }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full rounded-full ${m.bg}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Competitor Comparison ─────────────────────────────────────────────── */}
      <div className="section-divider" />
      <section className="py-24 bg-[#060810] relative overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-12"
          >
            <SectionLabel text="Why Viktron" color="purple" />
            <motion.h2 variants={fadeUp} className="font-jakarta text-4xl md:text-5xl font-extrabold text-white mb-4">
              Nothing else does this.
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.1} className="text-white/45 max-w-xl mx-auto">
              Every competitor ships agent tooling. Only Viktron ships the trust infrastructure that makes agents safe for autonomous enterprise operation.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto no-scrollbar"
          >
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-4 pr-6 text-white/40 font-normal text-xs uppercase tracking-wider w-[40%]">Capability</th>
                  <th className="py-4 px-4 text-center">
                    <div className="text-white font-bold text-sm">Viktron</div>
                    <div className="text-purple-400 text-[10px] font-mono">AgentIRL</div>
                  </th>
                  <th className="py-4 px-4 text-center text-white/30 text-xs">LangChain</th>
                  <th className="py-4 px-4 text-center text-white/30 text-xs">CrewAI</th>
                  <th className="py-4 px-4 text-center text-white/30 text-xs">AutoGen</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={`border-b border-white/[0.04] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="py-3 pr-6 text-white/60 text-xs">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.viktron
                        ? <CheckCircle2 size={16} className="text-emerald-400 mx-auto" />
                        : <span className="text-white/20 text-lg">–</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.langchain
                        ? <CheckCircle2 size={14} className="text-white/30 mx-auto" />
                        : <span className="text-white/15 text-lg">–</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.crewai
                        ? <CheckCircle2 size={14} className="text-white/30 mx-auto" />
                        : <span className="text-white/15 text-lg">–</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.autogen
                        ? <CheckCircle2 size={14} className="text-white/30 mx-auto" />
                        : <span className="text-white/15 text-lg">–</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── Video Demo ────────────────────────────────────────────────────────── */}
      <div className="section-divider" />
      <section className="py-24 bg-[#060810] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10"
          >
            <SectionLabel text="See It In Action" />
            <motion.h2 variants={fadeUp} className="font-jakarta text-4xl font-extrabold text-white mb-4">
              AI agents, orchestrated.
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.1} className="text-white/45 max-w-lg mx-auto text-base">
              Watch autonomous agents coordinate across tasks with full governance, trust scoring, and provenance.
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <VideoDemo />
          </motion.div>
        </div>
      </section>

      {/* ── Cloud Features ────────────────────────────────────────────────────── */}
      <div className="section-divider" />
      <section className="py-28 bg-[#060810] relative overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="mb-16"
          >
            <SectionLabel text="Viktron Cloud" color="blue" />
            <motion.h2 variants={fadeUp} className="font-jakarta text-4xl md:text-5xl font-extrabold text-white mb-5 max-w-2xl">
              Deploy, orchestrate, and scale <br />
              <span className="text-gradient-primary">any agent in minutes</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.1} className="text-white/50 text-lg max-w-xl">
              From single-agent automation to enterprise-wide autonomous operations. Viktron Cloud handles the infrastructure so you focus on outcomes.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {cloudFeatures.map((f, i) => (
              <motion.div key={i} variants={fadeUp} custom={i * 0.06} className="p-6 rounded-2xl feature-card">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-4">
                  <f.icon size={18} className="text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Agent Rental ─────────────────────────────────────────────────────── */}
      <div className="section-divider" />
      <section className="py-28 bg-[#060810] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(99,102,241,0.06)_0%,transparent_60%)]" />
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-14"
          >
            <SectionLabel text="Agent Rental" color="blue" />
            <motion.h2 variants={fadeUp} className="font-jakarta text-4xl md:text-5xl font-extrabold text-white mb-5">
              Rent a best-in-class agent.<br />
              <span className="text-gradient-primary">Pay per task.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.1} className="text-white/50 text-lg max-w-xl mx-auto">
              Don't build agents from scratch. Rent battle-tested specialist agents — all governed by AgentIRL Trust Fabric.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {agentTypes.map((a, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.06}
                className="p-6 rounded-2xl feature-card"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <a.icon size={18} className={a.color} />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{a.name}</div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400 text-[10px] font-mono">Trust Governed</span>
                    </div>
                  </div>
                </div>
                <p className="text-white/45 text-xs leading-relaxed">{a.role}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mt-10"
          >
            <Link
              to="/rent-agent"
              className="btn-premium inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              Browse Agent Marketplace <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── AI Analytics ─────────────────────────────────────────────────────── */}
      <div className="section-divider" />
      <section className="py-28 bg-[#060810] relative overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: analytics visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-3xl blur-2xl" />
              <div className="relative glass-panel rounded-2xl overflow-hidden border border-emerald-500/15">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-emerald-400" />
                    <span className="text-white/70 text-xs font-mono">AI Analytics — Live Dashboard</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-[9px] font-mono">STREAMING</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Tasks/min', val: '142', trend: '+12%', color: 'text-emerald-400' },
                      { label: 'Avg Latency', val: '1.2s', trend: '-8%', color: 'text-blue-400' },
                      { label: 'Error Rate', val: '0.3%', trend: '-44%', color: 'text-emerald-400' },
                    ].map((m, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                        <div className={`text-lg font-bold font-mono ${m.color}`}>{m.val}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{m.label}</div>
                        <div className="text-[9px] text-emerald-400 mt-1">{m.trend} vs last hr</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-white/50">Agent Task Throughput (24h)</span>
                      <span className="text-[10px] font-mono text-emerald-400">↑ 23% WoW</span>
                    </div>
                    <svg viewBox="0 0 280 60" className="w-full" aria-hidden="true">
                      <defs>
                        <linearGradient id="analytics-grad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,50 C20,45 40,30 60,35 S100,20 120,25 S160,10 180,15 S220,5 240,8 L280,5 L280,60 L0,60Z" fill="url(#analytics-grad)" />
                      <path d="M0,50 C20,45 40,30 60,35 S100,20 120,25 S160,10 180,15 S220,5 240,8 L280,5" fill="none" stroke="#10b981" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-white/50">Recent Session Replays</span>
                      <Eye size={12} className="text-white/30" />
                    </div>
                    {[
                      'ceo-agent → research → approve',
                      'sales-agent → outreach → sent(12)',
                      'dev-agent → PR review → LGTM',
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                        <span className="text-[10px] font-mono text-white/40">{s}</span>
                        <span className="text-[9px] text-emerald-400 font-mono">✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <SectionLabel text="AI Analytics" color="emerald" />
              <motion.h2 variants={fadeUp} className="font-jakarta text-4xl md:text-5xl font-extrabold text-white mb-6">
                Amplitude, rebuilt <br />
                <span className="text-gradient-emerald">for AI agents</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={0.1} className="text-white/50 text-lg leading-relaxed mb-8">
                Don't fly blind. Every agent session, tool call, and reasoning step is captured, replayed, and analyzed. Continuous improvement without code changes.
              </motion.p>

              <motion.div variants={stagger} className="space-y-4">
                {analyticsFeatures.map((f, i) => (
                  <motion.div key={i} variants={fadeUp} custom={0.15 + i * 0.05} className="flex gap-4 p-4 rounded-xl feature-card">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0">
                      <f.icon size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">{f.title}</div>
                      <div className="text-white/45 text-xs leading-relaxed">{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} custom={0.5} className="mt-8">
                <Link to="/analytics" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all">
                  Explore Analytics Suite <ChevronRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Architecture / How It Connects ───────────────────────────────────── */}
      <div className="section-divider" />
      <section className="py-28 bg-[#060810] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.04)_0%,transparent_70%)]" />
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <SectionLabel text="Architecture" />
            <motion.h2 variants={fadeUp} className="font-jakarta text-4xl md:text-5xl font-extrabold text-white mb-5">
              How it all fits together
            </motion.h2>
            <motion.p variants={fadeUp} custom={0.1} className="text-white/45 max-w-xl mx-auto">
              From instruction to execution — every step is governed, observed, and provably auditable.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-5 gap-2 items-center">
              {([
                { label: 'Enterprise Instruction', icon: Users, color: 'blue', sub: 'Founder / Manager' },
                null,
                { label: 'AgentIRL Trust Fabric', icon: Shield, color: 'purple', sub: 'Policy → Token → Verify', featured: true },
                null,
                { label: 'Agent Execution', icon: Cpu, color: 'emerald', sub: 'Governed action chain' },
              ] as Array<{ label: string; icon: React.ElementType; color: string; sub: string; featured?: boolean } | null>).map((item, i) => {
                if (!item) return (
                  <div key={i} className="flex items-center justify-center">
                    <ChevronRight size={20} className="text-white/20" />
                  </div>
                );
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl text-center ${
                      item.featured
                        ? 'border border-purple-500/30 bg-purple-950/25 ring-1 ring-purple-500/10'
                        : 'feature-card'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                      item.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/15'
                      : item.color === 'purple' ? 'bg-purple-500/10 border border-purple-500/20'
                      : 'bg-emerald-500/10 border border-emerald-500/15'
                    }`}>
                      <Icon size={18} className={
                        item.color === 'blue' ? 'text-blue-400'
                        : item.color === 'purple' ? 'text-purple-400'
                        : 'text-emerald-400'
                      } />
                    </div>
                    <div className="text-white text-xs font-semibold mb-1">{item.label}</div>
                    <div className="text-white/35 text-[10px]">{item.sub}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {[
                { label: 'Provenance Ledger', icon: FileCheck, colorClass: 'text-blue-400', sub: 'SHA-256 chain audit trail' },
                { label: 'AI Analytics', icon: BarChart3, colorClass: 'text-emerald-400', sub: 'OTLP telemetry + session replay' },
                { label: 'Viktron Cloud', icon: Server, colorClass: 'text-blue-400', sub: 'Multi-agent task orchestration' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl feature-card">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <Icon size={15} className={item.colorClass} />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold">{item.label}</div>
                      <div className="text-white/35 text-[10px]">{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <div className="section-divider" />
      <section className="py-32 relative overflow-hidden bg-[#060810]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(99,102,241,0.12)_0%,transparent_60%)]" />
          <div className="bg-grid absolute inset-0 opacity-20" />
        </div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="moat-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono mb-8">
                <Shield size={12} className="text-purple-400" />
                <span className="text-purple-300 uppercase tracking-widest">Enterprise-Grade Trust</span>
              </div>
            </motion.div>

            <motion.h2 variants={fadeUp} custom={0.1} className="font-jakarta text-5xl md:text-6xl font-extrabold text-white mb-6 max-w-3xl mx-auto leading-tight">
              Ready to deploy agents <br />
              <span className="shimmer-text">you can actually trust?</span>
            </motion.h2>

            <motion.p variants={fadeUp} custom={0.2} className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
              Book a demo and see AgentIRL Trust Fabric live — with your team, your workflows, your data.
            </motion.p>

            <motion.div variants={fadeUp} custom={0.3} className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-premium btn-primary-glow flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base"
              >
                Book Enterprise Demo
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/rent-agent"
                className="btn-premium flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base"
              >
                <Cpu size={18} className="text-blue-400" />
                Rent an Agent
              </Link>
              <Link
                to="/docs"
                className="btn-premium flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base"
              >
                <Terminal size={18} className="text-white/40" />
                Read the Docs
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.4} className="mt-14 flex flex-wrap items-center justify-center gap-8 text-xs text-white/30">
              {[
                'SOC2 Type II Ready',
                'Framework Agnostic',
                'On-Prem Available',
                '99.9% Uptime SLA',
                'Human-in-Loop Controls',
              ].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};
