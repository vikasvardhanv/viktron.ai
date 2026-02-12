import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/layout/Layout';
import { 
  Bot, Play, Pause, Settings, Brain, GitBranch, 
  MessageSquare, Database, Globe, Zap, ArrowRight,
  CheckCircle, AlertCircle, Clock, Users, RefreshCw,
  Network, Cpu, Workflow
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'coordinator' | 'worker' | 'specialist';
  status: 'idle' | 'thinking' | 'working' | 'done';
  task: string;
  output?: string;
  icon: React.ReactNode;
  color: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
}

const scenarios = [
  {
    id: 'research',
    name: 'Market Research',
    description: 'Multiple agents collaborate to research competitors and market trends',
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: 'support',
    name: 'Customer Support',
    description: 'Agents triage, analyze, and resolve customer issues autonomously',
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 'content',
    name: 'Content Pipeline',
    description: 'Orchestrated agents create, review, and publish content',
    icon: <Workflow className="h-5 w-5" />,
  },
];

export const AgentOrchestrationDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'coordinator',
      name: 'Coordinator',
      type: 'coordinator',
      status: 'idle',
      task: 'Orchestrates other agents',
      icon: <Brain className="h-5 w-5" />,
      color: 'from-violet-500 to-purple-500',
    },
    {
      id: 'researcher',
      name: 'Research Agent',
      type: 'worker',
      status: 'idle',
      task: 'Gathers information',
      icon: <Globe className="h-5 w-5" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'analyst',
      name: 'Analysis Agent',
      type: 'specialist',
      status: 'idle',
      task: 'Processes data',
      icon: <Database className="h-5 w-5" />,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'writer',
      name: 'Writer Agent',
      type: 'worker',
      status: 'idle',
      task: 'Creates content',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'from-pink-500 to-rose-500',
    },
  ]);

  const orchestrationSteps = [
    { 
      agent: 'coordinator', 
      status: 'thinking' as const, 
      message: { from: 'User', to: 'Coordinator', content: 'Analyze competitor landscape for AI automation tools' },
      duration: 1500 
    },
    { 
      agent: 'coordinator', 
      status: 'working' as const, 
      message: { from: 'Coordinator', to: 'Research Agent', content: 'Gather data on top 5 competitors: pricing, features, market position' },
      duration: 1000 
    },
    { 
      agent: 'researcher', 
      status: 'thinking' as const,
      duration: 800 
    },
    { 
      agent: 'researcher', 
      status: 'working' as const, 
      output: 'Analyzing 127 data sources...',
      duration: 2000 
    },
    { 
      agent: 'researcher', 
      status: 'done' as const, 
      output: 'Research complete: 5 competitors identified',
      message: { from: 'Research Agent', to: 'Coordinator', content: 'Data gathered: Jasper, Copy.ai, Writesonic, Rytr, Anyword' },
      duration: 1000 
    },
    { 
      agent: 'coordinator', 
      status: 'working' as const, 
      message: { from: 'Coordinator', to: 'Analysis Agent', content: 'Process competitor data and identify market gaps' },
      duration: 800 
    },
    { 
      agent: 'analyst', 
      status: 'thinking' as const,
      duration: 600 
    },
    { 
      agent: 'analyst', 
      status: 'working' as const, 
      output: 'Processing competitive intelligence...',
      duration: 2500 
    },
    { 
      agent: 'analyst', 
      status: 'done' as const, 
      output: 'Analysis complete: 3 market gaps identified',
      message: { from: 'Analysis Agent', to: 'Coordinator', content: 'Key insight: No competitor offers multi-agent orchestration' },
      duration: 1000 
    },
    { 
      agent: 'coordinator', 
      status: 'working' as const, 
      message: { from: 'Coordinator', to: 'Writer Agent', content: 'Create executive summary with findings and recommendations' },
      duration: 800 
    },
    { 
      agent: 'writer', 
      status: 'thinking' as const,
      duration: 500 
    },
    { 
      agent: 'writer', 
      status: 'working' as const, 
      output: 'Drafting executive summary...',
      duration: 2000 
    },
    { 
      agent: 'writer', 
      status: 'done' as const, 
      output: 'Report ready for review',
      message: { from: 'Writer Agent', to: 'Coordinator', content: '500-word executive summary complete with 3 strategic recommendations' },
      duration: 1000 
    },
    { 
      agent: 'coordinator', 
      status: 'done' as const, 
      output: 'Task completed successfully',
      message: { from: 'Coordinator', to: 'User', content: '✅ Analysis complete. Report ready with competitor insights and market opportunities.' },
      duration: 500 
    },
  ];

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= orchestrationSteps.length) {
      setIsRunning(false);
      return;
    }

    const step = orchestrationSteps[currentStep];
    
    // Update agent status
    setAgents(prev => prev.map(agent => 
      agent.id === step.agent 
        ? { ...agent, status: step.status, output: step.output || agent.output }
        : agent
    ));

    // Add message if present
    if (step.message) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        from: step.message!.from,
        to: step.message!.to,
        content: step.message!.content,
        timestamp: new Date(),
      }]);
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  const startOrchestration = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setMessages([]);
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' as const, output: undefined })));
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setMessages([]);
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' as const, output: undefined })));
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'idle': return 'bg-white/20';
      case 'thinking': return 'bg-yellow-400 animate-pulse';
      case 'working': return 'bg-blue-400 animate-pulse';
      case 'done': return 'bg-emerald-400';
      default: return 'bg-white/20';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6"
            >
              <Network className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300">Multi-Agent Orchestration Demo</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Agentic AI Orchestration
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Watch multiple AI agents collaborate in real-time to complete complex tasks 
              through autonomous coordination.
            </p>
          </div>

          {/* Scenario Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedScenario.id === scenario.id
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {scenario.icon}
                {scenario.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Agents Panel */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">AI Agents</h3>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Cpu className="h-4 w-4" />
                  {agents.filter(a => a.status !== 'idle').length} active
                </div>
              </div>

              <div className="space-y-4">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    layout
                    className={`p-4 rounded-xl border transition-all ${
                      agent.status !== 'idle'
                        ? 'bg-white/10 border-white/20'
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color}`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{agent.name}</span>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)}`} />
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">{agent.task}</p>
                        {agent.output && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-white/60 mt-2 flex items-center gap-1"
                          >
                            {agent.status === 'done' ? (
                              <CheckCircle className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            )}
                            {agent.output}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={isRunning ? resetDemo : startOrchestration}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isRunning 
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                      : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-400 hover:to-purple-400'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Orchestration
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Communication Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-panel rounded-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Agent Communication</h3>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <MessageSquare className="h-4 w-4" />
                  {messages.length} messages
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <GitBranch className="h-12 w-12 text-white/10 mb-4" />
                      <p className="text-white/30">Agent communication will appear here</p>
                      <p className="text-sm text-white/20 mt-2">Click "Run Orchestration" to start</p>
                    </motion.div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/50 to-purple-500/50 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
                            <span className="font-medium text-white/60">{message.from}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span className="font-medium text-white/60">{message.to}</span>
                          </div>
                          <p className="text-sm text-white/80">{message.content}</p>
                        </div>
                        <span className="text-xs text-white/20 flex-shrink-0">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Progress */}
              {isRunning && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm text-white/40 mb-2">
                    <span>Progress</span>
                    <span>{Math.round((currentStep / orchestrationSteps.length) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / orchestrationSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: <Network className="h-5 w-5" />, title: 'Multi-Agent Coordination', desc: 'Agents work together autonomously' },
              { icon: <Brain className="h-5 w-5" />, title: 'Intelligent Routing', desc: 'Tasks assigned based on capabilities' },
              { icon: <Zap className="h-5 w-5" />, title: 'Real-time Execution', desc: 'Parallel processing for speed' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{feature.title}</h4>
                    <p className="text-xs text-white/40">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-white/40 mb-4">Ready to deploy autonomous AI agents?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/demos')}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                ← Back to Demos
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-bold transition-all"
              >
                Build Your Agent Network
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
