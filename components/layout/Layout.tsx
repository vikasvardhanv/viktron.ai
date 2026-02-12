import React, { Suspense, lazy } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Lazy load heavy components for better initial load
const GlobalChatbot = lazy(() => import('../GlobalChatbot').then(m => ({ default: m.GlobalChatbot })));

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showBackground?: boolean;
}

// Loading fallback for lazy components
const ChatbotFallback = () => null;

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFooter = true,
  showBackground = false
}) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden">
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
