import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target, MessageSquare, BrainCircuit, Sparkles, Phone,
  ArrowRight, CheckCircle2, Users, Bot, Zap, TrendingUp,
  Mail, Calendar
} from 'lucide-react';

const AGENTS = [
  {
    role: 'CEO Agent',
    icon: BrainCircuit,
    color: 'blue',
    status: 'Coordinating',
    desc: 'Breaks your instructions into tasks, delegates to specialists, generates daily reports.',
    actions: [
      'Received founder instruction: "Create social campaign for new product"',
      'Breaking into 3 sub-tasks...',
      'Assigned to Content Agent: Create 5 Instagram posts',
      'Assigned to Sales Agent: Draft outreach email',
      'Monitoring progress...',
      'Daily report generated. 12 tasks completed today.',
    ],
  },
  {
    role: 'Sales Agent',
    icon: Target,
    color: 'emerald',
    status: 'Responding to lead',
    desc: 'Qualifies leads, responds in under 30 seconds, books appointments, follows up.',
    actions: [
      'New lead received via WhatsApp: "How much for drain cleaning?"',
      'Searching knowledge base... Found: Drain cleaning $150-300',
      'Drafting personalized response...',
      'Response sent in 8 seconds',
      'Lead classified: HOT — appointment requested',
      'Booking confirmed: Tomorrow 2:00 PM',
    ],
  },
  {
    role: 'Support Agent',
    icon: MessageSquare,
    color: 'purple',
    status: 'Auto-resolving ticket',
    desc: 'Answers customer questions from your knowledge base, escalates when uncertain.',
    actions: [
      'Customer: "What are your business hours?"',
      'Searching knowledge base... Confidence: 95%',
      'Auto-responding: "We\'re open Mon-Fri 8am-6pm, Sat 9am-2pm"',
      'Customer: "Can I reschedule my appointment?"',
      'Confidence: 72% — below threshold',
      'Escalated to human with suggested response',
    ],
  },
  {
    role: 'Content Agent',
    icon: Sparkles,
    color: 'amber',
    status: 'Creating posts',
    desc: 'Creates social posts, email campaigns, and marketing copy on brand.',
    actions: [
      'Task from CEO: Create 5 Instagram posts for new product',
      'Loading brand voice profile...',
      'Post 1/5: "Transform your space with our new..." ✓',
      'Post 2/5: "Before & after: See the difference..." ✓',
      'Post 3/5: "Limited time offer: 20% off..." ✓',
      'All 5 posts ready for review',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
};

export const AgentTeamShowcase = () => {
  const [activeAgent, setActiveAgent] = useState(0);
  const [actionIndex, setActionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActionIndex(prev => {
        const maxActions = AGENTS[activeAgent].actions.length;
        if (prev >= maxActions - 1) {
          // Move to next agent
          setActiveAgent(a => (a + 1) % AGENTS.length);
          return 0;
        }
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [activeAgent]);

  const agent = AGENTS[activeAgent];
  const colors = colorMap[agent.color];

  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono text-blue-600 mb-6">
            <Bot className="w-3 h-3" /> Your AI Team in Action
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Hire AI Employees, <br className="hidden md:block" />Not Just Chatbots
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            A coordinated team of AI agents that communicate, delegate, and execute —
            like having a real team, but available 24/7 for a fraction of the cost.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Agent Selector */}
          <div className="lg:col-span-2 space-y-3">
            {AGENTS.map((a, idx) => {
              const c = colorMap[a.color];
              const isActive = idx === activeAgent;
              return (
                <button
                  key={idx}
                  onClick={() => { setActiveAgent(idx); setActionIndex(0); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? `border-slate-300 bg-white shadow-md ring-2 ${c.ring}`
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                      <a.icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{a.role}</span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{a.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}

            <Link
              to="/agents"
              className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              View All Agents <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Live Agent Terminal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-slate-100 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="ml-3 text-xs text-slate-600 font-mono">
                    {agent.role.toLowerCase().replace(' ', '_')}_live.log
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${colors.bg} ${colors.text} border`}>
                    {agent.status}
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 min-h-[320px] bg-slate-50/50">
                <div className="space-y-3">
                  {agent.actions.slice(0, actionIndex + 1).map((action, idx) => (
                    <motion.div
                      key={`${activeAgent}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-3 text-sm"
                    >
                      <span className="text-slate-400 font-mono text-xs shrink-0 pt-0.5 w-16">
                        {`${String(10 + idx).padStart(2, '0')}:${String(42 + idx * 3).padStart(2, '0')}:${String(idx * 7 % 60).padStart(2, '0')}`}
                      </span>
                      <div className="flex items-start gap-2">
                        {idx === actionIndex ? (
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${colors.text.replace('text-', 'bg-')} animate-pulse`} />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        )}
                        <span className="text-slate-700 font-mono text-xs leading-relaxed">{action}</span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Cursor */}
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-4 bg-slate-600 ml-16 mt-2"
                  />
                </div>
              </div>

              {/* Stats Bar */}
              <div className="bg-white px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Tasks completed: 47</span>
                <span>Avg response: 8.2s</span>
                <span>Cost today: $2.40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
