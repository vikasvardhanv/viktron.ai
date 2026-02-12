# Viktron - Project Setup & Launch Guide

## 🎯 Project Overview

**Viktron** is a modern AI agency platform built with React, TypeScript, and Framer Motion. This is a complete replica of Viktron.ai with professional UI/UX enhancements, sophisticated animations, and a comprehensive design system.

---

## 📦 What's Included

### ✅ Complete Project Replication
- All Viktron.ai components and functionality
- Full AI agents library
- Complete service offerings
- Demo pages and interactive tools

### ✅ Professional Design System
- Premium color palette with gradients
- Glass morphism effects
- Advanced animations and transitions
- Responsive design system
- WCAG 2.1 AA accessibility compliance

### ✅ Animated Component Library
- AnimatedButton - Multiple variants and sizes
- AnimatedCard - Glass effect cards
- AnimatedHeading - Gradient text support
- ScrollReveal - Scroll-triggered animations
- StaggerContainer - Staggered animations
- FloatingElement - Gentle floating effects
- PageTransition - Smooth page transitions

### ✅ Modern Tech Stack
- React 19.2.0
- TypeScript 5.8
- Vite 6.2.0 (Lightning-fast bundler)
- Framer Motion 12.23 (Advanced animations)
- Tailwind CSS 4.1 (Utility-first styling)
- Express.js (Backend API)
- PostgreSQL (Database)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- PostgreSQL (for database features)

### Installation Steps

```bash
# Navigate to project
cd /Users/vikashvardhan/IdeaProjects/viktron.ai

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env          # Create if needed
# Edit .env with your API keys and database credentials

# Initialize database (optional)
npm run db:init

# Start development server
npm run dev

# Open in browser
# Visit http://localhost:3000
```

### Running Both Frontend & Backend

```bash
# Run frontend + backend simultaneously
npm run dev:all

# Or run separately in different terminals:
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:server
```

---

## 📂 Project Structure

```
viktron.ai/
├── components/                 # React components
│   ├── ui/
│   │   ├── animated/          # NEW: Animated components
│   │   │   ├── AnimatedButton.tsx
│   │   │   ├── AnimatedCard.tsx
│   │   │   ├── AnimatedSection.tsx
│   │   │   ├── LayoutAnimations.tsx
│   │   │   └── index.ts
│   │   └── SEO.tsx
│   ├── layout/                # Layout components
│   ├── agents/                # AI agent components
│   └── tools/                 # Tool components
├── config/
│   └── theme.ts               # NEW: Design system theme
├── context/                   # React context
├── pages/                     # Page components
├── public/                    # Static assets
├── server/                    # Express backend
├── services/                  # API services
├── utils/                     # Utility functions
├── App.tsx                    # Main app component
├── index.tsx                  # Entry point
├── global.css                 # ENHANCED: Global styles
├── tailwind.config.js         # ENHANCED: Tailwind config
├── package.json               # UPDATED: Dependencies
├── DESIGN_SYSTEM.md          # NEW: Design documentation
├── MIGRATION.md              # NEW: Migration guide
├── SETUP.md                  # NEW: This file
└── vite.config.ts            # Vite configuration
```

---

## 🎨 Using the Animated Components

### Import Components

```tsx
import {
  AnimatedButton,
  AnimatedCard,
  AnimatedGlassCard,
  AnimatedHeading,
  AnimatedSubheading,
  ScrollReveal,
  FloatingElement,
  StaggerContainer,
  PageTransition,
} from '@/components/ui/animated';
```

### Example: Hero Section

```tsx
import { AnimatedHeading, AnimatedSubheading, AnimatedButton } from '@/components/ui/animated';

export function HeroSection() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <AnimatedHeading level="h1" className="text-5xl md:text-6xl">
        Welcome to Viktron
      </AnimatedHeading>
      
      <AnimatedSubheading delay={0.1}>
        AI-powered business automation platform
      </AnimatedSubheading>
      
      <AnimatedButton 
        variant="primary" 
        size="lg"
        className="mt-8"
        delay={0.2}
      >
        Get Started
      </AnimatedButton>
    </div>
  );
}
```

### Example: Feature Cards Grid

```tsx
import { AnimatedGlassCard, StaggerContainer } from '@/components/ui/animated';
import { Sparkles, Zap, Target } from 'lucide-react';

export function FeaturesGrid() {
  const features = [
    {
      icon: <Sparkles />,
      title: 'AI Powered',
      description: 'Advanced AI agents for automation',
    },
    {
      icon: <Zap />,
      title: 'Lightning Fast',
      description: 'Optimized for performance',
    },
    {
      icon: <Target />,
      title: 'Scalable',
      description: 'Grows with your business',
    },
  ];

  return (
    <StaggerContainer className="grid md:grid-cols-3 gap-6">
      {features.map((feature, i) => (
        <AnimatedGlassCard
          key={i}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          delay={i * 0.1}
        />
      ))}
    </StaggerContainer>
  );
}
```

### Example: Scroll Reveal Section

```tsx
import { ScrollReveal, AnimatedCard } from '@/components/ui/animated';

export function ScrollRevealSection() {
  return (
    <section className="py-20">
      <ScrollReveal delay={0.2}>
        <AnimatedCard gradient>
          <h2 className="text-3xl font-bold mb-4">Revealed on Scroll</h2>
          <p className="text-gray-300">
            This section appears with a smooth animation when you scroll into view.
          </p>
        </AnimatedCard>
      </ScrollReveal>
    </section>
  );
}
```

---

## 🎯 Development Workflow

### Build Commands

```bash
# Development build (watch mode)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint

# Analyze bundle size
npm run build:analyze
```

### Environment Variables

Create `.env` file:

```env
# API Configuration
VITE_API_PROXY=https://api.viktron.ai
VITE_LEAD_AGENT_API_URL=https://lead-agent.viktron.ai

# AI Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/viktron

# Server
SERVER_PORT=5000
NODE_ENV=development
```

---

## 🎨 Customizing the Design System

### Change Color Scheme

Edit `/config/theme.ts`:

```typescript
export const nikTheme = {
  colors: {
    primary: {
      500: '#YOUR_COLOR', // Change primary color
    },
    // ... other colors
  },
};
```

### Add Custom Animations

Edit `/tailwind.config.js`:

```javascript
animation: {
  'your-animation': 'yourAnimation 0.5s ease-out',
},
keyframes: {
  yourAnimation: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
}
```

### Global Styles

Edit `/global.css` for:
- Scrollbar appearance
- Selection colors
- Default font sizes
- Card styling
- Button defaults

---

## 🔧 Key Features

### 1. **Professional Animations**
   - Page transitions
   - Scroll reveals
   - Staggered animations
   - Interactive hover states
   - Loading animations

### 2. **Responsive Design**
   - Mobile-first approach
   - Tailored for all screen sizes
   - Touch-friendly interfaces
   - Optimized images

### 3. **Accessibility**
   - WCAG 2.1 AA compliant
   - Keyboard navigation
   - Screen reader support
   - Proper color contrast

### 4. **Performance**
   - Code splitting
   - Lazy loading
   - Optimized animations
   - Tree-shaking
   - CSS compression

---

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run dev:server       # Start backend server
npm run dev:all          # Start both frontend & backend

# Production
npm run build            # Build for production
npm run preview          # Preview production build
npm run start:server     # Start production server

# Database
npm run db:init          # Initialize database
npm run store:seed       # Seed workflow store

# Utilities
npm run lint             # TypeScript type checking
npm run build:analyze    # Analyze bundle size
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port in vite.config.ts
```

### Node Modules Issue
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
```bash
# Restart dev server after editing .env
npm run dev
```

### Database Connection Error
```bash
# Check PostgreSQL is running
# Update DATABASE_URL in .env
```

---

## 🌐 Deployment

### Vercel/Netlify (Frontend)

```bash
# Build
npm run build

# Output: dist/

# Deploy the dist folder
```

### Railway/Render (Backend)

```bash
# Set environment variables
# Connect GitHub repository
# Automatic deployment on push
```

### Docker

```bash
# Build image
docker build -t viktron .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production viktron
```

---

## 📖 Documentation Files

- **MIGRATION.md** - Complete rebranding & update guide
- **DESIGN_SYSTEM.md** - Design system & component documentation
- **README.md** - Project overview
- **DEPLOYMENT.md** - Deployment instructions

---

## 💡 Tips & Best Practices

### Component Usage
1. Import from `/components/ui/animated` for animated components
2. Use CSS utilities for styling (Tailwind classes)
3. Leverage theme colors for consistency
4. Delay animations strategically (0.1s increments)

### Performance
1. Use `motion.div` only when animation is needed
2. Prefer ` opacity` and `transform` for animations
3. Keep animations under 0.5s for smooth UX
4. Use `whileInView` for scroll animations

### Accessibility
1. Include proper ARIA labels
2. Test keyboard navigation
3. Check color contrast ratios
4. Provide text alternatives for images

---

## 🎉 Next Steps

1. **Install Dependencies**: `npm install`
2. **Configure Environment**: Update `.env` file
3. **Start Development**: `npm run dev`
4. **Explore Components**: Check `/components/ui/animated/`
5. **Read Documentation**: Review DESIGN_SYSTEM.md
6. **Start Building**: Create your first animated page!

---

## 🤝 Support & Resources

- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/

---

## 📝 Version Info

- **Project**: Viktron AI Platform
- **Version**: 1.0.0
- **Last Updated**: February 12, 2026
- **Status**: Production Ready ✅

---

**You're all set! Start your development journey with Viktron. 🚀**
