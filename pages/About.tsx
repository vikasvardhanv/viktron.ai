import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import {
  Target, Users, ShieldCheck, Zap, Globe, Cpu, ArrowRight,
  Layers, BrainCircuit, Database, GitBranch, Rocket, Shield,
  TrendingUp, CheckCircle2, Bot, Workflow, Eye, Sparkles
} from 'lucide-react';

export const About = () => {
  return (
    <Layout>
      <SEO
        title="About Viktron | AI Agent Teams & AgentIRL Infrastructure"
        description="Viktron builds AI agent teams that actually work — Sales, Support, Content, and CEO agents coordinated by AgentIRL, the reliability layer for production multi-agent systems."
        keywords="about Viktron, AgentIRL, AI infrastructure, multi-agent orchestration, AI reliability, agent coordination, AI platform"
        url="/about"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/30 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono mb-6">
              <Cpu className="w-3 h-3" /> About Viktron
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              We Build AI Teams <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">That Actually Work.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Viktron is a dual product: sellable AI agent teams on top, and AgentIRL — the
              coordination infrastructure that makes multi-agent systems reliable — underneath.
              Agents are the revenue engine. AgentIRL is the foundation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">The Real Problem</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  AI frameworks like CrewAI, LangGraph, and OpenAI Agents SDK are powerful — but they're
                  <strong className="text-slate-800"> building blocks, not finished products</strong>.
                  A business can't deploy a raw LangGraph workflow and expect it to handle real customers.
                </p>
                <p>
                  The gap between "AI demo" and "AI in production" is massive: reliability, error handling,
                  multi-channel routing, shared state, human oversight, cost management, compliance.
                  Most AI experiments fail here — not because the models aren't smart enough, but because
                  the <strong className="text-slate-800">operations layer is missing</strong>.
                </p>
                <p>
                  That's exactly what we build.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-2xl transform rotate-2 scale-105 opacity-40" />
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative z-10">
                <h3 className="font-bold text-slate-900 mb-6 text-lg">The Stack We Built</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Layer 5: Your Business', desc: 'Pricing, FAQ, services, brand voice', icon: Sparkles, color: 'text-purple-600' },
                    { label: 'Layer 4: AI Agents', desc: 'Sales, Support, Content, CEO agents', icon: Bot, color: 'text-blue-600' },
                    { label: 'Layer 3: AgentIRL', desc: 'Orchestration, reliability, monitoring', icon: BrainCircuit, color: 'text-cyan-600' },
                    { label: 'Layer 2: Frameworks', desc: 'CrewAI, LangGraph, CAMEL, OpenAI SDK', icon: Layers, color: 'text-emerald-600' },
                    { label: 'Layer 1: LLMs', desc: 'GPT-4, Claude, Gemini, open-source', icon: Cpu, color: 'text-amber-600' },
                  ].map((layer, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 ${layer.color}`}>
                        <layer.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{layer.label}</div>
                        <div className="text-xs text-slate-500">{layer.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is AgentIRL */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-mono mb-6">
              <BrainCircuit className="w-3 h-3" /> The Foundation
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What is AgentIRL?</h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
              AgentIRL (Agent Integration & Reliability Layer) is the coordination infrastructure
              that sits between AI frameworks and your business — like <strong>Fastly sits between websites
              and users</strong>. It makes AI agents production-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Workflow, title: 'Multi-Agent Orchestration', desc: 'Coordinate agents built with CrewAI, LangGraph, CAMEL, and custom frameworks in one unified system.' },
              { icon: Shield, title: 'Reliability Engine', desc: 'Automatic retries, circuit breakers, fallback models, and graceful degradation. 99.9% uptime SLA.' },
              { icon: Eye, title: 'Full Observability', desc: 'Real-time dashboards showing every agent action, decision, cost, and latency across your entire AI workforce.' },
              { icon: Users, title: 'Human-in-the-Loop', desc: 'Configurable approval gates for high-stakes decisions. Agents pause and wait for human review.' },
              { icon: Database, title: 'Shared State', desc: 'All agents share context. Update pricing once — every agent knows instantly. No data silos.' },
              { icon: TrendingUp, title: 'Self-Improving (ADAS)', desc: 'Based on ICLR 2025 research: agents evolve automatically through Automated Design of Agentic Systems.' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-colors group"
              >
                <feature.icon className="w-8 h-8 text-slate-400 group-hover:text-cyan-600 mb-4 transition-colors" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Scale */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How We Scale</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Two products growing simultaneously — agents on top, infrastructure underneath.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200/0 via-blue-200 to-blue-200/0" />

            {[
              {
                phase: 'Now',
                title: 'AI Agent Teams',
                desc: 'Sell coordinated AI agent teams to businesses. Sales, Support, Content, CEO agents that work together. Revenue from $199-999/mo subscriptions.',
                icon: Bot,
                items: ['Agent team deployment', 'Multi-channel support', 'Knowledge base training', 'Dashboard & reports'],
              },
              {
                phase: 'Growing',
                title: 'AgentIRL Platform',
                desc: 'The infrastructure layer matures. Enterprises start using AgentIRL to build their own agent systems on top of our orchestration.',
                icon: Layers,
                items: ['Self-serve platform', 'Custom agent building', 'Enterprise integrations', 'ADAS optimization'],
              },
              {
                phase: 'Year 2+',
                title: 'Open Platform',
                desc: 'AgentIRL becomes an open platform. Third-party developers build and sell agents through our marketplace. We become the Shopify of AI agents.',
                icon: Globe,
                items: ['Agent marketplace', 'Developer SDK', 'Partner ecosystem', 'Global scale'],
              },
            ].map((phase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs font-mono text-blue-600 border border-blue-200 rounded-full py-0.5 z-10">
                  {phase.phase}
                </div>
                <div className="p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow h-full">
                  <phase.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{phase.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{phase.desc}</p>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Build What Sells', desc: 'Agents generate revenue from day one. Infrastructure grows underneath. We don\'t wait for product-market fit — we ship and iterate.' },
              { icon: ShieldCheck, title: 'Reliability Over Features', desc: 'A reliable agent that handles 3 tasks well beats an unreliable one that handles 30. We optimize for production quality.' },
              { icon: Users, title: 'Human + AI, Not AI Alone', desc: 'The best systems keep humans in the loop for high-stakes decisions. We build approval gates, not autonomous black boxes.' },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-xl bg-white border border-slate-200 hover:border-blue-200 transition-colors group"
              >
                <card.icon className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mb-4 transition-colors" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { icon: ShieldCheck, label: 'SOC 2 Ready' },
              { icon: Shield, label: 'End-to-End Encrypted' },
              { icon: Zap, label: '99.9% Uptime SLA' },
              { icon: Globe, label: 'Multi-Region Deploy' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                <item.icon className="w-4 h-4 text-slate-400" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Hire Your AI Team?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Start with a single AI Sales Agent for $199/mo, or deploy a full coordinated team.
            No long-term contracts. See results in the first week.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/agents" className="btn bg-white text-slate-900 hover:bg-blue-50 px-8 py-3 rounded-xl text-lg font-semibold">
              Browse AI Agents
            </Link>
            <Link to="/use-cases" className="btn border border-slate-700 text-white hover:bg-slate-800 px-8 py-3 rounded-xl text-lg">
              See Use Cases
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
