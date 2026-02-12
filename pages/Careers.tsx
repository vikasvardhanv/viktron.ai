import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Globe, Heart, Sparkles, Users, Zap } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';

type Position = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};

const positions: Position[] = [
  {
    title: 'Python AI Agent Intern',
    department: 'Engineering',
    location: 'Remote / Chicago, IL',
    type: 'Internship',
    description: 'Build and test Python-based AI agents for real client automation workflows.',
    requirements: [
      'Strong interest in Python and AI',
      'Basic API and automation understanding',
      'Available for 3+ months',
    ],
  },
  {
    title: 'ADK Intern',
    department: 'Engineering',
    location: 'Remote / Chicago, IL',
    type: 'Internship',
    description: 'Contribute to our internal Agent Development Kit tools, docs, and testing workflows.',
    requirements: [
      'Programming fundamentals',
      'Clear technical communication',
      'Strong problem-solving mindset',
    ],
  },
  {
    title: 'Senior AI Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Architect and ship production-grade agentic systems with modern LLM and workflow stacks.',
    requirements: [
      '5+ years engineering experience',
      'LLM integration in production',
      'Backend architecture skills',
    ],
  },
  {
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build scalable web applications and internal tooling for AI products and client operations.',
    requirements: [
      'React + TypeScript expertise',
      'Node or Python backend experience',
      'API and database design',
    ],
  },
  {
    title: 'AI Solutions Architect',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    description: 'Translate business requirements into deployable AI architecture for client teams.',
    requirements: [
      'System design experience',
      'Strong client communication',
      'AI/automation implementation track record',
    ],
  },
];

const benefits = [
  { icon: <Globe className="h-5 w-5 text-[#3768e8]" />, title: 'Remote-first team' },
  { icon: <Heart className="h-5 w-5 text-[#2fa781]" />, title: 'Health and wellness support' },
  { icon: <Zap className="h-5 w-5 text-[#6a7ce8]" />, title: 'Work with latest AI stack' },
  { icon: <Users className="h-5 w-5 text-[#3a88db]" />, title: 'High ownership culture' },
];

export const Careers: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleApply = (position: string) => {
    const subject = `Application: ${position}`;
    const body = `Hi Viktron,\n\nI'm interested in applying for the ${position} role.\n\nPlease find my details attached.`;
    window.location.href = `mailto:tech@viktron.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <SEO
        title="Careers at Viktron | Join Our Team"
        description="Open roles and internships at Viktron. Build practical AI systems with a remote-first team."
        url="/careers"
      />

      <section className="pt-32 pb-12 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deeb] bg-[#f8fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#60718c]">
              <Briefcase className="h-4 w-4 text-[#3768e8]" />
              Careers
            </div>
            <h1 className="mt-6 text-5xl sm:text-7xl font-semibold tracking-tight text-[#12223e]">
              Build practical AI
              <br />
              with us.
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-[#52637e] leading-relaxed">
              We’re hiring builders who care about shipping real systems, not demo-only features.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-10 px-4">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <div className="card p-4 h-full">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3fd]">
                    {benefit.icon}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#1e3255]">{benefit.title}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl border border-[#d8e2ef] bg-[#f8fbff] p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f83a1]">Open positions</p>
              </div>
              <div className="space-y-3">
                {positions.map((position, index) => (
                  <article key={position.title} className="rounded-2xl border border-[#d8e2ef] bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-[#12223e]">{position.title}</h2>
                        <p className="mt-1 text-sm text-[#5d6f8d]">
                          {position.department} · {position.location} · {position.type}
                        </p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}>
                        {selectedIndex === index ? 'Hide details' : 'View details'}
                      </Button>
                    </div>

                    <p className="mt-3 text-sm text-[#566885]">{position.description}</p>

                    {selectedIndex === index ? (
                      <div className="mt-4 space-y-2">
                        {position.requirements.map((requirement) => (
                          <div key={requirement} className="flex items-start gap-2 text-sm text-[#334a6e]">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-[#2fa781]" />
                            {requirement}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4">
                      <Button onClick={() => handleApply(position.title)}>
                        Apply via Email
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl border border-[#d8e2ef] bg-white p-7 text-center">
              <Sparkles className="h-9 w-9 mx-auto text-[#3768e8]" />
              <h2 className="mt-4 text-3xl font-semibold text-[#12223e]">No perfect match listed?</h2>
              <p className="mt-3 max-w-2xl mx-auto text-[#53637d]">
                Send your resume and what you want to build at Viktron. We review every strong profile.
              </p>
              <div className="mt-6">
                <Button onClick={() => handleApply('General Application')}>Send General Application</Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
