import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, XCircle, ArrowRight } from 'lucide-react';
import { fetchConnectedIntegrations } from '../../services/dashboardApi';

export const IntegrationsCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing integration connection...');

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const connectedAccountId = params.get('connected_account_id');
      const app = params.get('app');
      const error = params.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Integration authorization was cancelled or failed: ${error}`);
        return;
      }

      try {
        await fetchConnectedIntegrations();
        setStatus('success');
        setMessage(app 
          ? `${app.charAt(0).toUpperCase() + app.slice(1)} connected successfully!` 
          : 'Integration connected successfully!');
        
        setTimeout(() => {
          window.location.href = '/dashboard/integrations';
        }, 2000);
      } catch (e) {
        setStatus('error');
        setMessage(e instanceof Error ? e.message : 'Failed to verify connection.');
      }
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090f] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-[#0ea5e9]" />
            <h1 className="text-xl font-semibold mb-2">Connecting Integration</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 mx-auto mb-4 text-[#22c55e]" />
            <h1 className="text-xl font-semibold mb-2">Success!</h1>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-10 h-10 mx-auto mb-4 text-[#ef4444]" />
            <h1 className="text-xl font-semibold mb-2">Connection Failed</h1>
          </>
        )}
        <p className="text-slate-400 mb-6">{message}</p>
        
        {status !== 'loading' && (
          <a 
            href="/dashboard/integrations"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ea5e9] text-white font-medium hover:bg-[#0284c7] transition-colors"
          >
            Go to Integrations <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default IntegrationsCallback;