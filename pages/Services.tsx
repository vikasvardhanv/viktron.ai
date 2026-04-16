import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import {
  Bot, Database, ShieldCheck, Terminal,
  Workflow, Microscope, ArrowRight, CheckCircle2,
  Target, MessageSquare, BrainCircuit, Sparkles, Phone,
  Mic, Mail, Globe, BarChart3, Layers, Users, Cpu, Shield, Activity
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';

const HIGHLIGHT_SERVICES = [
  {
    title: "Agent",
    desc: "Deploy autonomous AI agents for Sales, Support, Content, and CEO-level orchestration. 24/7 operations with zero human overhead.",
    icon: Users,
    link: '/agents',
    color: 'blue',
    features: [
      "Sales Agent — Qualify leads & close deals",
      "Support Agent — Auto-resolve customer tickets",
      "Content Agent — Marketing copy & posts",
      "CEO Agent — Orchestrate all agents"
    ]
  },
  {
    title: "AgentIRL",
    desc: "Enterprise infrastructure for multi-agent orchestration. Deploy, monitor, and scale with 99.9% uptime and production-grade security.",
    icon: Cpu,
    link: '/services/agentirl',
    color: 'indigo',
    features: [
      "Multi-Agent Orchestration — Sync & coordinate",
      "Real-time Observability — Monitor all activity",
      "Enterprise Reliability — Auto-retry & fallbacks",
      "50+ Integrations — Connect your tech stack"
    ]
  },
  {
    title: "Analytics + Consulting",
    desc: "Track visitors, conversations, and conversions. Expert consulting to optimize your AI-powered business for maximum ROI.",
    icon: BarChart3,
    link: 'https://analytics.viktron.ai',
    color: 'emerald',
    external: true,
    features: [
      "Visitor Tracking — See all customer activity",
      "Conversion Funnels — Revenue flow optimization",
      "Agent Performance — Quality & sentiment metrics",
      "Expert Consulting — Custom ROI strategies"
    ]
  },
  {
    title: "Rentals",
    desc: "Rent pre-built AI agents by the hour or day. Start immediately without setup — perfect for trials, scaling, or seasonal needs.",
    icon: Sparkles,
    link: '/rent',
    color: 'purple',
    features: [
      "Hourly Pricing — Pay exactly what you use",
      "Pre-built Agents — Sales, Support, Content ready",
      "No Setup — Deploy in seconds",
      "Auto-scaling — Handle peak demand instantly"
    ]
  }
];

export const Services = () => {
  return (
    <Layout>
      <SEO
        title="Viktron AI Products | Agent, AgentIRL, Analytics, Rentals"
        description="Discover Viktron AI's 4 core products: Agent (autonomous AI teams), AgentIRL (production infrastructure), Analytics + Consulting (insights & optimization), and Rentals (hourly agent marketplace). Enterprise-ready. From $199/mo."
        keywords="Viktron AI products, AI agent teams, AgentIRL platform, analytics for AI, agent rentals, autonomous agents, enterprise AI platform, multi-agent orchestration"
        url="/services"
      />
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono mb-6">
            Viktron AI Products
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Four Products.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">One AI Platform.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Deploy AI Agent Teams, power your infrastructure with AgentIRL, understand your customers with Analytics + Consulting, or rent agents on-demand. Enterprise-grade. Production-ready.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HIGHLIGHT_SERVICES.map((service, idx) => {
              const colorMap: { [key: string]: { bg: string; bgHover: string; text: string; textHover: string; icon: string; iconCheck: string } } = {
                blue: { bg: 'bg-blue-50', bgHover: 'hover:border-blue-200', text: 'text-blue-600', textHover: 'group-hover:text-blue-600', icon: 'text-blue-600', iconCheck: 'text-blue-500' },
                indigo: { bg: 'bg-indigo-50', bgHover: 'hover:border-indigo-200', text: 'text-indigo-600', textHover: 'group-hover:text-indigo-600', icon: 'text-indigo-600', iconCheck: 'text-indigo-500' },
                emerald: { bg: 'bg-emerald-50', bgHover: 'hover:border-emerald-200', text: 'text-emerald-600', textHover: 'group-hover:text-emerald-600', icon: 'text-emerald-600', iconCheck: 'text-emerald-500' },
                purple: { bg: 'bg-purple-50', bgHover: 'hover:border-purple-200', text: 'text-purple-600', textHover: 'group-hover:text-purple-600', icon: 'text-purple-600', iconCheck: 'text-purple-500' },
              };
              const colors = colorMap[service.color] || colorMap.blue;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white p-8 rounded-2xl border border-slate-200 ${colors.bgHover} hover:shadow-lg transition-all duration-300 group flex flex-col`}
                >
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>

                  <h3 className={`text-xl font-bold text-slate-900 mb-3 ${colors.textHover} transition-colors`}>
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-1">
                    {service.desc}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className={`w-4 h-4 ${colors.iconCheck} shrink-0`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {service.external ? (
                    <a
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-sm font-medium ${colors.text} hover:opacity-75 transition-colors mt-auto`}
                    >
                      Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      to={service.link}
                      className={`flex items-center gap-2 text-sm font-medium ${colors.text} hover:opacity-75 transition-colors mt-auto`}
                    >
                      Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Deploy in Days, Not Months</h2>
            <p className="text-slate-600 max-w-xl mx-auto">From initial consultation to live agents. Our streamlined deployment process gets you running in 1-3 weeks.</p>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-0">
            {[
              { step: '01', title: 'Tell Us Your Business', desc: 'Share your services, pricing, and brand voice. We map the best AI agent setup for your needs.' },
              { step: '02', title: 'We Deploy Your Agents', desc: 'Your AI team goes live — connected to your phone, email, chat, and CRM channels.' },
              { step: '03', title: 'They Work 24/7', desc: 'Agents handle leads, support, content, and report daily. You focus on growing your business.' },
            ].map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-1 flex items-start gap-4 md:px-8 md:border-l md:first:border-l-0 border-slate-200"
              >
                <span className="text-4xl font-bold text-blue-100 shrink-0">{s.step}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Agent Plans for Every Business</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Start with a single agent or deploy a full team. Scale up as you grow. No long-term contracts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <div className="text-3xl font-bold text-slate-900 mb-1">$199<span className="text-base font-normal text-slate-500">/mo</span></div>
              <p className="text-slate-600 mb-6 text-sm">Single AI agent for one use case.</p>
              <ul className="space-y-3 mb-8">
                {['1 AI Agent (Sales or Support)', 'Up to 500 conversations/mo', 'Email & SMS channels', 'Basic analytics'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block text-center py-3 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium text-sm transition-colors">
                Get Started
              </Link>
            </div>

            <div className="p-8 rounded-2xl border border-blue-200 bg-blue-50/50 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Most Popular</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Team</h3>
              <div className="text-3xl font-bold text-slate-900 mb-1">$499<span className="text-base font-normal text-slate-500">/mo</span></div>
              <p className="text-slate-600 mb-6 text-sm">Full AI team with CEO coordination.</p>
              <ul className="space-y-3 mb-8">
                {['Sales + Support + Content + CEO agents', 'Unlimited conversations', 'All channels (voice, chat, email, SMS)', 'Full analytics & daily reports'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block text-center py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">
                Get Started
              </Link>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-slate-900 mb-1">Custom</div>
              <p className="text-slate-600 mb-6 text-sm">AgentIRL platform + custom agents.</p>
              <ul className="space-y-3 mb-8">
                {['AgentIRL platform access', 'Custom agent development', 'Enterprise integrations (SAP, Oracle)', 'Dedicated engineering pod'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block text-center py-3 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium text-sm transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};
