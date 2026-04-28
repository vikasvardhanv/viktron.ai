/**
 * Viktron AI — Landing Page
 * "The Enterprise Control Plane For AI Agents."
 *
 * Design: $100M Series B infrastructure company aesthetic.
 * Dark, dense, conviction-heavy. No decoration for its own sake.
 * Every pixel earns its place.
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, BarChart3, Server, CheckCircle2,
  ChevronRight, Lock, Activity, Fingerprint, KeyRound,
  FileCheck, AlertTriangle, DollarSign,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ─── Shared micro-components ──────────────────────────────────────────────────

const Tag = ({
  children,
  color = 'zinc',
}: {
  children: React.ReactNode;
  color?: 'zinc' | 'violet' | 'emerald' | 'amber' | 'blue' | 'red';
}) => {
  const c = {
    zinc:    'bg-white/5 border-white/10 text-zinc-400',
    violet:  'bg-violet-500/10 border-violet-500/25 text-violet-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    amber:   'bg-amber-500/10 border-amber-500/25 text-amber-400',
    blue:    'bg-blue-500/10 border-blue-500/25 text-blue-400',
    red:     'bg-red-500/10 border-red-500/25 text-red-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide uppercase ${c[color]}`}>
      {children}
    </span>
  );
};

// Subtle fade-up used throughout
const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── TRUST FABRIC VISUAL ──────────────────────────────────────────────────────
// Live terminal: intercepts rogue agent action, enforces SOC 2 policy gate.

type LogLine = {
  ts: string;
  kind: 'cmd' | 'ok' | 'warn' | 'deny' | 'info';
  text: string;
};

const SCRIPT: LogLine[] = [
  { ts: '09:14:01', kind: 'cmd',  text: '→ agent:sales-07  action:crm.bulk_export  risk:HIGH' },
  { ts: '09:14:01', kind: 'info', text: '  Verifying cryptographic identity token...' },
  { ts: '09:14:01', kind: 'ok',   text: '  ✓ Identity: sales-07 [trust_score=74 | supervised]' },
  { ts: '09:14:01', kind: 'info', text: '  Evaluating policy gate: action=crm.bulk_export risk=HIGH...' },
  { ts: '09:14:02', kind: 'warn', text: '  ⚠ Policy: HIGH-risk action requires human approval (trust < 80)' },
  { ts: '09:14:02', kind: 'info', text: '  Checking budget envelope: request=$0.00 / limit=$50.00 ✓' },
  { ts: '09:14:02', kind: 'info', text: '  Issuing scoped delegation token → scope:[crm:read] depth:0' },
  { ts: '09:14:02', kind: 'info', text: '  Recording provenance entry #4821 → sha256:a3f9c1...' },
  { ts: '09:14:02', kind: 'warn', text: '  ⏳ AWAITING HUMAN APPROVAL → notified: vikash@company.com' },
  { ts: '09:14:18', kind: 'ok',   text: '  ✓ Approved by: vikash@company.com  [2FA verified]' },
  { ts: '09:14:18', kind: 'info', text: '  Delegating with attenuated scope: crm.bulk_export → crm:read-only' },
  { ts: '09:14:19', kind: 'ok',   text: '  ✓ Execution complete. Provenance chain intact. Audit log updated.' },
  { ts: '09:14:19', kind: 'info', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
];

const LINE_COLORS: Record<LogLine['kind'], string> = {
  cmd:  'text-zinc-300',
  ok:   'text-emerald-400',
  warn: 'text-amber-400',
  deny: 'text-red-400',
  info: 'text-zinc-500',
};

const TrustFabricVisual: React.FC = () => {
  const [visible, setVisible] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= SCRIPT.length) {
      const t = setTimeout(() => setVisible(0), 4000);
      return () => clearTimeout(t);
    }
    const delay = visible === 0 ? 800 : 300 + Math.random() * 200;
    const t = setTimeout(() => setVisible(v => v + 1), delay);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [visible]);

  return (
    <div className="relative w-full">
      {/* Glow halo */}
      <div className="absolute -inset-8 bg-violet-500/8 rounded-3xl blur-3xl pointer-events-none" />

      <div className="relative rounded-2xl border border-white/8 bg-[#0C0C0F] overflow-hidden shadow-2xl">
        {/* Chrome */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="text-zinc-600">viktron / agentirl / trust-fabric</span>
            <span className="flex items-center gap-1 text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              INTERCEPTING
            </span>
          </div>
          <div className="flex gap-3 text-[10px] font-mono text-zinc-700">
            <span>SOC2</span>
            <span>SHA-256</span>
          </div>
        </div>

        {/* Log output */}
        <div className="p-5 h-72 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-0.5 no-scrollbar">
          <AnimatePresence initial={false}>
            {SCRIPT.slice(0, visible).map((line, i) => (
              <motion.div
                key={`${i}-${visible}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${LINE_COLORS[line.kind]}`}
              >
                <span className="shrink-0 text-zinc-700 select-none">{line.ts}</span>
                <span className="whitespace-pre-wrap">{line.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {visible < SCRIPT.length && (
            <div className="flex items-center gap-1 text-zinc-600 mt-1">
              <span className="text-violet-500">❯</span>
              <span className="w-2 h-[13px] bg-violet-500/60 animate-pulse" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Status bar */}
        <div className="border-t border-white/[0.05] px-5 py-2.5 flex items-center justify-between text-[10px] font-mono bg-white/[0.01]">
          <div className="flex items-center gap-4 text-zinc-600">
            <span>agents: 12 active</span>
            <span>policies: 34 rules</span>
            <span>chain: #4821</span>
          </div>
          <div className="flex items-center gap-2 text-violet-400">
            <Shield size={10} />
            <span>TRUST FABRIC ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 6-LAYER EXECUTION SHIELD ─────────────────────────────────────────────────

const SHIELD_LAYERS = [
  {
    n: '01',
    icon: Fingerprint,
    name: 'Identity',
    color: 'text-violet-400',
    ring: 'ring-violet-500/20',
    bg: 'bg-violet-500/8',
    desc: 'Cryptographic token bound to each agent. Verified before any action. No token, no execution.',
  },
  {
    n: '02',
    icon: KeyRound,
    name: 'Delegation',
    color: 'text-blue-400',
    ring: 'ring-blue-500/20',
    bg: 'bg-blue-500/8',
    desc: 'Scoped JWT tokens with attenuation. Child agents can only inherit narrower permissions than their parent.',
  },
  {
    n: '03',
    icon: Shield,
    name: 'Policy Gate',
    color: 'text-amber-400',
    ring: 'ring-amber-500/20',
    bg: 'bg-amber-500/8',
    desc: 'Runtime rule evaluation: allow, deny, or require human approval based on action type × trust score × risk level.',
  },
  {
    n: '04',
    icon: DollarSign,
    name: 'Budget',
    color: 'text-emerald-400',
    ring: 'ring-emerald-500/20',
    bg: 'bg-emerald-500/8',
    desc: 'Per-agent cost envelopes enforced before LLM calls, tool use, and API invocations. No surprise bills.',
  },
  {
    n: '05',
    icon: Lock,
    name: 'Credentials',
    color: 'text-red-400',
    ring: 'ring-red-500/20',
    bg: 'bg-red-500/8',
    desc: 'Zero-trust secrets injection. Agents never see raw credentials. Scoped access, auto-rotation, audit trail.',
  },
  {
    n: '06',
    icon: FileCheck,
    name: 'Provenance',
    color: 'text-zinc-300',
    ring: 'ring-zinc-500/20',
    bg: 'bg-white/4',
    desc: 'SHA-256 hash-chained ledger of every decision: who authorized it, what the agent saw, and what changed.',
  },
];

const ExecutionShield: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-6 gap-3">
      {SHIELD_LAYERS.map((layer, i) => {
        const Icon = layer.icon;
        const isActive = active === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`relative rounded-xl border border-white/[0.07] p-4 cursor-default transition-all duration-300 ${
              isActive ? `ring-1 ${layer.ring} border-white/10 -translate-y-1` : ''
            }`}
            style={{ background: isActive ? undefined : '#0C0C0F' }}
          >
            {isActive && (
              <div className={`absolute inset-0 rounded-xl ${layer.bg} pointer-events-none`} />
            )}
            <div className="relative z-10">
              <div className="text-[10px] font-mono text-zinc-700 mb-3">{layer.n}</div>
              <Icon size={18} className={`${layer.color} mb-3`} />
              <div className={`font-jakarta font-semibold text-sm mb-2 ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                {layer.name}
              </div>
              <p className={`text-[11px] leading-relaxed transition-colors duration-200 ${isActive ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {layer.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── PARADIGM SHIFT SECTION ───────────────────────────────────────────────────

const ParadigmShift: React.FC = () => (
  <div className="grid md:grid-cols-2 gap-px rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.07]">
    {/* Before */}
    <div className="bg-[#0C0C0F] p-10">
      <div className="mb-6">
        <Tag color="zinc">Before Viktron</Tag>
      </div>
      <h3 className="font-jakarta text-2xl font-bold text-white mb-4">Sandboxed Pilots</h3>
      <p className="text-zinc-500 leading-relaxed mb-8">
        Your AI agents live in demos, dev environments, and carefully watched proof-of-concepts.
        They can't touch production because no one can answer the question: <em className="text-zinc-400 not-italic">"How do we know what an agent will do?"</em>
      </p>
      <div className="space-y-3">
        {[
          'No audit trail for agent decisions',
          'Any agent can call any tool',
          'Costs spiral without guardrails',
          'Compliance team blocks deployment',
          'One rogue action poisons trust in everything',
        ].map(item => (
          <div key={item} className="flex items-start gap-2.5 text-sm text-zinc-500">
            <AlertTriangle size={14} className="text-zinc-700 mt-0.5 shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>

    {/* After */}
    <div className="bg-[#0C0C0F] p-10 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="mb-6">
        <Tag color="violet">With Viktron</Tag>
      </div>
      <h3 className="font-jakarta text-2xl font-bold text-white mb-4">Governed Production</h3>
      <p className="text-zinc-500 leading-relaxed mb-8">
        Agents are your <strong className="text-zinc-300 font-medium">AI workforce</strong>.
        AgentIRL is the <strong className="text-zinc-300 font-medium">HR, compliance, and ops layer</strong> that makes them safe to deploy autonomously —
        with cryptographic proof that every decision followed your rules.
      </p>
      <div className="space-y-3">
        {[
          'Tamper-evident ledger for every action',
          'Policy gates enforce least-privilege per agent',
          'Budget envelopes cap spend before it happens',
          'SOC 2 audit trail generated automatically',
          'Trust scores let good agents earn autonomy',
        ].map(item => (
          <div key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── COMPARISON TABLE ─────────────────────────────────────────────────────────

const COMP = [
  { f: 'Dynamic trust scoring per agent',            v: true,  l: false, c: false, a: false },
  { f: 'Cryptographic agent identity',               v: true,  l: false, c: false, a: false },
  { f: 'Scoped delegation tokens (child attenuation)',v: true,  l: false, c: false, a: false },
  { f: 'Pre-action policy enforcement',              v: true,  l: false, c: false, a: false },
  { f: 'SHA-256 hash-chained provenance',            v: true,  l: false, c: false, a: false },
  { f: 'Per-agent budget enforcement',               v: true,  l: false, c: false, a: false },
  { f: 'Sensitivity-tiered memory governance',       v: true,  l: false, c: false, a: false },
  { f: 'Human-in-loop (risk-aware, not everywhere)', v: true,  l: true,  c: true,  a: true  },
  { f: 'SOC 2 audit trail (auto-generated)',         v: true,  l: false, c: false, a: false },
  { f: 'Framework agnostic (LangChain/CrewAI/etc.)', v: true,  l: false, c: false, a: false },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export const Landing: React.FC = () => (
  <Layout showBackground={false}>
    <SEO
      title="Viktron AI — The Enterprise Control Plane for AI Agents"
      description="Viktron's AgentIRL Trust Fabric gives enterprise teams the governance infrastructure to run autonomous AI agents safely at scale. Cryptographic identity, dynamic trust scoring, runtime policy enforcement, and tamper-evident audit trails."
      keywords="enterprise AI agents, AI agent governance, AI trust fabric, autonomous agents production, AI agent policy enforcement, SOC 2 AI agents, AI agent orchestration, agent provenance ledger, AI agent trust scoring, enterprise AI infrastructure"
    />

    {/* ═══════════════════════════ HERO ═══════════════════════════ */}
    <section className="relative min-h-screen flex flex-col justify-center bg-[#08090E] overflow-hidden pt-20">
      {/* Background: faint radial + grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(139,92,246,0.14)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_0%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-center py-20">

          {/* Left: Copy */}
          <div>
            <FU d={0}>
              <div className="flex flex-wrap gap-2 mb-8">
                <Tag color="violet">
                  <Shield size={10} />
                  AgentIRL Trust Fabric
                </Tag>
                <Tag color="zinc">SOC 2 Ready</Tag>
                <Tag color="emerald">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SHA-256 Provenance
                </Tag>
              </div>
            </FU>

            <FU d={0.06}>
              <h1 className="font-jakarta text-5xl lg:text-[64px] font-extrabold text-white tracking-[-0.03em] leading-[1.04] mb-6">
                The Enterprise<br />
                Control Plane<br />
                <span className="text-zinc-500">For AI Agents.</span>
              </h1>
            </FU>

            <FU d={0.12}>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-xl">
                You've built the agents. Now build the infrastructure that makes them
                safe to run autonomously at scale — with cryptographic identity,
                runtime policy enforcement, and a tamper-evident audit trail
                that satisfies your compliance team.
              </p>
            </FU>

            <FU d={0.16}>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  'No rogue tool calls',
                  'No runaway costs',
                  'No compliance surprises',
                ].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-zinc-400 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {t}
                  </span>
                ))}
              </div>
            </FU>

            <FU d={0.2}>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_28px_rgba(139,92,246,0.35)]"
                >
                  Book a demo
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/services/trust-fabric"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.15] text-zinc-300 hover:text-white font-semibold text-sm transition-all duration-200"
                >
                  <Shield size={14} className="text-violet-400" />
                  Explore Trust Fabric
                </Link>
              </div>
            </FU>

            {/* Metrics strip */}
            <FU d={0.26} className="mt-12 pt-8 border-t border-white/[0.06] grid grid-cols-3 gap-6">
              {[
                { n: '<50ms', l: 'Policy evaluation' },
                { n: '99.9%', l: 'Uptime SLA' },
                { n: '60%',   l: 'LLM cost reduction' },
              ].map(s => (
                <div key={s.l}>
                  <div className="font-jakarta text-2xl font-bold text-white">{s.n}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">{s.l}</div>
                </div>
              ))}
            </FU>
          </div>

          {/* Right: Trust Fabric Visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <TrustFabricVisual />
          </motion.div>
        </div>
      </div>
    </section>

    {/* ══════════════════ PARADIGM SHIFT ══════════════════ */}
    <section className="bg-[#08090E] border-t border-white/[0.06] py-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <FU d={0} className="mb-12">
          <Tag color="zinc">The shift every enterprise is navigating</Tag>
          <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
            From sandboxed pilots to governed production.
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl">
            The problem isn't building AI agents. The problem is answering the question
            your CTO, legal team, and compliance team will ask before they let agents anywhere near production.
          </p>
        </FU>

        <FU d={0.1}>
          <ParadigmShift />
        </FU>
      </div>
    </section>

    {/* ═════════════════ 6-LAYER EXECUTION SHIELD ═════════════════ */}
    <section className="bg-[#08090E] border-t border-white/[0.06] py-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <FU d={0} className="mb-3">
          <Tag color="violet">
            <Shield size={10} />
            AgentIRL Trust Fabric
          </Tag>
        </FU>
        <FU d={0.05} className="mb-4">
          <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight">
            The 6-layer execution shield.
          </h2>
        </FU>
        <FU d={0.1} className="mb-14">
          <p className="text-zinc-500 text-lg max-w-2xl">
            Viktron doesn't hope agents behave. It <strong className="text-zinc-300 font-medium">cryptographically proves they did</strong> —
            by wrapping every action in six independently enforced layers before it executes.
          </p>
        </FU>

        <ExecutionShield />

        {/* Pipeline arrow visualization */}
        <FU d={0.15} className="mt-8">
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0C0C0F] px-6 py-4 overflow-x-auto no-scrollbar">
            {SHIELD_LAYERS.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <Icon size={14} className={layer.color} />
                    <span className="text-[10px] font-mono text-zinc-600">{layer.name}</span>
                  </div>
                  {i < SHIELD_LAYERS.length - 1 && (
                    <ChevronRight size={14} className="text-zinc-800 shrink-0 mx-2" />
                  )}
                </React.Fragment>
              );
            })}
            <div className="flex flex-col items-center gap-1.5 shrink-0 ml-4 pl-4 border-l border-white/[0.06]">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-[10px] font-mono text-emerald-600">Execute</span>
            </div>
          </div>
        </FU>

        <FU d={0.2} className="mt-8 text-center">
          <Link
            to="/services/trust-fabric"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors"
          >
            Deep-dive into the Trust Fabric
            <ChevronRight size={14} />
          </Link>
        </FU>
      </div>
    </section>

    {/* ════════════════════ PLATFORM TRIPTYCH ════════════════════ */}
    <section className="bg-[#08090E] border-t border-white/[0.06] py-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <FU d={0} className="mb-14">
          <Tag color="zinc">The platform</Tag>
          <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
            Three layers. One control plane.
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl">
            AgentIRL governs. Cloud deploys. Analytics observes. Each is useful alone.
            Together they're the complete infrastructure for enterprise AI at scale.
          </p>
        </FU>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Shield,
              tag: { text: 'Our moat', color: 'violet' as const },
              name: 'AgentIRL',
              sub: 'Trust Fabric',
              color: 'text-violet-400',
              border: 'border-violet-500/20',
              glow: 'rgba(139,92,246,0.06)',
              desc: 'The governance layer that makes autonomous agents safe for enterprise production. Cryptographic identity, dynamic trust scoring, policy enforcement, delegation tokens, provenance ledger, and memory governance — all enforced at runtime before any action executes.',
              href: '/services/agentirl',
              features: ['Trust Scoring Engine (0–100)', 'Adaptive Policy Gateway', 'SHA-256 Provenance Ledger', 'Scoped Delegation Tokens', 'Sensitivity-tiered Memory'],
            },
            {
              icon: Server,
              tag: { text: 'Infrastructure', color: 'blue' as const },
              name: 'Viktron Cloud',
              sub: 'Orchestration',
              color: 'text-blue-400',
              border: 'border-blue-500/15',
              glow: 'rgba(59,130,246,0.05)',
              desc: 'Deploy and orchestrate AI agents across your enterprise. Multi-agent task queues with capability routing, auto-scaling runtime, 100+ pre-built integrations, and 60% LLM cost reduction via intelligent prompt caching and model routing.',
              href: '/enterprise',
              features: ['Multi-agent task orchestration', 'Agent rental marketplace', 'Auto-scaling runtime', '100+ enterprise integrations', 'Prompt caching & model routing'],
            },
            {
              icon: BarChart3,
              tag: { text: 'Observability', color: 'emerald' as const },
              name: 'AI Analytics',
              sub: 'Intelligence',
              color: 'text-emerald-400',
              border: 'border-emerald-500/15',
              glow: 'rgba(16,185,129,0.05)',
              desc: 'Full observability for AI agents. Real-time OTLP telemetry, per-session replay of every decision and tool call, bot crawl analytics, and A/B experimentation across agent configurations — continuous improvement without guesswork.',
              href: '/analytics',
              features: ['Real-time OTLP telemetry', 'Full session replay', 'A/B experimentation', 'Bot crawl analytics', 'Cost attribution per agent'],
            },
          ].map((p, i) => {
            const Icon = p.icon;
            return (
              <FU key={i} d={i * 0.08}>
                <div
                  className={`h-full rounded-2xl border ${p.border} p-7 flex flex-col`}
                  style={{ background: `radial-gradient(ellipse at top, ${p.glow}, #0C0C0F 60%)` }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-10 h-10 rounded-xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center ${p.color}`}>
                      <Icon size={18} />
                    </div>
                    <Tag color={p.tag.color}>{p.tag.text}</Tag>
                  </div>
                  <div className="mb-1">
                    <span className="font-jakarta text-xl font-bold text-white">{p.name}</span>
                    <span className="text-zinc-600 text-sm ml-2">/ {p.sub}</span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed my-5 flex-1">{p.desc}</p>
                  <ul className="space-y-1.5 mb-6 border-t border-white/[0.05] pt-5">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                        <CheckCircle2 size={11} className={p.color} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={p.href} className={`inline-flex items-center gap-1.5 text-sm font-semibold ${p.color} hover:opacity-70 transition-opacity`}>
                    Learn more <ChevronRight size={14} />
                  </Link>
                </div>
              </FU>
            );
          })}
        </div>
      </div>
    </section>

    {/* ════════════════════ COMPARISON ════════════════════ */}
    <section className="bg-[#08090E] border-t border-white/[0.06] py-28">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <FU d={0} className="text-center mb-12">
          <Tag color="zinc">Competitive landscape</Tag>
          <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
            Nothing else does this.
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            LangChain, CrewAI, and AutoGen are frameworks.
            Viktron is the governance infrastructure that sits above all of them.
          </p>
        </FU>

        <FU d={0.08}>
          <div className="overflow-x-auto rounded-xl border border-white/[0.07] bg-[#0C0C0F]">
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-4 px-5 text-xs font-normal text-zinc-600 uppercase tracking-wider w-[44%]">Capability</th>
                  <th className="py-4 px-4 text-center">
                    <div className="text-white font-bold text-sm">Viktron</div>
                    <div className="text-violet-400 text-[10px] font-mono">AgentIRL</div>
                  </th>
                  {['LangChain', 'CrewAI', 'AutoGen'].map(n => (
                    <th key={n} className="py-4 px-4 text-center text-zinc-600 text-xs font-normal">{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMP.map((row, i) => (
                  <tr key={i} className={`border-b border-white/[0.04] ${i % 2 === 0 ? '' : 'bg-white/[0.008]'}`}>
                    <td className="py-3 px-5 text-zinc-500 text-xs">{row.f}</td>
                    <td className="py-3 px-4 text-center"><CheckCircle2 size={15} className="text-emerald-500 mx-auto" /></td>
                    {[row.l, row.c, row.a].map((has, j) => (
                      <td key={j} className="py-3 px-4 text-center">
                        {has ? <CheckCircle2 size={13} className="text-zinc-700 mx-auto" /> : <span className="text-zinc-800 text-xl leading-none">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FU>
      </div>
    </section>

    {/* ════════════════════ CTA ════════════════════ */}
    <section className="bg-[#08090E] border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto px-6 py-36 text-center">
        <FU d={0} className="mb-5 flex justify-center">
          <Tag color="violet">
            <Shield size={10} />
            Enterprise ready
          </Tag>
        </FU>
        <FU d={0.06}>
          <h2 className="font-jakarta text-5xl font-extrabold text-white tracking-tight mb-5">
            Your agents are ready.<br />
            Is your infrastructure?
          </h2>
        </FU>
        <FU d={0.1}>
          <p className="text-zinc-500 text-lg mb-10 max-w-xl mx-auto">
            See AgentIRL Trust Fabric running in your environment.
            Book a technical demo with our engineering team.
          </p>
        </FU>
        <FU d={0.14} className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all duration-200 shadow-[0_0_32px_rgba(139,92,246,0.35)]"
          >
            Book a demo
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/rent-agent"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.15] text-zinc-300 hover:text-white font-bold transition-all duration-200"
          >
            Rent an agent
          </Link>
        </FU>
        <FU d={0.2} className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-zinc-700">
          {['SOC 2 Ready', 'Framework agnostic', 'On-prem available', 'Human-in-loop controls', 'SHA-256 provenance'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 size={11} className="text-emerald-600" />
              {t}
            </span>
          ))}
        </FU>
      </div>
    </section>
  </Layout>
);
