import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

const API_BASES = [
  (import.meta as any).env?.VITE_SAAS_API_BASE,
  '/api',
  'https://api.viktron.ai/api',
].filter(Boolean) as string[];

const callCallback = async (code: string, state: string): Promise<any> => {
  let lastError: unknown = null;
  for (const base of API_BASES) {
    try {
      const res = await fetch(
        `${base}/saas/sources/slack/oauth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
      );
      if (res.ok) return res.json();
      lastError = new Error(`Callback failed at ${base} with ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Slack callback failed');
};

export const SlackOAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting Slack workspace...');

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const err = params.get('error');

      if (err) {
        setStatus('error');
        setMessage(`Slack authorization was cancelled or failed: ${err}`);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing Slack OAuth parameters in callback URL.');
        return;
      }

      try {
        const data = await callCallback(code, state);
        setStatus('success');
        setMessage(data?.message || 'Slack connected successfully. Redirecting...');
        window.setTimeout(() => {
          window.location.href = '/saas-analytics';
        }, 1400);
      } catch (e) {
        setStatus('error');
        setMessage(e instanceof Error ? e.message : 'Slack connection failed.');
      }
    };

    void run();
  }, []);

  return (
    <div className="min-h-screen bg-[#081019] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0d131b] border border-white/10 rounded-2xl p-6 text-center">
        {status === 'loading' && <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-cyan-300" />}
        {status === 'success' && <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-emerald-300" />}
        {status === 'error' && <XCircle className="w-8 h-8 mx-auto mb-3 text-red-300" />}
        <h1 className="text-lg font-semibold mb-2">Slack Workspace Connection</h1>
        <p className="text-sm text-slate-300">{message}</p>
      </div>
    </div>
  );
};
