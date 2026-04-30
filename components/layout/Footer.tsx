import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, MessageSquare, Shield } from 'lucide-react';

const footerLinks = {
  platform: [
    { name: 'Agent', path: '/onboarding' },
    { name: 'AgentIRL', path: '/services/agentirl' },
    { name: 'Analytics + Consulting', path: 'https://analytics.viktron.ai', external: true },
    { name: 'Rentals', path: '/rent' },
  ],
  resources: [
    { name: 'Enterprise', path: '/enterprise' },
    { name: 'All Services', path: '/services' },
    { name: 'Use Cases', path: '/use-cases' },
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
    <footer className="bg-[#050505] border-t border-white/5 pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
          <div className="lg:col-span-2 space-y-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 obsidian-inset flex items-center justify-center border border-white/10 group-hover:border-primary transition-all duration-500">
                <img src="/visuals/viktronlogo.png" alt="Viktron logo" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0" />
              </div>
              <span className="font-bold text-xl tracking-tighter text-white font-mono uppercase">Viktron</span>
            </Link>
            
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              The Enterprise Control Plane for autonomous agents. 
              Implementing high-trust governance and infrastructure reliability 
              for the agentic era.
            </p>

            <div className="flex items-center gap-6">
              {[Github, Twitter, Linkedin, MessageSquare].map((Icon, i) => (
                <a key={i} href="#" className="text-zinc-400 hover:text-primary transition-colors duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-8 font-bold text-glow">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.path} className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-8 font-bold text-glow">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-8 font-bold text-glow">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
           <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-8 font-bold text-glow">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} Viktron Inc. [GLOBAL_HQ] | Last updated: April 29, 2026 | <a href="https://seojuice.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">v2.2_INSTITUTIONAL</a>
          </p>
          <div className="flex items-center gap-3 text-[10px] font-mono text-primary font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.8)]"></span>
            SYSTEMS_OPERATIONAL // VERIFIED
          </div>
        </div>
      </div>
    </footer>
  );
};
