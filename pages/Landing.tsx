/**
 * Viktron AI — Landing Page
 * "The Enterprise Control Plane For AI Agents."
 *
 * Design System: OBSIDIAN PRECISION (God-Level 2.0)
 * Aesthetic: Institutional, Minimalist, Precision Infrastructure.
 * Palette: Obsidian, Bone, Acid Green.
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, BarChart3, Server, CheckCircle2,
  ChevronRight, Lock, Activity, Fingerprint, KeyRound,
  FileCheck, AlertTriangle, DollarSign, Globe, Zap, Database
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ─── ASSETS ──────────────────────────────────────────────────────────────────
const ASSETS = {
  hero: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/viktron_editorial_obsidian_ui_1777350115611.png",
  moat: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/agentirl_brutalist_infrastructure_1777350129546.png",
  ledger: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/provenance_ledger_abstract_1777348980017.png",
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

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
  <div className="section-label">{children}</div>
);

// ─── VISUALS ──────────────────────────────────────────────────────────────────

const ControlPlaneHUD: React.FC = () => {
  return (
    <div className="relative w-full aspect-[16/10] obsidian-panel overflow-hidden">
      <div className="scan-line" />
      <img src={ASSETS.hero} alt="Control Plane" className="w-full h-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      
      {/* HUD Metadata Overlay */}
      <div className="absolute top-6 left-6 font-mono text-[9px] text-muted space-y-1">
        <div>LATENCY: 2ms</div>
        <div>REGION: US-EAST-1</div>
        <div>CLUSTER: [VIK-PROD-09]</div>
      </div>
      
      <div className="absolute bottom-6 right-6 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
          <span className="font-mono text-[9px] text-primary uppercase font-bold">System Nominal</span>
        </div>
      </div>
    </div>
  );
};

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

export const Landing: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO
        title="Viktron AI — Enterprise Control Plane"
        description="The infrastructure layer for autonomous AI agents. AgentIRL Trust Fabric, Viktron Cloud, and AI Analytics."
      />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen bg-[#050505] flex flex-col justify-center pt-24 pb-20">
        <div className="absolute inset-0 grid-paper opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-20 items-center">
            
            <div className="space-y-10">
              <FU d={0}>
                <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.2em] uppercase">
                  <div className="w-8 h-px bg-primary" />
                  VIKTRON AI CONTROL PLANE v2.0
                </div>
              </FU>

              <FU d={0.1}>
                <h1 className="heading-precision text-6xl md:text-8xl lg:text-[120px] text-white">
                  AGENT<br />
                  <span className="text-muted">CONTROL.</span>
                </h1>
                <p className="heading-editorial text-3xl text-zinc-400 mt-4">
                  The infrastructure layer for autonomous enterprise intelligence.
                </p>
              </FU>

              <FU d={0.2}>
                <p className="max-w-xl text-zinc-500 text-sm leading-relaxed">
                  LangChain is for builders. Viktron is for production. 
                  Wrap your agent workforce in a secure, high-trust control plane 
                  with cryptographic identity and real-time policy enforcement.
                </p>
              </FU>

              <FU d={0.3}>
                <div className="flex items-center gap-6">
                  <Link to="/contact" className="btn-acid">Book Technical Demo</Link>
                  <Link to="/services/agentirl" className="btn-obsidian">View Documentation</Link>
                </div>
              </FU>
            </div>

            <FU d={0.4} className="relative">
              <ControlPlaneHUD />
              <div className="absolute -bottom-10 -left-10 p-8 obsidian-panel max-w-[240px] hidden xl:block">
                <div className="font-mono text-[10px] text-primary mb-4">// TRUST_FABRIC_ENFORCEMENT</div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[9px] text-muted uppercase">
                    <span>Identity Verification</span>
                    <span className="text-primary">100%</span>
                  </div>
                  <div className="h-0.5 bg-white/5 relative">
                    <div className="absolute inset-y-0 left-0 bg-primary w-full" />
                  </div>
                  <p className="text-[10px] text-zinc-600 leading-relaxed">
                    Cryptographic tokens verified across 64 global nodes in &lt;14ms.
                  </p>
                </div>
              </div>
            </FU>

          </div>
        </div>
      </section>

      {/* ══════════════════ THE MOAT ══════════════════ */}
      <section className="py-40 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Label>01 // THE PRIMARY MOAT</Label>
          
          <div className="grid lg:grid-cols-2 gap-24 items-center mt-20">
            <FU d={0}>
              <h2 className="heading-precision text-5xl md:text-7xl text-white mb-8">
                AgentIRL™<br />
                Trust Fabric.
              </h2>
              <p className="heading-editorial text-2xl text-zinc-400 mb-10">
                Governance as Code for the autonomous era.
              </p>
              <div className="space-y-12">
                {[
                  { t: 'Pre-Action Policy Interception', d: 'Rules are evaluated before execution, not after. No rogue tool calls.' },
                  { t: 'Attenuated Delegation', d: 'JWT-based tokens that restrict scope as agents spawn sub-tasks.' },
                  { t: 'Permanent Provenance', d: 'A hash-chained ledger of every decision, reason, and action.' },
                ].map((item, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex items-center gap-4 text-xs font-bold text-white mb-3 tracking-tight">
                      <div className="w-1.5 h-1.5 bg-zinc-800 group-hover:bg-primary transition-colors" />
                      {item.t}
                    </div>
                    <p className="pl-6 text-sm text-zinc-600 leading-relaxed max-w-md">{item.d}</p>
                  </div>
                ))}
              </div>
            </FU>

            <FU d={0.2}>
              <div className="relative aspect-square obsidian-panel p-4">
                <img src={ASSETS.moat} alt="Infrastructure" className="w-full h-full object-cover grayscale brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                <div className="absolute inset-0 acid-glow opacity-20 pointer-events-none" />
              </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════ PLATFORM ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Label>02 // THE INFRASTRUCTURE ENGINES</Label>
          
          <div className="grid md:grid-cols-3 gap-px bg-white/5 mt-20 border border-white/5 overflow-hidden">
            {[
              {
                name: 'AgentIRL',
                tag: 'Governance',
                desc: 'The runtime interceptor. Enforces policies, verifies identity, and records provenance.',
                icon: Shield,
              },
              {
                name: 'Viktron Cloud',
                tag: 'Orchestration',
                desc: 'Scale agents across 100+ integrations with auto-scaling task queues and cost routing.',
                icon: Server,
              },
              {
                name: 'AI Analytics',
                tag: 'Observability',
                desc: 'Full session replay. See what agents saw and why they chose their actions.',
                icon: BarChart3,
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <FU key={i} d={i * 0.1} className="bg-[#080808] p-12 space-y-8 group transition-all duration-500 hover:bg-[#0A0A0A]">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors">
                      <Icon size={20} />
                    </div>
                    <div className="font-mono text-[9px] text-muted tracking-widest uppercase">{p.tag}</div>
                  </div>
                  <div>
                    <h3 className="heading-precision text-3xl text-white mb-4 uppercase tracking-tighter">{p.name}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="pt-6">
                    <Link to="/enterprise" className="font-mono text-[10px] text-zinc-500 hover:text-primary transition-colors flex items-center gap-2">
                      LEARN_MORE <ArrowRight size={12} />
                    </Link>
                  </div>
                </FU>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ DIFFERENTIATOR ══════════════════ */}
      <section className="py-40 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FU d={0}>
            <Label>03 // THE DIFFERENTIATOR</Label>
            <h2 className="heading-precision text-5xl md:text-7xl text-white mt-12 mb-8 uppercase tracking-tighter">
              BEYOND THE<br />
              FRAMEWORK.
            </h2>
            <p className="heading-editorial text-2xl text-zinc-500 mb-20">
              Why frameworks alone fail in the enterprise.
            </p>
          </FU>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <FU d={0.1} className="obsidian-panel p-10 border-l-acid">
              <h4 className="font-mono text-[10px] text-primary mb-6 tracking-widest uppercase">The Framework Issue</h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Libraries like LangChain live inside your application code. 
                They have no external authority to stop a rogue tool call or data leak 
                once the LLM triggers it.
              </p>
              <div className="text-[10px] font-mono text-muted uppercase">Risk: Data Poisoning / Runaway Spend</div>
            </FU>
            <FU d={0.2} className="obsidian-panel p-10 border-l-primary">
              <h4 className="font-mono text-[10px] text-primary mb-6 tracking-widest uppercase">The Viktron Solution</h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Viktron sits at the network and runtime layer. We intercept calls 
                *between* the agent and the world, providing an immutable audit trail 
                and a permanent "Kill Switch" for every tool.
              </p>
              <div className="text-[10px] font-mono text-primary uppercase">Benefit: SOC 2 / Institutional Trust</div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="py-60 bg-[#050505] border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.02] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FU d={0}>
            <h2 className="heading-precision text-6xl md:text-8xl text-white mb-12">
              DEPLOY<br />
              TRUST.
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <Link to="/contact" className="btn-acid px-12">Get Technical Access</Link>
              <Link to="/rent-agent" className="btn-obsidian px-12">Browse Registry</Link>
            </div>
            <div className="mt-20 flex flex-wrap justify-center gap-12 text-[9px] font-mono text-muted uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2 text-primary/60"><Shield size={10} /> SOC 2</span>
              <span className="flex items-center gap-2"><Lock size={10} /> ZERO-TRUST</span>
              <span className="flex items-center gap-2"><Activity size={10} /> OTLP NATIVE</span>
            </div>
          </FU>
        </div>
      </section>
    </Layout>
  );
};
