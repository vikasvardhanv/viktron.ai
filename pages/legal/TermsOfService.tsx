/**
 * Viktron AI — Terms of Service
 * Obsidian Precision v2.2 Synchronization
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Gavel, ArrowLeft, Shield } from 'lucide-react';
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
    title: '01 // AGREEMENT_TERMS',
    body: 'By accessing Viktron services, you agree to be bound by these institutional terms of service and all applicable laws and regulations. If you do not agree, you are prohibited from utilizing the AgentIRL platform.',
  },
  {
    title: '02 // USE_LICENSE',
    body: 'Permission is granted to temporarily deploy autonomous agents through the Viktron interface for personal or commercial transitory viewing only. This is the grant of a license, not a transfer of title.',
  },
  {
    title: '03 // AGENT_GOVERNANCE',
    body: 'Users are responsible for all actions taken by agents spawned under their cryptographic identity. You must ensure all agent behavior complies with the Trust Fabric policy gateway.',
  },
  {
    title: '04 // LIMITATIONS',
    body: 'In no event shall Viktron or its suppliers be liable for any damages arising out of the use or inability to use the materials on Viktron\'s website or services.',
  },
];

export const TermsOfService: React.FC = () => {
  return (
    <Layout showBackground={true}>
      <SEO title="Terms of Service — Viktron AI Governance" description="Institutional terms for the deployment and management of autonomous agents." />

      <section className="pt-48 pb-32 bg-[#050505] min-h-screen relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          <FU d={0}>
             <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-mono text-[10px] uppercase tracking-widest mb-16">
                <ArrowLeft size={12} /> [RETURN_TO_BASE]
             </Link>
             <div className="section-label">SYSTEM_GOVERNANCE // TERMS_v2.2</div>
             <h1 className="heading-precision text-6xl md:text-8xl text-white uppercase tracking-tighter mt-10 mb-8 leading-[0.85]">
                Terms of<br />
                <span className="text-primary text-glow">Service.</span>
             </h1>
             <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-24">DOCUMENT_STATUS: VERIFIED // LAST_UPDATE: FEB_15_2026</p>
          </FU>

          <div className="space-y-12">
             {sections.map((s, i) => (
               <FU key={i} d={0.1 + i * 0.05} className="obsidian-panel p-10 md:p-16 relative overflow-hidden group">
                  <div className="scan-line opacity-5" />
                  <h2 className="text-primary font-mono text-[11px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                    <span className="w-8 h-px bg-primary/30" />
                    {s.title}
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed font-light">{s.body}</p>
               </FU>
             ))}
          </div>

          <FU d={0.5} className="mt-24 obsidian-inset p-12 border border-white/5 space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 text-primary">
                <Gavel size={80} />
             </div>
             <h3 className="text-white font-bold text-xl uppercase tracking-tighter">Institutional Compliance</h3>
             <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex items-center gap-4 text-zinc-400">
                   <div className="w-10 h-10 obsidian-inset flex items-center justify-center border border-white/5 text-primary">
                      <Shield size={16} className="text-glow" />
                   </div>
                   <span className="font-mono text-[11px] uppercase tracking-widest">VIKTRON_LEGAL_ENFORCEMENT</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                   <div className="w-10 h-10 obsidian-inset flex items-center justify-center border border-white/5 text-primary">
                      <MapPin size={16} />
                   </div>
                   <span className="font-mono text-[11px] uppercase tracking-widest">DELAWARE_USA // GLOBAL_JURISDICTION</span>
                </div>
             </div>
             <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest leading-relaxed pt-8 border-t border-white/5">
                © 2026 VIKTRON AI. ALL AGENTIC DEPLOYMENTS ARE SUBJECT TO TRUST FABRIC GOVERNANCE PROTOCOLS.
             </p>
          </FU>
        </div>
      </section>
    </Layout>
  );
};
