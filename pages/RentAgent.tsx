/**
 * Viktron AI — Agent Registry (Marketplace)
 * "The Global Catalog for Autonomous Intelligence."
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Megaphone, Code2, Zap, Users, HeartHandshake, FileText, Search, 
  ShieldCheck, BarChart3, Globe, ShoppingBag, Layout, ClipboardList, 
  Download, Terminal, Package, CloudUpload, X, ArrowRight, Check, Copy, ExternalLink 
} from 'lucide-react';
import { Layout as PageLayout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="section-label">{children}</div>
);

const AGENTS = [
  {
    slug: 'ceo',
    name: 'CEO Agent',
    tagline: 'Orchestration & Strategic Planning',
    category: 'ORCHESTRATION',
    icon: Layout,
    desc: 'The orchestrator agent. Breaks complex goals into task DAGs, delegates to specialist agents.',
  },
  {
    slug: 'hermes',
    name: 'Hermes v1.0',
    tagline: 'Multi-Environment Distributed Agent',
    category: 'INFRASTRUCTURE',
    icon: Zap,
    desc: 'Powerful open-source agent with terminal, browser, vision, and multi-environment execution.',
  },
  {
    slug: 'marketing',
    name: 'Marketing Agent',
    tagline: 'Full-Stack Campaign Management',
    category: 'GROWTH',
    icon: Megaphone,
    desc: 'AI marketing specialist. Manages social posting, paid ads, SEO, and GA4 reporting.',
  },
  {
    slug: 'developer',
    name: 'Engineer Agent',
    tagline: 'Autonomous Software Engineering',
    category: 'ENGINEERING',
    icon: Code2,
    desc: 'Full-stack AI software engineer. Reads requirements, writes code, runs tests, and deploys.',
  },
  {
    slug: 'analyst',
    name: 'Data Analyst',
    tagline: 'Reasoning & Pattern Synthesis',
    category: 'INTELLIGENCE',
    icon: BarChart3,
    desc: 'Turns raw data into insights — SQL, Python, and real-time reasoning dashboards.',
  },
  {
    slug: 'support',
    name: 'Support Agent',
    tagline: '24/7 Empathetic Resolution',
    category: 'OPERATIONS',
    icon: HeartHandshake,
    desc: 'AI customer support specialist. Handles tickets and live chat with institutional empathy.',
  },
];

export const RentAgent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  return (
    <PageLayout showBackground={false}>
      <SEO title="Agent Registry — Viktron AI Marketplace" description="Deploy institutional-grade agents from the global registry." />

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
           <FU d={0}>
              <Label>AGENT_REGISTRY // CATALOG_v2.2</Label>
              <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                 RENTAL<br />
                 <span className="text-zinc-700">FORCES.</span>
              </h1>
           </FU>
        </div>
      </section>

      {/* ─── FILTERS ─── */}
      <section className="sticky top-20 z-40 bg-[#050505]/80 backdrop-blur-xl border-y border-white/5 py-4">
         <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-8 overflow-x-auto no-scrollbar">
            {['ALL', 'ORCHESTRATION', 'INFRASTRUCTURE', 'GROWTH', 'ENGINEERING', 'INTELLIGENCE', 'OPERATIONS'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[9px] font-mono uppercase tracking-[0.3em] px-4 py-2 whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'text-primary border-b border-primary' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
      </section>

      {/* ─── GRID ─── */}
      <section className="py-20 bg-[#050505] relative min-h-screen">
         <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AGENTS.filter(a => selectedCategory === 'ALL' || a.category === selectedCategory).map((agent, i) => (
              <FU key={agent.slug} d={i * 0.05}>
                 <div className="obsidian-panel p-10 h-full flex flex-col group hover:border-primary/40 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-12 h-12 obsidian-inset flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all text-zinc-500 group-hover:text-primary">
                          <agent.icon size={22} />
                       </div>
                       <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{agent.category}</span>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                       <h3 className="text-white font-bold text-2xl uppercase tracking-tighter group-hover:text-primary transition-colors">{agent.name}</h3>
                       <p className="text-primary font-mono text-[9px] uppercase tracking-[0.2em]">{agent.tagline}</p>
                       <p className="text-zinc-500 text-sm leading-relaxed">{agent.desc}</p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-600">
                             <Download size={10} /> 1.2k
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-600">
                             <Check size={10} /> v2.2
                          </div>
                       </div>
                       <button className="btn-acid !px-6 !py-2 !text-[9px]">Provision</button>
                    </div>
                 </div>
              </FU>
            ))}
         </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-40 bg-[#080808] border-t border-white/5 text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-5xl md:text-7xl text-white mb-10 uppercase tracking-tighter font-black">
                  OWN YOUR<br />
                  <span className="text-zinc-700">INTELLIGENCE.</span>
               </h2>
               <p className="text-zinc-500 font-mono text-[11px] uppercase tracking-widest mb-12 max-w-lg mx-auto">
                  Deploy custom agent images directly to the AgentIRL Trust Fabric with sub-50ms latency.
               </p>
               <button className="btn-acid px-12 py-5">Register New Agent</button>
            </FU>
         </div>
      </section>
    </PageLayout>
  );
};
