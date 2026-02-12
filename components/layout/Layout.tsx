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
  showBackground = true
}) => {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-transparent text-slate-100">
      {showBackground && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-emerald-400/6 to-transparent" />
          <div className="absolute -top-20 right-[-7rem] h-72 w-72 rounded-full border border-lime-200/10 bg-lime-200/5" />
          <div className="absolute top-24 left-[-5rem] h-56 w-56 rounded-full border border-emerald-300/10 bg-emerald-300/5" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '88px 88px',
              maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
            }}
          />
        </div>
      )}

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
