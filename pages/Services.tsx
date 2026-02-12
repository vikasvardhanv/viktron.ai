import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { Button } from '../components/ui/Button';
import { SERVICES } from '../constants';
import { Service } from '../types';
import {
  ArrowRight, ChevronRight, Zap, TrendingUp, Clock, Shield, Users,
  MessageSquare, Mic, Video, Mail, Building2, Megaphone, Settings, Lightbulb,
  CheckCircle2, Phone, Calendar, Bot, X, Play, ExternalLink, Check
} from 'lucide-react';

// Map service IDs to routes
const serviceRoutes: Record<string, string> = {
  industry_agents: '/agents',
  automotive_ai: '/agents',
  realestate_ai: '/agents',
  hospitality_ai: '/agents',
  ecommerce_ai: '/agents',
  marketing_hub: '/marketing',
  whatsapp_bot: '/demos/whatsapp',
  chatbot: '/contact',
  voice_agent: '/demos/voice',
  video_agent: '/contact',
  email_agent: '/contact',
  support_agent: '/contact',
  business_plan: '/demos/business-plan',
  website_creation: '/marketing',
  content: '/marketing',
  seo_aeo: '/marketing',
  social_automation: '/marketing',
  lead_generation: '/demos/lead-gen',
  automation: '/contact',
  crm_automation: '/contact',
  integrations: '/contact',
  model: '/contact',
  data_analytics: '/contact',
  business_intelligence: '/contact',
  ai_consulting: '/contact',
  ai_audit: '/contact',
  ai_training: '/contact',
};

// Service categories with icons and descriptions
const categories = [
  { id: 'all', name: 'All Services', icon: <Zap className="h-4 w-4" />, count: 0 },
  { id: 'agents', name: 'AI Agents', icon: <Bot className="h-4 w-4" />, desc: 'Chat, Voice, Video & Messaging' },
  { id: 'industry', name: 'Industries', icon: <Building2 className="h-4 w-4" />, desc: 'Sector-specific solutions' },
  { id: 'marketing', name: 'Marketing', icon: <Megaphone className="h-4 w-4" />, desc: 'Growth & content automation' },
  { id: 'automation', name: 'Automation', icon: <Settings className="h-4 w-4" />, desc: 'Workflows & integrations' },
  { id: 'consulting', name: 'Consulting', icon: <Lightbulb className="h-4 w-4" />, desc: 'Strategy & training' },
];

// Hero stats
const heroStats = [
  { value: '50+', label: 'AI Solutions Deployed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '2 Weeks', label: 'Avg. Deployment' },
];

// Detailed process steps
const processSteps = [
  {
    step: '01',
    title: 'Discovery Call',
    desc: 'We learn about your business, challenges, and goals. Identify high-impact AI opportunities.',
    duration: '30 min call',
    icon: <Phone className="h-6 w-6" />,
    details: ['Business analysis', 'Pain point mapping', 'Opportunity assessment', 'ROI estimation']
  },
  {
    step: '02',
    title: 'Solution Design',
    desc: 'Our team architects a custom AI solution tailored to your specific workflows and systems.',
    duration: '3-5 days',
    icon: <Lightbulb className="h-6 w-6" />,
    details: ['Technical architecture', 'Integration planning', 'UX/conversation design', 'Security review']
  },
  {
    step: '03',
    title: 'Build & Train',
    desc: 'We develop your AI agents, train them on your data, and integrate with your existing tools.',
    duration: '1-4 weeks',
    icon: <Settings className="h-6 w-6" />,
    details: ['Agent development', 'Knowledge base setup', 'API integrations', 'Testing & QA']
  },
  {
    step: '04',
    title: 'Launch & Optimize',
    desc: 'Go live with full support. We monitor performance and continuously improve your AI.',
    duration: 'Ongoing',
    icon: <TrendingUp className="h-6 w-6" />,
    details: ['Deployment', 'Team training', 'Performance monitoring', 'Continuous optimization']
  },
];

// What's included
const included = [
  'Custom AI agent development',
  'Integration with your existing tools',
  'Dedicated project manager',
  'Training for your team',
  '24/7 monitoring & support',
  'Regular performance reports',
  'Continuous optimization',
  'Scalable infrastructure',
];

// Tech partners
const techStack = [
  'OpenAI', 'Anthropic', 'Google Gemini', 'Meta Llama', 'LangChain',
  'Pinecone', 'Twilio', 'SendGrid', 'Salesforce', 'HubSpot', 'Zapier', 'Make'
];

// Service Detail Modal Component
const ServiceDetailModal: React.FC<{
  service: Service | null;
  onClose: () => void;
  onDemo: (demoId: string) => void;
  onContact: () => void;
}> = ({ service, onClose, onDemo, onContact }) => {
  if (!service) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#020617] rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="text-blue-600 mt-1 p-2 bg-blue-50 rounded-lg">
              {service.icon}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{service.name}</h2>
                {service.highlight && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    service.highlight === 'New'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {service.highlight}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm">{service.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Long Description */}
          {service.longDescription && (
            <div>
              <p className="text-slate-400 text-lg leading-relaxed">
                {service.longDescription}
              </p>
            </div>
          )}

          {/* Benefits & Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-700">
                      <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Features Included
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-700 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Use Cases */}
          {service.useCases && service.useCases.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Perfect For
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.useCases.map((useCase, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-sm font-medium"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Integrations */}
          {service.integrations && service.integrations.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-amber-600" />
                Integrates With
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.integrations.map((integration, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-sm font-medium"
                  >
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="sticky bottom-0 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/10 bg-white/5">
          <p className="text-slate-500 text-sm">
            Ready to get started? Let's discuss your needs.
          </p>
          <div className="flex items-center gap-3">
            {service.demoId && (
              <Button
                variant="secondary"
                icon={<Play className="h-4 w-4" />}
                onClick={() => onDemo(service.demoId!)}
              >
                Try Demo
              </Button>
            )}
            <Button
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={onContact}
            >
              Get Quote
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Services: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Calculate category counts
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return SERVICES.filter(s => s.id !== 'snake' && s.id !== 'external_website').length;
    }
    return SERVICES.filter(s => s.category === categoryId).length;
  };

  const filteredServices = SERVICES.filter(service => {
    if (activeCategory === 'all') return true;
    return service.category === activeCategory;
  }).filter(service => service.id !== 'snake' && service.id !== 'external_website');

  // Handle modal close with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedService(null);
      }
    };
    if (selectedService) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  // Handle URL-based service selection
  useEffect(() => {
    if (serviceId) {
      const service = SERVICES.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      } else {
        const element = document.getElementById(serviceId);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-4');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-4');
            }, 2000);
          }, 500);
        }
      }
    }
  }, [serviceId]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const handleDemo = (demoId: string) => {
    setSelectedService(null);
    // Redirect to /white-label for white label demo
    if (demoId === 'white_label') {
      if (!isAuthenticated) {
        navigate('/login?redirect=/white-label');
      } else {
        navigate('/white-label');
      }
    } else {
      if (!isAuthenticated) {
        navigate(`/login?redirect=/demos/${demoId}`);
      } else {
        navigate(`/demos/${demoId}`);
      }
    }
  };

  const handleContact = () => {
    setSelectedService(null);
    navigate('/contact');
  };

  return (
    <Layout>
      <SEO
        title="Digital Marketing Services & AI Solutions | Viktron"
        description="Leading AI automation agency offering AI chatbots, voice agents, WhatsApp automation, video agents, business process automation, and AI consulting services. Custom agentic AI solutions for businesses."
        url="/services"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-50 border border-blue-100">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">Full-Service AI Agency</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tight">
                AI Solutions That
                <br />
                <span className="text-blue-600">Actually Work</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                From intelligent agents that handle your customers 24/7 to automation that eliminates repetitive work.
                We build AI that delivers real ROI.
              </p>
            </AnimatedSection>

            {/* Hero Stats */}
            <AnimatedSection delay={0.3}>
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                {heroStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-[#020617] rounded-xl shadow-sm border border-white/10 w-40">
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" icon={<Calendar className="h-5 w-5" />}>
                    Book Free Consultation
                  </Button>
                </Link>
                <Link to="/case-studies">
                  <Button variant="secondary" size="lg">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 border-y border-white/10 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-white/5 text-slate-400 hover:bg-slate-100 hover:text-white border border-white/10'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    activeCategory === category.id ? 'bg-[#020617]/20' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {getCategoryCount(category.id)}
                  </span>
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-white/5/50">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <StaggerItem key={service.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="h-full"
                >
                  <div
                    id={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="block h-full cursor-pointer"
                  >
                    <div className="card p-6 h-full group hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all relative overflow-hidden bg-[#020617] rounded-2xl border border-white/10">
                      {/* Highlight Badge */}
                      {service.highlight && (
                        <div className="absolute top-4 right-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            service.highlight === 'New'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {service.highlight}
                          </span>
                        </div>
                      )}

                      {/* Icon */}
                      <div className="mb-5 p-3 rounded-xl bg-blue-50 w-fit text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {service.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>

                      {/* CTA */}
                      <div className="mt-auto flex items-center gap-2 text-blue-600 text-sm font-semibold group-hover:gap-3 transition-all">
                        Learn more
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How We Work - Detailed */}
      <section className="py-20 px-4 bg-[#020617] border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-4 block">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              How We Build Your AI
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A proven process that takes you from idea to deployed AI in weeks, not months.
            </p>
          </AnimatedSection>

          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card p-8 bg-[#020617] border border-white/10 rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Step Number & Icon */}
                    <div className="flex md:flex-col items-center gap-4 md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                      <div className="text-5xl font-black text-slate-100">{step.step}</div>
                      <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2 md:pt-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-xs font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-6 leading-relaxed">{step.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.details.map((detail, i) => (
                          <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-700 text-sm font-medium border border-white/10">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4 bg-white/5 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-4 block">
                What's Included
              </span>
              <h2 className="text-4xl font-black text-white mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Every engagement includes comprehensive support to ensure your AI solution delivers results.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {included.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card p-8 bg-[#020617] border border-white/10 shadow-xl shadow-blue-900/5">
                <h3 className="text-xl font-bold text-white mb-6">Technologies We Use</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-sm font-medium hover:bg-[#020617] hover:border-blue-200 hover:text-blue-600 hover:shadow-sm transition-all cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-[#020617] border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Why Businesses Choose Viktron.ai
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Clock className="h-6 w-6" />, title: 'Fast Deployment', desc: 'Go live in 2-4 weeks, not months', metric: '2-4 Weeks' },
              { icon: <Shield className="h-6 w-6" />, title: 'Enterprise Security', desc: 'SOC 2 compliant, encrypted, GDPR ready', metric: '100% Secure' },
              { icon: <TrendingUp className="h-6 w-6" />, title: 'Proven ROI', desc: 'Average 300% return on investment', metric: '300% ROI' },
              { icon: <Users className="h-6 w-6" />, title: 'Dedicated Support', desc: '24/7 monitoring and optimization', metric: '24/7 Support' },
            ].map((item, index) => (
              <StaggerItem key={index}>
                <div className="card p-6 h-full text-center hover:shadow-lg transition-all border border-white/10">
                  <div className="inline-flex p-3 rounded-xl bg-blue-50 text-blue-600 mb-4">
                    {item.icon}
                  </div>
                  <div className="text-2xl font-black text-white mb-2">{item.metric}</div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="card p-12 text-center relative overflow-hidden bg-blue-600 text-white rounded-3xl shadow-2xl shadow-blue-600/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#020617]/10 blur-[60px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[60px] rounded-full" />
              
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-white mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Book a free 30-minute consultation. We'll analyze your business and show you exactly how AI can help.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/contact">
                    <Button size="lg" className="bg-[#020617] text-blue-600 hover:bg-blue-50 border-transparent shadow-lg" icon={<ArrowRight className="h-5 w-5" />}>
                      Book Free Consultation
                    </Button>
                  </Link>
                  <Link to="/demos">
                    <Button variant="secondary" size="lg" className="bg-blue-700 text-white border-blue-500 hover:bg-blue-800">
                      Try Live Demos
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-blue-200 mt-8 font-medium">No commitment required. See real results in action.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onDemo={handleDemo}
            onContact={handleContact}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};
