import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Globe, MessageSquare, Bot } from 'lucide-react';

interface PlatformConfig {
  sector?: string;
  targetAudience?: string;
  automationType?: string;
  platformName?: string;
  subdomain?: string;
  tagline?: string;
  description?: string;
  color?: string;
  pricing?: number;
  logo?: string;
}

interface HypeyLandingPagePreviewProps {
  config: PlatformConfig;
  onBack?: () => void;
}

export const HypeyLandingPagePreview: React.FC<HypeyLandingPagePreviewProps> = ({
  config,
  onBack,
}) => {
  const primaryColor = config.color || '#0B0BA8';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
      {/* Back button */}
      {onBack && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white border border-white/10 transition-all"
          >
            ← Back to Builder
          </button>
        </div>
      )}

      {/* Preview Label */}
      <div className="fixed top-4 right-4 z-50">
        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Preview Mode
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/10 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: primaryColor + '30' }}
            >
              {config.logo || '🤖'}
            </div>
            <span className="text-xl font-bold text-white">{config.platformName}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#home" className="text-white/80 hover:text-white transition-colors">
              Home
            </a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">
              Pricing
            </a>
            <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
              Sign in
            </button>
            <button
              className="px-4 py-2 rounded-lg text-white font-semibold transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20" id="home">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm"
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Assistants & Agents
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl font-bold text-white leading-tight"
          >
            {config.tagline?.split(',')[0] || config.tagline}
            <br />
            <span
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${primaryColor}, ${adjustColor(
                  primaryColor,
                  40
                )})`,
              }}
            >
              {config.platformName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/60 max-w-3xl mx-auto"
          >
            {config.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <button
              className="px-8 py-4 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              Get Started
            </button>
            <button className="px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all border border-white/10">
              Learn More
            </button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: primaryColor + '30' }}
              >
                <Bot className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Agents</h3>
              <p className="text-white/60 text-sm">
                Intelligent agents that work 24/7 to handle your business operations
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: primaryColor + '30' }}
              >
                <Zap className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Automation</h3>
              <p className="text-white/60 text-sm">
                Streamline workflows and eliminate repetitive tasks automatically
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: primaryColor + '30' }}
              >
                <Globe className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Integrations</h3>
              <p className="text-white/60 text-sm">
                Connect with your favorite tools and platforms seamlessly
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20" id="pricing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Pricing</h2>
          <p className="text-xl text-white/60">
            Simple, transparent pricing for your needs. No hidden fees, no surprises.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div
            className="p-8 rounded-2xl border-2 shadow-2xl relative overflow-hidden"
            style={{ borderColor: primaryColor }}
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, transparent 100%)`,
              }}
            />

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-white/60">
                  Everything you need to start using smart AI agents — no complexity, just results.
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-white">${config.pricing}</span>
                  <span className="text-white/60">/seat/mo</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited Premium AI Usage',
                  '24/7 AI Agent Support',
                  'Advanced Analytics',
                  'Custom Integrations',
                  'Priority Support',
                  'Regular Updates',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: primaryColor }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-4 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: primaryColor + '30' }}
              >
                {config.logo || '🤖'}
              </div>
              <div>
                <p className="text-white font-semibold">{config.platformName}</p>
                <p className="text-white/40 text-sm">
                  {config.platformName} offers smart AI solutions to simplify your daily tasks,
                  boost productivity, and unlock creativity. Powered by intelligent agents. Built for
                  you.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <a href="#pricing" className="text-white/60 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Docs
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © 2026 {config.platformName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const clamp = (num: number) => Math.min(Math.max(num, 0), 255);

  const num = parseInt(color.replace('#', ''), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00ff) + amount);
  const b = clamp((num & 0x0000ff) + amount);

  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
