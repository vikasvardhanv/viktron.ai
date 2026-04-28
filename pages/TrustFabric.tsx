/**
 * Viktron AI — Trust Fabric Page
 * /services/trust-fabric
 *
 * The governance deep-dive. This is the page your CISO, GC, and Compliance
 * lead will read before signing off on autonomous agent deployment.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Lock, CheckCircle2, FileCheck, Brain, Key,
  AlertTriangle, BarChart3, Clock, DollarSign, Users,
  ArrowRight, Fingerprint, ChevronRight, Eye, Database,
  Network, Activity, RefreshCw, GitMerge,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ServiceSEO } from '../components/ui/SEO';

// ─── Shared ───────────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay: d, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

const Tag = ({ children, color = 'zinc' }: { children: React.ReactNode; color?: 'zinc' | 'violet' | 'emerald' | 'amber' | 'blue' | 'red' }) => {
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

// ─── Trust score ring ─────────────────────────────────────────────────────────
const Ring = ({ score, size = 72 }: { score: number; size?: number }) => {
  const stroke = 5;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-label={`Trust score ${score}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
};

// ─── Trust pillars data ───────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: Fingerprint,
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    glow: 'rgba(139,92,246,0.06)',
    name: 'Agent Identity',
    tagline: 'Every agent has a cryptographic identity. No exceptions.',
    body: `Before an agent executes a single action, the Trust Fabric verifies its identity via a cryptographic token bound to its role, allowed tools, and access domains. There's no way to impersonate a trusted agent — the token is the identity.`,
    details: [
      'Cryptographic token per agent instance',
      'Role-based capability binding (allowed tools, domains)',
      'Trust score 0–100 computed from mission history',
      'Three autonomy levels: Observation / Supervised / Autonomous',
      'Verification at every action boundary, not just on startup',
    ],
    link: '/dashboard/agent-identity',
  },
  {
    icon: Key,
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    glow: 'rgba(59,130,246,0.05)',
    name: 'Delegation Tokens',
    tagline: 'Agents can delegate — but they can\'t grant what they don\'t have.',
    body: `When a CEO agent delegates to a Sales agent, it issues a scoped JWT delegation token. The child token can only narrow the parent's scope — never expand it. This means privilege escalation is cryptographically impossible. Revoke a parent token and all descendants are immediately invalidated.`,
    details: [
      'Task-scoped JWTs with full attenuation chain',
      'Child tokens can only narrow parent scope',
      'Configurable depth limits (default: 3 levels)',
      'Instant cascade revocation to all descendants',
      'Full delegation history in provenance ledger',
    ],
    link: '/dashboard/delegation-tokens',
  },
  {
    icon: Shield,
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'rgba(245,158,11,0.05)',
    name: 'Policy Gateway',
    tagline: 'Runtime governance rules. Zero code changes.',
    body: `Every agent action passes through the Policy Gateway before execution. Rules match on action type, risk level, agent trust score, and data sensitivity — then produce one of three outcomes: allow, deny, or require human approval. Define rules in the dashboard; they apply immediately across all running agents.`,
    details: [
      'Pre-action evaluation, not post-hoc review',
      'Conditions: action type, risk level, trust score, cost, sensitivity',
      'Three effects: allow / deny / require_approval',
      'Human approval with 2FA, tracked in provenance',
      'Risk classifiers: read / write / external_api / PII / destructive',
    ],
    link: '/dashboard/policy-gateway',
  },
  {
    icon: FileCheck,
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'rgba(16,185,129,0.05)',
    name: 'Provenance Ledger',
    tagline: 'A tamper-evident record of every decision, forever.',
    body: `The Provenance Ledger records every agent action in a SHA-256 hash-chained log. Each entry links to the previous via a prev_hash field — if a single record is altered, the entire chain fails verification. Your compliance team can audit exactly what every agent did, when, and why.`,
    details: [
      'SHA-256 hash chain: each entry links to previous',
      'Answers: who authorized, what goal, what agent saw, why it acted, what changed',
      'Cryptographic chain integrity verification API',
      'Queryable by agent, mission, time range, or action type',
      'Export for SOC 2, GDPR, HIPAA compliance packages',
    ],
    link: '/dashboard/provenance-ledger',
  },
  {
    icon: Brain,
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    glow: 'rgba(59,130,246,0.05)',
    name: 'Memory Governance',
    tagline: 'Agent memory with sensitivity enforcement and retention control.',
    body: `Agents accumulate memory across missions. Without governance, sensitive data leaks across agent boundaries. Memory Governance assigns sensitivity tiers to every memory entry, enforces access boundaries, applies retention policies, and masks restricted data automatically.`,
    details: [
      'Four sensitivity tiers: public / internal / confidential / restricted',
      'Four access scopes: agent_private / team_shared / mission_scoped / org',
      'Automatic PII detection and masking',
      'Retention policy enforcement with scheduled purge',
      'Memory access events recorded in provenance',
    ],
    link: '/dashboard/memory-governance',
  },
  {
    icon: BarChart3,
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    glow: 'rgba(139,92,246,0.06)',
    name: 'Trust Analytics',
    tagline: 'Know exactly how trustworthy your agents are, in real time.',
    body: `Trust Analytics gives you a live dashboard of agent trust scores, policy evaluation outcomes, approval workflow status, and compliance metrics. See which agents are earning autonomy, which are triggering policy violations, and where your human-in-loop bottlenecks are.`,
    details: [
      'Live trust score history per agent',
      'Policy violation rate and trend analysis',
      'Approval workflow latency and bottleneck detection',
      'Cost attribution per agent and per mission',
      'Exportable compliance reports',
    ],
    link: '/analytics',
  },
];

// ─── Policy rule visualizer ───────────────────────────────────────────────────
const POLICY_EXAMPLES = [
  { effect: 'allow' as const,   rule: 'action = read AND trust_score > 40' },
  { effect: 'allow' as const,   rule: 'action = crm.write AND trust_score > 70' },
  { effect: 'approve' as const, rule: 'action = data_write AND risk = HIGH' },
  { effect: 'approve' as const, rule: 'action = external_api AND cost > $10' },
  { effect: 'deny' as const,    rule: 'action = pii_access AND agent != verified' },
  { effect: 'deny' as const,    rule: 'action = destructive AND env = production' },
];

const effectStyle = {
  allow:   { label: 'ALLOW',   cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  approve: { label: 'APPROVE', cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  deny:    { label: 'DENY',    cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const TrustFabric: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Layout showBackground={false}>
      <ServiceSEO
        serviceName="AgentIRL Trust Fabric — Enterprise AI Agent Governance"
        serviceDescription="The governance layer that makes autonomous AI agents safe for enterprise production. Cryptographic identity, dynamic trust scoring, runtime policy enforcement, delegation tokens, and tamper-evident provenance. SOC 2 compliant."
      />

      {/* ═════════════════════════ HERO ═════════════════════════ */}
      <section className="relative bg-[#08090E] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_0%,transparent_100%)]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FU d={0} className="flex justify-center mb-6">
            <Tag color="violet">
              <Shield size={10} />
              AgentIRL Trust Fabric
            </Tag>
          </FU>

          <FU d={0.05}>
            <h1 className="font-jakarta text-5xl sm:text-6xl font-extrabold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              Govern your AI agents.<br />
              <span className="text-zinc-500">Cryptographically.</span>
            </h1>
          </FU>

          <FU d={0.1}>
            <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Trust Fabric is the six-layer governance infrastructure that sits between your AI agents
              and your business systems — enforcing identity, policy, budget, and audit trails
              before any action executes.
            </p>
          </FU>

          <FU d={0.14} className="flex flex-wrap gap-3 justify-center mb-12">
            {['SOC 2 compliant', 'SHA-256 provenance', 'Runtime policy enforcement', 'Human-in-loop (risk-aware)'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-zinc-400 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-full">
                <CheckCircle2 size={12} className="text-emerald-500" />
                {t}
              </span>
            ))}
          </FU>

          <FU d={0.18} className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_28px_rgba(139,92,246,0.3)]"
            >
              Book a demo
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/dashboard/agent-identity"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/15 text-zinc-300 hover:text-white font-semibold text-sm transition-all duration-200"
            >
              Go to dashboard
            </Link>
          </FU>
        </div>
      </section>

      {/* ════════ TRUST SCORE EXPLAINER ════════ */}
      <section className="bg-[#08090E] border-t border-white/[0.06] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <FU d={0} className="mb-4">
                <Tag color="zinc">Trust Scoring Engine</Tag>
              </FU>
              <FU d={0.05}>
                <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mb-5">
                  Agents earn autonomy.<br />They don't start with it.
                </h2>
              </FU>
              <FU d={0.1}>
                <p className="text-zinc-500 leading-relaxed mb-8">
                  Every agent starts in <strong className="text-zinc-300">Observation mode</strong> — all actions logged, nothing executed without approval.
                  As the agent completes missions successfully, its trust score rises. High-scoring agents
                  graduate to <strong className="text-zinc-300">Supervised</strong>, then <strong className="text-zinc-300">Autonomous</strong> mode.
                  Erratic behavior lowers the score automatically.
                </p>
              </FU>
              <FU d={0.14} className="space-y-3">
                {[
                  { range: '0 – 39', mode: 'Observation', desc: 'All actions require explicit approval', color: 'text-red-400', dot: 'bg-red-400' },
                  { range: '40 – 69', mode: 'Supervised', desc: 'Low-risk actions auto-approved; high-risk need approval', color: 'text-amber-400', dot: 'bg-amber-400' },
                  { range: '70 – 100', mode: 'Autonomous', desc: 'Policy-governed execution without manual gates', color: 'text-emerald-400', dot: 'bg-emerald-400' },
                ].map(m => (
                  <div key={m.mode} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m.dot}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-semibold font-mono ${m.color}`}>{m.range}</span>
                        <span className="text-white text-sm font-semibold">{m.mode}</span>
                      </div>
                      <p className="text-zinc-500 text-xs">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </FU>
            </div>

            {/* Right: score card visual */}
            <FU d={0.1}>
              <div className="rounded-2xl border border-white/[0.07] bg-[#0C0C0F] p-8">
                <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-6">Live agent scores</div>
                <div className="space-y-6">
                  {[
                    { name: 'ceo-agent-01', score: 91, mode: 'Autonomous', color: 'text-emerald-400' },
                    { name: 'sales-agent-07', score: 74, mode: 'Supervised', color: 'text-amber-400' },
                    { name: 'dev-agent-03', score: 86, mode: 'Autonomous', color: 'text-emerald-400' },
                    { name: 'support-agent-12', score: 34, mode: 'Observation', color: 'text-red-400' },
                  ].map((a, i) => (
                    <motion.div
                      key={a.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease }}
                      className="flex items-center gap-4"
                    >
                      <Ring score={a.score} size={52} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-mono text-zinc-300 truncate">{a.name}</div>
                        <div className={`text-xs mt-0.5 ${a.color}`}>{a.mode} · {a.score}/100</div>
                      </div>
                      <div className="h-1.5 w-24 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            a.score >= 70 ? 'bg-emerald-500' : a.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${a.score}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4 text-center">
                  {[
                    { n: '94%', l: 'Mission success feeds +score' },
                    { n: '6%', l: 'Override rate feeds -score' },
                    { n: '89%', l: 'Error recovery feeds +score' },
                  ].map(s => (
                    <div key={s.l}>
                      <div className="font-mono text-lg font-bold text-white">{s.n}</div>
                      <div className="text-[10px] text-zinc-600 mt-1 leading-tight">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ════════ POLICY GATEWAY ════════ */}
      <section className="bg-[#08090E] border-t border-white/[0.06] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: policy card */}
            <FU d={0.05}>
              <div className="rounded-2xl border border-white/[0.07] bg-[#0C0C0F] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <Shield size={13} className="text-amber-400" />
                    <span className="text-xs font-mono text-zinc-500">Policy Gateway — Active Rules</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-700">34 rules</span>
                </div>
                <div className="p-5 space-y-2">
                  {POLICY_EXAMPLES.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4, ease }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-mono ${effectStyle[p.effect].cls}`}
                    >
                      <span className="text-zinc-400">{p.rule}</span>
                      <span className={`ml-4 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${effectStyle[p.effect].cls}`}>
                        {effectStyle[p.effect].label}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-700">Evaluated before every action</span>
                  <span className="text-amber-500">⚡ &lt;50ms</span>
                </div>
              </div>
            </FU>

            {/* Right: copy */}
            <div>
              <FU d={0} className="mb-4">
                <Tag color="amber">Policy Gateway</Tag>
              </FU>
              <FU d={0.05}>
                <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mb-5">
                  Rules that evolve.<br />Zero code changes.
                </h2>
              </FU>
              <FU d={0.1}>
                <p className="text-zinc-500 leading-relaxed mb-6">
                  The Policy Gateway evaluates every agent action against your rules
                  before it executes — in under 50ms. Rules are defined in the dashboard,
                  not in code. When your compliance team adds a new restriction,
                  it applies to every running agent immediately.
                </p>
              </FU>
              <FU d={0.15} className="space-y-3">
                {[
                  { icon: AlertTriangle, text: 'Three effects: allow, deny, or require human approval' },
                  { icon: Activity, text: 'Conditions: action type, risk level, trust score, cost, data sensitivity' },
                  { icon: Clock, text: 'Sub-50ms evaluation — no performance penalty' },
                  { icon: CheckCircle2, text: 'Every evaluation recorded in the provenance ledger' },
                  { icon: RefreshCw, text: 'Rules update live — no agent restart required' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                      <Icon size={15} className="text-amber-500 shrink-0 mt-0.5" />
                      {item.text}
                    </div>
                  );
                })}
              </FU>
              <FU d={0.2} className="mt-8">
                <Link to="/dashboard/policy-gateway" className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">
                  Manage policies <ChevronRight size={14} />
                </Link>
              </FU>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ ALL SIX PILLARS ════════ */}
      <section className="bg-[#08090E] border-t border-white/[0.06] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <FU d={0} className="mb-14">
            <Tag color="violet">All six governance layers</Tag>
            <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">
              Everything you need to govern<br />AI agents at enterprise scale.
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Each pillar is a standalone service. Together they form a complete governance stack
              that your security and compliance teams can audit end-to-end.
            </p>
          </FU>

          <div className="space-y-4">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              const isOpen = expanded === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease }}
                  className={`rounded-2xl border ${pillar.border} overflow-hidden transition-all duration-300`}
                  style={{ background: isOpen ? `radial-gradient(ellipse at top left, ${pillar.glow}, #0C0C0F 50%)` : '#0C0C0F' }}
                >
                  <button
                    className="w-full flex items-center gap-5 p-6 text-left cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 ${pillar.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-jakarta font-semibold text-white mb-0.5">{pillar.name}</div>
                      <div className="text-zinc-500 text-sm truncate">{pillar.tagline}</div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-zinc-600 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="px-6 pb-6 border-t border-white/[0.06]"
                    >
                      <div className="grid md:grid-cols-2 gap-8 pt-6">
                        <div>
                          <p className="text-zinc-400 leading-relaxed text-sm mb-5">{pillar.body}</p>
                          <Link
                            to={pillar.link}
                            className={`inline-flex items-center gap-1.5 text-sm font-semibold ${pillar.color} hover:opacity-70 transition-opacity`}
                          >
                            Open dashboard <ChevronRight size={13} />
                          </Link>
                        </div>
                        <ul className="space-y-2.5">
                          {pillar.details.map(d => (
                            <li key={d} className="flex items-start gap-2.5 text-sm text-zinc-500">
                              <CheckCircle2 size={13} className={`${pillar.color} mt-0.5 shrink-0`} />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ COMPLIANCE USE CASES ════════ */}
      <section className="bg-[#08090E] border-t border-white/[0.06] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <FU d={0} className="mb-14">
            <Tag color="zinc">Who it's built for</Tag>
            <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mt-4">
              Governance that satisfies every stakeholder.
            </h2>
          </FU>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                role: 'CISO',
                title: 'No more "trust me, it\'s fine"',
                desc: 'Every agent action is cryptographically verified and recorded. SHA-256 hash chains mean no one — not even your engineering team — can quietly alter what agents did.',
                color: 'text-violet-400',
              },
              {
                icon: Users,
                role: 'Compliance Lead',
                title: 'SOC 2 audit trail, auto-generated',
                desc: 'The Provenance Ledger generates the audit evidence your auditors need automatically. Export by date range, agent, or action type for SOC 2, GDPR, and HIPAA.',
                color: 'text-blue-400',
              },
              {
                icon: DollarSign,
                role: 'CFO',
                title: 'No surprise AI bills',
                desc: 'Per-agent budget envelopes enforce cost limits before LLM calls and API invocations happen. Set monthly limits per agent type. Hard stops, not alerts after the fact.',
                color: 'text-emerald-400',
              },
              {
                icon: Eye,
                role: 'Engineering Lead',
                title: 'Full observability, no guessing',
                desc: 'Trust Analytics shows you every policy evaluation, trust score change, and approval workflow. Session replay lets you audit exactly what an agent did on a given run.',
                color: 'text-amber-400',
              },
              {
                icon: GitMerge,
                role: 'Platform Team',
                title: 'Works with your existing stack',
                desc: 'Trust Fabric wraps LangChain, CrewAI, AutoGen, and OpenAI Agents without requiring a rewrite. It\'s a governance layer — not a framework replacement.',
                color: 'text-blue-400',
              },
              {
                icon: Network,
                role: 'Enterprise Architect',
                title: 'Fits your enterprise architecture',
                desc: 'Available as SaaS or on-prem. Integrates with your SIEM, ITSM, and identity provider. Delegation tokens work with your existing IAM roles.',
                color: 'text-violet-400',
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <FU key={i} d={i * 0.06}>
                  <div className="h-full rounded-2xl border border-white/[0.07] bg-[#0C0C0F] p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center ${c.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{c.role}</span>
                    </div>
                    <h3 className="font-jakarta font-semibold text-white mb-2">{c.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed flex-1">{c.desc}</p>
                  </div>
                </FU>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="bg-[#08090E] border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <FU d={0} className="flex justify-center mb-5">
            <Tag color="violet">
              <Shield size={10} />
              Trust Fabric
            </Tag>
          </FU>
          <FU d={0.06}>
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
              Ready to govern your agents?
            </h2>
          </FU>
          <FU d={0.1}>
            <p className="text-zinc-500 text-lg mb-10 max-w-xl mx-auto">
              Book a technical demo and see Trust Fabric running in your environment —
              with your agents, your policies, your data.
            </p>
          </FU>
          <FU d={0.14} className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all duration-200 shadow-[0_0_28px_rgba(139,92,246,0.35)]"
            >
              Book a demo
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/dashboard/agent-identity"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/15 text-zinc-300 hover:text-white font-bold transition-all duration-200"
            >
              Open dashboard
            </Link>
          </FU>
        </div>
      </section>
    </Layout>
  );
};

export default TrustFabric;
