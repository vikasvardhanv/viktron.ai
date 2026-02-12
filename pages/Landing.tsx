import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

const offerings = [
  {
    icon: <Bot className="h-6 w-6 text-sky-300" />,
    title: 'AI Agents',
    description: 'Industry-focused agents for healthcare, hospitality, legal, retail, and service teams.',
    href: '/agents',
  },
  {
    icon: <Workflow className="h-6 w-6 text-indigo-300" />,
    title: 'Automation Systems',
    description: 'Replace manual workflows with production automations integrated into your stack.',
    href: '/services#automation',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-cyan-300" />,
    title: 'Growth & Insights',
    description: 'AI-powered marketing execution and analytics that turn traffic into revenue.',
    href: '/marketing',
  },
];

const valuePoints = [
  { label: 'Deployment Window', value: '7-21 Days' },
  { label: 'Uptime Target', value: '99.9%' },
  { label: 'Support', value: '24/7 Human + AI' },
  { label: 'Integrations', value: '100+ APIs' },
];

export const Landing: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="Viktron | AI Agents, Automation, and Growth Systems"
        description="Viktron builds production-grade AI agents, workflow automation, and growth systems for modern businesses."
        keywords="AI agency, AI agents, workflow automation, marketing automation, custom AI solutions"
        url="/"
      />

      <section className="relative pt-32 pb-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
              <Sparkles className="h-4 w-4 text-sky-300" />
              Production AI. Not Prototypes.
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="mt-6 max-w-5xl text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.03]">
              Build the AI layer your business will run on.
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-relaxed">
              We design and ship customer-facing agents, internal automation, and measurable growth
              systems. End-to-end architecture, implementation, and iteration from one team.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/demo-form">
                <Button size="lg" icon={<Calendar className="h-5 w-5" />}>
                  Book Free Consultation
                </Button>
              </Link>
              <Link to="/demos">
                <Button size="lg" variant="secondary" icon={<MessageSquare className="h-5 w-5" />}>
                  Launch Demos
                </Button>
              </Link>
              <Link to="/case-studies" className="inline-flex items-center gap-2 text-slate-200 hover:text-white text-sm font-medium px-2">
                View case studies
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {valuePoints.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/12 bg-white/6 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container-custom">
          <StaggerContainer className="grid gap-6 lg:grid-cols-3">
            {offerings.map((item) => (
              <StaggerItem key={item.title}>
                <Link to={item.href} className="block h-full">
                  <GlassCard className="h-full p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/10">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky-300">
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="px-4 pb-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <GlassCard className="p-8 sm:p-10 md:p-12 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 border border-sky-400/30">
                <ShieldCheck className="h-6 w-6 text-sky-300" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Ready to modernize your stack?</h2>
              <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
                Start with a live consultation. We will map your highest-impact opportunities and
                propose a build plan that can ship fast.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/contact">
                  <Button size="lg">Talk to Viktron</Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="secondary">
                    Browse Services
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};
