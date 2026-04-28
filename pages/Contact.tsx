/**
 * Viktron AI — Contact Page
 * "Institutional Access Request."
 */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Calendar, CheckCircle2, Clock, Mail, 
  MapPin, MessageSquare, Phone, Bot, Shield, Zap, Globe
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { SchedulingModal } from '../components/SchedulingModal';
import { SendEmailModal, SendEmailModalStatus } from '../components/SendEmailModal';

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

const contactMethods = [
  { icon: Mail, title: 'Technical Inquiry', value: 'info@viktron.ai', href: 'mailto:info@viktron.ai' },
  { icon: Phone, title: 'Institutional Line', value: '+1 (844) 660-8065', href: 'tel:+18446608065' },
  { icon: MessageSquare, title: 'Secure Channel', value: 'WhatsApp Connect', href: 'https://Wa.me/+16307033569' },
];

const serviceOptions = [
  'AgentIRL Platform Access',
  'Enterprise Control Plane',
  'Trust Fabric Implementation',
  'Agent Workforce Provisioning',
  'Custom AI Orchestration',
];

const INPUT_CLASS = "w-full bg-[#080808] border border-white/10 px-6 py-4 text-white font-mono text-xs uppercase tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-zinc-700";

export const Contact: React.FC = () => {
  const location = useLocation();
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', service: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendModalStatus, setSendModalStatus] = useState<SendEmailModalStatus>('sending');
  const [sendModalMessage, setSendModalMessage] = useState('');
  const [sendModalMailto, setSendModalMailto] = useState<string | undefined>(undefined);
  const supportEmail = 'info@viktron.ai';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subject = params.get('subject');
    if (subject) setFormData((prev) => ({ ...prev, message: subject }));
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSendModalOpen(true);
    setSendModalStatus('sending');
    setSendModalMessage('Authenticating request...');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setFormData({ name: '', email: '', company: '', service: '', message: '' });
        setSendModalStatus('success');
        setSendModalMessage("Request verified. Our architects will contact you within 24 hours.");
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
      setSendModalStatus('error');
      setSendModalMessage(`Network error. Please email us at ${supportEmail}.`);
      setSendModalMailto(`mailto:${supportEmail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showBackground={false}>
      <SEO title="Contact Viktron — Request Technical Briefing" description="Institutional access to the Viktron Control Plane and AgentIRL runtime." />
      
      <SchedulingModal isOpen={isSchedulingOpen} onClose={() => setIsSchedulingOpen(false)} source="contact-page" />
      <SendEmailModal
        isOpen={isSendModalOpen}
        status={sendModalStatus}
        message={sendModalMessage}
        mailto={sendModalMailto}
        onClose={() => setIsSendModalOpen(false)}
      />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-[60vh] bg-[#050505] flex flex-col justify-center pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
          <FU d={0}>
            <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.3em] uppercase font-bold text-glow mb-12">
              <div className="w-12 h-px bg-primary" />
              CONNECT_SYSTEM // INBOUND
            </div>
          </FU>
          <FU d={0.1}>
            <h1 className="heading-precision text-7xl md:text-9xl text-white leading-[0.85] tracking-[-0.05em] uppercase">
              REQUEST<br />
              <span className="text-zinc-700">ACCESS.</span>
            </h1>
            <p className="heading-editorial text-3xl text-zinc-300 mt-10 max-w-2xl">
              Initiate a technical briefing with our infrastructure architects.
            </p>
          </FU>
        </div>
      </section>

      {/* ══════════════════ CONTACT GRID ══════════════════ */}
      <section className="py-20 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
            
            {/* Form */}
            <FU d={0.2}>
               <div className="obsidian-panel p-12 relative overflow-hidden group">
                  <div className="scan-line opacity-10" />
                  <h2 className="text-white font-bold text-2xl uppercase tracking-tighter mb-10">Request Briefing</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className={INPUT_CLASS} />
                       <input name="email" type="email" placeholder="Institutional Email" value={formData.email} onChange={handleChange} required className={INPUT_CLASS} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       <input name="company" placeholder="Organization" value={formData.company} onChange={handleChange} className={INPUT_CLASS} />
                       <select name="service" value={formData.service} onChange={handleChange} className={INPUT_CLASS}>
                          <option value="">Select Service Domain</option>
                          {serviceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                       </select>
                    </div>
                    <textarea name="message" placeholder="Project Constraints & Goals" value={formData.message} onChange={handleChange} required rows={6} className={`${INPUT_CLASS} resize-none`} />
                    
                    <button type="submit" disabled={isSubmitting} className="btn-acid w-full py-6 flex items-center justify-center gap-4">
                       {isSubmitting ? 'Authenticating...' : 'Submit Request'}
                       <ArrowRight size={18} />
                    </button>
                  </form>
               </div>
            </FU>

            {/* Sidebar */}
            <div className="space-y-8">
               <FU d={0.3}>
                  <div className="obsidian-panel p-10 space-y-8">
                     <Label>SYSTEM_REACH</Label>
                     <div className="space-y-10">
                        {contactMethods.map((m, i) => {
                          const Icon = m.icon;
                          return (
                            <a key={i} href={m.href} className="flex gap-6 group">
                               <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                                  <Icon size={18} />
                               </div>
                               <div>
                                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{m.title}</div>
                                  <div className="text-sm text-white font-bold tracking-tight">{m.value}</div>
                               </div>
                            </a>
                          );
                        })}
                     </div>
                  </div>
               </FU>

               <FU d={0.4}>
                  <div className="obsidian-panel p-10 space-y-8">
                     <Label>TRUST_STATUS</Label>
                     <div className="flex items-center gap-4 text-primary">
                        <Shield size={20} className="text-glow" />
                        <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold">SOC 2 TYPE II COMPLIANT</span>
                     </div>
                     <p className="text-zinc-500 text-xs leading-relaxed">
                        All communications are encrypted with AES-256. Data shared is strictly used for architecture scoping and is never used for training.
                     </p>
                  </div>
               </FU>

               <FU d={0.5}>
                  <button onClick={() => setIsSchedulingOpen(true)} className="btn-obsidian w-full py-6 flex items-center justify-center gap-4">
                     <Calendar size={18} /> Book Architect Call
                  </button>
               </FU>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ WORLD REACH ══════════════════ */}
      <section className="py-40 bg-[#050505] relative overflow-hidden text-center border-t border-white/5">
         <div className="max-w-4xl mx-auto px-6">
            <FU d={0}>
               <div className="flex justify-center mb-10 text-primary/40"><Globe size={40} /></div>
               <h2 className="heading-precision text-6xl text-white uppercase tracking-tighter leading-[0.85]">Global<br />Infrastructure.</h2>
               <p className="text-zinc-400 text-lg mt-8 font-light">
                  Distributed architecture teams in Chicago, London, and Bangalore. 
                  Serving enterprise clients worldwide with 24/7 technical support.
               </p>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
