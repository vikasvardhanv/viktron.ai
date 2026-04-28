/**
 * Viktron AI — Landing Page
 * "The Enterprise Control Plane For AI Agents."
 *
 * Design System: OBSIDIAN PRECISION (God-Level 2.1)
 * Aesthetic: Institutional, Minimalist, Precision Infrastructure.
 * Palette: Obsidian, Bone, Acid Green.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, BarChart3, Server, CheckCircle2,
  Lock, Activity, Fingerprint, KeyRound,
  FileCheck, Globe, ShoppingBag
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ─── ASSETS ──────────────────────────────────────────────────────────────────
const ASSETS = {
  hero: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/viktron_editorial_obsidian_ui_1777350115611.png",
  moat: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/agentirl_brutalist_infrastructure_1777350129546.png",
  cloud: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/viktron_cloud_orchestration_visual_1777351348062.png",
  analytics: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/ai_analytics_telemetry_visual_1777351362088.png",
  marketplace: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/agent_marketplace_visual_1777351374273.png",
  ledger: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/provenance_ledger_abstract_1777348980017.png",
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-20px' }}
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

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

export const Landing: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO
        title="Viktron AI — The Enterprise Control Plane for AI Agents"
        description="Viktron provides the governance infrastructure to run autonomous AI agents safely at scale. AgentIRL Trust Fabric, Cloud Orchestration, and Real-time Analytics."
      />

      {/* ═══════════════════════════ HERO: WHAT WE DO ═══════════════════════════ */}
      <section className="relative min-h-screen bg-[#050505] flex flex-col justify-center pt-24 pb-20">
        <div className="absolute inset-0 grid-paper opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-20 items-center">
            
            <div className="space-y-12">
              <FU d={0}>
                <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.2em] uppercase">
                  <div className="w-8 h-px bg-primary" />
                  VIKTRON AI // SYSTEM_STATUS: OPERATIONAL
                </div>
              </FU>

              <FU d={0.1}>
                <h1 className="heading-precision text-6xl md:text-8xl lg:text-[110px] text-white">
                  AGENT<br />
                  <span className="text-muted">CONTROL.</span>
                </h1>
                <p className="heading-editorial text-3xl text-zinc-300 mt-6 max-w-xl">
                  We build the infrastructure that makes autonomous AI safe for production.
                </p>
              </FU>

              <FU d={0.2}>
                <p className="max-w-xl text-zinc-400 text-base leading-relaxed">
                  Viktron is an **Enterprise Control Plane**. While others help you build agents, 
                  we provide the governance layer—intercepting every tool call and reason 
                  to ensure security, compliance, and budget adherence.
                </p>
              </FU>

              <FU d={0.3}>
                <div className="flex flex-wrap items-center gap-6">
                  <Link to="/contact" className="btn-acid px-8 py-4">Request Access</Link>
                  <Link to="/services/agentirl" className="btn-obsidian px-8 py-4 border-white/20">Read Technical Specs</Link>
                </div>
              </FU>
            </div>

            <FU d={0.4} className="relative">
              <div className="obsidian-panel overflow-hidden aspect-[16/10] relative group">
                <img src={ASSETS.hero} alt="Control Plane Interface" className="w-full h-full object-cover opacity-90 grayscale group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-sm bg-black/80 border border-white/10 backdrop-blur-md">
                   <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                   <span className="font-mono text-[9px] text-primary font-bold uppercase">Live Telemetry</span>
                </div>
              </div>
            </FU>

          </div>
        </div>
      </section>

      {/* ══════════════════ WHAT IT IS: INFRASTRUCTURE ══════════════════ */}
      <section className="py-40 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Label>01 // WHAT IT IS</Label>
          
          <div className="grid lg:grid-cols-2 gap-24 items-start mt-20">
            <FU d={0}>
              <h2 className="heading-precision text-5xl md:text-7xl text-white mb-10">
                The Trust Fabric.
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                AgentIRL™ is our proprietary moat. It is a **governance interceptor** that wraps your 
                agent frameworks (LangChain, CrewAI, AutoGen) in a secure "Trust Fabric". 
                It prevents rogue actions before they execute, providing SOC 2 proof for every agent decision.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                 {[
                   { t: 'Identity', d: 'Cryptographic identity for every agent.' },
                   { t: 'Policy', d: 'Real-time tool-call interception.' },
                   { t: 'Budget', d: 'Per-agent spend guardrails.' },
                   { t: 'Audit', d: 'Immutable SHA-256 provenance.' },
                 ].map((f, i) => (
                   <div key={i} className="space-y-2">
                      <div className="text-primary font-mono text-[10px] uppercase font-bold tracking-widest">{f.t}</div>
                      <p className="text-zinc-500 text-xs leading-relaxed">{f.d}</p>
                   </div>
                 ))}
              </div>
            </FU>

            <FU d={0.2}>
              <div className="obsidian-panel p-2 relative group">
                <img src={ASSETS.moat} alt="Infrastructure" className="w-full h-full object-cover grayscale brightness-75 group-hover:brightness-100 transition-all duration-1000" />
                <div className="absolute inset-0 acid-glow opacity-10 pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 p-6 obsidian-panel glass-bone max-w-[200px]">
                  <p className="text-[10px] font-mono text-zinc-400 italic">"The definitive layer for autonomous enterprise risk management."</p>
                </div>
              </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS: THE 6-LAYER SHIELD ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Label>02 // HOW IT WORKS</Label>
          
          <FU d={0} className="text-center mb-24">
             <h2 className="heading-precision text-5xl md:text-8xl text-white uppercase tracking-tighter">
                The 6-Layer<br />Shield.
             </h2>
             <p className="text-zinc-500 text-lg mt-6 max-w-2xl mx-auto">
                Viktron intercepts agent actions across six independently enforced layers.
                Execution is only granted when all six layers return a SHA-256 verified token.
             </p>
          </FU>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Identity', icon: Fingerprint, desc: 'Verified cryptographic identity bound to agent token.' },
              { name: 'Delegation', icon: KeyRound, desc: 'Scoped JWTs that restrict permissions as tasks evolve.' },
              { name: 'Policy Gate', icon: Shield, desc: 'Interception of tool calls against enterprise rules.' },
              { name: 'Budget Envelope', icon: Activity, desc: 'Per-agent token and API spend cap enforcement.' },
              { name: 'Secrets Vault', icon: Lock, desc: 'Zero-trust injection of API keys at tool-call runtime.' },
              { name: 'Provenance', icon: FileCheck, desc: 'Immutable chain of every decision, reason, and action.' },
            ].map((l, i) => {
              const Icon = l.icon;
              return (
                <FU key={i} d={i * 0.05}>
                   <div className="obsidian-panel p-8 h-full space-y-6 hover:border-primary/30 transition-colors group">
                      <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-600 group-hover:text-primary">
                        <Icon size={20} />
                      </div>
                      <h4 className="text-white font-bold text-sm tracking-tight uppercase">{l.name}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{l.desc}</p>
                   </div>
                </FU>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ PRODUCT DEEP-DIVE ══════════════════ */}
      <section className="py-40 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <Label>03 // THE PLATFORM</Label>
          
          <div className="space-y-32 mt-20">
            {/* AgentIRL */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <FU d={0} className="order-2 lg:order-1">
                  <div className="obsidian-panel overflow-hidden border-primary/20">
                     <img src={ASSETS.moat} alt="AgentIRL" className="w-full h-64 object-cover" />
                     <div className="p-8">
                        <div className="text-primary font-mono text-[10px] uppercase font-bold mb-4">Core Interceptor</div>
                        <h3 className="heading-precision text-4xl text-white mb-6 uppercase">AgentIRL™</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                           The heart of the control plane. AgentIRL intercepts agent intent at the reasoning layer 
                           and validates it against cryptographic identity and corporate policy before execution.
                        </p>
                        <Link to="/services/agentirl" className="btn-obsidian text-[10px]">Technical Documentation</Link>
                     </div>
                  </div>
               </FU>
               <FU d={0.1} className="order-1 lg:order-2">
                  <h3 className="text-zinc-600 font-mono text-[12px] uppercase tracking-[0.5em] mb-4">INTERCEPT_VALIDATE_CHAIN</h3>
                  <h2 className="heading-precision text-5xl text-white mb-8">The Governance<br />Engine.</h2>
                  <ul className="space-y-4">
                     {['Real-time interception', 'SOC 2 compliant logs', 'Policy as Code', 'Human-in-loop triggers'].map(t => (
                       <li key={t} className="flex items-center gap-3 text-zinc-400 text-sm">
                          <CheckCircle2 size={14} className="text-primary" />
                          {t}
                       </li>
                     ))}
                  </ul>
               </FU>
            </div>

            {/* Viktron Cloud */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <FU d={0}>
                  <h3 className="text-zinc-600 font-mono text-[12px] uppercase tracking-[0.5em] mb-4">DEPLOY_SCALE_ORCHESTRATE</h3>
                  <h2 className="heading-precision text-5xl text-white mb-8">Viktron Cloud<br />Infrastructure.</h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                     Scale your agent workforce across 100+ enterprise integrations. 
                     Multi-agent task queues with auto-scaling runtimes and intelligent LLM cost routing.
                  </p>
                  <Link to="/enterprise" className="btn-obsidian text-[10px]">Cloud Infrastructure Stats</Link>
               </FU>
               <FU d={0.1}>
                  <div className="obsidian-panel overflow-hidden border-primary/20 relative group">
                     <img src={ASSETS.cloud} alt="Viktron Cloud" className="w-full h-80 object-cover grayscale brightness-50 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                     <div className="absolute bottom-8 left-8">
                        <div className="font-mono text-[10px] text-primary">100+ INTEGRATIONS ACTIVE</div>
                     </div>
                  </div>
               </FU>
            </div>

            {/* AI Analytics */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <FU d={0} className="order-2 lg:order-1">
                  <div className="obsidian-panel overflow-hidden border-primary/20">
                     <img src={ASSETS.analytics} alt="Analytics" className="w-full h-80 object-cover" />
                  </div>
               </FU>
               <FU d={0.1} className="order-1 lg:order-2">
                  <h3 className="text-zinc-600 font-mono text-[12px] uppercase tracking-[0.5em] mb-4">OBSERVE_REPLAY_IMPROVE</h3>
                  <h2 className="heading-precision text-5xl text-white mb-8">Full-Fidelity<br />AI Analytics.</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                     See exactly what your agents see. Real-time OTLP telemetry and per-session replay of every decision. 
                     Audit reasoning chains to eliminate hallucinations and improve accuracy.
                  </p>
                  <div className="flex gap-4">
                     <div className="text-center p-4 bg-white/5 border border-white/10 flex-1">
                        <div className="text-2xl font-bold text-white">99.9%</div>
                        <div className="text-[9px] text-muted uppercase">Observability</div>
                     </div>
                     <div className="text-center p-4 bg-white/5 border border-white/10 flex-1">
                        <div className="text-2xl font-bold text-primary">&lt;50ms</div>
                        <div className="text-[9px] text-muted uppercase">Telemetry Lag</div>
                     </div>
                  </div>
               </FU>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ MARKETPLACE: RENT AGENTS ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 items-center">
              <div>
                 <Label>04 // CAPABILITIES</Label>
                 <h2 className="heading-precision text-5xl text-white mb-8 uppercase">Rent Your<br />Workforce.</h2>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                    Need a Sales agent for lead qualification? A DevOps agent for CI/CD? 
                    Access the Viktron Marketplace to rent pre-configured, highly specialized 
                    agents that run securely in your VPC.
                 </p>
                 <Link to="/rent-agent" className="btn-acid flex items-center justify-center gap-2">
                    <ShoppingBag size={14} /> Browse Marketplace
                 </Link>
              </div>
              <FU d={0.2}>
                 <div className="obsidian-panel overflow-hidden aspect-[16/9]">
                    <img src={ASSETS.marketplace} alt="Marketplace" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" />
                 </div>
              </FU>
           </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="py-60 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.02] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FU d={0}>
            <h2 className="heading-precision text-6xl md:text-9xl text-white mb-12">
               START<br />DEVOPSing.
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <Link to="/contact" className="btn-acid px-12 py-5 text-sm">Request Technical Access</Link>
              <Link to="/enterprise" className="btn-obsidian px-12 py-5 text-sm border-white/20">Talk to Engineering</Link>
            </div>
          </FU>
        </div>
      </section>
    </Layout>
  );
};
