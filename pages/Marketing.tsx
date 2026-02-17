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

      <section className="pt-32 pb-12 px-4 bg-white relative overflow-hidden">
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

      <section className="pb-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Ready for production-grade growth ops?</h2>
                  <p className="mt-3 text-slate-600 leading-relaxed">
                    We set up your growth stack with reliability controls, integration stability, and weekly ROI optimization.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/demo-form">
                      <Button icon={<Zap className="h-4 w-4" />}>Start with a Strategy Call</Button>
                    </Link>
                    <Link to="/services">
                      <Button variant="secondary">Explore Services</Button>
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
                      <p className="text-xl font-semibold text-slate-900">{stat.value}</p>
                      <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
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
