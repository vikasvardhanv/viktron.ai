// Viktron Analytics Engine
// Sends telemetry to both Google Analytics and internal Viktron Intelligence Brain

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
const API_URL = import.meta.env.VITE_API_URL || '';

let isInitialized = false;

// Generate session ID using crypto API
function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let sessionId = sessionStorage.getItem('viktron_session_id');

if (!sessionId) {
  sessionId = generateSessionId();
  sessionStorage.setItem('viktron_session_id', sessionId);
}

/**
 * Initialize Analytics (only call after consent)
 */
export function initializeAnalytics(): void {
  if (isInitialized) return;

  // Check for Do Not Track
  if (navigator.doNotTrack === '1') {
    console.log('Analytics disabled: Do Not Track is enabled');
    return;
  }

  try {
    if (GA_MEASUREMENT_ID) {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure',
      });
    }

    isInitialized = true;
    console.log('Viktron Intelligence Analytics initialized');
    
    // Track initialization
    trackEvent('analytics_initialized', {
      session_id: sessionId,
      referrer: document.referrer,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  } catch (error) {
    console.error('Failed to initialize Analytics:', error);
  }
}

/**
 * Disable analytics
 */
export function disableAnalytics(): void {
  if (GA_MEASUREMENT_ID) {
    window.gtag?.('config', GA_MEASUREMENT_ID, { 'send_page_view': false });
    (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  }
  isInitialized = false;
}

/**
 * Send event to Viktron Internal Intelligence Brain
 */
async function trackToBackend(eventName: string, params: Record<string, any> = {}) {
  // Ensure we have consent before sending to our own servers too (optional but ethical)
  // If user hasn't initialized, we skip.
  if (!isInitialized) return;

  try {
    const response = await fetch(`${API_URL.replace(/\/$/, '')}/api/saas/events/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: [
          {
            workspace_id: 'viktron-internal-website',
            category: 'product',
            event: eventName,
            status: 'ok',
            properties: params,
            session_id: sessionId,
            occurred_at: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!response.ok) {
      // Silently fail to not interrupt user experience
    }
  } catch (err) {
    // Silently fail
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string): void {
  if (!isInitialized) return;

  // GA4
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });

  // Internal Brain
  trackToBackend('page_view', {
    path,
    title: title || document.title,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (!isInitialized) return;

  // GA4
  window.gtag?.('event', eventName, params);

  // Internal Brain
  trackToBackend(eventName, params);
}

/**
 * Track click interactions
 */
export function trackClick(elementId: string, text: string, metadata: Record<string, any> = {}): void {
  trackEvent('click_interaction', {
    element_id: elementId,
    element_text: text,
    ...metadata,
  });
}

/**
 * Track demo interaction
 */
export function trackDemoStart(demoType: string, demoName: string): void {
  trackEvent('demo_start', {
    demo_type: demoType,
    demo_name: demoName,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formType: string, metadata: Record<string, any> = {}): void {
  trackEvent('form_submit', {
    form_type: formType,
    ...metadata,
  });
}

/**
 * Track CTA click
 */
export function trackCTAClick(buttonLocation: string, buttonText: string): void {
  trackEvent('cta_click', {
    button_location: buttonLocation,
    button_text: buttonText,
  });
}

/**
 * Track Auth
 */
export function trackAuth(type: 'signup' | 'login', method: string): void {
  trackEvent(type, { method });
}

/**
 * Custom hook for analytics
 */
export const useAnalytics = () => {
  return {
    trackPageView,
    trackEvent,
    trackClick,
    trackDemoStart,
    trackFormSubmit,
    trackCTAClick,
    trackAuth,
    sessionId,
  };
};
