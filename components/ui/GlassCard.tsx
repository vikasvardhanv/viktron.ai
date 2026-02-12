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
  const glowClass = glow
    ? {
        sky: 'shadow-[0_18px_45px_rgba(56,189,248,0.14)]',
        indigo: 'shadow-[0_18px_45px_rgba(99,102,241,0.15)]',
        emerald: 'shadow-[0_18px_45px_rgba(16,185,129,0.14)]',
      }[glowColor] || 'shadow-[0_18px_45px_rgba(56,189,248,0.14)]'
    : '';

  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'card',
        glowClass,
        (onClick || href) && 'cursor-pointer transition-all duration-200',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={tilt ? { y: -6, rotateX: 1.2, rotateY: -1.2 } : { y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ transformStyle: tilt ? 'preserve-3d' : 'flat' }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
