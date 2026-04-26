import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureGridProps {
  title: string;
  subtitle?: string;
  features: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
  columns?: 2 | 3 | 4;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  title,
  subtitle,
  features,
  columns = 3,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <section className="relative w-full py-20 md:py-32 bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-slate-400">{subtitle}</p>}
        </div>

        {/* Feature grid */}
        <div className={`grid gap-6 grid-cols-1 ${gridCols[columns]}`}>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3">
                  <Icon className="h-6 w-6 text-emerald-500" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface StatsProps {
  stats: Array<{
    value: string;
    label: string;
    suffix?: string;
  }>;
}

export const StatsSection: React.FC<StatsProps> = ({ stats }) => {
  return (
    <section className="w-full py-16 md:py-24 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2">
                {stat.value}
                {stat.suffix && <span className="text-xl text-slate-500">{stat.suffix}</span>}
              </div>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface PricingTierProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    href: string;
  };
  highlighted?: boolean;
}

export const PricingCard: React.FC<PricingTierProps> = ({
  name,
  price,
  period = '/month',
  description,
  features,
  cta,
  highlighted = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative rounded-xl border p-8 transition-all duration-300 ${
        highlighted
          ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-slate-800/50 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-500/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500/90 text-xs font-semibold text-white">
          Most Popular
        </div>
      )}

      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-sm text-slate-400 mb-6">{description}</p>

      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        {period && <span className="text-sm text-slate-400 ml-2">{period}</span>}
      </div>

      <a
        href={cta.href}
        className={`block w-full py-2.5 px-4 rounded-lg font-medium text-center transition-all duration-200 mb-8 ${
          highlighted
            ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-600'
            : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
        }`}
      >
        {cta.label}
      </a>

      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

interface CTABoxProps {
  title: string;
  subtitle: string;
  cta: {
    label: string;
    href: string;
  };
  secondary?: {
    label: string;
    href: string;
  };
}

export const CTABox: React.FC<CTABoxProps> = ({ title, subtitle, cta, secondary }) => {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-400 mb-8">{subtitle}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={cta.href}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/25"
            >
              {cta.label}
            </a>
            {secondary && (
              <a
                href={secondary.href}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white transition-all duration-200"
              >
                {secondary.label}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
