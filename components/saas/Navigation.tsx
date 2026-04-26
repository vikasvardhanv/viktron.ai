import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  ctas?: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
}

export const Navbar: React.FC<NavbarProps> = ({
  logo = 'Viktron',
  links = [],
  ctas = [],
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500" />
            <span className="text-lg font-bold text-white hidden sm:inline">{logo}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {ctas.map((cta, idx) => (
              <a
                key={idx}
                href={cta.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  cta.variant === 'primary'
                    ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-600'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {cta.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-700/50 mt-4 pt-4 space-y-4"
            >
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="block text-sm text-slate-400 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-700/50">
                {ctas.map((cta, idx) => (
                  <a
                    key={idx}
                    href={cta.href}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-200 ${
                      cta.variant === 'primary'
                        ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-600'
                        : 'border border-slate-700 text-slate-300 hover:text-white'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

interface FooterProps {
  columns?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
}

export const Footer: React.FC<FooterProps> = ({
  columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Roadmap', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookies', href: '#' },
      ],
    },
  ],
}) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-700/50">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-4 mb-8">
          {/* Branding */}
          <div>
            <div className="h-8 w-8 rounded-lg bg-emerald-500 mb-4" />
            <p className="text-sm text-slate-400">
              Deploy multi-agent teams in minutes, not months.
            </p>
          </div>

          {/* Links */}
          {columns.map((col, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-white mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, lidx) => (
                  <li key={lidx}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2025 Viktron. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SaaSLayoutProps {
  children: React.ReactNode;
  navbar?: React.ReactNode;
  footer?: React.ReactNode;
}

export const SaaSLayout: React.FC<SaaSLayoutProps> = ({ children, navbar, footer }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {navbar}
      <main className="w-full">{children}</main>
      {footer}
    </div>
  );
};
