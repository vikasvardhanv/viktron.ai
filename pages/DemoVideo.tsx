import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Target, MessageSquare, Sparkles,
  CheckCircle2, Loader2, Zap, ArrowRight
} from 'lucide-react';

const TYPED_PROMPT = `Launch my AI team for a plumbing business. Handle leads on WhatsApp, auto-reply to quotes, follow up in 48hrs, and send me a daily report.`;

const AGENT_SEQUENCE = [
  {
    role: 'CEO Agent',
    icon: BrainCircuit,
    color: '#3b82f6',
    actions: [
      'Parsing founder instruction...',
      'Identified 4 sub-tasks',
      'Assigning to Sales Agent: Handle WhatsApp leads',
      'Assigning to Sales Agent: Auto-reply with quotes',
      'Assigning to Sales Agent: 48hr follow-up sequence',
      'Assigning to self: Daily report generation',
      'All tasks dispatched. Monitoring...',
    ],
  },
  {
    role: 'Sales Agent',
    icon: Target,
    color: '#10b981',
    actions: [
      'Loading knowledge base: plumbing services & pricing...',
      'WhatsApp channel connected',
      'New lead: "How much for drain cleaning?"',
      'Searching KB... Match: Drain cleaning $150-$300',
      'Response sent in 6 seconds',
      'Lead classified: HOT — appointment requested',
      'Booking confirmed: Tomorrow 2:00 PM',
      'Follow-up scheduled: 48hrs if no response',
    ],
  },
  {
    role: 'Support Agent',
    icon: MessageSquare,
    color: '#8b5cf6',
    actions: [
      'Monitoring incoming questions...',
      'Customer: "What areas do you service?"',
      'KB search... Confidence: 94%',
      'Auto-reply: "We service all of Cook County, IL"',
      'Customer: "Do you do emergency calls?"',
      'KB search... Confidence: 97%',
      'Auto-reply: "Yes! 24/7 emergency service. Call now."',
    ],
  },
  {
    role: 'Content Agent',
    icon: Sparkles,
    color: '#f59e0b',
    actions: [
      'Brand voice loaded',
      'Generating Google Business review response...',
      'Creating "5 Signs You Need a Plumber" social post',
      'Post scheduled for tomorrow 9:00 AM',
      'Email campaign draft: "Winter pipe protection tips"',
      'All content queued for review',
    ],
  },
];

// Stats that animate at the end
const FINAL_STATS = [
  { label: 'Agents Active', value: '4' },
  { label: 'Avg Response', value: '6.2s' },
  { label: 'Leads Handled', value: '12' },
  { label: 'Cost Today', value: '$3.10' },
];

export const DemoVideo = () => {
  const [phase, setPhase] = useState<'idle' | 'typing' | 'processing' | 'agents' | 'done'>('idle');
  const [typedText, setTypedText] = useState('');
  const [currentAgent, setCurrentAgent] = useState(0);
  const [currentAction, setCurrentAction] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start automatically after 1.5s
  useEffect(() => {
    const t = setTimeout(() => setPhase('typing'), 1500);
    return () => clearTimeout(t);
  }, []);

  // Typing effect
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedText.length >= TYPED_PROMPT.length) {
      setTimeout(() => setPhase('processing'), 800);
      return;
    }
    const t = setTimeout(() => {
      setTypedText(TYPED_PROMPT.slice(0, typedText.length + 1));
    }, 35 + Math.random() * 25);
    return () => clearTimeout(t);
  }, [phase, typedText]);

  // Processing -> agents
  useEffect(() => {
    if (phase !== 'processing') return;
    const t = setTimeout(() => setPhase('agents'), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  // Agent action sequence
  useEffect(() => {
    if (phase !== 'agents') return;
    const agent = AGENT_SEQUENCE[currentAgent];
    if (!agent) {
      setPhase('done');
      return;
    }
    if (currentAction >= agent.actions.length) {
      setCompletedAgents(prev => [...prev, currentAgent]);
      setTimeout(() => {
        setCurrentAgent(prev => prev + 1);
        setCurrentAction(0);
      }, 600);
      return;
    }
    timerRef.current = setTimeout(() => {
      setCurrentAction(prev => prev + 1);
    }, 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, currentAgent, currentAction]);

  const activeAgent = AGENT_SEQUENCE[currentAgent];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-mono selection:bg-blue-500/30">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-white/40 ml-2">viktron.ai — AgentIRL Console</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-4xl mx-auto w-full">

        {/* Prompt input area */}
        <div className="w-full mb-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-3">
            Founder Instruction
          </div>
          <div className="relative bg-white/[0.03] border border-white/10 rounded-xl p-6 min-h-[100px]">
            <span className="text-white/90 text-lg leading-relaxed">
              {typedText}
            </span>
            {phase === 'typing' && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-blue-400 ml-0.5 align-middle"
              />
            )}
            {phase === 'idle' && (
              <span className="text-white/20 text-lg">Type your instruction...</span>
            )}
          </div>

          {/* Submit indicator */}
          <AnimatePresence>
            {phase === 'processing' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mt-4 text-sm text-blue-400"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing instruction... Spinning up agent team...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agent panels */}
        <AnimatePresence>
          {(phase === 'agents' || phase === 'done') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-3"
            >
              {/* Agent tabs */}
              <div className="flex gap-2 mb-4">
                {AGENT_SEQUENCE.map((agent, idx) => {
                  const isActive = idx === currentAgent && phase === 'agents';
                  const isDone = completedAgents.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-300 ${
                        isActive
                          ? 'bg-white/10 border border-white/20'
                          : isDone
                          ? 'bg-white/[0.03] border border-white/5 opacity-60'
                          : 'bg-white/[0.02] border border-white/5 opacity-30'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: agent.color }} />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white/20" />
                      )}
                      <span style={{ color: isActive || isDone ? agent.color : 'rgba(255,255,255,0.3)' }}>
                        {agent.role}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Active agent terminal */}
              {activeAgent && phase === 'agents' && (
                <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <activeAgent.icon className="w-4 h-4" style={{ color: activeAgent.color }} />
                      <span className="text-xs" style={{ color: activeAgent.color }}>
                        {activeAgent.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/30">
                      {currentAction}/{activeAgent.actions.length} actions
                    </span>
                  </div>
                  <div className="p-4 space-y-2 min-h-[200px]">
                    {activeAgent.actions.slice(0, currentAction).map((action, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="text-white/15 text-xs w-12 shrink-0 pt-0.5 text-right">
                          {`${String(10 + idx).padStart(2, '0')}:${String(30 + idx * 4).padStart(2, '0')}`}
                        </span>
                        {idx === currentAction - 1 ? (
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 animate-pulse" style={{ backgroundColor: activeAgent.color }} />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500/60 shrink-0 mt-0.5" />
                        )}
                        <span className="text-white/70">{action}</span>
                      </motion.div>
                    ))}
                    {/* Blinking cursor */}
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-4 ml-16 mt-2"
                      style={{ backgroundColor: activeAgent?.color || '#3b82f6' }}
                    />
                  </div>
                </div>
              )}

              {/* Final stats */}
              {phase === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 text-sm">All 4 agents deployed and operational</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {FINAL_STATS.map((stat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.15 }}
                          className="text-center"
                        >
                          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-center space-y-3"
                  >
                    <p className="text-white/50 text-sm">
                      Your AI team is live. 24/7. From <span className="text-white font-bold">$499/mo</span>.
                    </p>
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      viktron.ai
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom status bar */}
      <div className="px-6 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/20">
        <span>AgentIRL v1.0 — Multi-Agent Orchestration</span>
        <span>Powered by CrewAI + LangGraph + CAMEL</span>
      </div>
    </div>
  );
};
