import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import {
  ArrowRight, CheckCircle2, Users, Cpu, BarChart3, Sparkles, Zap
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';

const MAIN_SERVICES = [
  {
    title: "Agent",
    desc: "Deploy autonomous AI agents for Sales, Support, Content, and CEO-level orchestration. 24/7 operations with zero human overhead.",
    icon: Users,
    link: '/onboarding',
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
  }
];

const RENTALS_SERVICE = {
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
};

export const Services = () => {
  return (
    <Layout>
      <SEO
        title="Viktron AI Products | Agent, AgentIRL, Analytics, Rentals"
        description="Discover Viktron AI's 4 core products: Agent (autonomous AI teams), AgentIRL (production infrastructure), Analytics + Consulting (insights & optimization), and Rentals (hourly agent marketplace). Enterprise-ready. From $199/mo."
        keywords="Viktron AI products, AI agent teams, AgentIRL platform, analytics for AI, agent rentals, autonomous agents, enterprise AI platform, multi-agent orchestration"
        url="/services"
        canonicalUrl="https://viktron.ai/services"
      />
      {/* Hero */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Background imagery + gradient blobs — matching Landing page */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')" }}
        />
        {/* Gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-right blue glow */}
          <div className="absolute -top-40 -right-40 w-[900px] h-[900px] bg-blue-200/50 blur-[160px] rounded-full" />
          {/* Bottom-left indigo glow */}
          <div className="absolute -bottom-20 -left-40 w-[700px] h-[700px] bg-indigo-200/40 blur-[140px] rounded-full" />
          {/* Center violet accent */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-100/30 blur-[120px] rounded-full" />
          {/* Top-left teal micro-accent */}
          <div className="absolute top-20 left-16 w-[300px] h-[300px] bg-cyan-100/40 blur-[100px] rounded-full" />
        </div>
        {/* Subtle dot-grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Content */}
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-8 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Viktron AI Products
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
              Four Products.<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 animate-gradient">One AI Platform.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-2 font-medium">
              Everything you need to deploy, scale, and optimize autonomous AI agents.
            </p>
            <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
              From <strong>autonomous agent teams</strong> to production infrastructure, analytics, and on-demand rentals — <strong>enterprise-grade solutions</strong> built for growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-100/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-blue-100/10 rounded-full blur-3xl" />
        </div>
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">Core Services</h2>
            <p className="text-slate-600 text-lg">Enterprise-grade solutions for autonomous AI agents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {MAIN_SERVICES.map((service, idx) => {
              const colorMap: { [key: string]: { bg: string; border: string; text: string; textHover: string; icon: string; iconCheck: string; shadow: string } } = {
                blue: { bg: 'bg-blue-50', border: 'border-blue-200/50 hover:border-blue-300', text: 'text-blue-600', textHover: 'group-hover:text-blue-700', icon: 'text-blue-600', iconCheck: 'text-blue-500', shadow: 'group-hover:shadow-blue-500/10' },
                indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200/50 hover:border-indigo-300', text: 'text-indigo-600', textHover: 'group-hover:text-indigo-700', icon: 'text-indigo-600', iconCheck: 'text-indigo-500', shadow: 'group-hover:shadow-indigo-500/10' },
                emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200/50 hover:border-emerald-300', text: 'text-emerald-600', textHover: 'group-hover:text-emerald-700', icon: 'text-emerald-600', iconCheck: 'text-emerald-500', shadow: 'group-hover:shadow-emerald-500/10' },
                purple: { bg: 'bg-purple-50', border: 'border-purple-200/50 hover:border-purple-300', text: 'text-purple-600', textHover: 'group-hover:text-purple-700', icon: 'text-purple-600', iconCheck: 'text-purple-500', shadow: 'group-hover:shadow-purple-500/10' },
              };
              const colors = colorMap[service.color] || colorMap.blue;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                  className={`relative rounded-2xl border ${colors.border} overflow-hidden bg-white backdrop-blur-sm transition-all duration-500 group flex flex-col h-full hover:shadow-2xl ${colors.shadow}`}
                >
                  {/* Accent line at top */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: service.color === 'blue' ? '#2563eb' : service.color === 'indigo' ? '#4f46e5' : service.color === 'emerald' ? '#059669' : '#a855f7' }} />

                  {/* Background Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    <img
                      src={service.bgImage}
                      alt={service.title}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50" />
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <service.icon className={`w-7 h-7 ${colors.icon}`} />
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl lg:text-3xl font-bold text-slate-900 mb-3 ${colors.textHover} transition-colors duration-300`}>
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 mb-7 leading-relaxed text-base flex-1">
                      {service.desc}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className={`w-5 h-5 ${colors.iconCheck} shrink-0 mt-0.5`} />
                          <span className="text-slate-700 text-sm font-medium">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    {service.external ? (
                      <a
                        href={service.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-base font-semibold ${colors.text} hover:gap-3 transition-all duration-300 mt-auto group/btn`}
                      >
                        Explore
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </a>
                    ) : (
                      <Link
                        to={service.link}
                        className={`inline-flex items-center gap-2 text-base font-semibold ${colors.text} hover:gap-3 transition-all duration-300 mt-auto group/btn`}
                      >
                        Explore {service.title}
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rentals Section */}
      <section className="py-24 bg-gradient-to-br from-white via-purple-50/30 to-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-200/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-indigo-100/10 rounded-full blur-3xl" />
        </div>
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">Agent Rentals</h2>
            <p className="text-slate-600 text-lg">Start immediately without long-term commitment.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {(() => {
              const service = RENTALS_SERVICE;
              const colorMap: { [key: string]: { bg: string; border: string; text: string; textHover: string; icon: string; iconCheck: string; shadow: string } } = {
                blue: { bg: 'bg-blue-50', border: 'border-blue-200/50 hover:border-blue-300', text: 'text-blue-600', textHover: 'group-hover:text-blue-700', icon: 'text-blue-600', iconCheck: 'text-blue-500', shadow: 'group-hover:shadow-blue-500/10' },
                indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200/50 hover:border-indigo-300', text: 'text-indigo-600', textHover: 'group-hover:text-indigo-700', icon: 'text-indigo-600', iconCheck: 'text-indigo-500', shadow: 'group-hover:shadow-indigo-500/10' },
                emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200/50 hover:border-emerald-300', text: 'text-emerald-600', textHover: 'group-hover:text-emerald-700', icon: 'text-emerald-600', iconCheck: 'text-emerald-500', shadow: 'group-hover:shadow-emerald-500/10' },
                purple: { bg: 'bg-purple-50', border: 'border-purple-200/50 hover:border-purple-300', text: 'text-purple-600', textHover: 'group-hover:text-purple-700', icon: 'text-purple-600', iconCheck: 'text-purple-500', shadow: 'group-hover:shadow-purple-500/10' },
              };
              const colors = colorMap[service.color] || colorMap.blue;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`relative rounded-2xl border ${colors.border} overflow-hidden bg-white backdrop-blur-sm transition-all duration-500 group flex flex-col h-full hover:shadow-2xl ${colors.shadow}`}
                >
                  {/* Accent line at top */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: '#a855f7' }} />

                  {/* Background Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    <img
                      src={service.bgImage}
                      alt={service.title}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50" />
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <service.icon className={`w-7 h-7 ${colors.icon}`} />
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl lg:text-3xl font-bold text-slate-900 mb-3 ${colors.textHover} transition-colors duration-300`}>
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 mb-7 leading-relaxed text-base flex-1">
                      {service.desc}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className={`w-5 h-5 ${colors.iconCheck} shrink-0 mt-0.5`} />
                          <span className="text-slate-700 text-sm font-medium">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link
                      to={service.link}
                      className={`inline-flex items-center gap-2 text-base font-semibold ${colors.text} hover:gap-3 transition-all duration-300 mt-auto group/btn`}
                    >
                      Browse Rentals
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </section>

    </Layout>
  );
};
