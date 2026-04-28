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
      serviceName="AgentIRL — Governance & Runtime Interception"
      serviceDescription="The production runtime for autonomous agents. Intercept tool calls, enforce policies, and record provenance without rewriting your code."
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
                <span className="text-zinc-700">INTERCEPTION.</span>
              </h1>
              <p className="heading-editorial text-3xl text-zinc-300 mt-8 max-w-xl">
                The definitive middleware layer between models and enterprise systems.
              </p>
            </FU>
            <FU d={0.2}>
              <p className="max-w-xl text-zinc-400 text-lg leading-relaxed">
                AgentIRL is the production runtime for autonomous agents. It wraps existing 
                frameworks to intercept every tool call, ensuring safety, budget, and identity.
              </p>
            </FU>
            <FU d={0.3} className="flex gap-6">
              <Link to="/contact" className="btn-acid">Request SDK Access</Link>
              <Link to="/enterprise" className="btn-obsidian">Compliance Matrix</Link>
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mt-20 border border-white/5 overflow-hidden">
          {[
            { t: 'Interception', d: 'Evaluates tool calls before they hit your production APIs.' },
            { t: 'Identity', d: 'Binds every action to a cryptographically verified agent fingerprint.' },
            { t: 'Budgeting', d: 'Enforces hard token and dollar limits at the runtime level.' },
            { t: 'Provenance', d: 'Records an immutable hash-chained ledger of every decision.' },
          ].map((f, i) => (
            <FU key={i} d={i * 0.05} className="bg-[#050505] p-12 space-y-8 group hover:bg-[#080808] transition-colors">
               <div className="font-mono text-[11px] text-primary uppercase font-bold tracking-[0.2em]">{f.t}</div>
               <p className="text-zinc-500 text-sm leading-relaxed">{f.d}</p>
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
                           <p className="text-zinc-500 text-sm leading-relaxed">{s.b}</p>
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

    {/* ══════════════════ 03: CAPABILITIES ══════════════════ */}
    <section className="py-40 bg-[#050505] relative">
       <div className="max-w-7xl mx-auto px-6">
          <Label>03 // PLATFORM ENGINES</Label>
          <div className="grid md:grid-cols-3 gap-8 mt-20">
             {[
               { icon: Fingerprint, name: 'Identity Binding', desc: 'Every agent has a unique cryptographic fingerprint.' },
               { icon: Shield, name: 'Runtime Policy', desc: 'Enforce tool permissions before they execute.' },
               { icon: Activity, name: 'Budget Guards', desc: 'Hard stops on LLM costs and API spend per task.' },
               { icon: FileCheck, name: 'Audit Ledger', desc: 'Immutable provenance for compliance and debugging.' },
               { icon: Lock, name: 'Zero-Trust Vault', desc: 'Credential injection at the moment of execution.' },
               { icon: Database, name: 'Smart Adapters', desc: 'Normalize API data for 94% token efficiency.' },
             ].map((c, i) => {
               const Icon = c.icon;
               return (
                 <FU key={i} d={i * 0.05} className="obsidian-panel p-12 group hover:border-primary/40 transition-all">
                    <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors mb-8">
                       <Icon size={24} />
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
    <section className="py-60 bg-[#050505] relative overflow-hidden text-center">
       <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FU d={0}>
             <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black">
                SECURE<br />WORKFORCE.
             </h2>
             <Link to="/contact" className="btn-acid px-16 py-6">Request Technical Specs</Link>
          </FU>
       </div>
    </section>
  </Layout>
);
