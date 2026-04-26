import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctas?: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
  image?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({
  eyebrow,
  title,
  subtitle,
  ctas = [],
  image,
}) => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24 md:py-32">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Animated background orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent 70%)' }}
        animate={{ scale: [1.1, 1, 1.1], rotate: [360, 180, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="relative mx-auto max-w-5xl px-6 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow */}
        {eyebrow && (
          <motion.div variants={item}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-400">{eyebrow}</span>
            </div>
          </motion.div>
        )}

        {/* Main title */}
        <motion.h1
          variants={item}
          className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-6"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* CTAs */}
        {ctas.length > 0 && (
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {ctas.map((cta, idx) => (
              <a
                key={idx}
                href={cta.href}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  cta.variant === 'primary'
                    ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
                    : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cta.label}
                {cta.variant === 'primary' && <ArrowRight className="h-4 w-4" />}
              </a>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Image section */}
      {image && (
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          className="relative mt-16 mx-auto max-w-5xl px-6"
        >
          <div className="rounded-xl border border-slate-700/50 overflow-hidden bg-slate-900/30 shadow-2xl">
            {image}
          </div>
        </motion.div>
      )}
    </section>
  );
};
