import React from 'react';
import { Check } from 'lucide-react';
import { PricingCard, CTABox } from '../components/saas/Sections';
import { Navbar, Footer, SaaSLayout } from '../components/saas/Navigation';
import { SEO } from '../components/ui/SEO';

export const PricingV2: React.FC = () => {
  const navLinks = [
    { label: 'Features', href: '#' },
    { label: 'Services', href: '/services' },
    { label: 'Docs', href: '/docs' },
  ];

  const navCtas = [
    { label: 'Sign In', href: '/auth', variant: 'secondary' as const },
    { label: 'Get Started', href: '/onboarding', variant: 'primary' as const },
  ];

  const tiers = [
    {
      name: 'Starter',
      price: '$99',
      description: 'Perfect for teams getting started with AI agents',
      features: [
        'Up to 5 agents',
        '100K API calls/month',
        'Basic monitoring & logs',
        'Community support',
        'Standard SLA (99%)',
      ],
      cta: { label: 'Start Free', href: '/onboarding' },
    },
    {
      name: 'Professional',
      price: '$499',
      description: 'For growing teams scaling their agent operations',
      features: [
        'Unlimited agents',
        'Unlimited API calls',
        'Advanced monitoring & analytics',
        'Priority email support',
        'Advanced SLA (99.5%)',
        'Custom integrations',
        'Approval gates & governance',
        'Cost management & budgets',
      ],
      cta: { label: 'Start Free', href: '/onboarding' },
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For enterprises with mission-critical deployments',
      features: [
        'Everything in Professional',
        'Dedicated support & SLA',
        'On-premise & hybrid deployment',
        'SSO & advanced security',
        'Custom contracts & billing',
        'Technical account manager',
        'SLA guarantee (99.99%)',
      ],
      cta: { label: 'Contact Sales', href: '/contact' },
    },
  ];

  return (
    <SaaSLayout
      navbar={<Navbar logo="Viktron" links={navLinks} ctas={navCtas} />}
      footer={<Footer />}
    >
      <SEO
        title="Pricing - Viktron"
        description="Simple, transparent pricing for AI agent orchestration. Start free, scale as you grow."
        url="/pricing"
      />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="w-full py-20 md:py-32 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {tiers.map((tier, idx) => (
              <PricingCard key={idx} {...tier} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 md:py-32 bg-slate-950">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! Upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, wire transfers, and can set up custom invoicing for enterprise customers.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, all plans come with a 14-day free trial. No credit card required to get started.',
              },
              {
                q: 'What about volume discounts?',
                a: 'Enterprise customers qualify for volume discounts. Contact our sales team for custom pricing.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 30-day money-back guarantee if you\'re not satisfied.',
              },
              {
                q: 'How is pricing calculated?',
                a: 'Pricing is based on number of agents and API calls. See our documentation for detailed pricing calculator.',
              },
            ].map((item, idx) => (
              <div key={idx} className="border-b border-slate-700/50 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTABox
        title="Ready to get started?"
        subtitle="Choose your plan and deploy your first agent team in minutes."
        cta={{ label: 'Start Free Trial', href: '/onboarding' }}
        secondary={{ label: 'Talk to Sales', href: '/contact' }}
      />
    </SaaSLayout>
  );
};

export default PricingV2;
