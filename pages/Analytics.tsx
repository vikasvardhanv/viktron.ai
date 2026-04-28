/**
 * Viktron AI — AI Analytics & Telemetry
 * "Institutional-grade intelligence for the autonomous era."
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, BarChart3, PieChart, TrendingUp, Zap, Shield, 
  Database, Globe, ArrowRight, MousePointer2, Fingerprint, Search
} from 'lucide-react';
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

export const Analytics: React.FC = () => {
  return (
    <Layout showBackground={false}>
      <SEO 
        title="AI Analytics — Full-Spectrum Intelligence Control" 
        description="Viktron AI Analytics provides institutional-grade telemetry for autonomous agent workforces. Beyond Amplitude. Beyond Profound." 
      />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen bg-[#050505] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-24 items-center">
            <div className="space-y-12">
              <FU d={0}>
                <Label>INTELLIGENCE_LAYER // v4.0</Label>
                <h1 className="heading-precision text-7xl md:text-8xl lg:text-[130px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black">
                  AGENT<br />
                  <span className="text-zinc-700">INSIGHTS.</span>
                </h1>
                <p className="heading-editorial text-3xl text-zinc-300 mt-8 max-w-xl">
                  Institutional-grade telemetry for the autonomous workforce.
                </p>
              </FU>

              <FU d={0.2} className="space-y-8">
                <p className="max-w-xl text-zinc-400 text-lg leading-relaxed">
                  Viktron Analytics is the **Command Center** for your AI agents. 
                  We provide deep-stack observability into every decision, reasoning chain, 
                  and cost center across your entire company.
                </p>
                <div className="flex flex-wrap items-center gap-8">
                   <a href="https://analytics.viktron.ai" className="btn-acid px-12 py-6">Run My Analytics</a>
                   <div className="flex items-center gap-4 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
                      <Zap size={14} className="text-primary" />
                      SUB-50MS LATENCY
                   </div>
                </div>
              </FU>
            </div>

            <FU d={0.4} className="relative group">
               <div className="obsidian-panel p-1 border-primary/20 relative shimmer overflow-hidden">
                  <div className="scan-line" />
                  {/* Mock Analytics Dashboard Visualization */}
                  <div className="bg-black aspect-square md:aspect-video rounded-lg overflow-hidden relative">
                     <img src="/assets/branding/analytics.png" alt="Analytics Dashboard" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                     
                     {/* Data HUD Overlays */}
                     <div className="absolute bottom-8 left-8 p-6 glass-bone font-mono text-[10px] space-y-4">
                        <div className="text-primary font-black uppercase tracking-[0.3em]">REASONING_CHAIN_ACTIVE</div>
                        <div className="space-y-2">
                           <div className="flex justify-between gap-12"><span>LLM_RELIABILITY</span> <span className="text-primary">99.98%</span></div>
                           <div className="flex justify-between gap-12"><span>TOKEN_EFFICIENCY</span> <span className="text-primary">+42.4%</span></div>
                           <div className="flex justify-between gap-12"><span>COST_PER_AGENT</span> <span className="text-primary">$0.04/hr</span></div>
                        </div>
                     </div>
                  </div>
               </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════ 01: THE ANALYTICS STACK ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FU d={0}>
            <Label>FULL_STACK_INTELLIGENCE</Label>
            <h2 className="heading-precision text-6xl md:text-9xl text-white uppercase tracking-tighter mt-12 mb-20 leading-[0.85]">
              Beyond<br />
              <span className="text-zinc-700">Amplitude.</span>
            </h2>
          </FU>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MousePointer2, t: 'Event Telemetry', d: 'Track every agent action, tool call, and human hand-off in real-time.' },
              { icon: Search, t: 'Reasoning Replay', d: 'Visual inspection of the chain-of-thought that led to any decision.' },
              { icon: TrendingUp, t: 'Cost Governance', d: 'Detailed heatmaps of LLM spend across departments and workflows.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <FU key={i} d={i * 0.1} className="obsidian-panel p-12 space-y-8 group hover:border-primary/50 transition-all">
                   <div className="w-12 h-12 obsidian-inset flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                      <Icon size={24} />
                   </div>
                   <h3 className="text-white font-bold text-lg uppercase tracking-tight">{f.t}</h3>
                   <p className="text-zinc-500 text-sm leading-relaxed font-mono uppercase tracking-widest text-[10px]">{f.d}</p>
                </FU>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ 02: THE ALGORITHM ══════════════════ */}
      <section className="py-40 bg-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <FU d={0}>
               <Label>THE_ALGORITHM</Label>
               <h2 className="heading-precision text-6xl text-white uppercase tracking-tighter mt-10 mb-10">Neural<br />Provenance.</h2>
               <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                  Our proprietary algorithm analyzes agentic behavior vectors to 
                  detect hallucinations, measure reasoning depth, and optimize 
                  token routing. It's the first analytics engine designed for 
                  non-deterministic workflows.
               </p>
               <div className="space-y-6">
                  {[
                    { l: 'VECTOR_SIMILARITY', v: '0.982' },
                    { l: 'REASONING_ENTROPY', v: '0.041' },
                    { l: 'MODEL_ALIGNMENT', v: '99.7%' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-8">
                       <div className="w-full h-1.5 obsidian-inset relative overflow-hidden">
                          <motion.div 
                             className="absolute inset-y-0 left-0 bg-primary"
                             initial={{ width: 0 }}
                             whileInView={{ width: m.v }}
                             viewport={{ once: true }}
                             transition={{ duration: 1.5, delay: i * 0.2 }}
                          />
                       </div>
                       <div className="min-w-[120px] font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                          {m.l} // <span className="text-white">{m.v}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </FU>
            <FU d={0.2}>
               <div className="obsidian-panel p-16 relative shimmer group">
                  <div className="scan-line opacity-20" />
                  <img src="/assets/branding/moat.png" alt="Algorithm Visualization" className="w-full h-full object-contain grayscale brightness-90 group-hover:brightness-110 transition-all duration-1000" />
               </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-60 bg-[#050505] text-center relative overflow-hidden border-t border-white/5">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  COMMAND<br />
                  <span className="text-zinc-700">ALL.</span>
               </h2>
               <a href="https://analytics.viktron.ai" className="btn-acid px-16 py-6">Initialize Analytics</a>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
