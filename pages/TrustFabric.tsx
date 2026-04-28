/**
 * Viktron AI — Trust Fabric Page
 * "Governance as Code for the autonomous era."
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, Lock, CheckCircle2, FileCheck, Key,
  Activity, Fingerprint, Database, Zap, Layers
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ServiceSEO } from '../components/ui/SEO';

// ─── ASSETS (Public Directory) ─────────────────────────────────────────────
const ASSETS = {
  shield: "/assets/branding/shield.png",
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

export const TrustFabric: React.FC = () => (
  <Layout showBackground={false}>
    <ServiceSEO
      serviceName="AgentIRL Trust Fabric — Enterprise Governance"
      serviceDescription="The 6-layer security stack for autonomous agents. Cryptographic identity, policy enforcement, and immutable provenance."
    />

    {/* ═══════════════════════════ HERO ═══════════════════════════ */}
    <section className="relative min-h-[90vh] bg-[#050505] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-20 items-center">
          <div className="space-y-12">
            <FU d={0}>
              <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.3em] uppercase font-bold text-glow">
                <div className="w-12 h-px bg-primary" />
                SECURITY_ARCHITECTURE // LAYER_06
              </div>
            </FU>
            <FU d={0.1}>
              <h1 className="heading-precision text-7xl md:text-8xl text-white leading-[0.85] tracking-[-0.04em]">
                THE TRUST<br />
                <span className="text-zinc-700">FABRIC.</span>
              </h1>
              <p className="heading-editorial text-3xl text-zinc-300 mt-8 max-w-xl">
                Cryptographic governance for every agent decision.
              </p>
            </FU>
            <FU d={0.2}>
              <p className="max-w-xl text-zinc-400 text-lg leading-relaxed">
                The Trust Fabric is a 6-layer security stack that intercepts agent actions 
                to ensure SOC 2 compliance and institutional-grade risk management.
              </p>
            </FU>
            <FU d={0.3} className="flex gap-6">
              <Link to="/contact" className="btn-acid">CISO Security Brief</Link>
              <Link to="/enterprise" className="btn-obsidian">Governance Specs</Link>
            </FU>
          </div>
           <FU d={0.4} className="relative group">
              <div className="obsidian-panel p-16 flex items-center justify-center relative shimmer">
                 <div className="scan-line opacity-30" />
                 <img src={ASSETS.shield} alt="Trust Shield" loading="lazy" width="512" height="512" className="w-full h-full object-contain grayscale brightness-90 animate-float group-hover:brightness-110 transition-all duration-1000" />
                 <div className="absolute inset-0 acid-glow opacity-10 pointer-events-none" />
              </div>
           </FU>
        </div>
      </div>
    </section>

    {/* ══════════════════ 01: THE 6 LAYERS ══════════════════ */}
    <section className="py-40 bg-[#050505] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <Label>01 // ENFORCEMENT PILLARS</Label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {[
            { 
              name: 'IDENTITY BINDING', 
              desc: 'Every agent has a unique cryptographic fingerprint.',
              img: '/assets/images/trust/identity.png',
              active: true 
            },
            { 
              name: 'RUNTIME POLICY', 
              desc: 'Enforce tool permissions before they execute.',
              img: '/assets/images/trust/policy.png'
            },
            { 
              name: 'BUDGET GUARDS', 
              desc: 'Hard stops on LLM costs and API spend per task.',
              img: '/assets/images/trust/budget.png'
            },
            { 
              name: 'AUDIT LEDGER', 
              desc: 'Immutable provenance for compliance and debugging.',
              img: '/assets/images/trust/ledger.png'
            },
            { 
              name: 'ZERO-TRUST VAULT', 
              desc: 'Credential injection at the moment of execution.',
              img: '/assets/images/trust/vault.png'
            },
            { 
              name: 'SMART ADAPTERS', 
              desc: 'Normalize API data for 94% token efficiency.',
              img: '/assets/images/trust/adapters.png'
            },
          ].map((l, i) => (
            <FU key={i} d={i * 0.05} className={`obsidian-panel p-0 overflow-hidden group hover:scale-[1.02] transition-all duration-500 ${l.active ? 'border-primary/20 bg-primary/[0.01]' : ''}`}>
               <div className="aspect-[4/3] overflow-hidden relative border-b border-white/5">
                  <img src={l.img} alt={l.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-40" />
                  {l.active && <div className="absolute top-4 right-4 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-mono text-[8px] uppercase tracking-widest animate-pulse">Active_Layer</div>}
               </div>
               <div className="p-8 space-y-4">
                 <h4 className="text-white font-bold text-lg uppercase tracking-tight group-hover:text-primary transition-colors">{l.name}</h4>
                 <p className="text-zinc-500 text-sm leading-relaxed font-light">{l.desc}</p>
               </div>
            </FU>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════ 02: THE NECESSITY ══════════════════ */}
    <section className="py-40 bg-[#080808] border-y border-white/5 relative overflow-hidden">
       <div className="max-w-7xl mx-auto px-6">
          <Label>02 // INSTITUTIONAL TRUST</Label>
          <div className="grid lg:grid-cols-2 gap-24 items-center mt-20">
             <FU d={0}>
                <h2 className="heading-precision text-6xl text-white mb-10 uppercase tracking-tighter">Beyond the<br />Prompt.</h2>
                <p className="text-zinc-300 text-xl leading-relaxed mb-12 font-light">
                   Prompt engineering is not security. Trust Fabric moves governance 
                   to the infrastructure layer, ensuring institutional boundaries 
                   cannot be violated by model output.
                </p>
                <div className="grid sm:grid-cols-2 gap-10">
                   {[
                     { t: 'SOC 2 Ready', d: 'Automated audit evidence generation.' },
                     { t: 'Risk-Aware', d: 'Human-in-loop approval triggers.' },
                     { t: 'Multi-Cloud', d: 'Deploy on-prem or across any VPC.' },
                     { t: 'Immutable', d: 'SHA-256 chain provenance.' },
                   ].map((item, i) => (
                     <div key={i} className="space-y-3">
                        <div className="text-primary font-mono text-[11px] uppercase font-bold tracking-[0.2em]">{item.t}</div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{item.d}</p>
                     </div>
                   ))}
                </div>
             </FU>
             <FU d={0.2} className="obsidian-panel p-16 bg-[#050505] relative shimmer">
                <div className="scan-line opacity-20" />
                <h4 className="font-mono text-[10px] text-primary mb-10 tracking-[0.3em] uppercase font-bold text-glow">// PROVENANCE_STREAM</h4>
                <div className="space-y-6 font-mono text-[11px]">
                   {[
                     { l: 'IDENTITY_TOKEN_VERIFIED', s: 'text-primary' },
                     { l: 'POLICY_EVAL_GRANTED', s: 'text-primary' },
                     { l: 'BUDGET_RESERVE_ACTIVE', s: 'text-primary' },
                     { l: 'CREDENTIAL_SCOPED_INJECT', s: 'text-primary' },
                     { l: 'LEDGER_ENTRY_RECORDED', s: 'text-zinc-700' },
                   ].map((log, i) => (
                     <div key={i} className="flex gap-6">
                        <span className="text-zinc-500">[{2840 + i}]</span>
                        <span className={log.l === 'LEDGER_ENTRY_RECORDED' ? 'text-zinc-400' : 'text-primary'}>{log.l}</span>
                     </div>
                   ))}
                </div>
             </FU>
          </div>
       </div>
    </section>

    {/* ══════════════════ CTA ══════════════════ */}
    <section className="py-60 bg-[#050505] text-center relative overflow-hidden">
       <div className="absolute inset-0 grid-paper opacity-[0.03] pointer-events-none" />
       <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FU d={0}>
             <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black">
                GOVERN<br />ALL.
             </h2>
             <Link to="/contact" className="btn-acid px-16 py-6">Consult an Architect</Link>
          </FU>
       </div>
    </section>
  </Layout>
);

export default TrustFabric;
