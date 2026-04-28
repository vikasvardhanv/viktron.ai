/**
 * Viktron AI — Cookie Policy
 * Obsidian Precision v2.2 Synchronization
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Cookie, ArrowLeft } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { SEO } from '../../components/ui/SEO';
import { motion } from 'framer-motion';

const FU = ({ d = 0, children, className = '' }: { d?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const sections = [
  {
    title: '01 // ESSENTIAL_BLOCKS',
    body: 'These are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas like the AgentIRL Console.',
  },
  {
    title: '02 // PERFORMANCE_VECTORS',
    body: 'These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.',
  },
  {
    title: '03 // FUNCTIONAL_ASSETS',
    body: 'These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your institutional preferences.',
  },
];

export const CookiePolicy: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO title="Cookie Policy — Viktron AI Governance" description="How we use data blocks to optimize the institutional agentic experience." />

      <section className="pt-40 pb-20 bg-[#050505] min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          <FU d={0}>
             <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-mono text-[10px] uppercase tracking-widest mb-12">
                <ArrowLeft size={12} /> Return_to_Base
             </Link>
             <div className="section-label">LEGAL_RESOURCES // COOKIES_v2.2</div>
             <h1 className="heading-precision text-6xl md:text-8xl text-white uppercase tracking-tighter mt-10 mb-6">Cookie<br /><span className="text-zinc-700">Policy.</span></h1>
             <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-20">LAST_UPDATE: FEB_18_2026 // VERIFIED</p>
          </FU>

          <div className="space-y-16">
             {sections.map((s, i) => (
               <FU key={i} d={0.1 + i * 0.05} className="obsidian-panel p-12 group hover:border-primary/30 transition-all">
                  <h2 className="text-primary font-mono text-[11px] font-bold uppercase tracking-[0.3em] mb-6">{s.title}</h2>
                  <p className="text-zinc-400 text-base leading-relaxed">{s.body}</p>
               </FU>
             ))}
          </div>

          <FU d={0.5} className="mt-20 obsidian-inset p-12 border border-white/5 space-y-8">
             <h3 className="text-white font-bold text-lg uppercase tracking-tight">Data Governance</h3>
             <div className="flex items-center gap-4 text-zinc-400 group">
                <div className="w-10 h-10 obsidian-inset flex items-center justify-center border border-white/5 transition-all">
                   <Database size={16} />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-widest">SYSTEM: OTLP_NATIVE // COMPLIANT</span>
             </div>
          </FU>
        </div>
      </section>
    </Layout>
  );
};
