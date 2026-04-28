/**
 * Viktron AI — Privacy Policy
 * Obsidian Precision v2.2 Synchronization
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Shield, ArrowLeft } from 'lucide-react';
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
    title: '01 // DATA_COLLECTION',
    body: 'We collect information you provide directly, such as name, email, company details, and support messages. We also collect technical telemetry like browser type, IP address, and service interaction vectors.',
  },
  {
    title: '02 // UTILIZATION_PROTOCOL',
    body: 'We use data to deliver services, respond to requests, improve product performance, and maintain security. With consent, we may use contact information for system updates and technical announcements.',
  },
  {
    title: '03 // COOKIES & TRACKING',
    body: 'We use essential cookies for authentication and core functionality. Optional analytics and marketing cookies are controlled through your institutional preference panel.',
  },
  {
    title: '04 // DISCLOSURE_LIMITS',
    body: 'We do not sell personal data. We may share information with infrastructure, analytics, and payment providers to operate our services under strict SOC 2 compliance.',
  },
];

export const PrivacyPolicy: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO title="Privacy Policy — Viktron AI Governance" description="How Viktron handles personal information under the Trust Fabric framework." />

      <section className="pt-40 pb-20 bg-[#050505] min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          <FU d={0}>
             <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-mono text-[10px] uppercase tracking-widest mb-12">
                <ArrowLeft size={12} /> Return_to_Base
             </Link>
             <div className="section-label">LEGAL_RESOURCES // PRIVACY_v2.2</div>
             <h1 className="heading-precision text-6xl md:text-8xl text-white uppercase tracking-tighter mt-10 mb-6">Privacy<br /><span className="text-zinc-700">Policy.</span></h1>
             <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-20">LAST_UPDATE: FEB_12_2026 // VERIFIED</p>
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
             <h3 className="text-white font-bold text-lg uppercase tracking-tight">Institutional Contact</h3>
             <div className="grid md:grid-cols-2 gap-8">
                <a href="mailto:privacy@viktron.ai" className="flex items-center gap-4 text-zinc-400 hover:text-primary transition-colors group">
                   <div className="w-10 h-10 obsidian-inset flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
                      <Mail size={16} />
                   </div>
                   <span className="font-mono text-[11px] uppercase tracking-widest">privacy@viktron.ai</span>
                </a>
                <div className="flex items-center gap-4 text-zinc-400 group">
                   <div className="w-10 h-10 obsidian-inset flex items-center justify-center border border-white/5 transition-all">
                      <MapPin size={16} />
                   </div>
                   <span className="font-mono text-[11px] uppercase tracking-widest">UNITED_STATES [GLOBAL_HQ]</span>
                </div>
             </div>
          </FU>
        </div>
      </section>
    </Layout>
  );
};
