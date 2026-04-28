/**
 * Viktron AI — Engineering Blog
 * "Intelligence Reports & Engineering Logs."
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { ArrowRight, BookOpen, Clock, Activity, Zap, Cpu } from 'lucide-react';

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

const ARTICLES = [
  {
    tag: 'ARCHITECTURE',
    title: 'The AgentIRL Trust Fabric: Designing Governance for Autonomous Workforces',
    excerpt: 'How we built a 6-layer security stack to intercept and validate non-deterministic agent actions at scale.',
    date: 'MAR 2026',
    time: '12 MIN READ',
    icon: Cpu,
  },
  {
    tag: 'TELEMETRY',
    title: 'Beyond the Dashboard: Real-time OTLP Analytics for Multi-Agent Systems',
    excerpt: 'Why traditional product analytics fail in agentic workflows and how to monitor reasoning chains.',
    date: 'FEB 2026',
    time: '8 MIN READ',
    icon: Activity,
  },
  {
    tag: 'RELIABILITY',
    title: 'Zero-Rewrite Deployment: Wrapping Legacy APIs for Agentic Interaction',
    excerpt: 'Implementing institutional-grade reliability without changing a single line of your core business logic.',
    date: 'FEB 2026',
    time: '10 MIN READ',
    icon: Zap,
  },
];

export const Blog: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO title="Engineering Blog — Viktron AI Intelligence Reports" description="Engineering logs, architecture deep-dives, and intelligence reports on autonomous systems." />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-[60vh] bg-[#050505] flex flex-col justify-center pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 text-center">
          <FU d={0}>
             <Label>INTELLIGENCE_REPORTS</Label>
             <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                LOGS &<br />
                <span className="text-zinc-700">INSIGHTS.</span>
             </h1>
          </FU>
        </div>
      </section>

      {/* ══════════════════ ARTICLES ══════════════════ */}
      <section className="py-20 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {ARTICLES.map((a, i) => {
             const Icon = a.icon;
             return (
               <FU key={i} d={i * 0.05}>
                  <div className="obsidian-panel p-10 h-full flex flex-col space-y-8 group hover:border-primary/40 transition-all cursor-pointer">
                     <div className="flex justify-between items-start">
                        <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors">
                           <Icon size={18} />
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{a.date}</span>
                     </div>
                     <div className="flex-1 space-y-4">
                        <span className="text-[9px] font-mono text-primary font-bold tracking-[0.2em] uppercase">{a.tag}</span>
                        <h2 className="text-white font-bold text-xl uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">{a.title}</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">{a.excerpt}</p>
                     </div>
                     <div className="pt-8 flex items-center justify-between border-t border-white/5">
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{a.time}</span>
                        <ArrowRight size={16} className="text-zinc-800 group-hover:text-primary transition-all" />
                     </div>
                  </div>
               </FU>
             );
           })}
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-60 bg-[#050505] text-center relative overflow-hidden border-t border-white/5">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  STAY<br />
                  <span className="text-zinc-700">INFORMED.</span>
               </h2>
               <div className="flex flex-wrap justify-center gap-6">
                  <input type="email" placeholder="ENTER_EMAIL_FOR_REPORTS" className="bg-transparent border border-white/10 px-8 py-5 font-mono text-[10px] tracking-widest text-white outline-none focus:border-primary w-[300px]" />
                  <button className="btn-acid px-12 py-5">Subscribe</button>
               </div>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
