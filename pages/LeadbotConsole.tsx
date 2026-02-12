import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { Leadbot } from '../components/Leadbot';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

const ACCESS_EMAIL = 'info@viktron.ai';
const ACCESS_PASSWORD = 'Viktron.ai1@';
const ACCESS_KEY = 'leadbot_access';

export const LeadbotConsole: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsUnlocked(localStorage.getItem(ACCESS_KEY) === 'true');
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === ACCESS_EMAIL && password === ACCESS_PASSWORD) {
      localStorage.setItem(ACCESS_KEY, 'true');
      setIsUnlocked(true);
      setError('');
      setPassword('');
      return;
    }

    setError('Access denied. Check your email or password.');
  };

  const handleLock = () => {
    localStorage.removeItem(ACCESS_KEY);
    setIsUnlocked(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <Layout>
      <SEO
        title="Lead Gen Console | Viktron"
        description="Private lead generation console for scraping leads and launching outreach."
      />
      <section className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Private Access</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold text-white">Lead Gen Console</h1>
            <p className="mt-4 text-lg text-white/70">
              Use this workspace to scrape leads, append to your Google Sheet, and launch outreach
              when you are ready.
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            {isUnlocked ? (
              <div className="w-full flex flex-col items-center gap-6">
                <div className="flex items-center justify-end w-full max-w-md">
                  <Button variant="secondary" size="sm" onClick={handleLock}>
                    Lock console
                  </Button>
                </div>
                <Leadbot mode="page" />
              </div>
            ) : (
              <GlassCard className="w-full max-w-md p-8">
                <h2 className="text-2xl font-semibold text-white">Sign in to unlock</h2>
                <p className="mt-2 text-sm text-white/60">
                  This console is restricted. Please sign in with your approved credentials.
                </p>
                <form onSubmit={handleUnlock} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@viktron.ai"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-sky-400/60"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-sky-400/60"
                      required
                    />
                  </div>
                  {error ? <p className="text-sm text-rose-300">{error}</p> : null}
                  <Button type="submit" className="w-full">
                    Unlock console
                  </Button>
                </form>
              </GlassCard>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};
