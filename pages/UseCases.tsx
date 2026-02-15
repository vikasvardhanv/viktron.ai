import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import {
  ArrowRight, Building2, Rocket, Globe, Users, Bot, CheckCircle2,
  Workflow, Phone, MessageSquare, BarChart3, Briefcase, Store,
  Stethoscope, Utensils, GraduationCap, Scale, Truck, Home,
  Sparkles, Shield, BrainCircuit, TrendingUp, Zap, Target
} from 'lucide-react';

const FILTERS = ['All', 'Enterprise', 'Mid-Size', 'Startup', 'Small Business'];

const USE_CASES = [
  {
    title: 'Enterprise AI Operations Center',
    segment: 'Enterprise',
    industry: 'Technology',
    icon: Building2,
    color: 'blue',
    challenge: 'A Fortune 500 tech company had 15+ disconnected AI experiments across departments — chatbots, document processors, code assistants — with no central coordination, inconsistent quality, and zero visibility.',
    solution: 'Deployed AgentIRL as the unified control plane. All agents now run through one orchestration layer with shared state, centralized monitoring, guardrails, and human-in-the-loop routing.',
    results: [
      { metric: '85%', label: 'Error reduction across all AI systems' },
      { metric: '99.9%', label: 'Uptime SLA achieved' },
      { metric: '60%', label: 'Lower LLM costs via intelligent routing' },
      { metric: '10x', label: 'Faster agent deployment' },
    ],
    agents: ['CEO Agent', 'Support Agent', 'Content Agent', 'Custom Agents'],
    link: '/contact',
  },
  {
    title: 'SaaS Startup — AI-Powered Customer Success',
    segment: 'Startup',
    industry: 'SaaS',
    icon: Rocket,
    color: 'purple',
    challenge: 'A Series A SaaS startup with 3 employees was drowning in support tickets, missing leads, and couldn\'t afford to hire a sales team, support team, and content writer.',
    solution: 'Deployed a 4-agent team: Sales Agent handles inbound leads via email/chat, Support Agent resolves 80% of tickets from the knowledge base, Content Agent writes weekly blog posts and social media, CEO Agent coordinates everything and sends daily reports.',
    results: [
      { metric: '3x', label: 'Pipeline growth in 30 days' },
      { metric: '< 30s', label: 'Average lead response time' },
      { metric: '80%', label: 'Support tickets auto-resolved' },
      { metric: '$0', label: 'Additional hiring cost' },
    ],
    agents: ['Sales Agent', 'Support Agent', 'Content Agent', 'CEO Agent'],
    link: '/services/ai-sales-agent',
  },
  {
    title: 'Multi-Location Restaurant Chain',
    segment: 'Mid-Size',
    industry: 'Food & Beverage',
    icon: Utensils,
    color: 'amber',
    challenge: 'A restaurant chain with 12 locations was losing 40% of phone calls to voicemail, missing reservation requests, and had no consistent way to handle catering inquiries across locations.',
    solution: 'Deployed Voice AI Agents across all locations — answers calls 24/7, takes reservations, answers menu questions, handles catering inquiries, and sends confirmation SMS. Each location\'s agent is trained on its specific menu and hours.',
    results: [
      { metric: '0%', label: 'Missed calls (down from 40%)' },
      { metric: '35%', label: 'Increase in reservations' },
      { metric: '50%', label: 'More catering leads captured' },
      { metric: '24/7', label: 'Phone coverage without staff' },
    ],
    agents: ['Voice Agent', 'SMS Agent', 'Sales Agent'],
    link: '/services/voice-ai-agent',
  },
  {
    title: 'Healthcare Clinic Network',
    segment: 'Mid-Size',
    industry: 'Healthcare',
    icon: Stethoscope,
    color: 'emerald',
    challenge: 'A network of 8 dental clinics spent $15,000/month on reception staff to handle appointment booking, rescheduling, insurance questions, and reminder calls.',
    solution: 'Deployed WhatsApp + SMS + Voice agents that handle appointment booking, send reminders, answer insurance questions, and follow up on no-shows. All HIPAA-compliant with PII redaction.',
    results: [
      { metric: '70%', label: 'Reduction in reception costs' },
      { metric: '25%', label: 'Fewer no-shows' },
      { metric: '95%', label: 'Patient satisfaction score' },
      { metric: '< 5s', label: 'Booking confirmation time' },
    ],
    agents: ['WhatsApp Agent', 'Voice Agent', 'SMS Agent', 'Support Agent'],
    link: '/services/whatsapp-agent',
  },
  {
    title: 'E-Commerce Brand — Full AI Marketing Team',
    segment: 'Small Business',
    industry: 'E-Commerce',
    icon: Store,
    color: 'cyan',
    challenge: 'A DTC e-commerce brand doing $2M/year couldn\'t afford a marketing team. They needed consistent social media content, email campaigns, SEO content, and customer support — but their team of 2 was maxed out.',
    solution: 'Deployed a full AI marketing stack: Content Agent creates 30 social posts/month, Email Agent runs weekly campaigns, SEO Agent publishes 8 blog posts/month, and Support Agent handles order inquiries via chat and email.',
    results: [
      { metric: '150%', label: 'Growth in organic traffic' },
      { metric: '30', label: 'Social posts per month (from 4)' },
      { metric: '45%', label: 'Email open rate' },
      { metric: '$500/mo', label: 'vs $8,000/mo for human team' },
    ],
    agents: ['Content Agent', 'Support Agent', 'SEO Agent', 'Email Agent'],
    link: '/services/ai-content-agent',
  },
  {
    title: 'Law Firm — AI Legal Assistant',
    segment: 'Small Business',
    industry: 'Legal',
    icon: Scale,
    color: 'red',
    challenge: 'A 5-attorney law firm was spending 30+ hours/week on intake calls, answering basic legal questions, and qualifying potential clients — time that should have gone to billable work.',
    solution: 'Voice AI Agent handles all intake calls, qualifies leads based on case type and jurisdiction, schedules consultations, and sends follow-up emails. Support Agent answers common legal questions from the firm\'s FAQ.',
    results: [
      { metric: '30hrs', label: 'Saved per week on intake' },
      { metric: '2x', label: 'More consultations booked' },
      { metric: '90%', label: 'Lead qualification accuracy' },
      { metric: '$50K', label: 'Annual savings on staff' },
    ],
    agents: ['Voice Agent', 'Support Agent', 'Sales Agent'],
    link: '/services/voice-ai-agent',
  },
  {
    title: 'Real Estate Agency — AI Lead Nurturing',
    segment: 'Small Business',
    industry: 'Real Estate',
    icon: Home,
    color: 'violet',
    challenge: 'A real estate agency with 20 agents was losing leads because follow-up was inconsistent. Agents would forget to respond to inquiries, miss showing requests, and had no system for nurturing cold leads.',
    solution: 'AI Sales Agent responds to every inquiry within 30 seconds via email, SMS, and WhatsApp. Automatically schedules showings, sends property details, and follows up with leads every 48 hours until they convert or unsubscribe.',
    results: [
      { metric: '< 30s', label: 'Lead response time' },
      { metric: '40%', label: 'More showings booked' },
      { metric: '25%', label: 'Higher close rate' },
      { metric: '100%', label: 'Follow-up compliance' },
    ],
    agents: ['Sales Agent', 'SMS Agent', 'WhatsApp Agent'],
    link: '/services/ai-sales-agent',
  },
  {
    title: 'Construction Company — AI Operations',
    segment: 'Mid-Size',
    industry: 'Construction',
    icon: Truck,
    color: 'orange',
    challenge: 'A general contractor was juggling estimate requests, subcontractor coordination, client updates, and permit tracking across spreadsheets and phone calls. Critical requests were falling through the cracks.',
    solution: 'Deployed AI Sales Agent for estimate requests, Support Agent for client status updates, and CEO Agent to coordinate workflows. All integrated with their project management tools.',
    results: [
      { metric: '3x', label: 'Faster estimate responses' },
      { metric: '50%', label: 'Fewer missed follow-ups' },
      { metric: '20%', label: 'More projects won' },
      { metric: '10hrs', label: 'Saved weekly on admin' },
    ],
    agents: ['Sales Agent', 'Support Agent', 'CEO Agent'],
    link: '/services/ai-sales-agent',
  },
  {
    title: 'Enterprise — Building Custom AI Platform',
    segment: 'Enterprise',
    industry: 'Financial Services',
    icon: Globe,
    color: 'indigo',
    challenge: 'A mid-size financial services company wanted to build an internal AI platform for their 500 employees — document processing, compliance checking, customer communication — but didn\'t have AI engineering expertise.',
    solution: 'Used AgentIRL as the foundation to build a custom multi-agent platform. Deployed 8 specialized agents for different departments, all coordinated through the orchestration layer with full compliance logging and human approval for sensitive actions.',
    results: [
      { metric: '8', label: 'Departments automated' },
      { metric: '200+', label: 'Employees using daily' },
      { metric: '99.9%', label: 'Compliance accuracy' },
      { metric: '3mo', label: 'Time to production' },
    ],
    agents: ['AgentIRL Platform', 'Custom Agents', 'CEO Agent'],
    link: '/services/agent-orchestration',
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
};

export const UseCases = () => {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? USE_CASES : USE_CASES.filter(uc => uc.segment === filter);

  return (
    <Layout>
      <SEO
        title="AI Use Cases | Enterprise, Startup & SMB Success Stories"
        description="See how enterprises, startups, and small businesses use Viktron AI agent teams. Real use cases in healthcare, restaurants, e-commerce, real estate, law, construction, and more."
        keywords="AI use cases, AI for enterprise, AI for startups, AI for small business, AI agents healthcare, AI restaurant, AI e-commerce, AI real estate, AI construction, AI law firm"
        url="/use-cases"
      />
      {/* Hero */}
      <section className="pt-32 pb-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono text-blue-600 mb-6">
              <Target className="w-3 h-3" /> Real Results
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              How Businesses Use <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Viktron AI Teams</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              From solo founders hiring their first AI employee to enterprises deploying
              multi-agent orchestration — see how businesses at every scale use Viktron to grow faster.
            </p>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Businesses Served', icon: Building2 },
              { value: '2M+', label: 'Conversations Handled', icon: MessageSquare },
              { value: '99.9%', label: 'Platform Uptime', icon: Shield },
              { value: '< 30s', label: 'Avg Response Time', icon: Zap },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="space-y-12">
            {filtered.map((useCase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-8 md:p-10">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${colorMap[useCase.color]?.split(' ').slice(0, 1).join(' ') || 'bg-blue-50'} flex items-center justify-center`}>
                        <useCase.icon className={`w-6 h-6 ${colorMap[useCase.color]?.split(' ').slice(1, 2).join(' ') || 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{useCase.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{useCase.segment}</span>
                          <span className="text-xs text-slate-500">{useCase.industry}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={useCase.link}
                      className="btn btn-primary rounded-lg px-5 py-2.5 text-sm flex items-center gap-2 whitespace-nowrap self-start"
                    >
                      Deploy This <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Challenge & Solution */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-2">The Challenge</h4>
                        <p className="text-slate-700 leading-relaxed">{useCase.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-2">The Solution</h4>
                        <p className="text-slate-700 leading-relaxed">{useCase.solution}</p>
                      </div>
                      {/* Agents Used */}
                      <div>
                        <h4 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-2">Agents Deployed</h4>
                        <div className="flex flex-wrap gap-2">
                          {useCase.agents.map((agent, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                              <Bot className="w-3 h-3" /> {agent}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <h4 className="text-sm font-mono text-slate-500 uppercase tracking-wider mb-4">Results</h4>
                      <div className="space-y-4">
                        {useCase.results.map((result, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="text-2xl font-bold text-blue-600 min-w-[60px]">{result.metric}</div>
                            <div className="text-sm text-slate-600 pt-1">{result.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Your Own Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Build Your AI Team in Minutes</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Whether you're a solo founder or a 10,000-person enterprise, Viktron scales with you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'For Startups',
                desc: 'Hire your first AI employees for less than the cost of a single intern. Sales, support, and content — automated from day one.',
                icon: Rocket,
                features: ['AI Sales Agent', 'AI Support Agent', 'Content Agent', 'CEO Agent coordination'],
                cta: 'Start at $199/mo',
                link: '/contact',
              },
              {
                title: 'For Mid-Size Companies',
                desc: 'Scale operations without scaling headcount. Deploy AI across departments with human-in-the-loop for quality control.',
                icon: Building2,
                features: ['Multi-agent teams', 'Voice + Chat agents', 'Workflow automation', 'CRM integration'],
                cta: 'Start at $499/mo',
                link: '/contact',
                featured: true,
              },
              {
                title: 'For Enterprise',
                desc: 'Full AgentIRL platform deployment. Multi-agent orchestration, reliability engineering, and custom agent development.',
                icon: Globe,
                features: ['AgentIRL Platform', 'Custom agent development', 'Enterprise integration', 'Dedicated engineering pod'],
                cta: 'Contact Sales',
                link: '/contact',
              },
            ].map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-2xl border transition-all ${
                  tier.featured
                    ? 'border-blue-200 bg-blue-50/50 shadow-lg relative overflow-hidden'
                    : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-md'
                }`}
              >
                {tier.featured && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    Most Popular
                  </div>
                )}
                <tier.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{tier.title}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{tier.desc}</p>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.link}
                  className={`block text-center py-3 rounded-xl font-medium text-sm transition-colors ${
                    tier.featured
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't see your use case?</h2>
          <p className="text-slate-300 text-lg mb-8">
            We've deployed AI teams for 50+ industries. Let's design your custom solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn bg-white text-slate-900 hover:bg-blue-50 px-8 py-3 rounded-xl text-lg font-semibold">
              Book a Free Consultation
            </Link>
            <Link to="/demos" className="btn border border-slate-700 text-white hover:bg-slate-800 px-8 py-3 rounded-xl text-lg">
              Try a Live Demo
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
