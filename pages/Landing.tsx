import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Play, CheckCircle2, Loader2,
  Bot, Users, BrainCircuit, Target, Sparkles, Phone, MessageSquare,
  Shield, Globe, BarChart3, Activity, Eye, Cpu, Layers, Microscope
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ── Demo Scenarios ──
type DemoScenario = {
  prompt: string;
  agents: { role: string; color: string; actions: string[] }[];
  comms: { from: string; to: string; msg: string; spawns?: string }[];
  stats: { v: string; l: string }[];
};

const SCENARIOS: DemoScenario[] = [
  {
    prompt: 'Deploy an AI operations team for our enterprise SaaS platform. Automate customer onboarding, handle tier-1 support tickets, generate weekly analytics reports, and manage upsell outreach to trial users.',
    agents: [
      { role: 'CEO Agent', color: '#3b82f6', actions: [
        'Parsing enterprise instruction...', 'Identified 5 workflows across 4 departments',
        'Spawning Operations Agent for onboarding pipeline',
        'Assigning Support Agent: Tier-1 ticket resolution',
        'Assigning Analytics Agent: Weekly report generation',
        'Assigning Sales Agent: Trial-to-paid conversion outreach',
      ]},
      { role: 'Sales Agent', color: '#10b981', actions: [
        'Connected to CRM: 847 trial accounts loaded',
        'Scoring leads by engagement... Top 120 identified',
        'Drafting personalized upsell sequence...',
        'Email: "Your team used 3 features — unlock the rest"',
        'Trial → Paid: 23 conversions this week',
      ]},
      { role: 'Support Agent', color: '#8b5cf6', actions: [
        'Ingesting knowledge base: 1,240 help articles',
        'Ticket #4891: "Can\'t export CSV" → Auto-resolved',
        'Ticket #4892: "SSO not working" → Escalated to Eng',
        'Resolution rate: 78% automated, 22% escalated',
      ]},
      { role: 'Analytics Agent', color: '#f59e0b', actions: [
        'Querying data warehouse... 14 metrics tracked',
        'Weekly report: MRR +12%, Churn -3%, NPS 72',
        'Anomaly detected: Support volume spike on Tuesdays',
        'Report delivered to #exec-dashboard on Slack',
      ]},
    ],
    comms: [
      { from: 'CEO Agent', to: 'Sales Agent', msg: '120 high-intent trial users identified. Begin outreach sequence.' },
      { from: 'Sales Agent', to: 'CEO Agent', msg: 'Ack. Personalizing emails based on feature usage data.' },
      { from: 'Sales Agent', to: 'Support Agent', msg: 'Can you flag any trial users with open support tickets? Don\'t want to upsell angry users.' },
      { from: 'Support Agent', to: 'Sales Agent', msg: 'Done. 8 accounts excluded — active escalations.' },
      { from: 'CEO Agent', to: 'Analytics Agent', msg: 'Support volume spiking Tuesdays. Investigate root cause.' },
      { from: 'Analytics Agent', to: 'CEO Agent', msg: 'Found it — Tuesday deploys break CSV export. Spawning sub-agent to monitor deploys.', spawns: 'Deploy Monitor' },
      { from: 'CEO Agent', to: 'Sales Agent', msg: '23 conversions confirmed. Scaling outreach to next 200 accounts.', spawns: 'Outreach Scaler' },
    ],
    stats: [
      { v: '6', l: 'Agents' }, { v: '4.1s', l: 'Avg Response' },
      { v: '23', l: 'Conversions' }, { v: '$8.40', l: 'Cost/day' },
    ],
  },
  {
    prompt: 'Set up an AI growth team for a D2C e-commerce brand. Handle abandoned cart recovery via SMS, automate product Q&A on the website, run A/B test ideas for landing pages, and send me a daily revenue report.',
    agents: [
      { role: 'CEO Agent', color: '#3b82f6', actions: [
        'Parsing D2C growth instruction...', 'Identified 4 revenue-critical workflows',
        'Assigning Sales Agent: Cart recovery via SMS',
        'Assigning Support Agent: Product Q&A chatbot',
        'Assigning Content Agent: Landing page A/B copy',
        'Claiming: Daily revenue dashboard generation',
      ]},
      { role: 'Sales Agent', color: '#10b981', actions: [
        'Connected to Shopify: 2,341 abandoned carts this week',
        'SMS template A: "Still thinking about it? 10% off →"',
        'Sent to 312 carts in last 24hrs...',
        'Recovery rate: 14.2% — $4,820 recovered today',
      ]},
      { role: 'Support Agent', color: '#8b5cf6', actions: [
        'Product catalog loaded: 489 SKUs with specs',
        '"Is this jacket waterproof?" → "Yes, rated IPX4"',
        '"What size should I get?" → Size guide + AI recommendation',
        'Deflection rate: 91% — 3 escalated to human today',
      ]},
      { role: 'Content Agent', color: '#f59e0b', actions: [
        'Analyzing top 5 landing pages by bounce rate...',
        'Variant A: "Free shipping over $50" (control)',
        'Variant B: "Members get free shipping — join free"',
        'Test deployed. Tracking conversions for 72hrs.',
      ]},
    ],
    comms: [
      { from: 'CEO Agent', to: 'Sales Agent', msg: 'Recovery rate is 14.2%. Can we push it higher?' },
      { from: 'Sales Agent', to: 'Content Agent', msg: 'Need a more compelling SMS hook. Current "10% off" is underperforming.' },
      { from: 'Content Agent', to: 'Sales Agent', msg: 'Try: "Your cart misses you — free express shipping for 2hrs." Testing now.' },
      { from: 'Support Agent', to: 'CEO Agent', msg: 'Size-related questions are 40% of volume. Recommending AI size quiz.', spawns: 'Size Quiz Agent' },
      { from: 'CEO Agent', to: 'Support Agent', msg: 'Approved. Deploy size quiz on all product pages.' },
      { from: 'Sales Agent', to: 'CEO Agent', msg: 'New SMS hook bumped recovery to 19.1%. Scaling to all abandoned carts.', spawns: 'SMS Scaler' },
      { from: 'CEO Agent', to: 'Content Agent', msg: 'Revenue up 22% this week. Generate a wins report for the founder.' },
    ],
    stats: [
      { v: '6', l: 'Agents' }, { v: '2.8s', l: 'Avg Response' },
      { v: '$4.8K', l: 'Recovered/day' }, { v: '$5.20', l: 'Cost/day' },
    ],
  },
  {
    prompt: 'Build an AI recruiting team for a fast-growing fintech. Screen inbound applications, schedule interviews automatically, send rejection emails with feedback, and generate a weekly hiring pipeline report.',
    agents: [
      { role: 'CEO Agent', color: '#3b82f6', actions: [
        'Parsing recruiting instruction...', 'Identified 4 hiring workflows',
        'Assigning Sales Agent: Candidate screening & scoring',
        'Assigning Support Agent: Interview scheduling',
        'Assigning Content Agent: Candidate communication',
        'Claiming: Weekly pipeline analytics',
      ]},
      { role: 'Sales Agent', color: '#10b981', actions: [
        'Connected to ATS: 284 new applications this week',
        'Screening against 12 role criteria...',
        'Top 45 candidates scored above 80% match',
        'Auto-advancing to interview stage...',
      ]},
      { role: 'Support Agent', color: '#8b5cf6', actions: [
        'Syncing with hiring managers\' calendars...',
        'Scheduled 18 interviews across 3 time zones',
        'Candidate: "Can we reschedule?" → Moved to Friday 2PM',
        'No-show detected → Auto-sent follow-up with new link',
      ]},
      { role: 'Content Agent', color: '#f59e0b', actions: [
        'Drafting personalized rejection emails with feedback...',
        '"Your Python skills are strong — we need more Rust exp"',
        'Sent 239 rejections with constructive feedback',
        'Candidate NPS on rejection emails: 4.2/5',
      ]},
    ],
    comms: [
      { from: 'CEO Agent', to: 'Sales Agent', msg: '284 applications received. Begin screening for Senior Engineer roles.' },
      { from: 'Sales Agent', to: 'Support Agent', msg: '45 candidates passed screening. Schedule first-round interviews.' },
      { from: 'Support Agent', to: 'Sales Agent', msg: '18 interviews scheduled this week. 3 candidates requested async format.' },
      { from: 'Sales Agent', to: 'CEO Agent', msg: 'Noticing 60% of applicants lack Rust experience. Should we adjust the JD?', spawns: 'JD Optimizer' },
      { from: 'CEO Agent', to: 'Content Agent', msg: 'Generate feedback emails for all 239 rejected candidates.' },
      { from: 'Content Agent', to: 'CEO Agent', msg: 'Done. Personalized feedback sent. 12 candidates replied thanking us.' },
      { from: 'CEO Agent', to: 'Sales Agent', msg: 'Pipeline healthy. Spawning sourcing agent for passive candidates.', spawns: 'Talent Sourcer' },
    ],
    stats: [
      { v: '6', l: 'Agents' }, { v: '3.5s', l: 'Avg Response' },
      { v: '45', l: 'Screened/wk' }, { v: '$6.10', l: 'Cost/day' },
    ],
  },
];

// ── Inline Demo Component (loops through scenarios) ──
type DemoPhase = 'idle' | 'typing' | 'processing' | 'agents' | 'done' | 'comms' | 'fadeout';

const InlineDemo = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<DemoPhase>('idle');
  const [typedText, setTypedText] = useState('');
  const [currentAgent, setCurrentAgent] = useState(0);
  const [currentAction, setCurrentAction] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<number[]>([]);
  const [commIdx, setCommIdx] = useState(0);
  const [spawnedAgents, setSpawnedAgents] = useState<string[]>([]);

  const scenario = SCENARIOS[scenarioIdx];

  // Reset state for new scenario
  const resetForScenario = (nextIdx: number) => {
    setScenarioIdx(nextIdx);
    setTypedText('');
    setCurrentAgent(0);
    setCurrentAction(0);
    setCompletedAgents([]);
    setCommIdx(0);
    setSpawnedAgents([]);
    setPhase('typing');
  };

  // Start first run
  useEffect(() => {
    const t = setTimeout(() => setPhase('typing'), 1200);
    return () => clearTimeout(t);
  }, []);

  // Typing
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedText.length >= scenario.prompt.length) {
      const t = setTimeout(() => setPhase('processing'), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTypedText(scenario.prompt.slice(0, typedText.length + 1)), 18 + Math.random() * 14);
    return () => clearTimeout(t);
  }, [phase, typedText, scenario.prompt]);

  // Processing → agents
  useEffect(() => {
    if (phase !== 'processing') return;
    const t = setTimeout(() => setPhase('agents'), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  // Agent sequence
  useEffect(() => {
    if (phase !== 'agents') return;
    const agent = scenario.agents[currentAgent];
    if (!agent) { setPhase('done'); return; }
    if (currentAction >= agent.actions.length) {
      setCompletedAgents(prev => [...prev, currentAgent]);
      const t = setTimeout(() => { setCurrentAgent(a => a + 1); setCurrentAction(0); }, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCurrentAction(a => a + 1), 700);
    return () => clearTimeout(t);
  }, [phase, currentAgent, currentAction, scenario.agents]);

  // Done → comms after pause
  useEffect(() => {
    if (phase !== 'done') return;
    const t = setTimeout(() => setPhase('comms'), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // Agent comms sequence
  useEffect(() => {
    if (phase !== 'comms') return;
    if (commIdx >= scenario.comms.length) {
      const t = setTimeout(() => setPhase('fadeout'), 2000);
      return () => clearTimeout(t);
    }
    const comm = scenario.comms[commIdx];
    const t = setTimeout(() => {
      if (comm.spawns) setSpawnedAgents(prev => [...prev, comm.spawns!]);
      setCommIdx(i => i + 1);
    }, 1200);
    return () => clearTimeout(t);
  }, [phase, commIdx, scenario.comms]);

  // Fadeout → next scenario
  useEffect(() => {
    if (phase !== 'fadeout') return;
    const t = setTimeout(() => {
      resetForScenario((scenarioIdx + 1) % SCENARIOS.length);
    }, 1500);
    return () => clearTimeout(t);
  }, [phase, scenarioIdx]);

  const activeAgent = scenario.agents[currentAgent];
  const agentColorMap: Record<string, string> = {};
  for (const a of scenario.agents) agentColorMap[a.role] = a.color;

  return (
    <div className="bg-[#0a0a12] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Terminal bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="text-[10px] text-white/30 ml-2 font-mono">AgentIRL Console</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {SCENARIOS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === scenarioIdx ? 'bg-blue-400' : 'bg-white/15'}`} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/25 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            LIVE
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scenarioIdx}
          initial={scenarioIdx > 0 ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="p-5 font-mono text-sm min-h-[420px]"
        >
          {/* Instruction */}
          <div className="mb-4">
            <span className="text-white/25 text-xs">INSTRUCTION</span>
            <div className="mt-1 text-white/80 leading-relaxed text-xs">
              {typedText}
              {phase === 'typing' && (
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-0.5 h-3.5 bg-blue-400 ml-0.5 align-middle" />
              )}
            </div>
          </div>

          {/* Processing spinner */}
          <AnimatePresence>
            {phase === 'processing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-blue-400 text-xs mb-4">
                <Loader2 className="w-3 h-3 animate-spin" /> Spinning up agent team...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Agent deployment phase */}
          {(phase === 'agents' || phase === 'done' || phase === 'comms' || phase === 'fadeout') && (
            <div className="space-y-3">
              {/* Agent tabs */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {scenario.agents.map((a, idx) => {
                  const isActive = idx === currentAgent && phase === 'agents';
                  const isDone = completedAgents.includes(idx);
                  return (
                    <div key={idx} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] ${isActive ? 'bg-white/10 text-white' : isDone ? 'bg-white/5 text-white/40' : 'bg-white/[0.02] text-white/20'}`}>
                      {isDone ? <CheckCircle2 className="w-2.5 h-2.5 text-green-400" /> : isActive ? <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: a.color }} /> : null}
                      <span>{a.role}</span>
                    </div>
                  );
                })}
                {/* Spawned sub-agents */}
                {spawnedAgents.map((name, idx) => (
                  <motion.div
                    key={`spawn-${idx}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  >
                    <Bot className="w-2.5 h-2.5" />
                    <span>{name}</span>
                  </motion.div>
                ))}
              </div>

              {/* Active agent actions */}
              {activeAgent && phase === 'agents' && (
                <div className="space-y-1.5">
                  {activeAgent.actions.slice(0, currentAction).map((action, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-green-500/50 shrink-0 mt-0.5" />
                      <span className="text-white/60">{action}</span>
                    </motion.div>
                  ))}
                  <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-3 ml-5" style={{ backgroundColor: activeAgent.color }} />
                </div>
              )}

              {/* Done state — stats */}
              {(phase === 'done' || phase === 'comms' || phase === 'fadeout') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center gap-2 text-green-400 text-xs mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All {scenario.agents.length} agents deployed and operational
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {scenario.stats.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.08 }} className="text-center">
                        <div className="text-lg font-bold text-white">{s.v}</div>
                        <div className="text-[9px] text-white/30 uppercase">{s.l}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Agent communication phase */}
              {(phase === 'comms' || phase === 'fadeout') && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-white/5 pt-3 mt-1">
                  <div className="flex items-center gap-2 text-white/30 text-[10px] mb-3 uppercase tracking-wider">
                    <Activity className="w-3 h-3" /> Agent Communication
                  </div>
                  <div className="space-y-2 max-h-[180px] overflow-hidden">
                    {scenario.comms.slice(0, commIdx).map((c, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2"
                      >
                        <div className="shrink-0 flex items-center gap-1 min-w-[90px]">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: agentColorMap[c.from] || '#6b7280' }} />
                          <span className="text-[10px] font-semibold" style={{ color: agentColorMap[c.from] || '#9ca3af' }}>{c.from.replace(' Agent', '')}</span>
                          <span className="text-white/15 text-[10px]">→</span>
                          <span className="text-[10px] text-white/30">{c.to.replace(' Agent', '')}</span>
                        </div>
                        <span className="text-[10px] text-white/50 leading-relaxed flex-1">{c.msg}</span>
                        {c.spawns && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="shrink-0 text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full"
                          >
                            + {c.spawns}
                          </motion.span>
                        )}
                      </motion.div>
                    ))}
                    {phase === 'comms' && commIdx < scenario.comms.length && (
                      <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1, repeat: Infinity }} className="flex items-center gap-2 text-[10px] text-white/20">
                        <Activity className="w-2.5 h-2.5 animate-pulse" /> Agents communicating...
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Page ──
export const Landing = () => {
  return (
    <Layout>
      <SEO
        title="Viktron | AI Agent Teams & AgentIRL Platform"
        description="Deploy coordinated AI agent teams and manage them with AgentIRL — the production-grade platform for multi-agent orchestration, observability, and enterprise integrations. Plans from $199/mo."
        keywords="AI agent teams, AI employees, AgentIRL, multi-agent orchestration, AI automation, voice AI, chatbot, WhatsApp automation, business AI, AI observability"
        url="/"
      />

      {/* ─── 1. Hero ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-600 mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Powered by AgentIRL
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                AI Agent Teams.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Production Infrastructure.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Deploy coordinated AI employees that handle sales, support, and operations —
                powered by AgentIRL, the platform that orchestrates, monitors, and scales them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn btn-primary btn-lg rounded-lg h-14 px-8 text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                  <Play size={18} className="fill-current" /> Get Started
                </Link>
                <Link to="/services" className="btn btn-secondary btn-lg rounded-lg h-14 px-8 text-lg flex items-center justify-center border-slate-200 bg-white hover:bg-slate-50 text-slate-900">
                  Explore Platform
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 2. Two Pillars ─── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Two products. One platform.</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Viktron delivers AI agent teams for your business and the infrastructure to run them reliably at scale.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pillar 1: AI Agent Teams */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">AI Agent Teams</h3>
                  <p className="text-xs font-mono text-blue-600 uppercase tracking-wider">Your Digital Workforce</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Hire a coordinated team of AI employees — Sales, Support, Content, and a CEO agent
                that delegates, executes, and reports. 24/7. From $199/mo.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Target, label: 'Sales Agent', desc: 'Leads & bookings' },
                  { icon: MessageSquare, label: 'Support Agent', desc: 'Customer queries' },
                  { icon: Sparkles, label: 'Content Agent', desc: 'Marketing copy' },
                  { icon: BrainCircuit, label: 'CEO Agent', desc: 'Orchestration' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <a.icon className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{a.label}</p>
                      <p className="text-[10px] text-slate-500">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/agents" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                Meet the agents <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Pillar 2: AgentIRL Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">AgentIRL Platform</h3>
                  <p className="text-xs font-mono text-indigo-600 uppercase tracking-wider">Production Infrastructure</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                The control plane for autonomous agents. Deploy, orchestrate, and monitor
                multi-agent systems with enterprise-grade reliability, observability, and security.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Layers, label: 'Orchestration', desc: 'Multi-agent coordination' },
                  { icon: Activity, label: 'Observability', desc: 'Real-time monitoring' },
                  { icon: Shield, label: 'Reliability', desc: 'Auto-retry & fallbacks' },
                  { icon: Globe, label: 'Integrations', desc: '50+ enterprise tools' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <a.icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{a.label}</p>
                      <p className="text-[10px] text-slate-500">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Backend Visual */}
              <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-1 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                  alt="AgentIRL Platform Dashboard" 
                  className="w-full h-48 object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>

              <Link to="/services/agent-orchestration" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Explore AgentIRL <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 3. Live Demo — Terminal ─── */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              See It In Action
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              One instruction. Four AI agents spin up and start working — in real time.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <InlineDemo />
          </motion.div>
        </div>
      </section>

      {/* ─── 4. Metrics Strip ─── */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '< 8s', label: 'Avg Response' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '24/7', label: 'Always On' },
              { value: '$199', label: 'From/mo' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Analytics & Observability Teaser ─── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-600 mb-6">
                <BarChart3 className="w-3 h-3" />
                Coming Soon
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Analytics for your<br />AI-powered business
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Track every visitor, conversation, and conversion across your website and AI agents.
                Amplitude-grade analytics, built for the AI era.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Eye, text: 'Visitor tracking — see who lands on your site and what they do' },
                  { icon: BarChart3, text: 'Conversion funnels — from page view to AI agent interaction to sale' },
                  { icon: Microscope, text: 'Agent performance — response quality, resolution rates, sentiment' },
                  { icon: Activity, text: 'Real-time dashboards — live metrics across all your AI touchpoints' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-700 leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
                  Join the Waitlist <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Analytics Dashboard</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">2,847 <span className="text-sm font-normal text-emerald-600">+23% this week</span></p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-mono bg-emerald-50 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </div>
                </div>
                <div className="flex items-end gap-1.5 h-32 mb-4">
                  {[40, 55, 35, 68, 45, 72, 58, 80, 65, 90, 75, 95, 82, 70, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex-1 rounded-sm bg-gradient-to-t from-blue-500 to-blue-300 opacity-80"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  {[
                    { label: 'Visitors', value: '2,847', change: '+23%' },
                    { label: 'AI Conversations', value: '1,204', change: '+41%' },
                    { label: 'Conversions', value: '312', change: '+18%' },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg font-bold text-slate-900">{s.value}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{s.label}</p>
                      <p className="text-[10px] text-emerald-600 font-mono">{s.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 7. CTA ─── */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Stop hiring. Start deploying.</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            AI agent teams + production infrastructure. Everything you need to automate
            sales, support, and marketing. Live in 1-3 weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn bg-white text-slate-900 hover:bg-blue-50 px-8 py-3 rounded-xl text-lg font-semibold">
              Get Started
            </Link>
            <Link to="/use-cases" className="btn border border-slate-700 text-white hover:bg-slate-800 px-8 py-3 rounded-xl text-lg">
              See Use Cases
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-500 font-mono">Plans from $199/mo — Cancel anytime</p>
        </div>
      </section>
    </Layout>
  );
};
