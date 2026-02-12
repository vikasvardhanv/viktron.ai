import React, { useEffect, useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';
import { Leadbot } from '../components/Leadbot';

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

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
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
      <SEO title="Lead Gen Console | Viktron" description="Private lead generation console for outreach workflows." />

      <section className="pt-32 pb-20 px-4">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f83a1]">Private workspace</p>
            <h1 className="mt-3 text-5xl sm:text-6xl font-semibold tracking-tight text-[#12223e]">Lead Gen Console</h1>
            <p className="mt-4 text-lg text-[#52637e]">
              Use this workspace to scrape leads, push records, and launch outreach campaigns.
            </p>
          </div>

          <div className="mt-8">
            {isUnlocked ? (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button variant="secondary" size="sm" onClick={handleLock} icon={<Lock className="h-4 w-4" />}>
                    Lock Console
                  </Button>
                </div>
                <Leadbot mode="page" />
              </div>
            ) : (
              <div className="max-w-md rounded-3xl border border-[#d8e2ef] bg-white p-7">
                <h2 className="text-2xl font-semibold text-[#12223e]">Sign in to unlock</h2>
                <p className="mt-2 text-sm text-[#5c6d89]">This workspace is restricted to approved credentials.</p>

                <form onSubmit={handleUnlock} className="mt-5 space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="info@viktron.ai"
                    className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    className="w-full rounded-xl border border-[#d7e1ef] bg-[#f9fbff] px-4 py-3 text-[#13213a] placeholder:text-[#7a8ba6] focus:border-[#7d9fee] focus:outline-none"
                    required
                  />
                  {error ? <p className="text-sm text-[#c03f4e]">{error}</p> : null}
                  <Button type="submit" className="w-full" icon={<Unlock className="h-4 w-4" />}>
                    Unlock Console
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};
