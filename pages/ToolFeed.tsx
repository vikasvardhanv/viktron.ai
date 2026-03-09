import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, RefreshCw, Search } from 'lucide-react';

type ToolItem = {
  id: string;
  message_id: number;
  tool_name: string;
  description: string | null;
  tool_url: string | null;
  channel_post_url: string;
  tags: string[];
  posted_at: string | null;
};

type ToolResponse = {
  success: boolean;
  channel: string;
  count: number;
  tools: ToolItem[];
};

const ENV = (import.meta as any).env || {};
const ADSENSE_CLIENT = 'ca-pub-6601354684559213';
const ADSENSE_SCRIPT_ID = 'adsense-tools-only-script';
const toApiBase = (value?: string) => {
  if (!value) return null;
  const trimmed = String(value).trim().replace(/\/$/, '');
  if (!trimmed) return null;
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASES = [
  toApiBase(ENV.VITE_AGENT_API_URL),
  toApiBase(ENV.VITE_SAAS_API_BASE),
  (typeof window !== 'undefined' ? `https://api.${window.location.hostname.replace(/^www\./, '')}/api` : null),
  (typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname) ? '/api' : null),
].filter(Boolean) as string[];

const apiFetch = async (path: string, init?: RequestInit): Promise<Response> => {
  let lastErr: unknown = null;
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (res.ok) return res;
      lastErr = new Error(`${res.status} on ${base}${path}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Request failed');
};

const AdBlock: React.FC<{ title: string; adsReady: boolean }> = ({ title, adsReady }) => {
  const client = ADSENSE_CLIENT;

  useEffect(() => {
    if (!adsReady) return;
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch {
      // no-op
    }
  }, [adsReady]);

  if (!adsReady) {
    return (
      <div className="rounded-xl border border-dashed border-slate-400/40 p-4 text-xs text-slate-300 bg-slate-900/30">
        {title} ad slot (AdSense loading...)
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 p-3 bg-slate-950/40">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={ENV.VITE_ADSENSE_SLOT_ID || '0000000000'}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export const ToolFeed: React.FC = () => {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [adsReady, setAdsReady] = useState(false);

  const load = async () => {
    setStatus('Loading tools...');
    try {
      const res = await apiFetch('/telegram-tools/latest?channel=toolspireai&limit=100');
      const data = (await res.json()) as ToolResponse;
      setTools(data.tools || []);
      setStatus(`Loaded ${data.count} tools.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not load tools');
    }
  };

  const sync = async () => {
    setSyncing(true);
    setStatus('Syncing from Telegram...');
    try {
      const res = await apiFetch('/telegram-tools/sync?channel=toolspireai&limit=120', { method: 'POST' });
      const data = await res.json();
      setStatus(`Synced. Inserted ${data.inserted}, updated ${data.updated}.`);
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    const existing = document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      setAdsReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = src;
    script.onload = () => setAdsReady(true);
    script.onerror = () => setAdsReady(false);
    document.head.appendChild(script);

    return () => {
      // Keep AdSense strictly scoped to /tools page lifecycle.
      script.remove();
      setAdsReady(false);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((t) =>
      [t.tool_name, t.description || '', (t.tags || []).join(' ')].join(' ').toLowerCase().includes(q)
    );
  }, [query, tools]);

  return (
    <div className="min-h-screen bg-[#0a1018] text-white px-4 sm:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="rounded-2xl border border-white/10 bg-[#101826] p-5">
          <h1 className="text-2xl font-bold">Telegram AI Tool Feed</h1>
          <p className="text-sm text-slate-300 mt-1">Auto-ingested from @toolspireai and aligned into clean tool cards.</p>

          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools"
                className="bg-transparent text-sm text-white outline-none w-full"
              />
            </div>
            <button
              onClick={() => void sync()}
              disabled={syncing}
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-70 text-[#032330] text-sm font-semibold px-4 py-2 inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync Telegram
            </button>
            <span className="text-xs text-slate-400">{status}</span>
          </div>
        </header>

        <AdBlock title="Top banner" adsReady={adsReady} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tool, idx) => (
            <React.Fragment key={tool.id}>
              <article className="rounded-2xl border border-white/10 bg-[#101826] p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-tight">{tool.tool_name}</h2>
                  <span className="text-[11px] text-slate-400">#{tool.message_id}</span>
                </div>
                <p className="text-sm text-slate-300 min-h-[44px]">{tool.description || 'No description provided in source post.'}</p>
                <div className="flex flex-wrap gap-2">
                  {(tool.tags || []).map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-200">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tool.tool_url && (
                    <a
                      href={tool.tool_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 inline-flex items-center gap-1"
                    >
                      Open Tool <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <a
                    href={tool.channel_post_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs rounded-lg border border-white/20 hover:bg-white/10 px-3 py-1.5 inline-flex items-center gap-1"
                  >
                    Telegram Post <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>

              {idx === 3 && <AdBlock title="Inline feed" adsReady={adsReady} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
