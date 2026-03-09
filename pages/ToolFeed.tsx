import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, RefreshCw, Search } from 'lucide-react';
import { getAuthToken, useAuth } from '../context/AuthContext';

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
      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-xs text-slate-500 bg-slate-50">
        {title} ad slot (AdSense loading...)
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-white">
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
  const { isAuthenticated, setShowAuthModal, setAuthModalMode } = useAuth();
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [adsReady] = useState(true);
  const PAGE_SIZE = 100;
  const FREE_CLICK_LIMIT = 3;
  const FREE_CLICK_KEY = 'tools_free_click_count';
  const PENDING_CLICK_KEY = 'tools_pending_click';

  const cleanToolName = (name: string, url: string | null) => {
    const cleaned = name.replace(/^[^A-Za-z0-9]+/, '').trim();
    if (cleaned) return cleaned;

    if (url) {
      try {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        const root = hostname.split('.')[0] || hostname;
        if (root) return root.charAt(0).toUpperCase() + root.slice(1);
      } catch {
        // ignore URL parse errors and use final fallback
      }
    }

    return 'Website Tool';
  };

  const cleanDescription = (description: string | null) => {
    if (!description) return 'No description available.';
    return description
      .replace(/@toolspire/gi, '')
      .replace(/#latest/gi, '')
      .replace(/#toolspire/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const load = async (nextOffset = 0, append = false) => {
    setStatus('Loading tools...');
    try {
      const res = await apiFetch(`/telegram-tools/latest?channel=toolspireai&limit=${PAGE_SIZE}&offset=${nextOffset}`);
      const data = (await res.json()) as ToolResponse;
      const batch = data.tools || [];
      setTools((prev) => (append ? [...prev, ...batch] : batch));
      setOffset(nextOffset + batch.length);
      setHasMore(batch.length === PAGE_SIZE);
      setStatus(`Loaded ${append ? nextOffset + batch.length : batch.length} tools.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not load tools');
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      await load(offset, true);
    } finally {
      setLoadingMore(false);
    }
  };

  const sync = async () => {
    setSyncing(true);
    setStatus('Syncing from Telegram...');
    try {
      const res = await apiFetch('/telegram-tools/sync?channel=toolspireai&limit=500&backfill_pages=20', { method: 'POST' });
      const data = await res.json();
      setStatus(`Synced. Inserted ${data.inserted}, updated ${data.updated}.`);
      await load(0, false);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    void load(0, false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const pendingRaw = localStorage.getItem(PENDING_CLICK_KEY);
    if (!pendingRaw) return;

    try {
      const pending = JSON.parse(pendingRaw) as { tool_id?: string; tool_name?: string; tool_url: string };
      if (!pending?.tool_url) {
        localStorage.removeItem(PENDING_CLICK_KEY);
        return;
      }

      void trackToolClick({
        tool_id: pending.tool_id || null,
        tool_name: pending.tool_name || null,
        tool_url: pending.tool_url,
        source_path: '/tools',
        is_authenticated: true,
        gate_triggered: false,
      });

      localStorage.removeItem(PENDING_CLICK_KEY);
      window.location.href = pending.tool_url;
    } catch {
      localStorage.removeItem(PENDING_CLICK_KEY);
    }
  }, [isAuthenticated]);

  const getFreeClickCount = () => {
    const value = Number(localStorage.getItem(FREE_CLICK_KEY) || '0');
    if (Number.isNaN(value) || value < 0) return 0;
    return value;
  };

  const setFreeClickCount = (next: number) => {
    localStorage.setItem(FREE_CLICK_KEY, String(Math.max(0, next)));
  };

  const trackToolClick = async (payload: {
    tool_id: string | null;
    tool_name: string | null;
    tool_url: string;
    source_path: string;
    is_authenticated: boolean;
    gate_triggered: boolean;
  }) => {
    const token = getAuthToken();
    try {
      await apiFetch('/telegram-tools/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
    } catch {
      // Tracking should not block user navigation.
    }
  };

  const handleToolClick = async (tool: ToolItem) => {
    if (!tool.tool_url) return;

    if (isAuthenticated) {
      await trackToolClick({
        tool_id: tool.id,
        tool_name: cleanToolName(tool.tool_name, tool.tool_url),
        tool_url: tool.tool_url,
        source_path: '/tools',
        is_authenticated: true,
        gate_triggered: false,
      });
      window.location.href = tool.tool_url;
      return;
    }

    const freeCount = getFreeClickCount();
    if (freeCount < FREE_CLICK_LIMIT) {
      setFreeClickCount(freeCount + 1);
      await trackToolClick({
        tool_id: tool.id,
        tool_name: cleanToolName(tool.tool_name, tool.tool_url),
        tool_url: tool.tool_url,
        source_path: '/tools',
        is_authenticated: false,
        gate_triggered: false,
      });
      window.location.href = tool.tool_url;
      return;
    }

    localStorage.setItem(
      PENDING_CLICK_KEY,
      JSON.stringify({
        tool_id: tool.id,
        tool_name: cleanToolName(tool.tool_name, tool.tool_url),
        tool_url: tool.tool_url,
      })
    );

    await trackToolClick({
      tool_id: tool.id,
      tool_name: cleanToolName(tool.tool_name, tool.tool_url),
      tool_url: tool.tool_url,
      source_path: '/tools',
      is_authenticated: false,
      gate_triggered: true,
    });

    setAuthModalMode('login');
    setShowAuthModal(true);
    setStatus('Please sign in to continue to this tool.');
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((t) =>
      [t.tool_name, t.description || '', (t.tags || []).join(' ')].join(' ').toLowerCase().includes(q)
    );
  }, [query, tools]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 px-4 sm:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">AI Tools in One Place</h1>
          <p className="text-sm text-slate-600 mt-1">Discover AI tools with clean descriptions and direct website links.</p>

          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search AI tools"
                className="bg-transparent text-sm text-slate-900 outline-none w-full"
              />
            </div>
            <button
              onClick={() => void sync()}
              disabled={syncing}
              className="rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-70 text-white text-sm font-semibold px-4 py-2 inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Refresh Tools
            </button>
            <span className="text-xs text-slate-500">{status}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((tool, idx) => (
            <React.Fragment key={tool.id}>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
                <h2 className="text-lg font-semibold leading-tight text-slate-900">{cleanToolName(tool.tool_name, tool.tool_url)}</h2>
                <p className="text-sm text-slate-600 min-h-[72px] line-clamp-3">{cleanDescription(tool.description)}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tool.tool_url && (
                    <button
                      type="button"
                      onClick={() => void handleToolClick(tool)}
                      className="text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 inline-flex items-center gap-1"
                    >
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </article>

              {(idx + 1) % 6 === 0 && (
                <article className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Sponsored</p>
                  <AdBlock title="Inline sponsored" adsReady={adsReady} />
                </article>
              )}
            </React.Fragment>
          ))}
        </div>

        {hasMore && !query.trim() && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-70 text-sm font-semibold px-4 py-2 inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loadingMore ? 'animate-spin' : ''}`} />
              {loadingMore ? 'Loading more...' : 'Load More Tools'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
