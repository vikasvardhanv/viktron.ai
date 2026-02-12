import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection } from '../components/ui/AnimatedSection';
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

const VISUALS = [
  '/visuals/panel-a.svg',
  '/visuals/panel-b.svg',
  '/visuals/panel-c.svg',
  '/visuals/panel-d.svg',
];

const VISUAL_BY_SERVICE: Record<string, string> = {
  chatbot: '/visuals/panel-a.svg',
  voice_agent: '/visuals/panel-c.svg',
  video_agent: '/visuals/panel-b.svg',
  automation: '/visuals/panel-d.svg',
  workflow_automation: '/visuals/panel-d.svg',
  marketing_hub: '/visuals/panel-b.svg',
  data_analytics: '/visuals/panel-a.svg',
};

const resolveServiceUrl = (service: Service): string => {
  if (service.externalUrl) return service.externalUrl;
  if (ROUTE_OVERRIDES[service.id]) return ROUTE_OVERRIDES[service.id];
  if (service.demoId) return `/demos/${service.demoId}`;
  return `/contact?subject=${encodeURIComponent(`Service inquiry: ${service.name}`)}`;
};

const getServiceVisual = (service: Service, index: number) => {
  return VISUAL_BY_SERVICE[service.id] || VISUALS[index % VISUALS.length];
};

const TILE_PATTERN = [
  'md:col-span-7 md:row-span-2',
  'md:col-span-5',
  'md:col-span-5',
  'md:col-span-7',
  'md:col-span-4',
  'md:col-span-4',
  'md:col-span-4',
];

const getTileClass = (index: number) => TILE_PATTERN[index % TILE_PATTERN.length];

const ServiceTile: React.FC<{ service: Service; index: number; isFocused: boolean }> = ({
  service,
  index,
  isFocused,
}) => {
  const target = resolveServiceUrl(service);
  const isExternal = Boolean(service.externalUrl);
  const tileClass = getTileClass(index);
  const background = getServiceVisual(service, index);

  const tile = (
    <motion.article
      whileHover={{ y: -3 }}
      className={`group relative overflow-hidden rounded-[28px] border h-full min-h-[210px] ${tileClass} ${
        isFocused ? 'border-lime-400 shadow-[0_0_0_1px_rgba(163,230,53,0.6)]' : 'border-[#d0d7e1]'
      }`}
      id={service.id}
    >
      <img
        src={background}
        alt={service.name}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />

      <div className="relative z-10 flex h-full flex-col p-6 md:p-7">
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-xl bg-black/35 p-2.5 text-[#dfffa0] border border-white/20">
            {service.icon}
          </div>
          <div className="flex items-center gap-2">
            {service.highlight ? (
              <span className="rounded-full bg-[#e8ff9f]/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1c2a1f]">
                {service.highlight}
              </span>
            ) : null}
            {isExternal ? <ExternalLink className="h-4 w-4 text-white/85" /> : null}
          </div>
        </div>

        <div className="mt-auto">
          <h3 className="text-2xl md:text-[1.7rem] font-medium text-white leading-tight">{service.name}</h3>
          <p className="mt-3 text-sm md:text-[0.95rem] leading-relaxed text-slate-200/95 max-w-[42ch]">
            {service.description}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#dfff8d] uppercase tracking-[0.09em]">
            Explore
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.article>
  );

  if (isExternal) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" className="block h-full">
        {tile}
      </a>
    );
  }

  return (
    <Link to={target} className="block h-full">
      {tile}
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

      <section className="pt-32 pb-12 px-4">
        <div className="container-custom">
          <div className="rounded-[34px] border border-[#d1d8e2] bg-[#ecf0f4] p-6 md:p-8">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c6ceda] bg-[#f6f8fb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4c5668]">
                <Sparkles className="h-4 w-4 text-[#3a7a61]" />
                Designed Like a Product Workspace
              </div>
            </AnimatedSection>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
              <AnimatedSection delay={0.08}>
                <h1 className="text-5xl sm:text-6xl font-semibold text-[#141924] tracking-tight leading-[0.98]">
                  Services
                  <br />
                  built for real operators.
                </h1>
                <p className="mt-5 max-w-2xl text-[#3c4657] text-lg leading-relaxed">
                  Every module below is implementation-ready. Choose your lane, launch fast, and
                  keep iterating with measurable outcomes.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
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
                className="relative overflow-hidden rounded-[26px] border border-[#cfd7e2] min-h-[250px]"
              >
                <img src="/visuals/panel-b.svg" alt="Services preview" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#d0ff86]">Live Architecture Layer</p>
                  <p className="mt-2 text-white text-lg font-medium">
                    Compose agents, workflows, and channel integrations in one surface.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {orderedCategories.map((category) => (
        <section key={category} className="px-4 py-9">
          <div className="container-custom">
            <div className="rounded-[34px] border border-[#cfd7e2] bg-[#ecf0f4] p-6 md:p-8">
              <AnimatedSection>
                <div className="mb-7">
                  <h2 className="text-3xl sm:text-4xl font-medium text-[#151b27]">{CATEGORY_LABELS[category]}</h2>
                  <div className="mt-3 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#dfff8d] to-[#4ab985]" />
                </div>
              </AnimatedSection>

              <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[220px] md:auto-rows-[180px] gap-5">
                {servicesByCategory[category].map((service, index) => (
                  <ServiceTile key={service.id} service={service} index={index} isFocused={serviceId === service.id} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </Layout>
  );
};
