/**
 * Viktron AI — Landing Page
 * "The Enterprise Control Plane For AI Agents."
 *
 * Design System: OBSIDIAN PRECISION v2.2 (UI PRO MAX)
 * Aesthetic: Institutional, Minimalist, Precision Infrastructure.
 * Palette: Obsidian, Bone, Acid Green.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, BarChart3, Server, CheckCircle2,
  Lock, Activity, Fingerprint, KeyRound,
  FileCheck, ShoppingBag, Zap, Database
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ─── ASSETS (Public Directory) ─────────────────────────────────────────────
const ASSETS = {
  hero: "/assets/branding/hero.png",
  moat: "/assets/branding/moat.png",
  cloud: "/assets/branding/cloud.png",
  analytics: "/assets/branding/analytics.png",
  marketplace: "/assets/branding/marketplace.png",
  ledger: "/assets/branding/ledger.png",
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-20px' }}
    transition={{ duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="section-label">{children}</div>
);

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

export const Landing: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO
        title="Viktron AI — The Enterprise Control Plane for AI Agents"
        description="Viktron provides the governance infrastructure to run autonomous AI agents safely at scale. AgentIRL Trust Fabric, Cloud Orchestration, and Real-time Analytics."
      />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen bg-[#050505] flex flex-col justify-center pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-20 items-center">
            
            <div className="space-y-12">
              <FU d={0}>
                <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.3em] uppercase font-bold text-glow">
                  <div className="w-12 h-px bg-primary" />
                  VIKTRON SYSTEM_STATUS // ACTIVE
                </div>
              </FU>

              <FU d={0.1}>
                <h1 className="heading-precision text-7xl md:text-8xl lg:text-[130px] text-white leading-[0.85] tracking-[-0.05em]">
                  AGENT<br />
                  <span className="text-zinc-400">CONTROL.</span>
                </h1>
                <p className="heading-editorial text-3xl md:text-4xl text-zinc-300 mt-8 max-w-xl">
                  The definitive infrastructure layer for autonomous enterprise intelligence.
                </p>
              </FU>

              <FU d={0.2}>
                <p className="max-w-xl text-zinc-400 text-lg leading-relaxed">
                  Viktron is an **Enterprise Control Plane**. We provide the governance 
                  interceptor that wraps your agent workforce in a secure, high-trust 
                  runtime with real-time policy enforcement.
                </p>
              </FU>

              <FU d={0.3}>
                <div className="flex flex-wrap items-center gap-6">
                  <Link to="/contact" className="btn-acid px-10 py-5">Request Technical Access</Link>
                  <Link to="/services/agentirl" className="btn-obsidian px-10 py-5 !text-white hover:!text-primary">System Architecture</Link>
                </div>
              </FU>
            </div>

            <FU d={0.4} className="relative group">
              <div className="obsidian-panel overflow-hidden aspect-[16/10] relative shimmer">
                <div className="scan-line" />
                <img src={ASSETS.hero} alt="Control Plane Interface" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40" />
                
                {/* Floating Meta HUD */}
                <div className="absolute top-8 right-8 p-4 glass-bone font-mono text-[10px] space-y-2">
                   <div className="flex justify-between gap-8 text-primary font-bold">
                      <span>LATENCY</span>
                      <span>2ms</span>
                   </div>
                   <div className="flex justify-between gap-8 text-zinc-300">
                      <span>CLUSTER</span>
                      <span>[V-PRD-01]</span>
                   </div>
                </div>
              </div>
              
              {/* Offset Detail Card */}
              <div className="absolute -bottom-10 -left-10 p-10 glass-bone max-w-[280px] hidden xl:block">
                 <div className="font-mono text-[10px] text-primary mb-4 tracking-widest uppercase font-bold text-glow">// GOVERNANCE_ACTIVE</div>
                 <p className="text-[11px] text-zinc-400 leading-relaxed mb-6">
                    Every tool call is intercepted and validated against corporate policy before execution.
                 </p>
                 <div className="h-0.5 bg-zinc-800 relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-primary"
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                 </div>
              </div>
            </FU>

          </div>
        </div>
      </section>

      {/* ══════════════════ 01: WHAT IT IS ══════════════════ */}
      <section className="py-40 bg-[#050505] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <Label>01 // THE INFRASTRUCTURE LAYER</Label>
          
          <div className="grid lg:grid-cols-2 gap-24 items-center mt-20">
            <FU d={0}>
              <h2 className="heading-precision text-6xl md:text-8xl text-white mb-10 uppercase tracking-tighter">
                The Trust<br />Fabric.
              </h2>
              <p className="text-zinc-300 text-xl leading-relaxed mb-12 font-light">
                AgentIRL™ is a **governance interceptor** that wraps your agent frameworks 
                (LangChain, CrewAI, AutoGen) in a secure "Trust Fabric". It stops 
                rogue actions before they execute.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-10">
                 {[
                   { t: 'Identity', d: 'Cryptographic binding for every agent.' },
                   { t: 'Policy', d: 'Real-time tool-call interception.' },
                   { t: 'Budget', d: 'Per-agent spend guardrails.' },
                   { t: 'Audit', d: 'Immutable SHA-256 provenance.' },
                 ].map((f, i) => (
                   <div key={i} className="space-y-3">
                      <div className="text-primary font-mono text-[11px] uppercase font-bold tracking-[0.2em]">{f.t}</div>
                      <p className="text-zinc-500 text-sm leading-relaxed">{f.d}</p>
                   </div>
                 ))}
              </div>
            </FU>

            <FU d={0.2}>
              <div className="obsidian-panel p-3 relative group overflow-hidden shimmer">
                <img src={ASSETS.moat} alt="Infrastructure" className="w-full h-full object-cover grayscale brightness-90 group-hover:brightness-110 transition-all duration-1000" />
                <div className="absolute inset-0 acid-glow opacity-20 pointer-events-none" />
                <div className="absolute top-6 left-6 font-mono text-[9px] text-primary/60 tracking-widest uppercase">// SECURE_CORE_v4.2</div>
              </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════ 02: HOW IT WORKS ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <Label>02 // ENFORCEMENT LAYERS</Label>
          
          <FU d={0} className="text-center mb-24">
             <h2 className="heading-precision text-6xl md:text-9xl text-white uppercase tracking-tighter leading-[0.85]">
                The 6-Layer<br />Shield.
             </h2>
             <p className="text-zinc-400 text-xl mt-8 max-w-2xl mx-auto font-light">
                Viktron intercepts agent actions across six independently enforced layers, 
                ensuring institutional-grade reliability at scale.
             </p>
          </FU>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Identity', icon: Fingerprint, desc: 'Verified cryptographic identity bound to every action token.' },
              { name: 'Delegation', icon: KeyRound, desc: 'Scoped JWTs that restrict permissions as tasks evolve.' },
              { name: 'Policy Gate', icon: Shield, desc: 'Sub-50ms interception of tool calls against corporate rules.' },
              { name: 'Budget', icon: Activity, desc: 'Per-agent token and API spend cap enforcement.' },
              { name: 'Secrets', icon: Lock, desc: 'Zero-trust injection of API keys at tool-call runtime.' },
              { name: 'Provenance', icon: FileCheck, desc: 'Immutable chain of every decision, reason, and action.' },
            ].map((l, i) => {
              const Icon = l.icon;
              return (
                <FU key={i} d={i * 0.05} className="obsidian-panel p-10 h-full space-y-8 group hover:border-primary/50 transition-all">
                   <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                     <Icon size={24} />
                   </div>
                   <h4 className="text-white font-bold text-base tracking-tight uppercase">{l.name}</h4>
                   <p className="text-zinc-500 text-sm leading-relaxed">{l.desc}</p>
                </FU>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ 03: PLATFORM ══════════════════ */}
      <section className="py-40 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto px-6">
          <Label>03 // CORE INFRASTRUCTURE</Label>
          
          <div className="space-y-40 mt-32">
            {/* Viktron Cloud */}
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <FU d={0}>
                  <h3 className="text-primary font-mono text-[11px] uppercase tracking-[0.4em] mb-6 font-bold">// DEPLOY_SCALE_ORCHESTRATE</h3>
                  <h2 className="heading-precision text-6xl text-white mb-8 uppercase tracking-tighter">Viktron Cloud.</h2>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                     Scale your agent workforce across 100+ enterprise integrations. 
                     Multi-agent task queues with auto-scaling runtimes and intelligent LLM cost routing.
                  </p>
                  <Link to="/enterprise" className="btn-obsidian text-[11px]">System Status: Online</Link>
               </FU>
               <FU d={0.1}>
                  <div className="obsidian-panel overflow-hidden border-primary/20 relative group shimmer">
                     <img src={ASSETS.cloud} alt="Viktron Cloud" className="w-full h-[400px] object-cover grayscale brightness-50 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
                  </div>
               </FU>
            </div>

            {/* AI Analytics */}
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <FU d={0} className="order-2 lg:order-1">
                  <div className="obsidian-panel overflow-hidden border-primary/20 shimmer">
                     <img src={ASSETS.analytics} alt="Analytics" className="w-full h-[400px] object-cover" />
                  </div>
               </FU>
               <FU d={0.1} className="order-1 lg:order-2">
                  <h3 className="text-primary font-mono text-[11px] uppercase tracking-[0.4em] mb-6 font-bold">// OBSERVE_REPLAY_IMPROVE</h3>
                  <h2 className="heading-precision text-6xl text-white mb-8 uppercase tracking-tighter">AI Analytics.</h2>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                     Full-fidelity session replay and real-time OTLP telemetry. See exactly 
                     what your agents saw and audit reasoning chains to eliminate hallucinations.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="obsidian-panel p-6 border-l-primary border-l-2">
                        <div className="text-3xl font-bold text-white mb-1 tracking-tighter">99.9%</div>
                        <div className="text-[10px] text-zinc-600 uppercase tracking-widest">Observability</div>
                     </div>
                     <div className="obsidian-panel p-6 border-l-primary border-l-2">
                        <div className="text-3xl font-bold text-primary mb-1 tracking-tighter">&lt;50ms</div>
                        <div className="text-[10px] text-zinc-600 uppercase tracking-widest">Telemetry Lag</div>
                     </div>
                  </div>
               </FU>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ 04: MARKETPLACE ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-[1fr_1.4fr] gap-24 items-center">
              <div>
                 <Label>04 // RENTAL WORKFORCE</Label>
                 <h2 className="heading-precision text-6xl text-white mb-10 uppercase tracking-tighter">Rent Your<br />Workforce.</h2>
                 <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                    Access the Viktron Marketplace to rent pre-configured, specialized 
                    agents—Sales, DevOps, Legal—that run securely within your VPC 
                    under our Trust Fabric governance.
                 </p>
                 <Link to="/rent-agent" className="btn-acid flex items-center justify-center gap-3 py-6">
                    <ShoppingBag size={18} /> Browse Marketplace
                 </Link>
              </div>
              <FU d={0.2}>
                 <div className="obsidian-panel overflow-hidden aspect-[16/10] shimmer group">
                    <img src={ASSETS.marketplace} alt="Marketplace" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-1000" />
                 </div>
              </FU>
           </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="py-60 bg-[#050505] relative overflow-hidden text-center">
        <div className="absolute inset-0 grid-paper opacity-[0.03] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FU d={0}>
            <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter leading-[0.8] font-black">
               DEPLOY<br />TRUST.
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-10">
              <Link to="/contact" className="btn-acid px-16 py-6 text-sm">Request Technical Briefing</Link>
              <Link to="/enterprise" className="btn-obsidian px-16 py-6 text-sm">System Specs</Link>
            </div>
            <div className="mt-24 flex flex-wrap justify-center gap-16 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] font-bold">
              <span className="flex items-center gap-2 text-primary/80"><Shield size={12} /> SOC 2 READY</span>
              <span className="flex items-center gap-2"><Lock size={12} /> ZERO-TRUST</span>
              <span className="flex items-center gap-2"><Activity size={12} /> OTLP NATIVE</span>
            </div>
          </FU>
        </div>
      </section>
    </Layout>
  );
};
