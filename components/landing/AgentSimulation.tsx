import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, AlertCircle, Shield, CheckCircle2, RefreshCw, Database } from 'lucide-react';

export const AgentSimulation = ({ activeScenario = 'reliability' }: { activeScenario?: string }) => {
  const [step, setStep] = useState(0);

  // Simulation steps for different scenarios
  const scenarios: Record<string, any[]> = {
    'reliability': [
      { status: 'idle', text: 'Agent ready' },
      { status: 'working', text: 'Executing task: Process Refund' },
      { status: 'error', text: 'Error: API Timeout (500)' },
      { status: 'intercept', text: 'Viktron: Retry Strategy Triggered' },
      { status: 'success', text: 'Task Completed Successfully' }
    ],
    'security': [
      { status: 'idle', text: 'Agent ready' },
      { status: 'working', text: 'Reading User Database...' },
      { status: 'risk', text: 'Attempting to output PII (Email)' },
      { status: 'intercept', text: 'Viktron: PII Masking Applied' },
      { status: 'success', text: 'Output: u***@example.com' }
    ],
    'integration': [
      { status: 'idle', text: 'Agent ready' },
      { status: 'working', text: 'Connecting to Legacy ERP...' },
      { status: 'error', text: 'Format Error: XML Expected' },
      { status: 'intercept', text: 'Viktron: Schema Adapter Active' },
      { status: 'success', text: 'Data Synced' }
    ],
    'loop': [
      { status: 'idle', text: 'Agent ready' },
      { status: 'working', text: 'Thinking...' },
      { status: 'working', text: 'Thinking...' },
      { status: 'intercept', text: 'Viktron: Recursion Limit Hit' },
      { status: 'success', text: 'Loop Terminated. Admin Notified.' }
    ]
  };

  const currentSequence = scenarios[activeScenario] || scenarios['reliability'];

  useEffect(() => {
    setStep(0);
    const interval = setInterval(() => {
      setStep(s => (s + 1) % currentSequence.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeScenario]);

  const currentStepData = currentSequence[step];

  return (
    <div className="w-full h-full min-h-[400px] bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Central Agent Node */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
        
        {/* Top: Model */}
        <div className="flex flex-col items-center gap-2">
           <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md">
             <Cpu className="text-blue-600" />
           </div>
           <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">LLM Engine</span>
        </div>

        {/* Connection Line */}
        <div className="h-12 w-px bg-slate-200 relative overflow-hidden">
          <motion.div 
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute w-0.5 h-6 bg-blue-600 left-1/2 -translate-x-1/2 blur-[1px]"
          />
        </div>

        {/* Middle: Agent Status */}
        <div className={`
          relative w-full p-6 rounded-xl border transition-all duration-500 flex items-center justify-between gap-4 backdrop-blur-md
          ${currentStepData.status === 'idle' ? 'border-slate-200 bg-slate-50' : ''}
          ${currentStepData.status === 'working' ? 'border-blue-200 bg-blue-50 shadow-sm' : ''}
          ${currentStepData.status === 'error' || currentStepData.status === 'risk' ? 'border-red-200 bg-red-50 shadow-sm' : ''}
          ${currentStepData.status === 'intercept' ? 'border-amber-200 bg-amber-50 shadow-sm' : ''}
          ${currentStepData.status === 'success' ? 'border-emerald-200 bg-emerald-50 shadow-sm' : ''}
        `}>
           <div className="flex items-center gap-3 w-full">
             <div className="shrink-0">
                {currentStepData.status === 'working' && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />}
                {currentStepData.status === 'error' || currentStepData.status === 'risk' ? <AlertCircle className="w-5 h-5 text-red-600" /> : null}
                {currentStepData.status === 'intercept' && <Shield className="w-5 h-5 text-amber-600" />}
                {currentStepData.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {currentStepData.status === 'idle' && <div className="w-2 h-2 rounded-full bg-slate-300" />}
             </div>
             <span className="font-mono text-sm text-slate-800 truncate">{currentStepData.text}</span>
           </div>
        </div>

        {/* Connection Line */}
        <div className="h-12 w-px bg-slate-200 relative overflow-hidden">
           {currentStepData.status !== 'error' && (
             <motion.div 
               animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
               className="absolute w-0.5 h-6 bg-blue-600 left-1/2 -translate-x-1/2 blur-[1px]"
             />
           )}
        </div>

        {/* Bottom: Destination */}
        <div className="flex flex-col items-center gap-2">
           <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-md">
             <Database className="text-slate-500" />
           </div>
           <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Enterprise ERP</span>
        </div>

      </div>

      {/* Overlay Status Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 backdrop-blur-sm shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {activeScenario} Mode
        </span>
      </div>
    </div>
  );
};
