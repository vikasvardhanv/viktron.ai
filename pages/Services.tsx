/**
 * Viktron AI — Institutional Services
 * "The Full-Stack Ecosystem for Autonomous Intelligence."
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { 
  ArrowRight, CheckCircle2, Users, Cpu, BarChart3, Sparkles, Zap, 
  ShieldCheck, Activity, Database, Globe
} from 'lucide-react';

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

const SERVICES = [
  {
    id: 'AGENT',
    title: 'AGENT_FORCES',
    desc: 'Deploy autonomous specialist teams for Sales, Support, and Content with zero human overhead.',
    icon: Users,
    path: '/onboarding',
    meta: 'AUTONOMOUS_WORKFORCE',
  },
  {
    id: 'AGENTIRL',
    title: 'AGENTIRL_CORE',
    desc: 'Enterprise infrastructure for multi-agent orchestration, monitoring, and production reliability.',
    icon: Cpu,
    path: '/services/agentirl',
    meta: 'INFRASTRUCTURE_RUNTIME',
  },
  {
    id: 'ANALYTICS',
    title: 'AI_TELEMETRY',
    desc: 'Track reasoning chains and conversion funnels with sub-50ms observability and expert consulting.',
    icon: BarChart3,
    path: 'https://analytics.viktron.ai',
    meta: 'INTELLIGENCE_OBSERVABILITY',
    external: true,
  },
  {
    id: 'RENTALS',
    title: 'AGENT_RENTALS',
    desc: 'On-demand registry for renting pre-built agents by the hour or day. Instant deployment.',
    icon: Sparkles,
    path: '/rent',
    meta: 'GLOBAL_REGISTRY',
  }
];

export const Services: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO
        title="AI Agent Infrastructure Services — Viktron"
        description="Viktron's 4 core products: AgentIRL (multi-agent orchestration runtime), Trust Fabric (SOC 2 AI governance), Analytics Suite (real-time agent observability), and Agent Marketplace (pre-trained industry agents). Enterprise-grade. Plans from $199/month."
        keywords="AI agent services, multi-agent orchestration, AI governance, AgentIRL platform, Trust Fabric, AI observability, enterprise AI infrastructure, AI automation services"
      />

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
           <FU d={0}>
              <Label>SYSTEM_ARCHETYPES // ECOSYSTEM_v2.2</Label>
              <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                 CORE<br />
                 <span className="text-zinc-700">STACK.</span>
              </h1>
              <p className="heading-editorial text-2xl text-zinc-300 mt-12 max-w-2xl mx-auto">
                 The full-stack ecosystem for building, deploying, and scaling autonomous workforces.
              </p>
           </FU>
        </div>
      </section>

      {/* ─── GRID ─── */}
      <section className="py-20 bg-[#050505] relative min-h-screen">
         <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((s, i) => (
              <FU key={s.id} d={i * 0.05}>
                 <div className="obsidian-panel p-12 h-full flex flex-col group hover:border-primary/40 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-12">
                       <div className="w-16 h-16 obsidian-inset flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all text-zinc-500 group-hover:text-primary">
                          <s.icon size={28} />
                       </div>
                       <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{s.meta}</span>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                       <h3 className="text-white font-bold text-4xl uppercase tracking-tighter group-hover:text-primary transition-colors">{s.title}</h3>
                       <p className="text-zinc-500 text-lg leading-relaxed max-w-md">{s.desc}</p>
                    </div>

                    <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                             <ShieldCheck size={14} /> SOC2_READY
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                             <Activity size={14} /> 99.9%_UPTIME
                          </div>
                       </div>
                       {s.external ? (
                         <a href={s.path} target="_blank" rel="noopener noreferrer" className="btn-acid !px-10 !py-4 !text-[10px]">Initialize</a>
                       ) : (
                         <Link to={s.path} className="btn-acid !px-10 !py-4 !text-[10px]">Initialize</Link>
                       )}
                    </div>
                 </div>
              </FU>
            ))}
         </div>
      </section>

      {/* ─── INFRASTRUCTURE ─── */}
      <section className="py-40 bg-[#080808] border-y border-white/5 relative">
         <div className="max-w-7xl mx-auto px-6">
            <Label>PLATFORM_CAPABILITIES</Label>
            <div className="grid md:grid-cols-3 gap-16 mt-20">
               {[
                 { icon: Globe, t: 'Global Deployment', d: 'Deploy agents across 12+ regions with sub-50ms orchestration latency.' },
                 { icon: Database, t: 'Provenance Ledger', d: 'Every agent action is recorded on an immutable ledger for institutional audit.' },
                 { icon: Zap, t: 'Real-time Telemetry', d: 'Monitor reasoning chains and token efficiency through OTLP-native streams.' },
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

      {/* ─── CTA ─── */}
      <section className="py-60 bg-[#050505] text-center relative overflow-hidden">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  COMMAND<br />
                  <span className="text-zinc-700">READY.</span>
               </h2>
               <Link to="/contact" className="btn-acid px-16 py-6 inline-block">Consult Our Architects</Link>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
