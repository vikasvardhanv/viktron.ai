/**
 * Viktron AI — Enterprise Page
 * "Institutional Governance & Infrastructure."
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, FileText, Lock, Users, CheckCircle2,
  ArrowRight, BarChart3, GitBranch, AlertTriangle,
  Clock, Database, Layers, Building2, Globe, Zap,
  Eye, Key, Cpu, Activity, Fingerprint
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="section-label">{children}</div>
);

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const trustPillars = [
  {
    icon: FileText,
    title: 'Audit-Grade Action Logs',
    desc: 'Every agent action produces a signed, immutable record: authorized intent, observation space, decision logic, and system impact.',
  },
  {
    icon: AlertTriangle,
    title: 'Approval Gates',
    desc: 'Destructive operations — financial transfers, mass deletion, PII access — are paused for human verification before execution.',
  },
  {
    icon: Key,
    title: 'Scoped Delegation',
    desc: "Agents authorized per task with dynamic JWT limits: time window, cost cap, and allowed toolsets. No standing access permissions.",
  },
  {
    icon: BarChart3,
    title: 'Budget Enforcement',
    desc: 'Hard monthly caps per agent workforce. Real-time spend tracking with automatic pausing at threshold. Zero surprise billing.',
  },
  {
    icon: Activity,
    title: 'OTLP Observability',
    desc: 'OTLP-compatible tracing on every run: token usage, latency, and reasoning chains. Pipe to Datadog or any OpenTelemetry backend.',
  },
  {
    icon: Lock,
    title: 'Encrypted Credentials',
    desc: 'Service credentials are encrypted at rest with Fernet symmetric keys. Tenant isolation is enforced at the database layer.',
  },
];

const tiers = [
  {
    name: 'Team',
    price: '$2,000',
    period: '/mo',
    desc: 'One department, fully governed.',
    features: ['5 Agent Roles', 'Audit Log Exports', 'Human Approval Gates', 'Budget Guards', 'Standard SLA'],
  },
  {
    name: 'Department',
    price: '$6,000',
    period: '/mo',
    desc: 'Shared governance across units.',
    features: ['Unlimited Agents', 'Cross-Agent DAGs', 'OTLP Telemetry', 'SSO / SAML', 'Enhanced SLA'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Full platform with guarantees.',
    features: ['Private VPC Deployment', 'SOC 2 Package', 'Custom Retention', 'Dedicated Architect', 'Institutional SLA'],
  },
];

export const Enterprise: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO title="Enterprise AI Governance — Viktron AI" description="Institutional-grade governance for autonomous AI agent teams. Audit logs, human-in-the-loop approvals, and SOC 2 compliance." />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen bg-[#050505] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
          <FU d={0}>
             <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.3em] uppercase font-bold text-glow mb-12">
                <div className="w-12 h-px bg-primary" />
                INSTITUTIONAL_READY // SOC2_TYPE_II
             </div>
          </FU>
          <FU d={0.1}>
            <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black">
              GOVERN<br />
              <span className="text-zinc-700">EVERYTHING.</span>
            </h1>
            <p className="heading-editorial text-3xl md:text-4xl text-zinc-300 mt-12 max-w-3xl">
              The only AI infrastructure layer your compliance team will authorize.
            </p>
          </FU>
          <FU d={0.2} className="mt-16 flex flex-wrap gap-6">
             <Link to="/contact" className="btn-acid !px-12 !py-6">Request Enterprise Demo</Link>
             <Link to="/services/agentirl" className="btn-obsidian !px-12 !py-6">Platform Architecture</Link>
          </FU>
        </div>
      </section>

      {/* ══════════════════ METRICS ══════════════════ */}
      <section className="py-20 bg-[#050505] border-y border-white/5 relative">
         <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 overflow-hidden">
               {[
                 { v: '100%', l: 'Provenanc Record', s: 'SHA-256 Signed' },
                 { v: '< 50ms', l: 'Gate Latency', s: 'Sub-millisecond eval' },
                 { v: '99.99%', l: 'Uptime SLA', s: 'Contractual Guarantee' },
                 { v: '$0.00', l: 'Uncontrolled Spend', s: 'Hard-cap Enforcement' },
               ].map((m, i) => (
                 <FU key={i} d={i * 0.05} className="bg-[#050505] p-12 text-center group hover:bg-[#080808] transition-colors">
                    <div className="text-5xl font-black text-white mb-2 tracking-tighter group-hover:text-primary transition-colors">{m.v}</div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{m.l}</div>
                    <div className="text-[9px] font-mono text-primary/40 uppercase tracking-widest">{m.s}</div>
                 </FU>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════════ PILLARS ══════════════════ */}
      <section className="py-40 bg-[#080808] relative">
         <div className="max-w-7xl mx-auto px-6">
            <Label>THE GOVERNANCE STACK</Label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
               {trustPillars.map((p, i) => {
                 const Icon = p.icon;
                 return (
                   <FU key={i} d={i * 0.05} className="obsidian-panel p-12 space-y-8 group hover:border-primary/40 transition-all">
                      <div className="w-14 h-14 obsidian-inset flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                         <Icon size={28} />
                      </div>
                      <h3 className="text-white font-bold text-xl uppercase tracking-tighter">{p.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
                   </FU>
                 );
               })}
            </div>
         </div>
      </section>

      {/* ══════════════════ COMPLIANCE ══════════════════ */}
      <section className="py-40 bg-[#050505] relative border-y border-white/5 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <FU d={0}>
                  <Label>SOC 2 READY</Label>
                  <h2 className="heading-precision text-6xl text-white uppercase tracking-tighter mb-10 leading-[0.85]">Audit trails,<br />automated.</h2>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                     Every enterprise deployment includes a complete SOC 2 Type II evidence 
                     package. Immutable records of every agent decision are stored in 
                     a tamper-evident chain of provenance.
                  </p>
                  <div className="space-y-6">
                     {['Control Matrix CC1-CC9', 'Automated Evidence Collection', 'SIEM Integration Ready', 'AES-256 Multi-Layer Encryption'].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-zinc-300 font-mono text-xs tracking-widest">
                           <CheckCircle2 size={14} className="text-primary" />
                           {item.toUpperCase()}
                        </div>
                     ))}
                  </div>
               </FU>
               <FU d={0.2} className="obsidian-panel p-12 relative group shimmer">
                  <div className="scan-line opacity-20" />
                  <div className="space-y-6 font-mono text-[10px]">
                     <div className="flex justify-between text-zinc-500 pb-4 border-b border-white/5 uppercase font-bold tracking-widest">
                        <span>TRUST_REPORT_EXPORT</span>
                        <span>04_2026</span>
                     </div>
                     {[
                       { l: 'TASKS_COMPLETED', v: '4,812', c: 'text-white' },
                       { l: 'HUMAN_APPROVALS', v: '38', c: 'text-primary' },
                       { l: 'BLOCKS_ENFORCED', v: '12', c: 'text-primary' },
                       { l: 'TOTAL_LLM_SPEND', v: '$94.17', c: 'text-white' },
                       { l: 'UPTIME_VERIFIED', v: '99.99%', c: 'text-primary' },
                     ].map((row, i) => (
                        <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                           <span className="text-zinc-500">{row.l}</span>
                           <span className={`${row.c} font-bold text-glow`}>{row.v}</span>
                        </div>
                     ))}
                     <div className="pt-4 text-primary font-bold tracking-tighter text-[11px]">
                        ✓ SIGNED_SHA-256_VERIFIED
                     </div>
                  </div>
               </FU>
            </div>
         </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section className="py-40 bg-[#080808] relative">
         <div className="max-w-7xl mx-auto px-6">
            <Label>SCALABLE GOVERNANCE</Label>
            <div className="grid md:grid-cols-3 gap-8 mt-20">
               {tiers.map((t, i) => (
                 <FU key={i} d={i * 0.05} className={`obsidian-panel p-12 flex flex-col h-full ${t.highlight ? 'border-primary/50' : 'border-white/5'}`}>
                    <h3 className="text-white font-bold text-2xl uppercase tracking-tighter mb-2">{t.name}</h3>
                    <p className="text-zinc-500 text-xs mb-8">{t.desc}</p>
                    <div className="flex items-baseline gap-2 mb-10">
                       <span className="text-5xl font-black text-white tracking-tighter">{t.price}</span>
                       <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">{t.period}</span>
                    </div>
                    <ul className="space-y-4 mb-12 flex-1">
                       {t.features.map((f, j) => (
                         <li key={j} className="flex items-start gap-4 text-xs text-zinc-400 font-mono tracking-widest uppercase">
                            <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0" />
                            {f}
                         </li>
                       ))}
                    </ul>
                    <Link to="/contact" className={t.highlight ? 'btn-acid w-full py-5' : 'btn-obsidian w-full py-5'}>
                       {t.name === 'Enterprise' ? 'Contact Sales' : 'Request Access'}
                    </Link>
                 </FU>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-60 bg-[#050505] text-center relative overflow-hidden">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  AUTHORIZE<br />SCALE.
               </h2>
               <div className="flex flex-wrap justify-center gap-10">
                  <Link to="/contact" className="btn-acid px-16 py-6">Deploy Control Plane</Link>
                  <Link to="/contact" className="btn-obsidian px-16 py-6">Request Case Study</Link>
               </div>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
