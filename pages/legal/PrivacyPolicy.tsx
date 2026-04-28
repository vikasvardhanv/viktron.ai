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
    <Layout showBackground={true}>
      <SEO title="Privacy Policy — Viktron AI Governance" description="How Viktron handles personal information under the Trust Fabric framework." />

      <section className="pt-48 pb-32 bg-[#050505] min-h-screen relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          <FU d={0}>
             <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-mono text-[10px] uppercase tracking-widest mb-16">
                <ArrowLeft size={12} /> [RETURN_TO_BASE]
             </Link>
             <div className="section-label">SYSTEM_GOVERNANCE // PRIVACY_v2.2</div>
             <h1 className="heading-precision text-6xl md:text-8xl text-white uppercase tracking-tighter mt-10 mb-8 leading-[0.85]">
                Privacy<br />
                <span className="text-primary text-glow">Policy.</span>
             </h1>
             <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-24">DOCUMENT_STATUS: VERIFIED // LAST_UPDATE: FEB_12_2026</p>
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
                <Shield size={80} />
             </div>
             <h3 className="text-white font-bold text-xl uppercase tracking-tighter">Institutional Contact</h3>
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
             <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest leading-relaxed pt-8 border-t border-white/5">
                © 2026 VIKTRON AI. ALL DATA PROCESSING IS GOVERNED BY THE TRUST FABRIC POLICY GATEWAY.
             </p>
          </FU>
        </div>
      </section>
    </Layout>
  );
};
