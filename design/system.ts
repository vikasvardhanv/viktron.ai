/**
 * Viktron Professional SaaS Design System
 * 
 * Principles:
 * - Dense information architecture for power users
 * - Dark theme by default (Navy foundation)
 * - Emerald accent for primary actions and status
 * - Professional, not playful
 * - Accessibility-first (WCAG AA minimum)
 * - Responsive mobile-first
 */

export const designSystem = {
  // Color palette - OKLCH for consistent perceptual spacing
  colors: {
    // Semantic backgrounds
    background: {
      primary: '#0f172a',    // navy-900 - Main page bg
      secondary: '#1e293b',  // navy-800 - Cards, sections
      tertiary: '#334155',   // slate-700 - Subtle surfaces
      hover: '#1e293b',      // navy-800 - Hover state
      active: '#334155',     // slate-700 - Active state
    },
    // Semantic text
    text: {
      primary: '#f8fafc',    // slate-50 - Primary text
      secondary: '#cbd5e1',  // slate-400 - Secondary text
      muted: '#94a3b8',      // slate-500 - Muted/disabled
      inverse: '#0f172a',    // navy-900 - On light backgrounds
    },
    // Primary brand color
    accent: {
      DEFAULT: '#10b981',    // emerald-500
      light: '#6ee7b7',      // emerald-300
      dark: '#059669',       // emerald-600
      hover: '#059669',      // emerald-600
      active: '#047857',     // emerald-700
    },
    // Semantic colors
    success: '#10b981',      // emerald-500
    warning: '#f59e0b',      // amber-500
    error: '#ef4444',        // red-500
    info: '#0ea5e9',         // sky-500
    // Status colors
    status: {
      idle: '#6b7280',       // gray-500
      active: '#10b981',     // emerald-500
      pending: '#f59e0b',    // amber-500
      error: '#ef4444',      // red-500
      success: '#10b981',    // emerald-500
    },
    // Borders and dividers
    border: {
      light: '#334155',      // slate-700
      DEFAULT: '#475569',    // slate-600
      dark: '#64748b',       // slate-500
    },
  },

  typography: {
    // Font families
    family: {
      sans: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(', '),
      mono: [
        '"JetBrains Mono"',
        '"IBM Plex Mono"',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ].join(', '),
    },

    // Scales (mobile-first)
    sizes: {
      xs: { size: '12px', weight: 400, lineHeight: 1.5 },
      sm: { size: '14px', weight: 400, lineHeight: 1.5 },
      base: { size: '16px', weight: 400, lineHeight: 1.5 },
      lg: { size: '18px', weight: 500, lineHeight: 1.4 },
      xl: { size: '20px', weight: 600, lineHeight: 1.3 },
      '2xl': { size: '24px', weight: 700, lineHeight: 1.2 },
      '3xl': { size: '30px', weight: 700, lineHeight: 1.2 },
      '4xl': { size: '36px', weight: 700, lineHeight: 1.1 },
      '5xl': { size: '48px', weight: 700, lineHeight: 1.0 },
    },

    // Semantic text levels
    h1: { size: '48px', weight: 700, lineHeight: 1.2 },
    h2: { size: '36px', weight: 700, lineHeight: 1.2 },
    h3: { size: '28px', weight: 700, lineHeight: 1.2 },
    h4: { size: '24px', weight: 600, lineHeight: 1.3 },
    h5: { size: '20px', weight: 600, lineHeight: 1.3 },
    h6: { size: '16px', weight: 600, lineHeight: 1.4 },
    body: { size: '16px', weight: 400, lineHeight: 1.6 },
    bodySmall: { size: '14px', weight: 400, lineHeight: 1.5 },
    caption: { size: '12px', weight: 500, lineHeight: 1.4 },
    label: { size: '14px', weight: 500, lineHeight: 1.4 },
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  radius: {
    sm: '2px',
    DEFAULT: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },

  motion: {
    // Easing functions
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    // Durations
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    // Spring physics
    spring: {
      default: { stiffness: 100, damping: 10 },
      responsive: { stiffness: 100, damping: 20 },
      stiff: { stiffness: 200, damping: 25 },
      smooth: { stiffness: 50, damping: 15 },
    },
  },

  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Component-specific guidelines
  components: {
    button: {
      minHeight: '40px',
      minWidth: '40px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: 500,
      borderRadius: '6px',
      transition: 'all 200ms ease-out',
    },
    card: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid rgba(75, 85, 99, 0.2)',
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(10px)',
    },
    input: {
      height: '40px',
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '6px',
      border: '1px solid rgba(75, 85, 99, 0.3)',
      background: 'rgba(30, 41, 59, 0.5)',
      transition: 'all 200ms ease-out',
    },
  },

  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 100,
    sticky: 101,
    fixed: 102,
    backdrop: 1000,
    modal: 1001,
    popover: 1002,
    tooltip: 1003,
  },
};

export type DesignSystem = typeof designSystem;
