/**
 * Viktron AI — Case Studies
 * "Institutional Performance Proofs."
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { 
  ArrowRight, BarChart3, ShieldCheck, Users, Zap, 
  TrendingUp, Award, Activity, Globe, Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

const studies = [
  {
    client: "Global FinTech Corp",
    title: "COMPLIANCE_AUDIT_AUTOMATION",
    desc: "A leading $2.3B financial services provider manages regulatory compliance across 40+ jurisdictions. Reduced review cycle from 6 weeks to 2 days.",
    metrics: [
      { label: "Audit Coverage", value: "100%" },
      { label: "Processing Time", value: "-92%" },
      { label: "False Positives", value: "<0.1%" }
    ],
    tags: ["Finance", "RegTech"],
  },
  {
    client: "TechFlow Enterprise",
    title: "SUPPORT_DEFLECTION_SYSTEM",
    desc: "TechFlow, a $500M SaaS company, deployed a multi-agent support system that now handles 85% of tickets end-to-end with high CSAT.",
    metrics: [
      { label: "Ticket Deflection", value: "85%" },
      { label: "CSAT Score", value: "4.8/5" },
      { label: "Resolution Time", value: "2m avg" }
    ],
    tags: ["SaaS", "CX"],
  },
  {
    client: "GrowthScale Inc",
    title: "SALES_PIPELINE_ORCHESTRATOR",
    desc: "GrowthScale deployed a Sales Agent Team to automate prospect research and personalized outreach, tripling qualified lead volume.",
    metrics: [
      { label: "Qualified Leads", value: "3x" },
      { label: "Response Rate", value: "+40%" },
      { label: "Manual Work", value: "-15h/wk" }
    ],
    tags: ["Sales", "CRM"],
  }
];

export const CaseStudies = () => {
  return (
    <Layout showBackground={false}>
      <SEO
        title="AI Agent Case Studies — 99.9% Reliability, 92% Cost Reduction — Viktron"
        description="Real-world results from Viktron AI agent deployments: 99.9% uptime reliability, up to 92% cost reduction vs. traditional staffing, 24/7 autonomous operation. See how restaurants, clinics, law firms, and e-commerce businesses deploy AI agent teams."
        keywords="AI agent case studies, AI automation results, AI agent ROI, enterprise AI examples, Viktron case studies, AI cost reduction, business AI results"
      />

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
           <FU d={0}>
              <Label>PERFORMANCE_AUDITS // v2.2</Label>
              <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                 PROVEN<br />
                 <span className="text-zinc-700">AUTHORITY.</span>
              </h1>
              <p className="heading-editorial text-2xl text-zinc-300 mt-12 max-w-3xl mx-auto">
                 Institutional-grade results across finance, healthcare, and tech.
              </p>
           </FU>
        </div>
      </section>

      {/* ─── METRICS ─── */}
      <section className="py-20 bg-[#050505] border-y border-white/5 relative">
         <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 overflow-hidden">
            {[
              { v: '92%', l: 'Processing Speedup', s: 'v2.2_OPTIMIZED' },
              { v: '3.2x', l: 'Productivity Lift', s: 'v2.2_OPTIMIZED' },
              { v: '$850K', l: 'Avg Annual Savings', s: 'v2.2_OPTIMIZED' },
            ].map((m, i) => (
              <FU key={i} d={i * 0.05} className="bg-[#050505] p-16 text-center">
                 <div className="text-6xl font-black text-white mb-2 tracking-tighter">{m.v}</div>
                 <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{m.l}</div>
                 <div className="text-[8px] font-mono text-primary/40 uppercase tracking-widest">{m.s}</div>
              </FU>
            ))}
         </div>
      </section>

      {/* ─── STUDIES ─── */}
      <section className="py-40 bg-[#050505]">
         <div className="max-w-[1400px] mx-auto px-6 space-y-20">
            {studies.map((s, i) => (
              <FU key={s.client} d={i * 0.1}>
                 <div className="obsidian-panel p-12 lg:p-20 relative group hover:border-primary/40 transition-all">
                    <div className="scan-line opacity-10" />
                    <div className="flex flex-col lg:flex-row gap-20">
                       <div className="flex-1 space-y-10">
                          <div className="flex items-center gap-6">
                             <div className="px-4 py-1 obsidian-inset text-[10px] font-mono text-primary font-bold tracking-widest uppercase">
                                {s.client}
                             </div>
                             <div className="flex gap-2">
                                {s.tags.map(t => (
                                  <span key={t} className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{t}</span>
                                ))}
                             </div>
                          </div>
                          <h2 className="text-white font-bold text-5xl lg:text-7xl uppercase tracking-tighter leading-none">{s.title}</h2>
                          <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">{s.desc}</p>
                          <Link to="/contact" className="btn-acid !px-12 !py-6 inline-flex items-center gap-4">
                             Request Full Audit <ArrowRight size={18} />
                          </Link>
                       </div>
                       <div className="lg:w-1/3 space-y-12">
                          <Label>KEY_METRICS</Label>
                          <div className="space-y-8">
                             {s.metrics.map((m, j) => (
                               <div key={j} className="border-b border-white/5 pb-6 last:border-0">
                                  <div className="text-4xl font-black text-white tracking-tighter mb-1">{m.value}</div>
                                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{m.label}</div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </FU>
            ))}
         </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-60 bg-[#080808] border-t border-white/5 text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  SELECT<br />
                  <span className="text-zinc-700">IMPACT.</span>
               </h2>
               <Link to="/contact" className="btn-acid px-16 py-6 inline-block">Consult an Architect</Link>
            </FU>
         </div>
      </section>
    </Layout>
  );
};
