import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { Button } from '../ui/Button';
import { Cookie, Settings, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, openPreferences, setShowBanner } = useCookieConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative obsidian-panel p-8 shadow-2xl overflow-hidden group">
              <div className="scan-line opacity-10" />
              
              {/* Close button */}
              <button
                onClick={() => setShowBanner(false)}
                className="absolute top-4 right-4 p-2 rounded-none hover:bg-white/5 transition-colors text-zinc-500 hover:text-primary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
+
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Icon and Text */}
                <div className="flex items-start gap-6 flex-1">
                  <div className="p-4 obsidian-inset border border-white/5 text-primary shrink-0">
                    <Cookie className="h-6 w-6 text-glow" />
                  </div>
                  <div className="space-y-2">
                    <div className="section-label !mb-0">PRIVACY_PROTOCOL // COOKIES</div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
                      We Value Your Privacy
                    </h3>
                    <p className="text-zinc-500 text-[11px] font-mono uppercase tracking-widest leading-relaxed max-w-2xl">
                      We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                      By clicking "Accept All", you consent to our use of cookies. <Link
                        to="/cookies"
                        className="text-primary hover:underline"
                        onClick={() => setShowBanner(false)}
                      >
                        [LEARN_MORE]
                      </Link>
                    </p>
                  </div>
                </div>
+
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                  <button
                    onClick={rejectAll}
                    className="px-6 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={openPreferences}
                    className="btn-obsidian !px-6 !py-3 !text-[10px] flex items-center justify-center gap-3"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Customize
                  </button>
                  <button 
                    onClick={acceptAll} 
                    className="btn-acid !px-8 !py-3 !text-[10px]"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
