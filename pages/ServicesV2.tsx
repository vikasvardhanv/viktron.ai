import React from 'react';
import { Shield, Zap, Users, BarChart3, Lock, Cpu, Globe, Layers } from 'lucide-react';
import { FeatureGrid, CTABox } from '../components/saas/Sections';
import { Navbar, Footer, SaaSLayout } from '../components/saas/Navigation';
import { SEO } from '../components/ui/SEO';

export const ServicesV2: React.FC = () => {
  const navLinks = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
  ];

  const navCtas = [
    { label: 'Sign In', href: '/auth', variant: 'secondary' as const },
    { label: 'Get Started', href: '/onboarding', variant: 'primary' as const },
  ];

  const services = [
    {
      icon: Zap,
      title: 'Agent Orchestration',
      description: 'Coordinate multiple AI agents to work together on complex workflows. Define dependencies, handoffs, and execution strategies.',
    },
    {
      icon: Shield,
      title: 'Governance Layer',
      description: 'Approval gates, budget controls, and execution policies. Ensure agents operate within defined guardrails.',
    },
    {
      icon: BarChart3,
      title: 'Cost Management',
      description: 'Real-time cost tracking per agent, per task, per model. Set budgets and enforce hard limits automatically.',
    },
    {
      icon: Lock,
      title: 'Security & Compliance',
      description: 'SOC 2 Type II certified. Role-based access control, API key management, encrypted data at rest and in transit.',
    },
    {
      icon: Users,
      title: 'Multi-Tenant Management',
      description: 'Manage hundreds of teams and thousands of agents from a single control plane. Tenant isolation and billing separation.',
    },
    {
      icon: Layers,
      title: 'Integration Hub',
      description: 'Connect to your existing tools. Native integrations with Slack, Email, CRM, Data Warehouses, and more.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Observability',
      description: 'Real-time dashboards, audit logs, execution traces, and performance metrics for every agent.',
    },
    {
      icon: Globe,
      title: 'Deployment Options',
      description: 'Cloud-hosted, on-premise, or hybrid. Choose where your agents run based on compliance and latency requirements.',
    },
  ];

  return (
    <SaaSLayout
      navbar={<Navbar logo="Viktron" links={navLinks} ctas={navCtas} />}
      footer={<Footer />}
    >
      <SEO
        title="Services - Viktron"
        description="Complete platform for agent orchestration, governance, and deployment. Scale AI agents safely."
        url="/services"
      />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white mb-6">
            Complete Agent Management Platform
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From deployment to governance to scaling. Everything you need to build and operate production AI agents.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <FeatureGrid
        title="Our Services"
        subtitle="Everything enterprises need to build, deploy, and manage AI agents at scale."
        features={services}
        columns={4}
      />

      {/* How It Works */}
      <section className="w-full py-20 md:py-32 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            The Viktron Workflow
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Define',
                description: 'Describe your agents and workflows in natural language. No code, no YAML, no configuration files.',
              },
              {
                step: '2',
                title: 'Deploy',
                description: 'Click deploy and your agents are live in seconds. Automatic scaling, monitoring, and governance applied.',
              },
              {
                step: '3',
                title: 'Observe & Optimize',
                description: 'Real-time dashboards show agent performance, costs, and outcomes. Adjust and improve continuously.',
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 mb-4">
                  <span className="text-xl font-bold text-emerald-500">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTABox
        title="Ready to Deploy?"
        subtitle="Get started with Viktron today. Deploy your first multi-agent team in minutes."
        cta={{ label: 'Start Free Trial', href: '/onboarding' }}
        secondary={{ label: 'Schedule Demo', href: '/demos' }}
      />
    </SaaSLayout>
  );
};

export default ServicesV2;
