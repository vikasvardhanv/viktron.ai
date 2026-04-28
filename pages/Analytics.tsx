/**
 * Viktron AI — Analytics & Observability
 * "Real-time Telemetry & Provenance."
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, BarChart3, Activity, Eye, TrendingUp, Zap, 
  CheckCircle2, Database, Layers, Shield, Clock, Users, 
  Target, DollarSign, MessageSquare, PieChart, LineChart, 
  Download, RefreshCw, Globe, Network, Cpu
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

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

const metrics = [
  { value: '2,847', label: 'WORKFORCE_NODES', change: '+23%', icon: Users },
  { value: '1,204', label: 'TASK_CONVERSIONS', change: '+41%', icon: MessageSquare },
  { value: '$8.47', label: 'AVG_TASK_LATENCY', change: '-12%', icon: Clock },
  { value: '99.9%', label: 'AUTH_SUCCESS_RATE', change: '+0.1%', icon: Shield },
];

const features = [
  { icon: Activity, title: 'Live Activity Feed', desc: 'Real-time telemetry stream of every agent action: intent, decision logic, and tool output.' },
  { icon: BarChart3, title: 'Revenue Attribution', desc: 'Quantify the financial impact of your AI workforce. Map agent decisions to ROI metrics.' },
  { icon: Target, title: 'Reasoning Audit', desc: 'Drill down into LLM reasoning chains to eliminate hallucinations and optimize performance.' },
  { icon: RefreshCw, title: 'Session Replay', desc: 'Full-fidelity replay of agent-user interactions for rapid debugging and refinement.' },
  { icon: Download, title: 'OTLP Export', desc: 'Pipe all telemetry to Datadog, Grafana, or any OpenTelemetry-compatible backend.' },
  { icon: Cpu, title: 'Model Benchmarking', desc: 'Compare accuracy and cost across OpenAI, Anthropic, and Gemini in real-time.' },
];

const feedLines = [
  { time: '10:42:31', agent: 'CEO_ORCH', action: 'Spawned SALES_QLF lead qualification', status: 'success' },
  { time: '10:42:35', agent: 'SALES_QLF', action: 'Scored lead: 87% match (high intent)', status: 'success' },
  { time: '10:42:38', agent: 'SALES_QLF', action: 'Injected DEMO_INVITE via Outlook', status: 'success' },
  { time: '10:42:45', agent: 'SUPPORT_V3', action: 'Resolved ticket #4891: CSV_EXPORT_ERR', status: 'success' },
];

export const Analytics: React.FC = () => {
  const [currentRow, setCurrentRow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentRow(p => (p + 1) % feedLines.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout showBackground={false}>
      <SEO title="AI Analytics & Observability — Viktron AI" description="Real-time telemetry and provenance for autonomous agent teams. OTLP export, ROI attribution, and reasoning audits." />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen bg-[#050505] flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-20 items-center">
            <div className="space-y-12">
              <FU d={0}>
                <div className="flex items-center gap-3 font-mono text-[10px] text-primary tracking-[0.3em] uppercase font-bold text-glow">
                  <div className="w-12 h-px bg-primary" />
                  TELEMETRY_ENGINE // v4.2
                </div>
              </FU>
              <FU d={0.1}>
                <h1 className="heading-precision text-7xl md:text-9xl text-white leading-[0.85] tracking-[-0.05em] uppercase font-black">
                  SEE<br />
                  <span className="text-zinc-700">EVERYTHING.</span>
                </h1>
                <p className="heading-editorial text-3xl md:text-4xl text-zinc-300 mt-10 max-w-xl">
                  Real-time observability for autonomous intelligence.
                </p>
              </FU>
              <FU d={0.2}>
                <p className="max-w-xl text-zinc-400 text-lg leading-relaxed">
                  Viktron Analytics provides Amplitude-grade visibility into your agent 
                  workforce. Track provenance, attribute revenue, and monitor health 
                  at sub-50ms latency.
                </p>
              </FU>
              <FU d={0.3} className="flex gap-6">
                <Link to="/contact" className="btn-acid">View Live Dashboard</Link>
                <Link to="/enterprise" className="btn-obsidian">Data Specs</Link>
              </FU>
            </div>

            <FU d={0.4} className="relative group">
              <div className="obsidian-panel p-12 relative overflow-hidden group shimmer">
                 <div className="scan-line opacity-20" />
                 <div className="space-y-8 font-mono text-[10px]">
                    <div className="flex justify-between text-primary font-bold tracking-widest text-glow">
                       <span>PROVENANCE_STREAM</span>
                       <span className="animate-pulse">● LIVE</span>
                    </div>
                    <div className="space-y-4">
                       {feedLines.map((line, i) => (
                         <div key={i} className={`flex gap-6 border-b border-white/5 pb-4 transition-all duration-500 ${currentRow === i ? 'text-primary' : 'text-zinc-600'}`}>
                            <span className="w-16">[{line.time}]</span>
                            <span className="w-24 uppercase">{line.agent}</span>
                            <span className="flex-1 opacity-80">{line.action}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-8 glass-bone hidden xl:block">
                 <div className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest mb-4">COST_ATTRIBUTION</div>
                 <div className="text-3xl font-black text-white tracking-tighter">$0.0024</div>
                 <div className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest">AVG_PER_TASK_RUN</div>
              </div>
            </FU>
          </div>
        </div>
      </section>

      {/* ══════════════════ METRICS ══════════════════ */}
      <section className="py-20 bg-[#050505] border-y border-white/5 relative">
         <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 overflow-hidden">
               {metrics.map((m, i) => {
                 const Icon = m.icon;
                 return (
                   <FU key={i} d={i * 0.05} className="bg-[#050505] p-12 text-center group hover:bg-[#080808] transition-colors">
                      <div className="w-10 h-10 obsidian-inset flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors mx-auto mb-6">
                         <Icon size={18} />
                      </div>
                      <div className="text-4xl font-black text-white mb-2 tracking-tighter">{m.value}</div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{m.label}</div>
                      <div className="text-[10px] font-mono text-primary font-bold tracking-widest">{m.change}</div>
                   </FU>
                 );
               })}
            </div>
         </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section className="py-40 bg-[#080808] relative">
         <div className="max-w-7xl mx-auto px-6">
            <Label>TELEMETRY_PILLARS</Label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
               {features.map((f, i) => {
                 const Icon = f.icon;
                 return (
                   <FU key={i} d={i * 0.05} className="obsidian-panel p-12 space-y-8 group hover:border-primary/40 transition-all">
                      <div className="w-14 h-14 obsidian-inset flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                         <Icon size={28} />
                      </div>
                      <h3 className="text-white font-bold text-xl uppercase tracking-tighter">{f.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                   </FU>
                 );
               })}
            </div>
         </div>
      </section>

      {/* ══════════════════ INTEGRATIONS ══════════════════ */}
      <section className="py-40 bg-[#050505] relative border-t border-white/5 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
               <Label>DATA_EXPORT</Label>
               <h2 className="heading-precision text-6xl text-white uppercase tracking-tighter leading-[0.85] mt-10">Pipe to your<br />Stack.</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
               {['DATADOG', 'GRAFANA', 'SNOWFLAKE', 'LOOKER', 'TABLEAU', 'OTLP'].map((tool, i) => (
                 <FU key={i} d={i * 0.05} className="obsidian-panel p-8 text-center flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 group">
                    <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-zinc-600 group-hover:text-primary">{tool}</span>
                 </FU>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-60 bg-[#050505] text-center relative overflow-hidden border-t border-white/5">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  MEASURE<br />
                  IMPACT.
               </h2>
               <Link to="/contact" className="btn-acid px-16 py-6">Activate Telemetry</Link>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
