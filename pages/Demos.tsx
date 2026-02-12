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
  MessageSquare,
  Mic,
  Network,
  Play,
  Sparkles,
  Target,
  Wand2,
  Workflow,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';
import { INDUSTRY_AGENTS } from '../constants';

const demoCategories = [
  {
    id: 'agentic-ai',
    name: 'Advanced AI Services',
    description: 'Autonomous workflows, multi-agent systems, and model tooling.',
    icon: <Network className="h-6 w-6 text-[#3768e8]" />,
    demos: [
      { id: 'agent-orchestration', name: 'Multi-Agent Orchestration', icon: <Network className="h-5 w-5 text-[#6a7ce8]" /> },
      { id: 'workflow-automation', name: 'Workflow Automation', icon: <Workflow className="h-5 w-5 text-[#2fa781]" /> },
      { id: 'data-analytics', name: 'Predictive Analytics', icon: <BarChart3 className="h-5 w-5 text-[#3a88db]" /> },
      { id: 'content-generator', name: 'AI Content Generator', icon: <Wand2 className="h-5 w-5 text-[#8a70e5]" /> },
      { id: 'custom-model', name: 'Custom Model Training', icon: <Brain className="h-5 w-5 text-[#d2873e]" /> },
    ],
  },
  {
    id: 'industry-agents',
    name: 'Industry Agent Demos',
    description: 'Prebuilt vertical agents with live interaction flows.',
    icon: <Bot className="h-6 w-6 text-[#2fa781]" />,
    demos: INDUSTRY_AGENTS.map((agent) => ({
      id: agent.id,
      name: agent.name,
      icon: agent.icon,
    })),
  },
  {
    id: 'tools',
    name: 'AI Tools',
    description: 'Focused tools for communication, lead capture, and planning.',
    icon: <Sparkles className="h-6 w-6 text-[#6a7ce8]" />,
    demos: [
      { id: 'whatsapp', name: 'WhatsApp Bot', icon: <MessageSquare className="h-5 w-5 text-[#2fa781]" /> },
      { id: 'voice', name: 'Voice Agent', icon: <Mic className="h-5 w-5 text-[#8a70e5]" /> },
      { id: 'business-plan', name: 'Business Plan Generator', icon: <Brain className="h-5 w-5 text-[#d2873e]" /> },
      { id: 'lead-gen', name: 'AI Lead Generator', icon: <Target className="h-5 w-5 text-[#3768e8]" /> },
    ],
  },
];

const demoRouteMap: Record<string, string> = {
  restaurant: '/demos/restaurant',
  clinic: '/demos/clinic',
  salon: '/demos/salon',
  dealership: '/demos/dealership',
  construction: '/demos/construction',
  whatsapp: '/demos/whatsapp',
  voice: '/demos/voice',
  'business-plan': '/demos/business-plan',
  real_estate: '/demos/real_estate',
  legal: '/demos/legal',
  ecommerce: '/demos/ecommerce',
  education: '/demos/education',
  recruitment: '/demos/recruitment',
  'workflow-automation': '/demos/workflow-automation',
  'data-analytics': '/demos/data-analytics',
  'content-generator': '/demos/content-generator',
  'agent-orchestration': '/demos/agent-orchestration',
  'custom-model': '/demos/custom-model',
  'lead-gen': '/demos/lead-gen',
};

export const Demos: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoClick = (demoId: string) => {
    navigate(demoRouteMap[demoId] || '/demos');
  };

  return (
    <Layout>
      <SEO
        title="Try AI Demos | Viktron"
        description="Experience live demos of Viktron AI agents, automation systems, and growth tools."
        keywords="AI demos, chatbot demo, voice demo, workflow automation demo"
        url="/demos"
      />

      <section className="pt-32 pb-12 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deeb] bg-[#f8fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#60718c]">
              <Play className="h-4 w-4 text-[#3768e8]" />
              Interactive Demo Library
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h1 className="mt-6 text-5xl sm:text-7xl font-semibold tracking-tight text-[#12223e]">Try before you build.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#52637e]">
              Explore live demos by capability. Each flow reflects the same production architecture we deploy for clients.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/demo-form">
                <Button icon={<Calendar className="h-5 w-5" />}>Book Free Consultation</Button>
              </Link>
              <Link to="/case-studies">
                <Button variant="secondary">View Case Studies</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {demoCategories.map((category, categoryIndex) => (
        <section key={category.id} className="pb-12 px-4">
          <div className="container-custom">
            <AnimatedSection delay={categoryIndex * 0.04}>
              <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5dfec] bg-[#f8fbff]">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#12223e]">{category.name}</h2>
                  <p className="text-sm text-[#5c6d89]">{category.description}</p>
                </div>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {category.demos.map((demo) => (
                <StaggerItem key={demo.id}>
                  <motion.button
                    whileHover={{ y: -3 }}
                    onClick={() => handleDemoClick(demo.id)}
                    className="card h-full w-full p-5 text-left"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3fd]">
                      {demo.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#12223e]">{demo.name}</h3>
                    <p className="mt-2 text-sm text-[#556781]">
                      Launch the interactive flow and test how the experience handles real requests.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2d4f95]">
                      Launch demo
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ))}

      <section className="pb-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl border border-[#d8e2ef] bg-[#f8fbff] p-7 text-center">
              <h2 className="text-3xl font-semibold text-[#12223e]">Need a custom demo path?</h2>
              <p className="mt-3 max-w-2xl mx-auto text-[#52637e]">
                We can build a private demo aligned to your exact stack, use cases, and business logic.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/demo-form">
                  <Button>Request Custom Demo</Button>
                </Link>
                <Link to="/services">
                  <Button variant="secondary">View Services</Button>
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
              Back to Demos
            </Button>
            <h1 className="text-xl font-semibold text-[#12223e]">{title}</h1>
          </div>
        </div>
      </div>
      <div className="min-h-[calc(100vh-200px)]">{children}</div>
    </Layout>
  );
};
