/**
 * Viktron AI — Use Cases
 * "Deployment Scenarios & Performance Proofs."
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Building2, Rocket, Globe, Users, Bot, CheckCircle2,
  Workflow, Phone, MessageSquare, BarChart3, Briefcase, Store,
  Stethoscope, Utensils, GraduationCap, Scale, Truck, Home,
  Sparkles, Shield, BrainCircuit, TrendingUp, Zap, Target, Activity
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

const FILTERS = ['ALL', 'ENTERPRISE', 'MID-SIZE', 'STARTUP', 'SMB'];

const USE_CASES = [
  {
    title: 'Financial Services — Governance-as-Code',
    segment: 'ENTERPRISE',
    industry: 'Finance',
    icon: Globe,
    desc: 'Automated 8 departments including Compliance, HR, and Finance using AgentIRL.',
    agents: ['Compliance Agent', 'Finance Agent', 'HR Orchestrator'],
    results: [
      { metric: '100%', label: 'Audit Provenance' },
      { metric: '99.9%', label: 'SLA Uptime' },
      { metric: '8', label: 'Units Automated' },
    ],
    demo: [
      { agent: 'PLATFORM', msg: 'AgentIRL Orchestrator: 8 specialized nodes active.' },
      { agent: 'COMPLY', msg: 'Audit: Flagged 3 contracts with non-standard liability. Routed to Legal.' },
      { agent: 'FINANCE', msg: 'Monthly Close: Categorized 1,247 transactions. 12 anomalies detected.' },
      { agent: 'PLATFORM', msg: 'Status: 342 tasks verified. Human-in-the-loop: 4 pending.' },
    ],
    link: '/enterprise',
  },
  {
    title: 'Healthcare Network — Patient Orchestration',
    segment: 'MID-SIZE',
    industry: 'Healthcare',
    icon: Stethoscope,
    desc: 'Reduced reception overhead by 70% across 12 clinics using voice and WhatsApp agents.',
    agents: ['Voice Agent', 'WhatsApp Node', 'SMS Bridge'],
    results: [
      { metric: '70%', label: 'Ops Savings' },
      { metric: '-25%', label: 'No-Show Rate' },
      { metric: '24/7', label: 'Availability' },
    ],
    demo: [
      { agent: 'VOICE', msg: 'Incoming call... Appointment inquiry for Chicago South clinic.' },
      { agent: 'VOICE', msg: 'Checking schedule... "Tue 10am is open." Confirmed.' },
      { agent: 'WHATSAPP', msg: 'Injected: Appointment confirmation + parking details to patient.' },
      { agent: 'SMS', msg: '24hr Reminder: "Confirm C to cancel." Success.' },
    ],
    link: '/services/agentirl',
  },
  {
    title: 'Law Firm — Case Intake Logic',
    segment: 'SMB',
    industry: 'Legal',
    icon: Scale,
    desc: 'Attorneys saved 30 hours per week. Case qualification and intake entirely autonomous.',
    agents: ['Intake Voice Agent', 'Qualification Node'],
    results: [
      { metric: '30hrs', label: 'Weekly Savings' },
      { metric: '2x', label: 'Consultations' },
      { metric: '0', label: 'Missed Calls' },
    ],
    demo: [
      { agent: 'INTAKE', msg: 'Caller: "Car accident, Cook County." Qualifying...' },
      { agent: 'INTAKE', msg: 'Verification: Personal Injury criteria met. Jurisdiction: IL. ✓' },
      { agent: 'INTAKE', msg: 'Scheduling... Consultation booked for Thu 2pm with Atty Smith.' },
      { agent: 'NOTIFY', msg: 'Outlook Injection: New lead dossier sent to Smith & Partners.' },
    ],
    link: '/contact',
  },
  {
    title: 'SaaS Platform — Growth Intelligence',
    segment: 'STARTUP',
    industry: 'Software',
    icon: BrainCircuit,
    desc: 'Integrated SaaS Analytics and Product Intelligence to identify and fix churn bottlenecks automatically.',
    agents: ['Analytics Brain', 'Retention Optimizer'],
    results: [
      { metric: '22%', label: 'Churn Reduction' },
      { metric: '1M+', label: 'Events Tracked' },
      { metric: 'Auto', label: 'Optimization' },
    ],
    demo: [
      { agent: 'ANALYTICS', msg: 'SaaS Engine: Detected 45% drop-off at Step 3 of onboarding.' },
      { agent: 'BRAIN', msg: 'Intelligence: Step 3 has too many form fields. Recommending simplification.' },
      { agent: 'OPTIMIZE', msg: 'Auto-Task: Generated new low-friction UI proposal. A/B test active.' },
      { agent: 'REPORT', msg: 'Insight: Retention projected to increase by 12%.' },
    ],
    link: '/analytics',
  },
];

export const UseCases: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const filtered = filter === 'ALL' ? USE_CASES : USE_CASES.filter(uc => uc.segment === filter);

  return (
    <Layout showBackground={false}>
      <SEO title="AI Use Cases — Viktron AI Success Stories" description="See how Viktron AI agents deliver real results in healthcare, law, finance, and construction." />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-[60vh] bg-[#050505] flex flex-col justify-center pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.05] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 text-center">
          <FU d={0}>
             <Label>PERFORMANCE_PROOFS</Label>
             <h1 className="heading-precision text-7xl md:text-[140px] text-white leading-[0.8] tracking-[-0.05em] uppercase font-black mt-10">
                PROVEN<br />
                <span className="text-zinc-700">UTILITY.</span>
             </h1>
          </FU>
          <FU d={0.1} className="mt-20 flex flex-wrap justify-center gap-4">
             {FILTERS.map(f => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-8 py-3 font-mono text-[10px] tracking-[0.2em] font-bold border transition-all ${
                   filter === f ? 'bg-primary text-black border-primary' : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/30'
                 }`}
               >
                 {f}
               </button>
             ))}
          </FU>
        </div>
      </section>

      {/* ══════════════════ CASES LIST ══════════════════ */}
      <section className="py-20 bg-[#050505] relative border-t border-white/5 min-h-[80vh]">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
           {filtered.map((uc, i) => {
             const Icon = uc.icon;
             const isExpanded = expandedIdx === i;
             return (
               <FU key={i} d={i * 0.05}>
                  <div className={`obsidian-panel overflow-hidden transition-all duration-500 ${isExpanded ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-white/20'}`}>
                     <button 
                       onClick={() => setExpandedIdx(isExpanded ? null : i)}
                       className="w-full text-left p-10 flex flex-col md:flex-row md:items-center gap-12"
                     >
                        <div className="w-14 h-14 obsidian-inset flex items-center justify-center text-zinc-500 shrink-0">
                           <Icon size={24} />
                        </div>
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-4">
                              <span className="text-[10px] font-mono text-primary font-bold tracking-[0.2em] uppercase">{uc.segment}</span>
                              <h2 className="text-white font-bold text-2xl tracking-tighter uppercase">{uc.title}</h2>
                           </div>
                           <p className="text-zinc-500 text-sm max-w-xl">{uc.desc}</p>
                        </div>
                        <div className="flex gap-10 shrink-0">
                           {uc.results.map((r, j) => (
                             <div key={j} className="text-center">
                                <div className="text-2xl font-black text-white tracking-tighter">{r.metric}</div>
                                <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{r.label}</div>
                             </div>
                           ))}
                           <div className={`w-10 h-10 obsidian-inset flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-90 text-primary' : 'text-zinc-600'}`}>
                              <ArrowRight size={18} />
                           </div>
                        </div>
                     </button>

                     <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-[#080808]"
                          >
                             <div className="p-12 grid lg:grid-cols-5 gap-12">
                                {/* Demo Terminal */}
                                <div className="lg:col-span-3 obsidian-inset p-8 font-mono text-[10px] space-y-4 relative overflow-hidden">
                                   <div className="scan-line opacity-10" />
                                   <div className="flex justify-between text-zinc-600 mb-6 uppercase tracking-widest font-bold">
                                      <span>RUN_DEMO_LOG // ACTIVE</span>
                                      <span>PROVENANCE: VERIFIED</span>
                                   </div>
                                   {uc.demo.map((line, k) => (
                                      <div key={k} className="flex gap-6 group transition-all">
                                         <span className="text-primary font-bold w-16">[{line.agent}]</span>
                                         <span className="text-zinc-400 group-hover:text-white transition-colors">{line.msg}</span>
                                      </div>
                                   ))}
                                </div>
                                {/* Details */}
                                <div className="lg:col-span-2 space-y-8">
                                   <Label>AGENTS_INVOLVED</Label>
                                   <div className="flex flex-wrap gap-3">
                                      {uc.agents.map((a, k) => (
                                        <div key={k} className="px-4 py-2 obsidian-inset text-[10px] font-mono text-zinc-300 uppercase tracking-widest border border-white/5">
                                           {a}
                                        </div>
                                      ))}
                                   </div>
                                   <div className="pt-8 space-y-4">
                                      <Link to={uc.link} className="btn-acid w-full py-5 flex items-center justify-center gap-4">
                                         Deploy This Stack <ArrowRight size={18} />
                                      </Link>
                                      <Link to="/contact" className="btn-obsidian w-full py-5 flex items-center justify-center gap-4">
                                         Case Study Brief <FileText size={18} className="text-zinc-500" />
                                      </Link>
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </FU>
             );
           })}
        </div>
      </section>

      {/* ══════════════════ LAYMAN'S GUIDE: WHERE & HOW ══════════════════ */}
      <section className="py-40 bg-[#080808] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <Label>SIMPLE_DEPLOYMENT_GUIDE</Label>
          <h2 className="heading-precision text-6xl text-white mb-20 uppercase tracking-tighter">How to use<br />Viktron AI.</h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Agent IRL: For Everyone */}
            <FU d={0} className="obsidian-panel p-12 space-y-8 group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 obsidian-inset flex items-center justify-center text-primary">
                  <Bot size={32} className="text-glow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Agent IRL</h3>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Your Autonomous Workforce</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-primary font-mono text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">// WHERE_TO_USE</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Use it anywhere you have repetitive computer work. Customer support, finding leads on LinkedIn, booking appointments, or organizing thousands of files.
                  </p>
                </div>
                <div>
                  <h4 className="text-primary font-mono text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">// HOW_TO_USE</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Simply give it a mission in plain English. For example: "Find 10 lawyers in London and send them a personalized email." It handles the browsing and typing for you.
                  </p>
                </div>
              </div>
            </FU>

            {/* Analytics: For Everyone */}
            <FU d={0.1} className="obsidian-panel p-12 space-y-8 group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 obsidian-inset flex items-center justify-center text-primary">
                  <BrainCircuit size={32} className="text-glow" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Dual Intelligence</h3>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Analytics & Insights</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-primary font-mono text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">// WHERE_TO_USE</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Use it on your website or app to see exactly what users are doing. It's like having a camera on your business performance 24/7.
                  </p>
                </div>
                <div>
                  <h4 className="text-primary font-mono text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">// HOW_TO_USE</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Our **SaaS Analytics** tracks every click automatically. Then, our **Product Intelligence** "brain" reads that data and tells you exactly how to make more money or keep more users.
                  </p>
                </div>
              </div>
            </FU>
          </div>

          <FU d={0.2} className="mt-20 obsidian-panel p-10 border-primary/30 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xl uppercase tracking-tighter">Ready to start?</h4>
              <p className="text-zinc-500 text-sm">Join the 100+ businesses automating their future today.</p>
            </div>
            <Link to="/onboarding" className="btn-acid !px-12 whitespace-nowrap">
              Start Onboarding Now
            </Link>
          </FU>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-60 bg-[#050505] text-center relative overflow-hidden border-t border-white/5">
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            <FU d={0}>
               <h2 className="heading-precision text-7xl md:text-[140px] text-white mb-16 uppercase tracking-tighter font-black leading-[0.8]">
                  AUTHORIZE<br />
                  <span className="text-zinc-700">RESULTS.</span>
               </h2>
               <Link to="/contact" className="btn-acid px-16 py-6">Consult an Architect</Link>
            </FU>
         </div>
      </section>
    </Layout>
  );
};

const FileText = ({ size, className }: { size: number; className?: string }) => (
  <Activity size={size} className={className} />
);
