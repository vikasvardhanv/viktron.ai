import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  interactive?: boolean;
  variant?: 'default' | 'surface';
}

export const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  AnimatedCardProps
>(
  (
    {
      children,
      className,
      delay = 0,
      interactive = true,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-white border-slate-200',
      surface: 'bg-slate-50 border-slate-200',
    };

    return (
      <motion.div
        ref={ref}
        className={`card ${variantClasses[variant]} ${className || ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        whileHover={
          interactive
            ? {
                y: -2,
                borderColor: 'rgb(59, 130, 246)',
              }
            : {}
        }
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

interface AnimatedFeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  onClick?: () => void;
}

export const AnimatedFeatureCard: React.FC<AnimatedFeatureCardProps> = ({
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
          <motion.div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {icon}
          </motion.div>
        )}
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </AnimatedCard>
  );
};
