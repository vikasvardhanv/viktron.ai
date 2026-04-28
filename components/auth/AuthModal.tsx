import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const toApiBase = (value?: string) => {
  if (!value) return '/api';
  const trimmed = String(value).trim().replace(/\/$/, '');
  if (!trimmed) return '/api';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};
import { Button } from '../ui/Button';
import {
  X, Mail, Lock, User, Building2, Phone, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle2, Loader2, ArrowLeft, Home, Check, Shield
} from 'lucide-react';

// Google Icon
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Apple Icon
const AppleIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

type AuthView = 'options' | 'email-login' | 'email-signup';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [view, setView] = useState<AuthView>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If the user clicks "Back" during the Google redirect flow, many browsers restore the page
  // from the back/forward cache, preserving React state. Reset the OAuth loading UI so the user
  // can try again instead of being stuck on the spinner.
  useEffect(() => {
    const resetOauthUi = () => {
      setOauthLoading(null);
      setIsLoading(false);
    };

    const onPageShow = (event: any) => {
      const nav = (performance.getEntriesByType?.('navigation')?.[0] as any) || null;
      if (event?.persisted || nav?.type === 'back_forward') {
        resetOauthUi();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Defensive: if the tab returns visible while we were mid-flow, clear spinners.
        resetOauthUi();
      }
    };

    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (showAuthModal) {
      setView('options');
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setCompany('');
      setPhone('');
      setAgreeToTerms(false);
    }
  }, [showAuthModal]);

  // Keep modal mode aligned with auth route so /signup never shows login copy.
  useEffect(() => {
    if (!showAuthModal) return;
    if (location.pathname === '/signup' && authModalMode !== 'signup') {
      setAuthModalMode('signup');
    }
    if (location.pathname === '/login' && authModalMode !== 'login') {
      setAuthModalMode('login');
    }
  }, [showAuthModal, location.pathname, authModalMode, setAuthModalMode]);

  // Check for auth errors in URL (from OAuth redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('auth_error');
    if (authError) {
      const errorMessages: Record<string, string> = {
        'no_code': 'Google Sign-In was cancelled.',
        'token_exchange_failed': 'Failed to authenticate with Google. Please try again.',
        'no_email': 'Google did not provide an email address.',
        'email_not_verified': 'Please verify your Google email first.',
        'config_error': 'Google Sign-In is not properly configured.',
        'callback_failed': 'Authentication failed. Please try again.',
        'access_denied': 'Access was denied. Please try again.'
      };
      setError(errorMessages[authError] || 'Google Sign-In failed. Please try again.');
      setShowAuthModal(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [setShowAuthModal]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAuthModal(false);
    };
    if (showAuthModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showAuthModal, setShowAuthModal]);

  const handleSuccess = (isSignup: boolean = false) => {
    setTimeout(() => {
      setShowAuthModal(false);
      // After signup, redirect to onboarding
      if (isSignup) {
        navigate('/onboarding?redirect=/dashboard');
      }
    }, 500);
  };

  // Google Sign-In - Server-side Authorization Code Flow
  const handleGoogleSignIn = () => {
    setOauthLoading('google');
    setError('');
    
    // Get current path to return to after auth.
    // If we're on /login or /signup, prefer the `redirect` query param so we land back on the intended page.
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('redirect');
    const isAuthRoute = window.location.pathname === '/login' || window.location.pathname === '/signup';
    const rawReturnTo = isAuthRoute
      ? (redirectParam || '/')
      : `${window.location.pathname}${window.location.search}`;
    const returnTo = encodeURIComponent(rawReturnTo);
    const apiUrl = toApiBase(import.meta.env.VITE_API_URL);
    
    // Redirect to server endpoint which will redirect to Google
    window.location.href = `${apiUrl}/auth/google?returnTo=${returnTo}`;
  };

  // Apple Sign-In (keeping client-side for now)
  const handleAppleSignIn = async () => {
    setOauthLoading('apple');
    setError('');

    try {
      const AppleID = (window as any).AppleID;
      if (!AppleID?.auth) {
        setError('Apple Sign-In is not available. Please try email sign-in.');
        setOauthLoading(null);
        return;
      }

      setError('Apple Sign-In coming soon. Please use Google or Email.');
      setOauthLoading(null);
    } catch (err: any) {
      if (err.error !== 'popup_closed_by_user') {
        setError('Apple Sign-In failed. Please try email sign-in.');
      }
      setOauthLoading(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (view === 'email-login') {
        const result = await login(email, password);
        if (result.success) {
          setSuccess('Login successful!');
          handleSuccess(false);
        } else {
          setError(result.message);
        }
      } else {
        // Signup validation
        if (!agreeToTerms) {
          setError('Please agree to the Terms and Privacy Policy');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          setIsLoading(false);
          return;
        }

        const result = await signup({ email, password, fullName, company, phone });
        if (result.success) {
          setSuccess('Account created successfully!');
          handleSuccess(true);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAuthModal) return null;

  const isSignUp = authModalMode === 'signup';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setShowAuthModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="obsidian-panel p-10 relative overflow-hidden group">
            <div className="scan-line opacity-10" />
            
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 p-2 rounded-none hover:bg-white/5 transition-colors text-zinc-500 hover:text-primary z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Back button for email forms */}
            {view !== 'options' && (
              <button
                onClick={() => setView('options')}
                className="absolute top-6 left-6 p-2 rounded-none hover:bg-white/5 transition-colors text-zinc-500 hover:text-primary z-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 obsidian-inset flex items-center justify-center border border-white/10 text-primary">
                  <img src="/visuals/viktronlogo.png" alt="Viktron" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-3">
                {view === 'options'
                  ? (isSignUp ? 'Initialize_Agent' : 'Welcome_Back')
                  : view === 'email-login'
                    ? 'Email_Auth_Protocol'
                    : 'Provision_Identity'
                }
              </h2>
              <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.3em]">
                {view === 'options'
                  ? 'Choose_Authentication_Method'
                  : 'Execute_Encrypted_Credential_Sequence'
                }
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 obsidian-inset border border-red-900/30 flex items-center gap-3 text-red-500 font-mono text-[10px] uppercase tracking-widest">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 obsidian-inset border border-primary/30 flex items-center gap-3 text-primary font-mono text-[10px] uppercase tracking-widest">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Options View */}
            {view === 'options' && (
              <div className="space-y-4">
                {/* Google Sign-In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={oauthLoading !== null}
                  className="w-full btn-obsidian flex items-center justify-center gap-4 !py-5"
                >
                  {oauthLoading === 'google' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon />
                      <span>Sync via Google</span>
                    </>
                  )}
                </button>

                {/* Apple Button */}
                <button
                  onClick={handleAppleSignIn}
                  disabled={oauthLoading !== null}
                  className="w-full btn-obsidian flex items-center justify-center gap-4 !py-5"
                >
                  {oauthLoading === 'apple' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <AppleIcon />
                      <span>Sync via Apple</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-[#080808] text-zinc-700 font-mono text-[9px] uppercase tracking-[0.4em]">OR_PROTOCOL</span>
                  </div>
                </div>

                {/* Email Button */}
                <button
                  onClick={() => setView(isSignUp ? 'email-signup' : 'email-login')}
                  disabled={oauthLoading !== null}
                  className="w-full btn-obsidian flex items-center justify-center gap-4 !py-5"
                >
                  <Mail className="h-4 w-4" />
                  <span>Manual Authentication</span>
                </button>

                {/* Terms notice */}
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600 text-center mt-12 leading-relaxed">
                  By continuing, you agree to our{' '}
                  <Link to="/terms" onClick={() => setShowAuthModal(false)} className="text-primary hover:underline">
                    Terms_of_Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" onClick={() => setShowAuthModal(false)} className="text-primary hover:underline">
                    Privacy_Policy
                  </Link>
                </p>

                {/* Go to Home link */}
                <div className="text-center mt-8 pt-8 border-t border-white/5">
                  <Link
                    to="/"
                    onClick={() => setShowAuthModal(false)}
                    className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                  >
                    <Home className="h-3 w-3" />
                    Return_to_Base
                  </Link>
                </div>
              </div>
            )}

            {/* Email Login Form */}
            {view === 'email-login' && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">Institutional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full obsidian-inset border border-white/10 py-4 pl-12 pr-4 text-white font-mono text-xs uppercase tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-zinc-800"
                      placeholder="USER@DOMAIN.COM"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">Access Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full obsidian-inset border border-white/10 py-4 pl-12 pr-12 text-white font-mono text-xs tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-zinc-800"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-acid w-full !py-5 flex items-center justify-center gap-4"
                >
                  {isLoading ? 'Verifying...' : 'Initialize Session'}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-6">
                  Unauthorized?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('signup');
                      setView('email-signup');
                    }}
                    className="text-primary hover:underline font-bold"
                  >
                    Register_ID
                  </button>
                </p>
              </form>
            )}

            {/* Email Signup Form */}
            {view === 'email-signup' && (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">Operator Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full obsidian-inset border border-white/10 py-4 pl-12 pr-4 text-white font-mono text-xs uppercase tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-zinc-800"
                      placeholder="OPERATOR_NAME"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">Institutional Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full obsidian-inset border border-white/10 py-4 pl-12 pr-4 text-white font-mono text-xs uppercase tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-zinc-800"
                      placeholder="USER@ORGANIZATION.COM"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">Access Key *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full obsidian-inset border border-white/10 py-4 pl-12 pr-4 text-white font-mono text-xs tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-zinc-800"
                        placeholder="••••••••"
                        minLength={8}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">Confirm Key *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full obsidian-inset border border-white/10 py-4 pl-12 pr-4 text-white font-mono text-xs tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-zinc-800"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">Organization (Optional)</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full obsidian-inset border border-white/10 py-4 pl-12 pr-4 text-white font-mono text-xs uppercase tracking-widest focus:border-primary focus:outline-none transition-all placeholder:text-zinc-800"
                      placeholder="INSTITUTION_NAME"
                    />
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-4 cursor-pointer group pt-2">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="peer h-5 w-5 appearance-none border border-white/10 obsidian-inset checked:border-primary transition-all cursor-pointer"
                    />
                    <Check className="absolute left-0.5 top-0.5 h-4 w-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    Confirm agreement to the{' '}
                    <Link to="/terms" onClick={() => setShowAuthModal(false)} className="text-primary hover:underline">
                      Terms_of_Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" onClick={() => setShowAuthModal(false)} className="text-primary hover:underline">
                      Privacy_Protocol
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-acid w-full !py-5 flex items-center justify-center gap-4 mt-4"
                >
                  {isLoading ? 'Initializing...' : 'Provision Account'}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="text-center font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-6">
                  Existing Identity?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setView('email-login');
                    }}
                    className="text-primary hover:underline font-bold"
                  >
                    Authenticate
                  </button>
                </p>
              </form>
            )}

            <div className="flex items-center justify-center gap-3 text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-700 mt-12 pt-8 border-t border-white/5">
              <Shield className="h-3.5 w-3.5" />
              <span>256-BIT_SSL_ENCRYPTED_SESSION</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
