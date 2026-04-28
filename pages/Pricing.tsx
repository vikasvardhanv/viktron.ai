/**
 * Viktron AI — Pricing
 * "Scale Your Intelligence Capacity."
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, X as XIcon, ChevronDown, ArrowRight, Sparkles, 
  Calendar, Shield, Activity, Zap, Layers, Lock, Database
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

const TIERS = [
  {
    name: 'Starter Node',
    price: '$199',
    period: '/mo',
    desc: 'Single specialized agent for one use case.',
    features: ['1 AI Agent (Sales or Support)', '500 Task Cycles / mo', 'Email & SMS Interface', 'Basic Telemetry', '5-Day Provisioning'],
  },
  {
    name: 'Growth Cluster',
    price: '$499',
    period: '/mo',
    desc: 'Coordinated workforce with CEO orchestrator.',
    highlight: true,
    features: ['Full Agent Team (4 Nodes)', 'Unlimited Task Cycles', 'All Channels (Voice/Web/Social)', 'Live Observability Feed', '48hr Provisioning'],
  },
  {
    name: 'Enterprise Plane',
    price: 'Custom',
    period: '',
    desc: 'The complete AgentIRL infrastructure.',
    features: ['Private VPC Deployment', 'AgentIRL Platform Access', 'Custom Workflow Engineering', 'SLA-Backed 99.99% Uptime', 'Institutional Support'],
  },
];

const FAQS = [
  { q: 'What are Task Cycles?', a: 'A task cycle is a single agent run that produces a result — e.g., answering a customer query, booking a meeting, or generating a content report.' },
  { q: 'How long is provisioning?', a: 'Starter nodes are active within 5 days. Growth clusters are typically live in 48 hours. Enterprise timelines are scoped by architects.' },
  { q: 'Where is my data stored?', a: 'All data is encrypted with AES-256. For Enterprise, we support custom data residency (US/EU) and private VPC deployments.' },
  { q: 'Can I scale my cluster?', a: 'Yes. You can add specialized nodes to your cluster at any time. Billing adjusts automatically at the next cycle.' },
];

export const Pricing: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout showBackground={false}>
      <SEO title="Pricing — Viktron AI Agent Infrastructure" description="Transparent pricing for specialized AI agent teams and AgentIRL infrastructure." />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-[60vh] bg-[#050505] flex flex-col justify-center pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 text-center">
          <FU d={0}>
             <Label>RESOURCE_ALLOCATION</Label>
             <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                CAPACITY<br />
                <span className="text-zinc-700">PRICING.</span>
             </h1>
             <p className="heading-editorial text-3xl text-zinc-300 mt-12 max-w-2xl mx-auto">
                Predictable cost for autonomous performance.
             </p>
          </FU>
        </div>
      </section>

      {/* ══════════════════ PRICING CARDS ══════════════════ */}
      <section className="py-20 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-3 gap-8">
              {TIERS.map((t, i) => (
                <FU key={i} d={i * 0.05} className={`obsidian-panel p-12 flex flex-col h-full ${t.highlight ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-bold text-2xl uppercase tracking-tighter">{t.name}</h3>
                      {t.highlight && <span className="px-3 py-1 bg-primary text-black text-[9px] font-mono font-bold tracking-widest uppercase">POPULAR</span>}
                   </div>
                   <p className="text-zinc-500 text-xs mb-8 uppercase tracking-widest font-mono">{t.desc}</p>
                   <div className="flex items-baseline gap-2 mb-10">
                      <span className="text-6xl font-black text-white tracking-tighter">{t.price}</span>
                      <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">{t.period}</span>
                   </div>
                   <ul className="space-y-4 mb-12 flex-1">
                      {t.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-4 text-xs text-zinc-400 font-mono tracking-widest uppercase">
                           <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0" />
                           {f}
                        </li>
                      ))}
                   </ul>
                   <Link to="/contact" className={t.highlight ? 'btn-acid w-full py-5' : 'btn-obsidian w-full py-5'}>
                      {t.name === 'Enterprise Plane' ? 'Contact Sales' : 'Allocate Nodes'}
                   </Link>
                </FU>
              ))}
           </div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5 relative">
         <div className="max-w-4xl mx-auto px-6">
            <Label>SYSTEM_QUESTIONS</Label>
            <div className="space-y-4 mt-20">
               {FAQS.map((f, i) => (
                 <FU key={i} d={i * 0.05}>
                    <div className="obsidian-panel overflow-hidden">
                       <button 
                         onClick={() => setOpenFaq(openFaq === i ? null : i)}
                         className="w-full p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                       >
                          <span className="text-white font-bold text-sm uppercase tracking-widest">{f.q}</span>
                          <ChevronDown size={16} className={`text-zinc-500 transition-transform ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                       </button>
                       <AnimatePresence>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-8 pb-8 text-zinc-400 text-sm leading-relaxed"
                            >
                               {f.a}
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 </FU>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════════ SPECS ══════════════════ */}
      <section className="py-20 bg-[#050505] relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { icon: Lock, l: 'ENCRYPTION', v: 'AES-256' },
                 { icon: Shield, l: 'COMPLIANCE', v: 'SOC 2 Ready' },
                 { icon: Database, l: 'RESIDENCY', v: 'US/EU' },
                 { icon: Zap, l: 'LATENCY', v: '< 50ms' },
               ].map((s, i) => (
                 <FU key={i} d={i * 0.05} className="text-center space-y-4">
                    <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-600 mx-auto">
                       <s.icon size={18} />
                    </div>
                    <div>
                       <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{s.l}</div>
                       <div className="text-sm text-white font-bold tracking-widest">{s.v}</div>
                    </div>
                 </FU>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-60 bg-[#050505] text-center relative overflow-hidden border-t border-white/5">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  SELECT<br />
                  <span className="text-zinc-700">MODEL.</span>
               </h2>
               <Link to="/contact" className="btn-acid px-16 py-6">Consult an Architect</Link>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
