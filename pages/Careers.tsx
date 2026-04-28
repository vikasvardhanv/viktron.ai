/**
 * Viktron AI — Careers
 * "Join the Infrastructure Revolution."
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CheckCircle2, Globe, Heart, Sparkles, Users, Zap, ArrowRight, Cpu, Code, Shield } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

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

const positions = [
  {
    title: 'Distributed Systems Engineer',
    dept: 'INFRASTRUCTURE',
    location: 'REMOTE / CHICAGO',
    desc: 'Architect the high-performance interceptors and routing logic that power the AgentIRL Trust Fabric.',
  },
  {
    title: 'AI Agent Architect',
    dept: 'PRODUCT',
    location: 'REMOTE',
    desc: 'Build specialized, multi-agent workflows that handle complex business logic with non-deterministic models.',
  },
  {
    title: 'Full Stack Engineer (UI/UX)',
    dept: 'PLATFORM',
    location: 'REMOTE',
    desc: 'Create institutional-grade dashboards and telemetry visualizations for autonomous workforces.',
  },
];

export const Careers: React.FC = () => {
  const handleApply = (pos: string) => {
    window.location.href = `mailto:tech@viktron.ai?subject=Application: ${pos}`;
  };

  return (
    <Layout showBackground={false}>
      <SEO
        title="Careers — Build the Future of AI Agent Infrastructure — Viktron"
        description="Join Viktron to build production-grade AI agent infrastructure. We're hiring engineers, ML researchers, and enterprise sales for AgentIRL orchestration, Trust Fabric governance, and AI automation. Based in Chicago, IL. Remote-friendly."
        keywords="AI careers, AI jobs, agent infrastructure jobs, ML engineer jobs, enterprise AI careers, Viktron careers, Chicago AI jobs"
      />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-[70vh] bg-[#050505] flex flex-col justify-center pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 text-center">
          <FU d={0}>
             <Label>TALENT_ALLOCATION</Label>
             <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                BUILD THE<br />
                <span className="text-zinc-700">FABRIC.</span>
             </h1>
             <p className="heading-editorial text-3xl text-zinc-300 mt-12 max-w-2xl mx-auto">
                Join the team building the production runtime for autonomous intelligence.
             </p>
          </FU>
        </div>
      </section>

      {/* ══════════════════ POSITIONS ══════════════════ */}
      <section className="py-20 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
           {positions.map((p, i) => (
             <FU key={i} d={i * 0.05}>
                <div className="obsidian-panel p-10 flex flex-col md:flex-row md:items-center gap-12 group hover:border-primary/40 transition-all">
                   <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-mono text-primary font-bold tracking-[0.2em] uppercase">{p.dept}</span>
                         <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                         <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{p.location}</span>
                      </div>
                      <h2 className="text-white font-bold text-2xl uppercase tracking-tighter">{p.title}</h2>
                      <p className="text-zinc-500 text-sm max-w-xl">{p.desc}</p>
                   </div>
                   <button 
                     onClick={() => handleApply(p.title)}
                     className="btn-acid px-10 py-4 flex items-center justify-center gap-3"
                   >
                      Apply <ArrowRight size={16} />
                   </button>
                </div>
             </FU>
           ))}
        </div>
      </section>

      {/* ══════════════════ VALUES ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5 relative">
         <div className="max-w-7xl mx-auto px-6">
            <Label>ENGINEERING_CULTURE</Label>
            <div className="grid md:grid-cols-3 gap-12 mt-20">
               {[
                 { icon: Cpu, t: 'Production First', d: 'We don\'t ship demos. We ship reliable, high-uptime infrastructure.' },
                 { icon: Shield, t: 'Trust Focused', d: 'Security and governance are at the core of everything we build.' },
                 { icon: Code, t: 'Zero-Waste', d: 'Highly efficient, type-safe, and distributed systems architecture.' },
               ].map((v, i) => (
                 <FU key={i} d={i * 0.1} className="space-y-6">
                    <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-zinc-600">
                       <v.icon size={20} />
                    </div>
                    <h3 className="text-white font-bold text-lg uppercase tracking-tight">{v.t}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{v.d}</p>
                 </FU>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-60 bg-[#050505] text-center relative overflow-hidden">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black">
                  HIRE<br />
                  <span className="text-zinc-700">HUMANS.</span>
               </h2>
               <button onClick={() => handleApply('General')} className="btn-acid px-16 py-6">Send General Dossier</button>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
