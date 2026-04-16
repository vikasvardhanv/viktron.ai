import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import {
  ArrowRight, CheckCircle2, Users, Cpu, BarChart3, Sparkles
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';

const HIGHLIGHT_SERVICES = [
  {
    title: "Agent",
    desc: "Deploy autonomous AI agents for Sales, Support, Content, and CEO-level orchestration. 24/7 operations with zero human overhead.",
    icon: Users,
    link: '/agents',
    color: 'blue',
    bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
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
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
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
    bgImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
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
    bgImage: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200',
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
      <section className="py-20 bg-white border-t border-slate-200">
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
                  className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col bg-white"
                >
                  {/* Background Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <img
                      src={service.bgImage}
                      alt={service.title}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>

                    <h3 className={`text-2xl font-bold text-slate-900 mb-2 ${colors.textHover} transition-colors`}>
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
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


    </Layout>
  );
};
