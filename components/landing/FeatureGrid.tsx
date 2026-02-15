import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, Lock, Database, Code, Activity, Cloud, MessageSquare, Terminal, BrainCircuit, UserCheck, ShieldCheck, Coins } from 'lucide-react';

const FEATURE_HIGHLIGHTS = [
    {
        title: "Integration Library",
        desc: "Plug-and-play connectors for Salesforce, HubSpot, Stripe, and 50+ enterprise tools.",
        icon: Database,
        color: "blue"
    },
    {
        title: "Context & Memory",
        desc: "Persistent knowledge graph that allows agents to remember user preferences across sessions.",
        icon: BrainCircuit,
        color: "purple"
    },
    {
        title: "Human-in-the-Loop",
        desc: "Seamless escalation protocols. Let agents handle 80%, humans handle the sensitive 20%.",
        icon: UserCheck,
        color: "emerald"
    },
    {
        title: "Reliability Engine",
        desc: "Automatic retries, circuit breakers, and fallback models when APIs go down.",
        icon: ShieldCheck,
        color: "amber"
    },
    {
        title: "Model Optimizer",
        desc: "Route simple tasks to cheaper models (GPT-3.5) and complex ones to reasoning models (GPT-4).",
        icon: Coins,
        color: "cyan"
    },
    {
        title: "Enterprise Security",
        desc: "SOC2 compliant logging, PII redaction, and role-based access control (RBAC).",
        icon: Lock,
        color: "red"
    }
];

export const FeatureGrid = () => {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            
            <div className="container-custom relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Everything You Need to Scale
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Viktron provides the missing infrastructure layer for deploying autonomous agents in production environments.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURE_HIGHLIGHTS.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${feature.color}-400/0 via-${feature.color}-500/50 to-${feature.color}-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            
                            <div className={`mb-6 w-12 h-12 rounded-xl bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon size={24} />
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
