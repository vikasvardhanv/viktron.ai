import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';
import { SERVICES } from '../constants';
import type { Service, ServiceCategory } from '../types';

const categoryOrder: ServiceCategory[] = [
  'agents',
  'industry',
  'marketing',
  'automation',
  'consulting',
  'communication',
  'other',
];

const categoryLabels: Record<ServiceCategory, string> = {
  agents: 'AI Agents',
  industry: 'Industry Systems',
  marketing: 'Marketing Engines',
  automation: 'Automation Systems',
  consulting: 'Strategy & Consulting',
  communication: 'Communication',
  other: 'Other Solutions',
};

const routeOverrides: Record<string, string> = {
  industry_agents: '/agents',
  marketing_hub: '/marketing',
  white_label: '/white-label',
  snake: '/snake',
};

const demoRouteMap: Record<string, string> = {
  restaurant: '/demos/restaurant',
  clinic: '/demos/clinic',
  salon: '/demos/salon',
  dealership: '/demos/dealership',
  construction: '/demos/construction',
  whatsapp: '/demos/whatsapp',
  voice: '/demos/voice',
  'business-plan': '/demos/business-plan',
  real_estate: '/demos/real_estate',
  legal: '/demos/legal',
  ecommerce: '/demos/ecommerce',
  education: '/demos/education',
  recruitment: '/demos/recruitment',
  'workflow-automation': '/demos/workflow-automation',
  'data-analytics': '/demos/data-analytics',
  'content-generator': '/demos/content-generator',
  'agent-orchestration': '/demos/agent-orchestration',
  'custom-model': '/demos/custom-model',
  'lead-gen': '/demos/lead-gen',
};

const resolveServiceUrl = (service: Service): string => {
  if (service.externalUrl) return service.externalUrl;
  if (routeOverrides[service.id]) return routeOverrides[service.id];
  if (service.demoId && demoRouteMap[service.demoId]) return demoRouteMap[service.demoId];
  if (service.demoId) return '/demo-form';
  return `/contact?subject=${encodeURIComponent(`Service inquiry: ${service.name}`)}`;
};

const hueByCategory: Record<ServiceCategory, string> = {
  agents: '#3466e3',
  industry: '#2ea884',
  marketing: '#6a7ce8',
  automation: '#3a88db',
  consulting: '#7a63df',
  communication: '#2f9f93',
  other: '#5f7393',
};

const ServiceItem: React.FC<{ service: Service; active: boolean }> = ({ service, active }) => {
  const target = resolveServiceUrl(service);
  const isExternal = Boolean(service.externalUrl);
  const category = service.category ?? 'other';
  const accent = hueByCategory[category];

  const item = (
    <motion.article
      id={service.id}
      whileHover={{ y: -3 }}
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        active
          ? 'border-[#89a8ee] bg-[#edf3ff] shadow-[0_16px_36px_-30px_rgba(41,75,162,0.85)]'
          : 'border-[#d8e2ef] bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d5e0ee] bg-[#f8fbff] text-[#2d4f95]">
          {service.icon}
        </div>
        <div className="flex items-center gap-2">
          {service.highlight ? (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ backgroundColor: `${accent}1a`, color: accent }}
            >
              {service.highlight}
            </span>
          ) : null}
          {isExternal ? <ExternalLink className="h-4 w-4 text-[#7285a4]" /> : null}
        </div>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-[#12223e]">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#53637d]">{service.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(service.features || service.useCases || []).slice(0, 3).map((itemText) => (
          <span
            key={`${service.id}-${itemText}`}
            className="rounded-full border border-[#d7e1ef] bg-[#f8fbff] px-2.5 py-1 text-xs text-[#5f7190]"
          >
            {itemText}
          </span>
        ))}
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: accent }}>
        Explore
        <ArrowRight className="h-4 w-4" />
      </div>
    </motion.article>
  );

  if (isExternal) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" className="block h-full">
        {item}
      </a>
    );
  }

  return (
    <Link to={target} className="block h-full">
      {item}
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
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [serviceId]);

  const grouped = visibleServices.reduce<Record<ServiceCategory, Service[]>>(
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

  const categories = categoryOrder.filter((category) => grouped[category].length > 0);

  return (
    <Layout>
      <SEO
        title="AI Services for Business | Viktron"
        description="Explore Viktron services: AI agents, automation systems, growth marketing, integrations, and consulting."
        keywords="AI services, automation, AI agents, business AI, growth systems"
        url="/services"
      />

      <section className="pt-32 pb-12 px-4">
        <div className="container-custom">
          <div className="card p-6 md:p-8">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deeb] bg-[#f8fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#60718c]">
                <Sparkles className="h-4 w-4 text-[#3768e8]" />
                Service Architecture
              </div>
            </AnimatedSection>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
              <AnimatedSection delay={0.08}>
                <h1 className="text-5xl sm:text-6xl font-semibold text-[#141f33] tracking-tight leading-[0.98]">
                  Services built for
                  <br />
                  practical operators.
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#4f607b]">
                  Each lane is implementation-ready. Pick your path, connect your stack, and run
                  measurable AI operations without heavy rebuild cycles.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/demo-form">
                    <Button>Book a Demo</Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="secondary">Talk to an Architect</Button>
                  </Link>
                </div>
              </AnimatedSection>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-5"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-[#7084a1]">Execution Snapshot</p>
                <div className="mt-4 space-y-3">
                  {['Channel + CRM mapping', 'Workflow orchestration', 'Monitoring + optimization'].map((item, idx) => (
                    <div key={item} className="rounded-xl border border-[#d8e2ef] bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-[#1a2d4b]">0{idx + 1}</p>
                      <p className="mt-1 text-sm text-[#54647f]">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {categories.map((category) => (
        <section key={category} className="pb-10 px-4">
          <div className="container-custom">
            <AnimatedSection>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-semibold text-[#12223e] tracking-tight">
                    {categoryLabels[category]}
                  </h2>
                  <div
                    className="mt-2 h-[3px] w-24 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${hueByCategory[category]}, #8eb3ff)` }}
                  />
                </div>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {grouped[category].map((service) => (
                <StaggerItem key={service.id}>
                  <ServiceItem service={service} active={serviceId === service.id} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ))}
    </Layout>
  );
};
