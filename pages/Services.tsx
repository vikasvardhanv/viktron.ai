import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import {
  Bot, Database, ShieldCheck, Terminal,
  Workflow, Microscope, ArrowRight, CheckCircle2,
  Target, MessageSquare, BrainCircuit, Sparkles, Phone,
  Mic, Mail, Globe, BarChart3, Layers, Users, Cpu, Shield
} from 'lucide-react';
import { ServicesPopup, SERVICE_CATEGORIES } from '../components/ServicesPopup';
import { SEO } from '../components/ui/SEO';

const HIGHLIGHT_SERVICES = [
  {
    title: "AI Agent Teams",
    desc: "Hire a coordinated AI workforce — Sales, Support, Content, and CEO agents that communicate, delegate, and execute together.",
    icon: Users,
    link: '/services/ai-sales-agent',
    features: [
      "Sales Agent — Qualify leads & close",
      "Support Agent — Auto-resolve tickets",
      "Content Agent — Social & email copy",
      "CEO Agent — Coordinates everything"
    ]
  },
  {
    title: "Voice & Chat Agents",
    desc: "AI-powered phone agents, WhatsApp bots, website chatbots, and SMS automation — on every channel your customers use.",
    icon: Phone,
    link: '/services/voice-ai-agent',
    features: [
      "Voice AI — Human-like phone calls",
      "WhatsApp Automation",
      "Website Chatbot",
      "SMS Follow-ups"
    ]
  },
  {
    title: "Workflow Automation",
    desc: "AI-powered automation that reasons about edge cases instead of breaking. Connects to 100+ enterprise tools.",
    icon: Workflow,
    link: '/services/workflow-automation',
    features: [
      "AI Decision Points",
      "ERP/CRM Integration",
      "Approval Workflows",
      "Error Recovery"
    ]
  },
  {
    title: "Digital Marketing AI",
    desc: "SEO content, social media campaigns, email sequences, and lead generation — all powered by AI and trained on your brand.",
    icon: Globe,
    link: '/services/seo-content-ai',
    features: [
      "SEO & Content Generation",
      "Social Media Automation",
      "Email Campaigns",
      "Lead Generation"
    ]
  },
  {
    title: "AgentIRL Platform",
    desc: "The infrastructure layer that makes multi-agent systems production-ready. Orchestration, reliability, monitoring.",
    icon: Cpu,
    link: '/services/agent-orchestration',
    features: [
      "Multi-Agent Orchestration",
      "Reliability Engineering",
      "Enterprise Integration",
      "99.9% Uptime SLA"
    ]
  },
  {
    title: "AI Audit & Consulting",
    desc: "Assess your AI readiness, identify high-impact automation opportunities, and build a custom implementation roadmap.",
    icon: Microscope,
    link: '/services/ai-audit-consulting',
    features: [
      "ROI Analysis",
      "Technical Feasibility",
      "Vendor Selection",
      "Implementation Roadmap"
    ]
  }
];

export const Services = () => {
  const [showAllServices, setShowAllServices] = useState(false);

  return (
    <Layout>
      <SEO
        title="AI Services | Agent Teams, Voice AI, Automation & Marketing"
        description="Explore Viktron's AI services: coordinated agent teams, voice & chat agents, workflow automation, digital marketing AI, and the AgentIRL enterprise platform. Start from $199/mo."
        keywords="AI services, AI agent teams, voice AI agent, workflow automation, digital marketing AI, AgentIRL platform, AI consulting, AI audit, chatbot, WhatsApp bot, SMS automation"
        url="/services"
      />
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono mb-6">
            Our Services
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            AI Solutions That <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Grow Your Business</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            From AI agent teams that handle sales and support, to voice agents, workflow automation,
            and digital marketing — we build the AI systems that drive real revenue.
          </p>
          <button
            onClick={() => setShowAllServices(true)}
            className="btn btn-primary rounded-xl px-8 py-3 text-lg shadow-lg shadow-blue-500/20 inline-flex items-center gap-2"
          >
            Explore All Services <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HIGHLIGHT_SERVICES.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-blue-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-1">
                  {service.desc}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={service.link}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mt-auto"
                >
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-xl mx-auto">From onboarding to results in days, not months.</p>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pricing That Scales With You</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Start small, grow big. No long-term contracts.</p>
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

      {/* All Services Popup */}
      <ServicesPopup isOpen={showAllServices} onClose={() => setShowAllServices(false)} />
    </Layout>
  );
};
