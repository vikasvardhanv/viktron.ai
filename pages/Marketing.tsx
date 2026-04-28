/**
 * Viktron AI — Marketing Operations Force
 * "Autonomous Growth Infrastructure."
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, BarChart3, Mail, Megaphone, Share2, Sparkles, Zap, Users, 
  FileText, ShieldCheck, Activity, Globe, Check 
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="section-label">{children}</div>
);

const modules = [
  {
    id: 'content',
    title: 'Content_Strategist',
    icon: FileText,
    desc: 'An AI agent that researches trends, drafts briefs, and generates on-brand copy 24/7.',
    features: ['Trend Research', 'Long-form Copy', 'Ad Variations', 'SEO Optimization'],
  },
  {
    id: 'social',
    title: 'Social_Manager',
    icon: Share2,
    desc: 'Autonomous scheduling and engagement across LinkedIn, Twitter, and Instagram.',
    features: ['Smart Scheduling', 'Auto-Replies', 'Cross-posting', 'Viral Monitoring'],
  },
  {
    id: 'email',
    title: 'Lifecycle_Specialist',
    icon: Mail,
    desc: 'Orchestrates complex nurture sequences and win-back campaigns based on behavior.',
    features: ['Segment Logic', 'A/B Testing', 'Drip Campaigns', 'Deliverability Watch'],
  },
  {
    id: 'analytics',
    title: 'Revenue_Analyst',
    icon: BarChart3,
    desc: 'Monitors performance and reallocates budget to high-ROI channels continuously.',
    features: ['Attribution Models', 'Spend Optimization', 'Funnel Analysis', 'Weekly Reports'],
  },
];

export const Marketing: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO title="Marketing Operations — Viktron AI Growth Force" description="Deploy autonomous marketing agents that act as your content and campaign managers." />

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
           <FU d={0}>
              <Label>GROWTH_OPERATIONS // SYSTEM_v2.2</Label>
              <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                 GROWTH<br />
                 <span className="text-zinc-700">FORCES.</span>
              </h1>
              <p className="heading-editorial text-2xl text-zinc-300 mt-12 max-w-2xl mx-auto">
                 Deploy autonomous agents that act as your Content Analysts and Campaign Managers.
              </p>
           </FU>
        </div>
      </section>

      {/* ─── MODULES ─── */}
      <section className="py-20 bg-[#050505] relative min-h-screen">
         <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((m, i) => (
              <FU key={m.id} d={i * 0.05}>
                 <div className="obsidian-panel p-12 h-full flex flex-col group hover:border-primary/40 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-12">
                       <div className="w-16 h-16 obsidian-inset flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all text-zinc-500 group-hover:text-primary">
                          <m.icon size={28} />
                       </div>
                       <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-bold">MODULE_ID // {m.id.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                       <h3 className="text-white font-bold text-4xl uppercase tracking-tighter group-hover:text-primary transition-colors">{m.title}</h3>
                       <p className="text-zinc-500 text-lg leading-relaxed max-w-md">{m.desc}</p>
                       <div className="grid grid-cols-2 gap-4 pt-6">
                          {m.features.map(f => (
                            <div key={f} className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                               <Check size={12} className="text-primary" /> {f}
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                          <Activity size={14} /> ROI_TRACKED
                       </div>
                       <button className="btn-acid !px-10 !py-4 !text-[10px]">Initialize Module</button>
                    </div>
                 </div>
              </FU>
            ))}
         </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-60 bg-[#080808] border-t border-white/5 text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[120px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  SCALE<br />
                  <span className="text-zinc-700">REVENUE.</span>
               </h2>
               <Link to="/contact" className="btn-acid px-16 py-6 inline-block">Request Growth Audit</Link>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
