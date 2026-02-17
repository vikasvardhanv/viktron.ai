import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bot, Phone, Megaphone, Workflow, BrainCircuit, Users,
  MessageSquare, BarChart3, Shield, Sparkles, ArrowRight,
  Mic, Mail, Globe, Database, Cpu, Target, Layers
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
    link: '/services/ai-sales-agent',
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
    link: '/services/voice-ai-agent',
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
    link: '/services/workflow-automation',
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
    link: '/services/seo-content-ai',
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
    link: '/services/agent-orchestration',
    services: [
      { name: 'Agent Orchestration', slug: 'agent-orchestration', icon: BrainCircuit, desc: 'Multi-agent coordination, task delegation, and swarm intelligence.' },
      { name: 'Reliability Engineering', slug: 'reliability-engineering', icon: Shield, desc: 'Error recovery, fallbacks, guardrails, and 99.9% uptime SLA.' },
      { name: 'Enterprise Integration', slug: 'enterprise-integration', icon: Database, desc: 'Connect agents to SAP, Oracle, Salesforce, and legacy systems.' },
      { name: 'AI Audit & Consulting', slug: 'ai-audit-consulting', icon: BarChart3, desc: 'Assess AI readiness, identify automation opportunities, build roadmaps.' },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
};

export const ServicesPopup: React.FC<ServicesPopupProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          onMouseLeave={onClose}
          className="absolute top-full left-0 mt-2 w-[340px] bg-white rounded-xl shadow-xl border border-slate-200 z-[61] overflow-hidden"
        >
          <div className="py-2">
            {SERVICE_CATEGORIES.map((category, idx) => {
              const colors = colorMap[category.color];
              return (
                <Link
                  key={idx}
                  to={category.link}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                    <category.icon className={`w-4.5 h-4.5 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block">
                      {category.title}
                    </span>
                    <span className="text-xs text-slate-500 leading-tight line-clamp-1">
                      {category.description}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-100 px-4 py-3">
            <Link
              to="/services"
              onClick={onClose}
              className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { SERVICE_CATEGORIES };
