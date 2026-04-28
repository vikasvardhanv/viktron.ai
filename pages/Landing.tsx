import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, BarChart3, Server, CheckCircle2,
  Fingerprint, KeyRound, FileCheck, Gauge, Database,
  ChevronRight, Lock, Activity, Eye, Cpu, Zap, Users,
  GitBranch, RefreshCw, Network,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ─── Motion helpers ───────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease },
});

// ─── Pill / badge ─────────────────────────────────────────────────────────────
const Pill = ({ children, color = 'violet' }: { children: React.ReactNode; color?: 'violet' | 'emerald' | 'blue' | 'neutral' }) => {
  const map = {
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    neutral: 'bg-white/5 text-zinc-400 border-white/10',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${map[color]}`}>
      {children}
    </span>
  );
};

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionHead = ({ eyebrow, title, sub, center = false }: {
  eyebrow?: string; title: React.ReactNode; sub?: string; center?: boolean;
}) => (
  <div className={center ? 'text-center' : ''}>
    {eyebrow && (
      <motion.div {...inView(0)} className="mb-4">
        <Pill color="neutral">{eyebrow}</Pill>
      </motion.div>
    )}
    <motion.h2 {...inView(0.05)} className="font-jakarta text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
      {title}
    </motion.h2>
    {sub && (
      <motion.p {...inView(0.1)} className="mt-4 text-zinc-400 text-lg leading-relaxed max-w-2xl">
        {sub}
      </motion.p>
    )}
  </div>
);

// ─── Trust Score Ring ─────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 64, stroke = 4 }: { score: number; size?: number; stroke?: number }) => {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
};

// ─── Policy rule chip ─────────────────────────────────────────────────────────
const PolicyChip = ({ effect, rule }: { effect: 'allow' | 'deny' | 'approve'; rule: string }) => {
  const colors = {
    allow:   'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    deny:    'text-red-400 bg-red-500/10 border-red-500/20',
    approve: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono ${colors[effect]}`}>
      <span className="text-zinc-400 truncate flex-1">{rule}</span>
      <span className="ml-3 font-semibold uppercase text-[10px]">{effect}</span>
    </div>
  );
};

// ─── Comparison data ──────────────────────────────────────────────────────────
const compRows = [
  { feature: 'Dynamic trust scoring per agent',   v: true,  lc: false, ca: false, ag: false },
  { feature: 'Cryptographic agent identity',       v: true,  lc: false, ca: false, ag: false },
  { feature: 'Scoped delegation tokens (JWT)',      v: true,  lc: false, ca: false, ag: false },
  { feature: 'Pre-action policy enforcement',       v: true,  lc: false, ca: false, ag: false },
  { feature: 'SHA-256 provenance chain',            v: true,  lc: false, ca: false, ag: false },
  { feature: 'Sensitivity-tiered memory governance',v: true,  lc: false, ca: false, ag: false },
  { feature: 'Human-in-loop (risk-aware gates)',    v: true,  lc: true,  ca: true,  ag: true  },
  { feature: 'Framework agnostic runtime',          v: true,  lc: false, ca: false, ag: false },
  { feature: 'Real-time agent session replay',      v: true,  lc: false, ca: false, ag: false },
];

// ─────────────────────────────────────────────────────────────────────────────
export const Landing: React.FC = () => {
  const [mouseOrb, setMouseOrb] = useState({ x: 40, y: 30 });

  useEffect(() => {
    const h = (e: MouseEvent) => setMouseOrb({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);

  return (
    <Layout showBackground={false}>
      <SEO
        title="Viktron AI — Trust Fabric for Enterprise AI Agents"
        description="The governance layer for autonomous enterprise AI agents. Cryptographic identity, dynamic trust scoring, policy enforcement, and tamper-evident provenance."
      />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-[#09090B] pt-20 pb-16">
        {/* Orb background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.12] transition-all duration-1000"
            style={{
              background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
              left: `${mouseOrb.x - 25}%`,
              top: `${mouseOrb.y - 25}%`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,#09090B_100%)]" />
        </div>
        {/* Faint grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Top badges */}
          <motion.div {...inView(0)} className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <Pill color="violet">
              <Shield size={11} />
              AgentIRL Trust Fabric
            </Pill>
            <Pill color="neutral">SOC 2 Ready</Pill>
            <Pill color="emerald">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SHA-256 Provenance
            </Pill>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...inView(0.06)}
            className="font-jakarta text-5xl md:text-6xl lg:text-[72px] font-bold text-white tracking-[-0.03em] leading-[1.05] mb-7"
          >
            The governance layer<br />
            <span className="text-zinc-400">for enterprise AI agents.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p {...inView(0.12)} className="text-zinc-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Viktron gives your team the trust infrastructure to run autonomous agents at scale —
            with cryptographic identity, runtime policy enforcement, and tamper-evident audit trails
            baked in from day one.
          </motion.p>

          {/* CTAs */}
          <motion.div {...inView(0.18)} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.3)]"
            >
              Book a demo
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/services/agentirl"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-semibold text-sm transition-all duration-200"
            >
              <Layers size={15} className="text-violet-400" />
              Explore Trust Fabric
            </Link>
          </motion.div>
        </div>

        {/* Hero product preview */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="relative z-10 w-full max-w-5xl mx-auto mt-20 px-6"
        >
          <HeroDashboard />
        </motion.div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <div className="border-t border-white/[0.06] bg-[#09090B]">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: '99.9%',   l: 'Uptime SLA' },
            { n: '<50ms',   l: 'Policy evaluation' },
            { n: '60%',     l: 'LLM cost reduction' },
            { n: '5 layers', l: 'Trust governance stack' },
          ].map((s, i) => (
            <motion.div key={i} {...inView(i * 0.04)} className="text-center">
              <div className="font-jakarta text-3xl font-bold text-white mb-1">{s.n}</div>
              <div className="text-sm text-zinc-500">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════ TRUST FABRIC BENTO ══════════════════════ */}
      <section className="bg-[#09090B] py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <SectionHead
              eyebrow="AgentIRL Trust Fabric"
              title={<>The governance layer<br />no one else has built.</>}
              sub="LangChain, CrewAI, and AutoGen give you tools to build agents. They don't give you the trust infrastructure to run them autonomously in production. We do."
            />
          </div>

          {/* Bento grid */}
          <BentoGrid />
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section className="bg-[#09090B] py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...inView(0)} className="text-center mb-14">
            <SectionHead
              eyebrow="How it works"
              title="Three steps to governed autonomous agents."
              center
            />
          </motion.div>

          <div className="space-y-px">
            {[
              {
                n: '01',
                title: 'Connect your agents to AgentIRL',
                desc: 'Wrap any agent — LangChain, CrewAI, AutoGen, custom — with the AgentIRL runtime. No rewrite required. Every tool call and reasoning step now flows through the Trust Fabric.',
                color: 'text-violet-400',
              },
              {
                n: '02',
                title: 'Trust Fabric evaluates every action',
                desc: 'Before each action executes, the Trust Fabric checks: Is this agent authorized? Does its trust score allow autonomous execution? Does the action violate policy? It answers in under 50ms.',
                color: 'text-blue-400',
              },
              {
                n: '03',
                title: 'Agents run autonomously — within your rules',
                desc: 'High-trust agents proceed automatically. Risky actions route to human approval. Every decision is hash-chained into an immutable provenance ledger your compliance team can audit.',
                color: 'text-emerald-400',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                {...inView(i * 0.08)}
                className="flex gap-8 py-10 border-b border-white/[0.06] last:border-0"
              >
                <div className={`text-5xl font-bold font-mono tabular-nums shrink-0 w-14 ${step.color} opacity-30 pt-1`}>
                  {step.n}
                </div>
                <div>
                  <h3 className="font-jakarta text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PRODUCTS ══════════════════════ */}
      <section className="bg-[#09090B] py-24 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <SectionHead
              eyebrow="The platform"
              title="One platform. Three layers."
              sub="AgentIRL governs. Cloud deploys. Analytics observes. Each is useful alone. Together they form the complete infrastructure for autonomous enterprise AI."
            />
          </div>
          <ProductCards />
        </div>
      </section>

      {/* ══════════════════════ COMPARISON ══════════════════════ */}
      <section className="bg-[#09090B] py-24 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div {...inView(0)} className="text-center mb-12">
            <SectionHead
              eyebrow="Competitive landscape"
              title={<>Nothing else does this.</>}
              sub="Every alternative ships agent tooling. Only Viktron ships the trust infrastructure that makes agents safe to run autonomously at enterprise scale."
              center
            />
          </motion.div>
          <ComparisonTable />
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="bg-[#09090B] border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <motion.div {...inView(0)} className="mb-5 flex justify-center">
            <Pill color="violet">
              <Shield size={11} />
              Enterprise-grade trust
            </Pill>
          </motion.div>
          <motion.h2 {...inView(0.06)} className="font-jakarta text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Ready to govern your<br />AI agents?
          </motion.h2>
          <motion.p {...inView(0.1)} className="text-zinc-400 text-lg mb-10">
            See AgentIRL Trust Fabric running in your environment. Book a technical demo with our engineering team.
          </motion.p>
          <motion.div {...inView(0.14)} className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all duration-200 shadow-[0_0_24px_rgba(139,92,246,0.3)]"
            >
              Book a demo
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/rent-agent"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-semibold transition-all duration-200"
            >
              Rent an agent
            </Link>
          </motion.div>
          <motion.div {...inView(0.2)} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
            {['SOC 2 Ready', 'Framework agnostic', 'On-prem available', 'Human-in-loop controls'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={11} className="text-emerald-500" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

// ─── Layers icon ──────────────────────────────────────────────────────────────
const Layers = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

// ─── Hero Dashboard ───────────────────────────────────────────────────────────
const HeroDashboard = () => (
  <div className="relative">
    {/* Glow beneath */}
    <div className="absolute -inset-4 bg-gradient-to-t from-violet-500/10 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />

    <div className="relative rounded-2xl border border-white/[0.08] bg-[#111113] overflow-hidden shadow-2xl">
      {/* Window bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] text-zinc-500 font-mono">
            viktron.ai / trust-fabric / control-plane
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-500">LIVE</span>
        </div>
      </div>

      {/* Dashboard body */}
      <div className="grid md:grid-cols-[220px_1fr_240px] divide-x divide-white/[0.05]">
        {/* Left: Agent list */}
        <div className="p-4 space-y-1">
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Active Agents</div>
          {[
            { name: 'ceo-agent-01', score: 91, status: 'autonomous' },
            { name: 'sales-agent-07', score: 74, status: 'supervised' },
            { name: 'dev-agent-03', score: 88, status: 'autonomous' },
            { name: 'support-agent-12', score: 34, status: 'observation' },
          ].map(a => (
            <div key={a.name} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/[0.03] cursor-default">
              <div>
                <div className="text-xs text-zinc-300 font-mono">{a.name}</div>
                <div className={`text-[10px] mt-0.5 ${
                  a.status === 'autonomous' ? 'text-emerald-500' :
                  a.status === 'supervised' ? 'text-amber-500' : 'text-zinc-500'
                }`}>{a.status}</div>
              </div>
              <div className="text-xs font-mono font-semibold text-zinc-400">{a.score}</div>
            </div>
          ))}
        </div>

        {/* Center: Live event feed */}
        <div className="p-4 font-mono text-xs space-y-2 overflow-hidden">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">Trust Fabric Events</div>
          {[
            { t: '14:23:01', type: 'IDENTITY',   msg: 'ceo-agent-01 verified via token #a4f8b2', color: 'text-violet-400' },
            { t: '14:23:01', type: 'POLICY',     msg: 'action=data_write risk=medium → ALLOW', color: 'text-emerald-400' },
            { t: '14:23:02', type: 'DELEGATION', msg: 'token issued scope=[crm:write] depth=1', color: 'text-blue-400' },
            { t: '14:23:03', type: 'POLICY',     msg: 'action=external_api risk=high → APPROVE', color: 'text-amber-400' },
            { t: '14:23:04', type: 'PROVENANCE', msg: 'ledger entry #1248 hash=9a3c… chained ✓', color: 'text-emerald-400' },
            { t: '14:23:05', type: 'TRUST',      msg: 'sales-agent-07 score updated 71→74', color: 'text-zinc-400' },
            { t: '14:23:06', type: 'POLICY',     msg: 'action=pii_access risk=high → DENY', color: 'text-red-400' },
            { t: '14:23:07', type: 'MEMORY',     msg: 'write blocked: sensitivity=restricted', color: 'text-red-400' },
          ].map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.12, duration: 0.3 }}
              className="flex items-start gap-2"
            >
              <span className="text-zinc-600 shrink-0">{e.t}</span>
              <span className={`shrink-0 w-20 ${e.color}`}>{e.type}</span>
              <span className="text-zinc-500 truncate">{e.msg}</span>
            </motion.div>
          ))}
        </div>

        {/* Right: Trust score */}
        <div className="p-4">
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Trust Overview</div>
          <div className="flex items-center gap-3 mb-5">
            <ScoreRing score={87} size={52} />
            <div>
              <div className="text-xl font-bold text-white font-mono">87</div>
              <div className="text-[10px] text-emerald-500 font-mono">AUTONOMOUS</div>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { l: 'mission_success', v: 94, c: 'bg-emerald-500' },
              { l: 'error_recovery', v: 89, c: 'bg-blue-500' },
              { l: 'override_rate', v: 6, c: 'bg-amber-500' },
            ].map(m => (
              <div key={m.l}>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                  <span>{m.l}</span>
                  <span>{m.v}%</span>
                </div>
                <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${m.c} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.v}%` }}
                    transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="text-[10px] font-mono text-zinc-600 mb-2">Policy summary</div>
            <div className="space-y-1 text-[10px] font-mono">
              <div className="flex justify-between"><span className="text-zinc-500">Allowed</span><span className="text-emerald-500">1,204</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Approved</span><span className="text-amber-500">48</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Denied</span><span className="text-red-500">12</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Bento Grid ───────────────────────────────────────────────────────────────
const BentoGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
    {/* Large: Trust Scoring */}
    <motion.div
      {...inView(0)}
      className="md:col-span-2 lg:col-span-1 rounded-2xl border border-white/[0.07] bg-[#111113] p-6 flex flex-col"
    >
      <Fingerprint size={20} className="text-violet-400 mb-4" />
      <h3 className="font-jakarta font-semibold text-white mb-2">Dynamic Trust Scoring</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">
        Every agent earns a trust score from 0–100, recalculated after each mission. Mission success rate, human override frequency, and error recovery rate determine whether an agent runs autonomously, supervised, or under observation.
      </p>
      <div className="mt-auto">
        <div className="flex items-center gap-4">
          <ScoreRing score={87} size={56} />
          <div className="flex-1 space-y-2">
            {[
              { label: 'mission_success', val: 94, color: 'bg-emerald-500' },
              { label: 'error_recovery', val: 89, color: 'bg-blue-500' },
              { label: 'override_rate', val: 6, color: 'bg-amber-500' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-[10px] font-mono text-zinc-600 mb-0.5">
                  <span>{m.label}</span>
                  <span>{m.val}%</span>
                </div>
                <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${m.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.val}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          {[
            { label: '< 40  Observation', color: 'bg-red-500/10 text-red-400 border-red-500/15' },
            { label: '40–70  Supervised', color: 'bg-amber-500/10 text-amber-400 border-amber-500/15' },
            { label: '> 70  Autonomous',  color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' },
          ].map(b => (
            <span key={b.label} className={`text-[10px] font-mono px-2 py-1 rounded-full border ${b.color}`}>{b.label}</span>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Policy Engine */}
    <motion.div {...inView(0.06)} className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 flex flex-col">
      <Shield size={20} className="text-blue-400 mb-4" />
      <h3 className="font-jakarta font-semibold text-white mb-2">Adaptive Policy Engine</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">
        Pre-action governance checks at runtime. Define allow / deny / require-approval rules per action type, risk level, and trust score — no code changes needed.
      </p>
      <div className="space-y-1.5">
        <PolicyChip effect="allow"   rule="action=read trust>40" />
        <PolicyChip effect="approve" rule="action=data_write risk=high" />
        <PolicyChip effect="deny"    rule="action=pii_access agent≠verified" />
        <PolicyChip effect="approve" rule="action=external_api spend>$10" />
      </div>
    </motion.div>

    {/* Delegation Tokens */}
    <motion.div {...inView(0.1)} className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 flex flex-col">
      <KeyRound size={20} className="text-violet-400 mb-4" />
      <h3 className="font-jakarta font-semibold text-white mb-2">Delegation Token Engine</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">
        Task-scoped JWT tokens with scope attenuation. Child tokens can only narrow parent scope — never expand it. Revoking a token cascades instantly to all descendants.
      </p>
      <div className="rounded-xl bg-[#0D0D10] border border-white/[0.05] p-3 font-mono text-[10px] text-zinc-500 space-y-1">
        <div><span className="text-violet-400">scope</span>: crm:read, crm:write</div>
        <div><span className="text-blue-400">depth</span>: 1 <span className="text-zinc-600">// max delegation depth</span></div>
        <div><span className="text-amber-400">expires</span>: 3600s</div>
        <div><span className="text-emerald-400">status</span>: active ✓</div>
      </div>
    </motion.div>

    {/* Provenance Ledger */}
    <motion.div {...inView(0.14)} className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 flex flex-col">
      <FileCheck size={20} className="text-emerald-400 mb-4" />
      <h3 className="font-jakarta font-semibold text-white mb-2">SHA-256 Provenance Ledger</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">
        Every agent action is recorded in a tamper-evident, hash-chained ledger. Answers: who authorized it, what the agent saw, why it chose the action, and what changed.
      </p>
      <div className="rounded-xl bg-[#0D0D10] border border-white/[0.05] p-3 font-mono text-[11px] space-y-2">
        {[
          { n: 1247, hash: '9a3c…', prev: '7b2f…', ok: true },
          { n: 1248, hash: 'c41e…', prev: '9a3c…', ok: true },
          { n: 1249, hash: '8d90…', prev: 'c41e…', ok: true },
        ].map(e => (
          <div key={e.n} className="flex items-center gap-2 text-zinc-600">
            <span className="text-zinc-500">#{e.n}</span>
            <span className="text-emerald-600">{e.hash}</span>
            <span>←</span>
            <span>{e.prev}</span>
            {e.ok && <CheckCircle2 size={10} className="text-emerald-500 ml-auto" />}
          </div>
        ))}
        <div className="text-[10px] text-zinc-600 pt-1 border-t border-white/[0.04]">chain integrity: verified ✓</div>
      </div>
    </motion.div>

    {/* Memory Governance */}
    <motion.div {...inView(0.18)} className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 flex flex-col">
      <Database size={20} className="text-amber-400 mb-4" />
      <h3 className="font-jakarta font-semibold text-white mb-2">Memory Governance</h3>
      <p className="text-zinc-500 text-sm leading-relaxed mb-5 flex-1">
        Policy-governed agent memory with four sensitivity tiers, retention enforcement, and access boundaries. Confidential data never leaks across agent boundaries.
      </p>
      <div className="space-y-2">
        {[
          { tier: 'restricted',    access: 'agent_private', color: 'text-red-400 bg-red-500/10 border-red-500/15' },
          { tier: 'confidential',  access: 'team_shared',   color: 'text-amber-400 bg-amber-500/10 border-amber-500/15' },
          { tier: 'internal',      access: 'mission_scoped',color: 'text-blue-400 bg-blue-500/10 border-blue-500/15' },
          { tier: 'public',        access: 'organization',  color: 'text-zinc-400 bg-white/5 border-white/10' },
        ].map(t => (
          <div key={t.tier} className="flex items-center justify-between text-[10px] font-mono">
            <span className={`px-2 py-0.5 rounded-full border ${t.color}`}>{t.tier}</span>
            <span className="text-zinc-600">{t.access}</span>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Multi-agent Coordination */}
    <motion.div {...inView(0.22)} className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 flex flex-col">
      <Network size={20} className="text-blue-400 mb-4" />
      <h3 className="font-jakarta font-semibold text-white mb-2">Multi-Agent Coordination</h3>
      <p className="text-zinc-500 text-sm leading-relaxed flex-1">
        Agent-to-agent delegation with fault recovery and automatic reassignment. CEO delegates to Sales, Developer, Support — each with attenuated trust scope. The coordination graph is live and observable.
      </p>
    </motion.div>
  </div>
);

// ─── Product Cards ────────────────────────────────────────────────────────────
const ProductCards = () => (
  <div className="grid md:grid-cols-3 gap-5">
    {[
      {
        icon: Shield,
        label: 'Our moat',
        name: 'AgentIRL',
        color: 'text-violet-400',
        accent: 'border-violet-500/20 bg-violet-500/5',
        desc: 'The trust governance layer for autonomous agents. Cryptographic identity, dynamic trust scoring, policy enforcement, delegation tokens, provenance ledger, and memory governance — enforced at runtime.',
        href: '/services/agentirl',
        features: ['Trust Scoring Engine', 'Policy Gateway', 'Provenance Ledger', 'Delegation Tokens', 'Memory Governance'],
      },
      {
        icon: Server,
        label: 'Infrastructure',
        name: 'Viktron Cloud',
        color: 'text-blue-400',
        accent: 'border-blue-500/15 bg-blue-500/[0.03]',
        desc: 'Deploy and orchestrate AI agents at enterprise scale. Multi-agent task queues with capability routing, 100+ pre-built integrations, auto-scaling, and 60% LLM cost reduction via smart caching.',
        href: '/enterprise',
        features: ['Multi-agent orchestration', 'Agent rental marketplace', 'Auto-scaling runtime', '100+ integrations'],
      },
      {
        icon: BarChart3,
        label: 'Observability',
        name: 'AI Analytics',
        color: 'text-emerald-400',
        accent: 'border-emerald-500/15 bg-emerald-500/[0.03]',
        desc: 'Full observability for AI agents. Real-time OTLP telemetry, session replay, bot crawl analytics, and A/B experimentation — so you can see exactly what agents do and continuously improve them.',
        href: '/analytics',
        features: ['Session replay', 'Real-time telemetry', 'A/B experimentation', 'Bot crawl analytics'],
      },
    ].map((p, i) => {
      const Icon = p.icon;
      return (
        <motion.div
          key={i}
          {...inView(i * 0.07)}
          className={`rounded-2xl border p-6 flex flex-col ${p.accent}`}
        >
          <div className="flex items-start justify-between mb-5">
            <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center ${p.color}`}>
              <Icon size={18} />
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border ${
              i === 0 ? 'text-violet-400 bg-violet-500/10 border-violet-500/20' : 'text-zinc-600 border-white/[0.06] bg-white/[0.02]'
            }`}>{p.label}</span>
          </div>
          <h3 className="font-jakarta text-xl font-bold text-white mb-3">{p.name}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>
          <ul className="space-y-1.5 mb-6">
            {p.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                <CheckCircle2 size={11} className={p.color} />
                {f}
              </li>
            ))}
          </ul>
          <Link
            to={p.href}
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${p.color} hover:opacity-80 transition-opacity`}
          >
            Learn more <ChevronRight size={14} />
          </Link>
        </motion.div>
      );
    })}
  </div>
);

// ─── Comparison Table ─────────────────────────────────────────────────────────
const ComparisonTable = () => (
  <motion.div {...inView(0.06)}>
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left py-3 pr-6 text-xs font-normal text-zinc-600 uppercase tracking-wider w-[45%]">
              Capability
            </th>
            <th className="py-3 px-3 text-center w-[14%]">
              <div className="font-semibold text-white text-sm">Viktron</div>
              <div className="text-[10px] text-violet-400 font-mono">AgentIRL</div>
            </th>
            {['LangChain', 'CrewAI', 'AutoGen'].map(n => (
              <th key={n} className="py-3 px-3 text-center w-[14%] text-zinc-600 text-xs font-normal">{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {compRows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors">
              <td className="py-2.5 pr-6 text-zinc-500 text-xs">{row.feature}</td>
              <td className="py-2.5 px-3 text-center">
                <CheckCircle2 size={15} className="text-emerald-500 mx-auto" />
              </td>
              {[row.lc, row.ca, row.ag].map((has, j) => (
                <td key={j} className="py-2.5 px-3 text-center">
                  {has
                    ? <CheckCircle2 size={13} className="text-zinc-600 mx-auto" />
                    : <span className="text-zinc-700 text-lg leading-none">—</span>
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

