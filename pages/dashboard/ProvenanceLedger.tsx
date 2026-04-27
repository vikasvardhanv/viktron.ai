import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Hash, Clock, User, Target, Eye, Shield,
  Search, Download, ChevronRight, ChevronDown,
  Copy, CheckCircle2, AlertTriangle,
  Database, Lock,
  TrendingUp, Activity, Zap, BrainCircuit, Link2,
  DollarSign, Loader2
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  fetchProvenanceChain,
  verifyProvenanceChain,
  fetchAgentProvenanceHistory,
  type ProvenanceEntry,
  type ProvenanceVerifyResult,
} from '../../services/dashboardApi';

const C = {
  bg: '#0B0F19', card: '#111827', border: '#1F2937',
  accent: '#10B981', purple: '#8B5CF6', blue: '#3B82F6',
  green: '#10B981', red: '#EF4444', yellow: '#F59E0B', cyan: '#06B6D4',
  muted: '#6B7280',
};

// Safe formatting helpers to prevent null errors
const formatCost = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  return `$${(value as number).toFixed(2)}`;
};

const formatConfidence = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${((value as number) * 100).toFixed(0)}%`;
};

type LedgerEntry = ProvenanceEntry;

const FiveQuestionCard: React.FC<{ entry: LedgerEntry }> = ({ entry }) => {
  const [expanded, setExpanded] = useState<string | null>('who');

  const sections = [
    { key: 'who', icon: User, color: C.blue, title: 'Who Authorized?', data: entry.who_authorized },
    { key: 'what_goal', icon: Target, color: C.purple, title: 'What Goal?', data: entry.what_goal },
    { key: 'what_saw', icon: Eye, color: C.cyan, title: 'What Did It See?', data: entry.what_saw },
    { key: 'why_chose', icon: BrainCircuit, color: C.yellow, title: 'Why Chose This?', data: entry.why_chose },
    { key: 'what_changed', icon: Zap, color: C.green, title: 'What Changed?', data: entry.what_changed },
  ] as const;

  const renderData = (key: string, value: any) => {
    if (typeof value === 'string') return <span className="text-white">{value}</span>;
    if (typeof value === 'number') return <span className="text-white font-mono">{value}</span>;
    if (Array.isArray(value)) {
      return (
        <ul className="space-y-1">
          {value.map((item, i) => (
            <li key={i} className="text-xs text-white flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-slate-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object') {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex items-start gap-2">
              <span className="text-xs font-mono capitalize" style={{ color: C.muted }}>{k}:</span>
              {renderData(k, v)}
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-white">{String(value)}</span>;
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {sections.map(({ key, icon: Icon, color, title, data }) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border overflow-hidden cursor-pointer transition-all ${expanded === key ? 'col-span-5' : ''}`}
          style={{ borderColor: C.border, background: `${color}05` }}
          onClick={() => setExpanded(expanded === key ? null : key)}
        >
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <span className="text-xs font-semibold text-white">{title}</span>
              {expanded === key && <ChevronDown size={12} style={{ color: C.muted }} />}
              {expanded !== key && <ChevronRight size={12} style={{ color: C.muted }} />}
            </div>
            {expanded !== key ? (
              <div className="text-xs" style={{ color: C.muted }}>
                {key === 'who' && <span className="text-white">{entry.who_authorized.user_email}</span>}
                {key === 'what_goal' && <span className="text-white truncate">{entry.what_goal.task_description}</span>}
                {key === 'what_saw' && <span>{entry.what_saw.tools_used.length} tools used</span>}
                {key === 'why_chose' && <span>Confidence: {formatConfidence(entry.why_chose?.confidence_score)}</span>}
                {key === 'what_changed' && (
                  <span className="flex items-center gap-2">
                    <span style={{ color: C.yellow }}>{formatCost(entry.what_changed?.cost_usd)}</span>
                    <span style={{ color: C.muted }}>{entry.what_changed.latency_ms}ms</span>
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs space-y-2 pt-2 border-t" style={{ borderColor: `${color}20` }}>
                {renderData(key, data)}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const LedgerEntryCard: React.FC<{ entry: LedgerEntry; expanded: boolean; onToggle: () => void }> = ({ entry, expanded, onToggle }) => {
  const sensitivityColors = {
    public: C.green,
    internal: C.blue,
    confidential: C.yellow,
    restricted: C.red,
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${C.purple}15`, color: C.purple }}>
              <FileText size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-mono" style={{ color: C.muted }}>#{entry.sequence_number}</span>
                <span className="text-xs font-semibold text-white truncate">{entry.action_type}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0`}
                  style={{
                    background: `${sensitivityColors[entry.data_sensitivity]}15`,
                    color: sensitivityColors[entry.data_sensitivity],
                  }}>
                  {entry.data_sensitivity}
                </span>
              </div>
              <p className="text-xs" style={{ color: C.muted }}>{entry.agent_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono" style={{ color: C.muted }}>
              {new Date(entry.timestamp).toLocaleString()}
            </span>
            <button onClick={onToggle} className="p-2 rounded-lg transition-colors" style={{ color: C.muted }}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="mt-3 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1" style={{ color: C.yellow }}>
            <DollarSign size={12} />
            {formatCost(entry.what_changed?.cost_usd)}
          </span>
          <span className="flex items-center gap-1" style={{ color: C.muted }}>
            <Activity size={12} />
            {entry.what_changed.tokens_used.toLocaleString()} tok
          </span>
          <span className="flex items-center gap-1" style={{ color: C.muted }}>
            <Clock size={12} />
            {entry.what_changed.latency_ms}ms
          </span>
          <span className="flex items-center gap-1" style={{ color: C.green }}>
            <CheckCircle2 size={12} />
            {formatConfidence(entry.why_chose?.confidence_score)} confidence
          </span>
        </div>
      </div>

      {/* Expanded: 5 Questions */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-4"
          >
            <FiveQuestionCard entry={entry} />

            {/* Cryptographic Proof */}
            <div className="pt-4 border-t" style={{ borderColor: C.border }}>
              <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: C.muted }}>
                Cryptographic Proof
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
                  <Hash size={12} style={{ color: C.muted }} />
                  <span className="text-[10px] font-mono flex-1 truncate" style={{ color: C.accent }}>{entry.hash}</span>
                  <button className="p-1 rounded hover:bg-white/5" style={{ color: C.muted }}>
                    <Copy size={10} />
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
                  <Link2 size={12} style={{ color: C.muted }} />
                  <span className="text-[10px] font-mono flex-1 truncate" style={{ color: C.muted }}>{entry.previous_hash}</span>
                  <button className="p-1 rounded hover:bg-white/5" style={{ color: C.muted }}>
                    <Copy size={10} />
                  </button>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
                  <Lock size={12} style={{ color: C.muted }} />
                  <span className="text-[10px] font-mono flex-1 truncate" style={{ color: C.purple }}>{entry.signature}</span>
                  <button className="p-1 rounded hover:bg-white/5" style={{ color: C.muted }}>
                    <Copy size={10} />
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>Tags</span>
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded" style={{ background: `${C.blue}15`, color: C.blue }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[10px]" style={{ color: C.muted }}>
                Retention: <span className="text-white font-mono">{entry.retention_policy}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const ProvenanceLedger: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<ProvenanceVerifyResult | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSensitivity, setFilterSensitivity] = useState<string>('all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use a default mission_id; in production this would come from route params or context
      const missionId = user?.id || 'default';
      const res = await fetchProvenanceChain(missionId);
      setEntries(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to load provenance ledger');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const missionId = user?.id || 'default';
      const res = await verifyProvenanceChain(missionId);
      setVerifyResult(res.data);
    } catch (err: any) {
      setVerifyResult({ valid: false, checked_count: 0, broken_links: [{ sequence: 0, expected_hash: '', actual_hash: err?.response?.data?.detail || err?.message || 'Verification failed' }] });
    } finally {
      setVerifying(false);
    }
  };

  const handleLoadAgentHistory = async (agentId: string) => {
    try {
      const res = await fetchAgentProvenanceHistory(agentId);
      setEntries(res.data);
      setFilterAgent(agentId);
    } catch (err: any) {
      // Keep existing data on error
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filterSensitivity !== 'all' && entry.data_sensitivity !== filterSensitivity) return false;
    if (filterAgent !== 'all' && entry.agent_id !== filterAgent) return false;
    if (searchQuery && !JSON.stringify(entry).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: entries.length,
    today: entries.filter(e => new Date(e.timestamp) > new Date(Date.now() - 86400000)).length,
    totalCost: entries.reduce((sum, e) => sum + e.what_changed.cost_usd, 0),
    avgConfidence: entries.length > 0 ? entries.reduce((sum, e) => sum + e.why_chose.confidence_score, 0) / entries.length : 0,
  };

  const agents = Array.from(new Set(entries.map(e => e.agent_id)));

  if (loading) {
    return (
      <DashboardLayout teamName="Trust Fabric">
        <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin" size={32} style={{ color: C.accent }} />
            <p className="text-sm" style={{ color: C.muted }}>Loading provenance ledger...</p>
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
                <FileText size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Provenance Ledger</h1>
                <p className="text-sm" style={{ color: C.muted }}>Immutable audit trail with 5-question provenance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50"
                style={{ borderColor: C.accent, color: C.accent, background: `${C.accent}10` }}
              >
                {verifying ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                {verifying ? 'Verifying...' : 'Verify Chain'}
              </button>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors"
                style={{ borderColor: C.border, color: C.muted, background: C.card }}
              >
                <Activity size={14} /> Refresh
              </button>
            </div>
          </div>
          {verifyResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg border ${verifyResult.valid ? '' : ''}`}
              style={{
                background: verifyResult.valid ? `${C.accent}10` : `${C.red}10`,
                borderColor: verifyResult.valid ? C.accent : C.red,
              }}
            >
              <div className="flex items-center gap-2">
                {verifyResult.valid ? (
                  <CheckCircle2 size={16} style={{ color: C.accent }} />
                ) : (
                  <AlertTriangle size={16} style={{ color: C.red }} />
                )}
                <span className="text-xs font-medium" style={{ color: verifyResult.valid ? C.accent : C.red }}>
                  {verifyResult.valid
                    ? `Chain integrity verified (${verifyResult.checked_count} entries checked)`
                    : `Chain integrity check failed — ${verifyResult.broken_links?.length || 0} broken link(s)`}
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
              <span className="text-xs" style={{ color: C.muted }}>Total Entries</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} style={{ color: C.green }} />
              <span className="text-xs" style={{ color: C.muted }}>Last 24h</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.today}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} style={{ color: C.yellow }} />
              <span className="text-xs" style={{ color: C.muted }}>Total Cost</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatCost(stats?.totalCost)}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} style={{ color: C.purple }} />
              <span className="text-xs" style={{ color: C.muted }}>Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatConfidence(stats?.avgConfidence)}</p>
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
                placeholder="Search ledger..."
                className="pl-9 pr-3 py-1.5 rounded-lg border text-xs text-white outline-none focus:border-emerald-500/50 transition-colors"
                style={{ background: C.bg, borderColor: C.border }}
              />
            </div>
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
            {/* Agent Filter */}
            <select
              value={filterAgent}
              onChange={e => {
                const val = e.target.value;
                setFilterAgent(val);
                if (val !== 'all') handleLoadAgentHistory(val);
              }}
              className="px-3 py-1.5 rounded-lg border text-xs text-white outline-none"
              style={{ background: C.bg, borderColor: C.border }}
            >
              <option value="all">All Agents</option>
              {agents.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            {/* Date Range */}
            <div className="flex items-center gap-1 p-1 rounded-lg border" style={{ borderColor: C.border }}>
              {(['24h', '7d', '30d', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === range ? '' : ''}`}
                  style={{
                    background: dateRange === range ? `${C.accent}15` : 'transparent',
                    color: dateRange === range ? C.accent : C.muted,
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-colors"
            style={{ borderColor: C.border, color: C.muted, background: C.card }}>
            <Download size={14} /> Export
          </button>
        </div>

        {/* Ledger Entries */}
        <div className="space-y-3">
          {filteredEntries.map(entry => (
            <LedgerEntryCard
              key={entry.id}
              entry={entry}
              expanded={expandedId === entry.id}
              onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            />
          ))}
        </div>

        {filteredEntries.length === 0 && !error && (
          <div className="text-center py-16">
            <Database size={48} style={{ color: C.muted, opacity: 0.3 }} />
            <p className="text-sm mt-4" style={{ color: C.muted }}>No ledger entries match your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProvenanceLedger;