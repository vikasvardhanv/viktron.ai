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

// ─── ASSETS ──────────────────────────────────────────────────────────────────
const ASSETS = {
  moat: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/agentirl_brutalist_infrastructure_1777350129546.png",
  cloud: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/viktron_cloud_orchestration_visual_1777348938163.png", // Reusing hero/cloud
};

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="section-label font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-8 flex items-center gap-4">
    {children}
    <div className="h-px flex-1 bg-white/10" />
  </div>
);

export const AgentIRL: React.FC = () => (
  <Layout showBackground={false}>
    <ServiceSEO
      serviceName="AgentIRL — Governance & Runtime Interception"
      serviceDescription="The production runtime for autonomous agents. Intercept tool calls, enforce policies, and record provenance without rewriting your code."
    />

    {/* ═══════════════════════════ HERO ═══════════════════════════ */}
    <section className="relative min-h-[90vh] bg-[#050505] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-[0.03] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-20 items-center">
          <div className="space-y-12">
            <FU d={0}>
              <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.2em] uppercase">
                <div className="w-8 h-px bg-primary" />
                GOVERNANCE_AS_CODE // V1.4
              </div>
            </FU>
            <FU d={0.1}>
              <h1 className="heading-precision text-6xl md:text-8xl text-white">
                AGENT<br />
                <span className="text-muted">INTERCEPTION.</span>
              </h1>
              <p className="heading-editorial text-3xl text-zinc-300 mt-6 max-w-xl">
                The middleware layer between your AI models and your business systems.
              </p>
            </FU>
            <FU d={0.2}>
              <p className="max-w-xl text-zinc-400 text-base leading-relaxed">
                AgentIRL is the production runtime for autonomous agents. It wraps your existing 
                frameworks (LangChain, CrewAI) and intercepts every tool call to ensure safety, 
                budgeting, and identity verification.
              </p>
            </FU>
            <FU d={0.3} className="flex gap-6">
              <Link to="/contact" className="btn-acid">Book Technical Review</Link>
              <Link to="/enterprise" className="btn-obsidian border-white/20">Enterprise SLAs</Link>
            </FU>
          </div>
          <FU d={0.4} className="relative hidden lg:block">
             <div className="obsidian-panel p-2">
                <img src={ASSETS.moat} alt="Governance Monolith" className="w-full h-full object-cover grayscale brightness-75" />
             </div>
          </FU>
        </div>
      </div>
    </section>

    {/* ══════════════════ WHAT IT DOES ══════════════════ */}
    <section className="py-40 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <Label>01 // WHAT IT DOES</Label>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1 mt-20 bg-white/5 border border-white/5 overflow-hidden">
          {[
            { t: 'Interception', d: 'Evaluates tool calls before they hit your database or APIs.' },
            { t: 'Identity', d: 'Binds every action to a cryptographically verified agent ID.' },
            { t: 'Budgeting', d: 'Enforces token and dollar limits at the runtime level.' },
            { t: 'Provenance', d: 'Records a hash-chained ledger of the "Why" and the "How".' },
          ].map((f, i) => (
            <FU key={i} d={i * 0.05} className="bg-[#050505] p-12 space-y-6">
               <div className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest">{f.t}</div>
               <p className="text-zinc-500 text-sm leading-relaxed">{f.d}</p>
            </FU>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════ HOW IT WORKS ══════════════════ */}
    <section className="py-40 bg-[#080808] border-y border-white/5">
       <div className="max-w-7xl mx-auto px-6">
          <Label>02 // HOW IT WORKS</Label>
          <div className="grid lg:grid-cols-2 gap-24 items-center mt-20">
             <FU d={0}>
                <h2 className="heading-precision text-5xl text-white mb-8 uppercase tracking-tighter">Zero-Rewrite<br />Deployment.</h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                   AgentIRL lives as a middleware SDK. You don't rewrite your agent logic; 
                   you simply wrap your executor. The runtime handles the rest.
                </p>
                <div className="space-y-8">
                   {[
                     { n: '01', t: 'SDK Integration', b: 'Add our lightweight SDK to your Python or Node.js environment.' },
                     { n: '02', t: 'Policy Mapping', b: 'Define tool permissions and budget envelopes in YAML or our HUD.' },
                     { n: '03', t: 'Execution', b: 'AgentIRL intercepts tool calls, evaluates policy, and records logs.' },
                   ].map((s, i) => (
                     <div key={i} className="flex gap-8">
                        <div className="font-mono text-xl text-primary/30 pt-1">{s.n}</div>
                        <div>
                           <h4 className="text-white font-bold text-sm mb-2 uppercase">{s.t}</h4>
                           <p className="text-zinc-600 text-sm">{s.b}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </FU>
             <FU d={0.2} className="obsidian-panel aspect-square p-12 flex items-center justify-center">
                <div className="w-full space-y-4">
                   <div className="flex justify-between font-mono text-[9px] text-muted">
                      <span>INTERCEPTION_ACTIVE</span>
                      <span>SHA-256_VERIFIED</span>
                   </div>
                   <div className="h-0.5 bg-white/5 relative">
                      <div className="absolute inset-y-0 left-0 bg-primary w-full animate-pulse" />
                   </div>
                   <div className="p-4 bg-black border border-white/5 font-mono text-[11px] text-primary/60 space-y-1">
                      <div>→ RECV: tool_call.crm_export</div>
                      <div>→ AUTH: identity_token_ok</div>
                      <div>→ EVAL: policy_v2_allow</div>
                      <div>→ EXEC: execution_granted</div>
                   </div>
                </div>
             </FU>
          </div>
       </div>
    </section>

    {/* ══════════════════ CAPABILITIES ══════════════════ */}
    <section className="py-40 bg-[#050505]">
       <div className="max-w-7xl mx-auto px-6">
          <Label>03 // CORE CAPABILITIES</Label>
          <div className="grid md:grid-cols-3 gap-8 mt-20">
             {[
               { icon: Fingerprint, name: 'Identity Binding', desc: 'Every agent has a unique cryptographic fingerprint.' },
               { icon: Shield, name: 'Runtime Policy', desc: 'Stop rogue tool calls before they execute.' },
               { icon: Activity, name: 'Budget Guards', desc: 'Set hard stops on LLM costs and API spend.' },
               { icon: FileCheck, name: 'Audit Provenance', desc: 'Immutable ledger for compliance and debugging.' },
               { icon: Lock, name: 'Zero-Trust Secrets', desc: 'Agents never see your raw API keys.' },
               { icon: Database, name: 'Smart Adapters', desc: 'Normalize API data for token efficiency.' },
             ].map((c, i) => {
               const Icon = c.icon;
               return (
                 <FU key={i} d={i * 0.05} className="obsidian-panel p-10 hover:border-primary/20 transition-all group">
                    <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-600 group-hover:text-primary mb-8">
                       <Icon size={20} />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-tight">{c.name}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{c.desc}</p>
                 </FU>
               );
             })}
          </div>
       </div>
    </section>

    {/* ══════════════════ CTA ══════════════════ */}
    <section className="py-60 bg-[#050505] border-t border-white/5">
       <div className="max-w-4xl mx-auto px-6 text-center">
          <FU d={0}>
             <h2 className="heading-precision text-6xl text-white mb-12 uppercase">
                SECURE YOUR<br />WORKFORCE.
             </h2>
             <Link to="/contact" className="btn-acid px-12 py-5">Request SDK Access</Link>
          </FU>
       </div>
    </section>
  </Layout>
);
