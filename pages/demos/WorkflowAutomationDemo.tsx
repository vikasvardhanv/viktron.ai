import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../../components/layout/Layout';
import { 
  ArrowRight, Zap, Mail, Database, MessageSquare, Clock, 
  CheckCircle2, Play, Pause, RotateCcw, Settings, GitBranch,
  Bell, FileText, Users, TrendingUp, Workflow
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'completed' | 'waiting';
}

const workflowTemplates = [
  {
    id: 'lead-nurture',
    name: 'Lead Nurturing',
    description: 'Automatically nurture leads through personalized email sequences',
    nodes: [
      { id: '1', type: 'trigger', title: 'New Lead Captured', description: 'Form submission detected', icon: <Users className="h-5 w-5" />, status: 'pending' },
      { id: '2', type: 'action', title: 'Send Welcome Email', description: 'Personalized greeting', icon: <Mail className="h-5 w-5" />, status: 'pending' },
      { id: '3', type: 'delay', title: 'Wait 2 Days', description: 'Delay before next action', icon: <Clock className="h-5 w-5" />, status: 'pending' },
      { id: '4', type: 'condition', title: 'Email Opened?', description: 'Check engagement', icon: <GitBranch className="h-5 w-5" />, status: 'pending' },
      { id: '5', type: 'action', title: 'Send Follow-up', description: 'Tailored content', icon: <MessageSquare className="h-5 w-5" />, status: 'pending' },
      { id: '6', type: 'action', title: 'Notify Sales Team', description: 'Hot lead alert', icon: <Bell className="h-5 w-5" />, status: 'pending' },
    ]
  },
  {
    id: 'customer-onboard',
    name: 'Customer Onboarding',
    description: 'Streamline new customer setup with automated tasks',
    nodes: [
      { id: '1', type: 'trigger', title: 'New Customer', description: 'Payment confirmed', icon: <TrendingUp className="h-5 w-5" />, status: 'pending' },
      { id: '2', type: 'action', title: 'Create Account', description: 'Setup in CRM', icon: <Database className="h-5 w-5" />, status: 'pending' },
      { id: '3', type: 'action', title: 'Send Welcome Kit', description: 'Onboarding materials', icon: <FileText className="h-5 w-5" />, status: 'pending' },
      { id: '4', type: 'delay', title: 'Wait 1 Day', description: 'Allow setup time', icon: <Clock className="h-5 w-5" />, status: 'pending' },
      { id: '5', type: 'action', title: 'Schedule Call', description: 'Book intro call', icon: <MessageSquare className="h-5 w-5" />, status: 'pending' },
    ]
  },
  {
    id: 'support-escalation',
    name: 'Support Escalation',
    description: 'Intelligent ticket routing and escalation',
    nodes: [
      { id: '1', type: 'trigger', title: 'Ticket Created', description: 'Support request', icon: <MessageSquare className="h-5 w-5" />, status: 'pending' },
      { id: '2', type: 'action', title: 'AI Classification', description: 'Analyze priority', icon: <Zap className="h-5 w-5" />, status: 'pending' },
      { id: '3', type: 'condition', title: 'Urgent?', description: 'Check severity', icon: <GitBranch className="h-5 w-5" />, status: 'pending' },
      { id: '4', type: 'action', title: 'Assign Agent', description: 'Route to team', icon: <Users className="h-5 w-5" />, status: 'pending' },
      { id: '5', type: 'action', title: 'Send Update', description: 'Notify customer', icon: <Bell className="h-5 w-5" />, status: 'pending' },
    ]
  }
];

export const WorkflowAutomationDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(workflowTemplates[0]);
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflowTemplates[0].nodes as WorkflowNode[]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stats, setStats] = useState({ executed: 0, saved: 0, efficiency: 0 });

  const runWorkflow = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    for (let i = 0; i < nodes.length; i++) {
      setNodes(prev => prev.map((node, idx) => ({
        ...node,
        status: idx === i ? 'running' : idx < i ? 'completed' : 'pending'
      })));
      setCurrentStep(i);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setNodes(prev => prev.map((node, idx) => ({
        ...node,
        status: idx <= i ? 'completed' : 'pending'
      })));
      
      setStats(prev => ({
        executed: prev.executed + 1,
        saved: prev.saved + Math.floor(Math.random() * 5) + 2,
        efficiency: Math.min(99, prev.efficiency + Math.floor(Math.random() * 10) + 5)
      }));
    }
    
    setIsRunning(false);
  };

  const resetWorkflow = () => {
    setNodes(selectedTemplate.nodes as WorkflowNode[]);
    setCurrentStep(-1);
    setIsRunning(false);
  };

  const selectTemplate = (template: typeof workflowTemplates[0]) => {
    setSelectedTemplate(template);
    setNodes(template.nodes as WorkflowNode[]);
    setCurrentStep(-1);
    setIsRunning(false);
  };

  const getNodeColor = (status: WorkflowNode['status'], type: WorkflowNode['type']) => {
    if (status === 'completed') return 'border-emerald-500 bg-emerald-500/20';
    if (status === 'running') return 'border-sky-500 bg-sky-500/20 animate-pulse';
    if (type === 'trigger') return 'border-purple-500/50 bg-purple-500/10';
    if (type === 'condition') return 'border-amber-500/50 bg-amber-500/10';
    if (type === 'delay') return 'border-slate-500/50 bg-slate-500/10';
    return 'border-white/10 bg-white/5';
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6"
            >
              <Workflow className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300">Workflow Automation Demo</span>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              AI-Powered Workflow Automation
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Watch how our AI automates complex business processes in real-time. 
              Select a workflow template and see the magic happen.
            </p>
          </div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="glass-panel rounded-2xl p-6 text-center">
              <p className="text-3xl font-black text-sky-400">{stats.executed}</p>
              <p className="text-sm text-white/40">Steps Executed</p>
            </div>
            <div className="glass-panel rounded-2xl p-6 text-center">
              <p className="text-3xl font-black text-emerald-400">{stats.saved}h</p>
              <p className="text-sm text-white/40">Time Saved</p>
            </div>
            <div className="glass-panel rounded-2xl p-6 text-center">
              <p className="text-3xl font-black text-purple-400">{stats.efficiency}%</p>
              <p className="text-sm text-white/40">Efficiency Gain</p>
            </div>
          </motion.div>

          {/* Template Selector */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {workflowTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => selectTemplate(template)}
                disabled={isRunning}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTemplate.id === template.id
                    ? 'bg-sky-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>

          {/* Workflow Visualization */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedTemplate.name}</h3>
                <p className="text-sm text-white/40">{selectedTemplate.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetWorkflow}
                  disabled={isRunning}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all disabled:opacity-50"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
                <button
                  onClick={runWorkflow}
                  disabled={isRunning || currentStep === nodes.length - 1}
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isRunning ? 'Running...' : 'Run Workflow'}
                </button>
              </div>
            </div>

            {/* Workflow Nodes */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500/50 via-purple-500/50 to-emerald-500/50" />
              
              <div className="space-y-4">
                <AnimatePresence>
                  {nodes.map((node, index) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-500 ${getNodeColor(node.status, node.type as WorkflowNode['type'])}`}
                    >
                      <div className={`relative z-10 p-3 rounded-xl ${
                        node.status === 'completed' ? 'bg-emerald-500' : 
                        node.status === 'running' ? 'bg-sky-500' : 'bg-white/10'
                      }`}>
                        {node.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : (
                          node.icon
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            node.type === 'trigger' ? 'bg-purple-500/20 text-purple-300' :
                            node.type === 'condition' ? 'bg-amber-500/20 text-amber-300' :
                            node.type === 'delay' ? 'bg-slate-500/20 text-slate-300' :
                            'bg-sky-500/20 text-sky-300'
                          }`}>
                            {node.type}
                          </span>
                          {node.status === 'running' && (
                            <span className="text-[10px] uppercase tracking-widest text-sky-400 animate-pulse">Processing...</span>
                          )}
                        </div>
                        <h4 className="text-white font-semibold mt-1">{node.title}</h4>
                        <p className="text-sm text-white/40">{node.description}</p>
                      </div>
                      {index < nodes.length - 1 && (
                        <ArrowRight className={`h-5 w-5 ${node.status === 'completed' ? 'text-emerald-400' : 'text-white/20'}`} />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-white/40 mb-4">Ready to automate your business processes?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/demos')}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                ← Back to Demos
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all"
              >
                Get Custom Automation
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
