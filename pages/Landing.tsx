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
import { AgentPathSelection } from '../components/AgentPathSelection';

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
  const [showAgentPath, setShowAgentPath] = useState(false);

  // Schema markup for Viktron AI product
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Viktron AI",
    "description": "Enterprise AI agent teams platform for sales, support, and operations automation",
    "url": "https://viktron.ai",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "199",
      "priceValidUntil": "2026-12-31",
      "description": "Viktron AI starting price"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "347"
    },
    "image": "https://viktron.ai/og-image.png",
    "operatingSystem": "Web, API"
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <SEO
        title="Viktron AI | Enterprise Agent Teams Platform"
        description="Viktron AI deploys autonomous AI agent teams for sales, support, and operations. Orchestrate, monitor, and scale with AgentIRL platform. Enterprise-grade. From $199/mo."
        keywords="Viktron AI, AI agent teams, AI employees, AgentIRL, multi-agent orchestration, AI automation, enterprise AI, AI sales agents, customer support automation"
        url="/"
      />

      {/* ─── 1. Hero ─── */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        {/* Background imagery + gradient blobs */}
        {/* Full-bleed abstract hero image — very low opacity for texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')" }}
        />
        {/* Gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-right blue glow */}
          <div className="absolute -top-40 -right-40 w-[900px] h-[900px] bg-blue-200/50 blur-[160px] rounded-full" />
          {/* Bottom-left indigo glow */}
          <div className="absolute -bottom-20 -left-40 w-[700px] h-[700px] bg-indigo-200/40 blur-[140px] rounded-full" />
          {/* Center violet accent */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-100/30 blur-[120px] rounded-full" />
          {/* Top-left teal micro-accent */}
          <div className="absolute top-20 left-16 w-[300px] h-[300px] bg-cyan-100/40 blur-[100px] rounded-full" />
        </div>
        {/* Subtle dot-grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Abstract floating shapes */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-28 right-[10%] w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400/10 to-indigo-400/10 border border-blue-200/30 backdrop-blur-sm pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-48 right-[18%] w-14 h-14 rounded-xl bg-gradient-to-br from-violet-400/10 to-purple-400/10 border border-violet-200/30 pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-32 left-[8%] w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-400/10 border border-cyan-200/30 pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 16, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-12 right-[22%] w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400/10 to-blue-400/10 border border-indigo-200/20 pointer-events-none"
        />
        {/* Horizontal gradient line accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-600 mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Powered by AgentIRL
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                Viktron AI:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Enterprise AI Agent Teams</span>
              </h1>
              <p className="text-xl text-slate-600 mb-4 leading-relaxed max-w-2xl mx-auto font-semibold">
                The production platform for deploying, orchestrating, and scaling autonomous AI agents across sales, support, and operations.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Viktron AI gives you a coordinated team of AI employees that work 24/7 — powered by AgentIRL, the infrastructure that orchestrates, monitors, and scales them reliably. Enterprise-grade. From $199/mo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn btn-primary btn-lg rounded-lg h-14 px-8 text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                  <Play size={18} className="fill-current" /> Get Started
                </Link>
                <Link to="/services" className="btn btn-secondary btn-lg rounded-lg h-14 px-8 text-lg flex items-center justify-center border-slate-200 bg-white hover:bg-slate-50 text-slate-900">
                  Explore Platform
                </Link>
              </div>

              {/* ── Hero Visual ── */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative mx-auto max-w-5xl mt-16"
              >
                {/* Glow behind the panel */}
                <div className="absolute -inset-6 bg-gradient-to-r from-blue-200/50 via-indigo-200/40 to-violet-200/50 blur-3xl rounded-3xl pointer-events-none" />

                {/* Browser-chrome wrapper */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-300/50">
                  {/* Browser top bar */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border-b border-slate-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="flex-1 mx-4 bg-white rounded border border-slate-200 px-3 py-0.5 text-xs text-slate-400 text-center">
                      app.viktron.ai — AgentIRL Console
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-green-600 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
                    </div>
                  </div>

                  {/* Image compositon */}
                  <div className="grid grid-cols-3 gap-0">
                    <div className="col-span-2">
                      <img
                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=900"
                        alt="AI Team collaboration"
                        className="w-full h-80 object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500"
                        alt="Analytics dashboard"
                        className="w-full h-40 object-cover border-b border-slate-200"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=500"
                        alt="AI interface"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating stat: left */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-slate-200 px-4 py-3 min-w-[130px]"
                >
                  <p className="text-[11px] text-slate-500 mb-0.5">Active Agents</p>
                  <p className="text-2xl font-bold text-slate-900">2,400+</p>
                  <p className="text-[11px] text-green-600 font-medium mt-0.5">↑ 23% this week</p>
                </motion.div>

                {/* Floating stat: right */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -right-8 top-1/3 bg-white rounded-2xl shadow-xl border border-slate-200 px-4 py-3 min-w-[130px]"
                >
                  <p className="text-[11px] text-slate-500 mb-0.5">Avg Response</p>
                  <p className="text-2xl font-bold text-slate-900">&lt;8s</p>
                  <p className="text-[11px] text-blue-600 font-medium mt-0.5">99.9% uptime</p>
                </motion.div>

                {/* Floating badge: bottom-center */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-slate-200 px-5 py-2 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700">4 agents running concurrently</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 1.5. Value Propositions ─── */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value Prop 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="group"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                <Target className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Actually Gets Results</h3>
              <p className="text-slate-300 leading-relaxed">
                Your AI agents don't brainstorm. They execute. Close deals, resolve tickets, create content—real work that drives revenue, not theory.
              </p>
            </motion.div>

            {/* Value Prop 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500/30 transition-colors">
                <Layers className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Unified Command Center</h3>
              <p className="text-slate-300 leading-relaxed">
                Stripe, Slack, HubSpot, Salesforce, your CRM—agents orchestrate them all. No tab-switching. No manual exports. One AI, all your tools.
              </p>
            </motion.div>

            {/* Value Prop 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-colors">
                <BrainCircuit className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Gets Smarter Every Day</h3>
              <p className="text-slate-300 leading-relaxed">
                Agents learn from every interaction. They remember what worked, what didn't, and how your team prefers things done.
              </p>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ─── 2. Four Products ─── */}
      <section className="py-24 bg-gradient-to-b from-white via-blue-50/20 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-indigo-100/10 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Choose Your Path
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Four Ways to Get Started</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Pick the approach that works best for your business.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agent - Deploy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.1 }}
              className="p-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-blue-50/20 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-200 transition-all">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Agent</h3>
              <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-wide">Deploy AI Teams</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Autonomous AI agents for sales, support, content, and operations. 24/7 without human overhead.
              </p>
              <button onClick={() => setShowAgentPath(true)} className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 group/btn">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* AgentIRL - Infrastructure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.1 }}
              className="p-8 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 hover:border-indigo-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-200 transition-all">
                <Cpu className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">AgentIRL</h3>
              <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-wide">Production Ready</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Enterprise infrastructure for orchestration, monitoring, and scaling. 99.9% uptime guaranteed.
              </p>
              <Link to="/services/agentirl" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-2 group/btn">
                Learn More
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Analytics + Consulting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.1 }}
              className="p-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-emerald-50/20 hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-200 transition-all">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Analytics + Consulting</h3>
              <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-wide">Insights & Optimization</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Track visitors, conversations, and ROI. Expert consulting to optimize your AI business.
              </p>
              <a href="https://analytics.viktron.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-2 group/btn">
                Explore Analytics
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Rentals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3 * 0.1 }}
              className="p-8 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-purple-50/20 hover:border-purple-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-200 transition-all">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Rentals</h3>
              <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-wide">No Commitment</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Rent pre-built agents by the hour. Perfect for trials, testing, or scaling without long-term commitment.
              </p>
              <Link to="/rent" className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-2 group/btn">
                Browse Rentals
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 3. Live Demo — Terminal ─── */}
      <section className="relative py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50/20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Real-time Agent Orchestration
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              See It In Action
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              One instruction. Four AI agents spin up and start working — in real time. Watch autonomous orchestration in under 8 seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {/* Glow effect behind demo */}
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-200/30 via-indigo-200/20 to-purple-200/30 blur-3xl rounded-3xl pointer-events-none" />
            <InlineDemo />
          </motion.div>
        </div>
      </section>

      {/* ─── 4. Metrics Strip ─── */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '< 8s', label: 'Avg Response', icon: '⚡' },
              { value: '99.9%', label: 'Uptime SLA', icon: '🛡️' },
              { value: '24/7', label: 'Always On', icon: '🌍' },
              { value: '$199', label: 'From/month', icon: '💰' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs text-white/60 mt-2 uppercase tracking-wider font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Analytics & Observability Teaser ─── */}
      <section className="py-24 bg-gradient-to-b from-white via-emerald-50/30 to-white relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Analytics · Real-time Insights
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
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
              <div className="mt-8 flex items-center gap-3">
                <a
                  href="https://analytics.viktron.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Explore Analytics <ArrowRight className="w-4 h-4" />
                </a>
                <Link to="/analytics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition-colors">
                  Preview Demo
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

      {/* ─── 7. FAQ Section ─── */}
      <section className="py-20 border-t border-slate-200">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Frequently Asked About Viktron AI
            </h2>
            <p className="text-slate-600 text-lg">
              Learn how Viktron AI helps enterprises automate operations with autonomous agent teams.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "What is Viktron AI and how does it work?",
                a: "Viktron AI is an enterprise platform that deploys autonomous AI agent teams. Each team consists of specialized agents (Sales, Support, Content, CEO) that work together to handle business processes. The platform, powered by AgentIRL, orchestrates these agents, monitors their performance, and scales them across your organization. Teams are deployed in days, not months."
              },
              {
                q: "What can Viktron AI agents do?",
                a: "Viktron AI agents handle critical business functions: Sales agents generate leads and close deals, Support agents resolve customer issues 24/7, Content agents create marketing materials, and CEO agents orchestrate workflows. Agents integrate with your CRM, helpdesk, email, Slack, WhatsApp, and 50+ other tools."
              },
              {
                q: "How much does Viktron AI cost?",
                a: "Viktron AI starts at $199/month for a base team. Enterprise deployments scale based on your use cases and integrations. Most customers see ROI within 2-3 months. Volume discounts available for teams deploying multiple agent groups."
              },
              {
                q: "How long does it take to deploy Viktron AI?",
                a: "Enterprise deployments typically go live in 1-3 weeks. Our onboarding team guides you through setup, integrations, and agent training. Your AI team starts working immediately, with continuous optimization."
              },
              {
                q: "Is Viktron AI secure and compliant?",
                a: "Yes. Viktron AI meets enterprise security standards: SOC 2 Type II certified, GDPR compliant, data encrypted in transit and at rest, role-based access control, audit logging, and regular security audits. Agents operate within your approval workflows."
              },
              {
                q: "Can Viktron AI integrate with our existing tools?",
                a: "Absolutely. Viktron AI integrates with 50+ platforms including Salesforce, HubSpot, Zendesk, Slack, Microsoft Teams, WhatsApp, Stripe, and custom APIs. Our integration engine connects your tech stack in hours."
              },
              {
                q: "What's the difference between Viktron AI and ChatGPT/Claude?",
                a: "Viktron AI is an enterprise multi-agent platform, not a single chatbot. Agents are specialized, work together, integrate with your business tools, maintain approval workflows, and provide observability. ChatGPT is a conversational AI—Viktron AI agents are autonomous workers."
              },
              {
                q: "How do Viktron AI agents learn from feedback?",
                a: "Agents learn through continuous feedback loops. You approve or reject agent decisions, and they adapt. Analytics dashboards show performance metrics (resolution rates, sentiment, cost-per-task). Agents improve over time as feedback accumulates."
              }
            ].map((item, idx) => (
              <details key={idx} className="group border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors cursor-pointer">
                <summary className="flex justify-between items-start text-lg font-semibold text-slate-900 outline-none">
                  <span>{item.q}</span>
                  <span className="shrink-0 text-slate-400 group-open:rotate-180 transition-transform ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-xl bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to deploy Viktron AI?</h3>
            <p className="text-slate-700 mb-4">Get your AI agent team running in 1-3 weeks. Enterprise-grade. Production-ready.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
              Start Your Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 8. CTA ─── */}
      <section className="relative py-32 overflow-hidden text-white">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Stop hiring.<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Start deploying Viktron AI.</span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Autonomous agent teams for sales, support, and operations.
              Enterprise-ready. Production infrastructure. <br /> Live in 1-3 weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-slate-900 text-lg font-bold hover:bg-blue-50 transition-colors shadow-xl shadow-blue-500/25">
                  Get Started with Viktron AI
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/use-cases" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white text-white text-lg font-bold hover:bg-white/10 transition-colors">
                  See Use Cases
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </div>
            <p className="text-sm text-slate-400 font-mono">Enterprise plans from $199/mo — Cancel anytime, no lock-in</p>
          </motion.div>
        </div>
      </section>

      {/* Agent Path Selection Modal */}
      <AgentPathSelection isOpen={showAgentPath} onClose={() => setShowAgentPath(false)} />
    </Layout>
  );
};
