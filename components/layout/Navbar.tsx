import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import { BrandIcon } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'AI Agents', path: '/agents' },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Marketing', path: '/marketing' },
  { name: 'Demos', path: '/demos' },
  { name: 'Store', path: '/store' },
];

const isActivePath = (pathname: string, path: string) => {
  if (path === '/') return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
};

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, setShowAuthModal, setAuthModalMode } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const shellClass = useMemo(() => {
    return isScrolled
      ? 'border-white/15 bg-[#070b16]/82 shadow-[0_16px_32px_rgba(0,0,0,0.35)]'
      : 'border-white/8 bg-[#070b16]/66';
  }, [isScrolled]);

  return (
    <>
      <motion.nav
        initial={{ y: -84 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="container-custom pt-3">
          <div className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 ${shellClass}`}>
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <Link to="/" className="group inline-flex items-center gap-2">
                <BrandIcon className="h-8 w-8" />
                <span className="font-semibold text-slate-100 tracking-tight">Viktron</span>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const active = isActivePath(location.pathname, item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-white/12 text-white'
                          : 'text-slate-300 hover:bg-white/7 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/6 px-3 py-2 hover:bg-white/10 transition-colors"
                    >
                      <div className="h-7 w-7 rounded-full bg-sky-500/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-sky-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100 max-w-[9rem] truncate">
                        {user?.fullName?.split(' ')[0] || 'Account'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-300 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          className="absolute right-0 mt-2 w-56 rounded-xl border border-white/12 bg-[#0d1427]/96 p-2 shadow-2xl backdrop-blur-xl"
                        >
                          <div className="px-3 py-2 border-b border-white/10">
                            <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                            <p className="text-xs text-slate-300 truncate">{user?.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="mt-1 w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/8"
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
                    className="btn-ghost text-sm"
                  >
                    Sign In
                  </button>
                )}

                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      window.location.href = '/contact';
                    } else {
                      setAuthModalMode('signup');
                      setShowAuthModal(true);
                    }
                  }}
                  className="btn-primary text-sm"
                >
                  Get Started
                </button>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/6 text-slate-100 hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#04070f]/92 backdrop-blur-xl" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative mt-24 mx-4 rounded-2xl border border-white/12 bg-[#0c1326]/95 p-4"
            >
              <div className="space-y-1">
                {navItems.map((item) => {
                  const active = isActivePath(location.pathname, item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                        active ? 'bg-white/12 text-white' : 'text-slate-200 hover:bg-white/8'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="rounded-xl border border-white/10 bg-white/6 px-4 py-3">
                      <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                      <p className="text-xs text-slate-300 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn-secondary justify-center"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setAuthModalMode('login');
                      setShowAuthModal(true);
                    }}
                    className="btn-secondary justify-center"
                  >
                    Sign In
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (isAuthenticated) {
                      window.location.href = '/contact';
                    } else {
                      setAuthModalMode('signup');
                      setShowAuthModal(true);
                    }
                  }}
                  className="btn-primary justify-center"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
