import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { X, Cookie, Shield, BarChart3, Target, Settings, Check } from 'lucide-react';

interface CookieCategory {
  id: 'necessary' | 'analytics' | 'marketing' | 'preferences';
  name: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Necessary Cookies',
    description: 'Essential for the website to function properly. These cookies enable core functionality such as security, authentication, and accessibility. They cannot be disabled.',
    icon: <Shield className="h-5 w-5" />,
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website. We use this data to improve our services and user experience. Data is anonymized.',
    icon: <BarChart3 className="h-5 w-5" />,
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to deliver relevant advertisements and track ad campaign performance. These cookies may be set by our advertising partners.',
    icon: <Target className="h-5 w-5" />,
    required: false,
  },
  {
    id: 'preferences',
    name: 'Preference Cookies',
    description: 'Allow the website to remember your preferences such as language, theme, and other customizations for a better experience.',
    icon: <Settings className="h-5 w-5" />,
    required: false,
  },
];

export const CookiePreferences: React.FC = () => {
  const { showPreferences, setShowPreferences, consent, savePreferences, acceptAll, rejectAll } = useCookieConsent();

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Sync with current consent on open
  useEffect(() => {
    if (showPreferences) {
      setPreferences({
        necessary: true,
        analytics: consent.analytics,
        marketing: consent.marketing,
        preferences: consent.preferences,
      });
    }
  }, [showPreferences, consent]);

  const handleToggle = (category: 'analytics' | 'marketing' | 'preferences') => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPreferences(false);
    };
    if (showPreferences) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showPreferences, setShowPreferences]);

  return (
    <AnimatePresence>
      {showPreferences && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPreferences(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative obsidian-panel p-8 shadow-2xl overflow-hidden group">
              <div className="scan-line opacity-10" />
              
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 obsidian-inset border border-white/5 text-primary">
                    <Cookie className="h-6 w-6 text-glow" />
                  </div>
                  <div>
                    <div className="section-label !mb-0">SYSTEM_PREFERENCES // COOKIES</div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Cookie Preferences</h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 rounded-none hover:bg-white/5 transition-colors text-zinc-500 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-zinc-500 text-[11px] font-mono uppercase tracking-widest leading-relaxed mb-8 max-w-2xl">
                We use cookies to enhance your experience. You can choose which categories of cookies you want to allow.
                For more information, please read our{' '}
                <Link to="/cookies" className="text-primary hover:underline" onClick={() => setShowPreferences(false)}>
                  [COOKIE_POLICY]
                </Link>.
              </p>

              {/* Cookie Categories */}
              <div className="space-y-4 mb-10">
                {cookieCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-6 obsidian-inset border transition-all ${
                      preferences[category.id]
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`p-3 obsidian-panel border ${
                        preferences[category.id] ? 'border-primary/50 text-primary' : 'border-white/5 text-zinc-600'
                      }`}>
                        {category.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <h3 className={`font-bold uppercase tracking-tighter transition-colors ${
                            preferences[category.id] ? 'text-white' : 'text-zinc-500'
                          }`}>{category.name}</h3>

                          {category.required ? (
                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-primary px-3 py-1 obsidian-panel border border-primary/20">
                              ALWAYS_ACTIVE
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggle(category.id as 'analytics' | 'marketing' | 'preferences')}
                              className={`relative w-12 h-6 transition-all duration-300 ${
                                preferences[category.id] ? 'bg-primary' : 'bg-zinc-800'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-300 ${
                                  preferences[category.id] ? 'translate-x-6 bg-black' : 'translate-x-0 bg-zinc-500'
                                }`}
                              />
                            </button>
                          )}
                        </div>
                        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest leading-relaxed">{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={rejectAll}
                  className="flex-1 px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptAll}
                  className="btn-obsidian flex-1 !py-4"
                >
                  Accept All
                </button>
                <button 
                  onClick={handleSave} 
                  className="btn-acid flex-1 !py-4 flex items-center justify-center gap-3"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Preferences
                </button>
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
