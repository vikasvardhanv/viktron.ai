import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, MessageSquare, Code2, Smartphone } from 'lucide-react';


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const features = [
  {
    title: 'AI Agents',
    description: 'Industry-specific AI agents for restaurants, clinics, salons, dealerships, and more.',
    icon: MessageSquare,
  },
  {
    title: 'Marketing Hub',
    description: 'Automate your marketing campaigns across multiple channels with ease.',
    icon: BarChart3,
  },
  {
    title: 'Chatbot Development',
    description: 'Custom AI chatbots that engage customers 24/7 with natural conversations.',
    icon: MessageSquare,
  },
  {
    title: 'Workflow Automation',
    description: 'Streamline your business processes with intelligent automation.',
    icon: Zap,
  },
  {
    title: 'Web Development',
    description: 'Modern, responsive websites built for performance and conversion.',
    icon: Code2,
  },
  {
    title: 'SaaS Solutions',
    description: 'End-to-end SaaS development with AI-powered features.',
    icon: Smartphone,
  },
];

export const Landing: React.FC = () => {

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <div className="text-lg font-bold text-blue-600">Viktron</div>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
            <a href="#solutions" className="text-slate-600 hover:text-slate-900">Solutions</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900">Pricing</a>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary">Sign In</button>
            <button className="btn-primary">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding border-b border-slate-200">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            >
              Transform Your Business with{' '}
              <span className="text-blue-600">Intelligent AI</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              From chatbots to automation, we build the technology that drives growth.
              Simple, powerful, and designed for your business.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button className="btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-lg">
                <span>Try Live Demo</span>
                <Zap size={18} />
              </button>
              <button className="btn-secondary flex items-center justify-center gap-2 px-8 py-3 rounded-lg">
                <span>Learn More</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 justify-center text-sm text-slate-600"
            >
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-blue-600" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-blue-600" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-600" />
                <span>Advanced Analytics</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding border-b border-slate-200 bg-slate-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Solutions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              AI That Works for You. From customer service to marketing automation,
              our AI solutions are designed to scale your business intelligently.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card group hover:border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <feature.icon size={24} className="text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-slate-900 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Start with a free demo and see how Viktron AI can drive growth for your business.
          </p>
          <button className="btn-primary bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-lg inline-flex items-center gap-2">
            <span>Get Started Now</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Viktron</h4>
              <p className="text-sm text-slate-600">AI-powered business automation platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">Features</a></li>
                <li><a href="#" className="hover:text-slate-900">Pricing</a></li>
                <li><a href="#" className="hover:text-slate-900">Demos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">About</a></li>
                <li><a href="#" className="hover:text-slate-900">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-900">Terms</a></li>
                <li><a href="#" className="hover:text-slate-900">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2026 Viktron. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
