/**
 * Viktron AI — Landing Page
 * "The Enterprise Control Plane For AI Agents."
 *
 * Design Architecture:
 * - Style: $100M Series B infrastructure company (Linear / 21st.dev inspired).
 * - Philosophy: Dense, conviction-heavy, technical, premium.
 * - Components: Glassmorphism, Bento Grid, Custom HUD Visuals.
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, BarChart3, Server, CheckCircle2,
  ChevronRight, Lock, Activity, Fingerprint, KeyRound,
  FileCheck, AlertTriangle, DollarSign, Terminal,
  Layers, Cpu, Globe, Zap, Database, Search
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type LogLine = {
  ts: string;
  kind: 'cmd' | 'ok' | 'warn' | 'deny' | 'info';
  text: string;
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

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
];

const LINE_COLORS: Record<LogLine['kind'], string> = {
  cmd:  'text-zinc-300',
  ok:   'text-emerald-400',
  warn: 'text-amber-400',
  deny: 'text-red-400',
  info: 'text-zinc-500',
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const Tag = ({ children, color = 'zinc' }: { children: React.ReactNode; color?: string }) => {
  const styles: Record<string, string> = {
    zinc:    'bg-white/5 border-white/10 text-zinc-400',
    violet:  'bg-violet-500/10 border-violet-500/20 text-violet-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber:   'bg-amber-500/10 border-amber-500/20 text-amber-400',
    blue:    'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${styles[color] || styles.zinc}`}>
      {children}
    </span>
  );
};

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── VISUALS ──────────────────────────────────────────────────────────────────

const TrustFabricVisual: React.FC = () => {
  const [visible, setVisible] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= SCRIPT.length) {
      const t = setTimeout(() => setVisible(0), 5000);
      return () => clearTimeout(t);
    }
    const delay = visible === 0 ? 1000 : 400 + Math.random() * 600;
    const t = setTimeout(() => setVisible(v => v + 1), delay);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [visible]);

  return (
    <div className="relative w-full group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
      <div className="relative rounded-xl border border-white/10 bg-[#0A0B10] overflow-hidden shadow-2xl">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
            <Shield size={10} className="text-violet-500" />
            viktron.ai / agentirl-runtime
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-500 font-bold tracking-tighter">SECURE_ACTIVE</span>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-6 h-80 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 no-scrollbar bg-[#08090E]/50">
          <AnimatePresence initial={false}>
            {SCRIPT.slice(0, visible).map((line, i) => (
              <motion.div
                key={`${i}-${visible}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex gap-3 ${LINE_COLORS[line.kind]}`}
              >
                <span className="shrink-0 text-zinc-700 select-none">{line.ts}</span>
                <span className="whitespace-pre-wrap">{line.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {visible < SCRIPT.length && (
            <motion.div 
              animate={{ opacity: [0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1.5 h-3 bg-violet-500/80 ml-1 translate-y-0.5" 
            />
          )}
          <div ref={bottomRef} />
        </div>

        {/* Status Bar */}
        <div className="px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
          <div className="flex gap-4 text-[9px] font-mono text-zinc-600">
            <span>UPTIME: 14d 02h</span>
            <span>POLICIES: 128 ENFORCED</span>
            <span>LEDGER: #A429</span>
          </div>
          <div className="text-[9px] font-mono text-zinc-500">
            SHA-256: <span className="text-zinc-300">8c7a...2f1b</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExecutionShield: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  const layers = [
    { id: 'id', name: 'Identity', icon: Fingerprint, color: 'text-violet-400', desc: 'Cryptographic identity verified before every tool call.' },
    { id: 'dg', name: 'Delegation', icon: KeyRound, color: 'text-blue-400', desc: 'Scoped JWTs ensure child agents never expand scope.' },
    { id: 'pg', name: 'Policy Gate', icon: Shield, color: 'text-amber-400', desc: 'Runtime rules: Allow / Deny / Approve based on risk.' },
    { id: 'bg', name: 'Budget', icon: DollarSign, color: 'text-emerald-400', desc: 'Hard limits on token spend and API costs per agent.' },
    { id: 'sc', name: 'Secrets', icon: Lock, color: 'text-red-400', desc: 'Zero-trust vault: Agents never see raw API keys.' },
    { id: 'pr', name: 'Provenance', icon: FileCheck, color: 'text-zinc-300', desc: 'Immutable SHA-256 chain of every decision made.' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {layers.map((l, i) => {
        const Icon = l.icon;
        const isActive = active === i;
        return (
          <motion.div
            key={l.id}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`relative p-5 rounded-2xl border transition-remotion cursor-default h-44 flex flex-col justify-between ${
              isActive ? 'bg-white/[0.04] border-white/20 -translate-y-1' : 'bg-white/[0.02] border-white/5'
            }`}
          >
            <div className="space-y-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 ${l.color}`}>
                <Icon size={16} />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">{l.name}</h4>
            </div>
            <p className={`text-[11px] leading-relaxed transition-opacity duration-300 ${isActive ? 'opacity-100 text-zinc-400' : 'opacity-0 h-0 overflow-hidden'}`}>
              {l.desc}
            </p>
            {!isActive && <div className="text-[10px] font-mono text-zinc-700">LAYER_0{i+1}</div>}
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

export const Landing: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <Layout showBackground={false}>
      <SEO
        title="Viktron AI — The Enterprise Control Plane for AI Agents"
        description="Viktron's AgentIRL Trust Fabric provides the governance infrastructure to run autonomous AI agents safely at scale. SOC 2 ready, SHA-256 provenance."
      />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#08090E] pt-20">
        {/* Background Layer */}
        <div className="absolute inset-0 hero-glow-main pointer-events-none" />
        <div 
          className="grid-rays pointer-events-none" 
          style={{ '--mouse-x': `${mouse.x}%`, '--mouse-y': `${mouse.y}%` } as any} 
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <FU d={0}>
            <div className="flex justify-center mb-8">
              <Link to="/services/agentirl" className="group">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-sm transition-remotion group-hover:bg-violet-500/10 group-hover:border-violet-500/30">
                  <Tag color="violet">New</Tag>
                  <span className="text-[11px] font-bold text-violet-300 tracking-tight">AgentIRL Trust Fabric is now SOC 2 Ready</span>
                  <ArrowRight size={12} className="text-violet-500 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </FU>

          <FU d={0.08}>
            <h1 className="heading-hero text-6xl md:text-8xl lg:text-[110px] text-white mb-8">
              The Control Plane<br />
              <span className="text-zinc-500">For AI Agents.</span>
            </h1>
          </FU>

          <FU d={0.16}>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl leading-relaxed mb-12">
              LangChain and CrewAI help you build agents. Viktron gives you the
              infrastructure to run them in production — with cryptographic identity,
              runtime policy enforcement, and tamper-evident audit trails.
            </p>
          </FU>

          <FU d={0.24}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="group relative px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm transition-remotion hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
              >
                Book a demo
                <div className="absolute inset-0 rounded-2xl border border-white/50 animate-pulse-glow pointer-events-none" />
              </Link>
              <Link
                to="/services/agentirl"
                className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold text-sm transition-remotion hover:bg-white/[0.06] hover:border-white/20 active:scale-95"
              >
                Explore Trust Fabric
              </Link>
            </div>
          </FU>

          {/* Visual Hook */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 max-w-5xl mx-auto relative group"
          >
            <div className="absolute -inset-10 bg-violet-600/10 rounded-[40px] blur-[100px] opacity-0 group-hover:opacity-100 transition-remotion duration-1000" />
            <TrustFabricVisual />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ STATS STRIP ══════════════════ */}
      <div className="border-y border-white/[0.06] bg-[#08090E]">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-between gap-8 md:gap-12">
          {[
            { n: '99.9%',   l: 'Uptime SLA' },
            { n: '<50ms',   l: 'Policy Eval Latency' },
            { n: '60%',     l: 'LLM Cost Reduction' },
            { n: 'SOC 2',   l: 'Compliance Ready' },
            { n: 'SHA-256', l: 'Chain Provenance' },
          ].map((s, i) => (
            <motion.div key={i} {...FU({ d: i * 0.05 })} className="flex-1 min-w-[120px] text-center md:text-left">
              <div className="text-2xl font-bold text-white mb-1 font-mono tracking-tighter">{s.n}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════ THE MOAT: AGENTIRL ══════════════════ */}
      <section className="py-32 bg-[#08090E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-[1fr_0.8fr] gap-20 items-center">
            <div>
              <FU d={0}>
                <Tag color="violet">The Proprietary Moat</Tag>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-6 mb-8">
                  AgentIRL™ Trust Fabric.<br />
                  Governance as Code.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                  Most teams build agents as "black boxes". Viktron treats them as high-stakes
                  enterprise actors. AgentIRL intercepts every tool call, reasoning step, and
                  memory write — enforcing security and compliance at the runtime layer.
                </p>
                <div className="space-y-6 mb-12">
                  {[
                    { t: 'Pre-Execution Policy Gates', d: 'Rules are evaluated before the LLM even sees the tool definition.' },
                    { t: 'Task-Scoped Delegation', d: 'JWT-based tokens that inherit and attenuate permissions.' },
                    { t: 'Tamper-Evident Provenance', d: 'Every decision is hash-chained and logged for permanent audit.' },
                  ].map((f, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="text-violet-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1">{f.t}</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">{f.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/services/agentirl" className="inline-flex items-center gap-2 text-violet-400 font-bold text-sm hover:gap-3 transition-all">
                  Deep-dive into AgentIRL Architecture <ArrowRight size={14} />
                </Link>
              </FU>
            </div>

            <div className="relative">
              <FU d={0.2}>
                <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 space-y-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-remotion duration-1000" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                          <Activity size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Trust Score HUD</div>
                          <div className="text-[10px] text-zinc-500 font-mono">Real-time Telemetry</div>
                        </div>
                      </div>
                      <Tag color="emerald">Autonomous</Tag>
                    </div>

                    <div className="space-y-6">
                      {[
                        { l: 'Identity Provenance', v: 100, c: 'bg-emerald-500' },
                        { l: 'Policy Adherence', v: 94, c: 'bg-violet-500' },
                        { l: 'Budget Guardrails', v: 88, c: 'bg-blue-500' },
                      ].map(stat => (
                        <div key={stat.l}>
                          <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-2 uppercase tracking-widest">
                            <span>{stat.l}</span>
                            <span>{stat.v}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${stat.v}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full ${stat.c} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="text-3xl font-bold text-white font-mono tracking-tighter">97.4</div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">Aggregated Trust Rank</div>
                    </div>
                  </div>
                </div>
              </FU>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ EXECUTION SHIELD ══════════════════ */}
      <section className="py-32 border-t border-white/[0.06] bg-[#08090E]">
        <div className="max-w-7xl mx-auto px-6">
          <FU d={0} className="mb-16">
            <Tag color="zinc">Security Stack</Tag>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-6 mb-6">
              The 6-Layer Execution Shield.
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Every action an agent takes is validated across six independent governance layers
              before a single byte is sent to a tool or API. No exceptions.
            </p>
          </FU>
          <ExecutionShield />
        </div>
      </section>

      {/* ══════════════════ PRODUCT TRIPTYCH ══════════════════ */}
      <section className="py-32 border-t border-white/[0.06] bg-[#08090E]">
        <div className="max-w-7xl mx-auto px-6">
          <FU d={0} className="mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              One Platform. Three Engines.
            </h2>
          </FU>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'AgentIRL',
                sub: 'Governance Engine',
                desc: 'The "Heart" of the platform. Intercepts, validates, and chains every agent action at the runtime level.',
                icon: Shield,
                color: 'text-violet-400',
                glow: 'group-hover:bg-violet-500/10',
              },
              {
                name: 'Viktron Cloud',
                sub: 'Orchestration Engine',
                desc: 'Scale agents across 100+ integrations with auto-scaling task queues and smart LLM cost routing.',
                icon: Server,
                color: 'text-blue-400',
                glow: 'group-hover:bg-blue-500/10',
              },
              {
                name: 'AI Analytics',
                sub: 'Observability Engine',
                desc: 'Full-fidelity session replay and OTLP telemetry. See what agents saw and why they chose their actions.',
                icon: BarChart3,
                color: 'text-emerald-400',
                glow: 'group-hover:bg-emerald-500/10',
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <FU key={i} d={i * 0.1}>
                  <div className="group bento-card-base h-full flex flex-col justify-between">
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-0 transition-remotion duration-700 ${p.glow}`} />
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${p.color}`}>
                        <Icon size={24} />
                      </div>
                      <div className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">{p.sub}</div>
                      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{p.name}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-8">{p.desc}</p>
                    </div>
                    <Link to="/enterprise" className="relative z-10 inline-flex items-center gap-2 text-white font-bold text-xs group-hover:gap-3 transition-all">
                      Explore Product <ArrowRight size={14} />
                    </Link>
                  </div>
                </FU>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ DIFFERENTIATOR ══════════════════ */}
      <section className="py-32 border-t border-white/[0.06] bg-[#0A0B10]">
        <div className="max-w-5xl mx-auto px-6">
          <FU d={0} className="text-center mb-20">
            <Tag color="amber">Why Viktron?</Tag>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-6">
              Infrastructure, Not Just Code.
            </h2>
          </FU>

          <div className="grid md:grid-cols-2 gap-12">
            <FU d={0.1}>
              <div className="space-y-6">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">The Framework Problem</div>
                <h3 className="text-2xl font-bold text-white leading-snug">
                  LangChain & CrewAI live in your repo.
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  They are libraries. If an agent goes rogue, the library can't stop it.
                  Compliance teams block them because there's no centralized control or audit.
                </p>
                <div className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5">
                  <div className="flex items-center gap-3 text-red-400 font-bold text-xs mb-3">
                    <AlertTriangle size={14} /> The Risk
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Unchecked tool calls, data leakage, and runaway token spend leading to security breaches and financial loss.
                  </p>
                </div>
              </div>
            </FU>

            <FU d={0.2}>
              <div className="space-y-6">
                <div className="text-xs font-bold text-violet-400 uppercase tracking-widest">The Viktron Solution</div>
                <h3 className="text-2xl font-bold text-white leading-snug">
                  AgentIRL lives in the execution path.
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  We are infrastructure. We wrap your framework in a secure control plane
                  that enforces rules in real-time, providing SOC 2 proof for every action.
                </p>
                <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
                  <div className="flex items-center gap-3 text-emerald-400 font-bold text-xs mb-3">
                    <Shield size={14} /> The Moat
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Cryptographic provenance, task-scoped JWT tokens, and runtime policy enforcement that makes agents safe for production.
                  </p>
                </div>
              </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="py-40 bg-[#08090E] border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-600/5 opacity-50 blur-[120px] translate-y-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FU d={0}>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
              Your agents are ready.<br />
              Is your infrastructure?
            </h2>
            <p className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto">
              Join the future of governed autonomous operations. Deploy Viktron's
              Trust Fabric and start running production agents with confidence.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm transition-remotion hover:bg-zinc-200 active:scale-95"
              >
                Request Access
              </Link>
              <Link
                to="/rent-agent"
                className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold text-sm transition-remotion hover:bg-white/[0.06] hover:border-white/20 active:scale-95"
              >
                Rent an Agent
              </Link>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Shield size={12} /> SOC 2 Ready</span>
              <span className="flex items-center gap-2"><Lock size={12} /> Zero-Trust Vault</span>
              <span className="flex items-center gap-2"><Activity size={12} /> OTLP Native</span>
            </div>
          </FU>
        </div>
      </section>
    </Layout>
  );
};
