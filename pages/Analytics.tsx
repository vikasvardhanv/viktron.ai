import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, type Variants, type Transition } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  BarChart3,
  Activity,
  Eye,
  TrendingUp,
  Zap,
  CheckCircle2,
  Database,
  Layers,
  Shield,
  Clock,
  Users,
  Target,
  DollarSign,
  MessageSquare,
  PieChart,
  LineChart,
  BarChart,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

const fadeUpTransition: Transition = { duration: 0.55, ease: 'easeOut' };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: fadeUpTransition },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Metrics data
const metrics = [
  { value: '2,847', label: 'Visitors', change: '+23%', icon: Users, color: 'text-blue-600' },
  { value: '1,204', label: 'AI Conversations', change: '+41%', icon: MessageSquare, color: 'text-emerald-600' },
  { value: '312', label: 'Conversions', change: '+18%', icon: Target, color: 'text-purple-600' },
  { value: '$8.47', label: 'Avg Cost/Task', change: '-12%', icon: DollarSign, color: 'text-amber-600' },
];

const features = [
  {
    icon: Activity,
    title: 'Live Agent Activity Feed',
    desc: 'Real-time stream of every agent action: who did what, when, why, and what changed. Filter by agent, task, or time window.',
  },
  {
    icon: BarChart3,
    title: 'Business Metrics Attribution',
    desc: 'Connect agent actions to revenue, cost savings, and operational efficiency. Prove ROI with data, not anecdotes.',
  },
  {
    icon: PieChart,
    title: 'Agent Performance Scoring',
    desc: 'Resolution rates, sentiment analysis, latency tracking, and human override rates. Identify which agents excel and which need tuning.',
  },
  {
    icon: LineChart,
    title: 'Conversion Funnels',
    desc: 'Track visitor → conversation → conversion across all AI touchpoints. Spot drop-off points and optimize.',
  },
  {
    icon: Database,
    title: 'Custom Dashboards',
    desc: 'Build views for executives, engineers, and compliance teams. Save, share, and schedule automated reports.',
  },
  {
    icon: Download,
    title: 'OTLP Export',
    desc: 'Pipe all telemetry to Datadog, Grafana, Snowflake, or your BI stack. Full compatibility with OpenTelemetry backends.',
  },
];

const useCases = [
  {
    title: 'For CTOs',
    metrics: ['System health overview', 'Agent uptime & latency', 'Error rates by workflow', 'Cost attribution per team'],
    color: 'blue',
  },
  {
    title: 'For Ops Leaders',
    metrics: ['Tasks automated / day', 'Human handoff rate', 'Resolution time trends', 'ROI per agent team'],
    color: 'emerald',
  },
  {
    title: 'For Compliance',
    metrics: ['Audit trail completeness', 'Approval gate stats', 'Policy violations blocked', 'Data access logs'],
    color: 'amber',
  },
];

const dashboardPreview = [
  { time: '10:42:31', agent: 'CEO Agent', action: 'Spawned Sales Agent for lead qualification', status: 'success', cost: '$0.002' },
  { time: '10:42:35', agent: 'Sales Agent', action: 'Scored lead: 87% match (high intent)', status: 'success', cost: '$0.004' },
  { time: '10:42:38', agent: 'Sales Agent', action: 'Sent personalized demo invite email', status: 'success', cost: '$0.003' },
  { time: '10:42:45', agent: 'Support Agent', action: 'Resolved ticket #4891: CSV export issue', status: 'success', cost: '$0.005' },
  { time: '10:42:52', agent: 'Analytics Agent', action: 'Generated weekly report → #exec-dashboard', status: 'success', cost: '$0.008' },
];

export const Analytics: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);

  // Redirect authenticated users to the app
  if (isAuthenticated) {
    return <Navigate to="/saas-analytics" replace />;
  }

  // Cycle through dashboard rows
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRow((prev) => (prev + 1) % dashboardPreview.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <SEO
        title="Analytics & Observability | Real-time AI Agent Monitoring"
        description="Track every agent action, attribute revenue, and monitor operational health in real-time. Amplitude-grade analytics for AI agent teams. OTLP export to Datadog, Grafana, Snowflake."
        keywords="AI agent analytics, agent observability, AI monitoring, real-time agent tracking, AI performance metrics, agent cost attribution, AI dashboard, OTLP export"
        url="/analytics"
        canonicalUrl="https://viktron.ai/analytics"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 tracking-wide">
                  Analytics & Observability
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-6xl"
              >
                See what your agents are doing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">In real-time.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Amplitude-grade analytics for AI agent teams. Track every action, attribute revenue,
                monitor operational health, and export to your BI stack.
              </motion.p>

              {/* Metric chips */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {[
                  'Sub-second dashboards',
                  'Full audit trail',
                  'OTLP export',
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800"
                  >
                    {chip}
                  </span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  View Live Demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/enterprise"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400"
                >
                  See Compliance Features
                </Link>
              </motion.div>
            </motion.div>

            {/* Dashboard preview card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}
              className="relative"
            >
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200/40 via-teal-200/30 to-emerald-200/40 blur-2xl rounded-3xl pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-300/50 bg-white">
                {/* Browser bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">app.viktron.ai/analytics</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                  </div>
                </div>

                {/* Dashboard image */}
                <img
                  src="/images/analytics-dashboard.svg"
                  alt="Viktron Analytics Dashboard"
                  className="w-full h-auto"
                />
              </div>

              {/* Floating stat — top left */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-4 top-8 bg-white rounded-xl shadow-xl border border-slate-200 px-4 py-3 min-w-[130px]"
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Visitors</p>
                <p className="text-2xl font-bold text-slate-900 font-mono">2,847</p>
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">+23% this week</p>
              </motion.div>

              {/* Floating stat — bottom right */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-4 bottom-8 bg-white rounded-xl shadow-xl border border-slate-200 px-4 py-3 min-w-[130px]"
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Conversions</p>
                <p className="text-2xl font-bold text-slate-900 font-mono">312</p>
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">+18% this week</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics bar */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {metrics.map((m) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <m.icon className={`w-6 h-6 mx-auto mb-2 ${m.color}`} />
                <p className="text-3xl font-bold text-white">{m.value}</p>
                <p className="text-xs text-slate-400 mt-1">{m.label}</p>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{m.change}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-extrabold tracking-tight text-slate-900"
            >
              Everything you need to understand agent behavior
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-slate-500 text-lg mx-auto">
              From real-time activity feeds to executive dashboards — Analytics gives you the visibility
              to optimize, audit, and prove ROI.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:border-emerald-200 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard tabs by audience */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-extrabold tracking-tight text-slate-900"
            >
              Dashboards for every stakeholder
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-slate-500 text-lg mx-auto">
              Different teams need different views. Analytics ships with pre-built dashboards
              for technical, operational, and compliance audiences.
            </motion.p>
          </motion.div>

          {/* Tab buttons */}
          <div className="flex justify-center gap-3 mb-8">
            {useCases.map((uc, i) => (
              <button
                key={uc.title}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === i
                    ? `bg-${uc.color}-600 text-white`
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {uc.title}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">{useCases[activeTab].title} Dashboard</h3>
            <div className="space-y-3">
              {useCases[activeTab].metrics.map((m) => (
                <div key={m} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-slate-700">{m}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Export as CSV, PDF, or pipe directly to your BI tool via OTLP.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration logos */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Export to your stack</p>
          </motion.div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
            {['Datadog', 'Grafana', 'Snowflake', 'Looker', 'Tableau', 'Power BI'].map((tool) => (
              <div key={tool} className="px-6 py-3 bg-slate-100 rounded-lg text-slate-600 font-semibold">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-slate-900 text-white">
        <div className="container-custom max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <Eye className="w-12 h-12 text-emerald-400" />
            <h2 className="text-4xl font-extrabold tracking-tight">
              Stop guessing. Start measuring.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              See exactly what your agents are doing, how they're performing,
              and what value they're delivering — in real-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow transition hover:bg-emerald-400"
              >
                Request Demo Access <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services/agentirl"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-7 py-3.5 text-sm font-bold text-white transition hover:border-slate-400"
              >
                See AgentIRL Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};
