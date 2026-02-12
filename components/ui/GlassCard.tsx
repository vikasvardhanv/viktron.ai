import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  tilt?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  href,
  tilt = false, 
  glow = true, 
  glowColor = 'sky', 
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'card', 
        onClick && 'cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
