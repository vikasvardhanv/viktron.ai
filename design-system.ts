/**
 * Viktron Design System v2.0
 * Premium Infrastructure UI with Emerald Accent
 * Based on Linear, Vercel, and modern SaaS aesthetics
 */

export const designSystem = {
  // ── Color Palette ──
  colors: {
    // Semantic: Dark mode foundation
    background: {
      primary: '#0f172a',      // Navy-900
      secondary: '#1e293b',    // Navy-800
      tertiary: '#334155',     // Navy-700
      interactive: '#475569',  // Navy-600
    },
    
    // Emerald: Primary accent (infrastructure-focused)
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',          // PRIMARY ACCENT
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    
    // Slate: Neutral for text/borders
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    
    // Semantic Status
    success: '#10b981',        // Emerald-500
    warning: '#f59e0b',        // Amber-500
    error: '#ef4444',          // Red-500
    info: '#06b6d4',           // Cyan-500
    
    // Text
    text: {
      primary: '#ffffff',      // White on dark
      secondary: '#cbd5e1',    // Slate-300
      tertiary: '#94a3b8',     // Slate-400
      muted: '#64748b',        // Slate-500
      inverse: '#0f172a',      // Navy-900 for light backgrounds
    },
    
    // Surfaces
    surface: {
      card: 'rgba(30, 41, 59, 0.5)',                    // Navy-800/50
      input: 'rgba(51, 65, 85, 0.3)',                   // Navy-700/30
      hover: 'rgba(71, 85, 105, 0.2)',                  // Navy-600/20
      border: 'rgba(148, 163, 184, 0.2)',               // Slate-400/20
    },
  },

  // ── Typography ──
  typography: {
    fontFamily: {
      sans: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      mono: 'Geist Mono, SF Mono, Monaco, Cascadia Code, monospace',
      display: 'Geist, Satoshi, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    
    scale: {
      // Display sizes
      display: {
        lg: { size: '3.5rem', weight: 700, lineHeight: 1.1 },  // 56px
        md: { size: '2.5rem', weight: 700, lineHeight: 1.2 },  // 40px
        sm: { size: '2rem', weight: 700, lineHeight: 1.2 },    // 32px
      },
      
      // Heading sizes
      heading: {
        xl: { size: '1.875rem', weight: 700, lineHeight: 1.2 },  // 30px
        lg: { size: '1.5rem', weight: 700, lineHeight: 1.3 },    // 24px
        md: { size: '1.25rem', weight: 700, lineHeight: 1.3 },   // 20px
        sm: { size: '1.125rem', weight: 600, lineHeight: 1.4 },  // 18px
        xs: { size: '1rem', weight: 600, lineHeight: 1.5 },      // 16px
      },
      
      // Body text
      body: {
        lg: { size: '1rem', weight: 400, lineHeight: 1.6 },      // 16px (standard)
        md: { size: '0.9375rem', weight: 400, lineHeight: 1.6 }, // 15px
        sm: { size: '0.875rem', weight: 400, lineHeight: 1.5 },  // 14px
        xs: { size: '0.75rem', weight: 400, lineHeight: 1.5 },   // 12px
      },
      
      // Monospace (code, numbers)
      mono: {
        lg: { size: '0.875rem', weight: 500, lineHeight: 1.5 },  // 14px
        md: { size: '0.8125rem', weight: 500, lineHeight: 1.5 }, // 13px
        sm: { size: '0.75rem', weight: 500, lineHeight: 1.4 },   // 12px
      },
    },
  },

  // ── Spacing ──
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // ── Radius ──
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.25rem', // 20px
    full: '9999px',
  },

  // ── Shadows ──
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    
    // Liquid glass inset (emerald accent)
    glass: 'inset 0 1px 0 rgba(16, 185, 129, 0.1)',
    'glass-emerald': 'inset 0 1px 0 rgba(16, 185, 129, 0.2)',
  },

  // ── Motion ──
  motion: {
    duration: {
      instant: '0ms',
      fast: '100ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    spring: {
      tight: { stiffness: 200, damping: 20 },
      normal: { stiffness: 100, damping: 20 },
      loose: { stiffness: 60, damping: 15 },
      bouncy: { stiffness: 40, damping: 10 },
    },
  },

  // ── Breakpoints ──
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ── Component Tokens ──
  components: {
    button: {
      primary: {
        bg: '#10b981',           // Emerald-500
        bgHover: '#059669',      // Emerald-600
        text: '#0f172a',         // Navy-900 (high contrast)
        textHover: '#0f172a',
      },
      secondary: {
        bg: 'rgba(51, 65, 85, 0.5)',    // Navy-700/50
        bgHover: 'rgba(71, 85, 105, 0.6)', // Navy-600/60
        text: '#cbd5e1',         // Slate-300
        textHover: '#f8fafc',    // Slate-50
        border: 'rgba(148, 163, 184, 0.3)', // Slate-400/30
      },
      ghost: {
        text: '#94a3b8',         // Slate-400
        textHover: '#cbd5e1',    // Slate-300
      },
    },
    input: {
      bg: 'rgba(51, 65, 85, 0.3)',  // Navy-700/30
      border: 'rgba(148, 163, 184, 0.2)', // Slate-400/20
      borderFocus: '#10b981',    // Emerald-500
      text: '#f8fafc',           // Slate-50
      placeholder: '#94a3b8',    // Slate-400
    },
    card: {
      bg: 'rgba(30, 41, 59, 0.5)',    // Navy-800/50
      border: 'rgba(148, 163, 184, 0.2)', // Slate-400/20
      borderHover: 'rgba(16, 185, 129, 0.3)', // Emerald-500/30
    },
  },

  // ── Utilities ──
  utilities: {
    // Glass effect (liquid glass)
    glass: `
      backdrop-blur-xl
      bg-opacity-50
      border border-slate-400/20
      shadow-[inset_0_1px_0_rgba(16,185,129,0.1)]
    `,
    
    // Container
    container: 'max-w-7xl mx-auto px-4 md:px-6 lg:px-8',
    
    // Transitions
    transition: 'transition-all duration-200 ease-out',
  },
};

// ── Export type for TypeScript ──
export type DesignSystem = typeof designSystem;
