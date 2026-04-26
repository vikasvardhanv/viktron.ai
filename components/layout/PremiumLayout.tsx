/**
 * Premium Page Layout
 * Consistent header, footer, and page structure
 */

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  heroImage?: string;
}

export const PremiumLayout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  description, 
  heroImage 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <nav className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white hover:text-emerald-400 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <span>Viktron</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Docs', href: '/docs' },
              { label: 'Blog', href: '/blog' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Docs', href: '/docs' },
                { label: 'Blog', href: '/blog' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-slate-400 hover:text-white transition-colors text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-grow">
        {title && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-b border-slate-800/50 bg-gradient-to-b from-slate-900 to-slate-950 py-12 md:py-16 lg:py-20"
          >
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
              {description && (
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">{description}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950 mt-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h4 className="font-bold text-white mb-4">Viktron</h4>
              <p className="text-slate-400 text-sm">
                Deploy multi-agent teams in minutes with enterprise governance built-in.
              </p>
            </div>

            {/* Product */}
            <div>
              <h5 className="font-semibold text-white mb-4">Product</h5>
              <ul className="space-y-2 text-sm">
                {['Features', 'Pricing', 'Docs', 'API'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h5 className="font-semibold text-white mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="font-semibold text-white mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                {['Privacy', 'Terms', 'Cookie Policy', 'Security'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © 2024 Viktron AI. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumLayout;
