import React, { useEffect, useMemo } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ArrowRight, Bot, CheckCircle2, LogIn, Shield, UserPlus, Zap } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

type AuthPageProps = {
  mode: 'login' | 'signup';
};

const getSafeRedirect = (search: string) => {
  const params = new URLSearchParams(search);
  const target = params.get('redirect');
  if (!target) return '/';
  if (!target.startsWith('/') || target.startsWith('//')) return '/';
  if (target === '/login' || target === '/signup') return '/';
  return target;
};

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const { isAuthenticated, isLoading, setShowAuthModal, setAuthModalMode } = useAuth();
  const location = useLocation();
  const redirectPath = useMemo(() => getSafeRedirect(location.search), [location.search]);
  const isSignup = mode === 'signup';

  const authToggleHref = useMemo(() => {
    const target = isSignup ? '/login' : '/signup';
    const params = new URLSearchParams();
    params.set('redirect', redirectPath);
    return `${target}?${params.toString()}`;
  }, [isSignup, redirectPath]);

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    setAuthModalMode(mode);
    setShowAuthModal(true);

    return () => {
      setShowAuthModal(false);
    };
  }, [isLoading, isAuthenticated, mode, setAuthModalMode, setShowAuthModal]);

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Layout showFooter={false}>
      <SEO
        title={isSignup ? 'Create Account' : 'Sign In'}
        description="Sign in or create a Viktron account."
        url={isSignup ? '/signup' : '/login'}
        noindex
      />

      <section className="min-h-screen pt-28 pb-16 px-4 flex items-start justify-center">
        <div className="w-full max-w-md">
          <article className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              {isSignup ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </div>

            <h1 className="text-2xl font-semibold text-slate-900">
              {isSignup ? 'Create your Viktron account' : 'Sign in to Viktron'}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {isSignup
                ? 'Get started with AI agent teams for your business.'
                : 'Welcome back. Access your agents and workspace.'}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full justify-center"
                onClick={() => {
                  setAuthModalMode(mode);
                  setShowAuthModal(true);
                }}
                icon={<ArrowRight className="h-5 w-5" />}
              >
                {isSignup ? 'Create Free Account' : 'Sign In'}
              </Button>
              <Link to={redirectPath} className="w-full">
                <Button variant="secondary" size="lg" className="w-full justify-center">
                  Back to site
                </Button>
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link to={authToggleHref} className="text-blue-600 font-semibold hover:text-blue-700">
                {isSignup ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </article>

          {isSignup && (
            <div className="mt-6 space-y-3">
              {[
                { icon: Zap, text: 'Deploy AI agent teams in minutes' },
                { icon: Bot, text: 'Sales, Support, Content & CEO agents' },
                { icon: Shield, text: 'Enterprise-grade security & compliance' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3">
                  <item.icon className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-sm text-slate-600">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};
