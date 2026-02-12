import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { BrandIcon, FacebookIcon, InstagramIcon, TikTokIcon, XIcon, YoutubeIcon } from '../../constants';

const footerLinks = {
  services: [
    { name: 'AI Agents', path: '/agents' },
    { name: 'Marketing Hub', path: '/marketing' },
    { name: 'All Services', path: '/services' },
    { name: 'Live Demos', path: '/demos' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'White Label', path: '/white-label' },
  ],
  company: [
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
    { name: 'Lead Console', path: '/leadbot' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
  ],
  demos: [
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
    <footer className="relative border-t border-[#d5deeb] bg-[#f8faff]">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <BrandIcon className="h-8 w-8" />
              <span className="text-xl font-semibold text-[#13213a] tracking-tight">Viktron</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#51617c]">
              We build production-ready AI experiences for modern teams: agents, automation,
              custom integrations, and go-to-market acceleration.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href="mailto:info@viktron.ai" className="inline-flex items-center gap-2 text-[#51617c] hover:text-[#1e3050]">
                <Mail className="h-4 w-4 text-[#3568e4]" />
                info@viktron.ai
              </a>
              <a href="tel:+18446608065" className="block inline-flex items-center gap-2 text-[#51617c] hover:text-[#1e3050]">
                <Phone className="h-4 w-4 text-[#3568e4]" />
                +1 (844) 660-8065
              </a>
              <p className="inline-flex items-center gap-2 text-[#51617c]">
                <MapPin className="h-4 w-4 text-[#3568e4]" />
                Chicago, IL
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8ba8] mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="group inline-flex items-center gap-1 text-sm text-[#51617c] hover:text-[#1e3050]">
                    {link.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8ba8] mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="group inline-flex items-center gap-1 text-sm text-[#51617c] hover:text-[#1e3050]">
                    {link.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a8ba8] mb-4">Demo Routes</h3>
            <ul className="space-y-3">
              {footerLinks.demos.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="group inline-flex items-center gap-1 text-sm text-[#51617c] hover:text-[#1e3050]">
                    {link.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[#dbe4f1] pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="h-9 w-9 rounded-full border border-[#d4deec] bg-[#f4f8fe] text-[#4f5f79] hover:text-[#1e3050] hover:bg-[#eaf1fc] inline-flex items-center justify-center"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-xs text-[#7586a3]">
            &copy; {new Date().getFullYear()} Viktron. Built for teams shipping real AI products.
          </p>
        </div>
      </div>
    </footer>
  );
};
