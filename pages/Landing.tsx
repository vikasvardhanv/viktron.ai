import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Calendar,
  MessageSquare,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

const offeringTiles = [
  {
    icon: <Bot className="h-6 w-6 text-lime-200" />,
    title: 'AI Agents',
    description: 'Industry-focused copilots for support, intake, scheduling, and customer operations.',
    href: '/agents',
  },
  {
    icon: <Workflow className="h-6 w-6 text-emerald-200" />,
    title: 'Automation Systems',
    description: 'Operational workflows wired into your CRM, messaging channels, and internal tools.',
    href: '/services#automation',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-lime-100" />,
    title: 'Growth Intelligence',
    description: 'Campaign automation plus analytics loops that keep performance improving weekly.',
    href: '/marketing',
  },
];

const metrics = [
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#38455e] bg-[#171f2d] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
              <Sparkles className="h-4 w-4 text-lime-200" />
              Operator-Class AI Stack
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <h1 className="mt-6 max-w-5xl text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#f3f6fd] leading-[0.98]">
              Build the AI layer your
              <br />
              business will run on.
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.16}>
            <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-relaxed">
              We architect and ship intelligent customer workflows, internal copilots, and
              growth automation systems that are production-ready from day one.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.24}>
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

          <AnimatedSection delay={0.3}>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-xl border border-[#2f3a50] bg-[#141b28] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-[28px] border border-[#2e3950] bg-[#111723] p-4 sm:p-6"
          >
            <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
              <div className="rounded-2xl border border-[#303b52] bg-gradient-to-br from-[#151d2b] to-[#101722] p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Live Workspace Preview</p>
                <h3 className="mt-3 text-2xl font-medium text-white">
                  Orchestrate agents, monitor outcomes, and ship improvements continuously.
                </h3>
                <div className="mt-6 flex flex-wrap gap-2 text-xs">
                  {['Command Center', 'Agent Chain', 'Workflow State', 'Performance Feed'].map((label) => (
                    <span key={label} className="rounded-full border border-[#3c4862] bg-[#1a2333] px-3 py-1.5 text-slate-300">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-[#2f3a50] bg-[#151d2b] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Agent SLA</p>
                  <p className="mt-2 text-3xl font-medium text-lime-200">99.92%</p>
                </div>
                <div className="rounded-2xl border border-[#2f3a50] bg-[#151d2b] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Automations Active</p>
                  <p className="mt-2 text-3xl font-medium text-emerald-200">128</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container-custom">
          <StaggerContainer className="grid gap-6 lg:grid-cols-3">
            {offeringTiles.map((item) => (
              <StaggerItem key={item.title}>
                <Link to={item.href} className="block h-full">
                  <GlassCard className="h-full p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#34445f] bg-[#1b2434]">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-medium text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-lime-200">
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
    </Layout>
  );
};
