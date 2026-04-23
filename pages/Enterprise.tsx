import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  Lock,
  Users,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  GitBranch,
  AlertTriangle,
  Clock,
  Database,
  Layers,
  Building2,
  Globe,
  Zap,
  Eye,
  Key,
  Cpu,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';

// ── Trust pillars ─────────────────────────────────────────────────────────────
const trustPillars = [
  {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    title: 'Audit-Grade Action Logs',
    desc: 'Every agent action produces a signed, immutable record: who authorized it, what the agent saw, what it decided, and what changed in your systems. Exportable as JSON or CSV for compliance teams.',
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
    title: 'Approval Gates',
    desc: 'Destructive operations — file deletion, mass sends, financial transactions — are detected automatically and paused for human review before execution. Zero false negatives on high-risk ops.',
  },
  {
    icon: <Key className="h-6 w-6 text-indigo-600" />,
    title: 'Task-Scoped Delegation',
    desc: "Agents are authorized per task with strict limits: time window, cost cap, data sensitivity class, allowed tools, and delegation depth. No agent has standing access to anything it doesn't need.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
    title: 'Budget Enforcement',
    desc: 'Hard monthly caps per agent and per team. Real-time spend tracking with automatic pausing at threshold. No surprise API bills. Full cost attribution per task in every audit export.',
  },
  {
    icon: <Eye className="h-6 w-6 text-purple-600" />,
    title: 'Full Observability',
    desc: 'OTLP-compatible tracing on every agent run: token counts, latency, model version, tool calls, intermediate outputs. Pipe to Datadog, Grafana, or any OpenTelemetry backend.',
  },
  {
    icon: <Lock className="h-6 w-6 text-red-600" />,
    title: 'Encrypted Credentials',
    desc: 'All external service credentials (Slack, CRM, databases) are encrypted at rest with Fernet symmetric keys. Tenant isolation is enforced at the DB layer — no cross-team data leakage.',
  },
];

// ── Mission lifecycle ─────────────────────────────────────────────────────────
const missionStates = [
  { state: 'DRAFT', color: 'bg-slate-200 text-slate-700', desc: 'Task created, not yet evaluated' },
  { state: 'PENDING GATES', color: 'bg-amber-100 text-amber-700', desc: 'Safety checks running' },
  { state: 'APPROVED', color: 'bg-blue-100 text-blue-700', desc: 'Human or auto-approved' },
  { state: 'EXECUTING', color: 'bg-indigo-100 text-indigo-700', desc: 'Agent actively working' },
  { state: 'REVIEW', color: 'bg-purple-100 text-purple-700', desc: 'Output under review' },
  { state: 'COMPLETE', color: 'bg-emerald-100 text-emerald-700', desc: 'Logged & closed' },
];

// ── Verticals ─────────────────────────────────────────────────────────────────
const verticals = [
  {
    icon: <Building2 className="h-6 w-6 text-blue-600" />,
    name: 'Legal Operations',
    workflows: ['Contract review & redlining', 'Due diligence automation', 'Regulatory filing drafts', 'Matter intake & routing'],
    stat: '$180K',
    statLabel: 'avg annual savings per legal team',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
    name: 'Finance & Procurement',
    workflows: ['Invoice approval chains', 'Vendor onboarding', 'AP/AR reconciliation', 'Spend anomaly detection'],
    stat: '73%',
    statLabel: 'reduction in manual review hours',
  },
  {
    icon: <Globe className="h-6 w-6 text-indigo-600" />,
    name: 'Compliance & Risk',
    workflows: ['Policy document monitoring', 'Audit trail generation', 'Incident reporting', 'Regulatory change alerts'],
    stat: '100%',
    statLabel: 'of actions logged with provenance',
  },
];

// ── Enterprise tiers ──────────────────────────────────────────────────────────
const tiers = [
  {
    name: 'Team',
    price: '$2,000',
    period: '/month',
    desc: 'One department, fully governed.',
    features: [
      'Up to 5 agent roles',
      'Unlimited tasks & runs',
      'Audit log export (JSON/CSV)',
      'Human-in-the-loop approvals',
      'Budget enforcement & alerts',
      'Slack & email channel integration',
      'Standard SLA (99.5% uptime)',
    ],
    cta: 'Start with Team',
    highlight: false,
  },
  {
    name: 'Department',
    price: '$6,000',
    period: '/month',
    desc: 'Multiple teams with shared governance.',
    features: [
      'Unlimited agent roles',
      'Cross-agent task delegation (DAG)',
      'Multi-model safety verification',
      'Task-scoped delegation tokens',
      'Per-agent spend attribution',
      'WebSocket live dashboard',
      'OTLP / OpenTelemetry export',
      'Enhanced SLA (99.9% uptime)',
    ],
    cta: 'Talk to Sales',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Full platform with compliance guarantees.',
    features: [
      'Everything in Department',
      'Private deployment (your VPC)',
      'SOC 2 Type II readiness package',
      'SSO / SAML integration',
      'Custom retention & data residency',
      'Dedicated onboarding engineer',
      'Contractual SLA with penalties',
      'Executive business review (quarterly)',
    ],
    cta: 'Contact Enterprise',
    highlight: false,
  },
];

// ── Trust report sample ───────────────────────────────────────────────────────
const trustReportLines = [
  { label: 'Period', value: 'Apr 1 – Apr 30, 2026' },
  { label: 'Tasks Completed', value: '4,812' },
  { label: 'Tasks Approved by Human', value: '38' },
  { label: 'Tasks Rejected', value: '7' },
  { label: 'Destructive Ops Blocked', value: '3' },
  { label: 'Total LLM Spend', value: '$94.17' },
  { label: 'Avg Task Latency', value: '2.3s' },
  { label: 'Uptime', value: '99.97%' },
  { label: 'Audit Events Logged', value: '91,440' },
];

export const Enterprise: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState(0);

  return (
    <Layout>
      <SEO
        title="Enterprise AI Agents | Governance, Audit & Compliance | Viktron"
        description="Deploy AI agent teams with enterprise-grade governance: audit logs, human-in-the-loop approvals, task-scoped delegation, budget enforcement, and OTLP observability. Built for legal, finance, and compliance workflows."
        keywords="enterprise AI agents, AI governance, audit logs, human-in-the-loop, AI compliance, agent orchestration enterprise, SOC2 AI, secure AI agents"
        url="/enterprise"
        canonicalUrl="https://viktron.ai/enterprise"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How does Viktron ensure enterprise-grade AI agent safety?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Every agent action is authorized via task-scoped delegation tokens, logged with full provenance, and checked against approval gates before execution. Destructive operations are automatically detected and require human review. All actions produce immutable audit records exportable for compliance."
              }
            },
            {
              "@type": "Question",
              "name": "What compliance standards does Viktron support?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Viktron's enterprise tier includes a SOC 2 Type II readiness package, encrypted credentials at rest, tenant isolation at the database layer, configurable data residency, and audit log exports compatible with ISO 27001, GDPR, and HIPAA documentation requirements."
              }
            }
          ]
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-50/60 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600 mb-6">
              <Shield className="h-4 w-4" />
              SOC 2 Type II Ready
            </div>
            <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-slate-900 max-w-4xl mx-auto">
              AI agents you can <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">answer for.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
              Every action authorized. Every decision logged. Every cost accounted for.
              <strong> AgentIRL</strong> is the governance layer that makes AI agents safe
              for legal, finance, and compliance workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/contact">
                <Button>Talk to Enterprise Sales</Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" icon={<FileText className="h-4 w-4" />}>
                  Request Sample Audit Report
                </Button>
              </Link>
              <Link to="/services/agentirl">
                <Button variant="ghost" icon={<ArrowRight className="h-4 w-4" />}>
                  See AgentIRL Platform
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Trust metrics bar */}
          <AnimatedSection delay={0.15}>
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
              {[
                { value: '100%', label: 'Actions logged', sub: 'SHA-256 signed' },
                { value: '< 2s', label: 'Gate evaluation', sub: 'Policy check latency' },
                { value: '99.9%', label: 'Uptime SLA', sub: 'Contractual guarantee' },
                { value: '0', label: 'Uncontrolled actions', sub: 'All gated by policy' },
              ].map((m) => (
                <div key={m.label} className="bg-white px-6 py-5 text-center">
                  <div className="text-3xl font-bold text-slate-900">{m.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{m.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What breaks without us */}
      <section className="py-16 px-4 bg-slate-950">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="text-3xl font-semibold text-white text-center mb-3">
              What happens when agents have no governance
            </h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
              These aren't hypothetical. They're the incidents that happen when AI agents run without an accountability layer.
            </p>
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: '💸',
                title: 'Runaway API spend',
                desc: 'An agent loops on a task, burning $40K in OpenAI credits overnight with no budget cap in place.',
              },
              {
                icon: '🗑️',
                title: 'Irreversible deletions',
                desc: 'An agent interprets "clean up old records" too broadly and deletes 3 years of customer data with no approval gate.',
              },
              {
                icon: '📋',
                title: 'Audit gap',
                desc: 'Regulators ask what your AI system did last quarter. You have no logs. The answer is: you don\'t know.',
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-4xl font-semibold text-slate-900">The AgentIRL governance stack</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                Six enforcement layers built into the execution runtime — not bolted on after the fact.
              </p>
            </div>
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {trustPillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Compliance controls */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-4">
                <Shield className="h-3.5 w-3.5" />
                SOC 2 Type II Readiness
              </div>
              <h2 className="text-3xl font-semibold text-white mb-3">
                Compliance controls built into the runtime
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Every enterprise deployment includes a complete SOC 2 Type II readiness package:
                control matrices, evidence collection, and audit trail documentation.
              </p>
            </div>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="h-6 w-6 text-emerald-400" />,
                title: 'Control Documentation',
                items: ['CC1-CC9 control matrix', 'Risk assessment templates', 'Control testing procedures', 'Evidence collection automation'],
              },
              {
                icon: <Database className="h-6 w-6 text-emerald-400" />,
                title: 'Audit Trail Export',
                items: ['Immutable SHA-256 signed logs', 'JSON/CSV export formats', 'Automated monthly reports', 'Integration with SIEM tools'],
              },
              {
                icon: <Lock className="h-6 w-6 text-emerald-400" />,
                title: 'Data Protection',
                items: ['AES-256 encryption at rest', 'TLS 1.3 in transit', 'Tenant isolation at DB layer', 'Configurable data residency (US/EU)'],
              },
            ].map((control) => (
              <StaggerItem key={control.title}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-emerald-500/30 transition-all">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 mb-4">
                    {control.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-4">{control.title}</h3>
                  <ul className="space-y-2">
                    {control.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-10 text-center">
            <Link to="/contact">
              <Button variant="secondary">Request SOC 2 Package Sample</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission lifecycle */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="text-3xl font-semibold text-slate-900 text-center mb-2">
              Every task has a verified lifecycle
            </h2>
            <p className="text-slate-600 text-center mb-10">
              No agent action jumps from request to execution. Every task passes through structured gates.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {missionStates.map((s, i) => (
                <div key={s.state} className="flex items-center gap-2">
                  <div className={`rounded-full px-4 py-2 text-xs font-semibold ${s.color}`}>
                    {s.state}
                  </div>
                  {i < missionStates.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {missionStates.map((s) => (
                <div key={s.state} className="text-center">
                  <div className={`rounded-lg px-3 py-1 text-[10px] font-semibold mb-1 inline-block ${s.color}`}>{s.state}</div>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Report preview */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 mb-6">
                <FileText className="h-3.5 w-3.5" />
                Trust Report
              </div>
              <h2 className="text-4xl font-semibold text-slate-900 mb-4">
                Answer every compliance question in seconds
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                The AgentIRL Trust Report is a signed summary of everything your agents did, decided, and spent — generated on demand for auditors, regulators, and board reviews. No manual log scraping.
              </p>
              <ul className="space-y-3">
                {[
                  'Full task history with input/output provenance',
                  'Human approval and rejection decisions, with timestamps',
                  'Destructive operations blocked and why',
                  'Per-agent cost attribution',
                  'Uptime and failure rate by team',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/contact">
                  <Button>Request a Sample Report</Button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg">
                <div className="bg-slate-900 px-5 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-slate-400 text-xs font-mono ml-2">trust-report-2026-04.json</span>
                </div>
                <div className="p-5 font-mono text-xs space-y-2">
                  {trustReportLines.map((line) => (
                    <div key={line.label} className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">{line.label}</span>
                      <span className="text-slate-900 font-semibold">{line.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 text-emerald-600 font-semibold text-[11px]">
                    ✓ Signed SHA-256 · Tamper-evident · Exportable
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Verticals */}
      <section className="py-20 px-4 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="text-4xl font-semibold text-slate-900 text-center mb-3">
              Built for workflows where errors are expensive
            </h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-10">
              Governance isn't a feature request in legal and finance — it's a prerequisite.
            </p>
            <div className="flex gap-3 justify-center mb-10 flex-wrap">
              {verticals.map((v, i) => (
                <button
                  key={v.name}
                  onClick={() => setActiveVertical(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeVertical === i
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-200'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
            <motion.div
              key={activeVertical}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 max-w-3xl mx-auto"
            >
              <div className="flex items-start gap-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 shrink-0">
                  {verticals[activeVertical].icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {verticals[activeVertical].name}
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {verticals[activeVertical].workflows.map((w) => (
                      <li key={w} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-blue-600">{verticals[activeVertical].stat}</span>
                    <span className="text-sm text-slate-500">{verticals[activeVertical].statLabel}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="text-4xl font-semibold text-slate-900 text-center mb-3">
              Priced for the value it delivers
            </h2>
            <p className="text-slate-600 text-center mb-12">
              Not per-seat. Not per-user. Per <strong>agent team</strong> — because that's what delivers value.
            </p>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <div className={`rounded-2xl p-7 h-full flex flex-col ${
                  tier.highlight
                    ? 'bg-blue-600 text-white border-2 border-blue-500'
                    : 'bg-white border border-slate-200'
                }`}>
                  {tier.highlight && (
                    <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider mb-4">Most Popular</div>
                  )}
                  <h3 className={`text-xl font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm mb-4 ${tier.highlight ? 'text-blue-100' : 'text-slate-500'}`}>{tier.desc}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-4xl font-bold ${tier.highlight ? 'text-white' : 'text-slate-900'}`}>
                      {tier.price}
                    </span>
                    <span className={`text-sm ${tier.highlight ? 'text-blue-200' : 'text-slate-400'}`}>
                      {tier.period}
                    </span>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-sm ${tier.highlight ? 'text-blue-50' : 'text-slate-700'}`}>
                        <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${tier.highlight ? 'text-blue-200' : 'text-blue-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <Button
                      className="w-full justify-center"
                      variant={tier.highlight ? 'secondary' : 'primary'}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Technical specs for buyers */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="text-3xl font-semibold text-slate-900 text-center mb-10">
              Built for your security team's review
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Database className="h-5 w-5" />, label: 'Data residency', value: 'US, EU configurable' },
              { icon: <Lock className="h-5 w-5" />, label: 'Encryption', value: 'AES-256 at rest + in transit' },
              { icon: <Key className="h-5 w-5" />, label: 'Auth', value: 'JWT + SSO/SAML (Enterprise)' },
              { icon: <GitBranch className="h-5 w-5" />, label: 'Deployment', value: 'Cloud or private VPC' },
              { icon: <Layers className="h-5 w-5" />, label: 'Tenant isolation', value: 'DB-level, no shared state' },
              { icon: <Cpu className="h-5 w-5" />, label: 'LLM providers', value: 'OpenAI, Anthropic, Gemini' },
              { icon: <Clock className="h-5 w-5" />, label: 'Log retention', value: 'Configurable (90d – 7yr)' },
              { icon: <Users className="h-5 w-5" />, label: 'RBAC', value: 'Role-based agent permissions' },
            ].map((spec) => (
              <StaggerItem key={spec.label}>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1.5">
                    {spec.icon}
                    <span className="text-xs font-medium">{spec.label}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{spec.value}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl bg-slate-900 p-10 text-center max-w-3xl mx-auto">
              <Zap className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-semibold text-white mb-3">
                Ready to deploy agents your compliance team won't reject?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                We'll show you the audit trail, the approval gate config, and the cost attribution dashboard in a 30-minute call.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/contact">
                  <Button>Schedule Enterprise Demo</Button>
                </Link>
                <Link to="/services/agentirl">
                  <Button variant="secondary">Read the Architecture</Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
