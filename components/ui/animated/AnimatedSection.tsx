import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedGradientBgProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedGradientBg: React.FC<AnimatedGradientBgProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

interface AnimatedHeadingProps {
  children: React.ReactNode;
  gradient?: boolean;
  className?: string;
  delay?: number;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  children,
  gradient = false,
  className = '',
  delay = 0,
  level = 'h1',
}) => {
  const Tag = level as any;
  const baseClasses = `font-bold ${className}`;
  const gradientClass = gradient ? 'text-gradient' : '';

  return (
    <Tag className={`${baseClasses} ${gradientClass}`}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        {children}
      </motion.span>
    </Tag>
  );
};

interface AnimatedSubheadingProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSubheading: React.FC<AnimatedSubheadingProps> = ({
  children,
  className = '',
  delay = 0.1,
}) => {
  return (
    <motion.p
      className={`text-lg text-gray-600 leading-relaxed ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.p>
  );
};
