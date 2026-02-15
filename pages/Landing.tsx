import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Activity, Shield, Terminal, Play, Zap, CheckCircle2,
  Bot, Users, BrainCircuit, Target, Sparkles, Phone, MessageSquare
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AgentSimulation } from '../components/landing/AgentSimulation';
import { LiveMetricsDashboard } from '../components/landing/LiveMetricsDashboard';
import { ProcessWorkflow } from '../components/landing/ProcessWorkflow';
import { FeatureGrid } from '../components/landing/FeatureGrid';
import { UseCaseDemo } from '../components/landing/UseCaseDemo';
import { TrustSection } from '../components/landing/TrustSection';
import { AgentTeamShowcase } from '../components/landing/AgentTeamShowcase';

export const Landing = () => {
    return (
        <Layout>
            <SEO
              title="Viktron | AI Agent Teams & AgentIRL Platform"
              description="Hire coordinated AI employees — Sales, Support, Content, and CEO agents that work 24/7. Powered by AgentIRL, the infrastructure layer for production-ready multi-agent systems. Plans from $199/mo."
              keywords="AI agent teams, AI employees, AI sales agent, AI support agent, AI CEO agent, AgentIRL, multi-agent orchestration, AI automation, voice AI, chatbot, WhatsApp automation, business AI"
              url="/"
            />
            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-white">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 blur-[130px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/50 blur-[130px] rounded-full pointer-events-none" />

                <div className="container-custom relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
                        {/* Text Content */}
                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono text-blue-600 mb-8 backdrop-blur-md">
                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                    AI Agent Teams — Powered by AgentIRL
                                </div>

                                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                                    Your AI Team.<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Ready to Work.</span>
                                </h1>

                                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                                    Hire coordinated AI employees — Sales, Support, Content, and a CEO agent
                                    that runs your team. 24/7 availability, instant responses, real results.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                    <Link to="/agents" className="btn btn-primary btn-lg rounded-lg h-14 px-8 text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group">
                                        <Play size={20} className="fill-current" />
                                        Browse Agents
                                    </Link>
                                    <Link to="/use-cases" className="btn btn-secondary btn-lg rounded-lg h-14 px-8 text-lg flex items-center justify-center border-slate-200 bg-white hover:bg-slate-50 text-slate-900">
                                        See Use Cases
                                    </Link>
                                </div>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-mono">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-600" />
                                        <span>SOC2 Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-600" />
                                        <span>99.99% Uptime</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-blue-600" />
                                        <span>From $199/mo</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Hero Graphic - Agent Simulation */}
                        <div className="lg:w-1/2 h-[500px] w-full relative group perspective-1000">
                            <motion.div
                                initial={{ opacity: 0, rotateY: 10, scale: 0.9 }}
                                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="w-full h-full transform transition-all duration-500 group-hover:rotate-y-2"
                            >
                                <AgentSimulation />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* 2. Real Metrics Section */}
                <div className="container-custom relative z-20 -mb-32">
                     <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                     >
                        <div className="text-center mb-8">
                            <h2 className="text-sm font-mono text-slate-500 uppercase tracking-widest">Real-time Platform Observability</h2>
                        </div>
                        <LiveMetricsDashboard />
                     </motion.div>
                </div>
            </section>

            {/* Spacer for the overlapping dashboard */}
            <div className="h-40 bg-white" />

            {/* 3. Agent Team Showcase — The flagship interactive section */}
            <AgentTeamShowcase />

            {/* 4. What Your AI Team Can Do */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                            One Platform, Endless Capabilities
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            AI agents for sales, support, marketing, voice, and more — all coordinated by AgentIRL.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { icon: Target, label: 'AI Sales', desc: 'Qualify & close leads', link: '/services/ai-sales-agent' },
                            { icon: MessageSquare, label: 'AI Support', desc: 'Answer questions 24/7', link: '/services/ai-support-agent' },
                            { icon: Sparkles, label: 'AI Content', desc: 'Social & email copy', link: '/services/ai-content-agent' },
                            { icon: Phone, label: 'Voice AI', desc: 'Phone agents', link: '/services/voice-ai-agent' },
                            { icon: BrainCircuit, label: 'CEO Agent', desc: 'Team coordination', link: '/services/ai-ceo-agent' },
                            { icon: Users, label: 'Full Team', desc: 'All agents working', link: '/agents' },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <Link
                                    to={item.link}
                                    className="flex flex-col items-center p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all text-center group h-full"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm mb-1">{item.label}</span>
                                    <span className="text-xs text-slate-500">{item.desc}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Process / How It Works */}
            <ProcessWorkflow />

            {/* 6. Feature Grid */}
            <FeatureGrid />

            {/* 7. Use Case Demos */}
            <UseCaseDemo />

            {/* 8. Social Proof / Trust */}
            <TrustSection />

            {/* 9. Footer CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50" />
                <div className="container-custom relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Ready to hire your AI team?</h2>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Deploy a coordinated AI workforce today. Start with one agent or hire the full team.
                        No long-term contracts. Results in the first week.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/agents" className="btn btn-primary btn-lg rounded-lg h-12 px-8 shadow-lg shadow-blue-500/20 flex items-center justify-center">
                            Hire Agents
                        </Link>
                        <Link to="/contact" className="btn btn-secondary btn-lg rounded-lg h-12 px-8 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center">
                            Book Free Consultation
                        </Link>
                    </div>

                    {/* Pricing hint */}
                    <p className="mt-8 text-sm text-slate-500 font-mono">
                        Plans from $199/mo — Cancel anytime
                    </p>
                </div>
            </section>
        </Layout>
    );
};
