import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';

const footerLinks = {
  platform: [
    { name: 'AI Agent Teams', path: '/services/ai-sales-agent' },
    { name: 'Voice & Chat Agents', path: '/services/voice-ai-agent' },
    { name: 'AgentIRL Platform', path: '/services/agent-orchestration' },
    { name: 'Analytics & Observability', path: '/services/data-analytics-ai' },
    { name: 'AI Audit & Consulting', path: '/services/ai-audit-consulting' },
  ],
  resources: [
    { name: 'All Services', path: '/services' },
    { name: 'Use Cases', path: '/use-cases' },
    { name: 'AI Agents', path: '/agents' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
  ],
  company: [
    { name: 'About', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ]
};

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 font-mono">Viktron</span>
            </Link>
            <p className="text-slate-600 mb-6 max-w-sm leading-relaxed">
              The control plane for autonomous agents. Ensure reliability, security, and compliance for your AI workforce.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all shadow-sm">
                <Github size={18} />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all shadow-sm">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all shadow-sm">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all shadow-sm">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
           <div>
            <h4 className="font-semibold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Viktron Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};


