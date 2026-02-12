import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiKey = process.env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
    const isProduction = mode === 'production';
    const apiProxyTarget = env.VITE_API_PROXY;
    const leadAgentProxyTarget =
      env.VITE_LEAD_AGENT_API_URL || 'https://techmehash--lead-agent-api.modal.run';
    const proxyConfig: Record<string, any> = {
      '/api/lead-agent': {
        target: leadAgentProxyTarget,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/lead-agent/, ''),
      },
    };

    if (apiProxyTarget) {
      proxyConfig['/api'] = {
        target: apiProxyTarget,
        changeOrigin: true,
      };
    }
    
    return {
      server: {
        port: 4174,
        host: '0.0.0.0',
        proxy: proxyConfig,
      },
      plugins: [
        react()
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Optimize dependencies pre-bundling
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          'framer-motion',
          'lucide-react',
          'clsx',
          'tailwind-merge'
        ],
        // Exclude large AI library from pre-bundling - load on demand
        exclude: ['@google/genai']
      },
      build: {
        // Use esbuild for minification (faster and built-in)
        minify: 'esbuild',
        // Enable source maps only in development
        sourcemap: !isProduction,
        // Optimize CSS
        cssMinify: true,
        cssCodeSplit: true,
        // Asset optimization
        assetsInlineLimit: 4096, // 4kb - inline small assets as base64
        // Rollup optimizations
        rollupOptions: {
          output: {
            // Improved chunking strategy for better caching
            manualChunks: {
              // Core React runtime
              'react-vendor': ['react', 'react-dom'],
              // Routing
              'router': ['react-router-dom'],
              // Animation library (can be large)
              'motion': ['framer-motion'],
              // UI utilities
              'ui-utils': ['lucide-react', 'clsx', 'tailwind-merge'],
              // Markdown rendering
              'markdown': ['react-markdown', 'remark-gfm'],
              // AI library - lazy loaded
              'ai': ['@google/genai']
            },
            // Optimize chunk file names for caching
            chunkFileNames: isProduction 
              ? 'assets/js/[name]-[hash].js' 
              : 'assets/js/[name].js',
            entryFileNames: isProduction 
              ? 'assets/js/[name]-[hash].js' 
              : 'assets/js/[name].js',
            assetFileNames: (assetInfo) => {
              const extType = assetInfo.name?.split('.').pop() || '';
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/css/i.test(extType)) {
                return `assets/css/[name]-[hash][extname]`;
              }
              if (/woff2?|eot|ttf|otf/i.test(extType)) {
                return `assets/fonts/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            },
          },
          // Tree-shaking optimizations
          treeshake: {
            moduleSideEffects: 'no-external',
            propertyReadSideEffects: false,
          }
        },
        // Target modern browsers for smaller bundles
        target: ['es2020', 'chrome87', 'safari14', 'firefox78', 'edge88'],
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
        // Report compressed size
        reportCompressedSize: true,
      },
      // Preview server settings
      preview: {
        port: 4173,
        host: true,
      },
      // Enable experimental features for better performance
      esbuild: {
        // Faster builds with esbuild
        legalComments: 'none',
        target: 'es2020',
      },
    };
});
