
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import './global.css';
import App from './App';

// Initialize Sentry before anything else — only in production with a DSN configured
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn && import.meta.env.PROD) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',
    release: import.meta.env.VITE_APP_VERSION,
    // Capture 10% of sessions as replays in production; 100% on errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Capture 20% of transactions for performance monitoring
    tracesSampleRate: 0.2,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Don't send errors from known bot/crawler traffic
    beforeSend(event) {
      if (event.exception) {
        const frames = event.exception.values?.[0]?.stacktrace?.frames || [];
        // Drop chunk load errors — usually network blips, not bugs
        if (frames.some(f => f.filename?.includes('chunk'))) {
          const msg = event.exception.values?.[0]?.value || '';
          if (msg.includes('Loading chunk') || msg.includes('Failed to fetch')) return null;
        }
      }
      return event;
    },
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
