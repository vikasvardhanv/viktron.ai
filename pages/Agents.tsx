import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Check, Play, Sparkles } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';
import { INDUSTRY_AGENTS } from '../constants';

const agentDetails: Record<string, { benefits: string[]; useCases: string[] }> = {
  restaurant: {
    benefits: ['Reduce wait times by 50%', 'Handle peak-hour surges', 'No missed reservations'],
    useCases: ['Reservations', 'Menu Q&A', 'Order intake', 'Event booking'],
  },
  clinic: {
    benefits: ['Cut no-shows by 40%', '24/7 booking', 'Smarter triage'],
    useCases: ['Appointments', 'Triage', 'Refills', 'Patient FAQs'],
  },
  salon: {
    benefits: ['Increase rebooking', 'Stylist matching', 'Automated reminders'],
    useCases: ['Service booking', 'Stylist selection', 'Consulting', 'Waitlist fill'],
  },
  dealership: {
    benefits: ['Instant lead response', 'Book more test drives', 'Lower sales admin'],
    useCases: ['Inventory search', 'Test drives', 'Service slots', 'Finance FAQs'],
  },
  construction: {
    benefits: ['Track site progress', 'Compliance alerts', 'Resource optimization'],
    useCases: ['Project status', 'Checklist flows', 'Equipment logging', 'Daily updates'],
  },
  real_estate: {
    benefits: ['Qualify leads faster', '24/7 listing support', 'Automated showings'],
    useCases: ['Property search', 'Viewing booking', 'Mortgage FAQs', 'Agent handoff'],
  },
  legal: {
    benefits: ['Filter better leads', 'Automate intake', 'Save non-billable hours'],
    useCases: ['Case intake', 'Consult scheduling', 'Doc collection', 'Client FAQs'],
  },
  ecommerce: {
    benefits: ['Reduce support load', 'Boost conversions', 'Fast order answers'],
    useCases: ['Order tracking', 'Returns', 'Recommendations', 'Pre-sales help'],
  },
  education: {
    benefits: ['Increase enrollment', '24/7 student support', 'Faster admissions'],
    useCases: ['Course selection', 'Admissions Q&A', 'Tuition guidance', 'Campus info'],
  },
  recruitment: {
    benefits: ['Faster screening', 'Automated scheduling', 'Better candidate CX'],
    useCases: ['Resume pre-screen', 'Interview scheduling', 'JD Q&A', 'Onboarding'],
  },
};

const TryDemoButton: React.FC<{ agentId: string }> = ({ agentId }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/demos/${agentId}`);
      return;
    }
    navigate(`/demos/${agentId}`);
  };

  return (
    <Button icon={<Play className="h-4 w-4" />} onClick={handleClick}>
      Try Demo
    </Button>
  );
};

export const Agents: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="AI Agents for Business | Industry-Specific Automation | Viktron"
        description="Deploy industry-specific AI agents for restaurants, clinics, salons, dealerships & construction."
        keywords="AI agents for business, industry-specific AI, agentic AI"
        url="/agents"
      />

      <section className="pt-32 pb-12 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deeb] bg-[#f8fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#60718c]">
              <Sparkles className="h-4 w-4 text-[#3768e8]" />
              Industry-Specific Agent Modules
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h1 className="mt-6 text-5xl sm:text-7xl font-semibold tracking-tight text-[#121f35]">
              AI Agents
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-[#52637e] leading-relaxed">
              Production-ready agents configured for real industries. Deploy quickly, keep human control,
              and iterate based on measurable outcomes.
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

      <section className="pb-20 px-4">
        <div className="container-custom">
          <StaggerContainer className="space-y-4">
            {INDUSTRY_AGENTS.map((agent) => {
              const details = agentDetails[agent.id] || { benefits: [], useCases: [] };
              return (
                <StaggerItem key={agent.id}>
                  <motion.article
                    whileHover={{ y: -2 }}
                    className="rounded-3xl border border-[#d8e2ef] bg-white p-5 sm:p-6"
                  >
                    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
                      <div>
                        <div className="flex items-start gap-3">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#d5dfec] bg-[#f7faff]">
                            {agent.icon}
                          </div>
                          <div>
                            <h2 className="text-2xl font-semibold text-[#12223e]">{agent.name}</h2>
                            <p className="text-sm font-medium text-[#3668d2]">{agent.industry}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-[#53637d] leading-relaxed">{agent.description}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {agent.features.map((feature) => (
                            <span
                              key={`${agent.id}-${feature}`}
                              className="rounded-full border border-[#d7e1ef] bg-[#f8fbff] px-2.5 py-1 text-xs text-[#5f7190]"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <TryDemoButton agentId={agent.id} />
                          <Link to="/contact">
                            <Button variant="secondary">Get Quote</Button>
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7084a1]">Benefits</p>
                          <div className="mt-3 space-y-2">
                            {details.benefits.map((benefit) => (
                              <div key={`${agent.id}-${benefit}`} className="flex items-center gap-2 text-sm text-[#253855]">
                                <Check className="h-4 w-4 text-[#2fa781]" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7084a1]">Use Cases</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {details.useCases.map((useCase) => (
                              <span
                                key={`${agent.id}-${useCase}`}
                                className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#2d4f95] border border-[#d6e1f0]"
                              >
                                {useCase}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="rounded-3xl border border-[#d8e2ef] bg-[#f8fbff] p-7 text-center">
              <h2 className="text-3xl font-semibold text-[#12223e] tracking-tight">Need a custom industry build?</h2>
              <p className="mt-3 text-[#52637e] max-w-2xl mx-auto">
                We can combine multiple agent types and automate handoffs across your stack.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/contact">
                  <Button>Talk to an Architect</Button>
                </Link>
                <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2b4d92]">
                  Explore all services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
