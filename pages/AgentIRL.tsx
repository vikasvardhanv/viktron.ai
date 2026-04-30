/**
 * Viktron AI — AgentIRL Page
 * "The Governance Interceptor & Runtime."
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, BarChart3, Server, CheckCircle2,
  Lock, Activity, Fingerprint, KeyRound,
  FileCheck, Globe, Cpu, Database, Zap, Layers, Network
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ServiceSEO } from '../components/ui/SEO';

// ─── ASSETS (Public Directory) ─────────────────────────────────────────────
const ASSETS = {
  moat: "/assets/branding/moat.png",
  cloud: "/assets/branding/hero.png", 
};

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

export const AgentIRL: React.FC = () => (
  <Layout showBackground={false}>
    <ServiceSEO
      serviceName="AgentIRL — Multi-Agent Orchestration Platform"
      serviceDescription="AgentIRL is Viktron's production runtime for autonomous AI agents. Intercept tool calls, enforce policies, record provenance, coordinate multi-agent teams, and export telemetry via OTLP — without rewriting your code. 99.9% uptime SLA."
      serviceId="agentirl"
    />

    {/* ═══════════════════════════ HERO ═══════════════════════════ */}
    <section className="relative min-h-[90vh] bg-[#050505] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-20 items-center">
          <div className="space-y-12">
            <FU d={0}>
              <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.3em] uppercase font-bold text-glow">
                <div className="w-12 h-px bg-primary" />
                GOVERNANCE_AS_CODE // v2.2
              </div>
            </FU>
            <FU d={0.1}>
              <h1 className="heading-precision text-7xl md:text-8xl text-white leading-[0.85] tracking-[-0.04em]">
                AGENT<br />
                <span className="text-zinc-700">GOVERNANCE.</span>
              </h1>
              <p className="heading-editorial text-3xl text-zinc-300 mt-8 max-w-xl">
                Enterprise governance for AI agents you already run — or want to run through us.
              </p>
            </FU>
            <FU d={0.2}>
              <div className="max-w-xl space-y-5">
                <p className="text-zinc-400 text-lg leading-relaxed">
                  AgentIRL is the runtime layer that sits between your AI agents and the world. It intercepts every tool call, enforces your policies, issues delegation tokens, and records an immutable audit trail — all without touching your existing agent code.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[
                    { label: 'Bring your own agents', sub: 'LangChain, CrewAI, AutoGen, or custom SDK' },
                    { label: 'Or use ours', sub: 'We provision a full agent team for you' },
                  ].map((item, i) => (
                    <div key={i} className="obsidian-inset p-4 border border-white/5">
                      <div className="text-white text-[11px] font-bold uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="text-zinc-600 text-[10px] leading-relaxed">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FU>
            <FU d={0.3} className="flex gap-6">
              <Link to="/contact" className="btn-acid">Request SDK Access</Link>
              <Link to="/signup?redirect=/onboarding" className="btn-obsidian">Deploy Agent Team Instead</Link>
            </FU>
          </div>
          <FU d={0.4} className="relative hidden lg:block group">
             <div className="obsidian-panel p-2 shimmer">
                <img src={ASSETS.moat} alt="Governance Monolith" className="w-full h-full object-cover grayscale brightness-75 group-hover:brightness-100 transition-all duration-1000" />
                <div className="absolute top-6 left-6 font-mono text-[9px] text-primary/60 tracking-widest uppercase">// SECURE_RUNTIME_ACTIVE</div>
             </div>
          </FU>
        </div>
      </div>
    </section>

    {/* ══════════════════ 01: CAPABILITIES ══════════════════ */}
    <section className="py-40 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <Label>01 // RUNTIME CAPABILITIES</Label>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {[
            { 
              t: 'Interception', 
              d: 'Evaluates tool calls before they hit your production APIs.',
              img: '/assets/images/trust/policy.png'
            },
            { 
              t: 'Identity', 
              d: 'Binds every action to a cryptographically verified agent fingerprint.',
              img: '/assets/images/trust/identity.png'
            },
            { 
              t: 'Budgeting', 
              d: 'Enforces hard token and dollar limits at the runtime level.',
              img: '/assets/images/trust/budget.png'
            },
            { 
              t: 'Provenance', 
              d: 'Records an immutable hash-chained ledger of every decision.',
              img: '/assets/images/trust/ledger.png'
            },
          ].map((f, i) => (
            <FU key={i} d={i * 0.05} className="obsidian-panel p-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500">
               <div className="aspect-video overflow-hidden relative border-b border-white/5">
                  <img src={f.img} alt={f.t} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-40" />
               </div>
               <div className="p-8 space-y-4">
                  <div className="font-mono text-[11px] text-primary uppercase font-bold tracking-[0.2em]">{f.t}</div>
                  <p className="text-zinc-500 text-xs leading-relaxed font-light">{f.d}</p>
               </div>
            </FU>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════ 02: DEPLOYMENT ══════════════════ */}
    <section className="py-40 bg-[#080808] border-y border-white/5 relative overflow-hidden">
       <div className="max-w-7xl mx-auto px-6">
          <Label>02 // DEPLOYMENT ARCHITECTURE</Label>
          <div className="grid lg:grid-cols-2 gap-24 items-center mt-20">
             <FU d={0}>
                <h2 className="heading-precision text-6xl text-white mb-10 uppercase tracking-tighter">Zero-Rewrite<br />Deployment.</h2>
                <p className="text-zinc-300 text-xl leading-relaxed mb-12 font-light">
                   AgentIRL lives as a high-performance middleware SDK. You don't rewrite 
                   your logic; you simply wrap your executor.
                </p>
                <div className="space-y-10">
                   {[
                     { n: '01', t: 'SDK Integration', b: 'Integrate our SDK into your Python or Node.js environment in minutes.' },
                     { n: '02', t: 'Policy Mapping', b: 'Map tool permissions and budget envelopes in YAML or our HUD.' },
                     { n: '03', t: 'Execution', b: 'The runtime intercepts, evaluates policy, and records provenance.' },
                   ].map((s, i) => (
                     <div key={i} className="flex gap-10">
                        <div className="font-mono text-2xl text-primary/20 pt-1 font-bold">{s.n}</div>
                        <div>
                           <h4 className="text-white font-bold text-base mb-2 uppercase tracking-tight">{s.t}</h4>
                           <p className="text-zinc-400 text-sm leading-relaxed">{s.b}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </FU>
             <FU d={0.2} className="obsidian-panel p-12 bg-[#050505] relative shimmer">
                <div className="scan-line" />
                <div className="w-full space-y-6">
                   <div className="flex justify-between font-mono text-[10px] text-primary font-bold text-glow">
                      <span>INTERCEPTION_ACTIVE</span>
                      <span>SHA-256_SECURE</span>
                   </div>
                   <div className="h-0.5 bg-zinc-800 relative overflow-hidden">
                      <motion.div 
                        className="absolute inset-y-0 left-0 bg-primary w-full"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                   </div>
                   <div className="p-6 bg-black border border-white/5 font-mono text-[11px] text-primary/70 space-y-2">
                      <div>→ RECV: tool_call.crm_query</div>
                      <div>→ AUTH: identity_verified</div>
                      <div>→ EVAL: policy_granted</div>
                      <div>→ EXEC: success [sha256:8f2a...]</div>
                   </div>
                </div>
             </FU>
          </div>
       </div>
    </section>

    {/* ══════════════════ 03: ENGINES ══════════════════ */}
    <section className="py-40 bg-[#050505] relative">
       <div className="max-w-7xl mx-auto px-6">
          <Label>03 // PLATFORM ENGINES</Label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
             {[
               { name: 'IDENTITY BINDING', desc: 'Every agent has a unique cryptographic fingerprint.', img: '/assets/images/trust/identity.png' },
               { name: 'RUNTIME POLICY', desc: 'Enforce tool permissions before they execute.', img: '/assets/images/trust/policy.png' },
               { name: 'BUDGET GUARDS', desc: 'Hard stops on LLM costs and API spend per task.', img: '/assets/images/trust/budget.png' },
               { name: 'AUDIT LEDGER', desc: 'Immutable provenance for compliance and debugging.', img: '/assets/images/trust/ledger.png' },
               { name: 'ZERO-TRUST VAULT', desc: 'Credential injection at the moment of execution.', img: '/assets/images/trust/vault.png' },
               { name: 'SMART ADAPTERS', desc: 'Normalize API data for 94% token efficiency.', img: '/assets/images/trust/adapters.png' },
             ].map((c, i) => (
               <FU key={i} d={i * 0.05} className="obsidian-panel p-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden relative border-b border-white/5">
                     <img src={c.img} alt={c.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-40" />
                  </div>
                  <div className="p-8 space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{c.name}</h4>
                    <p className="text-zinc-500 text-[10px] leading-relaxed font-light">{c.desc}</p>
                  </div>
               </FU>
             ))}
          </div>
       </div>
    </section>

    {/* ══════════════════ 04: CORE AGENTS ══════════════════ */}
    <section className="py-40 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <Label>04 // CORE AGENT TYPES</Label>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {[
            {
              name: 'CEO Agent',
              color: 'from-purple-500 to-violet-600',
              desc: 'Strategic orchestration and delegation. Breaks complex goals into task DAGs.',
              tasks: ['Goal planning', 'Resource allocation', 'Team coordination']
            },
            {
              name: 'Project Manager',
              color: 'from-emerald-400 to-teal-600',
              desc: 'Task decomposition and progress tracking. Enforces quality gates.',
              tasks: ['Task ledger', 'Milestone tracking', 'Progress reporting']
            },
            {
              name: 'Developer',
              color: 'from-cyan-400 to-blue-600',
              desc: 'Code generation, file operations, and system interactions.',
              tasks: ['Code generation', 'File operations', 'System commands']
            },
            {
              name: 'QA Agent',
              color: 'from-yellow-400 to-orange-600',
              desc: 'Test discovery, execution, and validation of outputs.',
              tasks: ['Test generation', 'Bug detection', 'Validation']
            },
            {
              name: 'Sales Assistant',
              color: 'from-rose-400 to-pink-600',
              desc: 'Lead qualification and outreach automation.',
              tasks: ['Lead scoring', 'Email outreach', 'Follow-up sequencing']
            },
            {
              name: 'Support Agent',
              color: 'from-indigo-400 to-purple-600',
              desc: 'Customer service and ticket resolution.',
              tasks: ['Ticket triage', 'Knowledge lookup', 'Response generation']
            },
            {
              name: 'Content Generator',
              color: 'from-green-400 to-emerald-600',
              desc: 'Marketing content and documentation creation.',
              tasks: ['Blog posts', 'Email campaigns', 'Documentation']
            },
            {
              name: 'Specialized Agents',
              color: 'from-slate-400 to-zinc-600',
              desc: 'Industry-specific roles (legal, finance, HR, operations).',
              tasks: ['Domain expertise', 'Compliance checks', 'Workflow automation']
            },
          ].map((a, i) => (
            <FU key={i} d={i * 0.1} className="obsidian-panel p-8 group hover:border-primary/40 transition-all">
              <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${a.color} group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-black/40 rounded-lg" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2 tracking-tight">{a.name}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">{a.desc}</p>
              <div className="space-y-1.5">
                {a.tasks.map((t, j) => (
                  <div key={j} className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {t}
                  </div>
                ))}
              </div>
            </FU>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════ CTA ══════════════════ */}
    <section className="py-60 bg-[#050505] relative overflow-hidden text-center">
       <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FU d={0}>
             <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-12 uppercase tracking-tighter font-black">
                SECURE<br />WORKFORCE.
             </h2>
             <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
               Bringing your own agents to AgentIRL, or want us to deploy a governed agent team for you?
             </p>
             <div className="flex flex-wrap gap-6 justify-center">
               <Link to="/contact" className="btn-acid px-16 py-6">Request SDK Access</Link>
               <Link to="/signup?redirect=/onboarding" className="btn-obsidian px-16 py-6">Deploy Agent Team</Link>
             </div>
          </FU>
       </div>
    </section>
  </Layout>
);
