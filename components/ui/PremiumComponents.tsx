/**
 * Premium Component Library
 * Production-ready, accessible, animated components
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// ─────────────────────────────────
// BUTTONS
// ─────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-emerald-500 text-slate-900 hover:bg-emerald-600 active:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-semibold',
    secondary: 'bg-slate-800 text-slate-50 border border-slate-700 hover:border-slate-600 hover:bg-slate-700 active:bg-slate-600',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 active:bg-slate-700/50',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`btn inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};

// ─────────────────────────────────
// CARDS
// ─────────────────────────────────

interface CardProps {
  children: ReactNode;
  interactive?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, interactive = false, className = '' }) => {
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02 } : undefined}
      className={`card rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl shadow-xl shadow-black/20 p-6 transition-all duration-300 hover:border-emerald-500/30 ${interactive ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────
// BADGES
// ─────────────────────────────────

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-800/50 text-slate-200 border border-slate-700/50',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    error: 'bg-red-500/10 text-red-400 border border-red-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ─────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  eyebrow, 
  title, 
  description, 
  centered = true 
}) => {
  return (
    <div className={centered ? 'text-center mb-12 lg:mb-16' : 'mb-12 lg:mb-16'}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm mb-4"
        >
          <span className="text-xs font-medium text-emerald-400">{eyebrow}</span>
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

// ─────────────────────────────────
// FEATURE GRID
// ─────────────────────────────────

interface FeatureProps {
  icon?: ReactNode;
  title: string;
  description: string;
  cta?: string;
  href?: string;
}

interface FeatureGridProps {
  features: FeatureProps[];
  columns?: 1 | 2 | 3 | 4;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ features, columns = 3 }) => {
  const colMap = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 lg:gap-8 ${colMap[columns]}`}>
      {features.map((feature, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="group"
        >
          <Card interactive={!!feature.href} className="h-full">
            {feature.icon && (
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                  {feature.icon}
                </div>
              </div>
            )}
            <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm mb-4 flex-grow">{feature.description}</p>
            {feature.cta && (
              <a href={feature.href || '#'} className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                {feature.cta}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// ─────────────────────────────────
// STAT CARD
// ─────────────────────────────────

interface StatCardProps {
  value: string | number;
  label: string;
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, suffix }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="font-mono text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
        {value}
        {suffix && <span className="text-lg ml-1">{suffix}</span>}
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </motion.div>
  );
};

// ─────────────────────────────────
// GLASS CONTAINER
// ─────────────────────────────────

interface GlassContainerProps {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  accent = false, 
  className = '' 
}) => {
  return (
    <div className={`
      rounded-xl backdrop-blur-xl p-6 md:p-8 lg:p-12
      border transition-all duration-300
      ${accent 
        ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30' 
        : 'bg-white/5 border-white/10 hover:border-white/20'
      }
      ${className}
    `}>
      {children}
    </div>
  );
};

// ─────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────

export const Skeleton: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}) => {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`bg-slate-700/50 rounded ${width} ${height} ${className}`}
    />
  );
};
