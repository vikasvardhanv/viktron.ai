import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ServicesPopup } from '../ServicesPopup';
import { AboutPopup } from '../AboutPopup';

const navItems: { name: string; path: string; isPopup?: 'services' | 'about'; external?: string }[] = [
  { name: 'Home', path: '/' },
  { name: 'AgentIRL', path: '/services/agentirl' },
  { name: 'Trust Fabric', path: '/services/trust-fabric' },
  { name: 'Analytics', path: 'https://analytics.viktron.ai', external: 'https://analytics.viktron.ai' },
  { name: 'Enterprise', path: '/enterprise' },
  { name: 'About', path: '/about', isPopup: 'about' },
];

const isRentSubdomain = typeof window !== 'undefined' && window.location.hostname.split('.')[0] === 'rent';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, setShowAuthModal, setAuthModalMode } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#050505]/80 border-b border-white/5 backdrop-blur-xl py-4'
            : 'bg-transparent border-b border-transparent py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 obsidian-inset flex items-center justify-center border border-white/10 group-hover:border-primary transition-all duration-500">
                <img src="/visuals/viktronlogo.png" alt="Viktron" className="w-5 h-5 object-contain grayscale group-hover:grayscale-0" />
              </div>
              <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">Viktron</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <div key={item.path} className="relative group/item">
                  {item.external ? (
                    <a 
                      href={item.external} 
                      className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : item.isPopup ? (
                    <div 
                      onMouseEnter={() => setIsAboutOpen(true)}
                      onMouseLeave={() => setIsAboutOpen(false)}
                      className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      {item.name} <ChevronDown size={10} />
                      <AboutPopup isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
                    </div>
                  ) : (
                    <Link 
                      to={item.path} 
                      className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors ${
                        location.pathname === item.path ? 'text-primary' : 'text-zinc-400 hover:text-primary'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                  <div className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-500 ${
                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover/item:w-full'
                  }`} />
                </div>
              ))}
            </div>

            {/* CTA / Auth */}
            <div className="hidden lg:flex items-center gap-8">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full obsidian-inset flex items-center justify-center border border-white/10 group-hover:border-primary">
                      <User size={14} className="text-zinc-500" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{user?.fullName?.split(' ')[0]}</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-56 glass-bone p-2 overflow-hidden z-[100]"
                      >
                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                           <div className="text-[10px] font-mono text-zinc-500 truncate">{user?.email}</div>
                        </div>
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <LogOut size={12} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                   <button
                    onClick={() => { setAuthModalMode('login'); setShowAuthModal(true); }}
                    className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setAuthModalMode('signup'); setShowAuthModal(true); }}
                    className="btn-acid !px-6 !py-2.5 !text-[9px]"
                  >
                    Deploy Agents
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-zinc-400 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 top-0 left-0 right-0 h-screen bg-[#050505] z-40 p-6 flex flex-col pt-32"
            >
              <div className="flex flex-col gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-mono uppercase tracking-widest text-white hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto space-y-4">
                 <button className="w-full btn-acid py-5">Request Access</button>
                 <button className="w-full btn-obsidian py-5">Documentation</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};
