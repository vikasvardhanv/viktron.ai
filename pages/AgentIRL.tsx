/**
 * Viktron AI — AgentIRL Page  /services/agentirl
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Shield, Activity, Cpu,
  ChevronRight, Lock, Zap, Users, RefreshCw, Database,
  Network, Layers, GitBranch, Globe, BrainCircuit, TrendingUp,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ServiceSEO } from '../components/ui/SEO';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

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

const Tag = ({ children, color = 'zinc' }: { children: React.ReactNode; color?: 'zinc' | 'violet' | 'emerald' | 'amber' | 'blue' }) => {
  const c: Record<string, string> = {
    zinc:    'bg-white/5 border-white/10 text-zinc-400',
    violet:  'bg-violet-500/10 border-violet-500/25 text-violet-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    amber:   'bg-amber-500/10 border-amber-500/25 text-amber-400',
    blue:    'bg-blue-500/10 border-blue-500/25 text-blue-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide uppercase ${c[color]}`}>
      {children}
    </span>
  );
};

type CLine = { ts: string; agent: string; event: string; status: 'ok' | 'warn' | 'running' | 'info'; msg: string };

const SCRIPT: CLine[] = [
  { ts: '10:02:01', agent: 'ceo-agent',       event: 'TASK_RECEIVED', status: 'info',    msg: 'Goal: Generate Q4 pipeline report and notify stakeholders' },
  { ts: '10:02:01', agent: 'ceo-agent',       event: 'DECOMPOSE',     status: 'running', msg: 'Breaking goal into 3 sub-tasks via DAG decomposition' },
  { ts: '10:02:02', agent: 'ceo-agent',       event: 'DISPATCH',      status: 'ok',      msg: 'Delegating to sales-agent (crm.query) and analytics-agent (report)' },
  { ts: '10:02:02', agent: 'sales-agent',     event: 'TOOL_CALL',     status: 'running', msg: 'salesforce.query(pipeline_stage=qualified, limit=500)' },
  { ts: '10:02:03', agent: 'sales-agent',     event: 'ADAPTER',       status: 'ok',      msg: 'Smart adapter: raw API response normalized (94% token reduction)' },
  { ts: '10:02:04', agent: 'analytics-agent', event: 'TOOL_CALL',     status: 'running', msg: 'Generating pipeline report from 12 qualified opportunities' },
  { ts: '10:02:05', agent: 'analytics-agent', event: 'RECOVERY',      status: 'warn',    msg: 'Chart render timeout — retry 1/3 (circuit breaker: open)' },
  { ts: '10:02:06', agent: 'analytics-agent', event: 'RECOVERY',      status: 'ok',      msg: 'Retry succeeded. Chart rendered in 1.2s' },
  { ts: '10:02:07', agent: 'ceo-agent',       event: 'AGGREGATE',     status: 'running', msg: 'Aggregating results from 2 completed sub-agents' },
  { ts: '10:02:08', agent: 'ceo-agent',       event: 'TASK_COMPLETE', status: 'ok',      msg: 'Report ready. Notifying slack:#exec-team' },
];

const sStyle: Record<string, string> = {
  ok: 'text-emerald-400', warn: 'text-amber-400', running: 'text-blue-400', info: 'text-zinc-500',
};

const AgentConsole: React.FC = () => {
  const [visible, setVisible] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= SCRIPT.length) {
      const t = setTimeout(() => setVisible(0), 4000);
      return () => clearTimeout(t);
    }
    const delay = visible === 0 ? 600 : 350 + Math.random() * 250;
    const t = setTimeout(() => setVisible(v => v + 1), delay);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [visible]);

  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-blue-500/6 rounded-3xl blur-3xl pointer-events-none" />
      <div className="relative rounded-2xl border border-white/[0.08] bg-[#0C0C0F] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] font-mono text-zinc-600">agentirl / orchestration / live</span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />ORCHESTRATING
          </div>
        </div>
        <div className="grid grid-cols-[68px_96px_120px_64px_1fr] gap-2 px-5 py-2 border-b border-white/[0.04] text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
          <span>Time</span><span>Agent</span><span>Event</span><span>Status</span><span>Message</span>
        </div>
        <div className="h-56 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
          {SCRIPT.slice(0, visible).map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
              className="grid grid-cols-[68px_96px_120px_64px_1fr] gap-2 text-[11px] font-mono items-start">
              <span className="text-zinc-700">{line.ts}</span>
              <span className="text-violet-400 truncate">{line.agent}</span>
              <span className="text-zinc-600 truncate">{line.event}</span>
              <span className={`${sStyle[line.status]} uppercase text-[9px] font-bold`}>{line.status}</span>
              <span className="text-zinc-500 leading-relaxed">{line.msg}</span>
            </motion.div>
          ))}
          {visible < SCRIPT.length && (
            <div className="flex items-center gap-1 text-zinc-700 mt-1">
              <span>❯</span><span className="w-2 h-[13px] bg-blue-500/50 animate-pulse" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-white/[0.05] px-5 py-2.5 flex items-center justify-between text-[10px] font-mono bg-white/[0.01]">
          <div className="flex gap-4 text-zinc-700"><span>agents: 3 active</span><span>tasks: 7 complete</span><span>latency: &lt;150ms</span></div>
          <div className="flex items-center gap-1.5 text-blue-500"><Activity size={10} />AGENTIRL RUNTIME</div>
        </div>
      </div>
    </div>
  );
};

const CAPS = [
  { icon: Database,     color: 'text-blue-400',    name: 'Smart Tool Adapters',       desc: 'Raw API responses normalized into structured, token-efficient payloads. Reduces token costs by up to 94% per tool call.' },
  { icon: Layers,       color: 'text-violet-400',   name: 'Framework Agnostic',        desc: 'Wrap LangChain, CrewAI, LangGraph, AutoGen, or OpenAI Agents SDK without changing your orchestration logic.' },
  { icon: GitBranch,    color: 'text-blue-400',     name: 'DAG Workflow Decomposition', desc: 'Break complex goals into directed acyclic graphs with pre/post-condition checks at every node.' },
  { icon: RefreshCw,    color: 'text-emerald-400',  name: 'Auto-Recovery',             desc: 'Circuit breakers, exponential backoff, and fallback chains. 92% of errors self-recover without human intervention.' },
  { icon: Zap,          color: 'text-amber-400',    name: 'Cost Optimization',         desc: 'Prompt caching, semantic dedup, model routing reduce LLM spend 60%. Hard budget stops per agent — not post-hoc alerts.' },
  { icon: BrainCircuit, color: 'text-violet-400',   name: 'Durable State',             desc: 'Workflow checkpointed after every node. Crashes and retries resume exactly where the agent stopped.' },
  { icon: Globe,        color: 'text-blue-400',     name: '100+ Integrations',         desc: 'Pre-built adapters for Salesforce, SAP, Slack, HubSpot, Jira, GitHub, Postgres. Point, configure, delegate.' },
  { icon: Activity,     color: 'text-emerald-400',  name: 'OTLP Observability',        desc: 'Full distributed traces and per-node cost attribution via OTLP. Works with Grafana, Datadog, New Relic.' },
  { icon: Users,        color: 'text-amber-400',    name: 'Human-in-Loop (Risk-Aware)', desc: 'Approval gates at actual failure points — not everywhere. Humans stay in control without blocking every action.' },
  { icon: Network,      color: 'text-violet-400',   name: 'Multi-Agent Coordination',  desc: 'CEO delegates to Sales, Dev, Support — each with its own trust scope and budget envelope.' },
  { icon: TrendingUp,   color: 'text-blue-400',     name: 'Continuous Improvement',    desc: 'Runtime analytics feed back into trust scoring. Agents that perform well earn more autonomy automatically.' },
  { icon: Lock,         color: 'text-emerald-400',  name: 'Zero-Trust Credentials',    desc: 'Agents never see raw secrets. Scoped credentials injected at execution time, auto-rotated, logged in provenance.' },
];

const FRAMEWORKS = ['LangChain', 'CrewAI', 'LangGraph', 'AutoGen', 'OpenAI Agents', 'Anthropic MCP'];

const STEPS = [
  { n: '01', c: 'text-violet-400', t: 'Wrap your agents with the AgentIRL runtime',    b: 'Install the SDK and point it at your existing agent code — LangChain, CrewAI, custom. No rewrite. The runtime intercepts all tool calls, LLM invocations, and state transitions.' },
  { n: '02', c: 'text-blue-400',   t: 'Define your workflows as task DAGs',             b: 'Describe complex goals as directed acyclic graphs. AgentIRL decomposes high-level objectives into bounded operations with pre/post-condition checks, error recovery paths, and fallback chains.' },
  { n: '03', c: 'text-amber-400',  t: 'Trust Fabric enforces governance at every step', b: 'Before any action executes, Trust Fabric checks identity, evaluates policy, validates budget, injects credentials, and records provenance. Autonomous execution with enterprise oversight.' },
  { n: '04', c: 'text-emerald-400',t: 'Analytics closes the feedback loop',             b: 'Every session is traced, every tool call measured, every trust score updated based on outcomes. Your agents improve over time — with data, not guesswork.' },
];

export const AgentIRL: React.FC = () => (
  <Layout showBackground={false}>
    <ServiceSEO
      serviceName="AgentIRL — Multi-Agent Orchestration & Runtime"
      serviceDescription="AgentIRL is the production runtime for autonomous AI agents. Framework-agnostic orchestration, smart tool adapters, auto-recovery, cost optimization, and OTLP observability — with AgentIRL Trust Fabric governance built in."
    />

    {/* HERO */}
    <section className="relative bg-[#08090E] pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_0%,transparent_100%)]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-20 items-center">
          <div>
            <FU d={0} className="flex flex-wrap gap-2 mb-8">
              <Tag color="blue"><Cpu size={10} />AgentIRL Runtime</Tag>
              <Tag color="zinc">Framework Agnostic</Tag>
              <Tag color="emerald">&lt;150ms coordination latency</Tag>
            </FU>
            <FU d={0.05}>
              <h1 className="font-jakarta text-5xl lg:text-[60px] font-extrabold text-white tracking-[-0.03em] leading-[1.05] mb-6">
                The production runtime<br />for autonomous agents.
              </h1>
            </FU>
            <FU d={0.1}>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-xl">
                AgentIRL is the middleware layer between your AI models and your business systems.
                Orchestration, reliability engineering, smart tool adapters, cost optimization —
                so your agents actually finish their jobs in production.
              </p>
            </FU>
            <FU d={0.14} className="flex flex-wrap gap-3 mb-10">
              {['99.99% uptime SLA', '92% error auto-recovery', '60% token cost reduction', '100+ integrations'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-zinc-400 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={12} className="text-emerald-500" />{t}
                </span>
              ))}
            </FU>
            <FU d={0.18} className="flex flex-wrap gap-3">
              <Link to="/contact" className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_28px_rgba(139,92,246,0.3)]">
                Book a demo<ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/services/trust-fabric" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/15 text-zinc-300 hover:text-white font-semibold text-sm transition-all duration-200">
                <Shield size={14} className="text-violet-400" />See Trust Fabric
              </Link>
            </FU>
            <FU d={0.22} className="mt-10 pt-8 border-t border-white/[0.06]">
              <div className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest mb-3">Works with</div>
              <div className="flex flex-wrap gap-2">
                {FRAMEWORKS.map(f => <span key={f} className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-xs text-zinc-500">{f}</span>)}
              </div>
            </FU>
          </div>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <AgentConsole />
          </motion.div>
        </div>
      </div>
    </section>

    {/* METRICS */}
    <div className="border-t border-white/[0.06] bg-[#08090E]">
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[{ n:'99.99%',l:'Uptime SLA'},{n:'92%',l:'Error auto-recovery'},{n:'<150ms',l:'Coordination latency'},{n:'60%',l:'LLM cost reduction'}].map((s,i)=>(
          <FU key={i} d={i*0.05} className="text-center">
            <div className="font-jakarta text-3xl font-bold text-white mb-1">{s.n}</div>
            <div className="text-sm text-zinc-500">{s.l}</div>
          </FU>
        ))}
      </div>
    </div>

    {/* HOW IT WORKS */}
    <section className="bg-[#08090E] border-t border-white/[0.06] py-24">
      <div className="max-w-4xl mx-auto px-6">
        <FU d={0} className="mb-14">
          <Tag color="zinc">How it works</Tag>
          <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">From installation to autonomous production in four steps.</h2>
          <p className="text-zinc-500 text-lg max-w-2xl">AgentIRL wraps your existing agents without requiring a rewrite. Governance, reliability, and observability are added as layers — not replacements.</p>
        </FU>
        <div className="space-y-px">
          {STEPS.map((step,i)=>(
            <FU key={i} d={i*0.08}>
              <div className="flex gap-8 py-10 border-b border-white/[0.06] last:border-0">
                <div className={`text-5xl font-bold font-mono tabular-nums shrink-0 w-14 opacity-25 pt-1 ${step.c}`}>{step.n}</div>
                <div>
                  <h3 className="font-jakarta text-xl font-semibold text-white mb-3">{step.t}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.b}</p>
                </div>
              </div>
            </FU>
          ))}
        </div>
      </div>
    </section>

    {/* CAPABILITIES */}
    <section className="bg-[#08090E] border-t border-white/[0.06] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <FU d={0} className="mb-14">
          <Tag color="blue">Platform capabilities</Tag>
          <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">Everything the infrastructure team won't have to build.</h2>
          <p className="text-zinc-500 text-lg max-w-2xl">Each capability is production-grade. Building even one in-house takes months. AgentIRL ships all twelve, integrated and governed.</p>
        </FU>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPS.map((cap,i)=>{ const Icon=cap.icon; return (
            <FU key={i} d={i*0.04}>
              <div className="h-full rounded-2xl border border-white/[0.07] bg-[#0C0C0F] p-6 hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-300">
                <Icon size={18} className={`${cap.color} mb-4`} />
                <h3 className="font-jakarta font-semibold text-white text-sm mb-2">{cap.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{cap.desc}</p>
              </div>
            </FU>
          );})}
        </div>
      </div>
    </section>

    {/* BUILD VS BUY */}
    <section className="bg-[#08090E] border-t border-white/[0.06] py-24">
      <div className="max-w-5xl mx-auto px-6">
        <FU d={0} className="text-center mb-14">
          <Tag color="zinc">Build vs. buy</Tag>
          <h2 className="font-jakarta text-4xl font-extrabold text-white tracking-tight mt-4 mb-4">The cost of building this yourself.</h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">We've seen what it takes. Here's the honest accounting.</p>
        </FU>
        <div className="grid md:grid-cols-2 gap-px rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.07]">
          <div className="bg-[#0C0C0F] p-10">
            <Tag color="zinc">Build in-house</Tag>
            <h3 className="font-jakarta text-2xl font-bold text-white mt-5 mb-4">6–18 months. Ongoing maintenance forever.</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-7">Building production-grade agent infrastructure is not a side project. Every capability requires design, build, testing, ops, and iteration.</p>
            <div className="space-y-2">
              {['Tool adapter normalization layer','DAG-based workflow engine','Circuit breaker + retry framework','Token budget enforcement','Secrets management integration','OTLP trace pipeline','Trust scoring system','Policy evaluation engine','Hash-chained audit ledger','Multi-agent coordination protocol'].map(item=>(
                <div key={item} className="flex items-start gap-2.5 text-sm text-zinc-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-1.5 shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0C0C0F] p-10 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
            <Tag color="violet">With AgentIRL</Tag>
            <h3 className="font-jakarta text-2xl font-bold text-white mt-5 mb-4">Deploy in days. Scale to enterprise.</h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-7">Every capability ships with AgentIRL — battle-tested, integrated, and maintained. Your team focuses on agents that create business value.</p>
            <div className="space-y-2">
              {['All 12 capabilities, production-ready','Trust Fabric governance included','SOC 2 audit trail out of the box','SDK wraps your existing agents','No framework migration required','On-prem or SaaS deployment','Enterprise SLAs and support','Regular capability updates','100+ pre-built integrations','Dedicated integration engineering'].map(item=>(
                <div key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-[#08090E] border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <FU d={0} className="flex justify-center mb-5"><Tag color="blue"><Cpu size={10} />AgentIRL Runtime</Tag></FU>
        <FU d={0.06}><h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">Ship agents that stay shipped.</h2></FU>
        <FU d={0.1}><p className="text-zinc-500 text-lg mb-10 max-w-xl mx-auto">See AgentIRL running with your agents in your environment. Our engineering team walks you through every layer.</p></FU>
        <FU d={0.14} className="flex flex-wrap gap-4 justify-center">
          <Link to="/contact" className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all duration-200 shadow-[0_0_28px_rgba(139,92,246,0.3)]">
            Book a demo<ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link to="/services/trust-fabric" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/15 text-zinc-300 hover:text-white font-bold transition-all duration-200">
            <Shield size={16} className="text-violet-400" />See Trust Fabric
          </Link>
        </FU>
        <FU d={0.2} className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-zinc-700">
          {['Framework agnostic','No rewrite required','On-prem or SaaS','Enterprise SLAs','SOC 2 compliant'].map(t=>(
            <span key={t} className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-700" />{t}</span>
          ))}
        </FU>
      </div>
    </section>
  </Layout>
);
