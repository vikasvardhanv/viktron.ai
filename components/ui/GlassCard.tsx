import React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
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

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  href,
  tilt = false,
  glow = true,
  glowColor = 'sky',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const transform = useMotionTemplate`perspective(1000px) rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;
  const gradientBackground = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(79, 140, 255, 0.16) 0%, transparent 55%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);

    if (!tilt) return;

    const rX = ((mouseYPos / height) * ROTATION_RANGE - HALF_ROTATION_RANGE) * -1;
    const rY = (mouseXPos / width) * ROTATION_RANGE - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowColors: Record<string, string> = {
    sky: 'group-hover:shadow-blue-500/20',
    purple: 'group-hover:shadow-indigo-500/20',
    emerald: 'group-hover:shadow-cyan-500/20',
    rose: 'group-hover:shadow-slate-400/20',
    amber: 'group-hover:shadow-blue-400/20',
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: tilt ? transform : undefined }}
      className={clsx(
        'relative group rounded-2xl bg-[#121621] border border-white/10',
        'transition-all duration-300',
        'hover:border-white/20 hover:-translate-y-0.5',
        glow && `hover:shadow-2xl ${glowColors[glowColor]}`,
        className
      )}
    >
      {/* Gradient overlay on hover */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: gradientBackground }}
        />
      )}

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
};
