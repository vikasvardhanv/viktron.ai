import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { CookieBanner, CookiePreferences } from './components/CookieConsent';

// Lazy load all pages for faster initial load
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const DemoForm = lazy(() => import('./pages/DemoForm').then(m => ({ default: m.DemoForm })));
const Marketing = lazy(() => import('./pages/Marketing').then(m => ({ default: m.Marketing })));
const Demos = lazy(() => import('./pages/Demos').then(m => ({ default: m.Demos })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const CaseStudies = lazy(() => import('./pages/CaseStudies').then(m => ({ default: m.CaseStudies })));
const Careers = lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const WhiteLabel = lazy(() => import('./pages/WhiteLabel').then(m => ({ default: m.WhiteLabel })));
const MyPlatforms = lazy(() => import('./pages/MyPlatforms').then(m => ({ default: m.MyPlatforms })));
// New Pages
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const UseCases = lazy(() => import('./pages/UseCases').then(m => ({ default: m.UseCases })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then(m => ({ default: m.ServiceDetail })));
const LeadbotConsole = lazy(() => import('./pages/LeadbotConsole').then(m => ({ default: m.LeadbotConsole })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const RentAgent = lazy(() => import('./pages/RentAgent').then(m => ({ default: m.RentAgent })));
const Enterprise = lazy(() => import('./pages/Enterprise').then(m => ({ default: m.Enterprise })));
const Docs = lazy(() => import('./pages/Docs').then(m => ({ default: m.Docs })));
const TrustFabric = lazy(() => import('./pages/TrustFabric'));
const SlackOAuthCallback = lazy(() => import('./pages/SlackOAuthCallback').then(m => ({ default: m.SlackOAuthCallback })));
const ToolFeed = lazy(() => import('./pages/ToolFeed').then(m => ({ default: m.ToolFeed })));
const PretrainedDirectory = lazy(() => import('./pages/PretrainedDirectory').then(m => ({ default: m.default })));
const SpawnApproval = lazy(() => import('./pages/SpawnApproval').then(m => ({ default: m.default })));
const CloudDashboard = lazy(() => import('./pages/cloud/index'));

// Dashboard surfaces
const AgentMonitor = lazy(() => import('./pages/dashboard/AgentMonitor').then(m => ({ default: m.AgentMonitor })));
const WorkflowBuilder = lazy(() => import('./pages/dashboard/WorkflowBuilder').then(m => ({ default: m.WorkflowBuilder })));
const ChannelSetup = lazy(() => import('./pages/dashboard/ChannelSetup').then(m => ({ default: m.ChannelSetup })));
const Integrations = lazy(() => import('./pages/dashboard/Integrations').then(m => ({ default: m.Integrations })));
const IntegrationsCallback = lazy(() => import('./pages/dashboard/IntegrationsCallback').then(m => ({ default: m.default })));
// Trust Fabric Components
const AgentIdentity = lazy(() => import('./pages/dashboard/AgentIdentity').then(m => ({ default: m.AgentIdentity })));
const DelegationTokens = lazy(() => import('./pages/dashboard/DelegationTokens').then(m => ({ default: m.DelegationTokens })));
const PolicyGateway = lazy(() => import('./pages/dashboard/PolicyGateway').then(m => ({ default: m.PolicyGateway })));
const ProvenanceLedger = lazy(() => import('./pages/dashboard/ProvenanceLedger').then(m => ({ default: m.ProvenanceLedger })));
const MemoryGovernance = lazy(() => import('./pages/dashboard/MemoryGovernance').then(m => ({ default: m.MemoryGovernance })));

// Onboarding
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })));

// Medhavn pages
const MedhavnSupport = lazy(() => import('./pages/MedhavnSupport').then(m => ({ default: m.MedhavnSupport })));
const MedhavnPrivacyPolicy = lazy(() => import('./pages/medhavn/PrivacyPolicy').then(m => ({ default: m.MedhavnPrivacyPolicy })));
const MedhavnPrivacyChoices = lazy(() => import('./pages/medhavn/PrivacyChoices').then(m => ({ default: m.MedhavnPrivacyChoices })));

// Legal pages - lazy loaded
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService').then(m => ({ default: m.TermsOfService })));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy').then(m => ({ default: m.CookiePolicy })));

// Demo pages - lazy loaded
const RestaurantDemo = lazy(() => import('./pages/demos/RestaurantDemo').then(m => ({ default: m.RestaurantDemo })));
const ClinicDemo = lazy(() => import('./pages/demos/ClinicDemo').then(m => ({ default: m.ClinicDemo })));
const SalonDemo = lazy(() => import('./pages/demos/SalonDemo').then(m => ({ default: m.SalonDemo })));
const DealershipDemo = lazy(() => import('./pages/demos/DealershipDemo').then(m => ({ default: m.DealershipDemo })));
const ConstructionDemo = lazy(() => import('./pages/demos/ConstructionDemo').then(m => ({ default: m.ConstructionDemo })));
const WhatsAppDemo = lazy(() => import('./pages/demos/WhatsAppDemo').then(m => ({ default: m.WhatsAppDemo })));
const VoiceDemo = lazy(() => import('./pages/demos/VoiceDemo').then(m => ({ default: m.VoiceDemo })));
const BusinessPlanDemo = lazy(() => import('./pages/demos/BusinessPlanDemo').then(m => ({ default: m.BusinessPlanDemo })));
const RealEstateDemo = lazy(() => import('./pages/demos/RealEstateDemo').then(m => ({ default: m.RealEstateDemo })));
const LegalDemo = lazy(() => import('./pages/demos/LegalDemo').then(m => ({ default: m.LegalDemo })));
const EcommerceDemo = lazy(() => import('./pages/demos/EcommerceDemo').then(m => ({ default: m.EcommerceDemo })));
const EducationDemo = lazy(() => import('./pages/demos/EducationDemo').then(m => ({ default: m.EducationDemo })));
const RecruitmentDemo = lazy(() => import('./pages/demos/RecruitmentDemo').then(m => ({ default: m.RecruitmentDemo })));
const LeadGenDemo = lazy(() => import('./pages/demos/LeadGenDemo').then(m => ({ default: m.LeadGenDemo })));

// Advanced AI Service Demos - lazy loaded
const WorkflowAutomationDemo = lazy(() => import('./pages/demos/WorkflowAutomationDemo').then(m => ({ default: m.WorkflowAutomationDemo })));
const DataAnalyticsDemo = lazy(() => import('./pages/demos/DataAnalyticsDemo').then(m => ({ default: m.DataAnalyticsDemo })));
const ContentGeneratorDemo = lazy(() => import('./pages/demos/ContentGeneratorDemo').then(m => ({ default: m.ContentGeneratorDemo })));
const AgentOrchestrationDemo = lazy(() => import('./pages/demos/AgentOrchestrationDemo').then(m => ({ default: m.AgentOrchestrationDemo })));
const AgentIRL = lazy(() => import('./pages/AgentIRL').then(m => ({ default: m.AgentIRL })));
const CustomModelDemo = lazy(() => import('./pages/demos/CustomModelDemo').then(m => ({ default: m.CustomModelDemo })));

const DemoVideo = lazy(() => import('./pages/DemoVideo').then(m => ({ default: m.DemoVideo })));
const InvestorDemo = lazy(() => import('./pages/InvestorDemo').then(m => ({ default: m.InvestorDemo })));
const AnalyticsApp = lazy(() => import('./pages/analytics/AnalyticsApp').then(m => ({ default: m.AnalyticsApp })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));

// Legacy components - lazy loaded
const MarketingHub = lazy(() => import('./components/MarketingHub').then(m => ({ default: m.MarketingHub })));
const SnakeGame = lazy(() => import('./components/SnakeGame').then(m => ({ default: m.SnakeGame })));

// Loading spinner for lazy loaded components
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-10">
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 rounded-full border border-white/5 animate-spin" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-4 rounded-full border border-primary/10 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 obsidian-inset flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
           <div className="w-2 h-2 bg-primary animate-pulse rounded-full" />
        </div>
      </div>
    </div>
    <div className="text-center space-y-4">
      <p className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.4em]">Initializing_Agents</p>
      <div className="flex items-center gap-3 justify-center">
         <div className="w-8 h-px bg-white/10" />
         <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Connecting_to_AgentIRL_Runtime</p>
         <div className="w-8 h-px bg-white/10" />
      </div>
    </div>
  </div>
);

// Optimized page transition with reduced motion support
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      style={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
};

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const GoogleSignInWarmup: React.FC = () => {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).google?.accounts?.id) return;

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return null;
};

// Subdomain detection helper
const getSubdomain = () =>
  typeof window !== 'undefined' ? window.location.hostname.split('.')[0] : '';

// Animated routes wrapper
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // Redirect /auth to /login
  if (path === '/auth') {
    return <Navigate to="/login" replace />;
  }

  // Always allow /login and /signup regardless of subdomain
  if (path === '/login') {
    return <PageTransition><AuthPage mode="login" /></PageTransition>;
  }
  if (path === '/signup') {
    return <PageTransition><AuthPage mode="signup" /></PageTransition>;
  }

  // On rent.viktron.ai serve the agent marketplace at root (no path redirect needed)
  if (getSubdomain() === 'rent') {
    return <RentAgent />;
  }

  // On analytics.viktron.ai serve the analytics platform at root
  if (getSubdomain() === 'analytics') {
    return <AnalyticsApp />;
  }

  // On medhavn.viktron.ai serve Medhavn-specific routes
  if (getSubdomain() === 'medhavn') {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/support" element={<PageTransition><MedhavnSupport /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><MedhavnPrivacyPolicy /></PageTransition>} />
          <Route path="/privacy-choices" element={<PageTransition><MedhavnPrivacyChoices /></PageTransition>} />
          <Route path="*" element={<PageTransition><MedhavnSupport /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main pages */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/services/agentirl" element={<PageTransition><AgentIRL /></PageTransition>} />
        <Route path="/services/trust-fabric" element={<PageTransition><TrustFabric /></PageTransition>} />
        <Route path="/services/agent-orchestration" element={<Navigate to="/services/agentirl" replace />} />
        <Route path="/services/:serviceId" element={<PageTransition><ServiceDetail /></PageTransition>} />
        <Route path="/use-cases" element={<PageTransition><UseCases /></PageTransition>} />
        <Route path="/marketing" element={<PageTransition><Marketing /></PageTransition>} />
        <Route path="/case-studies" element={<PageTransition><CaseStudies /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
        <Route path="/enterprise" element={<PageTransition><Enterprise /></PageTransition>} />
        <Route path="/docs" element={<PageTransition><Docs /></PageTransition>} />
        <Route path="/demos" element={<PageTransition><Demos /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/demo-form" element={<PageTransition><DemoForm /></PageTransition>} />
        <Route path="/white-label" element={<PageTransition><WhiteLabel /></PageTransition>} />
        <Route path="/my-platforms" element={<PageTransition><MyPlatforms /></PageTransition>} />
        <Route path="/leadbot" element={<PageTransition><LeadbotConsole /></PageTransition>} />
        <Route path="/rent" element={<PageTransition><RentAgent /></PageTransition>} />
        <Route path="/cloud" element={<PageTransition><CloudDashboard /></PageTransition>} />
        <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        <Route path="/saas-analytics" element={<PageTransition><AnalyticsApp /></PageTransition>} />
        <Route path="/slack/oauth/callback" element={<PageTransition><SlackOAuthCallback /></PageTransition>} />
        <Route path="/tools" element={<PageTransition><ToolFeed /></PageTransition>} />
        <Route path="/demo" element={<PageTransition><InvestorDemo /></PageTransition>} />
        <Route path="/pretrained" element={<PageTransition><PretrainedDirectory /></PageTransition>} />
        <Route path="/spawn-requests" element={<ProtectedRoute><SpawnApproval /></ProtectedRoute>} />

        {/* Onboarding — protected, appears after signup */}
        <Route path="/onboarding" element={<PageTransition><ProtectedRoute><Onboarding /></ProtectedRoute></PageTransition>} />

        {/* Dashboard surfaces — protected */}
        <Route path="/dashboard" element={<ProtectedRoute><AgentMonitor /></ProtectedRoute>} />
        <Route path="/dashboard/workflow" element={<ProtectedRoute><WorkflowBuilder /></ProtectedRoute>} />
        <Route path="/dashboard/channels" element={<ProtectedRoute><ChannelSetup /></ProtectedRoute>} />
        <Route path="/dashboard/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
        <Route path="/integrations/callback" element={<IntegrationsCallback />} />
        {/* Trust Fabric — protected */}
        <Route path="/dashboard/agent-identity" element={<ProtectedRoute><AgentIdentity /></ProtectedRoute>} />
        <Route path="/dashboard/delegation-tokens" element={<ProtectedRoute><DelegationTokens /></ProtectedRoute>} />
        <Route path="/dashboard/policy-gateway" element={<ProtectedRoute><PolicyGateway /></ProtectedRoute>} />
        <Route path="/dashboard/provenance-ledger" element={<ProtectedRoute><ProvenanceLedger /></ProtectedRoute>} />
        <Route path="/dashboard/memory-governance" element={<ProtectedRoute><MemoryGovernance /></ProtectedRoute>} />

        <Route path="/login" element={<PageTransition><AuthPage mode="login" /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><AuthPage mode="signup" /></PageTransition>} />

        {/* Demo video - cinematic screen recording page */}
        <Route path="/demo-video" element={<DemoVideo />} />

        {/* Legal pages */}
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><CookiePolicy /></PageTransition>} />

        {/* Protected Demo routes - require login */}
        <Route path="/demos/restaurant" element={<PageTransition><ProtectedRoute><RestaurantDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/clinic" element={<PageTransition><ProtectedRoute><ClinicDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/salon" element={<PageTransition><ProtectedRoute><SalonDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/dealership" element={<PageTransition><ProtectedRoute><DealershipDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/construction" element={<PageTransition><ProtectedRoute><ConstructionDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/whatsapp" element={<PageTransition><ProtectedRoute><WhatsAppDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/voice" element={<PageTransition><ProtectedRoute><VoiceDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/business-plan" element={<PageTransition><ProtectedRoute><BusinessPlanDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/real_estate" element={<PageTransition><ProtectedRoute><RealEstateDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/legal" element={<PageTransition><ProtectedRoute><LegalDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/ecommerce" element={<PageTransition><ProtectedRoute><EcommerceDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/education" element={<PageTransition><ProtectedRoute><EducationDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/recruitment" element={<PageTransition><ProtectedRoute><RecruitmentDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/lead-gen" element={<PageTransition><ProtectedRoute><LeadGenDemo /></ProtectedRoute></PageTransition>} />

        {/* Advanced AI Service Demos - Protected */}
        <Route path="/demos/workflow-automation" element={<PageTransition><ProtectedRoute><WorkflowAutomationDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/data-analytics" element={<PageTransition><ProtectedRoute><DataAnalyticsDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/content-generator" element={<PageTransition><ProtectedRoute><ContentGeneratorDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/agent-orchestration" element={<PageTransition><ProtectedRoute><AgentOrchestrationDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/custom-model" element={<PageTransition><ProtectedRoute><CustomModelDemo /></ProtectedRoute></PageTransition>} />

        {/* Fun extras */}
        <Route
          path="/snake"
          element={
            <PageTransition>
              <div className="min-h-screen bg-[#07090d]">
                <SnakeGame onRestart={() => window.location.href = '/'} />
              </div>
            </PageTransition>
          }
        />

        {/* Legacy marketing hub route */}
        <Route
          path="/marketing-hub"
          element={
            <PageTransition>
              <div className="min-h-screen bg-[#07090d]">
                <MarketingHub onRestart={() => window.location.href = '/'} />
              </div>
            </PageTransition>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<PageTransition><Landing /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CookieConsentProvider>
          <ScrollToTop />
          <GoogleSignInWarmup />
          <div className="w-full min-h-screen bg-[#050505] text-white overflow-x-hidden">
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoutes />
            </Suspense>
          </div>
          <AuthModal />
          <CookieBanner />
          <CookiePreferences />
        </CookieConsentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
