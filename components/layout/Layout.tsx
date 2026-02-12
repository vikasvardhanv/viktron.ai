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
    <div className="relative min-h-screen overflow-x-clip bg-transparent text-[#13213a]">
      {showBackground && (
        <div className="page-noise pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <img
            src="/visuals/site-backdrop.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.62]"
          />
          <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#dbe6f8]/56 to-transparent" />
          <div className="absolute -top-28 right-[-8rem] h-80 w-80 rounded-full bg-[#89b3ff]/24 blur-3xl" />
          <div className="absolute top-28 left-[-7rem] h-64 w-64 rounded-full bg-[#89e1c7]/24 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(43,67,107,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(43,67,107,0.22) 1px, transparent 1px)',
              backgroundSize: '108px 108px',
              maskImage: 'linear-gradient(to bottom, black, transparent 80%)',
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
