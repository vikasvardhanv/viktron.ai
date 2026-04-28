/**
 * Viktron AI — Institutional Onboarding
 * "Provisioning Your Autonomous Workforce."
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, AlertCircle, ArrowRight, Zap, Users, Shield, Cpu, Globe } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';

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

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<'INITIAL' | 'PROVISIONING' | 'SUCCESS'>('INITIAL');

  // Simple demo simulation
  const startProvisioning = () => {
    setStep('PROVISIONING');
    setTimeout(() => setStep('SUCCESS'), 4000);
  };

  return (
    <Layout showFooter={false} showBackground={false}>
      <SEO title="Onboarding — Provisioning Your AI Team" description="Initialize your enterprise AI workforce in the Viktron cloud." />

      <section className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">
            {step === 'INITIAL' && (
              <FU key="initial" className="space-y-12">
                 <div className="text-center">
                    <Label>ENVIRONMENT_INITIALIZATION</Label>
                    <h1 className="heading-precision text-5xl text-white uppercase tracking-tighter mt-8 mb-4">Deploy Your<br /><span className="text-zinc-700">Workforce.</span></h1>
                    <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">Let's provision your institutional AI environment and initialize the AgentIRL Trust Fabric.</p>
                 </div>

                 <div className="obsidian-panel p-10 space-y-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">WORKPLACE_DOMAIN</label>
                          <input 
                            type="text" 
                            placeholder="viktron.ai" 
                            className="w-full bg-[#080808] border border-white/5 px-6 py-4 font-mono text-[11px] text-white outline-none focus:border-primary transition-all uppercase tracking-widest"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest ml-1">PRIMARY_OBJECTIVE</label>
                          <select className="w-full bg-[#080808] border border-white/5 px-6 py-4 font-mono text-[11px] text-zinc-500 outline-none focus:border-primary transition-all uppercase tracking-widest">
                             <option>GROWTH_AUTOMATION</option>
                             <option>CUSTOMER_OPERATIONS</option>
                             <option>ENGINEERING_SCALE</option>
                          </select>
                       </div>
                    </div>

                    <button 
                      onClick={startProvisioning}
                      className="w-full btn-acid py-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em]"
                    >
                       Initialize Protocol <ArrowRight size={16} />
                    </button>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    {[Zap, Shield, Globe].map((Icon, i) => (
                      <div key={i} className="obsidian-inset p-4 flex items-center justify-center text-zinc-800 border border-white/5">
                         <Icon size={16} />
                      </div>
                    ))}
                 </div>
              </FU>
            )}

            {step === 'PROVISIONING' && (
              <FU key="provisioning" className="text-center space-y-12">
                 <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-spin" style={{ animationDuration: '4s' }} />
                    <div className="absolute inset-4 rounded-full border border-primary/10 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Activity className="text-primary animate-pulse" size={32} />
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h2 className="text-white font-bold text-2xl uppercase tracking-tighter">PROVISIONING_ENVIRONMENT</h2>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Allocating_Resources_for_{user?.id || 'USER'}</p>
                 </div>

                 <div className="max-w-xs mx-auto space-y-2">
                    {['SPAWNING_CEO_ORCHESTRATOR', 'INITIALIZING_TRUST_FABRIC', 'WIRING_OTLP_TELEMETRY'].map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.8 }}
                        className="flex items-center gap-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest"
                      >
                         <div className="w-1 h-1 rounded-full bg-primary" />
                         {log}
                      </motion.div>
                    ))}
                 </div>
              </FU>
            )}

            {step === 'SUCCESS' && (
              <FU key="success" className="text-center space-y-12">
                 <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(204,255,0,0.15)]">
                    <CheckCircle2 className="text-primary" size={40} />
                 </div>

                 <div className="space-y-4">
                    <h2 className="text-white font-bold text-4xl uppercase tracking-tighter">DEPLOYED.</h2>
                    <p className="text-zinc-500 text-sm max-w-xs mx-auto">Your institutional AI workforce is now operational in the Viktron cloud.</p>
                 </div>

                 <div className="obsidian-panel p-8 border-primary/20 text-left">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">DEPLOYMENT_SUMMARY</span>
                       <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">MAR 28, 2026</span>
                    </div>
                    <div className="space-y-3 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                       <div className="flex justify-between"><span>Active_Nodes</span><span className="text-white">12</span></div>
                       <div className="flex justify-between"><span>Trust_Score</span><span className="text-white">0.998</span></div>
                       <div className="flex justify-between"><span>Gateway_Status</span><span className="text-primary">LOCKED</span></div>
                    </div>
                 </div>

                 <button 
                   onClick={() => navigate('/analytics')}
                   className="btn-acid px-12 py-5 uppercase font-black tracking-widest text-xs"
                 >
                    Enter Control Plane
                 </button>
              </FU>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};
