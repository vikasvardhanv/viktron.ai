import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import {
  Send, RotateCcw, CheckCircle2, Loader2,
  ArrowRight, Sparkles, Zap, Users, FileText, Brain
} from 'lucide-react';

const FOUNDER_PROMPT =
  'Launch our new AI consulting service — draft an outreach campaign and identify our first 10 target customers.';

const DEMO_API = 'https://api.viktron.ai/api/demo/ceo-plan';

// ── Scripted steps (steps 2–5 play after CEO responds) ─────────────────────

const SALES_MESSAGES = [
  'Scanning ICP database — filtering by industry, headcount, and AI spend signals...',
  'Cross-referencing LinkedIn, Crunchbase, and job board signals...',
  '10 high-fit targets identified:',
  '1. Notion (Series C, 800 employees, active AI hiring)\n2. Rippling (Series D, 1,200 employees, HR automation)\n3. Brex (Series D, 1,000 employees, fintech)\n4. Figma (post-IPO, 1,500 employees, design tools)\n5. Retool (Series C, 600 employees, internal tools)\n6. Linear (Series B, 200 employees, dev tooling)\n7. Vercel (Series D, 500 employees, frontend infra)\n8. Loom (acquired by Atlassian, still autonomous)\n9. Intercom (Series D, 900 employees, customer comms)\n10. Airtable (Series F, 1,400 employees, no-code)\nAll 10 flagged as AI-ready with active buying signals.',
];

const CONTENT_MESSAGES = [
  'Drafting 3-email outreach sequence...',
  '📧 Email 1 — Awareness\nSubject: "Your team is doing 3 people\'s jobs. We built the 4th."\nBody: 2 sentences on the AI labor arbitrage problem. No pitch yet.',
  '📧 Email 2 — Value Prop\nSubject: "How [Company] could automate [specific workflow] in 48 hours"\nBody: Personalised to each target\'s known pain point. Links to case study.',
  '📧 Email 3 — Direct Ask\nSubject: "15 minutes this week?"\nBody: One-line ask for a call. CEO-to-CEO tone. No marketing language.\n\nAll 3 emails personalised for each of the 10 targets. Ready to send.',
];

const CEO_SUMMARY =
  'Campaign complete. Sales Agent identified 10 high-fit targets with active buying signals. Content Agent produced a 3-email personalised sequence for each. I\'ve reviewed both outputs — quality gate passed. Outreach is ready to deploy on your signal, founder.';

// ── Agent config ────────────────────────────────────────────────────────────

type AgentStatus = 'idle' | 'active' | 'done';

interface AgentConfig {
  id: string;
  name: string;
  role: string;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  icon: React.ReactNode;
}

const AGENTS: AgentConfig[] = [
  {
    id: 'ceo',
    name: 'CEO Agent',
    role: 'Orchestrator',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
    icon: <Brain className="h-4 w-4" />,
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    role: 'Lead Research',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: 'content',
    name: 'Content Agent',
    role: 'Copywriter',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    dotColor: 'bg-violet-500',
    icon: <FileText className="h-4 w-4" />,
  },
];

// ── Feed message type ────────────────────────────────────────────────────────

interface FeedMessage {
  id: string;
  agentId: string;
  text: string;
  isLive?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function getAgent(id: string): AgentConfig {
  return AGENTS.find(a => a.id === id)!;
}

// ── Main component ───────────────────────────────────────────────────────────

type DemoState = 'idle' | 'running' | 'done';

export const InvestorDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>('idle');
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({
    ceo: 'idle', sales: 'idle', content: 'idle',
  });
  const [feed, setFeed] = useState<FeedMessage[]>([]);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feed]);

  const setStatus = (id: string, status: AgentStatus) =>
    setAgentStatuses(prev => ({ ...prev, [id]: status }));

  const addMessage = (agentId: string, text: string, isLive = false) =>
    setFeed(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, agentId, text, isLive }]);

  const runDemo = async () => {
    setDemoState('running');
    setFeed([]);
    setAgentStatuses({ ceo: 'idle', sales: 'idle', content: 'idle' });

    // ── Step 1: CEO (real Anthropic call) ──────────────────────────────────
    setStatus('ceo', 'active');
    addMessage('ceo', 'Received. Analysing instruction and assembling delegation plan...', true);
    await sleep(800);

    let ceoPlan = '';
    try {
      const res = await fetch(DEMO_API, { method: 'POST' });
      const data = await res.json();
      ceoPlan = data.plan ?? '';
    } catch {
      ceoPlan =
        'Understood. I\'m delegating this across two agents immediately. Sales Agent will research and identify the top 10 target customers based on our ICP. Content Agent will draft a 3-email outreach sequence. I\'ll consolidate their outputs and have the full campaign ready within the hour.';
    }

    setFeed(prev => prev.filter(m => !m.isLive));
    addMessage('ceo', ceoPlan);
    setStatus('ceo', 'done');
    await sleep(1200);

    // ── Step 2: Sales Agent (scripted) ─────────────────────────────────────
    setStatus('sales', 'active');
    for (const msg of SALES_MESSAGES) {
      addMessage('sales', msg);
      await sleep(msg.length > 100 ? 2000 : 1200);
    }
    setStatus('sales', 'done');
    await sleep(800);

    // ── Step 3: Content Agent (scripted) ───────────────────────────────────
    setStatus('content', 'active');
    for (const msg of CONTENT_MESSAGES) {
      addMessage('content', msg);
      await sleep(msg.length > 100 ? 2200 : 1200);
    }
    setStatus('content', 'done');
    await sleep(800);

    // ── Step 4: CEO summary ────────────────────────────────────────────────
    setStatus('ceo', 'active');
    addMessage('ceo', CEO_SUMMARY);
    await sleep(600);
    setStatus('ceo', 'done');

    setDemoState('done');
  };

  const reset = () => {
    setDemoState('idle');
    setFeed([]);
    setAgentStatuses({ ceo: 'idle', sales: 'idle', content: 'idle' });
  };

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            CEO Agent powered by live Anthropic AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            See your AI team{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              in action
            </span>
          </h1>
          <p className="mt-3 text-slate-500 text-base max-w-xl mx-auto">
            Send one instruction. Watch your CEO, Sales, and Content agents coordinate and deliver — autonomously.
          </p>
        </div>
      </div>

      {/* ── Main two-column layout ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Command Panel (2/5) ─────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Prompt card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Founder Message</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed font-medium border border-slate-100">
                {FOUNDER_PROMPT}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Sent as: <span className="font-medium text-slate-500">Acme Corp · AI Consulting</span>
              </div>

              <div className="mt-4">
                {demoState === 'idle' && (
                  <motion.button
                    onClick={runDemo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow"
                  >
                    <Send className="h-4 w-4" />
                    Send to Agents
                  </motion.button>
                )}
                {demoState === 'running' && (
                  <div className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Agents working...
                  </div>
                )}
                {demoState === 'done' && (
                  <motion.button
                    onClick={reset}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Run again
                  </motion.button>
                )}
              </div>
            </div>

            {/* Agent status cards */}
            <div className="flex flex-col gap-2">
              {AGENTS.map(agent => {
                const status = agentStatuses[agent.id];
                return (
                  <div
                    key={agent.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                      status === 'active'
                        ? `${agent.bgColor} ${agent.borderColor}`
                        : status === 'done'
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${agent.bgColor} ${agent.color}`}>
                      {agent.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800">{agent.name}</div>
                      <div className="text-xs text-slate-400">{agent.role}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {status === 'idle' && (
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                      {status === 'active' && (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${agent.dotColor} opacity-75`} />
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${agent.dotColor}`} />
                        </span>
                      )}
                      {status === 'done' && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: Activity Feed (3/5) ──────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full min-h-[480px] flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-slate-700">Agent Activity Feed</span>
                {demoState === 'running' && (
                  <span className="ml-auto text-xs text-blue-500 font-medium animate-pulse">Live</span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {feed.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Ready to launch</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Send to Agents" to start the demo</p>
                  </div>
                )}

                <AnimatePresence>
                  {feed.map(msg => {
                    const agent = getAgent(msg.agentId);
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-xl p-3.5 border ${agent.bgColor} ${agent.borderColor}`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-md ${agent.color} opacity-80`}>
                            {agent.icon}
                          </div>
                          <span className={`text-xs font-bold ${agent.color}`}>{agent.name}</span>
                          {msg.isLive && (
                            <span className="ml-auto text-xs text-blue-500 font-medium">⚡ Live AI</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={feedEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Done state CTA ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {demoState === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/20"
            >
              <div>
                <p className="font-bold text-lg">Ready to deploy your own agent team?</p>
                <p className="text-blue-100 text-sm mt-0.5">
                  Get CEO, Sales, Content, Support and more — running in 24 hours.
                </p>
              </div>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-xl text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default InvestorDemo;
