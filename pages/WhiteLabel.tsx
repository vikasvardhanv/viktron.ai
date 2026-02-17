import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Eye } from 'lucide-react';
import { HypeyLandingPagePreview } from '../components/HypeyLandingPagePreview';
import { HypeyPlatformBuilder } from '../components/HypeyPlatformBuilder';

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

  const handlePlatformGenerated = (config: PlatformConfig) => setGeneratedPlatform(config);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {!showPreview ? (
        <div className="fixed left-0 right-0 top-0 z-50 border-b border-slate-700 bg-slate-800">
          <div className="container-custom h-16 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="text-sm uppercase tracking-[0.18em] text-slate-400">White Label Builder</div>
            <button
              onClick={() => generatedPlatform && setShowPreview(true)}
              disabled={!generatedPlatform}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs uppercase tracking-[0.12em] ${
                generatedPlatform
                  ? 'bg-lime-300 text-slate-900 border border-lime-200'
                  : 'bg-slate-800 border border-slate-600 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div key="builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-16">
            <HypeyPlatformBuilder onPlatformGenerated={handlePlatformGenerated} />
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {generatedPlatform ? (
              <HypeyLandingPagePreview config={generatedPlatform} onBack={() => setShowPreview(false)} />
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
