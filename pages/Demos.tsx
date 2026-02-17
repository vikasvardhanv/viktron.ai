import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Calendar,
  Cpu,
  MessageSquare,
  Mic,
  Network,
  Play,
  Sparkles,
  Target,
  Users,
  Wand2,
  Workflow,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';

const capabilities = [
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: 'AI Agent Teams',
    desc: 'Coordinated teams of Sales, Support, Content, and CEO agents that work together 24/7.',
    link: '/agents',
  },
  {
    icon: <Network className="h-6 w-6 text-indigo-600" />,
    title: 'Multi-Agent Orchestration',
    desc: 'Deploy and manage multiple agents with task delegation, conflict resolution, and parallel execution.',
    link: '/services/agent-orchestration',
  },
  {
    icon: <Mic className="h-6 w-6 text-purple-600" />,
    title: 'Voice & Chat Agents',
    desc: 'AI-powered voice and chat agents for phone support, WhatsApp, and live web chat.',
    link: '/services/voice-ai-agent',
  },
  {
    icon: <Workflow className="h-6 w-6 text-emerald-600" />,
    title: 'Workflow Automation',
    desc: 'Automate repetitive business processes — lead follow-ups, scheduling, reporting, and more.',
    link: '/services/workflow-automation',
  },
  {
    icon: <Target className="h-6 w-6 text-blue-600" />,
    title: 'Lead Generation & Sales',
    desc: 'AI agents that qualify leads, respond in seconds, book appointments, and follow up automatically.',
    link: '/services/ai-sales-agent',
  },
  {
    icon: <Wand2 className="h-6 w-6 text-purple-600" />,
    title: 'AI Content Generation',
    desc: 'Social posts, emails, and marketing copy trained on your brand voice and messaging.',
    link: '/services/content-marketing-ai',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
    title: 'Analytics & Observability',
    desc: 'Real-time monitoring of agent performance, visitor tracking, and conversion analytics.',
    link: '/services/data-analytics-ai',
  },
  {
    icon: <Brain className="h-6 w-6 text-amber-600" />,
    title: 'AI Audit & Consulting',
    desc: 'ROI analysis, technical feasibility, vendor selection, and implementation roadmaps.',
    link: '/services/ai-audit-consulting',
  },
];

const industries = [
  'Restaurants & Hospitality', 'Medical Clinics', 'Real Estate', 'Legal Services',
  'E-commerce', 'Education', 'Salons & Spas', 'Auto Dealerships',
  'Construction', 'Recruitment', 'Financial Services', 'SaaS Companies',
];

export const Demos: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="What We Build | Viktron"
        description="Explore Viktron's AI capabilities — agent teams, voice AI, workflow automation, analytics, and more. See how we can transform your business operations."
        keywords="AI capabilities, AI agent demos, voice AI, workflow automation, analytics, AI consulting"
        url="/demos"
      />

      <section className="pt-32 pb-12 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
              <Cpu className="h-4 w-4" />
              Capabilities
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h1 className="mt-6 text-5xl sm:text-7xl font-semibold tracking-tight text-slate-900">
              What we build.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
              From AI agent teams to enterprise analytics — explore the full range of solutions
              we deploy for businesses. Every capability is production-ready and backed by the AgentIRL platform.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact">
                <Button icon={<Calendar className="h-5 w-5" />}>Book a Demo</Button>
              </Link>
              <Link to="/use-cases">
                <Button variant="secondary">View Use Cases</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((cap) => (
              <StaggerItem key={cap.title}>
                <Link to={cap.link} className="block h-full">
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl border border-slate-200 h-full p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
                      {cap.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{cap.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{cap.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Industries we serve</h2>
              <p className="text-slate-600 text-sm mb-6">Our AI agents are trained and deployed across these verticals — with more added every month.</p>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <span key={industry} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 font-medium">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center">
              <Sparkles className="h-9 w-9 mx-auto text-blue-600" />
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Ready to see it in action?</h2>
              <p className="mt-3 max-w-2xl mx-auto text-slate-600">
                Book a personalized demo and we'll show you exactly how AI agents can work for your business.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/contact">
                  <Button>Book a Demo</Button>
                </Link>
                <Link to="/services">
                  <Button variant="secondary">View All Services</Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export const DemoWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <Layout showFooter={false}>
      <div className="pt-24 pb-8 px-4">
        <div className="container-custom">
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => navigate('/demos')} icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          </div>
        </div>
      </div>
      <div className="min-h-[calc(100vh-200px)]">{children}</div>
    </Layout>
  );
};
