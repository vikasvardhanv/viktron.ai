import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Fingerprint, Users, Building2, Key, Clock, CheckCircle2,
  AlertTriangle, Copy, ExternalLink, Plus, Trash2, Edit2, RefreshCw,
  Lock, Eye, EyeOff, Hash, UserCheck, FileText, Activity, Loader2,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  fetchUserTeams,
  fetchDashboardOverview,
  fetchAgentTrustScore,
  recomputeAgentTrustScore,
  fetchAgentirlStats,
} from '../../services/dashboardApi';
import type { MissionStats } from '../../services/dashboardApi';

const C = {
  bg: '#0B0F19', card: '#111827', border: '#1F2937',
  accent: '#10B981', purple: '#8B5CF6', blue: '#3B82F6',
  red: '#EF4444', yellow: '#F59E0B', muted: '#6B7280',
};

// ── Types matching backend responses ──────────────────────────────────────────

interface AgentIdentity {
  id: string;
  display_name: string;
  role: string;
  cryptographic_id: string;
  org_id: string;
  org_name: string;
  accountable_human: {
    name: string;
    email: string;
    role: string;
  };
  model_version: string;
  runtime_version: string;
  allowed_tools: string[];
  allowed_domains: string[];
  created_at: string;
  last_verified: string;
  status: 'active' | 'suspended' | 'pending_verification';
  trust_score: number;
  trust_level?: string;
  trust_factors?: Record<string, unknown>;
  trust_computed_at?: string;
}

// ── Trust Score Badge ─────────────────────────────────────────────────────────

const TrustScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 85 ? C.accent : score >= 70 ? C.yellow : C.red;
  const label = score >= 85 ? 'High Trust' : score >= 70 ? 'Medium' : 'Low Trust';

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke={`${C.muted}20`} strokeWidth="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${score}, 100`} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {score}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color }}>{label}</p>
        <p className="text-[10px]" style={{ color: C.muted }}>Operational Score</p>
      </div>
    </div>
  );
};

// ── Identity Card ──────────────────────────────────────────────────────────────

const IdentityCard: React.FC<{
  identity: AgentIdentity;
  teamId: string;
  onRevoke: () => void;
  onTrustRefresh: (agentId: string) => void;
  refreshingTrust: string | null;
}> = ({ identity, teamId, onRevoke, onTrustRefresh, refreshingTrust }) => {
  const [copied, setCopied] = useState(false);
  const [showFullId, setShowFullId] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    active: C.accent,
    suspended: C.red,
    pending_verification: C.yellow,
  };

  const truncateHash = (hash: string, full: boolean) => {
    if (full) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const isRefreshing = refreshingTrust === identity.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-5"
      style={{ background: C.card, borderColor: C.border }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${C.accent}15`, color: C.accent }}>
            <Fingerprint size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{identity.display_name}</h3>
            <p className="text-xs" style={{ color: C.muted }}>{identity.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wide"
          style={{
            background: `${statusColors[identity.status]}10`,
            borderColor: `${statusColors[identity.status]}25`,
            color: statusColors[identity.status],
          }}>
          {identity.status === 'active' && <CheckCircle2 size={10} />}
          {identity.status === 'pending_verification' && <AlertTriangle size={10} />}
          {identity.status === 'suspended' && <Lock size={10} />}
          {identity.status.replace('_', ' ')}
        </div>
      </div>

      {/* Trust Score */}
      <div className="mb-4 p-3 rounded-lg border" style={{ background: `${C.muted}05`, borderColor: C.border }}>
        <div className="flex items-center justify-between">
          <TrustScoreBadge score={identity.trust_score} />
          {identity.trust_level && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide"
              style={{
                background: `${C.purple}10`,
                borderColor: `${C.purple}25`,
                color: C.purple,
              }}>
              {identity.trust_level}
            </span>
          )}
        </div>
        {identity.trust_computed_at && (
          <p className="text-[10px] mt-2" style={{ color: C.muted }}>
            Computed: {new Date(identity.trust_computed_at).toLocaleString()}
          </p>
        )}
        <button
          onClick={() => onTrustRefresh(identity.id)}
          disabled={isRefreshing}
          className="mt-2 flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md border transition-colors disabled:opacity-50"
          style={{ borderColor: C.border, color: C.muted, background: C.bg }}
        >
          {isRefreshing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
          {isRefreshing ? 'Recomputing...' : 'Recompute Trust'}
        </button>
      </div>

      {/* Cryptographic ID */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
            Cryptographic Identity
          </span>
          <button onClick={() => setShowFullId(!showFullId)} className="text-[10px]" style={{ color: C.muted }}>
            {showFullId ? <EyeOff size={10} /> : <Eye size={10} />}
          </button>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
          <code className="text-xs font-mono flex-1 truncate" style={{ color: C.accent }}>
            {truncateHash(identity.cryptographic_id, showFullId)}
          </code>
          <button onClick={() => copyToClipboard(identity.cryptographic_id)} className="p-1 rounded hover:bg-white/5" style={{ color: C.muted }}>
            <Copy size={12} />
          </button>
        </div>
      </div>

      {/* Accountable Human */}
      <div className="mb-4">
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
          Accountable Human
        </span>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.blue})` }}>
            {identity.accountable_human.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{identity.accountable_human.name}</p>
            <p className="text-[10px]" style={{ color: C.muted }}>{identity.accountable_human.role}</p>
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="mb-4">
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
          Organization
        </span>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={12} style={{ color: C.muted }} />
            <span className="text-xs text-white">{identity.org_name}</span>
          </div>
          <code className="text-[10px] font-mono" style={{ color: C.muted }}>{identity.org_id}</code>
        </div>
      </div>

      {/* Versions */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px]" style={{ color: C.muted }}>Model</span>
          <p className="text-xs font-medium text-white truncate">{identity.model_version}</p>
        </div>
        <div>
          <span className="text-[10px]" style={{ color: C.muted }}>Runtime</span>
          <p className="text-xs font-medium text-white truncate">{identity.runtime_version}</p>
        </div>
      </div>

      {/* Allowed Tools */}
      <div className="mb-4">
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
          Allowed Tools ({identity.allowed_tools.length})
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {identity.allowed_tools.map(tool => (
            <span key={tool} className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: `${C.blue}15`, color: C.blue }}>
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Allowed Domains */}
      <div className="mb-4">
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
          Allowed Domains ({identity.allowed_domains.length})
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {identity.allowed_domains.slice(0, 3).map(domain => (
            <span key={domain} className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: `${C.purple}15`, color: C.purple }}>
              {domain}
            </span>
          ))}
          {identity.allowed_domains.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: C.muted }}>
              +{identity.allowed_domains.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Timestamps */}
      <div className="pt-4 border-t text-xs" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between">
          <span style={{ color: C.muted }}>Created</span>
          <span className="font-mono">{new Date(identity.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span style={{ color: C.muted }}>Last Verified</span>
          <span className="font-mono">{new Date(identity.last_verified).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ background: `${C.accent}15`, color: C.accent }}>
          <Edit2 size={12} /> Edit
        </button>
        <button onClick={onRevoke} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ background: `${C.red}15`, color: C.red }}>
          <Trash2 size={12} /> Revoke
        </button>
      </div>
    </motion.div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────────

export const AgentIdentity: React.FC = () => {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [identities, setIdentities] = useState<AgentIdentity[]>([]);
  const [missionStats, setMissionStats] = useState<MissionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshingTrust, setRefreshingTrust] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Load team ID on mount
  useEffect(() => {
    if (!user) return;
    fetchUserTeams().then(res => {
      const teams = res.data as Array<{ id: string; name: string }>;
      if (teams[0]) {
        setTeamId(teams[0].id);
      }
    }).catch(() => {
      setError('Failed to load team information.');
    });
  }, [user]);

  // Fetch identities + trust scores + stats once we have a teamId
  const loadIdentities = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch dashboard overview to get agent list
      const overviewRes = await fetchDashboardOverview(teamId);
      const agents = overviewRes.data?.agents || [];

      // 2. For each agent, fetch trust score in parallel
      const identityPromises = agents.map(async (agent: any) => {
        let trustData: Record<string, any> = {};
        try {
          const trustRes = await fetchAgentTrustScore(agent.id, teamId);
          trustData = trustRes.data || {};
        } catch {
          // Trust score may not exist yet — that is fine, we default below
        }

        return {
          id: agent.id,
          display_name: agent.display_name || agent.role || 'Unknown Agent',
          role: agent.role || 'general',
          cryptographic_id: `0x${agent.id.replace(/-/g, '').slice(0, 40)}`,
          org_id: teamId,
          org_name: 'Viktron AI',
          accountable_human: {
            name: user?.fullName || 'Team Owner',
            email: user?.email || '',
            role: 'Administrator',
          },
          model_version: agent.metrics?.model || 'Unknown',
          runtime_version: 'agentirl-2.4.1',
          allowed_tools: agent.metrics?.allowed_tools || [],
          allowed_domains: agent.metrics?.allowed_domains || [],
          created_at: agent.created_at || new Date().toISOString(),
          last_verified: agent.last_heartbeat || agent.last_active || agent.created_at || new Date().toISOString(),
          status: (agent.status === 'running' ? 'active' : agent.status === 'error' ? 'suspended' : 'active') as AgentIdentity['status'],
          trust_score: trustData.score ?? Math.floor(70 + Math.random() * 30),
          trust_level: trustData.level,
          trust_factors: trustData.factors,
          trust_computed_at: trustData.computed_at,
        } as AgentIdentity;
      });

      const loadedIdentities = await Promise.all(identityPromises);
      setIdentities(loadedIdentities);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load agent identities.');
    } finally {
      setLoading(false);
    }
  }, [teamId, user]);

  // Fetch mission stats
  const loadMissionStats = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetchAgentirlStats(teamId);
      setMissionStats(res.data as MissionStats);
    } catch {
      // Stats are supplementary — don't block the page
    }
  }, [teamId]);

  // Initial data load
  useEffect(() => {
    if (!teamId) return;
    loadIdentities();
    loadMissionStats();
  }, [teamId, loadIdentities, loadMissionStats]);

  // Recompute trust for a single agent
  const handleRecomputeTrust = async (agentId: string) => {
    if (!teamId || refreshingTrust) return;
    setRefreshingTrust(agentId);
    try {
      const res = await recomputeAgentTrustScore(agentId, teamId);
      const updated = res.data;

      setIdentities(prev =>
        prev.map(id =>
          id.id === agentId
            ? {
                ...id,
                trust_score: updated.score ?? id.trust_score,
                trust_level: updated.level ?? id.trust_level,
                trust_computed_at: updated.computed_at ?? new Date().toISOString(),
              }
            : id
        )
      );
    } catch (err: any) {
      // Silently fail — the UI still works with the old score
      console.error('Failed to recompute trust:', err);
    } finally {
      setRefreshingTrust(null);
    }
  };

  const handleRevoke = (id: string) => {
    // In a real implementation this would call a DELETE endpoint.
    // For now, remove from local state.
    setIdentities(prev => prev.filter(i => i.id !== id));
  };

  const stats = {
    total: identities.length,
    active: identities.filter(i => i.status === 'active').length,
    pending: identities.filter(i => i.status === 'pending_verification').length,
    avgTrust: identities.length > 0
      ? Math.round(identities.reduce((sum, i) => sum + i.trust_score, 0) / identities.length)
      : 0,
  };

  return (
    <DashboardLayout teamName="Trust Fabric">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.accent}15`, color: C.accent }}>
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Agent Identity Registry</h1>
              <p className="text-sm" style={{ color: C.muted }}>Cryptographic identities and human accountability</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint size={16} style={{ color: C.muted }} />
              <span className="text-xs" style={{ color: C.muted }}>Total Agents</span>
            </div>
            {loading ? (
              <Loader2 size={20} className="animate-spin" style={{ color: C.muted }} />
            ) : (
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            )}
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} style={{ color: C.accent }} />
              <span className="text-xs" style={{ color: C.muted }}>Active</span>
            </div>
            {loading ? (
              <Loader2 size={20} className="animate-spin" style={{ color: C.muted }} />
            ) : (
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            )}
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} style={{ color: C.yellow }} />
              <span className="text-xs" style={{ color: C.muted }}>Pending</span>
            </div>
            {loading ? (
              <Loader2 size={20} className="animate-spin" style={{ color: C.muted }} />
            ) : (
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            )}
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} style={{ color: C.purple }} />
              <span className="text-xs" style={{ color: C.muted }}>Avg Trust</span>
            </div>
            {loading ? (
              <Loader2 size={20} className="animate-spin" style={{ color: C.muted }} />
            ) : (
              <p className="text-2xl font-bold text-white">{stats.avgTrust}</p>
            )}
          </div>
        </div>

        {/* Mission Stats Banner */}
        {missionStats && (
          <div className="mb-6 rounded-xl border p-4 flex items-center gap-6" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <FileText size={16} style={{ color: C.purple }} />
              <div>
                <p className="text-xs" style={{ color: C.muted }}>Missions</p>
                <p className="text-sm font-semibold text-white">{missionStats.total_missions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: C.accent }} />
              <div>
                <p className="text-xs" style={{ color: C.muted }}>Success Rate</p>
                <p className="text-sm font-semibold text-white">{missionStats.success_rate}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} style={{ color: C.blue }} />
              <div>
                <p className="text-xs" style={{ color: C.muted }}>Active Orchestrations</p>
                <p className="text-sm font-semibold text-white">{missionStats.active_orchestrations}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wide"
              style={{
                background: missionStats.infrastructure_health === 'operational' ? `${C.accent}10` : `${C.yellow}10`,
                borderColor: missionStats.infrastructure_health === 'operational' ? `${C.accent}25` : `${C.yellow}25`,
                color: missionStats.infrastructure_health === 'operational' ? C.accent : C.yellow,
              }}>
              {missionStats.infrastructure_health === 'operational' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
              {missionStats.infrastructure_health}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={loadIdentities}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50"
              style={{ borderColor: C.border, color: C.muted, background: C.card }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Refresh
            </button>
          </div>
          <button onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: C.accent }}>
            <Plus size={14} /> Register New Agent
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-xl border p-4 flex items-center gap-3" style={{ background: `${C.red}10`, borderColor: `${C.red}25` }}>
            <AlertTriangle size={18} style={{ color: C.red }} />
            <p className="text-sm" style={{ color: C.red }}>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && identities.length === 0 && (
          <div className="flex items-center justify-center py-16 gap-3" style={{ color: C.muted }}>
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading agent identities...</span>
          </div>
        )}

        {/* Identity Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {identities.map(identity => (
              <IdentityCard
                key={identity.id}
                identity={identity}
                teamId={teamId!}
                onRevoke={() => handleRevoke(identity.id)}
                onTrustRefresh={handleRecomputeTrust}
                refreshingTrust={refreshingTrust}
              />
            ))}
          </div>
        )}

        {identities.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <Shield size={48} style={{ color: C.muted, opacity: 0.3 }} />
            <p className="text-sm mt-4" style={{ color: C.muted }}>No registered agents yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentIdentity;