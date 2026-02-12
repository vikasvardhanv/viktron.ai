import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Calendar, Check, FileText, Mail, Megaphone, Share2, Sparkles, Zap } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';

const modules = [
  {
    id: 'content',
    title: 'Content Engine',
    icon: <FileText className="h-5 w-5 text-[#3768e8]" />,
    description: 'Generate briefs, posts, and campaign copy aligned to brand voice.',
    features: ['Post ideas', 'Long-form copy', 'Ad angles', 'Creative variants'],
  },
  {
    id: 'social',
    title: 'Social Operations',
    icon: <Share2 className="h-5 w-5 text-[#2fa781]" />,
    description: 'Plan and schedule omnichannel publishing with smart timing logic.',
    features: ['Cross-posting', 'Best-time scheduling', 'Queue automation', 'Performance sync'],
  },
  {
    id: 'email',
    title: 'Lifecycle Email',
    icon: <Mail className="h-5 w-5 text-[#6a7ce8]" />,
    description: 'Deploy nurture, onboarding, and win-back campaigns from one system.',
    features: ['Segmentation', 'A/B content', 'Sequence builder', 'Deliverability checks'],
  },
  {
    id: 'analytics',
    title: 'Performance Insights',
    icon: <BarChart3 className="h-5 w-5 text-[#3a88db]" />,
    description: 'Attribute outcomes and identify the highest-leverage optimization points.',
    features: ['ROI visibility', 'Trend detection', 'Funnel diagnostics', 'Weekly recaps'],
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
        title="Marketing Automation & Content Systems | Viktron"
        description="AI-powered marketing operations: content generation, social automation, lifecycle email, and analytics loops."
        keywords="AI marketing automation, content systems, social automation, lifecycle campaigns"
        url="/marketing"
      />

      <section className="pt-32 pb-12 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deeb] bg-[#f8fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#60718c]">
              <Megaphone className="h-4 w-4 text-[#3768e8]" />
              Marketing Operating Layer
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h1 className="mt-6 text-5xl sm:text-7xl font-semibold tracking-tight text-[#12223e]">
              Marketing
              <span className="text-gradient-primary"> on iteration loops.</span>
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#52637e]">
              Replace scattered campaign work with one coordinated system for content, publishing,
              and performance optimization.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.16}>
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

      <section className="pb-14 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="card p-5 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7084a1]">Try sample generation</p>
                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-semibold text-[#1b2e4c]">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      {(['linkedin', 'instagram', 'twitter'] as PlatformKey[]).map((platform) => (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatform(platform)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            selectedPlatform === platform
                              ? 'bg-[#1e2f50] text-white'
                              : 'border border-[#d5dfed] bg-white text-[#43536e] hover:bg-[#edf3fd]'
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

                <div className="rounded-2xl border border-[#d8e2ef] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7084a1]">Output</p>
                  <AnimatePresence mode="wait">
                    <motion.pre
                      key={selectedPlatform}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-3 min-h-[220px] whitespace-pre-wrap rounded-xl border border-[#d8e2ef] bg-[#f8fbff] p-4 text-sm leading-relaxed text-[#334a6e] font-sans"
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
                <div className="card h-full p-5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3fd]">
                    {module.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[#12223e]">{module.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#54657f]">{module.description}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {module.features.map((feature) => (
                      <div key={`${module.id}-${feature}`} className="flex items-center gap-2 text-sm text-[#334a6e]">
                        <Check className="h-4 w-4 text-[#2fa781]" />
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
            <div className="rounded-3xl border border-[#d8e2ef] bg-[#f8fbff] p-7">
              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-[#12223e]">
                    Ready to run marketing like a system?
                  </h2>
                  <p className="mt-3 text-[#52637e] leading-relaxed">
                    We’ll set up your content operations, publishing workflows, and weekly optimization cadence.
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
                    <div key={stat.label} className="rounded-2xl border border-[#d8e2ef] bg-white p-3">
                      <p className="text-xl font-semibold text-[#1a2d4b]">{stat.value}</p>
                      <p className="mt-1 text-xs text-[#6d819f]">{stat.label}</p>
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
