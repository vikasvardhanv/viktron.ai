import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants, type Transition } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Layers,
  GitBranch,
  Lock,
  BarChart3,
  Shield,
  RefreshCw,
  Zap,
  Users,
  BrainCircuit,
  Globe,
  TrendingUp,
  Cpu,
  Sparkles,
  MessageSquare,
  Activity,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ServiceSEO } from '../components/ui/SEO';

const fadeUpTransition: Transition = { duration: 0.55, ease: 'easeOut' };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: fadeUpTransition },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Capabilities ────────────────────────────────────────────────────────────
const capabilities = [
  { icon: Database,    title: 'Smart Tool Adapters',      desc: 'Structured feedback eliminates token-bloat from raw API dumps. Every tool call returns clean, bounded output.' },
  { icon: Layers,      title: 'Framework-Agnostic',       desc: 'Switch between LangChain, CrewAI, LangGraph, AutoGen, and more without re-engineering your workflow.' },
  { icon: GitBranch,   title: 'Workflow Decomposition',   desc: 'Break complex tasks into bounded operations with pre- and post-condition checks at every node.' },
  { icon: Lock,        title: 'Unified Security Layer',   desc: 'Consistent auth, secrets management, and access-control enforced across every agent and tool call.' },
  { icon: BarChart3,   title: 'Deep Observability',       desc: 'Full trace logs, latency histograms, and per-node cost attribution so you know exactly what\'s happening.' },
  { icon: Shield,      title: 'Adaptive Policy Engine',   desc: 'Dynamic governance rules applied at runtime — rate limits, content filters, and approval gates without code changes.' },
  { icon: RefreshCw,   title: 'Error Auto-Recovery',      desc: 'Circuit breakers, intelligent retries, and fallback chains maintain uptime through partial failures.' },
  { icon: Zap,         title: 'Cost Optimization',        desc: 'Prompt caching, model routing, and token budgets reduce LLM spend by up to 60% without sacrificing quality.' },
  { icon: Users,       title: 'Human-in-the-Loop',        desc: 'Approval gates positioned at actual failure points — not everywhere — so humans stay in control without slowing things down.' },
  { icon: BrainCircuit,title: 'State Management',         desc: 'Durable workflow state survives crashes, retries, and long-running pauses — no lost progress.' },
  { icon: Globe,       title: 'Enterprise Integrations',  desc: '100+ pre-built adapters for Salesforce, SAP, Slack, databases, and every major SaaS platform.' },
  { icon: TrendingUp,  title: 'Continuous Improvement',   desc: 'Run-time analytics feed back into workflow tuning, automatically improving reliability over time.' },
];

// ─── How-it-works steps ───────────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Connect Your Systems',
    desc: 'Point AgentIRL at your APIs, databases, and SaaS tools. Smart adapters normalise every response into structured, token-efficient payloads agents can actually use.',
  },
  {
    num: '02',
    title: 'Define Agent Workflows',
    desc: 'Describe your tasks as directed acyclic graphs. AgentIRL decomposes high-level goals into bounded operations with pre- and post-condition checks at every node.',
  },
  {
    num: '03',
    title: 'Set Governance Rules',
    desc: 'Apply rate limits, content policies, approval gates, and cost budgets through the policy engine — no code changes needed when rules evolve.',
  },
  {
    num: '04',
    title: 'Deploy Across Frameworks',
    desc: 'Run your workflows on LangChain, CrewAI, LangGraph, AutoGen, or OpenAI Agents SDK. Swap frameworks without touching orchestration logic.',
  },
  {
    num: '05',
    title: 'Monitor, Recover, Improve',
    desc: 'Full-trace observability, auto-recovery loops, and runtime analytics give you production confidence and continuous workflow improvement.',
  },
];

// ─── Use cases ────────────────────────────────────────────────────────────────
const useCases = [
  {
    icon: Cpu,
    title: 'Enterprise AI Teams',
    desc: 'Ship internal automation agents that survive real enterprise chaos — legacy APIs, compliance requirements, and 99.99% uptime SLAs all covered.',
  },
  {
    icon: Users,
    title: 'Customer-Facing SaaS',
    desc: 'Power AI features your users trust. AgentIRL handles the reliability and cost engineering so your product team ships fast without firefighting.',
  },
  {
    icon: Shield,
    title: 'Regulated Industries',
    desc: 'Finance, healthcare, and legal teams get policy-safe execution with full audit trails and human-in-the-loop controls at every critical step.',
  },
  {
    icon: Sparkles,
    title: 'AI Agencies',
    desc: 'Deliver production-grade agent systems to clients without rebuilding reliability infrastructure from scratch on every project.',
  },
];

// ─── Metrics ─────────────────────────────────────────────────────────────────
const metrics = [
  { value: '99.99%',  label: 'Uptime SLA' },
  { value: '5+',      label: 'Frameworks' },
  { value: '<150ms',  label: 'Coordination latency' },
  { value: '92%',     label: 'Error auto-recovery' },
  { value: '100+',    label: 'Tool adapters' },
  { value: '60%',     label: 'Token cost reduction' },
];

const frameworks = ['LangChain', 'CrewAI', 'LangGraph', 'AutoGen', 'OpenAI Agents', 'Anthropic MCP'];

// ═════════════════════════════════════════════════════════════════════════════
export const AgentIRL: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveStep(i);
          });
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <Layout>
      {/* 1 ── SEO */}
      <ServiceSEO
        serviceName="AgentIRL — Multi-Agent Orchestration Platform"
        serviceDescription="AgentIRL is the middleware layer for production AI agents. Framework-agnostic orchestration, smart tool adapters, auto-recovery, policy enforcement, and OTLP observability. 99.99% uptime SLA, <150ms latency."
      />

      {/* 2 ── HERO */}
      <section className="relative overflow-hidden bg-[#f7f8f5] pt-28 pb-20">
        {/* Radial gradient decorations */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
            {/* Left */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 tracking-wide">
                  AgentIRL Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-6xl"
              >
                The production runtime for autonomous agents.
              </motion.h1>

              <motion.p variants={fadeUp} className="max-w-xl text-lg text-slate-600 leading-relaxed">
                AgentIRL is the middleware layer between your AI models and your business systems.
                It handles orchestration, reliability engineering, enterprise integrations, and
                policy-safe execution — so your agents actually finish their jobs.
              </motion.p>

              {/* Metric chips */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {[
                  '99.99% Uptime SLA',
                  '60% Token cost reduction',
                  '92% Error auto-recovery',
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800"
                  >
                    {chip}
                  </span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Book a Demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400"
                >
                  Talk to Engineering
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — video demo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              <div className="rounded-[2rem] bg-slate-900/90 backdrop-blur-md shadow-2xl overflow-hidden border border-slate-700">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">AgentIRL Console</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                  </div>
                </div>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full aspect-[16/10] object-cover"
                  src="/AI_Agents_Orchestrated_into_a_System.mp4"
                />
                {/* Overlay captions */}
                <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-slate-900/90 to-transparent">
                  <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                    <span>Multi-agent coordination</span>
                    <span className="text-emerald-400">&lt;150ms latency</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 text-center">
                  Task DAG orchestration · Policy engine · Auto-recovery · 100+ tool adapters
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2.5 ── ARCHITECTURE DIAGRAM */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 tracking-wide"
            >
              Technical Architecture
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900"
            >
              How AgentIRL fits in your stack
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Architecture diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Left: Agent Frameworks */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Agent Frameworks</p>
                <div className="space-y-2">
                  {['LangChain', 'CrewAI', 'LangGraph', 'AutoGen', 'OpenAI Agents', 'Anthropic MCP'].map((fw) => (
                    <div key={fw} className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-sm font-medium text-slate-700">{fw}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Center: AgentIRL Platform */}
              <div className="rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-white p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  AgentIRL™
                </div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-4">Runtime Layer</p>
                <div className="space-y-3">
                  {[
                    { icon: GitBranch, label: 'Workflow Orchestrator', desc: 'DAG execution, state management' },
                    { icon: Database, label: 'Smart Tool Adapters', desc: '100+ pre-built integrations' },
                    { icon: Lock, label: 'Policy Engine', desc: 'Rate limits, approval gates, content filters' },
                    { icon: RefreshCw, label: 'Auto-Recovery', desc: 'Circuit breakers, fallback chains' },
                    { icon: BarChart3, label: 'Observability', desc: 'Tracing, metrics, OTLP export' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Business Systems */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Business Systems</p>
                <div className="space-y-2">
                  {[
                    { icon: Users, label: 'CRM (Salesforce, HubSpot)' },
                    { icon: MessageSquare, label: 'Support (Zendesk, Intercom)' },
                    { icon: Database, label: 'Data Warehouses (Snowflake)' },
                    { icon: Globe, label: 'Communication (Slack, Teams)' },
                    { icon: Shield, label: 'Identity (Okta, Auth0)' },
                  ].map((sys) => (
                    <div key={sys.label} className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-slate-200">
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{sys.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Flow arrows */}
            <div className="hidden lg:block absolute top-1/2 -left-3 -translate-y-1/2 text-slate-300">
              <ArrowRight className="w-6 h-6 rotate-180" />
            </div>
            <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-300">
              <ArrowRight className="w-6 h-6" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 ── PROBLEM */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-5 text-center"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700"
            >
              The Production Problem
            </motion.span>
            <motion.h2 variants={fadeUp} className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900">
              Why 95% of AI agent projects never reach production
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-xl text-slate-500 text-lg">
              Demo environments are forgiving. Production is not. The gap between a working prototype
              and a reliable system is where most teams get stuck — permanently.
            </motion.p>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-6 sm:grid-cols-3"
          >
            {[
              {
                value: '36%',
                color: 'text-red-500',
                bg: 'bg-red-50 border-red-100',
                title: 'Success rate on 20-step workflows',
                desc: 'In multi-step chains, every node compounds failure probability. A 95%-reliable agent fails 64% of 20-step tasks.',
              },
              {
                value: '68%',
                color: 'text-amber-500',
                bg: 'bg-amber-50 border-amber-100',
                title: 'Agents hit a wall before step 10',
                desc: 'Integration complexity — inconsistent APIs, context limits, and schema mismatches — stops most agents in their tracks.',
              },
              {
                value: '10x',
                color: 'text-blue-500',
                bg: 'bg-blue-50 border-blue-100',
                title: 'Cost overrun vs demo estimates',
                desc: 'Raw API responses, unoptimised prompts, and infinite retry loops turn a $50 demo into a $500 production bill.',
              },
            ].map((s) => (
              <motion.div
                key={s.value}
                variants={fadeUp}
                className={`rounded-2xl border p-8 ${s.bg}`}
              >
                <p className={`text-5xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="mt-3 font-semibold text-slate-800">{s.title}</p>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Fix box */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mt-10 rounded-2xl bg-slate-950 p-10 text-white"
          >
            <p className="mb-6 text-lg font-bold text-emerald-400">AgentIRL fixes this</p>
            <ul className="space-y-4">
              {[
                'Workflow decomposition breaks tasks into bounded operations with pre/post-condition checks',
                'Smart tool adapters with structured feedback eliminate token-bloat from raw API dumps',
                'Circuit breakers, intelligent retries, and fallback chains maintain uptime through failures',
                'Human-in-the-loop gates positioned at actual failure points — not everywhere',
                'Framework-agnostic: switch between LangChain, CrewAI, LangGraph without re-engineering',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 4 ── HOW IT WORKS — sticky scroll */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section header */}
          <div className="mb-16 flex flex-col items-center gap-4 text-center">
            <span className="font-mono text-sm font-semibold uppercase tracking-widest text-emerald-600">
              How AgentIRL Works
            </span>
            <h2 className="max-w-xl text-4xl font-extrabold tracking-tight text-slate-900">
              From raw instruction to completed task — reliably.
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Scrolling steps */}
            <div className="flex flex-col gap-6">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className={`rounded-2xl border p-8 transition-all duration-300 ${
                    activeStep === i
                      ? 'border-emerald-500 bg-white shadow-lg'
                      : 'border-transparent bg-slate-100'
                  }`}
                >
                  <p
                    className={`font-mono text-sm font-bold tracking-widest ${
                      activeStep === i ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {step.num}
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{step.title}</p>
                  <p className="mt-2 text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Sticky video */}
            <div className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-4">
                <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-2xl">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full aspect-[16/10] object-cover opacity-90"
                    src="/AI_Agents_Orchestrated_into_a_System.mp4"
                  />
                </div>
                {/* Progress dots */}
                <div className="flex justify-center gap-2 pt-1">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeStep === i ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-300'
                      }`}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 ── CAPABILITIES GRID */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14 flex flex-col items-center gap-4 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold tracking-tight text-slate-900">
              Every capability you need in production
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-xl text-slate-500 text-lg">
              AgentIRL ships with everything required to move from prototype to production-grade
              multi-agent systems.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="mb-2 font-bold text-slate-900">{cap.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{cap.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Framework compatibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8"
          >
            <p className="mb-5 text-center text-sm font-semibold text-slate-600 uppercase tracking-widest">
              Works with every major framework
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {frameworks.map((fw) => (
                <span
                  key={fw}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {fw}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6 ── METRICS BAR */}
      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1 text-center">
                <p className="text-3xl font-extrabold text-emerald-400">{m.value}</p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 ── USE CASES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14 flex flex-col items-center gap-4 text-center"
          >
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold tracking-tight text-slate-900">
              Built for every team shipping agents
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-xl text-slate-500 text-lg">
              Whether you're an enterprise AI team, a SaaS product, or a regulated industry — AgentIRL
              gives you the reliability infrastructure to ship with confidence.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <motion.div
                  key={uc.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-100 p-7 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="mb-2 font-bold text-slate-900">{uc.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{uc.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 8 ── FINAL CTA */}
      <section className="bg-slate-950 py-28 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-4 py-1.5 text-sm font-semibold text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Now accepting enterprise pilots
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              Ready to ship agents that actually work?
            </motion.h2>

            <motion.p variants={fadeUp} className="max-w-xl text-slate-400 text-lg leading-relaxed">
              Join the teams using AgentIRL to move from fragile demos to production systems with
              99.99% uptime, real cost control, and full observability.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow transition hover:bg-emerald-400"
              >
                Book Engineering Call <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-7 py-3.5 text-sm font-bold text-white transition hover:border-slate-400"
              >
                View All Services
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-slate-500">
              Pilot pricing available for qualified teams. Enterprise SLA guaranteed from day one.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};
