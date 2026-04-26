import React from 'react';
import { Zap, Shield, Infinity, BarChart3, Users, Lock, Code2, Cpu } from 'lucide-react';
import { Hero } from '../components/saas/Hero';
import { FeatureGrid, StatsSection, CTABox } from '../components/saas/Sections';
import { Navbar, Footer, SaaSLayout } from '../components/saas/Navigation';
import { SEO } from '../components/ui/SEO';

export const LandingV2: React.FC = () => {
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'Enterprise', href: '/enterprise' },
  ];

  const navCtas = [
    { label: 'Sign In', href: '/auth', variant: 'secondary' as const },
    { label: 'Get Started', href: '/onboarding', variant: 'primary' as const },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Deploy in 60 Seconds',
      description: 'No infrastructure setup. No YAML. Just define what you want and deploy multi-agent teams instantly.',
    },
    {
      icon: Shield,
      title: 'Built-In Governance',
      description: 'SOC 2 compliance, approval gates, audit logs, and budget controls out of the box.',
    },
    {
      icon: Infinity,
      title: 'Infinite Scale',
      description: 'Orchestrate thousands of agents. 10,000+ agents, 10x cost reduction vs traditional approaches.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Observability',
      description: 'Track agent performance, costs, and outcomes in real-time. Drill down to individual token usage.',
    },
    {
      icon: Users,
      title: 'Multi-Tenant Ready',
      description: 'White-label support. Manage hundreds of teams and thousands of agents from one platform.',
    },
    {
      icon: Lock,
      title: 'Security First',
      description: 'End-to-end encryption, role-based access control, and API key management.',
    },
  ];

  const stats = [
    { value: '60', label: 'Seconds to Deploy', suffix: 's' },
    { value: '10x', label: 'Cost Savings' },
    { value: '99.9%', label: 'Uptime' },
    { value: '100%', label: 'Transparent' },
  ];

  return (
    <SaaSLayout
      navbar={<Navbar logo="Viktron" links={navLinks} ctas={navCtas} />}
      footer={<Footer />}
    >
      <SEO
        title="Viktron - Deploy AI Agent Teams in Minutes"
        description="Enterprise platform for orchestrating, governing, and scaling multi-agent AI systems. Deploy in 60 seconds with built-in governance."
        url="/"
      />

      {/* Hero Section */}
      <Hero
        eyebrow="AI Agent Orchestration"
        title="Deploy Multi-Agent Teams in Minutes, Not Months"
        subtitle="Enterprise control plane for orchestrating, governing, and scaling AI agents. Deploy production-ready agent teams in 60 seconds with SOC 2 compliance and audit trails built in."
        ctas={[
          { label: 'Start Free', href: '/onboarding', variant: 'primary' },
          { label: 'View Demo', href: '/demos', variant: 'secondary' },
        ]}
      />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Features Section */}
      <FeatureGrid
        title="The Moat: Speed, Governance, Scale"
        subtitle="Everything an enterprise needs to deploy and operate AI agents safely at scale."
        features={features}
        columns={3}
      />

      {/* Use Cases Section */}
      <section className="w-full py-20 md:py-32 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Built for Every Industry
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'Customer Support',
                description: 'Deploy support agents that handle tier-1 tickets, escalate complex issues, and learn from interactions.',
                icon: Users,
              },
              {
                title: 'Sales & Revenue',
                description: 'Multi-agent teams for lead scoring, outreach, nurturing, and upsell orchestration.',
                icon: BarChart3,
              },
              {
                title: 'Content & Marketing',
                description: 'Agents for content generation, SEO optimization, social media strategy, and campaign management.',
                icon: Code2,
              },
              {
                title: 'Operations & Automation',
                description: 'Automate workflows, data pipelines, report generation, and cross-system orchestration.',
                icon: Cpu,
              },
            ].map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-8 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all duration-300"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3">
                    <Icon className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{useCase.title}</h3>
                  <p className="text-slate-400">{useCase.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="w-full py-20 md:py-32 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Why Viktron?
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                metric: '10,000+',
                claim: 'Agents at scale with single control plane',
                detail: 'No orchestration overhead. No scaling limits. Pure performance.',
              },
              {
                metric: '60sec',
                claim: 'From zero to production agents',
                detail: 'Natural language deployment. Zero infrastructure setup. Zero config.',
              },
              {
                metric: '99.9%',
                claim: 'SLA with mission-critical governance',
                detail: 'Approval gates, budget controls, audit trails. Enterprise-grade from day one.',
              },
            ].map((adv, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold text-emerald-500 mb-2">{adv.metric}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{adv.claim}</h3>
                <p className="text-slate-400 text-sm">{adv.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTABox
        title="Ready to Deploy?"
        subtitle="Join enterprises deploying next-generation AI teams on Viktron."
        cta={{ label: 'Start Free Trial', href: '/onboarding' }}
        secondary={{ label: 'Schedule Demo', href: '/demos' }}
      />
    </SaaSLayout>
  );
};

export default LandingV2;
