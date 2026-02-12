import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  variant?: 'default' | 'surface';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  delay = 0,
  hover = true,
  variant = 'default',
}) => {
  const baseClasses = variant === 'surface' 
    ? 'bg-gray-50 border border-gray-200'
    : 'bg-white border border-gray-200';

  return (
    <motion.div
      className={clsx(
        baseClasses,
        'rounded-lg p-6 transition-all duration-200',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hover ? {
        y: -2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderColor: 'rgb(124, 58, 237)',
      } : {}}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedGlassCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  onClick?: () => void;
}

export const AnimatedGlassCard: React.FC<AnimatedGlassCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
  onClick,
}) => {
  return (
    <AnimatedCard delay={delay} className="cursor-pointer group" onClick={onClick}>
      <div className="space-y-3">
        {icon && (
          <motion.div
            className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"
          >
            {icon}
          </motion.div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </AnimatedCard>
  );
};
