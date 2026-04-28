import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, Server, Activity, Lock, ArrowRight, Layers, 
  Terminal, Cpu, Network, CheckCircle2, ChevronRight, BarChart
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';

// --- Premium UI Components ---

const GlassCard = ({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`glass-panel glass-panel-interactive rounded-2xl p-8 ${className}`}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ text }: { text: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-6"
  >
    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
    {text}
  </motion.div>
);

// --- Architecture Visualization Component ---
const TrustFabricVisual = () => {
  return (
    <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto mt-12 lg:mt-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
      
      <div className="relative h-full w-full border border-white/10 rounded-3xl bg-[#0A0A0A]/80 backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl">
        {/* Mock Window Header */}
        <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between bg-white/[0.02]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>
          <div className="font-mono text-[10px] text-white/40 tracking-wider">VIKTRON.AI / CONTROL-PLANE</div>
          <div className="w-4 h-4 text-emerald-400"><Lock size={14} /></div>
        </div>

        {/* Console Body */}
        <div className="flex-1 p-6 flex flex-col gap-4 font-mono text-xs relative">
          {/* Background Grid inside terminal */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-3 text-white/60"
          >
            <span className="text-blue-400">❯</span> systemctl status agentirl-fabric
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="pl-5 text-emerald-400 flex items-center gap-2"
          >
            <CheckCircle2 size={12} /> ACTIVE (running)
          </motion.div>

          <div className="mt-4 space-y-3 relative z-10">
            {[
              { label: 'IDENTITY', val: 'Verified via Cryptographic Token', color: 'text-purple-400' },
              { label: 'POLICY_GATE', val: 'Strict enforcement [SOC2 Mode]', color: 'text-amber-400' },
              { label: 'PROVENANCE', val: 'SHA-256 Hash Chained Logs', color: 'text-emerald-400' },
              { label: 'OBSERVABILITY', val: 'OTLP Telemetry Streaming', color: 'text-blue-400' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 + (i * 0.2) }}
                className="flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-lg"
              >
                <div className={`w-24 shrink-0 font-bold ${item.color}`}>{item.label}</div>
                <div className="text-white/70 truncate flex-1">{item.val}</div>
                {i === 1 && <div className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] rounded uppercase">Human-in-Loop</div>}
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
            className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center text-[10px]"
          >
            <span className="text-white/40">Intercepting rogue tool call attempts...</span>
            <span className="flex items-center gap-1 text-emerald-400"><Activity size={10} className="animate-pulse"/> SECURE</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const Landing = () => {
  return (
    <Layout>
      <SEO 
        title="Viktron AI | The Enterprise Control Plane for Autonomous Agents"
        description="Viktron is the infrastructure layer making AI agents safe, observable, and instantly deployable for enterprise workloads. Secure your AI workforce with AgentIRL™."
      />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
        <div className="bg-mesh"></div>
        <div className="bg-grid"></div>
        
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-8 backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                AgentIRL™ Trust Fabric Live
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05]">
                The Enterprise <br/>
                <span className="text-gradient-primary">Control Plane</span> <br/>
                For AI Agents.
              </h1>

              <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-xl font-light">
                Agent capability is surging, but enterprise adoption has stalled due to trust. 
                Viktron provides the required <span className="text-white font-medium">management software and infrastructure</span> to make autonomous agents safe, observable, and accountable for production workloads.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="btn-premium btn-primary-glow">
                  Deploy Infrastructure <ArrowRight size={18} />
                </Link>
                <Link to="/agents" className="btn-premium bg-transparent hover:bg-white/5">
                  Browse AI Workforce
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 text-sm text-white/40 font-mono">
                <div className="flex items-center gap-2"><Shield size={16} className="text-emerald-500"/> SOC 2 Ready</div>
                <div className="flex items-center gap-2"><Network size={16} className="text-blue-500"/> Multi-Agent DAG</div>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10"
            >
              <TrustFabricVisual />
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- THE PARADIGM SHIFT SECTION --- */}
      <section className="py-32 relative border-t border-white/5 bg-[#050505]">
        <div className="container-custom">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <SectionLabel text="The Paradigm Shift" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              From Sandboxed Pilots to <br/> <span className="text-gradient">Governed Production</span>
            </h2>
            <p className="text-lg text-white/50 font-light">
              We don't hope agents behave — we cryptographically prove they did. 
              Viktron replaces isolated, untrusted chatbots with an interconnected, multi-agent system interacting directly with your databases under strict SOC 2 requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard delay={0.1}>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <Layers className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Agents (Workforce)</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Ready-to-deploy specialized AI teams (Sales, Support, Ops) connected directly to enterprise tools like Slack and Teams. 
              </p>
              <Link to="/agents" className="text-blue-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View Pre-trained Agents <ChevronRight size={14} />
              </Link>
            </GlassCard>

            <GlassCard delay={0.2} className="border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded uppercase tracking-wider">The Moat</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Shield className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AgentIRL™ Trust Fabric</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                The foundational governance layer. Cryptographic delegation tokens, real-time policy enforcement, and immutable hash-chained provenance trails. This is what makes delegation economically safe.
              </p>
            </GlassCard>

            <GlassCard delay={0.3}>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                <BarChart className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cloud + AI Analytics</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Amplitude-grade real-time observability. Sub-second dashboards, full audit trails, and OTLP export to existing BI stacks like Datadog and Snowflake. Measure true ROI.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* --- 6-LAYER EXECUTION SHIELD --- */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#0A0A0A] pointer-events-none"></div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <SectionLabel text="Security Architecture" />
              <h2 className="text-4xl font-bold text-white mb-6">The 6-Layer Execution Shield</h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Every task passes through deterministic policy gates before execution. Evaluation time is under 150ms, ensuring zero unauthorized API spend and total elimination of irreversible data deletion risks.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Identity", desc: "Agents receive task-scoped tokens." },
                  { title: "Delegation", desc: "Strict limits on permissions and allowed tools." },
                  { title: "Policy Gates", desc: "Destructive ops paused for Human-in-the-Loop." },
                  { title: "Provenance", desc: "SHA-256 hash-chained audit trails." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white text-sm font-semibold">{item.title}</h4>
                      <p className="text-white/40 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-2/3 w-full">
              <div className="glass-panel p-2 rounded-2xl border border-white/10 bg-black/50">
                {/* Visual representation of the pipeline */}
                <div className="flex flex-col md:flex-row gap-2 h-full">
                  <div className="bg-white/5 p-4 rounded-xl flex items-center justify-center border border-white/5">
                    <span className="font-mono text-xs text-white/50">Raw Task</span>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { num: "1", label: "Identity", color: "blue" },
                      { num: "2", label: "Delegation", color: "indigo" },
                      { num: "3", label: "Policy Gates", color: "amber", alert: true },
                      { num: "4", label: "Budget", color: "purple" },
                      { num: "5", label: "Credentials", color: "pink" },
                      { num: "6", label: "Provenance", color: "emerald" }
                    ].map((step, i) => (
                      <div key={i} className={`bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:bg-white/10 transition-colors`}>
                        <div className={`text-${step.color}-400 font-mono text-[10px] mb-2`}>STEP 0{step.num}</div>
                        <div className="text-white text-sm font-medium">{step.label}</div>
                        {step.alert && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-500/10 p-4 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <span className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-2">
                      <CheckCircle2 size={14}/> Verified Action
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to deploy enterprise AI?
          </h2>
          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto font-light">
            Stop running risky AI pilots. Upgrade to a governed, observable, and cryptographically secure multi-agent control plane. 
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn-premium btn-primary-glow">
              Request Enterprise Access
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
};
