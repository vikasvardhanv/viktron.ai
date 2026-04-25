import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key, Clock, DollarSign, Lock, Unlock, Plus,
  AlertTriangle, Activity, RefreshCw, Eye, EyeOff, Loader2
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  fetchUserTeams,
  fetchAgentIRLMissions,
  fetchMissionTokens,
  issueDelegationToken,
  revokeDelegationToken,
  type DelegationToken,
  type AgentIRLMission,
  type DelegationTokenScope,
  type DelegationTokenConstraints,
} from '../../services/dashboardApi';

const C = {
  bg: '#0B0F19', card: '#111827', border: '#1F2937',
  accent: '#10B981', purple: '#8B5CF6', blue: '#3B82F6',
  red: '#EF4444', yellow: '#F59E0B', muted: '#6B7280',
};

interface Mission {
  id: string;
  title: string;
  status: string;
  assigned_agent_role?: string;
}

const TokenCard: React.FC<{
  token: DelegationToken;
  missionTitle?: string;
  onRevoke: () => void;
  revoking: boolean;
}> = ({ token, missionTitle, onRevoke, revoking }) => {
  const [showFullHash, setShowFullHash] = useState(false);

  const status = token.revoked_at
    ? 'revoked'
    : token.is_valid
      ? 'active'
      : 'expired';

  const statusColors: Record<string, string> = {
    active: C.accent,
    expired: C.muted,
    revoked: C.red,
  };

  const sensitivityColors: Record<string, string> = {
    public: C.accent,
    internal: C.blue,
    confidential: C.yellow,
    restricted: C.red,
  };

  const maxCost = token.constraints.max_cost ?? 100;
  const maxDuration = token.constraints.max_duration_seconds ?? 3600;
  const sensitivity = token.constraints.data_sensitivity_max ?? 'internal';
  const maxDepth = token.constraints.max_delegation_depth ?? 3;
  const allowedTools = token.scope.allowed_tools ?? ['*'];
  const allowedDomains = token.scope.allowed_domains ?? ['*'];

  const expiresAt = token.expires_at ? new Date(token.expires_at) : null;
  const issuedAt = token.issued_at ? new Date(token.issued_at) : null;
  let timeRemainingPct = 100;
  if (expiresAt && issuedAt) {
    const totalMs = expiresAt.getTime() - issuedAt.getTime();
    const remainingMs = Math.max(0, expiresAt.getTime() - Date.now());
    timeRemainingPct = totalMs > 0 ? (remainingMs / totalMs) * 100 : 0;
  }

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
            style={{ background: `${C.purple}15`, color: C.purple }}>
            <Key size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{missionTitle || `Mission ${token.mission_id.slice(0, 8)}`}</h3>
            <p className="text-xs" style={{ color: C.muted }}>Depth {token.depth} &middot; {token.issuer_agent_id ? `Agent ${token.issuer_agent_id.slice(0, 8)}` : 'No issuer'}</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full border text-[10px] font-medium uppercase tracking-wide"
          style={{
            background: `${statusColors[status]}10`,
            borderColor: `${statusColors[status]}25`,
            color: statusColors[status],
          }}>
          {status}
        </span>
      </div>

      {/* Token Hash */}
      {token.jwt_hash && (
        <div className="mb-4 p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
          <div className="flex items-center justify-between">
            <code className="text-xs font-mono truncate" style={{ color: C.accent }}>
              {showFullHash ? token.jwt_hash : `${token.jwt_hash.slice(0, 14)}...`}
            </code>
            <button onClick={() => setShowFullHash(!showFullHash)} style={{ color: C.muted }}>
              {showFullHash ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          </div>
        </div>
      )}

      {/* Usage Meters */}
      <div className="mb-4 space-y-3">
        {/* Time Remaining */}
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="flex items-center gap-1" style={{ color: C.muted }}>
              <Clock size={10} /> Time Remaining
            </span>
            <span style={{ color: timeRemainingPct < 20 ? C.red : C.muted }}>
              {timeRemainingPct < 100 ? `${Math.round(timeRemainingPct)}%` : 'Full'}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${C.muted}10` }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, timeRemainingPct)}%`,
                background: timeRemainingPct < 20 ? C.red : timeRemainingPct < 50 ? C.yellow : C.accent,
              }} />
          </div>
        </div>

        {/* Cost Limit */}
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="flex items-center gap-1" style={{ color: C.muted }}>
              <DollarSign size={10} /> Cost Limit
            </span>
            <span style={{ color: C.muted }}>
              ${maxCost.toFixed(2)}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${C.muted}10` }}>
            <div className="h-full rounded-full"
              style={{ width: '0%', background: C.accent }} />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
          <span className="text-[10px] block" style={{ color: C.muted }}>Depth</span>
          <span className="text-xs font-semibold text-white">{maxDepth}</span>
        </div>
        <div className="p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
          <span className="text-[10px] block" style={{ color: C.muted }}>Duration</span>
          <span className="text-xs font-semibold text-white">{maxDuration >= 3600 ? `${(maxDuration / 3600).toFixed(0)}h` : `${(maxDuration / 60).toFixed(0)}m`}</span>
        </div>
        <div className="p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
          <span className="text-[10px] block" style={{ color: C.muted }}>Sensitivity</span>
          <span className="text-xs font-semibold capitalize" style={{ color: sensitivityColors[sensitivity] ?? C.muted }}>
            {sensitivity}
          </span>
        </div>
      </div>

      {/* Allowed Tools */}
      {allowedTools.length > 0 && (
        <div className="mb-4">
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
            Allowed Tools
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {allowedTools.map(tool => (
              <span key={tool} className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: `${C.blue}15`, color: C.blue }}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Allowed Domains */}
      {allowedDomains.length > 0 && (
        <div className="mb-4">
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>
            Allowed Domains
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {allowedDomains.map(domain => (
              <span key={domain} className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: `${C.purple}15`, color: C.purple }}>
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
        <span className="text-[10px]" style={{ color: C.muted }}>
          {token.issued_at ? `Issued ${new Date(token.issued_at).toLocaleDateString()}` : 'N/A'}
        </span>
        {status === 'active' && (
          <button
            onClick={onRevoke}
            disabled={revoking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            style={{ background: `${C.red}15`, color: C.red }}
          >
            {revoking ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />} Revoke
          </button>
        )}
      </div>
    </motion.div>
  );
};

const CreateTokenModal: React.FC<{
  missions: Mission[];
  onClose: () => void;
  onCreate: (data: {
    mission_id: string;
    scope: DelegationTokenScope;
    constraints: DelegationTokenConstraints;
    duration_seconds?: number;
  }) => void;
  creating: boolean;
}> = ({ missions, onClose, onCreate, creating }) => {
  const [formData, setFormData] = useState({
    mission_id: missions[0]?.id ?? '',
    allowed_tools: 'crm_read, crm_write',
    allowed_domains: '*',
    data_sensitivity: 'internal',
    max_cost: 50,
    max_duration_hours: 24,
    max_delegation_depth: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg rounded-2xl border p-6"
        style={{ background: C.card, borderColor: C.border }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.purple}15`, color: C.purple }}>
              <Key size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Delegation Token</h2>
              <p className="text-xs" style={{ color: C.muted }}>Define scope and limits for agent execution</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: C.muted }}><Plus size={20} className="rotate-45" /></button>
        </div>

        <div className="space-y-4">
          {/* Mission selector */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Mission</label>
            <select
              value={formData.mission_id}
              onChange={e => setFormData({ ...formData, mission_id: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
              style={{ background: C.bg, borderColor: C.border }}
            >
              {missions.map(m => (
                <option key={m.id} value={m.id}>{m.title || m.id}</option>
              ))}
            </select>
          </div>

          {/* Tools & Domains */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Allowed Tools (comma-separated)</label>
            <input
              type="text"
              value={formData.allowed_tools}
              onChange={e => setFormData({ ...formData, allowed_tools: e.target.value })}
              placeholder="crm_read, crm_write, email_send"
              className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
              style={{ background: C.bg, borderColor: C.border }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Allowed Domains (comma-separated, or *)</label>
            <input
              type="text"
              value={formData.allowed_domains}
              onChange={e => setFormData({ ...formData, allowed_domains: e.target.value })}
              placeholder="salesforce.com, gmail.com"
              className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
              style={{ background: C.bg, borderColor: C.border }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Time Limit (hours)</label>
              <input
                type="number"
                value={formData.max_duration_hours}
                onChange={e => setFormData({ ...formData, max_duration_hours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                style={{ background: C.bg, borderColor: C.border }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Cost Limit (USD)</label>
              <input
                type="number"
                value={formData.max_cost}
                onChange={e => setFormData({ ...formData, max_cost: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                style={{ background: C.bg, borderColor: C.border }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Data Sensitivity</label>
              <select
                value={formData.data_sensitivity}
                onChange={e => setFormData({ ...formData, data_sensitivity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                style={{ background: C.bg, borderColor: C.border }}
              >
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="confidential">Confidential</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Max Delegation Depth</label>
              <input
                type="number"
                value={formData.max_delegation_depth}
                onChange={e => setFormData({ ...formData, max_delegation_depth: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                style={{ background: C.bg, borderColor: C.border }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: C.border, color: C.muted, background: C.card }}>
            Cancel
          </button>
          <button
            onClick={() => {
              const tools = formData.allowed_tools.split(',').map(s => s.trim()).filter(Boolean);
              const domains = formData.allowed_domains.trim() === '*'
                ? ['*']
                : formData.allowed_domains.split(',').map(s => s.trim()).filter(Boolean);
              onCreate({
                mission_id: formData.mission_id,
                scope: {
                  allowed_actions: ['read', 'write'],
                  allowed_tools: tools.length ? tools : ['*'],
                  allowed_domains: domains.length ? domains : ['*'],
                },
                constraints: {
                  max_cost: formData.max_cost,
                  max_duration_seconds: formData.max_duration_hours * 3600,
                  data_sensitivity_max: formData.data_sensitivity,
                  max_delegation_depth: formData.max_delegation_depth,
                },
                duration_seconds: formData.max_duration_hours * 3600,
              });
            }}
            disabled={creating || !formData.mission_id}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ background: C.accent }}
          >
            {creating ? 'Creating...' : 'Create Token'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const DelegationTokens: React.FC = () => {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [tokens, setTokens] = useState<DelegationToken[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionMap, setMissionMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Load team
  useEffect(() => {
    if (!user) return;
    fetchUserTeams().then(res => {
      const teams = res.data as Array<{ id: string; name: string }>;
      if (teams[0]) {
        setTeamId(teams[0].id);
        setTeamName(teams[0].name ?? '');
      }
    }).catch(() => {
      setError('Failed to load team information.');
    });
  }, [user]);

  // Fetch tokens across all missions for the team
  const fetchTokens = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch missions first
      const missionsRes = await fetchAgentIRLMissions(teamId);
      const missionList: Mission[] = missionsRes.data.missions ?? missionsRes.data ?? [];
      setMissions(missionList);
      const map: Record<string, string> = {};
      missionList.forEach((m: Mission) => { map[m.id] = m.title ?? m.id; });
      setMissionMap(map);

      // Fetch tokens for each mission in parallel
      const tokenPromises = missionList.map((m: Mission) =>
        fetchMissionTokens(m.id)
          .then(res => (res.data.tokens ?? []) as DelegationToken[])
          .catch(() => [] as DelegationToken[])
      );
      const tokenArrays = await Promise.all(tokenPromises);
      const allTokens = tokenArrays.flat();
      setTokens(allTokens);
    } catch (err: any) {
      setError('Failed to load delegation tokens. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Load tokens on mount + poll
  useEffect(() => {
    fetchTokens();
    const poll = setInterval(fetchTokens, 30_000);
    return () => clearInterval(poll);
  }, [fetchTokens]);

  // Issue a new token
  const handleCreateToken = async (data: {
    mission_id: string;
    scope: DelegationTokenScope;
    constraints: DelegationTokenConstraints;
    duration_seconds?: number;
  }) => {
    if (!teamId) return;
    setCreating(true);
    try {
      await issueDelegationToken(teamId, data);
      setShowCreateModal(false);
      await fetchTokens();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to create token.');
    } finally {
      setCreating(false);
    }
  };

  // Revoke a token
  const handleRevoke = async (tokenId: string) => {
    setRevokingId(tokenId);
    try {
      await revokeDelegationToken(tokenId);
      await fetchTokens();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to revoke token.');
    } finally {
      setRevokingId(null);
    }
  };

  const stats = {
    total: tokens.length,
    active: tokens.filter(t => !t.revoked_at && t.is_valid).length,
    revoked: tokens.filter(t => t.revoked_at !== null).length,
    maxCostBudget: tokens.reduce((sum, t) => sum + (t.constraints.max_cost ?? 0), 0),
  };

  return (
    <DashboardLayout teamName={teamName || 'Trust Fabric'}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.purple}15`, color: C.purple }}>
              <Key size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Delegation Tokens</h1>
              <p className="text-sm" style={{ color: C.muted }}>Task-scoped credentials with enforced limits</p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg border" style={{ background: `${C.red}10`, borderColor: `${C.red}25` }}>
            <AlertTriangle size={16} style={{ color: C.red }} />
            <span className="text-sm" style={{ color: C.red }}>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto" style={{ color: C.red }}>Dismiss</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Key size={16} style={{ color: C.muted }} />
              <span className="text-xs" style={{ color: C.muted }}>Total Tokens</span>
            </div>
            <p className="text-2xl font-bold text-white">{loading ? '...' : stats.total}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Unlock size={16} style={{ color: C.accent }} />
              <span className="text-xs" style={{ color: C.muted }}>Active</span>
            </div>
            <p className="text-2xl font-bold text-white">{loading ? '...' : stats.active}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} style={{ color: C.yellow }} />
              <span className="text-xs" style={{ color: C.muted }}>Cost Budget</span>
            </div>
            <p className="text-2xl font-bold text-white">${stats.maxCostBudget.toFixed(2)}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} style={{ color: C.purple }} />
              <span className="text-xs" style={{ color: C.muted }}>Revoked</span>
            </div>
            <p className="text-2xl font-bold text-white">{loading ? '...' : stats.revoked}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTokens}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50"
              style={{ borderColor: C.border, color: C.muted, background: C.card }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!teamId || missions.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ background: C.purple }}
          >
            <Plus size={14} /> Create Token
          </button>
        </div>

        {/* Loading State */}
        {loading && tokens.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin mb-4" style={{ color: C.purple }} />
            <p className="text-sm" style={{ color: C.muted }}>Loading delegation tokens...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && tokens.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Key size={48} className="mb-4 opacity-20" style={{ color: C.muted }} />
            <p className="text-sm font-medium text-white mb-1">No delegation tokens yet</p>
            <p className="text-xs" style={{ color: C.muted }}>Create a token to define scoped credentials for agent missions</p>
          </div>
        )}

        {/* Token Grid */}
        {tokens.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map(token => (
              <TokenCard
                key={token.id}
                token={token}
                missionTitle={missionMap[token.mission_id]}
                onRevoke={() => handleRevoke(token.id)}
                revoking={revokingId === token.id}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateTokenModal
            missions={missions}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateToken}
            creating={creating}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default DelegationTokens;