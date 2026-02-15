import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  X, Bot, Phone, Megaphone, Workflow, BrainCircuit, Users,
  MessageSquare, BarChart3, Shield, Sparkles, ArrowRight,
  Mic, Mail, Globe, Database, Cpu, Target, Layers, Zap
} from 'lucide-react';

interface ServicesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_CATEGORIES = [
  {
    title: 'AI Agent Teams',
    description: 'Hire a coordinated AI workforce that runs your business operations 24/7.',
    icon: Users,
    color: 'blue',
    services: [
      { name: 'AI Sales Agent', slug: 'ai-sales-agent', icon: Target, desc: 'Qualify leads, respond instantly, close deals while you sleep.' },
      { name: 'AI Support Agent', slug: 'ai-support-agent', icon: MessageSquare, desc: 'Answer customer questions from your knowledge base, escalate when needed.' },
      { name: 'AI CEO Agent', slug: 'ai-ceo-agent', icon: BrainCircuit, desc: 'Orchestrates your entire AI team, delegates tasks, generates reports.' },
      { name: 'AI Content Agent', slug: 'ai-content-agent', icon: Sparkles, desc: 'Creates social posts, email campaigns, and marketing copy on brand.' },
    ],
  },
  {
    title: 'Voice & Chat Agents',
    description: 'AI-powered voice and conversational agents for every channel.',
    icon: Mic,
    color: 'purple',
    services: [
      { name: 'Voice AI Agent', slug: 'voice-ai-agent', icon: Phone, desc: 'Human-like phone agents that handle calls, book appointments, qualify leads.' },
      { name: 'WhatsApp Agent', slug: 'whatsapp-agent', icon: MessageSquare, desc: 'Automated WhatsApp conversations for sales, support, and notifications.' },
      { name: 'Website Chatbot', slug: 'website-chatbot', icon: Bot, desc: 'Intelligent chatbot trained on your business data, embedded on your site.' },
      { name: 'SMS Agent', slug: 'sms-agent', icon: Mail, desc: 'Automated SMS conversations for appointment reminders and follow-ups.' },
    ],
  },
  {
    title: 'SaaS & Automation',
    description: 'End-to-end business automation and AI-powered SaaS solutions.',
    icon: Workflow,
    color: 'emerald',
    services: [
      { name: 'Workflow Automation', slug: 'workflow-automation', icon: Workflow, desc: 'Automate complex business processes with AI decision-making.' },
      { name: 'Data Analytics AI', slug: 'data-analytics-ai', icon: BarChart3, desc: 'AI-powered dashboards, reporting, and business intelligence.' },
      { name: 'CRM Integration', slug: 'crm-integration', icon: Database, desc: 'Connect AI agents to Salesforce, HubSpot, and your existing tools.' },
      { name: 'Custom AI SaaS', slug: 'custom-ai-saas', icon: Layers, desc: 'We build white-label AI products you can sell to your customers.' },
    ],
  },
  {
    title: 'Digital Marketing AI',
    description: 'AI-powered marketing that generates leads and scales your brand.',
    icon: Megaphone,
    color: 'amber',
    services: [
      { name: 'SEO & Content AI', slug: 'seo-content-ai', icon: Globe, desc: 'AI-generated SEO content, blog posts, and keyword optimization.' },
      { name: 'Social Media AI', slug: 'social-media-ai', icon: Sparkles, desc: 'Automated social media posting, engagement, and analytics.' },
      { name: 'Email Campaigns', slug: 'email-campaigns', icon: Mail, desc: 'AI-crafted email sequences that nurture leads and drive conversions.' },
      { name: 'Lead Generation', slug: 'lead-generation', icon: Target, desc: 'Multi-channel lead generation with AI qualification and scoring.' },
    ],
  },
  {
    title: 'AgentIRL Platform',
    description: 'The infrastructure layer that makes AI agents production-ready.',
    icon: Cpu,
    color: 'cyan',
    services: [
      { name: 'Agent Orchestration', slug: 'agent-orchestration', icon: BrainCircuit, desc: 'Multi-agent coordination, task delegation, and swarm intelligence.' },
      { name: 'Reliability Engineering', slug: 'reliability-engineering', icon: Shield, desc: 'Error recovery, fallbacks, guardrails, and 99.9% uptime SLA.' },
      { name: 'Enterprise Integration', slug: 'enterprise-integration', icon: Database, desc: 'Connect agents to SAP, Oracle, Salesforce, and legacy systems.' },
      { name: 'AI Audit & Consulting', slug: 'ai-audit-consulting', icon: BarChart3, desc: 'Assess AI readiness, identify automation opportunities, build roadmaps.' },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hoverBg: 'hover:bg-blue-50/50' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hoverBg: 'hover:bg-purple-50/50' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hoverBg: 'hover:bg-emerald-50/50' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', hoverBg: 'hover:bg-amber-50/50' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', hoverBg: 'hover:bg-cyan-50/50' },
};

export const ServicesPopup: React.FC<ServicesPopupProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed inset-4 md:inset-8 lg:inset-12 xl:inset-x-24 xl:inset-y-12 bg-white rounded-2xl shadow-2xl z-[61] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Our Services</h2>
                <p className="text-sm text-slate-500 mt-1">AI solutions that grow your business on autopilot</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {SERVICE_CATEGORIES.map((category, catIdx) => {
                  const colors = colorMap[category.color];
                  return (
                    <motion.div
                      key={catIdx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIdx * 0.08 }}
                      className="group"
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <category.icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{category.title}</h3>
                          <p className="text-xs text-slate-500">{category.description}</p>
                        </div>
                      </div>

                      {/* Service Items */}
                      <div className="space-y-2">
                        {category.services.map((service, svcIdx) => (
                          <Link
                            key={svcIdx}
                            to={`/services/${service.slug}`}
                            onClick={onClose}
                            className={`flex items-start gap-3 p-3 rounded-xl border border-transparent ${colors.hoverBg} hover:border-slate-200 transition-all duration-200 group/item`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:shadow-sm transition-shadow">
                              <service.icon className="w-4 h-4 text-slate-500 group-hover/item:text-slate-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-800 group-hover/item:text-blue-600 transition-colors">
                                  {service.name}
                                </span>
                                <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{service.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Not sure which service fits?</h3>
                  <p className="text-sm text-slate-600 mt-1">Book a free 15-minute consultation. We'll map your needs to the right solution.</p>
                </div>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="btn btn-primary px-6 py-3 rounded-xl whitespace-nowrap flex items-center gap-2"
                >
                  Talk to Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { SERVICE_CATEGORIES };
