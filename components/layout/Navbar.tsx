import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { BrandIcon } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { ServicesPopup } from '../ServicesPopup';
import { AboutPopup } from '../AboutPopup';

const navItems: { name: string; path: string; isPopup?: 'services' | 'about' }[] = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services', isPopup: 'services' },
  { name: 'AI Agents', path: '/agents' },
  { name: 'Use Cases', path: '/use-cases' },
  { name: 'About', path: '/about', isPopup: 'about' },
  { name: 'Pricing', path: '/pricing' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, setShowAuthModal, setAuthModalMode } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/80 border-b border-slate-200 backdrop-blur-md'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="text-blue-600">
                <BrandIcon className="h-8 w-8" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Viktron
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                item.isPopup ? (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => {
                      if (item.isPopup === 'services') setIsServicesOpen(true);
                      if (item.isPopup === 'about') setIsAboutOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (item.isPopup === 'services') setIsServicesOpen(false);
                      if (item.isPopup === 'about') setIsAboutOpen(false);
                    }}
                  >
                    <button
                      onClick={() => {
                        if (item.isPopup === 'services') setIsServicesOpen(!isServicesOpen);
                        if (item.isPopup === 'about') setIsAboutOpen(!isAboutOpen);
                      }}
                      className={`text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900 ${
                        location.pathname.startsWith(item.path) && item.path !== '/' ? 'text-blue-600' : ''
                      }`}
                    >
                      {item.name}
                      <ChevronDown className={`w-3 h-3 transition-transform ${
                        (item.isPopup === 'services' && isServicesOpen) || (item.isPopup === 'about' && isAboutOpen) ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {item.isPopup === 'services' && (
                      <ServicesPopup isOpen={isServicesOpen} onClose={() => setIsServicesOpen(false)} />
                    )}
                    {item.isPopup === 'about' && (
                      <AboutPopup isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 ${
                      location.pathname === item.path ? 'text-blue-600' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {user?.fullName?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 py-2 bg-white border border-slate-200 rounded-lg shadow-lg"
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                  }}
                  className="btn-ghost text-sm font-medium"
                >
                  Sign In
                </button>
              )}
              <Link to="/contact" className="btn btn-primary text-sm">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-slate-900" />
            <div className="relative pt-24 px-6">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.isPopup ? (
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 text-lg font-medium rounded-xl transition-colors text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 text-lg font-medium rounded-xl transition-colors ${
                          location.pathname === item.path
                            ? 'bg-white/10 text-white border border-white/10'
                            : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="mt-4 space-y-3"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-sm font-medium text-white">{user?.fullName}</p>
                        <p className="text-xs text-white/50">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-lg font-medium text-white/70 hover:text-white border border-white/10 rounded-xl bg-slate-800"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setAuthModalMode('login');
                          setShowAuthModal(true);
                        }}
                        className="w-full px-4 py-3 text-center text-lg font-medium text-white/70 hover:text-white border border-white/10 rounded-xl bg-slate-800"
                      >
                        Sign In
                      </button>
                      <Link
                        to="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-center text-lg font-semibold text-slate-950 bg-white rounded-xl"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
