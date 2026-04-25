import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Play, CheckCircle2, Loader2,
  Bot, Users, BrainCircuit, Target, Sparkles, Phone, MessageSquare,
  Shield, Globe, BarChart3, Activity, Eye, Cpu, Layers, Microscope,
  Lock, KeyRound, FileCheck, Gauge, AlertTriangle, Fingerprint
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AgentPathSelection } from '../components/AgentPathSelection';

// ── Magnetic Button Component ──
const MagneticButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

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
        title="Viktron AI | The Trust Layer for Autonomous Agents"
        description="Cryptographic delegation tokens, real-time policy enforcement, and immutable provenance trails. AgentIRL makes autonomous agents safe for production — not by hoping they behave, but by proving they did."
        keywords="Viktron AI, AI agent trust, AgentIRL, AI governance, AI provenance, delegation tokens, policy enforcement, AI audit trails, autonomous agent safety, AI compliance"
        url="/"
        canonicalUrl="https://viktron.ai/"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is Viktron AI?", "acceptedAnswer": { "@type": "Answer", "text": "Viktron AI is the trust layer for autonomous agents. AgentIRL provides cryptographic delegation tokens, real-time policy enforcement, and immutable hash-chained provenance trails that make agent actions attributable, bounded, reviewable, and insurable." } },
            { "@type": "Question", "name": "What is the Trust Fabric?", "acceptedAnswer": { "@type": "Answer", "text": "The Trust Fabric is AgentIRL's core differentiator — four pillars: cryptographic identity, task-scoped delegation tokens with scope attenuation, pre-action policy gates, and hash-chained provenance trails." } },
            { "@type": "Question", "name": "How long does it take to deploy?", "acceptedAnswer": { "@type": "Answer", "text": "Most pre-built agents can be live within 1-2 weeks. Custom enterprise solutions with full integrations typically take 4-8 weeks." } },
            { "@type": "Question", "name": "What does Viktron AI cost?", "acceptedAnswer": { "@type": "Answer", "text": "Plans start at $199/month (Starter). Pro is $499/month for up to 5 agents. Enterprise is custom-priced with unlimited agents and the full Trust Fabric." } },
            { "@type": "Question", "name": "How is Viktron different from LangChain or CrewAI?", "acceptedAnswer": { "@type": "Answer", "text": "LangChain and CrewAI are orchestration frameworks. Viktron is the trust layer that makes them safe for production. We add delegation tokens, policy gates, provenance trails, and dynamic trust scoring on top of any framework." } }
          ]
        }}
      />

      {/* ─── 1. Hero — Trust Layer ─── */}
      <section className="relative min-h-[100dvh] pt-24 pb-20 overflow-hidden bg-slate-900">
        {/* Navy gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-900" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #38BDF8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Sky accent orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-sky-500/10 blur-[160px] rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-sky-600/8 blur-[120px] rounded-full" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left — Hero content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sm text-sky-300 mb-8">
                <Shield className="w-4 h-4" />
                <span className="font-medium">AgentIRL™ Trust Fabric</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight mb-6 leading-[1.1]">
                The Trust Layer<br />for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">Autonomous Agents</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed">
                Every agent action is attributable, bounded, reviewable, and insurable.
                AgentIRL makes delegation safe — not by hoping agents behave, but by
                <span className="text-white font-semibold"> proving they did</span>.
              </p>

              <p className="text-base text-slate-400 mb-8 leading-relaxed">
                Cryptographic delegation tokens, real-time policy enforcement, and immutable
                hash-chained provenance trails. For the first time, you can trust autonomous
                agents with real work.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <MagneticButton>
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/30 text-lg">
                    Start Free Trial <ArrowRight className="w-5 h-5" />
                  </Link>
                </MagneticButton>
                <Link to="/services" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-slate-600 text-slate-200 font-semibold hover:bg-slate-800/50 transition-all text-lg">
                  See How It Works
                </Link>
              </div>

              {/* Trust bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-300 font-medium">SOC 2 Type II</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">100% action audit trail</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">&lt;150ms policy checks</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">14-day trial</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Provenance chain visualization */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Dashboard mockup */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-sky-500/5">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 bg-slate-900 rounded border border-slate-700 px-3 py-1 text-xs text-slate-400 font-mono text-center">
                    app.viktron.ai/trust-fabric
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    VERIFIED
                  </div>
                </div>

                {/* Provenance chain display */}
                <div className="bg-slate-900 p-6 space-y-3">
                  {/* Trust score header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">Trust Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white font-mono">87</span>
                        <span className="text-sm text-sky-400 font-medium">Autonomous</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                      All policies passing
                    </div>
                  </div>

                  {/* Provenance chain entries */}
                  {[
                    { step: '1', action: 'instruction_received', who: 'founder@acme.co', status: 'authorized', time: '0.003s', color: 'sky' },
                    { step: '2', action: 'policy_check', who: 'PolicyEngine', status: 'allowed', time: '<1ms', color: 'emerald' },
                    { step: '3', action: 'delegation_issued', who: 'CEO → SalesAgent', status: 'token:tk_7f2a', time: '0.001s', color: 'violet' },
                    { step: '4', action: 'tool_call:crm.read', who: 'SalesAgent', status: 'allowed', time: '0.12s', color: 'sky' },
                    { step: '5', action: 'execution_completed', who: 'SalesAgent', status: 'verified', time: '2.1s', color: 'emerald' },
                  ].map((entry, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.15, duration: 0.3 }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 group hover:border-slate-600/50 transition-colors"
                    >
                      <div className={`w-6 h-6 rounded-full bg-${entry.color}-500/20 flex items-center justify-center text-${entry.color}-400 text-xs font-mono font-bold shrink-0`}>
                        {entry.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-mono truncate">{entry.action}</p>
                        <p className="text-xs text-slate-500 font-mono">{entry.who}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded bg-${entry.color}-500/10 text-${entry.color}-400`}>{entry.status}</span>
                        <span className="text-xs text-slate-600 font-mono">{entry.time}</span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Chain integrity */}
                  <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 font-mono">
                    <Lock className="w-3.5 h-3.5 text-sky-400" />
                    <span>SHA-256 chain integrity verified</span>
                    <span className="text-slate-600">•</span>
                    <span>5 entries • no gaps</span>
                  </div>
                </div>
              </div>

              {/* Floating trust level card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 top-12 bg-slate-800 rounded-xl shadow-xl border border-slate-700 px-4 py-3 min-w-[150px]"
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Autonomy Level</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-400 font-mono">87</span>
                  <span className="text-xs text-emerald-400/80">/100</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '87%' }} />
                </div>
              </motion.div>

              {/* Floating policy check card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-4 bottom-16 bg-slate-800 rounded-xl shadow-xl border border-slate-700 px-4 py-3 min-w-[150px]"
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Policy Engine</p>
                <p className="text-sm text-white font-medium">12 rules active</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">0 violations today</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 1.5. The Problem We Solve ─── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-50/50 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 tracking-wide mb-4">
                The Problem
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Agents fail. Silently. Expensively. Unaccountably.
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
                stat: '72%',
                statLabel: 'of agent tasks fail in production',
                title: 'Agents Fail Silently',
                desc: 'No audit trail when things go wrong. No way to know what happened, why, or who authorized it.',
                bg: 'bg-red-50',
                border: 'border-red-100',
              },
              {
                icon: <Eye className="w-8 h-8 text-amber-500" />,
                stat: '97%',
                statLabel: 'of AI breaches lacked access controls',
                title: 'No Accountability',
                desc: 'Agents can\'t be audited, traced, or governed. Every action is a black box with no chain of custody.',
                bg: 'bg-amber-50',
                border: 'border-amber-100',
              },
              {
                icon: <Lock className="w-8 h-8 text-slate-500" />,
                stat: '60%',
                statLabel: 'of AI leaders cite trust as #1 barrier',
                title: 'Can\'t Trust With Real Work',
                desc: 'Without provenance and policy gates, agents stay sandboxed — unable to handle production workloads.',
                bg: 'bg-slate-50',
                border: 'border-slate-200',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl ${item.bg} border ${item.border} p-8`}
              >
                <div className="mb-4">{item.icon}</div>
                <p className="text-4xl font-bold text-slate-900 font-mono mb-1">{item.stat}</p>
                <p className="text-sm text-slate-500 mb-4">{item.statLabel}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 1.6. How AgentIRL Works (Trust Fabric Flow) ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-sky-100/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-cyan-100/20 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block rounded-full bg-sky-50 px-4 py-1.5 text-sm font-semibold text-sky-700 tracking-wide mb-4">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Four pillars of agent trust
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                AgentIRL doesn&apos;t hope agents behave. It <span className="font-semibold text-slate-900">proves</span> they did.
              </p>
            </motion.div>
          </div>

          {/* 4-step flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: <Fingerprint className="w-6 h-6" />,
                title: 'Identity',
                desc: 'Every agent gets a cryptographic identity with role, tools, and domain limits. Not a username — a verifiable credential.',
                color: 'sky',
              },
              {
                step: '02',
                icon: <KeyRound className="w-6 h-6" />,
                title: 'Delegation',
                desc: 'Task-scoped tokens with scope attenuation. Parent → child → tool. Each token can only narrow permissions, never widen them.',
                color: 'violet',
              },
              {
                step: '03',
                icon: <Shield className="w-6 h-6" />,
                title: 'Policy Gates',
                desc: 'Pre-action checks before every tool call, API request, data write, or spend action. Denied actions never execute.',
                color: 'amber',
              },
              {
                step: '04',
                icon: <FileCheck className="w-6 h-6" />,
                title: 'Provenance',
                desc: 'Immutable hash-chained trail answering: who authorized, what goal, what agent saw, why it chose that action, what changed.',
                color: 'emerald',
              },
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="rounded-2xl bg-white border border-slate-200 p-8 h-full hover:shadow-lg hover:border-slate-300 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-${pillar.color}-500/10 flex items-center justify-center mb-4 text-${pillar.color}-500`}>
                    {pillar.icon}
                  </div>
                  <span className={`text-xs font-mono font-bold text-${pillar.color}-500 tracking-wider uppercase`}>Step {pillar.step}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{pillar.desc}</p>
                </div>
                {/* Connector arrow (hidden on mobile and last) */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 text-slate-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Trust scoring callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 rounded-2xl bg-slate-900 p-8 md:p-12 text-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block rounded-full bg-sky-500/20 px-4 py-1.5 text-sm font-semibold text-sky-300 tracking-wide mb-4">
                  Dynamic Trust Scoring
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Agents earn autonomy — they don&apos;t start with it
                </h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Trust scores update in real-time based on mission success rate, human override frequency,
                  error recovery, and latency. Low-trust agents require approval. High-trust agents operate autonomously.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
                    &lt;40 Observation
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium">
                    40-70 Supervised
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium">
                    &gt;70 Autonomous
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6">
                {/* Trust score gauge */}
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="url(#trustGradient)" strokeWidth="8" strokeDasharray={`${0.87 * 264} ${264}`} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold font-mono">87</span>
                    <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Autonomous</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Mission Success 40%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>Override Rate 25%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. Platform Capabilities ─── */}
      <section className="py-24 bg-gradient-to-b from-[#0F172A] via-[#1e293b] to-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-600/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <span className="inline-block rounded-full bg-sky-500/15 px-4 py-1.5 text-sm font-semibold text-sky-300 tracking-wide">
                Platform Capabilities
              </span>
            </motion.div>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trust Fabric - LEAD card (full width) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-3 group relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-sky-500/20 p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl group-hover:bg-sky-500/10 transition-colors" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6 text-sky-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Trust Fabric & Governance</h2>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    The core differentiator. Every agent action gets a cryptographic delegation token, passes through policy gates before execution, and produces an immutable hash-chained provenance record. This is what makes autonomous agents safe for production.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-300 text-sm border border-sky-500/20">
                      <KeyRound className="w-3.5 h-3.5" /> Delegation tokens
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-300 text-sm border border-sky-500/20">
                      <Shield className="w-3.5 h-3.5" /> Policy gates
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
                      <FileCheck className="w-3.5 h-3.5" /> Hash-chained provenance
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
                      <Gauge className="w-3.5 h-3.5" /> Dynamic trust scores
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SOC 2 Type II
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-sm border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Budget caps
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-3">
                    {/* Mini provenance preview */}
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                      <span>Provenance Chain</span>
                      <span className="text-emerald-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Verified</span>
                    </div>
                    {[
                      { step: 'delegation_issued', from: 'CEO', to: 'SalesAgent', status: 'tk_7f2a' },
                      { step: 'policy_check', from: 'PolicyEngine', to: 'crm.read', status: 'allowed' },
                      { step: 'action_completed', from: 'SalesAgent', to: 'founder', status: 'verified' },
                    ].map((entry, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
                        <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 text-[10px] font-bold">{i + 1}</span>
                        <span className="text-white flex-1 truncate">{entry.step}</span>
                        <span className="text-slate-500">{entry.from}→{entry.to}</span>
                        <span className="text-emerald-400">{entry.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AgentIRL orchestration card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl group-hover:bg-sky-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6 text-sky-400" />
                </div>
                <h2 className="text-xl font-bold mb-3">AgentIRL™ Orchestration</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Multi-agent coordination with &lt;150ms latency. Delegate, spawn, and synchronize across LangChain, CrewAI, and AutoGen.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span className="text-sm text-slate-400">99.99% uptime SLA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span className="text-sm text-slate-400">Framework-agnostic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span className="text-sm text-slate-400">Auto-recovery</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Analytics card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/10 transition-colors" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-teal-400" />
                </div>
                <h2 className="text-xl font-bold mb-3">Analytics</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Real-time dashboards, cost attribution, OTLP export to Datadog.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Live activity feed</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Cost per task</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> BI integrations</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ─── 2. Platform Capabilities ─── */}
      <section className="py-24 bg-gradient-to-b from-white via-emerald-50/20 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-100/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-teal-100/10 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Choose Your Path
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Platform Capabilities</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">The complete infrastructure for building, deploying, and governing autonomous AI.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AgentIRL - Orchestration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.1 }}
              className="p-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-emerald-50/20 hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-200 transition-all">
                <Cpu className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">AgentIRL™ Orchestration</h3>
              <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-wide">Runtime Layer</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Multi-agent coordination framework. Delegate tasks, spawn sub-agents, synchronize across LangChain, CrewAI, AutoGen, and MCP. Framework-agnostic execution with &lt;150ms latency.
              </p>
              <Link to="/services/agentirl" className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm flex items-center gap-2 group/btn">
                See Architecture
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Analytics - Observability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.1 }}
              className="p-8 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/50 to-teal-50/20 hover:border-teal-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-200 transition-all">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Analytics & Observability</h3>
              <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-wide">Real-time Visibility</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Live dashboards for agent performance, business metrics, and operational health. Track every action, attribute revenue, export to Datadog or Snowflake.
              </p>
              <Link to="/analytics" className="text-teal-700 hover:text-teal-800 font-semibold text-sm flex items-center gap-2 group/btn">
                View Demo Dashboard
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Governance - Trust */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.1 }}
              className="p-8 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-purple-50/20 hover:border-purple-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-200 transition-all">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Governance & Trust</h3>
              <p className="text-sm text-slate-500 mb-4 font-mono uppercase tracking-wide">Compliance Ready</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Task-scoped delegation tokens, approval gates, immutable audit logs. SOC 2 Type II readiness package. Deploy agents in regulated workflows with confidence.
              </p>
              <Link to="/enterprise" className="text-purple-700 hover:text-purple-800 font-semibold text-sm flex items-center gap-2 group/btn">
                View Compliance Features
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
                  href="/enterprise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  View Security & Trust <ArrowRight className="w-4 h-4" />
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-slate-800 to-[#0F172A]" />

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
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
              Trust your agents<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">with real work.</span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Cryptographic delegation tokens, real-time policy gates, and immutable provenance trails.
              Enterprise-ready. Production infrastructure. Live in 1-3 weeks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-sky-500 text-white text-lg font-bold hover:bg-sky-400 transition-colors shadow-xl shadow-sky-500/25">
                  Start Free Trial
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

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white border-t border-slate-100">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-lg">Everything you need to know about Viktron AI agent teams.</p>
          </div>
          <div className="space-y-6">
            {[
              {
                q: 'What is Viktron AI?',
                a: 'Viktron AI is an enterprise AI agent teams platform that deploys autonomous AI employees for sales, support, content, and operations. Our agents work 24/7, coordinate with each other through our AgentIRL orchestration platform, and integrate with your existing tools like Slack, CRM, and ERP systems.',
              },
              {
                q: 'How long does it take to deploy AI agents?',
                a: 'Most pre-built industry agents can be live within 1–2 weeks. Custom enterprise solutions with full integrations typically take 4–8 weeks. We handle all the setup, training, and integration so your team can focus on results.',
              },
              {
                q: 'What does Viktron AI cost?',
                a: 'Plans start at $199/month for the Starter plan (up to 2 agents, 10,000 interactions). Pro is $499/month for up to 5 agents. Enterprise is custom-priced with unlimited agents and our full AgentIRL platform. 14-day free trial available.',
              },
              {
                q: 'Which industries does Viktron AI serve?',
                a: 'We serve restaurants, healthcare clinics, salons, automotive dealerships, construction companies, real estate firms, legal practices, e-commerce stores, education providers, and recruitment agencies — each with purpose-built AI agents trained for their specific workflows.',
              },
              {
                q: 'How is Viktron AI different from a simple chatbot?',
                a: 'Viktron AI deploys teams of specialized agents — not a single chatbot. A CEO Agent coordinates Sales, Support, Analytics, and Operations agents simultaneously. They share context, hand off tasks, and make decisions autonomously. AgentIRL ensures enterprise-grade reliability with 99.9% uptime SLA.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{q}</h3>
                <p className="text-slate-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Still have questions? Talk to our team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Agent Path Selection Modal */}
      <AgentPathSelection isOpen={showAgentPath} onClose={() => setShowAgentPath(false)} />
    </Layout>
  );
};
