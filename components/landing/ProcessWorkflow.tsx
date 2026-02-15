import React from 'react';
import { motion } from 'framer-motion';
import { Database, GitBranch, LayoutDashboard, Monitor, RefreshCw, Server, Settings, Zap } from 'lucide-react';

export const ProcessWorkflow = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-4 tracking-tight">
                        How Viktron Works
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        A complete lifecycle management platform for enterprise AI agents.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200/0 via-blue-200 to-blue-200/0" />

                    {[
                        {
                            title: '1. Connect & Integrate',
                            desc: 'Plug into your existing stack with 100+ pre-built connectors for ERP, CRM, and Databases.',
                            icon: Server,
                            color: 'blue'
                        },
                        {
                            title: '2. Monitor & Control',
                            desc: 'Full observability dashboard with real-time logs, cost tracking, and security guardrails.',
                            icon: LayoutDashboard,
                            color: 'purple'
                        },
                        {
                            title: '3. Optimize & Scale',
                            desc: 'Use data-driven insights to refine prompts, reduce latency, and automate complex workflows.',
                            icon: Zap,
                            color: 'emerald'
                        }
                    ].map((step, idx) => (
                        <div key={idx} className="relative group">
                            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-${step.color}-50 text-${step.color}-600 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-${step.color}-100`}>
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {step.desc}
                                </p>
                            </div>
                            
                            {/* Step Indicator */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-mono text-slate-500 border border-slate-200 rounded-full">
                                {String(idx + 1).padStart(2, '0')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
