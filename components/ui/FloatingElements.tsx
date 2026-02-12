import React, { memo } from 'react';

// Floating orbs - disabled for professional design
export const FloatingOrbs: React.FC = memo(() => {
  return null;
});
FloatingOrbs.displayName = 'FloatingOrbs';

// Grid background pattern - disabled for clean surface
export const GridPattern: React.FC<{ className?: string }> = memo(({ className = '' }) => {
  return null;
});
GridPattern.displayName = 'GridPattern';

// Animated particles - disabled
export const Particles: React.FC<{ count?: number }> = memo(({ count = 15 }) => {
  return null;
});
Particles.displayName = 'Particles';

// Gradient text component - converted to standard text
export const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}> = memo(({
  children,
  className = '',
  gradient // Ignored
}) => {
  return (
    <span className={`text-slate-900 ${className}`}>
      {children}
    </span>
  );
});
GradientText.displayName = 'GradientText';

// Animated counter
export const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  className?: string;
}> = memo(({ value, suffix = '', className = '' }) => {
  return (
    <span className={className}>
      {value}{suffix}
    </span>
  );
});
AnimatedCounter.displayName = 'AnimatedCounter';
