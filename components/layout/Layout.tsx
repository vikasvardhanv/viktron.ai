import React, { Suspense, lazy, memo } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingOrbs, GridPattern } from '../ui/FloatingElements';
import { motion } from 'framer-motion';

// Lazy load heavy components for better initial load
const GlobalChatbot = lazy(() => import('../GlobalChatbot').then(m => ({ default: m.GlobalChatbot })));

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showBackground?: boolean;
}

// Memoized background component to prevent unnecessary re-renders
const BackgroundEffects = memo(() => (
  <>
    <FloatingOrbs />
    <GridPattern />
  </>
));
BackgroundEffects.displayName = 'BackgroundEffects';

// Loading fallback for lazy components
const ChatbotFallback = () => null;

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFooter = true,
  showBackground = true
}) => {
  return (
    <div className="min-h-screen bg-[#07090d] text-white relative overflow-x-hidden">
      {/* Background effects - only render if needed */}
      {showBackground && <BackgroundEffects />}

      {/* Navigation */}
      <Navbar />

      {/* Main content with semantic HTML for SEO */}
      <main className="relative z-10" role="main">
        {children}
      </main>

      {/* Footer with semantic HTML */}
      {showFooter && <Footer />}

      {/* Global AI Chatbot - lazy loaded for performance */}
      <Suspense fallback={<ChatbotFallback />}>
        <GlobalChatbot />
      </Suspense>
    </div>
  );
};
