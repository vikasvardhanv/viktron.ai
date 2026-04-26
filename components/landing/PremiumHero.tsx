/**
 * Premium Hero Component
 * Shows Viktron's core moat and value proposition
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Brain, Cpu, Lock, BarChart3 } from 'lucide-react';

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  }),
};

const featureVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export const PremiumHero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden pt-20 lg:pt-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        
        {/* Grid background */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(0deg,transparent_24%,rgba(16,185,129,.05)_25%,rgba(16,185,129,.05)_26%,transparent_27%,transparent_74%,rgba(16,185,129,.05)_75%,rgba(16,185,129,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(16,185,129,.05)_25%,rgba(16,185,129,.05)_26%,transparent_27%,transparent_74%,rgba(16,185,129,.05)_75%,rgba(16,185,129,.05)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">AI Infrastructure for Everyone</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <div className="text-center mb-8 lg:mb-12">
          <motion.h1
            custom={0}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Deploy Multi-Agent Teams in
            <motion.span
              custom={1}
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 block mt-2"
            >
              Minutes, Not Months
            </motion.span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Viktron powers businesses with enterprise-grade AI agents that automate complex workflows, 
            scale to thousands of concurrent operations, and maintain governance at every step.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16 lg:mb-20"
        >
          <button className="btn btn-primary btn-lg group">
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="btn btn-secondary btn-lg">
            View Demo
          </button>
        </motion.div>

        {/* Core Moat Section */}
        <motion.div
          custom={4}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="mb-16 lg:mb-24"
        >
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Moat 1: Speed */}
            <motion.div
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              className="group card bg-slate-800/20 border-slate-700/50 p-8 hover:border-emerald-500/30"
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                  <Zap className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning-Fast Deployment</h3>
              <p className="text-slate-400 mb-4">
                Go from zero to production in minutes. No complex API integrations, no vendor lock-in. 
                Select, configure, and deploy—that's it.
              </p>
              <div className="text-sm text-emerald-400 font-medium">→ Deploy in 60 seconds</div>
            </motion.div>

            {/* Moat 2: Governance */}
            <motion.div
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="group card bg-slate-800/20 border-slate-700/50 p-8 hover:border-emerald-500/30"
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                  <Shield className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Built-In Governance</h3>
              <p className="text-slate-400 mb-4">
                Approval gates, budget limits, activity logs, and compliance controls are baked in. 
                Enterprise security without the enterprise headache.
              </p>
              <div className="text-sm text-emerald-400 font-medium">→ SOC 2 Ready</div>
            </motion.div>

            {/* Moat 3: Scale */}
            <motion.div
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="group card bg-slate-800/20 border-slate-700/50 p-8 hover:border-emerald-500/30"
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                  <Cpu className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Infinite Scale</h3>
              <p className="text-slate-400 mb-4">
                Handle 10,000+ concurrent agents with unified orchestration. Watch your infrastructure 
                shrink while throughput explodes.
              </p>
              <div className="text-sm text-emerald-400 font-medium">→ 10x Cost Reduction</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Why Viktron Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-20 lg:mb-32"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            The Competitive Advantage
          </h2>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left column: Value props */}
            <div className="space-y-8">
              {[
                {
                  icon: Brain,
                  title: 'Multi-Model Support',
                  desc: 'Claude, GPT-4, Llama, Mistral, local models—use whatever fits your use case.',
                },
                {
                  icon: Lock,
                  title: 'Private by Default',
                  desc: 'Self-hosted or VPC-deployed. Your data never touches untrusted infrastructure.',
                },
                {
                  icon: BarChart3,
                  title: 'Complete Observability',
                  desc: 'Real-time dashboards, audit trails, cost tracking, and performance metrics.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <item.icon className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right column: Stats or visual */}
            <div className="card bg-slate-800/30 border-slate-700/50 p-8 md:p-12 flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">10,000+</div>
                  <p className="text-slate-400">Concurrent agents per instance</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">$0.01</div>
                  <p className="text-slate-400">Cost per agent spawn (on average)</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">&lt;60s</div>
                  <p className="text-slate-400">From signup to first agent live</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social proof / Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="border-t border-slate-700/50 pt-12 text-center"
        >
          <p className="text-slate-400 text-sm mb-6">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 hover:opacity-75 transition-opacity">
            {['Company 1', 'Company 2', 'Company 3', 'Company 4'].map((company, i) => (
              <div key={i} className="font-medium text-slate-500">{company}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumHero;
