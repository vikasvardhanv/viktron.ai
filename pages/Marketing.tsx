import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Calendar, Check, FileText, Mail, Megaphone, Share2, Sparkles, Zap, Users } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';

const modules = [
  {
    id: 'content',
    title: 'Content Strategist',
    icon: <FileText className="h-5 w-5 text-blue-600" />,
    description: 'An AI agent that researches trends, drafts briefs, and generates on-brand copy 24/7.',
    features: ['Trend Research', 'Long-form Copy', 'Ad Variations', 'SEO Optimization'],
  },
  {
    id: 'social',
    title: 'Social Media Manager',
    icon: <Share2 className="h-5 w-5 text-emerald-500" />,
    description: 'Autonomous scheduling and engagement across LinkedIn, Twitter, and Instagram.',
    features: ['Smart Scheduling', 'Auto-Replies', 'Cross-posting', 'Viral Monitoring'],
  },
  {
    id: 'email',
    title: 'Lifecycle Specialist',
    icon: <Mail className="h-5 w-5 text-indigo-500" />,
    description: 'Orchestrates complex nurture sequences and win-back campaigns based on user behavior.',
    features: ['Segment Logic', 'A/B Testing', 'Drip Campaigns', 'Deliverability Watch'],
  },
  {
    id: 'analytics',
    title: 'Revenue Analyst',
    icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
    description: 'Continuously monitors campaign performance and reallocates budget to high-ROI channels.',
    features: ['Attribution Models', 'Spend Optimization', 'Funnel Analysis', 'Weekly Reports'],
  },
];

const generatedContent = {
  linkedin:
    "AI operations is no longer optional for growth teams.\n\nTeams using layered automation are seeing:\n- faster lead response\n- cleaner qualification\n- lower campaign cycle time\n\nThe edge now is execution speed, not idea volume.",
  instagram:
    "Automation is your quiet growth advantage.\n\nShip faster.\nTest smarter.\nScale without extra overhead.\n\n#AIOperations #MarketingSystems #GrowthTeam",
  twitter:
    "Best growth teams are building AI operations systems, not one-off prompts.\n\nExecution loops > isolated campaigns.",
};

type PlatformKey = keyof typeof generatedContent;

export const Marketing: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>('linkedin');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    window.setTimeout(() => setIsGenerating(false), 900);
  };

  return (
    <Layout>
      <SEO
        title="AgentOps Growth Systems | Viktron"
        description="Run growth workflows on top of AgentOps: content, campaign orchestration, and measurable performance loops."
        keywords="AgentOps marketing, growth operations, AI campaign automation, performance loops"
        url="/marketing"
      />

      <section className="pt-32 pb-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <Megaphone className="h-4 w-4 text-blue-600" />
              Marketing Operations Force
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h1 className="mt-6 text-5xl sm:text-7xl font-semibold tracking-tight text-slate-900">
              Hire an Automated
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Growth Team.</span>
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
              Deploy autonomous agents that act as your Content Analysts, Campaign Managers, and Data Scientists. Scale your marketing operations without headcount.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.16}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/agents">
                 <Button icon={<Users className="h-5 w-5" />}>Browse Marketing Agents</Button>
              </Link>
              <Link to="/demo-form">
                <Button variant="secondary">Book Strategy Call</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-14 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Try sample generation</p>
                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-semibold text-slate-900">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      {(['linkedin', 'instagram', 'twitter'] as PlatformKey[]).map((platform) => (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatform(platform)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                            selectedPlatform === platform
                              ? 'bg-slate-800 text-white'
                              : 'border border-slate-200 bg-white text-slate-600 hover:bg-blue-50'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                    <Button onClick={handleGenerate} loading={isGenerating} icon={<Sparkles className="h-4 w-4" />}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Output</p>
                  <AnimatePresence mode="wait">
                    <motion.pre
                      key={selectedPlatform}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-3 min-h-[220px] whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 font-sans"
                    >
                      {generatedContent[selectedPlatform]}
                    </motion.pre>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-14 px-4">
        <div className="container-custom">
          <StaggerContainer className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <StaggerItem key={module.id}>
                <div className="bg-white rounded-2xl border border-slate-200 h-full p-5 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    {module.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{module.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{module.description}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {module.features.map((feature) => (
                      <div key={`${module.id}-${feature}`} className="flex items-center gap-2 text-sm text-slate-700">
                        <Check className="h-4 w-4 text-emerald-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-14 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-200 p-7">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">How Growth Ops Works with Viktron</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Research & Planning",
                    desc: "AI agents analyze your market, competitors, and audience to identify growth levers. They compile trends, content gaps, and campaign ideas into actionable briefs."
                  },
                  {
                    step: "2",
                    title: "Content & Campaign Ops",
                    desc: "Content Strategists generate on-brand copy, Social Managers schedule posts across platforms, and Email Specialists orchestrate nurture sequences — all without manual work."
                  },
                  {
                    step: "3",
                    title: "Measure & Optimize",
                    desc: "Revenue Analysts continuously monitor performance, track attribution, and reallocate budget to high-ROI channels. Weekly dashboards show what's working and why."
                  }
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">{item.step}</div>
                    <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-14 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Real Results: How Customers Use Growth Ops</h2>
              <div className="space-y-6">
                {[
                  {
                    company: "B2B SaaS (Series A)",
                    challenge: "Content team of 2 couldn't keep up with blog, social, and email demands",
                    result: "Deployed Content Strategist + Social Manager agents. Content cycle dropped 63%, team now ships 4x more campaigns while founder focuses on strategy."
                  },
                  {
                    company: "E-commerce Brand",
                    challenge: "Manual email campaigns took 40 hours/week to plan, write, and track",
                    result: "Lifecycle Specialist agent now orchestrates 12 automated sequences. Avg email revenue increased 28%, team redirected to creative strategy."
                  },
                  {
                    company: "Marketing Agency (12-person)",
                    challenge: "Client reporting took 15 hours/week across team; hard to show real ROI",
                    result: "Revenue Analyst agent generates weekly dashboards automatically. Clients see clear attribution. Agency now handles 35% more clients without hiring."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-6 py-4">
                    <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-blue-600 mb-1">{item.company}</h3>
                    <p className="text-slate-700 mb-2"><span className="font-semibold">Challenge:</span> {item.challenge}</p>
                    <p className="text-slate-700"><span className="font-semibold">Result:</span> {item.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-14 px-4">
        <div className="container-custom max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">FAQ: Growth Ops & AI Agents</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Can AI-generated content really work for our brand?",
                  a: "Yes — if you train it on your voice. Viktron's Content Strategist learns from your best content, brand guidelines, and tone samples. The agent generates variations that sound like you, not generic AI."
                },
                {
                  q: "How much does growth ops cost vs. hiring a growth team?",
                  a: "A 3-person growth team costs $250-400K/year in salary + benefits. Viktron Growth Ops platform costs $4,000-8,000/month and delivers 80% of the output with 90% cost savings."
                },
                {
                  q: "What integrations do you support?",
                  a: "We integrate with Salesforce, HubSpot, Slack, Notion, Stripe, Google Analytics, Airtable, Zapier, and 50+ other tools. If your tool has an API, we can connect it."
                },
                {
                  q: "Do you handle compliance for regulated industries?",
                  a: "For healthcare and finance, we support HIPAA and FINRA-compliant deployments with encrypted data, audit logs, and restricted access. Contact us for industry-specific setup."
                }
              ].map((item, idx) => (
                <details key={idx} className="group cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-slate-900 py-3 px-4 bg-white rounded-lg border border-slate-200 hover:bg-blue-50 transition-colors">
                    {item.q}
                    <ArrowRight className="w-4 h-4 transform group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 py-3 text-slate-600 text-sm bg-white border-x border-b border-slate-200 rounded-b-lg">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">Ready for production-grade growth ops?</h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    We set up your growth stack with reliability controls, integration stability, and weekly ROI optimization. Your team gets 80% of the output of a growth team for 10% of the cost.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/demo-form">
                      <Button icon={<Zap className="h-4 w-4" />}>Start with a Strategy Call</Button>
                    </Link>
                    <Link to="/services">
                      <Button variant="secondary">See All Services</Button>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Content cycle time', value: '-63%' },
                    { label: 'Campaign throughput', value: '+2.8x' },
                    { label: 'Manual ops load', value: '-20h/wk' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                      <p className="mt-1 text-xs text-slate-500 whitespace-nowrap">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
