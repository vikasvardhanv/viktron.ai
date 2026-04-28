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

// ─── ASSETS ──────────────────────────────────────────────────────────────────
const ASSETS = {
  shield: "/Users/vikashvardhan/.gemini/antigravity/brain/1f2ef31e-d578-4028-8c95-618a85eba259/agentirl_trust_shield_1777348951595.png",
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

export const TrustFabric: React.FC = () => (
  <Layout showBackground={false}>
    <ServiceSEO
      serviceName="AgentIRL Trust Fabric — Enterprise Governance"
      serviceDescription="The 6-layer security stack for autonomous agents. Cryptographic identity, policy enforcement, and immutable provenance."
    />

    {/* ═══════════════════════════ HERO ═══════════════════════════ */}
    <section className="relative min-h-[90vh] bg-[#050505] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-[0.03] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-20 items-center">
          <div className="space-y-12">
            <FU d={0}>
              <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.2em] uppercase">
                <div className="w-8 h-px bg-primary" />
                INFRASTRUCTURE_SECURITY // LAYER_06
              </div>
            </FU>
            <FU d={0.1}>
              <h1 className="heading-precision text-6xl md:text-8xl text-white">
                THE TRUST<br />
                <span className="text-muted">FABRIC.</span>
              </h1>
              <p className="heading-editorial text-3xl text-zinc-300 mt-6 max-w-xl">
                Cryptographic governance for every agent decision.
              </p>
            </FU>
            <FU d={0.2}>
              <p className="max-w-xl text-zinc-400 text-base leading-relaxed">
                The Trust Fabric is a multi-layered security stack that intercepts agent actions 
                to ensure SOC 2 compliance. It's the definitive layer for autonomous enterprise 
                risk management.
              </p>
            </FU>
            <FU d={0.3} className="flex gap-6">
              <Link to="/contact" className="btn-acid">Request CISO Briefing</Link>
              <Link to="/enterprise" className="btn-obsidian border-white/20">Compliance Specs</Link>
            </FU>
          </div>
          <FU d={0.4} className="relative">
             <div className="obsidian-panel p-12 flex items-center justify-center relative">
                <div className="absolute inset-0 scan-line" />
                <img src={ASSETS.shield} alt="Trust Shield" className="w-full h-full object-contain grayscale brightness-90 animate-float" />
                <div className="absolute inset-0 acid-glow opacity-10 pointer-events-none" />
             </div>
          </FU>
        </div>
      </div>
    </section>

    {/* ══════════════════ THE 6 LAYERS ══════════════════ */}
    <section className="py-40 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <Label>01 // THE 6 LAYERS OF ENFORCEMENT</Label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 mt-20 border border-white/5 overflow-hidden">
          {[
            { icon: Fingerprint, name: 'Identity', desc: 'Every agent instance is bound to a unique cryptographic fingerprint.' },
            { icon: Key, name: 'Delegation', desc: 'Scoped JWTs restrict permissions as agents spawn sub-tasks.' },
            { icon: Shield, name: 'Policy Gateway', desc: 'Sub-50ms interception of tool calls against corporate rules.' },
            { icon: Activity, name: 'Budget Guards', desc: 'Hard stops on LLM costs and API spend per mission.' },
            { icon: Lock, name: 'Secrets Vault', desc: 'Zero-trust credential injection at the moment of execution.' },
            { icon: FileCheck, name: 'Provenance', desc: 'Immutable SHA-256 chain of every decision and action.' },
          ].map((l, i) => {
            const Icon = l.icon;
            return (
              <FU key={i} d={i * 0.05} className="bg-[#050505] p-12 space-y-6 group hover:bg-[#080808] transition-colors">
                 <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-600 group-hover:text-primary">
                    <Icon size={20} />
                 </div>
                 <h4 className="text-white font-bold text-sm uppercase tracking-tight">{l.name}</h4>
                 <p className="text-zinc-500 text-xs leading-relaxed">{l.desc}</p>
              </FU>
            );
          })}
        </div>
      </div>
    </section>

    {/* ══════════════════ WHY TRUST FABRIC? ══════════════════ */}
    <section className="py-40 bg-[#080808] border-y border-white/5">
       <div className="max-w-7xl mx-auto px-6">
          <Label>02 // THE NECESSITY</Label>
          <div className="grid lg:grid-cols-2 gap-24 items-center mt-20">
             <FU d={0}>
                <h2 className="heading-precision text-5xl text-white mb-8 uppercase tracking-tighter">Beyond the<br />Prompt.</h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                   Prompt engineering is not a security strategy. Trust Fabric moves governance 
                   to the infrastructure layer, ensuring that no matter what the LLM generates, 
                   it cannot violate your corporate boundaries.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                   {[
                     { t: 'SOC 2 Ready', d: 'Automated audit evidence generation.' },
                     { t: 'Human-in-Loop', d: 'Risk-aware approval triggers.' },
                     { t: 'Framework Agnostic', d: 'Works with LangChain, CrewAI, etc.' },
                     { t: 'Immutable', d: 'SHA-256 chain provenance.' },
                   ].map((item, i) => (
                     <div key={i} className="space-y-2">
                        <div className="text-primary font-mono text-[10px] uppercase font-bold tracking-widest">{item.t}</div>
                        <p className="text-zinc-600 text-xs leading-relaxed">{item.d}</p>
                     </div>
                   ))}
                </div>
             </FU>
             <FU d={0.2} className="obsidian-panel p-12 bg-[#050505]">
                <h4 className="font-mono text-[10px] text-muted mb-8 tracking-widest uppercase">// LIVE_PROVENANCE_STREAM</h4>
                <div className="space-y-4 font-mono text-[11px]">
                   {[
                     { l: 'IDENTITY_VERIFIED', s: 'text-primary' },
                     { l: 'POLICY_EVAL_GRANTED', s: 'text-primary' },
                     { l: 'BUDGET_RESERVE_OK', s: 'text-primary' },
                     { l: 'CREDENTIAL_INJECTED', s: 'text-primary' },
                     { l: 'LEDGER_ENTRY_RECORDED', s: 'text-muted' },
                   ].map((log, i) => (
                     <div key={i} className="flex gap-4">
                        <span className="text-zinc-800">[{1420 + i}]</span>
                        <span className={log.s}>{log.l}</span>
                     </div>
                   ))}
                </div>
             </FU>
          </div>
       </div>
    </section>

    {/* ══════════════════ CTA ══════════════════ */}
    <section className="py-60 bg-[#050505]">
       <div className="max-w-4xl mx-auto px-6 text-center">
          <FU d={0}>
             <h2 className="heading-precision text-6xl text-white mb-12 uppercase">
                GOVERN<br />EVERYTHING.
             </h2>
             <Link to="/contact" className="btn-acid px-12 py-5">Talk to a Solutions Architect</Link>
          </FU>
       </div>
    </section>
  </Layout>
);
