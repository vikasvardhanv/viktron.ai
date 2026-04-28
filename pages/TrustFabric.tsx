import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants, type Transition } from 'framer-motion';
import {
  Shield,
  Lock,
  CheckCircle2,
  FileText,
  Brain,
  Key,
  AlertTriangle,
  TrendingUp,
  Users,
  Eye,
  Zap,
  GitBranch,
  ArrowRight,
  Fingerprint,
  BarChart3,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ServiceSEO } from '../components/ui/SEO';

const fadeUpTransition: Transition = { duration: 0.55, ease: 'easeOut' };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: fadeUpTransition },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Trust Pillars ────────────────────────────────────────────────────────────
const pillars = [
  {
    icon: Shield,
    title: 'Agent Identity',
    desc: 'Cryptographic identity for every agent with trust scoring (0-100), role-based access, allowed tools/domains, and verification status.',
  },
  {
    icon: Lock,
    title: 'Delegation Tokens',
    desc: 'Fine-grained capability delegation. Issue time-limited tokens to agents with specific scope constraints and auditability.',
  },
  {
    icon: AlertTriangle,
    title: 'Policy Gateway',
    desc: 'Runtime governance rules with zero code changes. Define approval gates, cost limits, tool restrictions, and data policies that apply dynamically.',
  },
  {
    icon: FileText,
    title: 'Provenance Ledger',
    desc: 'Complete audit trail of every agent action: who did what, when, with what authority, and what changed in the system.',
  },
  {
    icon: Brain,
    title: 'Memory Governance',
    desc: 'Durable, policy-aware agent state. Enforce retention policies, data masking, and memory isolation per agent role.',
  },
  {
    icon: BarChart3,
    title: 'Trust Analytics',
    desc: 'Live dashboards showing agent trust scores, policy violations, approval workflows, and compliance metrics in real time.',
  },
];

// ─── Use Cases ────────────────────────────────────────────────────────────────
const useCases = [
  {
    icon: Users,
    title: 'Enterprise Teams',
    desc: 'Govern multi-team AI operations with role-based access, approval workflows, and audit trails. Meet SOC 2 and compliance requirements.',
  },
  {
    icon: DollarSign,
    title: 'Cost Control',
    desc: 'Set hard cost limits per agent, model, or team. Policies auto-pause agents when budgets are hit. No token sprawl.',
  },
  {
    icon: Lock,
    title: 'Data Protection',
    desc: 'Specify which agents can access which data sources. Enforce data masking policies. Log all sensitive data access.',
  },
  {
    icon: CheckCircle2,
    title: 'Approval Workflows',
    desc: 'Require human approval for high-risk actions. Configure approval chains, escalation paths, and decision deadlines.',
  },
  {
    icon: Eye,
    title: 'Compliance & Audit',
    desc: 'Full provenance chain for every action. Export to Snowflake, Datadog, or your compliance platform. OTLP-compatible.',
  },
  {
    icon: TrendingUp,
    title: 'Trust Scoring',
    desc: 'Automatic trust evaluation based on agent behavior. Adapt policies based on agent reputation and historical reliability.',
  },
];

// ─── How It Works ────────────────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Define Agent Roles',
    desc: 'Create cryptographic identities for each agent. Assign roles, set initial trust levels, and define allowed tools/domains.',
  },
  {
    num: '02',
    title: 'Configure Policies',
    desc: 'Write condition-based rules: "If agent is sales_bot AND cost > $100, require approval". No code changes needed.',
  },
  {
    num: '03',
    title: 'Issue Delegation Tokens',
    desc: 'Agents receive scoped tokens for specific tasks. Tokens can be revoked at any time. Full audit trail maintained.',
  },
  {
    num: '04',
    title: 'Monitor & Enforce',
    desc: 'Every agent action is evaluated against policies at runtime. Violations trigger approval workflows or auto-denial.',
  },
  {
    num: '05',
    title: 'Audit & Improve',
    desc: 'Live dashboards show trust scores, policy decisions, and compliance metrics. Adjust policies based on agent behavior.',
  },
];

// ─── Capabilities ────────────────────────────────────────────────────────────
const capabilities = [
  { label: 'Agent Cryptographic ID', icon: Fingerprint },
  { label: 'Trust Score (0-100)', icon: BarChart3 },
  { label: 'Role-Based Access', icon: Users },
  { label: 'Time-Limited Tokens', icon: Clock },
  { label: 'Cost Limits & Hard Stops', icon: DollarSign },
  { label: 'Approval Workflows', icon: CheckCircle2 },
  { label: 'Policy Conditions', icon: GitBranch },
  { label: 'Audit Logging', icon: FileText },
  { label: 'Memory Isolation', icon: Brain },
  { label: 'Data Masking', icon: Eye },
  { label: 'Real-Time Enforcement', icon: Zap },
  { label: 'Compliance Export', icon: TrendingUp },
];

export const TrustFabric: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <ServiceSEO
        serviceName="Trust Fabric - Agent Governance & Control"
        serviceDescription="Enterprise-grade governance layer for AI agents. Cryptographic identity, policy enforcement, delegation tokens, audit trails, and compliance automation."
      />

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-20">
        {/* Animated orbs */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
            animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ top: '10%', left: '-10%' }}
          />
          <motion.div
            className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ x: [0, -50, 50, 0], y: [0, -30, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{ top: '40%', right: '-5%' }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-20">
          <motion.div
            className="space-y-6 text-center"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="inline-block">
              <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-sm font-semibold text-emerald-300">Governance Layer</p>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-bold text-white">
              Trust Fabric
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl text-slate-300 max-w-3xl mx-auto">
              Enterprise governance for AI agents. Cryptographic identity, policy enforcement, delegation tokens, and
              complete audit trails—all enforced at runtime.
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-wrap pt-8">
              <Link
                to="/dashboard/agent-identity"
                className="px-8 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition flex items-center gap-2"
              >
                Go to Agent Identity <ArrowRight size={18} />
              </Link>
              <Link
                to="/dashboard/policy-gateway"
                className="px-8 py-3 rounded-lg border border-slate-600 text-slate-200 font-semibold hover:bg-slate-800 transition flex items-center gap-2"
              >
                Manage Policies
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── The Five Pillars ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-12">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">The Five Pillars of Trust Fabric</h2>
              <p className="text-lg text-slate-300">Everything you need to govern AI agents at scale</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 transition"
                >
                  <pillar.icon className="w-10 h-10 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                  <p className="text-sm text-slate-300">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Use Cases ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-12">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">Use Cases</h2>
              <p className="text-lg text-slate-300">How enterprises use Trust Fabric</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((useCase, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition"
                >
                  <useCase.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{useCase.title}</h3>
                  <p className="text-sm text-slate-300">{useCase.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-12">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">How It Works</h2>
              <p className="text-lg text-slate-300">Five steps to governance</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="relative p-6 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer transition"
                  onClick={() => setActiveStep(i)}
                  style={{
                    borderColor: activeStep === i ? '#10b981' : 'rgb(55, 65, 81)',
                    backgroundColor: activeStep === i ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                  }}
                >
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{step.num}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-300">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Capabilities Grid ────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-12">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">Complete Feature Set</h2>
              <p className="text-lg text-slate-300">Everything needed for enterprise governance</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center gap-3"
                >
                  <cap.icon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-slate-200">{cap.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-white">
              Ready to Govern Your Agents?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-300">
              Start with Agent Identity and build your governance policies step by step.
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-wrap pt-8">
              <Link
                to="/dashboard/agent-identity"
                className="px-8 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition flex items-center gap-2"
              >
                Access Agent Identity <ArrowRight size={18} />
              </Link>
              <a
                href="mailto:support@viktron.ai"
                className="px-8 py-3 rounded-lg border border-slate-600 text-slate-200 font-semibold hover:bg-slate-800 transition"
              >
                Contact Sales
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TrustFabric;
