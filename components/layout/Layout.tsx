import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../../utils/analytics';

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
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();
  const { trackPageView, trackClick } = useAnalytics();

  // Page view tracking
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Global click tracking
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"]');
      
      if (clickable) {
        const text = clickable.textContent?.trim().substring(0, 50) || '';
        const id = clickable.id || '';
        const type = clickable.tagName.toLowerCase();
        
        trackClick(id || 'anonymous_element', text, {
          element_type: type,
          href: (clickable as HTMLAnchorElement).href || undefined,
          path: location.pathname
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [location.pathname, trackClick]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#050505] text-white">
      {/* Dynamic Infrastructure Background */}
      {showBackground && (
        <div className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden ${isMobile ? 'opacity-20' : 'opacity-40'}`}>
          <div className="absolute inset-0 grid-paper opacity-[0.05]" />
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full" />
          
          {/* Subtle tech lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(204,255,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.2) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>
      )}

      {/* Navigation */}
      <Navbar />
      
      <main className="relative z-10" role="main">
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Global AI Chatbot */}
      <Suspense fallback={<ChatbotFallback />}>
        <GlobalChatbot />
      </Suspense>
    </div>
  );
};
