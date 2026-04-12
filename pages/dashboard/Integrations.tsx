import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plug, Check, X, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import {
  fetchAvailableIntegrations, fetchConnectedIntegrations, connectIntegration, disconnectIntegration,
  type IntegrationsApp, type ConnectedApp,
} from '../../services/dashboardApi';

const C = {
  bg: '#09090f', card: '#111118', border: '#1e1e2e',
  accent: '#0ea5e9', purple: '#a855f7', green: '#22c55e',
  red: '#ef4444', muted: '#6b7280', cardHover: '#1a1a24',
};

const POPULAR_APPS = ['github', 'slack', 'google', 'notion', 'jira', 'linear', 'hubspot', 'stripe', 'salesforce', 'zoom'];

interface AppWithStatus extends IntegrationsApp {
  status?: 'connected' | 'pending' | 'none';
  connectedId?: string;
}

export const Integrations: React.FC = () => {
  const [apps, setApps] = useState<IntegrationsApp[]>([]);
  const [connected, setConnected] = useState<Map<string, ConnectedApp>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    apps.forEach(a => a.categories?.forEach(c => cats.add(c)));
    return ['all', ...Array.from(cats).sort()];
  }, [apps]);

  const appsWithStatus: AppWithStatus[] = useMemo(() => {
    return apps.map(app => {
      const conn = connected.get(app.name.toLowerCase());
      return {
        ...app,
        status: conn ? (conn.status === 'connected' ? 'connected' : 'pending') : undefined,
        connectedId: conn?.id,
      };
    });
  }, [apps, connected]);

  const filteredApps = useMemo(() => {
    return appsWithStatus.filter(app => {
      const matchesSearch = !search || 
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.display_name?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || 
        app.categories?.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [appsWithStatus, search, categoryFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsRes, connectedRes] = await Promise.all([
        fetchAvailableIntegrations(),
        fetchConnectedIntegrations(),
      ]);
      setApps(appsRes.data.apps || []);
      const connMap = new Map<string, ConnectedApp>();
      (connectedRes.data.connected_apps || []).forEach(c => {
        connMap.set(c.app_name.toLowerCase(), c);
      });
      setConnected(connMap);
    } catch (err: any) {
      console.error('Failed to load integrations:', err);
      setError(err?.response?.data?.detail || 'Failed to load integrations');
      // Fallback to static list so UI still shows something
      setApps(_STATIC_APPS);
    } finally {
      setLoading(false);
    }
  };

  const _STATIC_APPS = [
    { name: 'github', display_name: 'GitHub', categories: ['developer'], logo: null },
    { name: 'gmail', display_name: 'Gmail', categories: ['email'], logo: null },
    { name: 'googlesheets', display_name: 'Google Sheets', categories: ['productivity'], logo: null },
    { name: 'slack', display_name: 'Slack', categories: ['communication'], logo: null },
    { name: 'notion', display_name: 'Notion', categories: ['productivity'], logo: null },
    { name: 'linear', display_name: 'Linear', categories: ['project-management'], logo: null },
    { name: 'jira', display_name: 'Jira', categories: ['project-management'], logo: null },
    { name: 'hubspot', display_name: 'HubSpot', categories: ['crm'], logo: null },
    { name: 'salesforce', display_name: 'Salesforce', categories: ['crm'], logo: null },
    { name: 'stripe', display_name: 'Stripe', categories: ['payments'], logo: null },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const handleConnect = async (app: IntegrationsApp) => {
    setConnecting(app.name);
    try {
      const res = await connectIntegration(app.name.toLowerCase());
      if (res.data.redirect_url) {
        window.location.href = res.data.redirect_url;
      }
    } catch (err) {
      console.error('Failed to connect:', err);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (app: AppWithStatus) => {
    if (!app.connectedId) return;
    try {
      await disconnectIntegration(app.name.toLowerCase());
      await loadData();
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  const popularApps = filteredApps.filter(a => 
    POPULAR_APPS.includes(a.name.toLowerCase())
  );
  const otherApps = filteredApps.filter(a => 
    !POPULAR_APPS.includes(a.name.toLowerCase())
  );

  return (
    <DashboardLayout teamName="My Team">
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold text-white mb-2">Integrations</h1>
          <p className="text-slate-400">
            Connect your favorite apps to unlock AI-powered workflows. 
            {connected.size > 0 && <span className="text-green-400 ml-2">{connected.size} connected</span>}
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] transition-colors"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-slate-400 hover:text-white hover:border-[#0ea5e9] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#0ea5e9] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={loadData}
              className="px-4 py-2 rounded-lg bg-[#0ea5e9] text-white"
            >
              Retry
            </button>
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No integrations found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {popularApps.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Plug className="w-5 h-5 text-[#0ea5e9]" />
                  Popular Integrations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {popularApps.map(app => (
                    <AppCard
                      key={app.name}
                      app={app}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                      connecting={connecting}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherApps.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-white mb-4">All Integrations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {otherApps.map(app => (
                    <AppCard
                      key={app.name}
                      app={app}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                      connecting={connecting}
                    />
                  ))}
                </div>
              </div>
            )}

            {!loading && filteredApps.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No integrations found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

interface AppCardProps {
  app: AppWithStatus;
  onConnect: (app: IntegrationsApp) => void;
  onDisconnect: (app: AppWithStatus) => void;
  connecting: string | null;
}

const AppCard: React.FC<AppCardProps> = ({ app, onConnect, onDisconnect, connecting }) => {
  const isConnecting = connecting === app.name;
  const isConnected = app.status === 'connected';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative p-4 rounded-xl border transition-all duration-200"
      style={{ 
        background: C.card, 
        borderColor: isConnected ? `${C.green}40` : C.border,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-[#1e1e2e] flex items-center justify-center text-lg font-semibold text-[#0ea5e9]">
          {app.logo ? (
            <img src={app.logo} alt={app.display_name} className="w-8 h-8 object-contain" />
          ) : (
            app.display_name?.[0] || app.name[0]
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{app.display_name || app.name}</h3>
          <p className="text-xs text-slate-500 truncate">{app.name}</p>
          {app.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {app.categories.slice(0, 2).map(cat => (
                <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e2e] text-slate-400">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm text-green-400">
              <Check className="w-4 h-4" />
              Connected
            </span>
            <button
              onClick={() => onDisconnect(app)}
              className="ml-auto text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => onConnect(app)}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#0ea5e9] text-white font-medium text-sm hover:bg-[#0284c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Connect
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};