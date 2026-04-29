import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AboutPopup } from '../AboutPopup';
import { ProductPopup } from '../ProductPopup';

const navItems: { name: string; path: string; isPopup?: 'product' | 'about'; external?: string }[] = [
  { name: 'Home', path: '/' },
  { name: 'Product', path: '/services/agentirl', isPopup: 'product' },
  { name: 'Trust Fabric', path: '/services/trust-fabric' },
  { name: 'Enterprise', path: '/enterprise' },
  { name: 'About', path: '/about', isPopup: 'about' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<'product' | 'about' | null>(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<'product' | 'about' | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, setShowAuthModal, setAuthModalMode } = useAuth();

  const PRODUCT_LINKS = [
    { label: 'Agent IRL', path: '/services/agentirl', desc: 'The reliability & governance layer.' },
    { label: 'AI Analytics', path: '/analytics', desc: 'Full-length intelligence & telemetry.' },
    { label: 'AI Agents', path: '/agents', desc: 'Specialized autonomous workforce.' },
  ];

  const ABOUT_LINKS = [
    { label: 'Mission', path: '/about', desc: 'The Viktron story and our infrastructure goals.' },
    { label: 'Rent an Agent', path: '/rent', desc: 'Browse and deploy our specialized digital workforce.' },
    { label: 'Careers', path: '/careers', desc: 'Join the infrastructure revolution.' },
    { label: 'Blog', path: '/blog', desc: 'Intelligence reports and engineering logs.' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close popups on navigation
  useEffect(() => {
    setActivePopup(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 h-24 flex items-center ${
          isScrolled
            ? 'bg-[#050505]/90 border-b border-white/5 backdrop-blur-xl'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 obsidian-inset flex items-center justify-center border border-white/10 group-hover:border-primary transition-all duration-500">
                <img src="/visuals/viktronlogo.png" alt="Viktron" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0" />
              </div>
              <span className="heading-precision text-xl uppercase tracking-tighter text-white">Viktron</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = item.path === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.path.split('?')[0]);
                
                return (
                  <div 
                    key={item.path} 
                    className="relative"
                    onMouseEnter={() => item.isPopup && setActivePopup(item.isPopup)}
                    onMouseLeave={() => item.isPopup && setActivePopup(null)}
                  >
                    {item.external ? (
                      <a 
                        href={item.external} 
                        className="px-6 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-all block"
                      >
                        {item.name}
                      </a>
                    ) : (
                     <div className="relative">
                         {item.isPopup ? (
                           <div
                             className={`px-6 py-2.5 flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-[0.3em] transition-all duration-500 relative group cursor-default ${isActive 
                               ? 'text-black bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-400 shadow-[0_0_30px_rgba(132,204,221,0.3)]' 
                               : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'}
                           `}
                           >
                             {item.name} <ChevronDown size={10} className={`transition-transform duration-300 ${activePopup === item.isPopup ? 'rotate-180' : ''}`} />
                             {isActive && (
                               <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-80" />
                             )}
                           </div>
                         ) : (
                           <Link 
                             to={item.path}
                             className={`px-6 py-2.5 flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-[0.3em] transition-all duration-500 relative group ${isActive 
                               ? 'text-black bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-400 shadow-[0_0_30px_rgba(132,204,221,0.3)]' 
                               : 'text-zinc-400 hover:text-white hover:bg-white/5 border-transparent'}
                           `}
                           >
                             {item.name}
                             {isActive && (
                               <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-80" />
                             )}
                           </Link>
                         )}
                       {item.isPopup === 'about' && <AboutPopup isOpen={activePopup === 'about'} onClose={() => setActivePopup(null)} />}
                       {item.isPopup === 'product' && <ProductPopup isOpen={activePopup === 'product'} onClose={() => setActivePopup(null)} />}
                     </div>
                    )}
                  </div>
                );
              })}
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
                        className="absolute right-0 mt-4 w-56 obsidian-panel p-2 z-[100] bg-[#080808]/95 backdrop-blur-xl"
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
                    className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setAuthModalMode('signup'); setShowAuthModal(true); }}
                    className="btn-acid !px-8 !py-3 !text-[9px]"
                  >
                    Deploy Workforce
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-zinc-500 hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-0 left-0 right-0 h-screen bg-[#050505] z-[100] p-8 flex flex-col pt-24 overflow-y-auto"
            >
               <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-zinc-500"><X size={24} /></button>
              <div className="flex flex-col gap-4 mt-8">
                 {navItems.map((item) => {
                   const hasPopup = !!item.isPopup;
                   const isExpanded = mobileExpandedItem === item.isPopup;
                   
                   return (
                     <div key={item.path} className="flex flex-col">
                        <div className="flex items-center justify-between">
                          {hasPopup ? (
                            <button
                              onClick={() => setMobileExpandedItem(isExpanded ? null : item.isPopup)}
                              className={`text-4xl font-black uppercase tracking-tighter transition-all flex-1 py-2 text-left ${isActive ? 'text-lime-400' : 'text-white'}`}
                            >
                              {item.name}
                            </button>
                          ) : (
                            <Link
                              to={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`text-4xl font-black uppercase tracking-tighter transition-all flex-1 py-2 ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path.split('?')[0])) ? 'text-lime-400' : 'text-white'}`}
                            >
                              {item.name}
                            </Link>
                          )}
                          {hasPopup && (
                            <button 
                              onClick={() => setMobileExpandedItem(isExpanded ? null : item.isPopup)}
                              className="p-4 text-zinc-500 hover:text-primary transition-colors"
                            >
                              <ChevronDown size={24} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>

                        {/* Mobile Sub-menu */}
                        <AnimatePresence>
                          {hasPopup && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-white/5 rounded-2xl mt-2 px-4"
                            >
                              <div className="py-4 space-y-6">
                                {(item.isPopup === 'product' ? PRODUCT_LINKS : ABOUT_LINKS).map((sub) => (
                                  <Link
                                    key={sub.path}
                                    to={sub.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block group"
                                  >
                                    <div className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{sub.label}</div>
                                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{sub.desc}</div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                   );
                 })}
              </div>
              <div className="mt-12 mb-8 space-y-4">
                 <button className="w-full btn-acid py-6 uppercase font-mono text-[11px] tracking-widest font-black">Request Access</button>
                 <button className="w-full btn-obsidian py-6 uppercase font-mono text-[11px] tracking-widest font-black">System Status</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};
