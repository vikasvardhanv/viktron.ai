import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Play, CheckCircle2, Loader2,
  Bot, Users, BrainCircuit, Target, Sparkles, Phone, MessageSquare
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// ── Inline Demo Data ──
const DEMO_PROMPT = `Launch my AI team for a plumbing business. Handle leads on WhatsApp, auto-reply to quotes, follow up in 48hrs, and send me a daily report.`;

const DEMO_AGENTS = [
  {
    role: 'CEO Agent', icon: BrainCircuit, color: '#3b82f6',
    actions: [
      'Parsing founder instruction...',
      'Identified 4 sub-tasks',
      'Assigning to Sales Agent: Handle WhatsApp leads',
      'Assigning to Sales Agent: Auto-reply with quotes',
      'Assigning to self: Daily report generation',
    ],
  },
  {
    role: 'Sales Agent', icon: Target, color: '#10b981',
    actions: [
      'Loading knowledge base: plumbing services & pricing...',
      'WhatsApp channel connected',
      'New lead: "How much for drain cleaning?"',
      'Searching KB... Match: Drain cleaning $150-$300',
      'Response sent in 6 seconds',
      'Booking confirmed: Tomorrow 2:00 PM',
    ],
  },
  {
    role: 'Support Agent', icon: MessageSquare, color: '#8b5cf6',
    actions: [
      'Customer: "What areas do you service?"',
      'KB search... Confidence: 94%',
      'Auto-reply: "We service all of Cook County, IL"',
      'Customer: "Do you do emergency calls?"',
      'Auto-reply: "Yes! 24/7 emergency service."',
    ],
  },
  {
    role: 'Content Agent', icon: Sparkles, color: '#f59e0b',
    actions: [
      'Brand voice loaded',
      'Creating "5 Signs You Need a Plumber" social post',
      'Post scheduled for tomorrow 9:00 AM',
      'All content queued for review',
    ],
  },
];

// ── Inline Demo Component ──
const InlineDemo = () => {
  const [phase, setPhase] = useState<'idle' | 'typing' | 'processing' | 'agents' | 'done'>('idle');
  const [typedText, setTypedText] = useState('');
  const [currentAgent, setCurrentAgent] = useState(0);
  const [currentAction, setCurrentAction] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<number[]>([]);

  // Start on viewport enter
  useEffect(() => {
    const t = setTimeout(() => setPhase('typing'), 1200);
    return () => clearTimeout(t);
  }, []);

  // Typing
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedText.length >= DEMO_PROMPT.length) {
      setTimeout(() => setPhase('processing'), 600);
      return;
    }
    const t = setTimeout(() => setTypedText(DEMO_PROMPT.slice(0, typedText.length + 1)), 30 + Math.random() * 20);
    return () => clearTimeout(t);
  }, [phase, typedText]);

  // Processing → agents
  useEffect(() => {
    if (phase !== 'processing') return;
    const t = setTimeout(() => setPhase('agents'), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  // Agent sequence
  useEffect(() => {
    if (phase !== 'agents') return;
    const agent = DEMO_AGENTS[currentAgent];
    if (!agent) { setPhase('done'); return; }
    if (currentAction >= agent.actions.length) {
      setCompletedAgents(prev => [...prev, currentAgent]);
      setTimeout(() => { setCurrentAgent(a => a + 1); setCurrentAction(0); }, 400);
      return;
    }
    const t = setTimeout(() => setCurrentAction(a => a + 1), 900);
    return () => clearTimeout(t);
  }, [phase, currentAgent, currentAction]);

  const activeAgent = DEMO_AGENTS[currentAgent];

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
        <div className="flex items-center gap-1.5 text-[10px] text-white/25 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="p-5 font-mono text-sm min-h-[340px]">
        {/* Prompt */}
        <div className="mb-4">
          <span className="text-white/25 text-xs">INSTRUCTION</span>
          <div className="mt-1 text-white/80 leading-relaxed text-xs">
            {typedText}
            {phase === 'typing' && (
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-0.5 h-3.5 bg-blue-400 ml-0.5 align-middle" />
            )}
          </div>
        </div>

        {/* Processing */}
        <AnimatePresence>
          {phase === 'processing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-blue-400 text-xs mb-4">
              <Loader2 className="w-3 h-3 animate-spin" /> Spinning up agent team...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent output */}
        {(phase === 'agents' || phase === 'done') && (
          <div className="space-y-3">
            {/* Agent tabs */}
            <div className="flex gap-1.5 mb-3">
              {DEMO_AGENTS.map((a, idx) => {
                const isActive = idx === currentAgent && phase === 'agents';
                const isDone = completedAgents.includes(idx);
                return (
                  <div key={idx} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] ${isActive ? 'bg-white/10 text-white' : isDone ? 'bg-white/5 text-white/40' : 'bg-white/[0.02] text-white/20'}`}>
                    {isDone ? <CheckCircle2 className="w-2.5 h-2.5 text-green-400" /> : isActive ? <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: a.color }} /> : null}
                    <span>{a.role}</span>
                  </div>
                );
              })}
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

            {/* Done state */}
            {phase === 'done' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4">
                <div className="flex items-center gap-2 text-green-400 text-xs mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All 4 agents deployed and operational
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { v: '4', l: 'Agents' }, { v: '6.2s', l: 'Avg Response' },
                    { v: '12', l: 'Leads/day' }, { v: '$3.10', l: 'Cost/day' },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="text-center">
                      <div className="text-lg font-bold text-white">{s.v}</div>
                      <div className="text-[9px] text-white/30 uppercase">{s.l}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Agent Cards ──
const AGENTS = [
  { role: 'Sales Agent', desc: 'Qualifies leads, responds in seconds, books appointments, follows up.', icon: Target, color: 'emerald' },
  { role: 'Support Agent', desc: 'Answers customer questions from your knowledge base, escalates when unsure.', icon: MessageSquare, color: 'purple' },
  { role: 'Content Agent', desc: 'Creates social posts, emails, and marketing copy trained on your brand.', icon: Sparkles, color: 'amber' },
  { role: 'CEO Agent', desc: 'Coordinates the team, delegates tasks, sends you daily reports.', icon: BrainCircuit, color: 'blue' },
];

const agentColors: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
};

// ── Page ──
export const Landing = () => {
  return (
    <Layout>
      <SEO
        title="Viktron | AI Agent Teams & AgentIRL Platform"
        description="Hire coordinated AI employees — Sales, Support, Content, and CEO agents that work 24/7. Powered by AgentIRL, the infrastructure layer for production-ready multi-agent systems. Plans from $199/mo."
        keywords="AI agent teams, AI employees, AI sales agent, AI support agent, AI CEO agent, AgentIRL, multi-agent orchestration, AI automation, voice AI, chatbot, WhatsApp automation, business AI"
        url="/"
      />

      {/* 1. Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 blur-[130px] rounded-full pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-600 mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Powered by AgentIRL
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                Your AI Workforce.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Ready to Deploy.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Hire a coordinated team of AI employees — Sales, Support, Content, and a CEO agent
                that runs everything. 24/7. From $199/mo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn btn-primary btn-lg rounded-lg h-14 px-8 text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                  <Play size={18} className="fill-current" /> Get Started
                </Link>
                <Link to="/use-cases" className="btn btn-secondary btn-lg rounded-lg h-14 px-8 text-lg flex items-center justify-center border-slate-200 bg-white hover:bg-slate-50 text-slate-900">
                  See Use Cases
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Live Demo — Embedded */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              See It In Action
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Type one instruction. Watch 4 AI agents spin up and start working.
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

      {/* 3. The Team — 4 agent cards */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Meet Your AI Team</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Four agents that communicate, delegate, and execute — like a real team.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AGENTS.map((agent, idx) => {
              const c = agentColors[agent.color];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <agent.icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{agent.role}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{agent.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works — 3 steps */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Tell Us Your Business', desc: 'Share your services, pricing, FAQ, and brand voice. We load it into the knowledge base.' },
              { step: '02', title: 'We Deploy Your Agents', desc: 'Your AI team goes live — Sales, Support, Content, CEO — connected to your channels.' },
              { step: '03', title: 'They Work 24/7', desc: 'Agents handle leads, answer questions, create content, and report back to you daily.' },
            ].map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-blue-100 mb-4">{s.step}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Metrics */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '< 8s', label: 'Average Response Time' },
              { value: '99.9%', label: 'Platform Uptime' },
              { value: '24/7', label: 'Always Available' },
              { value: '$199', label: 'Starting Price/mo' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to hire your AI team?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Deploy a coordinated AI workforce today. Start with one agent or hire the full team.
            No long-term contracts. Results in the first week.
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
