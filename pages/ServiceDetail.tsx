import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { ServiceSEO } from '../components/ui/SEO';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Zap, Clock, Shield,
  Bot, Phone, Megaphone, Workflow, BrainCircuit, Users,
  MessageSquare, BarChart3, Sparkles, Mic, Mail, Globe,
  Database, Cpu, Target, Layers, Star, TrendingUp
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Target, MessageSquare, BrainCircuit, Sparkles, Phone, Bot, Mail,
  Workflow, BarChart3, Database, Layers, Globe, Shield, Cpu, Mic, Users
};

interface ServiceData {
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  features: { title: string; desc: string }[];
  howItWorks: { step: string; title: string; desc: string }[];
  metrics: { value: string; label: string }[];
  useCases: string[];
  pricing: { label: string; note: string };
  category: string;
  icon: string;
}

const SERVICES_DATA: Record<string, ServiceData> = {
  'ai-sales-agent': {
    name: 'AI Sales Agent',
    tagline: 'Never miss a lead again. Your AI sales rep works 24/7.',
    description: 'Our AI Sales Agent qualifies incoming leads across email, SMS, and WhatsApp — responds in under 30 seconds, answers questions using your pricing and services, and books appointments automatically. It follows up with cold leads after 48 hours and generates weekly pipeline reports.',
    heroImage: '/visuals/sales-pipeline.jpg',
    features: [
      { title: 'Instant Lead Response', desc: 'Responds to new inquiries in under 30 seconds across all channels.' },
      { title: 'Knowledge-Powered', desc: 'Uses your actual pricing, services, and FAQ to craft accurate responses.' },
      { title: 'Auto Follow-Up', desc: 'Automatically follows up with leads who haven\'t responded in 48 hours.' },
      { title: 'Appointment Booking', desc: 'Books meetings directly into your calendar without human intervention.' },
      { title: 'Lead Scoring', desc: 'Classifies leads as hot, warm, or cold based on conversation signals.' },
      { title: 'Multi-Channel', desc: 'Works across email, SMS, WhatsApp, and your website chat simultaneously.' },
    ],
    howItWorks: [
      { step: '01', title: 'Connect Your Channels', desc: 'Link your email, phone number, and WhatsApp business account.' },
      { step: '02', title: 'Train on Your Business', desc: 'Upload your pricing, services, FAQ, and sales playbook.' },
      { step: '03', title: 'Agent Goes Live', desc: 'Your AI Sales Agent starts responding to leads in real-time.' },
      { step: '04', title: 'Review & Optimize', desc: 'Monitor conversations, approve high-value deals, refine over time.' },
    ],
    metrics: [
      { value: '<30s', label: 'Response Time' },
      { value: '3x', label: 'More Qualified Leads' },
      { value: '24/7', label: 'Always Available' },
      { value: '85%', label: 'Lead Qualification Rate' },
    ],
    useCases: ['Plumbing & HVAC companies', 'Real estate agencies', 'SaaS companies', 'Dental & medical clinics', 'Auto dealerships', 'Law firms'],
    pricing: { label: 'Starting at $199/mo', note: 'Includes up to 500 conversations/month' },
    category: 'AI Agent Teams',
    icon: 'Target',
  },
  'ai-support-agent': {
    name: 'AI Support Agent',
    tagline: 'Resolve 80% of customer queries instantly with AI.',
    description: 'The AI Support Agent searches your knowledge base to answer customer questions accurately. When confidence is low, it escalates to a human with a suggested response — so your team spends time on complex issues, not repetitive ones.',
    heroImage: '/visuals/tech-support.jpg',
    features: [
      { title: 'Knowledge Base Search', desc: 'Searches your FAQ, docs, and business data to find accurate answers.' },
      { title: 'Confidence Scoring', desc: 'Auto-responds when confident, escalates to humans when uncertain.' },
      { title: 'Multi-Channel Support', desc: 'Handles support via email, SMS, WhatsApp, and web chat.' },
      { title: 'Conversation Memory', desc: 'Remembers past interactions for personalized follow-ups.' },
      { title: 'Ticket Creation', desc: 'Automatically creates tickets for unresolved issues.' },
      { title: 'Analytics Dashboard', desc: 'Track resolution rates, response times, and satisfaction scores.' },
    ],
    howItWorks: [
      { step: '01', title: 'Upload Your Knowledge', desc: 'Add your FAQ, product docs, policies, and common answers.' },
      { step: '02', title: 'Set Escalation Rules', desc: 'Define when the agent should auto-respond vs. escalate.' },
      { step: '03', title: 'Deploy Across Channels', desc: 'Connect to your support email, phone, and chat widget.' },
      { step: '04', title: 'Monitor & Improve', desc: 'Review escalated conversations and expand the knowledge base.' },
    ],
    metrics: [
      { value: '80%', label: 'Auto-Resolution Rate' },
      { value: '90%', label: 'Faster Response' },
      { value: '$0.03', label: 'Per Conversation' },
      { value: '4.8/5', label: 'Customer Satisfaction' },
    ],
    useCases: ['E-commerce stores', 'SaaS platforms', 'Healthcare providers', 'Financial services', 'Telecom companies', 'Education platforms'],
    pricing: { label: 'Starting at $149/mo', note: 'Includes unlimited knowledge base entries' },
    category: 'AI Agent Teams',
    icon: 'MessageSquare',
  },
  'ai-ceo-agent': {
    name: 'AI CEO Agent',
    tagline: 'Your AI chief of staff that coordinates your entire digital workforce.',
    description: 'The CEO Agent is the brain of your AI team. Send it instructions in plain English — it breaks them into tasks, assigns them to specialist agents (Sales, Support, Content), tracks progress, and delivers daily summaries. It\'s like hiring a chief of staff that never sleeps.',
    heroImage: '/visuals/compliance-audit.jpg',
    features: [
      { title: 'Task Delegation', desc: 'Breaks your instructions into tasks and assigns to the right agents.' },
      { title: 'Daily Reports', desc: 'Generates end-of-day summaries of what your AI team accomplished.' },
      { title: 'Multi-Agent Coordination', desc: 'Manages handoffs between Sales, Support, Content, and more.' },
      { title: 'Priority Management', desc: 'Understands urgency and routes tasks accordingly.' },
      { title: 'Human-in-the-Loop', desc: 'Asks for approval on high-stakes decisions before executing.' },
      { title: 'Natural Language Control', desc: 'Just type what you want done — the CEO agent handles the rest.' },
    ],
    howItWorks: [
      { step: '01', title: 'Set Up Your Team', desc: 'Choose which AI agents you want (Sales, Support, Content, etc.).' },
      { step: '02', title: 'Give Instructions', desc: 'Type what you want done: "Create 5 Instagram posts about our new menu."' },
      { step: '03', title: 'CEO Delegates', desc: 'The CEO agent breaks it down and assigns tasks to specialists.' },
      { step: '04', title: 'Review Results', desc: 'Get daily summaries and approve or refine the output.' },
    ],
    metrics: [
      { value: '10x', label: 'Productivity Gain' },
      { value: '5+', label: 'Agents Coordinated' },
      { value: '< 1min', label: 'Task Delegation' },
      { value: '100%', label: 'Visibility' },
    ],
    useCases: ['Solo founders', 'Small business owners', 'Marketing teams', 'Operations managers', 'Agency owners', 'E-commerce brands'],
    pricing: { label: 'Starting at $299/mo', note: 'Includes CEO + 3 specialist agents' },
    category: 'AI Agent Teams',
    icon: 'BrainCircuit',
  },
  'voice-ai-agent': {
    name: 'Voice AI Agent',
    tagline: 'AI phone agents that sound human and close deals.',
    description: 'Deploy voice AI agents that answer phone calls, qualify leads, book appointments, and handle customer inquiries — all with natural-sounding conversation. Integrated with your CRM and calendar for seamless operations.',
    heroImage: '/visuals/tech-support.jpg',
    features: [
      { title: 'Natural Voice', desc: 'Human-like voice synthesis with natural pauses, tone, and intonation.' },
      { title: 'Inbound & Outbound', desc: 'Handle incoming calls and make outbound follow-up calls.' },
      { title: 'Calendar Integration', desc: 'Book appointments directly into Google Calendar or Calendly.' },
      { title: 'Call Recording', desc: 'Record and transcribe every call for quality assurance.' },
      { title: 'CRM Sync', desc: 'Log call outcomes and lead data directly into your CRM.' },
      { title: 'Transfer to Human', desc: 'Seamless warm transfer to a human agent when needed.' },
    ],
    howItWorks: [
      { step: '01', title: 'Get a Phone Number', desc: 'We provision a dedicated business phone number for your agent.' },
      { step: '02', title: 'Train the Voice', desc: 'Configure the agent\'s personality, knowledge, and call scripts.' },
      { step: '03', title: 'Go Live', desc: 'Forward your existing number or use the new one — calls get answered instantly.' },
      { step: '04', title: 'Analyze & Optimize', desc: 'Review call transcripts, conversion rates, and customer feedback.' },
    ],
    metrics: [
      { value: '0 rings', label: 'Answer Time' },
      { value: '95%', label: 'Call Completion' },
      { value: '40%', label: 'Booking Rate' },
      { value: '24/7', label: 'Availability' },
    ],
    useCases: ['Medical offices', 'Restaurants', 'Auto dealerships', 'Insurance agencies', 'Property management', 'Home services'],
    pricing: { label: 'Starting at $249/mo', note: 'Includes 200 minutes/month' },
    category: 'Voice & Chat Agents',
    icon: 'Phone',
  },
  'whatsapp-agent': {
    name: 'WhatsApp Business Agent',
    tagline: 'Automate WhatsApp conversations at scale.',
    description: 'Connect your WhatsApp Business account to an AI agent that handles customer conversations 24/7. From product inquiries to order tracking, appointment booking to after-sales support — all on the channel your customers already use.',
    heroImage: '/visuals/sales-pipeline.jpg',
    features: [
      { title: 'Instant Replies', desc: 'Respond to WhatsApp messages in seconds, day or night.' },
      { title: 'Rich Media', desc: 'Send images, documents, location pins, and product catalogs.' },
      { title: 'Order Updates', desc: 'Automated order confirmations, shipping updates, and delivery alerts.' },
      { title: 'Appointment Booking', desc: 'Let customers book appointments via WhatsApp conversation.' },
      { title: 'Broadcast Campaigns', desc: 'Send targeted promotional messages to customer segments.' },
      { title: 'Multi-Language', desc: 'Converse in the customer\'s preferred language automatically.' },
    ],
    howItWorks: [
      { step: '01', title: 'Connect WhatsApp', desc: 'Link your WhatsApp Business API account.' },
      { step: '02', title: 'Configure Flows', desc: 'Set up conversation flows for sales, support, and booking.' },
      { step: '03', title: 'Train on Data', desc: 'Upload product catalog, FAQ, and business information.' },
      { step: '04', title: 'Launch & Scale', desc: 'Start handling unlimited WhatsApp conversations automatically.' },
    ],
    metrics: [
      { value: '98%', label: 'Open Rate' },
      { value: '<10s', label: 'Response Time' },
      { value: '5x', label: 'Engagement vs Email' },
      { value: '60%', label: 'Conversion Rate' },
    ],
    useCases: ['Retail & e-commerce', 'Restaurants & food delivery', 'Travel & hospitality', 'Healthcare clinics', 'Real estate agents', 'Education institutes'],
    pricing: { label: 'Starting at $149/mo', note: 'Includes 1,000 conversations/month' },
    category: 'Voice & Chat Agents',
    icon: 'MessageSquare',
  },
  'workflow-automation': {
    name: 'Workflow Automation',
    tagline: 'Automate complex business processes with AI decision-making.',
    description: 'Go beyond simple if/then rules. Our AI-powered workflow automation understands context, makes intelligent decisions, and handles exceptions — turning your most complex business processes into automated workflows that run reliably.',
    heroImage: '/visuals/compliance-audit.jpg',
    features: [
      { title: 'AI Decision Nodes', desc: 'Workflows that reason about edge cases instead of breaking.' },
      { title: 'Process Mining', desc: 'We analyze your existing processes and identify automation opportunities.' },
      { title: 'ERP Integration', desc: 'Connect to SAP, Oracle, Salesforce, and 100+ enterprise tools.' },
      { title: 'Approval Workflows', desc: 'Human-in-the-loop for sensitive decisions with full audit trail.' },
      { title: 'Error Recovery', desc: 'Automatic retry, fallback, and notification on failures.' },
      { title: 'Analytics', desc: 'Track process efficiency, bottlenecks, and cost savings.' },
    ],
    howItWorks: [
      { step: '01', title: 'Process Audit', desc: 'We map your current workflows and identify automation potential.' },
      { step: '02', title: 'Design & Build', desc: 'Design AI-powered workflows with intelligent decision points.' },
      { step: '03', title: 'Test & Deploy', desc: 'Run workflows in parallel with manual processes to validate.' },
      { step: '04', title: 'Monitor & Optimize', desc: 'Continuous monitoring with automatic optimization suggestions.' },
    ],
    metrics: [
      { value: '70%', label: 'Time Saved' },
      { value: '99.9%', label: 'Reliability' },
      { value: '10x', label: 'Faster Processing' },
      { value: '50%', label: 'Cost Reduction' },
    ],
    useCases: ['Invoice processing', 'Employee onboarding', 'Order fulfillment', 'Compliance reporting', 'Customer onboarding', 'Data migration'],
    pricing: { label: 'Custom pricing', note: 'Based on workflow complexity and volume' },
    category: 'SaaS & Automation',
    icon: 'Workflow',
  },
  'agent-orchestration': {
    name: 'Agent Orchestration (AgentIRL)',
    tagline: 'The coordination layer that makes multi-agent systems reliable.',
    description: 'AgentIRL is our proprietary infrastructure layer that sits between AI frameworks and your business. It handles agent coordination, shared state management, error recovery, and human-in-the-loop routing — turning experimental AI into production-grade workforce.',
    heroImage: '/visuals/compliance-audit.jpg',
    features: [
      { title: 'Multi-Agent Coordination', desc: 'Orchestrate CrewAI, LangGraph, and custom agents in one system.' },
      { title: 'Shared State', desc: 'All agents share context — pricing changes propagate instantly.' },
      { title: 'Error Recovery', desc: 'Automatic retries, circuit breakers, and fallback strategies.' },
      { title: 'Observability', desc: 'Real-time dashboards showing every agent action and decision.' },
      { title: 'Human-in-the-Loop', desc: 'Configurable approval gates for high-stakes agent actions.' },
      { title: 'Cost Optimization', desc: 'Route tasks to the cheapest model that can handle them.' },
    ],
    howItWorks: [
      { step: '01', title: 'Define Your Agents', desc: 'Specify agent roles, capabilities, and guardrails.' },
      { step: '02', title: 'Set Coordination Rules', desc: 'Define how agents communicate, delegate, and escalate.' },
      { step: '03', title: 'Deploy to Production', desc: 'AgentIRL handles reliability, monitoring, and scaling.' },
      { step: '04', title: 'Evolve Over Time', desc: 'Agents improve through ADAS (Automated Design of Agentic Systems).' },
    ],
    metrics: [
      { value: '99.9%', label: 'Uptime SLA' },
      { value: '5+', label: 'Frameworks Supported' },
      { value: '< 500ms', label: 'Coordination Latency' },
      { value: '85%', label: 'Error Auto-Recovery' },
    ],
    useCases: ['Enterprise AI teams', 'Multi-agent customer service', 'Automated business operations', 'AI-powered agencies', 'SaaS platforms with AI features', 'Research institutions'],
    pricing: { label: 'Starting at $499/mo', note: 'Platform access + unlimited agent orchestration' },
    category: 'AgentIRL Platform',
    icon: 'BrainCircuit',
  },
  'reliability-engineering': {
    name: 'Agent Reliability Engineering',
    tagline: 'Move from experimental chatbots to deterministic AI workforce.',
    description: 'We implement testing frameworks, guardrails, hallucination detection, and monitoring that transform unreliable AI experiments into production-grade systems your business can depend on.',
    heroImage: '/visuals/compliance-audit.jpg',
    features: [
      { title: 'Hallucination Detection', desc: 'Automated detection and prevention of factual errors.' },
      { title: 'Regression Testing', desc: 'Test suites that catch agent behavior changes before they ship.' },
      { title: 'Latency Optimization', desc: 'Reduce response times with intelligent caching and routing.' },
      { title: 'Guardrails', desc: 'PII redaction, content filtering, and output validation.' },
      { title: 'Fallback Chains', desc: 'Automatic model failover when primary providers go down.' },
      { title: 'Monitoring & Alerts', desc: 'Real-time alerts on anomalies, errors, and quality degradation.' },
    ],
    howItWorks: [
      { step: '01', title: 'Audit Current Agents', desc: 'We analyze your existing AI systems for reliability gaps.' },
      { step: '02', title: 'Implement Guardrails', desc: 'Deploy testing, monitoring, and safety layers.' },
      { step: '03', title: 'Stress Testing', desc: 'Run adversarial tests to find edge cases before users do.' },
      { step: '04', title: 'Ongoing Monitoring', desc: 'Continuous reliability monitoring with automated remediation.' },
    ],
    metrics: [
      { value: '85%', label: 'Error Reduction' },
      { value: '99.9%', label: 'Uptime' },
      { value: '3x', label: 'Faster Debugging' },
      { value: '0', label: 'PII Leaks' },
    ],
    useCases: ['Banks & financial services', 'Healthcare systems', 'Government agencies', 'E-commerce platforms', 'Customer-facing chatbots', 'Internal AI tools'],
    pricing: { label: 'Starting at $2,500/mo', note: 'Enterprise reliability monitoring + engineering support' },
    category: 'AgentIRL Platform',
    icon: 'Shield',
  },
  // Fallback for other services with generic content
  'ai-content-agent': {
    name: 'AI Content Agent',
    tagline: 'AI that creates on-brand marketing content at scale.',
    description: 'The Content Agent creates social media posts, email campaigns, blog drafts, and marketing copy — all trained on your brand voice, style guide, and business data. It works with the CEO Agent to execute content strategies automatically.',
    heroImage: '/visuals/sales-pipeline.jpg',
    features: [
      { title: 'Brand Voice Training', desc: 'Learns your tone, style, and brand guidelines.' },
      { title: 'Multi-Format', desc: 'Creates social posts, emails, blogs, and ad copy.' },
      { title: 'Image Suggestions', desc: 'Recommends visuals and provides image prompts.' },
      { title: 'A/B Variants', desc: 'Generates multiple versions for testing.' },
      { title: 'Scheduling', desc: 'Suggests optimal posting times per platform.' },
      { title: 'Analytics Integration', desc: 'Learns from what performs well and improves over time.' },
    ],
    howItWorks: [
      { step: '01', title: 'Brand Onboarding', desc: 'Upload your brand guidelines, past content, and style preferences.' },
      { step: '02', title: 'Content Brief', desc: 'Tell the agent what you need — or let the CEO agent assign briefs.' },
      { step: '03', title: 'Generate & Review', desc: 'Agent creates content drafts for your approval.' },
      { step: '04', title: 'Publish & Learn', desc: 'Content goes live and the agent learns from engagement data.' },
    ],
    metrics: [
      { value: '10x', label: 'Content Output' },
      { value: '< 2min', label: 'Per Piece' },
      { value: '80%', label: 'First-Draft Approval' },
      { value: '3x', label: 'Engagement Lift' },
    ],
    useCases: ['Marketing agencies', 'E-commerce brands', 'SaaS companies', 'Local businesses', 'Media companies', 'Personal brands'],
    pricing: { label: 'Starting at $199/mo', note: 'Unlimited content generation' },
    category: 'AI Agent Teams',
    icon: 'Sparkles',
  },
  'seo-content-ai': {
    name: 'SEO & Content AI',
    tagline: 'Rank higher with AI-powered content and SEO optimization.',
    description: 'Our SEO AI analyzes your industry, identifies keyword opportunities, generates optimized content, and tracks rankings — all automatically. From blog posts to landing pages, every piece is engineered to rank.',
    heroImage: '/visuals/sales-pipeline.jpg',
    features: [
      { title: 'Keyword Research', desc: 'AI identifies high-value, low-competition keywords in your niche.' },
      { title: 'Content Generation', desc: 'Produces SEO-optimized articles, landing pages, and meta tags.' },
      { title: 'Competitor Analysis', desc: 'Analyzes competitor content strategies and finds gaps.' },
      { title: 'Rank Tracking', desc: 'Monitors your positions and alerts on significant changes.' },
      { title: 'Internal Linking', desc: 'Suggests internal links to boost page authority.' },
      { title: 'Performance Reports', desc: 'Weekly reports on traffic, rankings, and content performance.' },
    ],
    howItWorks: [
      { step: '01', title: 'SEO Audit', desc: 'Comprehensive analysis of your current search presence.' },
      { step: '02', title: 'Strategy', desc: 'AI builds a content calendar targeting your best keyword opportunities.' },
      { step: '03', title: 'Content Creation', desc: 'AI generates optimized content on schedule.' },
      { step: '04', title: 'Monitor & Adjust', desc: 'Track rankings and continuously optimize for better results.' },
    ],
    metrics: [
      { value: '150%', label: 'Organic Traffic Growth' },
      { value: '50+', label: 'Keywords Ranked' },
      { value: '10x', label: 'Content Output' },
      { value: '3mo', label: 'Time to Results' },
    ],
    useCases: ['SaaS companies', 'E-commerce stores', 'Local businesses', 'Professional services', 'Media & publishing', 'B2B companies'],
    pricing: { label: 'Starting at $499/mo', note: 'Includes 20 optimized articles/month' },
    category: 'Digital Marketing AI',
    icon: 'Globe',
  },
  'lead-generation': {
    name: 'AI Lead Generation',
    tagline: 'Multi-channel lead gen with AI qualification and scoring.',
    description: 'Combine AI-powered outreach across email, LinkedIn, phone, and social to generate and qualify leads automatically. Our AI scores leads, personalizes outreach, and books meetings — turning your funnel into a self-driving machine.',
    heroImage: '/visuals/sales-pipeline.jpg',
    features: [
      { title: 'Multi-Channel Outreach', desc: 'Coordinated campaigns across email, LinkedIn, SMS, and calls.' },
      { title: 'AI Personalization', desc: 'Each message is personalized using prospect research.' },
      { title: 'Lead Scoring', desc: 'AI scores and prioritizes leads based on engagement signals.' },
      { title: 'Automated Follow-Up', desc: 'Smart follow-up sequences that adapt to prospect behavior.' },
      { title: 'Meeting Booking', desc: 'Qualified leads book directly into your calendar.' },
      { title: 'CRM Integration', desc: 'All data syncs to your CRM automatically.' },
    ],
    howItWorks: [
      { step: '01', title: 'Define ICP', desc: 'Describe your ideal customer profile and target market.' },
      { step: '02', title: 'Build Campaigns', desc: 'AI creates personalized outreach sequences for each channel.' },
      { step: '03', title: 'Launch & Qualify', desc: 'Campaigns run autonomously, AI qualifies responses in real-time.' },
      { step: '04', title: 'Book & Close', desc: 'Hot leads get booked into meetings, cold leads get nurtured.' },
    ],
    metrics: [
      { value: '5x', label: 'Pipeline Growth' },
      { value: '35%', label: 'Reply Rate' },
      { value: '60%', label: 'Meeting Show Rate' },
      { value: '$0.50', label: 'Cost Per Lead' },
    ],
    useCases: ['B2B SaaS', 'Consulting firms', 'Agencies', 'Recruiting firms', 'Real estate', 'Financial services'],
    pricing: { label: 'Starting at $399/mo', note: 'Includes 2,000 prospects/month' },
    category: 'Digital Marketing AI',
    icon: 'Target',
  },
};

// Generate generic fallback for undefined slugs
const getServiceData = (slug: string): ServiceData => {
  if (SERVICES_DATA[slug]) return SERVICES_DATA[slug];

  // Generate from slug
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    name,
    tagline: `AI-powered ${name.toLowerCase()} for modern businesses.`,
    description: `Our ${name} service leverages cutting-edge AI to automate and optimize your ${name.toLowerCase()} processes. Built on the AgentIRL platform for maximum reliability and scalability.`,
    heroImage: '/visuals/tech-support.jpg',
    features: [
      { title: 'AI-Powered', desc: 'Leverages the latest LLMs for intelligent automation.' },
      { title: 'Always On', desc: 'Runs 24/7 without human supervision.' },
      { title: 'Integrates Everywhere', desc: 'Connects to your existing tools and workflows.' },
      { title: 'Enterprise Ready', desc: 'SOC2 compliant with full audit logging.' },
      { title: 'Scalable', desc: 'Grows with your business from startup to enterprise.' },
      { title: 'Measurable', desc: 'Clear ROI metrics and performance dashboards.' },
    ],
    howItWorks: [
      { step: '01', title: 'Discovery', desc: 'We understand your business needs and current processes.' },
      { step: '02', title: 'Configuration', desc: 'Set up the AI agent with your specific requirements.' },
      { step: '03', title: 'Deployment', desc: 'Go live with monitoring and support.' },
      { step: '04', title: 'Optimization', desc: 'Continuous improvement based on performance data.' },
    ],
    metrics: [
      { value: '10x', label: 'Efficiency' },
      { value: '99.9%', label: 'Uptime' },
      { value: '24/7', label: 'Available' },
      { value: '50%', label: 'Cost Savings' },
    ],
    useCases: ['Small businesses', 'Mid-size companies', 'Enterprise organizations', 'Startups', 'Agencies'],
    pricing: { label: 'Contact for pricing', note: 'Custom plans available' },
    category: 'Services',
    icon: 'Zap',
  };
};

export const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = getServiceData(serviceId || '');

  const IconComponent = iconMap[service.icon] || Zap;

  return (
    <Layout>
      <ServiceSEO serviceName={service.name} serviceDescription={service.description} />
      {/* Hero */}
      <section className="pt-32 pb-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-3/5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono text-blue-600 mb-6">
                <IconComponent className="w-3 h-3" /> {service.category}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                {service.name}
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
                {service.tagline}
              </p>
              <p className="text-slate-500 mb-10 leading-relaxed max-w-2xl">
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/contact" className="btn btn-primary btn-lg rounded-xl h-14 px-8 text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/demos" className="btn btn-secondary btn-lg rounded-xl h-14 px-8 text-lg flex items-center justify-center border-slate-200">
                  See Demo
                </Link>
              </div>

              <div className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{service.pricing.label}</span> — {service.pricing.note}
              </div>
            </motion.div>

            {/* Metrics Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-2/5 w-full"
            >
              <div className="grid grid-cols-2 gap-4">
                {service.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:border-blue-200 hover:shadow-md transition-all">
                    <div className="text-3xl font-bold text-slate-900 mb-1">{metric.value}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-mono">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Hero Image */}
              <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                <img src={service.heroImage} alt={service.name} className="w-full h-48 object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What's Included</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Everything you need to deploy and scale this service.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600">Get started in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[40px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200/0 via-blue-200 to-blue-200/0" />
            {service.howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-600 border border-blue-100 shadow-sm relative z-10">
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Who Uses This</h2>
              <p className="text-slate-600 mb-8">Built for businesses that want to grow faster without growing headcount.</p>
              <div className="grid grid-cols-2 gap-3">
                {service.useCases.map((uc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    {uc}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                </div>
                <blockquote className="text-lg text-slate-700 mb-6 leading-relaxed italic">
                  "We deployed the {service.name} and saw results within the first week. Our response time went from hours to seconds, and we're handling 3x more volume with no additional staff."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Satisfied Customer</div>
                    <div className="text-xs text-slate-500">Operations Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to deploy {service.name}?</h2>
          <p className="text-slate-300 text-lg mb-8">
            {service.pricing.label}. No long-term contracts. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn bg-white text-slate-900 hover:bg-blue-50 px-8 py-3 rounded-xl text-lg font-semibold">
              Start Free Trial
            </Link>
            <Link to="/demos" className="btn border border-slate-700 text-white hover:bg-slate-800 px-8 py-3 rounded-xl text-lg">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
