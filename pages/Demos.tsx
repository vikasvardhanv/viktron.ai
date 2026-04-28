/**
 * Viktron AI — Capabilities & Demos
 * "Explore the Workforce Architecture."
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BarChart3, Bot, Brain, Calendar, Cpu,
  MessageSquare, Mic, Network, Play, Sparkles, Target, Users,
  Wand2, Workflow, Activity, Shield, Zap
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

const capabilities = [
  {
    icon: Users,
    title: 'AI_Agent_Teams',
    desc: 'Coordinated teams of Sales, Support, Content, and CEO agents that work together 24/7.',
    link: '/rent',
  },
  {
    icon: Network,
    title: 'Multi-Agent_Orchestration',
    desc: 'Deploy and manage multiple agents with task delegation and parallel execution.',
    link: '/services/agentirl',
  },
  {
    icon: Mic,
    title: 'Voice_&_Chat_Agents',
    desc: 'AI-powered voice and chat agents for phone support, WhatsApp, and live web chat.',
    link: '/services/voice-ai-agent',
  },
  {
    icon: Workflow,
    title: 'Workflow_Automation',
    desc: 'Automate repetitive business processes — lead follow-ups, scheduling, and reporting.',
    link: '/services/workflow-automation',
  },
  {
    icon: Target,
    title: 'Lead_Generation_&_Sales',
    desc: 'AI agents that qualify leads, respond in seconds, and book appointments automatically.',
    link: '/services/ai-sales-agent',
  },
  {
    icon: Wand2,
    title: 'AI_Content_Generation',
    desc: 'Social posts, emails, and marketing copy trained on your brand voice.',
    link: '/services/content-marketing-ai',
  },
  {
    icon: BarChart3,
    title: 'Analytics_&_Observability',
    desc: 'Real-time monitoring of agent performance, visitor tracking, and conversion analytics.',
    link: '/analytics',
  },
  {
    icon: Brain,
    title: 'AI_Audit_&_Consulting',
    desc: 'ROI analysis, technical feasibility, vendor selection, and implementation roadmaps.',
    link: '/services/ai-audit-consulting',
  },
];

const industries = [
  'RESTAURANTS', 'MEDICAL', 'REAL ESTATE', 'LEGAL',
  'E-COMMERCE', 'EDUCATION', 'SALONS', 'DEALERSHIPS',
  'CONSTRUCTION', 'RECRUITMENT', 'FINANCE', 'SAAS',
];

export const Demos: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO title="AI Capabilities & Demos — Viktron Agent Platform" description="Explore Viktron's full AI capabilities — autonomous agent teams, voice AI, and workflow automation." />

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
           <FU d={0}>
              <Label>CAPABILITIES_MANIFEST // v2.2</Label>
              <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                 WHAT WE<br />
                 <span className="text-zinc-700">BUILD.</span>
              </h1>
              <p className="heading-editorial text-2xl text-zinc-300 mt-12 max-w-3xl mx-auto">
                 Production-ready solutions backed by the AgentIRL platform.
              </p>
           </FU>
        </div>
      </section>

      {/* ─── GRID ─── */}
      <section className="py-20 bg-[#050505] relative">
         <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <FU key={cap.title} d={i * 0.05}>
                 <Link to={cap.link} className="block group h-full">
                    <div className="obsidian-panel p-10 h-full flex flex-col hover:border-primary/40 transition-all">
                       <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-zinc-500 group-hover:text-primary mb-10 transition-colors">
                          <cap.icon size={22} />
                       </div>
                       <div className="flex-1 space-y-4">
                          <h3 className="text-white font-bold text-xl uppercase tracking-tighter group-hover:text-primary transition-colors">{cap.title}</h3>
                          <p className="text-zinc-500 text-sm leading-relaxed">{cap.desc}</p>
                       </div>
                       <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Explore_Module</span>
                          <ArrowRight size={14} className="text-zinc-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                       </div>
                    </div>
                 </Link>
              </FU>
            ))}
         </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section className="py-20 bg-[#050505]">
         <div className="max-w-[1400px] mx-auto px-6">
            <div className="obsidian-panel p-12 relative overflow-hidden">
               <div className="scan-line opacity-10" />
               <Label>VERTICAL_COVERAGE</Label>
               <div className="flex flex-wrap gap-4 mt-12">
                  {industries.map(ind => (
                    <div key={ind} className="px-6 py-2 border border-white/5 bg-white/[0.02] text-[10px] font-mono text-zinc-400 font-bold tracking-[0.2em] uppercase">
                       {ind}
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-60 bg-[#080808] border-t border-white/5 text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[120px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  AUTHORIZE<br />
                  <span className="text-zinc-700">DEMO.</span>
               </h2>
               <div className="flex flex-wrap justify-center gap-6">
                  <Link to="/contact" className="btn-acid px-16 py-6">Deploy Sandbox</Link>
                  <Link to="/services" className="btn-obsidian px-16 py-6">Service Catalog</Link>
               </div>
            </FU>
         </div>
      </section>
    </Layout>
  );
};

export const DemoWrapper: React.FC<{ children: React.ReactNode; title: string; description?: string }> = ({ children, title, description }) => {
  const navigate = useNavigate();

  return (
    <Layout showFooter={false} showBackground={false}>
      <SEO title={`${title} — Viktron AI Demo`} description={description} noindex={true} />
      <div className="pt-32 pb-8 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/demos')} 
                className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              >
                 <ArrowLeft size={16} />
              </button>
              <h2 className="text-white font-bold text-xl uppercase tracking-tighter">{title}</h2>
           </div>
           <div className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase animate-pulse">
              ● LIVE_DEMO_INSTANCE
           </div>
        </div>
      </div>
      <div className="min-h-[calc(100vh-200px)] bg-[#050505]">{children}</div>
    </Layout>
  );
};
