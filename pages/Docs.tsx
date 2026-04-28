/**
 * Viktron AI — Developer Documentation
 * "API Architecture & Infrastructure Hooks."
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Terminal, Server, Key, BookOpen, Layers, Shield, 
  ArrowRight, Activity, Globe, Cpu, Check 
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

export const Docs = () => {
  return (
    <Layout showBackground={false}>
      <SEO 
        title="Developer Docs — Viktron AI Agent Infrastructure" 
        description="API documentation for the Viktron Intelligent Layer. Integrate AgentIRL orchestration, governance, and audit logging."
      />
      
      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
           <FU d={0}>
              <Label>SYSTEM_ARCHITECTURE // API_v2.2</Label>
              <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                 CORE<br />
                 <span className="text-zinc-700">PROTOCOLS.</span>
              </h1>
              <p className="heading-editorial text-2xl text-zinc-300 mt-12 max-w-3xl">
                 Embed production-ready AI agents into your product with the Viktron API. 
                 Get full access to the AgentIRL engine and the immutable trust ledger.
              </p>
           </FU>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="py-20 bg-[#050505] relative border-t border-white/5">
         <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
               
               {/* Sidebar Nav */}
               <div className="lg:col-span-1 space-y-6">
                  <FU d={0.1}>
                    <div className="obsidian-panel p-8 space-y-8">
                       <div>
                          <h3 className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.2em] mb-6 font-bold">GETTING_STARTED</h3>
                          <ul className="space-y-4">
                             {['Authentication', 'Rate Limits', 'SDKs (Python/Node)', 'Error Codes'].map(item => (
                               <li key={item}>
                                  <a href="#" className="text-[11px] font-mono text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest">{item}</a>
                               </li>
                             ))}
                          </ul>
                       </div>
                       <div className="pt-8 border-t border-white/5">
                          <h3 className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.2em] mb-6 font-bold">RESOURCES</h3>
                          <ul className="space-y-4">
                             {['Postman Collection', 'Swagger UI', 'Github Examples'].map(item => (
                               <li key={item}>
                                  <a href="#" className="text-[11px] font-mono text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest">{item}</a>
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                  </FU>
               </div>

               {/* Main Content */}
               <div className="lg:col-span-3 space-y-12">
                  
                  {/* Endpoint 1 */}
                  <FU d={0.2}>
                    <div className="obsidian-panel p-12 space-y-8 relative overflow-hidden">
                       <div className="scan-line opacity-10" />
                       <div className="flex items-center gap-6 mb-4">
                          <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-primary">
                             <Terminal size={20} />
                          </div>
                          <h2 className="text-white font-bold text-3xl uppercase tracking-tighter">Initialize_Mission</h2>
                       </div>
                       <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">
                          Trigger an autonomous workflow with a specific governance policy attached to the AgentIRL instance.
                       </p>
                       <div className="obsidian-inset p-8 font-mono text-[11px] space-y-4 relative overflow-hidden">
                          <div className="flex justify-between text-zinc-600 mb-6 uppercase tracking-widest font-bold">
                             <span>POST /api/agentirl/missions</span>
                             <span>vk_auth_v2.2</span>
                          </div>
                          <div className="text-zinc-400">
                             <span className="text-primary">curl</span> -X POST https://api.viktron.ai/api/missions \<br />
                             &nbsp;&nbsp;-H <span className="text-white">"Authorization: Bearer vk_live_xxxx"</span> \<br />
                             &nbsp;&nbsp;-d <span className="text-white">'{'{'}</span><br />
                             &nbsp;&nbsp;&nbsp;&nbsp;"goal": "Q3_INVOICE_PROCESSING",<br />
                             &nbsp;&nbsp;&nbsp;&nbsp;"policy": "STR_001_COMPLY"<br />
                             &nbsp;&nbsp;<span className="text-white">{'}'}'</span>
                          </div>
                       </div>
                    </div>
                  </FU>

                  {/* Endpoint 2 */}
                  <FU d={0.3}>
                    <div className="obsidian-panel p-12 space-y-8 relative overflow-hidden">
                       <div className="scan-line opacity-10" />
                       <div className="flex items-center gap-6 mb-4">
                          <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-primary">
                             <Shield size={20} />
                          </div>
                          <h2 className="text-white font-bold text-3xl uppercase tracking-tighter">Verify_Audit_Signature</h2>
                       </div>
                       <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">
                          Fetch a cryptographically signed audit log for compliance verification across any mission runtime.
                       </p>
                       <div className="obsidian-inset p-8 font-mono text-[11px] space-y-4 relative overflow-hidden">
                          <div className="flex justify-between text-zinc-600 mb-6 uppercase tracking-widest font-bold">
                             <span>GET /api/trust/verify/{'{mission_id}'}</span>
                             <span>SHA-256</span>
                          </div>
                          <div className="text-zinc-400">
                             <span className="text-white">{'{'}</span><br />
                             &nbsp;&nbsp;"status": "VERIFIED",<br />
                             &nbsp;&nbsp;"signature": "a3f9e...88b2c",<br />
                             &nbsp;&nbsp;"decision_count": 142,<br />
                             &nbsp;&nbsp;"destructive_blocks": 3<br />
                             <span className="text-white">{'}'}</span>
                          </div>
                       </div>
                    </div>
                  </FU>

               </div>
            </div>
         </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-60 bg-[#080808] border-t border-white/5 text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  AUTHORIZE<br />
                  <span className="text-zinc-700">CODE.</span>
               </h2>
               <div className="flex flex-wrap justify-center gap-6">
                  <a href="#" className="btn-acid px-16 py-6">Request API Access</a>
                  <Link to="/contact" className="btn-obsidian px-16 py-6">Consult an Architect</Link>
               </div>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
