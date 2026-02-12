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
        sky: 'shadow-[0_16px_34px_rgba(71,187,135,0.12)]',
        indigo: 'shadow-[0_16px_34px_rgba(217,255,114,0.1)]',
        emerald: 'shadow-[0_16px_34px_rgba(71,187,135,0.16)]',
      }[glowColor] || 'shadow-[0_16px_34px_rgba(71,187,135,0.12)]'
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
      whileHover={tilt ? { y: -4, rotateX: 0.8, rotateY: -0.8 } : { y: -3 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ transformStyle: tilt ? 'preserve-3d' : 'flat' }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
