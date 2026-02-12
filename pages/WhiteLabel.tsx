import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { HypeyPlatformBuilder } from '../components/HypeyPlatformBuilder';
import { HypeyLandingPagePreview } from '../components/HypeyLandingPagePreview';

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

export const WhiteLabel: React.FC = () => {
  const [generatedPlatform, setGeneratedPlatform] = useState<PlatformConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePlatformGenerated = (config: PlatformConfig) => {
    setGeneratedPlatform(config);
  };

  const handleShowPreview = () => {
    if (generatedPlatform) {
      setShowPreview(true);
    }
  };

  const handleBackToBuilder = () => {
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Back to Home - Only show when not in preview */}
      {!showPreview && (
        <div className="absolute top-6 left-6 z-50">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col"
          >
            <HypeyPlatformBuilder onPlatformGenerated={handlePlatformGenerated} />

            {/* Floating preview button */}
            {generatedPlatform && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 right-8 z-50"
              >
                <button
                  onClick={handleShowPreview}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold shadow-2xl hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
                >
                  <span>🎨</span>
                  Preview Landing Page
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {generatedPlatform && (
              <HypeyLandingPagePreview
                config={generatedPlatform}
                onBack={handleBackToBuilder}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
