/**
 * Viktron AI — About Page
 * "The Foundation of Autonomous Intelligence."
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, Users, ShieldCheck, Zap, Globe, Cpu, ArrowRight,
  Layers, BrainCircuit, Database, GitBranch, Rocket, Shield,
  TrendingUp, CheckCircle2, Bot, Workflow, Eye, Sparkles, Activity
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

const stackLayers = [
  { label: 'Layer 5: Business Logic', desc: 'Pricing, brand voice, and domain constraints.', icon: Sparkles },
  { label: 'Layer 4: Agent Workforce', desc: 'Specialized Sales, Support, and Content agents.', icon: Bot },
  { label: 'Layer 3: AgentIRL Runtime', desc: 'Orchestration, reliability, and cost governance.', icon: BrainCircuit },
  { label: 'Layer 2: Agent Frameworks', desc: 'LangGraph, CrewAI, and custom orchestration.', icon: Layers },
  { label: 'Layer 1: Neural Compute', desc: 'GPT-4o, Claude 3.5, and Gemini Pro 1.5.', icon: Cpu },
];

export const About: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO title="About Viktron AI — The Foundation of Autonomous Intelligence" description="Viktron builds the infrastructure layer that makes AI agents reliable for production enterprise use cases." />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen bg-[#050505] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 text-center">
          <FU d={0}>
             <div className="flex justify-center mb-12">
                <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.3em] uppercase font-bold text-glow">
                   <div className="w-12 h-px bg-primary" />
                   PLATFORM_ORIGIN // v2.2
                   <div className="w-12 h-px bg-primary" />
                </div>
             </div>
          </FU>
          <FU d={0.1}>
            <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black">
              BEYOND THE<br />
              <span className="text-zinc-700">DEMO.</span>
            </h1>
            <p className="heading-editorial text-3xl md:text-4xl text-zinc-300 mt-12 max-w-3xl mx-auto">
              We build the infrastructure that makes AI agents production-ready.
            </p>
          </FU>
        </div>
      </section>

      {/* ══════════════════ THE PROBLEM ══════════════════ */}
      <section className="py-40 bg-[#080808] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <FU d={0}>
              <Label>THE PROBLEM</Label>
              <h2 className="heading-precision text-6xl text-white uppercase tracking-tighter mb-10 leading-[0.85]">The Production Gap.</h2>
              <div className="space-y-8 text-zinc-400 text-lg leading-relaxed">
                <p>
                  AI frameworks are powerful building blocks, but they aren't finished products. 
                  A business cannot deploy raw LLM workflows and expect institutional reliability.
                </p>
                <p>
                  The gap between a "cool demo" and "production scale" is massive: 
                  <span className="text-white"> reliability, error handling, cost governance, and compliance.</span> 
                  Most AI experiments fail because the operations layer is missing.
                </p>
                <p className="font-bold text-primary tracking-widest text-[10px] font-mono uppercase">
                  VIKTRON IS THE OPERATIONS LAYER.
                </p>
              </div>
            </FU>

            <FU d={0.2} className="relative group">
              <div className="obsidian-panel p-12 relative overflow-hidden shimmer">
                <div className="scan-line opacity-20" />
                <h3 className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest mb-10 font-bold">// THE_GOVERNANCE_STACK</h3>
                <div className="space-y-6">
                  {stackLayers.map((layer, i) => {
                    const Icon = layer.icon;
                    return (
                      <div key={i} className="flex gap-6 items-start group/item transition-all hover:translate-x-2">
                        <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-600 group-hover/item:text-primary">
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-white font-bold uppercase tracking-widest mb-1">{layer.label}</div>
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{layer.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════ AGENTIRL ══════════════════ */}
      <section className="py-40 bg-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <Label>THE FOUNDATION</Label>
            <h2 className="heading-precision text-6xl md:text-8xl text-white uppercase tracking-tighter leading-[0.85] mt-10">What is<br />AgentIRL?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-xl mt-10 font-light">
               The reliability layer for the autonomous era. It makes AI agents 
               safe for mission-critical enterprise deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Workflow, title: 'Unified Orchestration', desc: 'Coordinate agents across any framework into one single control plane.' },
              { icon: Shield, title: 'Reliability Engine', desc: 'Automatic retries, circuit breakers, and 99.9% uptime guarantees.' },
              { icon: Activity, title: 'Full Observability', desc: 'Real-time telemetry showing every action, decision, and spend record.' },
              { icon: Users, title: 'Approval Gates', desc: 'Configurable human-in-the-loop triggers for high-stakes decisions.' },
              { icon: Database, title: 'Global Shared State', desc: 'Update context once, and every agent knows instantly. No data silos.' },
              { icon: Target, title: 'Reasoning Audit', desc: 'Drill down into reasoning chains to eliminate hallucinations.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <FU key={i} d={i * 0.05} className="obsidian-panel p-12 space-y-8 group hover:border-primary/40 transition-all">
                  <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-white font-bold text-base uppercase tracking-tight">{f.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-widest font-mono">{f.desc}</p>
                </FU>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ VISION ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5 relative">
         <div className="max-w-7xl mx-auto px-6">
            <Label>VISION // 2026</Label>
            <div className="grid md:grid-cols-3 gap-12 mt-20">
               {[
                 { title: 'Hire Your Workforce', desc: 'coordinated agent teams that handle complex business functions from day one.', icon: Bot },
                 { title: 'The Control Plane', desc: 'Enterprises use AgentIRL to build their own custom autonomous systems.', icon: Layers },
                 { title: 'The Open Market', desc: 'A global marketplace where developers trade specialized agent nodes.', icon: Globe },
               ].map((v, i) => (
                 <FU key={i} d={i * 0.1} className="space-y-8">
                    <div className="text-zinc-800 font-black text-7xl italic leading-none opacity-20">0{i+1}</div>
                    <h3 className="text-white font-bold text-2xl uppercase tracking-tighter">{v.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{v.desc}</p>
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
                  BUILT TO<br />
                  LAST.
               </h2>
               <div className="flex flex-wrap justify-center gap-10">
                  <Link to="/contact" className="btn-acid px-16 py-6">Consult an Architect</Link>
                  <Link to="/use-cases" className="btn-obsidian px-16 py-6">Explore Utility</Link>
               </div>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
