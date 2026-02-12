import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, Calendar, CheckCircle2, Layers3, Sparkles, Workflow } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';

const solutionPillars = [
  {
    icon: <Bot className="h-5 w-5 text-[#3768e8]" />,
    title: 'Agent Layer',
    description: 'Customer-facing and internal agents trained on your workflows.',
    href: '/agents',
  },
  {
    icon: <Workflow className="h-5 w-5 text-[#2fa781]" />,
    title: 'Automation Layer',
    description: 'Cross-tool orchestration from intake, CRM, support, and reporting.',
    href: '/services',
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-[#6a7ce8]" />,
    title: 'Growth Layer',
    description: 'Campaign operations and analytics loops that compound weekly.',
    href: '/marketing',
  },
];

const momentumMetrics = [
  { label: 'Time to first launch', value: '7-21 days' },
  { label: 'SLA target', value: '99.9%' },
  { label: 'Integrations', value: '100+ tools' },
  { label: 'Support model', value: 'Human + AI' },
];

const implementationFlow = [
  { title: 'Map ops', description: 'Audit channels, bottlenecks, and handoff points.' },
  { title: 'Deploy stack', description: 'Ship agent flows, workflows, and dashboards.' },
  { title: 'Tune weekly', description: 'Use outcome telemetry to improve conversion and speed.' },
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

      <section className="pt-32 pb-16 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deeb] bg-[#f8fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5b6c87]">
              <Sparkles className="h-4 w-4 text-[#3768e8]" />
              Built Like a Product Team
            </div>
          </AnimatedSection>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
            <AnimatedSection delay={0.06}>
              <h1 className="text-[2.7rem] leading-[0.95] sm:text-[4.15rem] font-semibold tracking-tight text-[#101b2f]">
                Build the AI layer
                <br />
                your business runs on.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#51617c]">
                We design customer agents, workflow automation, and growth systems as one cohesive
                operating surface, not a pile of disconnected tools.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/demo-form">
                  <Button size="lg" icon={<Calendar className="h-5 w-5" />}>
                    Book Free Consultation
                  </Button>
                </Link>
                <Link to="/demos">
                  <Button size="lg" variant="secondary" icon={<Layers3 className="h-5 w-5" />}>
                    Launch Demos
                  </Button>
                </Link>
                <Link
                  to="/case-studies"
                  className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-[#26467f] hover:text-[#102952]"
                >
                  View Case Studies
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedSection>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="card overflow-hidden p-4 sm:p-5"
            >
              <div className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7083a1]">Live Control Surface</p>
                  <span className="rounded-full bg-[#e8effd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d4f95]">
                    Active
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#d8e2ef] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#7a8da9]">Agent queue</p>
                    <p className="mt-2 text-2xl font-semibold text-[#13213a]">24</p>
                  </div>
                  <div className="rounded-xl border border-[#d8e2ef] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#7a8da9]">Resolved today</p>
                    <p className="mt-2 text-2xl font-semibold text-[#13213a]">312</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-[#d8e2ef] bg-white p-3">
                  <div className="flex items-center justify-between text-xs text-[#627695]">
                    <span>Weekly optimization score</span>
                    <span className="font-semibold text-[#2e4f92]">+18%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#edf3fd]">
                    <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-[#3768e8] to-[#52c9a2]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatedSection delay={0.18}>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {momentumMetrics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#d8e2ef] bg-white px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b7d98]">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-[#12223e]">{item.value}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container-custom">
          <StaggerContainer className="grid gap-4 lg:grid-cols-3">
            {solutionPillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Link to={pillar.href} className="block h-full">
                  <div className="card h-full p-5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3fd]">
                      {pillar.icon}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[#12223e]">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#53637d]">{pillar.description}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2d4f95]">
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom">
          <div className="card p-6 sm:p-7">
            <AnimatedSection>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6e82a0]">Implementation Flow</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#12223e]">
                Structured delivery without heavy process overhead.
              </h2>
            </AnimatedSection>

            <StaggerContainer className="mt-6 grid gap-4 md:grid-cols-3">
              {implementationFlow.map((step, index) => (
                <StaggerItem key={step.title}>
                  <div className="rounded-2xl border border-[#d9e3ef] bg-[#f8fbff] p-4 h-full">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#2a4a88]">
                      <CheckCircle2 className="h-4 w-4 text-[#2fa781]" />
                      Step {index + 1}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[#14253f]">{step.title}</h3>
                    <p className="mt-2 text-sm text-[#586985] leading-relaxed">{step.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>
    </Layout>
  );
};
