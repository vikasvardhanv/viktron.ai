# AgentIRL Page Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the broken `/services/agent-orchestration` route with a world-class `/services/agentirl` page that uses the orchestration video as a scroll-driven hero, removes all broken demo buttons, and tells the full AgentIRL story the way Amplitude/PostHog tell theirs.

**Architecture:** Single dedicated page component `AgentIRL.tsx` (not routed through the generic `ServiceDetail.tsx`), registered at `/services/agentirl` with a redirect from the old slug. The scroll-driven video section uses `useRef` + `IntersectionObserver` / scroll-progress to scrub the video. All CTAs go to `/contact` — no auth-gated demo links visible to cold visitors.

**Tech Stack:** React 18, Framer Motion (already installed), Tailwind CSS, Lucide icons, react-router-dom `<Navigate>` for redirect.

---

## What the final page must communicate (copy brief)

Based on how Amplitude, PostHog and Matomo tell their story:

1. **Hero** — One-line power statement + what AgentIRL is in 15 words. Video plays inline.
2. **The problem** — Why 95% of AI agent projects fail in production (real stats).
3. **What AgentIRL is** — The middleware layer between your AI models and your business systems. Not an LLM. Not a chatbot. A production runtime.
4. **How it works** — 5-step visual flow with the video scrubbing as user scrolls.
5. **Capabilities grid** — 10 features with icons, no fluff.
6. **Metrics bar** — 99.99% uptime, <150ms, 60% token reduction, 92% auto-recovery.
7. **Use cases** — Enterprise, agency, SaaS — each with a one-line scenario.
8. **Frameworks** — LangChain, CrewAI, LangGraph, AutoGen, OpenAI Agents, MCP. Framework-agnostic badge.
9. **CTA** — "Talk to us" → /contact. No auth-gated buttons.

---

### Task 1: Add `/services/agentirl` route + redirect old slug

**Files:**
- Modify: `App.tsx`

**Step 1: Add route and redirect**

In `App.tsx`, find the existing routes block. Add two lines:

```tsx
// After: import AgentOrchestrationDemo = lazy(...)
const AgentIRL = lazy(() => import('./pages/AgentIRL').then(m => ({ default: m.AgentIRL })));
```

In the `<Routes>` block, add:
```tsx
<Route path="/services/agentirl" element={<PageTransition><AgentIRL /></PageTransition>} />
<Route path="/services/agent-orchestration" element={<Navigate to="/services/agentirl" replace />} />
```

Replace the existing `/services/agent-orchestration` route (which currently goes to `ServiceDetail`) with just the redirect.

**Step 2: Update the Services page link**

In `pages/Services.tsx` line 67, change:
```tsx
link: '/services/agent-orchestration',
```
to:
```tsx
link: '/services/agentirl',
```

**Step 3: Verify no other hardlinks to old slug**

```bash
grep -rn "services/agent-orchestration" src pages components --include="*.tsx"
```

Update any remaining links to `/services/agentirl`.

**Step 4: Commit**

```bash
git add App.tsx pages/Services.tsx
git commit -m "feat: add /services/agentirl route, redirect old slug"
```

---

### Task 2: Create `pages/AgentIRL.tsx` — shell + hero with video

**Files:**
- Create: `pages/AgentIRL.tsx`

**Step 1: Create the file with imports + Layout shell**

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import {
  ArrowRight, CheckCircle2, Zap, Shield, BrainCircuit,
  Layers, TrendingUp, Database, Globe, Cpu, Users,
  BarChart3, AlertCircle, RefreshCw, Lock, GitBranch,
  Workflow, Sparkles
} from 'lucide-react';

export const AgentIRL: React.FC = () => {
  return (
    <Layout>
      <div>stub</div>
    </Layout>
  );
};
```

Verify it renders at `/services/agentirl` without errors.

**Step 2: Build the hero section**

Replace the stub with the hero. The hero has:
- Left column: badge + H1 + subheadline + two CTAs + 3 metric chips
- Right column: video in a rounded glassmorphism card

```tsx
{/* Hero */}
<section className="pt-28 pb-16 bg-[#f7f8f5] relative overflow-hidden border-b border-slate-200">
  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_14%_12%,rgba(16,185,129,0.14),transparent_36%),radial-gradient(circle_at_88%_25%,rgba(6,182,212,0.14),transparent_34%)]" />
  <div className="container-custom relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
      {/* Left */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] tracking-[0.12em] uppercase text-emerald-700 font-semibold mb-6">
          <BrainCircuit className="w-3 h-3" /> AgentIRL Platform
        </div>
        <h1 className="text-4xl md:text-[3.5rem] tracking-tighter leading-[1.05] font-semibold text-slate-950 mb-5">
          The production runtime<br />for real AI agents.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-[60ch] mb-8">
          AgentIRL is the middleware layer between your AI models and your business systems.
          It solves what no LLM framework does: deterministic multi-step workflows,
          deep enterprise integrations, full observability, and policy-safe execution —
          at production scale.
        </p>
        {/* Metric chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { value: '99.99%', label: 'Uptime SLA' },
            { value: '60%', label: 'Token cost reduction' },
            { value: '92%', label: 'Error auto-recovery' },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <p className="text-lg font-bold tracking-tight text-slate-900">{m.value}</p>
              <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{m.label}</p>
            </div>
          ))}
        </div>
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-6 text-base font-semibold bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] transition-all">
            Book a Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-6 text-base border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 active:scale-[0.98] transition-all">
            Talk to Engineering
          </Link>
        </div>
      </motion.div>

      {/* Right — video card */}
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <div className="rounded-[2rem] border border-white/20 bg-white/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_45px_-26px_rgba(15,23,42,0.65)] backdrop-blur-md">
          <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-950">
            <video
              autoPlay muted loop playsInline preload="metadata"
              className="w-full aspect-[16/10] object-cover"
              src="/AI_Agents_Orchestrated_into_a_System.mp4"
            />
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <p className="text-[11px] uppercase tracking-[0.1em] text-emerald-700">Live Runtime</p>
          <p className="text-sm font-semibold text-emerald-900">Task DAG orchestration · Policy engine · Auto-recovery loops</p>
        </div>
      </motion.div>
    </div>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add pages/AgentIRL.tsx
git commit -m "feat: AgentIRL page hero with video"
```

---

### Task 3: Problem section — why agents fail in production

Add this section directly below the hero inside `AgentIRL.tsx`.

```tsx
{/* Problem */}
<section className="py-24 bg-white border-t border-slate-100">
  <div className="container-custom">
    <div className="max-w-3xl mx-auto text-center mb-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-700 mb-5">
        <AlertCircle className="w-3 h-3" /> The Production Problem
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
        Why 95% of AI agent projects never reach production
      </h2>
      <p className="text-slate-500 text-lg">
        LLM frameworks make it easy to build demos. They make it nearly impossible to ship reliable systems.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
      {[
        {
          stat: '36%',
          color: 'text-red-600',
          bg: 'from-red-50 to-transparent border-red-100',
          title: 'Success rate on 20-step workflows',
          desc: 'At 95% per-step reliability — already best-in-class — a 20-step workflow succeeds only 36% of the time. Error compounds silently.',
        },
        {
          stat: '68%',
          color: 'text-amber-600',
          bg: 'from-amber-50 to-transparent border-amber-100',
          title: 'Agents hit a wall before step 10',
          desc: '68% of production agents require human intervention within 10 steps. Integration complexity, token overflow, and unhandled errors kill autonomy.',
        },
        {
          stat: '10x',
          color: 'text-blue-600',
          bg: 'from-blue-50 to-transparent border-blue-100',
          title: 'Cost overrun vs demo estimates',
          desc: 'A 100-turn agentic conversation costs $50–$100 in tokens. Without context trimming and structured tool feedback, costs spiral instantly.',
        },
      ].map(item => (
        <motion.div
          key={item.stat}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-2xl bg-gradient-to-br ${item.bg} border p-8`}
        >
          <div className={`text-5xl font-black mb-3 ${item.color}`}>{item.stat}</div>
          <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>

    <div className="rounded-2xl bg-slate-950 text-white p-8 max-w-3xl mx-auto">
      <p className="font-semibold text-emerald-400 text-sm mb-3 uppercase tracking-wider">AgentIRL fixes this</p>
      <ul className="space-y-3">
        {[
          'Workflow decomposition breaks tasks into bounded operations with pre/post-condition checks',
          'Smart tool adapters with structured feedback eliminate token-bloat from raw API dumps',
          'Circuit breakers, intelligent retries, and fallback chains maintain uptime through failures',
          'Human-in-the-loop gates positioned at actual failure points — not everywhere',
          'Framework-agnostic: switch between LangChain, CrewAI, LangGraph without re-engineering',
        ].map(item => (
          <li key={item} className="flex gap-3 text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>
```

**Commit:**
```bash
git commit -am "feat: AgentIRL problem section"
```

---

### Task 4: Scroll-driven video section — "Watch it work"

This section shows the video pinned to the right while 5 workflow steps scroll past on the left. As the user scrolls through each step, the active step highlights. Uses `IntersectionObserver` on each step div.

Add this state at the top of the component:
```tsx
const [activeStep, setActiveStep] = useState(0);
const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
```

Add this `useEffect`:
```tsx
useEffect(() => {
  const observers = stepRefs.current.map((el, idx) => {
    if (!el) return null;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActiveStep(idx); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return obs;
  });
  return () => observers.forEach(o => o?.disconnect());
}, []);
```

Section JSX:
```tsx
{/* How it works — scroll-pinned video */}
<section className="py-24 bg-slate-50 border-t border-slate-200">
  <div className="container-custom">
    <div className="text-center mb-14">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 mb-5">
        <Workflow className="w-3 h-3" /> How AgentIRL Works
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
        From raw instruction to completed task — reliably.
      </h2>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      {/* Steps — left column, scrolls */}
      <div className="space-y-10">
        {[
          { n: '01', title: 'Connect Your Systems', desc: 'Link your CRM, ERP, databases, APIs, and legacy systems through AgentIRL adapters. One-click OAuth for SaaS tools. Custom adapters for on-prem systems in days, not months.' },
          { n: '02', title: 'Define Agent Workflows', desc: 'Specify agent roles, tasks, and handoffs in plain language or YAML. AgentIRL automatically decomposes workflows, identifies error-risk steps, and positions human gates where they matter.' },
          { n: '03', title: 'Set Governance Rules', desc: 'Configure access policies, approval workflows, escalation rules, and compliance requirements per workflow. Full audit logging is always on — every agent decision is traceable.' },
          { n: '04', title: 'Deploy Across Frameworks', desc: 'Ship to LangChain, CrewAI, LangGraph, AutoGen, OpenAI Agents, or Anthropic MCP — or all of them simultaneously. AgentIRL coordinates across frameworks so you\'re never locked in.' },
          { n: '05', title: 'Monitor, Recover, Improve', desc: 'Real-time dashboards show every agent decision and tool call. When failures occur, circuit breakers activate, retries fire, and fallbacks engage — all before you\'re paged.' },
        ].map((step, idx) => (
          <div
            key={step.n}
            ref={el => { stepRefs.current[idx] = el; }}
            className={`rounded-2xl border p-7 transition-all duration-300 ${
              activeStep === idx
                ? 'border-emerald-300 bg-white shadow-[0_8px_30px_rgba(16,185,129,0.12)]'
                : 'border-slate-200 bg-white/60'
            }`}
          >
            <div className={`text-xs font-mono font-bold mb-3 ${activeStep === idx ? 'text-emerald-600' : 'text-slate-400'}`}>
              STEP {step.n}
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Video — right column, sticky */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-[1.8rem] border border-slate-200 bg-slate-950 overflow-hidden shadow-[0_32px_64px_-20px_rgba(15,23,42,0.5)]">
          <video
            autoPlay muted loop playsInline preload="metadata"
            className="w-full aspect-[16/10] object-cover"
            src="/AI_Agents_Orchestrated_into_a_System.mp4"
          />
        </div>
        <div className="mt-4 flex gap-1.5">
          {[0,1,2,3,4].map(i => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${activeStep === i ? 'bg-emerald-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
```

**Commit:**
```bash
git commit -am "feat: AgentIRL scroll-driven video how-it-works section"
```

---

### Task 5: Capabilities grid + framework badges

```tsx
{/* Capabilities */}
<section className="py-24 bg-white border-t border-slate-100">
  <div className="container-custom">
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
        Everything a production agent system needs
      </h2>
      <p className="text-slate-500 text-lg max-w-2xl mx-auto">
        AgentIRL handles the infrastructure so you focus on the business logic.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
      {[
        { icon: Database, title: 'Smart Tool Adapters', desc: '100+ pre-built adapters for APIs, databases, and enterprise systems. Structured feedback eliminates token bloat from raw API dumps.' },
        { icon: Layers, title: 'Framework-Agnostic', desc: 'LangChain, CrewAI, LangGraph, AutoGen, OpenAI Agents, MCP — run all simultaneously. Switch without re-engineering.' },
        { icon: GitBranch, title: 'Workflow Decomposition', desc: 'Complex tasks auto-split into bounded operations. Pre/post-condition checks prevent cascading failures.' },
        { icon: Lock, title: 'Unified Security Layer', desc: 'Centralized auth, RBAC, and encrypted credential vaults for every connected system. SOC2-ready audit logs.' },
        { icon: BarChart3, title: 'Deep Observability', desc: 'Distributed tracing across prompts, tool calls, and retrievals. Semantic evaluation catches hallucinations in real-time.' },
        { icon: Shield, title: 'Adaptive Policy Engine', desc: 'Data residency, privacy rules, rate limits, and escalation protocols enforced per workflow. Full replay capability.' },
        { icon: RefreshCw, title: 'Error Auto-Recovery', desc: 'Circuit breakers, intelligent retries, and fallback chains maintain uptime through tool failures and provider outages.' },
        { icon: Zap, title: 'Cost Optimization', desc: 'Route tasks to cheapest capable model. Context trimming and summarization reduce token costs by 60%.' },
        { icon: Users, title: 'Human-in-the-Loop', desc: 'Configurable approval gates for high-stakes actions. Escalation rules learned from your decision history.' },
        { icon: BrainCircuit, title: 'State Management', desc: 'All agents share unified context. Config changes propagate instantly — no coordination overhead.' },
        { icon: Globe, title: 'Enterprise Integrations', desc: 'SAP, Oracle, Salesforce, ServiceNow, and 100+ more. On-prem, VPC, and cloud-native deployments supported.' },
        { icon: TrendingUp, title: 'Continuous Improvement', desc: 'ADAS (Automated Design of Agentic Systems) refines workflows from escalation and error history over time.' },
      ].map(({ icon: Icon, title, desc }) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:border-emerald-200 hover:bg-white transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
            <Icon className="w-4.5 h-4.5 text-emerald-700" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1.5">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
        </motion.div>
      ))}
    </div>

    {/* Framework logos row */}
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-8 py-6">
      <p className="text-xs uppercase tracking-widest text-slate-400 text-center mb-5">Works with every major framework</p>
      <div className="flex flex-wrap justify-center gap-4">
        {['LangChain', 'CrewAI', 'LangGraph', 'AutoGen', 'OpenAI Agents', 'Anthropic MCP'].map(f => (
          <div key={f} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            {f}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

**Commit:**
```bash
git commit -am "feat: AgentIRL capabilities grid and framework badges"
```

---

### Task 6: Metrics bar + use cases + final CTA

```tsx
{/* Metrics bar */}
<section className="py-16 bg-slate-950 text-white border-t border-white/10">
  <div className="container-custom">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
      {[
        { value: '99.99%', label: 'Uptime SLA' },
        { value: '5+', label: 'Frameworks' },
        { value: '<150ms', label: 'Coordination latency' },
        { value: '92%', label: 'Error auto-recovery' },
        { value: '100+', label: 'Tool adapters' },
        { value: '60%', label: 'Token cost reduction' },
      ].map(m => (
        <div key={m.label}>
          <p className="text-3xl font-black text-emerald-400">{m.value}</p>
          <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">{m.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Use cases */}
<section className="py-24 bg-white border-t border-slate-100">
  <div className="container-custom">
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
        Built for teams shipping AI to production
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: Cpu, title: 'Enterprise AI Teams', desc: 'Deploy multiple agent frameworks without managing coordination infrastructure. One runtime, all frameworks.' },
        { icon: Users, title: 'Customer-Facing SaaS', desc: 'Embed AI agents into your product with multi-tenant isolation, usage quotas, and per-customer audit logs.' },
        { icon: Shield, title: 'Regulated Industries', desc: 'Financial services and healthcare deployments with HIPAA-compliant data access, SOC2 audit trails, and data residency enforcement.' },
        { icon: Sparkles, title: 'AI Agencies', desc: 'Manage workflows across all client accounts from one platform. White-label the runtime and offer it as your own infrastructure.' },
      ].map(({ icon: Icon, title, desc }) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200 p-7 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Final CTA */}
<section className="py-24 bg-slate-950 text-white border-t border-white/10">
  <div className="container-custom text-center max-w-2xl mx-auto">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Now accepting enterprise pilots
    </div>
    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-5">
      Ready to ship agents that actually work?
    </h2>
    <p className="text-slate-400 text-lg mb-8">
      Talk to our engineering team. We'll map your current agent architecture and show you exactly where AgentIRL fits.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-8 text-base font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-all active:scale-[0.98]">
        Book Engineering Call <ArrowRight className="w-4 h-4" />
      </Link>
      <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-8 text-base border border-white/20 text-white hover:bg-white/5 transition-all">
        View All Services
      </Link>
    </div>
    <p className="text-slate-500 text-sm mt-6">Starting at $499/mo · Includes platform access, 100k API calls, team collaboration</p>
  </div>
</section>
```

**Commit:**
```bash
git commit -am "feat: AgentIRL metrics, use cases, and CTA sections"
```

---

### Task 7: Add SEO metadata

At the top of `AgentIRL.tsx`, add the `ServiceSEO` component:

```tsx
import { ServiceSEO } from '../components/ui/SEO';
```

Inside `<Layout>`:
```tsx
<ServiceSEO
  serviceName="AgentIRL — Production Runtime for AI Agents"
  serviceDescription="AgentIRL is the middleware platform that makes multi-agent AI systems production-ready. Orchestration, reliability engineering, enterprise integrations, observability, and policy-safe execution. 99.99% uptime SLA."
/>
```

**Commit:**
```bash
git commit -am "feat: AgentIRL SEO metadata"
```

---

### Task 8: Remove auth gate from orchestration demo link

The old "View Orchestration Demo" button in `ServiceDetail.tsx` at line 469 routes to `/demos/agent-orchestration` which is inside `<ProtectedRoute>` — so cold visitors get a login wall with no explanation.

Since the new page handles everything, this route is only accessible from the old slug which now redirects. No action needed — the `ServiceDetail` entry for `agent-orchestration` becomes dead code once the redirect is in place.

Verify at `/services/agent-orchestration` that it now redirects to `/services/agentirl`.

---

### Task 9: Final smoke check

```bash
# 1. TypeScript
npx tsc --noEmit

# 2. Confirm no remaining hardlinks to old slug (except the redirect itself)
grep -rn "services/agent-orchestration" pages components --include="*.tsx" | grep -v "Navigate to"

# 3. Check video file is in public root
ls public/AI_Agents_Orchestrated_into_a_System.mp4 || ls AI_Agents_Orchestrated_into_a_System.mp4
```

If the video is not in `public/`, copy it:
```bash
cp AI_Agents_Orchestrated_into_a_System.mp4 public/
```

**Final commit:**
```bash
git commit -am "chore: AgentIRL page complete, smoke checks passed"
```
