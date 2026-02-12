import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Globe, Palette, Zap, Code, Users, BarChart3, Settings } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

type WhiteLabelServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartBuilding?: () => void;
};

interface WhiteLabelFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WHITELABEL_FEATURES: WhiteLabelFeature[] = [
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Custom Domain',
    description: 'Deploy on your own domain with complete branding control',
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Brand Customization',
    description: 'Customize colors, logo, and design to match your brand',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Voice & Chat Agents',
    description: 'Deploy custom AI agents tailored to your business needs',
  },
  {
    icon: <Code className="w-5 h-5" />,
    title: 'API Access',
    description: 'Full API access for deep integration with your systems',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Team Management',
    description: 'Manage multiple team members and administrators',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Analytics & Reporting',
    description: 'Detailed insights into your AI agent performance',
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$299',
    period: '/month',
    description: 'Perfect for small businesses',
    features: [
      'Up to 3 custom agents',
      '10,000 messages/month',
      'Basic analytics',
      'Email support',
      'Custom domain',
    ],
  },
  {
    name: 'Professional',
    price: '$799',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Up to 10 custom agents',
      '50,000 messages/month',
      'Advanced analytics',
      'Priority support',
      'Custom domain + SSL',
      'API access',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For large-scale deployments',
    features: [
      'Unlimited agents',
      'Unlimited messages',
      'Custom integrations',
      '24/7 dedicated support',
      'White-label dashboard',
      'SLA guarantee',
    ],
  },
];

export const WhiteLabelServiceModal: React.FC<WhiteLabelServiceModalProps> = ({
  isOpen,
  onClose,
  onStartBuilding,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'features' | 'pricing'>('features');

  // Check authentication when modal opens
  React.useEffect(() => {
    if (isOpen && !isAuthenticated) {
      setShowAuthModal(true);
      onClose();
    }
  }, [isOpen, isAuthenticated, setShowAuthModal, onClose]);

  if (!isOpen || !isAuthenticated) return null;

  const handleStartBuilding = () => {
    onStartBuilding?.();
    onClose();
    navigate('/white-label');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="p-8" tilt={false}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
                  <Globe className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-white">White Label AI Service</h2>
              </div>
              <p className="text-white/60 max-w-2xl">
                Launch your own AI agent platform with complete branding control. Perfect for agencies,
                consultants, and enterprises looking to offer AI solutions under their brand.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/10">
              <button
                onClick={() => setActiveTab('features')}
                className={`px-4 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'features'
                    ? 'text-sky-400 border-sky-400'
                    : 'text-white/60 border-transparent hover:text-white/80'
                }`}
              >
                Features & Benefits
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-3 font-medium transition-all border-b-2 ${
                  activeTab === 'pricing'
                    ? 'text-sky-400 border-sky-400'
                    : 'text-white/60 border-transparent hover:text-white/80'
                }`}
              >
                Pricing Plans
              </button>
            </div>

            {/* Features Tab */}
            {activeTab === 'features' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {WHITELABEL_FEATURES.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-sky-500/30 hover:bg-white/10 transition-all group"
                    >
                      <div className="text-sky-400 mb-3 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-white/60">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Key Benefits */}
                <div className="p-6 rounded-lg bg-gradient-to-r from-sky-500/10 to-purple-500/10 border border-sky-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-sky-400" />
                    Key Benefits
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {[
                      'Generate recurring revenue from AI agents',
                      'Maintain complete brand control',
                      'Fast deployment in days, not months',
                      'Dedicated technical support',
                      'Scalable infrastructure for growth',
                      'Regular feature updates included',
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-white/80">
                        <span className="text-sky-400 mt-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleStartBuilding}
                    size="lg"
                    icon={<Settings className="h-5 w-5" />}
                  >
                    Start Building Your White Label
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  {PRICING_TIERS.map((tier, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-lg border transition-all ${
                        tier.highlighted
                          ? 'bg-sky-500/10 border-sky-500/50 ring-2 ring-sky-500/20'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {tier.highlighted && (
                        <div className="mb-4 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          Most Popular
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                      <p className="text-white/60 text-sm mb-4">{tier.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-white">{tier.price}</span>
                        <span className="text-white/60 text-sm ml-1">{tier.period}</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                            <span className="text-sky-400">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={tier.highlighted ? 'primary' : 'secondary'}
                        onClick={handleStartBuilding}
                        className="w-full"
                      >
                        {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* FAQ or Additional Info */}
                <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    What's Included in All Plans?
                  </h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">•</span>
                      AI-powered agents (voice, chat, SMS, email)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">•</span>
                      Complete white-label branding
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">•</span>
                      Custom domain setup and SSL
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">•</span>
                      Regular platform updates and improvements
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-400">•</span>
                      Comprehensive documentation and API reference
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
