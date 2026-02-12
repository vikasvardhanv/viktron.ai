import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrandIcon, TikTokIcon, FacebookIcon, InstagramIcon, YoutubeIcon, XIcon } from '../../constants';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'AI Agents', path: '/agents' },
    { name: 'Marketing Hub', path: '/marketing' },
    { name: 'All Services', path: '/services' },
    { name: 'Live Demos', path: '/demos' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'White-Label Solution', path: '/white-label' },
  ],
  company: [
    { name: 'Contact Us', path: '/contact' },
    { name: 'Careers', path: '/careers' },
    { name: 'Lead Gen Console', path: '/leadbot' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ],
  quickLinks: [
    { name: 'Restaurant AI', path: '/demos/restaurant' },
    { name: 'Clinic AI', path: '/demos/clinic' },
    { name: 'Salon AI', path: '/demos/salon' },
    { name: 'Real Estate AI', path: '/demos/real_estate' },
    { name: 'Legal AI', path: '/demos/legal' },
  ],
};

const socialLinks = [
  { icon: <TikTokIcon />, href: 'https://www.tiktok.com/@viktron', label: 'TikTok' },
  { icon: <FacebookIcon />, href: 'https://www.facebook.com/profile.php?id=61582587125978', label: 'Facebook' },
  { icon: <InstagramIcon />, href: 'https://www.instagram.com/viktron.ai/', label: 'Instagram' },
  { icon: <YoutubeIcon />, href: 'https://www.youtube.com/@viktron', label: 'YouTube' },
  { icon: <XIcon />, href: 'https://x.com/viktronai', label: 'X' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="text-blue-600">
                <BrandIcon className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold text-slate-900">Viktron</span>
            </Link>
            <p className="text-slate-600 mb-6 max-w-sm leading-relaxed">
              The next era of intelligence. We build AI solutions that transform businesses and create
              exceptional customer experiences.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a href="mailto:info@viktron.ai" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@viktron.ai</span>
              </a>
              <a href="tel:+18446608065" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                <Phone className="h-4 w-4" />
                <span>+1 (844) 660-8065</span>
              </a>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="h-4 w-4" />
                <span>Chicago, IL</span>
              </div>
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Viktron. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
