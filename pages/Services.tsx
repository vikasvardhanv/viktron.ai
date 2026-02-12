import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { SERVICES } from '../constants';
import type { Service, ServiceCategory } from '../types';

const CATEGORY_ORDER: ServiceCategory[] = [
  'agents',
  'industry',
  'marketing',
  'automation',
  'consulting',
  'communication',
  'other',
];

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  agents: 'AI Agents',
  industry: 'Industry Systems',
  marketing: 'Marketing Engines',
  automation: 'Automation Pipelines',
  consulting: 'Strategy & Advisory',
  communication: 'Customer Communication',
  other: 'Additional Services',
};

const ROUTE_OVERRIDES: Record<string, string> = {
  industry_agents: '/agents',
  marketing_hub: '/marketing',
  white_label: '/white-label',
  snake: '/snake',
};

const resolveServiceUrl = (service: Service): string => {
  if (service.externalUrl) return service.externalUrl;
  if (ROUTE_OVERRIDES[service.id]) return ROUTE_OVERRIDES[service.id];
  if (service.demoId) return `/demos/${service.demoId}`;
  return `/contact?subject=${encodeURIComponent(`Service inquiry: ${service.name}`)}`;
};

const ServiceCard: React.FC<{ service: Service; isFocused: boolean }> = ({ service, isFocused }) => {
  const target = resolveServiceUrl(service);
  const isExternal = Boolean(service.externalUrl);

  const card = (
    <GlassCard className={`h-full p-6 border ${isFocused ? 'border-lime-300/50 bg-[#1a2333]' : 'border-[#2d3a52]'}`}>
      <div className="h-full flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="text-lime-200">{service.icon}</div>
          <div className="flex items-center gap-2">
            {service.highlight ? (
              <span className="rounded-full border border-[#4a5b3a] bg-[#1d2517] px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-lime-200">
                {service.highlight}
              </span>
            ) : null}
            {isExternal ? <ExternalLink className="h-4 w-4 text-slate-400" /> : null}
          </div>
        </div>

        <h3 className="mt-4 text-xl font-medium text-white">{service.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300 flex-grow">{service.description}</p>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-lime-200">
          Explore
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </GlassCard>
  );

  if (isExternal) {
    return (
      <a id={service.id} href={target} target="_blank" rel="noopener noreferrer" className="block h-full">
        {card}
      </a>
    );
  }

  return (
    <Link id={service.id} to={target} className="block h-full">
      {card}
    </Link>
  );
};

export const Services: React.FC = () => {
  const { serviceId } = useParams();
  const visibleServices = SERVICES.filter((service) => service.id !== 'snake');

  useEffect(() => {
    if (!serviceId) return;
    requestAnimationFrame(() => {
      const target = document.getElementById(serviceId);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [serviceId]);

  const servicesByCategory = visibleServices.reduce<Record<ServiceCategory, Service[]>>(
    (acc, service) => {
      const category = service.category ?? 'other';
      acc[category].push(service);
      return acc;
    },
    {
      agents: [],
      industry: [],
      marketing: [],
      automation: [],
      consulting: [],
      communication: [],
      other: [],
    }
  );

  const orderedCategories = CATEGORY_ORDER.filter((category) => servicesByCategory[category].length > 0);

  return (
    <Layout>
      <SEO
        title="AI Services for Business | Viktron"
        description="Explore Viktron services: AI agents, automation systems, growth marketing, integrations, and consulting."
        keywords="AI services, automation, AI agents, business AI, growth systems"
        url="/services"
      />

      <section className="pt-32 pb-16 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#38455e] bg-[#171f2d] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
              <Sparkles className="h-4 w-4 text-lime-200" />
              Delivery Blueprints
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="mt-6 text-5xl sm:text-6xl font-semibold text-white tracking-tight">Services</h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="mt-5 max-w-3xl text-lg text-slate-300 leading-relaxed">
              Every service module is implementation-ready. Pick the stack that fits your timeline
              and we ship architecture, delivery, and optimization together.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/demo-form">
                <Button>Book a Demo</Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary">Talk to an Architect</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {orderedCategories.map((category) => (
        <section key={category} className="px-4 py-10">
          <div className="container-custom">
            <AnimatedSection>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-medium text-white">{CATEGORY_LABELS[category]}</h2>
                <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-lime-300 to-emerald-300" />
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {servicesByCategory[category].map((service) => (
                <AnimatedSection key={service.id} direction="up">
                  <ServiceCard service={service} isFocused={serviceId === service.id} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ))}
    </Layout>
  );
};
