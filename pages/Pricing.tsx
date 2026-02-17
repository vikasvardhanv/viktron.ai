import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';
import {
  CheckCircle2, X as XIcon, ChevronDown, ArrowRight, Sparkles, Calendar, Shield,
} from 'lucide-react';

const TIERS = [
  {
    name: 'Starter',
    price: '$199',
    period: '/mo',
    desc: 'Single AI agent for one use case.',
    highlight: false,
    badge: null,
    features: [
      '1 AI Agent (Sales or Support)',
      'Up to 500 conversations/mo',
      'Email & SMS channels',
      'Basic analytics dashboard',
      '5-day onboarding',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Growth',
    price: '$499',
    period: '/mo',
    desc: 'Agent team with CEO coordination.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Sales + Support + Content + CEO agents',
      'Unlimited conversations',
      'All channels (voice, chat, email, SMS)',
      'Full analytics & daily reports',
      'Priority onboarding (48h)',
      'Priority support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Full platform + AgentIRL + custom agents.',
    highlight: false,
    badge: null,
    features: [
      'AgentIRL platform access',
      'Custom agent development',
      'Enterprise integrations (SAP, Oracle)',
      'Dedicated engineering pod',
      'SLA-backed 99.9% uptime',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
  },
];

const COMPARISON = [
  { feature: 'AI Agents', starter: '1', growth: '3–4', enterprise: 'Unlimited' },
  { feature: 'Conversations/mo', starter: '500', growth: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Channels', starter: 'Email, SMS', growth: 'All', enterprise: 'All + Custom' },
  { feature: 'Analytics', starter: 'Basic', growth: 'Full', enterprise: 'Full + Custom' },
  { feature: 'AgentIRL Platform', starter: false, growth: false, enterprise: true },
  { feature: 'Custom Agent Dev', starter: false, growth: false, enterprise: true },
  { feature: 'Uptime SLA', starter: false, growth: '99.9%', enterprise: '99.9%' },
  { feature: 'Support', starter: 'Email', growth: 'Priority', enterprise: 'Dedicated' },
  { feature: 'Onboarding', starter: '5 days', growth: '48 hours', enterprise: 'White-glove' },
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes. No long-term contracts. Cancel at any time — your agents will run through the end of the billing period.' },
  { q: 'How long does setup take?', a: 'Starter plans go live in 5 business days. Growth plans launch in 48 hours with priority onboarding. Enterprise timelines are scoped during consultation.' },
  { q: 'What channels do agents work on?', a: 'Voice calls, WhatsApp, website chatbot, email, and SMS. Enterprise plans support custom integrations with any API.' },
  { q: 'Do you offer a free trial?', a: 'We offer a 14-day pilot with clear success metrics. If the results don\'t meet the agreed benchmarks, you pay nothing.' },
  { q: 'What is AgentIRL?', a: 'AgentIRL is our coordination infrastructure layer — it handles orchestration, monitoring, retry logic, and failover for multi-agent systems. Available on Enterprise plans.' },
];

export const Pricing: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <SEO
        title="Pricing | Viktron AI Agent Teams"
        description="Transparent pricing for AI agent teams. Start at $199/mo for a single agent, scale to full enterprise teams with AgentIRL."
        keywords="AI agent pricing, AI team cost, Viktron pricing, AI automation pricing"
        url="/pricing"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono text-blue-600 mb-6">
              <Sparkles className="w-3 h-3" /> Pricing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Simple, transparent<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">pricing.</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              Start with a single agent. Scale to a full AI workforce. No hidden fees, no long-term contracts.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TIERS.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl border p-8 ${
                  tier.highlight
                    ? 'border-blue-300 bg-blue-50/30 shadow-lg shadow-blue-100/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    {tier.badge}
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{tier.desc}</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                  <span className="text-slate-500">{tier.period}</span>
                </div>
                <Link to="/contact">
                  <Button
                    className="w-full justify-center"
                    variant={tier.highlight ? 'primary' : 'secondary'}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    {tier.cta}
                  </Button>
                </Link>
                <ul className="mt-8 space-y-3">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-slate-50 border-y border-slate-200">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Compare Plans</h2>
          </AnimatedSection>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 text-sm font-semibold text-slate-900 w-1/4">Feature</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-900 text-center">Starter</th>
                  <th className="py-3 px-4 text-sm font-semibold text-blue-600 text-center">Growth</th>
                  <th className="py-3 pl-4 text-sm font-semibold text-slate-900 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-sm text-slate-700 font-medium">{row.feature}</td>
                    {[row.starter, row.growth, row.enterprise].map((val, i) => (
                      <td key={i} className="py-3 px-4 text-sm text-center">
                        {val === true ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mx-auto" />
                        ) : val === false ? (
                          <XIcon className="w-4 h-4 text-slate-300 mx-auto" />
                        ) : (
                          <span className="text-slate-600">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="container-custom max-w-3xl">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          </AnimatedSection>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-900 text-white text-center">
        <div className="container-custom max-w-3xl">
          <Shield className="w-10 h-10 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Not sure which plan is right?</h2>
          <p className="text-slate-300 text-lg mb-8">
            Book a free consultation. We'll map your needs to the right plan — no pressure, no pitch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button icon={<Calendar className="h-4 w-4" />}>Book Consultation</Button>
            </Link>
            <Link to="/services">
              <Button variant="secondary">Explore Services</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
