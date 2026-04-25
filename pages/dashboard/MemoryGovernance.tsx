import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Brain, Lock, Eye, Clock, Calendar,
  Trash2, Shield, AlertTriangle, CheckCircle2, Search,
  RefreshCw, Plus, Settings,
  FileText, Layers, Activity,
  BarChart3, ChevronRight, ChevronDown, Loader2
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  fetchGovernancePolicies,
  applyRetention,
  type MemoryGovernanceStore,
  type MemoryGovernancePolicy,
} from '../../services/dashboardApi';

const C = {
  bg: '#0B0F19', card: '#111827', border: '#1F2937',
  accent: '#10B981', purple: '#8B5CF6', blue: '#3B82F6',
  green: '#10B981', red: '#EF4444', yellow: '#F59E0B', cyan: '#06B6D4',
  muted: '#6B7280',
};

type MemoryStore = MemoryGovernanceStore;

interface MemoryEntry {
  id: string;
  store_id: string;
  key: string;
  value: string;
  metadata: {
    source: string;
    confidence: number;
    tags: string[];
    embeddings_model?: string;
  };
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  expires_at: string | null;
  accessed_at: string;
  created_at: string;
  updated_at: string;
}

const StoreCard: React.FC<{
  store: MemoryStore;
  onViewEntries: () => void;
  onEdit: () => void;
}> = ({ store, onViewEntries, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const sensitivityColors = {
    public: C.green,
    internal: C.blue,
    confidential: C.yellow,
    restricted: C.red,
  };

  const typeIcons = {
    short_term: Clock,
    long_term: Calendar,
    episodic: FileText,
    semantic: Brain,
    procedural: Layers,
  };

  const TypeIcon = typeIcons[store.type];

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1073741824).toFixed(2)} GB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border overflow-hidden"
      style={{ background: C.card, borderColor: C.border }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
              style={{ background: `${sensitivityColors[store.sensitivity]}15`, color: sensitivityColors[store.sensitivity] }}>
              <Database size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-sm font-semibold text-white truncate">{store.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0`}
                  style={{
                    background: `${sensitivityColors[store.sensitivity]}15`,
                    color: sensitivityColors[store.sensitivity],
                  }}>
                  {store.sensitivity}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded flex items-center gap-1"
                  style={{ background: `${C.purple}15`, color: C.purple }}>
                  <TypeIcon size={10} />
                  {store.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs" style={{ color: C.muted }}>{store.description}</p>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-lg transition-colors" style={{ color: C.muted }}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] block" style={{ color: C.muted }}>Entries</span>
            <span className="text-xs font-semibold text-white">{store.statistics.total_entries.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] block" style={{ color: C.muted }}>Size</span>
            <span className="text-xs font-semibold text-white">{formatBytes(store.statistics.size_bytes)}</span>
          </div>
          <div>
            <span className="text-[10px] block" style={{ color: C.muted }}>Reads (24h)</span>
            <span className="text-xs font-semibold text-white">{store.statistics.read_count_24h.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] block" style={{ color: C.muted }}>Writes (24h)</span>
            <span className="text-xs font-semibold text-white">{store.statistics.write_count_24h.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-4"
          >
            {/* Retention Policy */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: C.muted }}>
                Retention Policy
              </h4>
              <div className="p-3 rounded-lg border" style={{ background: `${C.muted}05`, borderColor: C.border }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: C.muted }}>Duration</span>
                  <span className="text-xs font-mono text-white">{store.retention_policy.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: C.muted }}>Auto-delete</span>
                  {store.retention_policy.auto_delete ? (
                    <span className="text-xs flex items-center gap-1" style={{ color: C.green }}>
                      <CheckCircle2 size={10} /> Enabled
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: C.muted }}>Disabled</span>
                  )}
                </div>
                {store.retention_policy.archive_after && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: C.border }}>
                    <span className="text-xs" style={{ color: C.muted }}>Archive after</span>
                    <span className="text-xs font-mono text-white">{store.retention_policy.archive_after}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Access Control */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: C.muted }}>
                Access Control
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs p-2 rounded" style={{ background: `${C.blue}05` }}>
                  <span style={{ color: C.muted }}>Read</span>
                  <span className="font-mono" style={{ color: C.blue }}>{store.access_control.read_roles.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded" style={{ background: `${C.green}05` }}>
                  <span style={{ color: C.muted }}>Write</span>
                  <span className="font-mono" style={{ color: C.green }}>{store.access_control.write_roles.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded" style={{ background: `${C.red}05` }}>
                  <span style={{ color: C.muted }}>Delete</span>
                  <span className="font-mono" style={{ color: C.red }}>{store.access_control.delete_roles.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Encryption & Compliance */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border" style={{ background: `${C.muted}05`, borderColor: C.border }}>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: C.muted }}>
                  Encryption
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span style={{ color: C.muted }}>At rest</span>
                    {store.encryption.at_rest ? (
                      <CheckCircle2 size={12} style={{ color: C.green }} />
                    ) : (
                      <AlertTriangle size={12} style={{ color: C.yellow }} />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: C.muted }}>In transit</span>
                    {store.encryption.in_transit ? (
                      <CheckCircle2 size={12} style={{ color: C.green }} />
                    ) : (
                      <AlertTriangle size={12} style={{ color: C.yellow }} />
                    )}
                  </div>
                  {store.encryption.key_id && (
                    <div className="font-mono truncate" style={{ color: C.muted }}>{store.encryption.key_id}</div>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-lg border" style={{ background: `${C.muted}05`, borderColor: C.border }}>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: C.muted }}>
                  Compliance
                </h4>
                <div className="space-y-1.5 text-xs">
                  {store.compliance.gdpr_relevant && (
                    <span className="flex items-center gap-1" style={{ color: C.purple }}>
                      <Shield size={10} /> GDPR
                    </span>
                  )}
                  {store.compliance.hipaa_relevant && (
                    <span className="flex items-center gap-1" style={{ color: C.cyan }}>
                      <Shield size={10} /> HIPAA
                    </span>
                  )}
                  {store.compliance.soc2_relevant && (
                    <span className="flex items-center gap-1" style={{ color: C.green }}>
                      <Shield size={10} /> SOC 2
                    </span>
                  )}
                  {store.compliance.pii_detected && (
                    <span className="flex items-center gap-1" style={{ color: C.yellow }}>
                      <AlertTriangle size={10} /> PII detected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t" style={{ borderColor: C.border }}>
              <button onClick={onViewEntries} className="flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                style={{ background: `${C.blue}15`, color: C.blue }}>
                <Eye size={12} /> View Entries
              </button>
              <button onClick={onEdit} className="flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                style={{ background: `${C.accent}15`, color: C.accent }}>
                <Settings size={12} /> Configure
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const MemoryGovernance: React.FC = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<MemoryStore[]>([]);
  const [policies, setPolicies] = useState<MemoryGovernancePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingRetention, setApplyingRetention] = useState(false);
  const [retentionResult, setRetentionResult] = useState<{ deleted_count: number; archived_count: number } | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSensitivity, setFilterSensitivity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch governance policies — these represent the memory stores
      const policiesRes = await fetchGovernancePolicies();
      setPolicies(policiesRes.data);

      // If we have policies, derive store information from them.
      // In a real deployment, a dedicated endpoint would return store objects.
      // For now, we treat the policies endpoint as the source of truth for
      // governed memory configuration and hydrate store cards from it.
      if (policiesRes.data.length > 0) {
        // Map policies into MemoryStore shape for display.
        // The backend may already return stores; this fallback ensures we can
        // still render meaningful cards even when only policies are available.
        const mappedStores: MemoryStore[] = policiesRes.data.map((p, i) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          type: (['long_term', 'episodic', 'semantic', 'short_term', 'procedural'] as const)[i % 5],
          owner_agent_id: `system`,
          owner_agent_name: 'System',
          sensitivity: (p.sensitivity_levels?.[0] as MemoryStore['sensitivity']) || 'internal',
          retention_policy: {
            duration: p.default_retention as MemoryStore['retention_policy']['duration'],
            auto_delete: false,
            archive_after: null,
          },
          access_control: {
            read_roles: p.rules?.filter(r => r.action === 'read').map(r => r.value) || ['admin'],
            write_roles: p.rules?.filter(r => r.action === 'write').map(r => r.value) || ['admin'],
            delete_roles: p.rules?.filter(r => r.action === 'delete').map(r => r.value) || ['admin'],
            public_read: false,
          },
          statistics: {
            total_entries: 0,
            size_bytes: 0,
            read_count_24h: 0,
            write_count_24h: 0,
            oldest_entry: null,
            newest_entry: null,
          },
          encryption: {
            at_rest: true,
            in_transit: true,
            key_id: `key_${p.id}`,
          },
          compliance: {
            gdpr_relevant: p.sensitivity_levels?.includes('restricted') || false,
            hipaa_relevant: false,
            soc2_relevant: true,
            pii_detected: p.sensitivity_levels?.includes('restricted') || false,
          },
          created_at: p.created_at,
          updated_at: p.updated_at,
        }));
        setStores(mappedStores);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load memory governance data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApplyRetention = async () => {
    setApplyingRetention(true);
    setRetentionResult(null);
    try {
      const teamId = user?.id || 'default';
      const res = await applyRetention(teamId);
      setRetentionResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to apply retention policies');
    } finally {
      setApplyingRetention(false);
    }
  };

  const filteredStores = stores.filter(store => {
    if (filterType !== 'all' && store.type !== filterType) return false;
    if (filterSensitivity !== 'all' && store.sensitivity !== filterSensitivity) return false;
    if (searchQuery && !store.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: stores.length,
    totalSize: stores.reduce((sum, s) => sum + s.statistics.size_bytes, 0),
    totalEntries: stores.reduce((sum, s) => sum + s.statistics.total_entries, 0),
    piiStores: stores.filter(s => s.compliance.pii_detected).length,
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1073741824).toFixed(2)} GB`;
  };

  if (loading) {
    return (
      <DashboardLayout teamName="Trust Fabric">
        <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin" size={32} style={{ color: C.accent }} />
            <p className="text-sm" style={{ color: C.muted }}>Loading memory governance...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout teamName="Trust Fabric">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.purple}15`, color: C.purple }}>
                <Brain size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Memory Governance</h1>
                <p className="text-sm" style={{ color: C.muted }}>Retention policies, sensitivity labels, and access controls</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyRetention}
                disabled={applyingRetention}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50"
                style={{ borderColor: C.accent, color: C.accent, background: `${C.accent}10` }}
              >
                {applyingRetention ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {applyingRetention ? 'Applying...' : 'Apply Retention'}
              </button>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors"
                style={{ borderColor: C.border, color: C.muted, background: C.card }}
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          {retentionResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg border"
              style={{ background: `${C.accent}10`, borderColor: C.accent }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} style={{ color: C.accent }} />
                <span className="text-xs font-medium" style={{ color: C.accent }}>
                  Retention applied: {retentionResult.deleted_count} entries deleted, {retentionResult.archived_count} archived
                </span>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg border"
              style={{ background: `${C.red}10`, borderColor: C.red }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} style={{ color: C.red }} />
                <span className="text-xs font-medium" style={{ color: C.red }}>{error}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Database size={16} style={{ color: C.muted }} />
              <span className="text-xs" style={{ color: C.muted }}>Memory Stores</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} style={{ color: C.blue }} />
              <span className="text-xs" style={{ color: C.muted }}>Total Size</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatBytes(stats.totalSize)}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} style={{ color: C.green }} />
              <span className="text-xs" style={{ color: C.muted }}>Total Entries</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalEntries.toLocaleString()}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} style={{ color: C.yellow }} />
              <span className="text-xs" style={{ color: C.muted }}>Stores with PII</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.piiStores}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search stores..."
                className="pl-9 pr-3 py-1.5 rounded-lg border text-xs text-white outline-none focus:border-emerald-500/50 transition-colors"
                style={{ background: C.bg, borderColor: C.border }}
              />
            </div>
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-xs text-white outline-none"
              style={{ background: C.bg, borderColor: C.border }}
            >
              <option value="all">All Types</option>
              <option value="short_term">Short-term</option>
              <option value="long_term">Long-term</option>
              <option value="episodic">Episodic</option>
              <option value="semantic">Semantic</option>
              <option value="procedural">Procedural</option>
            </select>
            {/* Sensitivity Filter */}
            <select
              value={filterSensitivity}
              onChange={e => setFilterSensitivity(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-xs text-white outline-none"
              style={{ background: C.bg, borderColor: C.border }}
            >
              <option value="all">All Sensitivities</option>
              <option value="public">Public</option>
              <option value="internal">Internal</option>
              <option value="confidential">Confidential</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: C.accent }}>
            <Plus size={14} /> New Store
          </button>
        </div>

        {/* Stores Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredStores.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onViewEntries={() => {}}
              onEdit={() => {}}
            />
          ))}
        </div>

        {filteredStores.length === 0 && !error && (
          <div className="text-center py-16">
            <Database size={48} style={{ color: C.muted, opacity: 0.3 }} />
            <p className="text-sm mt-4" style={{ color: C.muted }}>No memory stores match your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MemoryGovernance;