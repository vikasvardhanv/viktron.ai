import React, { useEffect, useMemo } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
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
          <div className="h-12 w-12 rounded-full border-2 border-[#d8e1ee] border-t-[#3568e4] animate-spin" />
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

      <section className="min-h-screen pt-28 pb-16 px-4">
        <div className="container-custom max-w-2xl">
          <article className="rounded-3xl border border-[#d8e2ef] bg-white p-8 sm:p-10 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3fd] text-[#3768e8]">
              {isSignup ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </div>

            <h1 className="text-3xl font-semibold text-[#12223e]">
              {isSignup ? 'Create your Viktron account' : 'Sign in to Viktron'}
            </h1>
            <p className="mt-3 text-[#54657f]">
              {isSignup
                ? 'Create a free account to access demos, saved sessions, and personalized recommendations.'
                : 'Welcome back. Sign in to access your demos and workspace.'}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => {
                  setAuthModalMode(mode);
                  setShowAuthModal(true);
                }}
                icon={<ArrowRight className="h-5 w-5" />}
              >
                {isSignup ? 'Create account' : 'Sign in'}
              </Button>
              <Link to={redirectPath}>
                <Button variant="secondary" size="lg">
                  Back to site
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-[#657795]">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link to={authToggleHref} className="text-[#2d4f95] font-semibold">
                {isSignup ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </article>
        </div>
      </section>
    </Layout>
  );
};
