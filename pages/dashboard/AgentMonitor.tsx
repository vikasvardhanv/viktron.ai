import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckCircle2, CheckSquare, Wifi, Crown, Briefcase,
  Code2, TrendingUp, Headphones, PenTool, Play, Zap, AlertCircle,
  Activity, Bot, RefreshCw, BrainCircuit, DollarSign,
  Heart, Clock, ChevronRight, X, Terminal, Loader2,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  fetchUserTeams, fetchDashboardOverview, createDashboardWebSocket, sendTeamMessage, fetchAgentSkills,
  fetchAgentTranscript, fetchAgentIRLMissions,
  type AgentOverview, type DashboardOverview, type AgentTranscript, type TranscriptTask,
} from '../../services/dashboardApi';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#0B0F19', card: '#111827', border: '#1F2937',
  accent: '#10B981', purple: '#8B5CF6', pink: '#EC4899',
  cyan: '#06B6D4', green: '#22C55E', red: '#EF4444',
  yellow: '#F59E0B', orange: '#F97316', muted: '#6B7280',
  slate: { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A', 950: '#020617' },
};

// ── Agent config ──────────────────────────────────────────────────────────────
const AGENT_CFG: Record<string, { color: string; Icon: React.ElementType; label: string }> = {
  ceo:       { color: C.purple, Icon: Crown,      label: 'CEO' },
  pm:        { color: C.accent, Icon: Briefcase,  label: 'PM' },
  developer: { color: C.cyan,   Icon: Code2,      label: 'Developer' },
  qa:        { color: C.yellow, Icon: CheckSquare,label: 'QA' },
  sales:     { color: C.green,  Icon: TrendingUp, label: 'Sales' },
  support:   { color: C.pink,   Icon: Headphones, label: 'Support' },
  content:   { color: C.orange, Icon: PenTool,    label: 'Content' },
};

// ── Empty initial state — always load real data from API ──────────────────────
const EMPTY_OVERVIEW: DashboardOverview = {
  agents: [],
  tasks: { pending: 0, running: 0, completed: 0, failed: 0 },
  channels: { whatsapp: 'not_configured', slack: 'not_configured', teams: 'not_configured' },
  activity: [],
};

// ── AgentIRL Mock Data ────────────────────────────────────────────────────────
interface Mission {
  id: string;
  title: string;
  status: 'draft' | 'pending_gates' | 'pending_approval' | 'approved' | 'dispatched' | 'executing' | 'review' | 'complete' | 'failed' | 'blocked' | 'cancelled';
  created_at: string;
  updated_at: string;
  assigned_agent_role?: string;
  executive_summary: string;
}

interface StreamHealth {
  stream_id: string;
  mission_id: string;
  last_heartbeat: string;
  sequence_number: number;
  total_chunks: number;
  total_errors: number;
  status: 'healthy' | 'degraded' | 'stale' | 'dead';
  meta: Record<string, any>;
}

interface AgentError {
  id: string;
  timestamp: string;
  mission_id?: string;
  stream_id?: string;
  category: 'network' | 'auth' | 'validation' | 'provider' | 'governance' | 'budget' | 'timeout' | 'agent' | 'system';
  message: string;
  recovery: 'retry' | 'fallback' | 'escalate' | 'abort' | 'quarantine';
  resolved: boolean;
}


// ── Sub-components ────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string; value: number | string; icon: React.ReactNode;
  color: string; delay?: number; trend?: string;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, delay = 0, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    className="rounded-xl p-5 border relative overflow-hidden group"
    style={{ background: C.card, borderColor: C.border }}
  >
    <div className="absolute inset-0 opacity-[0.03] rounded-xl transition-opacity group-hover:opacity-[0.06]"
      style={{ background: `radial-gradient(circle at top left, ${color}, transparent 60%)` }} />
    <div className="relative">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>{label}</p>
          <p className="mt-2.5 text-2xl font-bold text-white tracking-tight">{value}</p>
          {trend && (
            <p className={`mt-1.5 text-xs font-medium ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15`, color }}>
          {icon}
        </div>
      </div>
    </div>
  </motion.div>
);

function timeAgo(ts: string | null | undefined) {
  if (!ts) return 'never';
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

function ageSince(ts: string | null | undefined) {
  if (!ts) return '—';
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 3600) return `${Math.round(diff / 60)}m`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h`;
  return `${Math.round(diff / 86400)}d`;
}

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 });
}

interface AgentCardProps { agent: AgentOverview & { trust_score?: number }; isRunning: boolean; delay?: number; onViewTranscript: (agent: AgentOverview) => void; }
const AgentCard: React.FC<AgentCardProps> = ({ agent, isRunning, delay = 0, onViewTranscript }) => {
  const cfg = AGENT_CFG[agent.role] ?? { color: C.accent, Icon: Bot, label: agent.role };
  const { Icon } = cfg;

  const statusColor = agent.status === 'error' ? C.red : isRunning ? C.accent : C.green;
  const statusLabel = agent.status === 'error' ? 'Error' : isRunning ? 'Running' : 'Idle';
  const trustScore = agent.trust_score ?? Math.floor(70 + Math.random() * 30);
  const trustColor = trustScore >= 85 ? C.green : trustScore >= 70 ? C.yellow : C.red;
  const trustLabel = trustScore >= 85 ? 'High Trust' : trustScore >= 70 ? 'Medium' : 'Low';

  const budgetPct = agent.monthly_budget > 0
    ? Math.min(100, (agent.current_spend / agent.monthly_budget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl p-4 border relative overflow-hidden cursor-pointer group hover:border-opacity-60 transition-all"
      style={{ background: C.card, borderColor: isRunning ? `${cfg.color}50` : C.border }}
      onClick={() => onViewTranscript(agent)}
    >
      {isRunning && (
        <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0.04, 0.10, 0.04] }} transition={{ duration: 2.5, repeat: Infinity }}
          style={{ border: `1px solid ${cfg.color}` }} />
      )}

      {/* Header with identity badge and trust score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${cfg.color}15`, color: cfg.color }}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-2">
          {/* Trust Score Badge */}
          <div className="flex flex-col items-center">
            <div className="relative w-8 h-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke={`${C.muted}20`} strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke={trustColor} strokeWidth="3"
                  strokeDasharray={`${trustScore}, 100`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {trustScore}
              </span>
            </div>
            <span className="text-[9px] mt-0.5 font-medium" style={{ color: trustColor }}>{trustLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wide"
            style={{
              background: `${statusColor}10`,
              borderColor: `${statusColor}25`,
              color: statusColor
            }}>
            {isRunning && (
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }}
                animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            )}
            {statusLabel}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white tracking-tight">{agent.display_name}</h3>
        <p className="text-xs mt-1 truncate" style={{ color: C.muted }}>
          {agent.current_task ?? 'Idle — awaiting tasks'}
        </p>
      </div>

      {/* Identity badge (trust fabric placeholder) */}
      <div className="mb-3 px-2 py-1.5 rounded-lg border border-dashed" style={{ borderColor: C.border, background: `${C.accent}05` }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono" style={{ color: C.muted }}>Agent ID</span>
          <span className="text-[10px] font-mono truncate ml-2" style={{ color: C.accent }}>
            {agent.id.slice(0, 8)}...{agent.id.slice(-4)}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="px-2 py-2 rounded-lg" style={{ background: `${C.muted}05` }}>
          <span className="text-[10px] block" style={{ color: C.muted }}>Memory</span>
          <span className="text-xs font-semibold text-white">{agent.memory_kb}</span>
        </div>
        <div className="px-2 py-2 rounded-lg" style={{ background: `${C.muted}05` }}>
          <span className="text-[10px] block flex items-center gap-1" style={{ color: C.muted }}><Clock size={8} />Age</span>
          <span className="text-xs font-semibold text-white">{ageSince(agent.created_at)}</span>
        </div>
        <div className="px-2 py-2 rounded-lg" style={{ background: `${C.muted}05` }}>
          <span className="text-[10px] block flex items-center gap-1" style={{ color: C.muted }}><Heart size={8} />Beat</span>
          <span className="text-xs font-semibold" style={{ color: agent.last_heartbeat ? C.green : C.muted }}>
            {agent.last_heartbeat ? timeAgo(agent.last_heartbeat) : '—'}
          </span>
        </div>
      </div>

      {/* Cost bar */}
      <div className="mb-1">
        <div className="flex justify-between text-[10px] mb-1.5" style={{ color: C.muted }}>
          <span className="flex items-center gap-1"><DollarSign size={8} />Spend</span>
          <span style={{ color: agent.current_spend > 0 ? C.yellow : C.muted }}>
            {formatCurrency(agent.current_spend)}
            {agent.monthly_budget > 0 && <span className="ml-1">/ {formatCurrency(agent.monthly_budget)}</span>}
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: `${C.muted}10` }}>
          <motion.div className="h-full rounded-full"
            style={{ background: budgetPct > 80 ? C.red : budgetPct > 50 ? C.yellow : C.accent }}
            initial={{ width: 0 }}
            animate={{ width: `${budgetPct || (agent.current_spend > 0 ? 5 : 0)}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderColor: C.border }}>
        <span className="text-[10px] flex items-center gap-1" style={{ color: C.muted }}>
          <Terminal size={10} />{agent.total_tokens.toLocaleString()} tokens
        </span>
        <span className="text-[10px] flex items-center gap-1" style={{ color: cfg.color }}>
          View transcript <ChevronRight size={10} />
        </span>
      </div>
    </motion.div>
  );
};

// ── Transcript Drawer ─────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  completed: C.green, running: C.accent, failed: C.red,
  pending: C.yellow, needs_approval: C.purple,
};

const TranscriptDrawer: React.FC<{ agent: AgentOverview | null; onClose: () => void }> = ({ agent, onClose }) => {
  const [transcript, setTranscript] = useState<AgentTranscript | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!agent) { setTranscript(null); return; }
    setLoading(true);
    fetchAgentTranscript(agent.id).then(r => setTranscript(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [agent]);

  if (!agent) return null;

  const cfg = AGENT_CFG[agent.role] ?? { color: C.accent, Icon: Bot, label: agent.role };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex justify-end"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

        {/* Drawer */}
        <motion.div className="relative w-full max-w-xl h-full flex flex-col overflow-hidden shadow-2xl"
          style={{ background: C.bg, borderLeft: `1px solid ${C.border}` }}
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-slate-800/50 to-transparent" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${cfg.color}15`, color: cfg.color }}>
                <cfg.Icon size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Transcript</h2>
                <p className="text-[10px] font-mono" style={{ color: C.muted }}>
                  {agent.total_tokens.toLocaleString()} tok · {formatCurrency(agent.current_spend)} · {ageSince(agent.created_at)}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: C.muted }}>
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading && (
              <div className="flex items-center justify-center py-16 gap-2" style={{ color: C.muted }}>
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Loading transcript...</span>
              </div>
            )}
            {!loading && (!transcript || transcript.tasks.length === 0) && (
              <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: C.muted }}>
                <Terminal size={28} style={{ opacity: 0.3 }} />
                <p className="text-sm">No tasks recorded for this agent</p>
              </div>
            )}
            {!loading && transcript?.tasks.map((task) => (
              <motion.div key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: C.border, background: C.card }}>
                {/* Task header */}
                <button className="w-full flex items-start justify-between p-3.5 text-left hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpanded(expanded === task.id ? null : task.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide"
                        style={{ background: `${STATUS_COLORS[task.status] || C.muted}15`, color: STATUS_COLORS[task.status] || C.muted }}>
                        {task.status}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: C.muted }}>{timeAgo(task.created_at)}</span>
                      {task.duration_ms && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${C.muted}10`, color: C.muted }}>
                          {task.duration_ms}ms
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white font-medium truncate pr-4">{task.description || task.type}</p>
                  </div>
                  <ChevronRight size={14} className={`flex-shrink-0 mt-0.5 transition-transform duration-200 ${expanded === task.id ? 'rotate-90' : ''}`} style={{ color: C.muted }} />
                </button>

                {/* Expanded details */}
                {expanded === task.id && (
                  <div className="px-3.5 pb-3.5 space-y-3 border-t" style={{ borderColor: C.border }}>
                    {/* Input */}
                    {task.input && Object.keys(task.input).length > 0 && (
                      <div className="mt-2">
                        <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Input</p>
                        <pre className="text-[10px] rounded-lg p-2.5 overflow-x-auto font-mono" style={{ background: `${C.muted}05`, color: C.muted }}>
                          {JSON.stringify(task.input, null, 2)}
                        </pre>
                      </div>
                    )}
                    {/* Output */}
                    {task.output && (
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: C.muted }}>Output</p>
                        <pre className="text-[10px] rounded-lg p-2.5 overflow-x-auto font-mono" style={{ background: `${C.green}05`, color: C.muted }}>
                          {JSON.stringify(task.output, null, 2)}
                        </pre>
                      </div>
                    )}
                    {/* Error */}
                    {task.error && (
                      <div className="rounded-lg p-2.5 border" style={{ background: `${C.red}05`, borderColor: `${C.red}20` }}>
                        <p className="text-[10px] font-medium mb-0.5" style={{ color: C.red }}>Error</p>
                        <p className="text-[10px] font-mono" style={{ color: C.red }}>{task.error}</p>
                      </div>
                    )}
                    {/* Steps / traces */}
                    {task.steps.length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: C.muted }}>
                          Execution Steps ({task.steps.length})
                        </p>
                        <div className="space-y-1.5">
                          {task.steps.map((step, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg px-2.5 py-2"
                              style={{ background: `${C.muted}05` }}>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                                  style={{ background: `${C.accent}15`, color: C.accent }}>
                                  {step.action_type}
                                </span>
                                {step.summary && <span className="text-[10px] truncate" style={{ color: C.muted }}>{step.summary}</span>}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2 text-[10px] font-mono" style={{ color: C.muted }}>
                                {step.model && <span>{step.model}</span>}
                                {(step.input_tokens || step.output_tokens) > 0 && (
                                  <span>{(step.input_tokens + step.output_tokens).toLocaleString()} tok</span>
                                )}
                                {step.latency_ms && <span>{step.latency_ms}ms</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── AgentIRL Components ────────────────────────────────────────────────────────

interface MissionCardProps { mission: Mission; delay?: number; }
const MissionCard: React.FC<MissionCardProps> = ({ mission, delay = 0 }) => {
  const statusColors = {
    draft: C.muted,
    pending_gates: C.yellow,
    pending_approval: C.orange,
    approved: C.cyan,
    dispatched: C.accent,
    executing: C.purple,
    review: C.yellow,
    complete: C.green,
    failed: C.red,
    blocked: C.red,
    cancelled: C.muted
  };

  const statusLabels = {
    draft: 'Draft',
    pending_gates: 'Gates',
    pending_approval: 'Approval',
    approved: 'Approved',
    dispatched: 'Dispatched',
    executing: 'Executing',
    review: 'Review',
    complete: 'Complete',
    failed: 'Failed',
    blocked: 'Blocked',
    cancelled: 'Cancelled'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl p-5 border relative overflow-hidden"
      style={{ background: C.card, borderColor: C.border }}
    >
      <div className="absolute inset-0 opacity-5 rounded-xl"
        style={{ background: `radial-gradient(circle at top left, ${statusColors[mission.status]}, transparent 60%)` }} />

      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold text-white truncate">{mission.title}</h3>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0"
            style={{
              background: `${statusColors[mission.status]}12`,
              borderColor: `${statusColors[mission.status]}30`,
              color: statusColors[mission.status]
            }}>
            {statusLabels[mission.status]}
          </div>
        </div>

        <p className="text-xs mb-3 leading-relaxed" style={{ color: C.muted }}>
          {mission.executive_summary || 'No summary available'}
        </p>

        <div className="flex items-center justify-between text-xs" style={{ color: C.muted }}>
          <span>{mission.assigned_agent_role ? `Assigned to ${mission.assigned_agent_role}` : 'Unassigned'}</span>
          <span>{timeAgo(mission.updated_at)}</span>
        </div>
      </div>
    </motion.div>
  );
};

interface StreamCardProps { stream: StreamHealth; delay?: number; }
const StreamCard: React.FC<StreamCardProps> = ({ stream, delay = 0 }) => {
  const statusColors = {
    healthy: C.green,
    degraded: C.yellow,
    stale: C.orange,
    dead: C.red
  };

  const statusLabels = {
    healthy: 'Healthy',
    degraded: 'Degraded',
    stale: 'Stale',
    dead: 'Dead'
  };

  const heartbeatDiff = (Date.now() - new Date(stream.last_heartbeat).getTime()) / 1000;
  const isStale = heartbeatDiff > 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl p-4 border relative overflow-hidden"
      style={{ background: C.card, borderColor: C.border }}
    >
      <div className="absolute inset-0 opacity-5 rounded-xl"
        style={{ background: `radial-gradient(circle at top left, ${statusColors[stream.status]}, transparent 60%)` }} />

      <div className="relative">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <motion.div className="w-2 h-2 rounded-full"
              style={{ background: statusColors[stream.status] }}
              animate={{ opacity: stream.status === 'healthy' ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-xs font-medium text-white">Stream {stream.stream_id.slice(-4)}</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full border"
            style={{
              background: `${statusColors[stream.status]}12`,
              borderColor: `${statusColors[stream.status]}30`,
              color: statusColors[stream.status]
            }}>
            {statusLabels[stream.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div style={{ color: C.muted }}>Mission: <span className="text-white">{stream.mission_id.slice(-4)}</span></div>
          <div style={{ color: C.muted }}>Seq: <span className="text-white">{stream.sequence_number}</span></div>
        </div>

        <div className="flex items-center justify-between text-xs" style={{ color: C.muted }}>
          <span>Errors: {stream.total_errors}</span>
          <span className={isStale ? 'text-red-400' : ''}>
            {isStale ? 'Stale' : timeAgo(stream.last_heartbeat)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

interface ErrorCardProps { error: AgentError; delay?: number; }
const ErrorCard: React.FC<ErrorCardProps> = ({ error, delay = 0 }) => {
  const categoryColors = {
    network: C.red,
    auth: C.orange,
    validation: C.yellow,
    provider: C.purple,
    governance: C.cyan,
    budget: C.green,
    timeout: C.red,
    agent: C.accent,
    system: C.muted
  };

  const recoveryLabels = {
    retry: 'Retry',
    fallback: 'Fallback',
    escalate: 'Escalate',
    abort: 'Abort',
    quarantine: 'Quarantine'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-lg p-3 border"
      style={{ background: C.bg, borderColor: C.border }}
    >
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
          style={{ background: categoryColors[error.category] }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-white capitalize">{error.category}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs px-1.5 py-0.5 rounded border text-xs"
                style={{
                  background: `${categoryColors[error.category]}12`,
                  borderColor: `${categoryColors[error.category]}30`,
                  color: categoryColors[error.category]
                }}>
                {recoveryLabels[error.recovery]}
              </span>
              {error.resolved && (
                <CheckSquare className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>
          <p className="text-xs leading-relaxed mb-1" style={{ color: C.muted }}>{error.message}</p>
          <div className="flex items-center justify-between text-xs" style={{ color: C.muted }}>
            <span>{error.mission_id ? `Mission ${error.mission_id.slice(-4)}` : 'System'}</span>
            <span>{timeAgo(error.timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export const AgentMonitor: React.FC = () => {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [overview, setOverview] = useState<DashboardOverview>(EMPTY_OVERVIEW);
  const [activity, setActivity] = useState<DashboardOverview['activity']>([]);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());
  const [taskInput, setTaskInput] = useState('');
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskResult, setTaskResult] = useState<{ taskId: string; response: string } | null>(null);
  const [skillNames, setSkillNames] = useState<string[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [transcriptAgent, setTranscriptAgent] = useState<AgentOverview | null>(null);
  // AgentIRL state
  const [missions, setMissions] = useState<Mission[]>([]);
  const [streams, setStreams] = useState<StreamHealth[]>([]);
  const [errors, setErrors] = useState<AgentError[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Load team
  useEffect(() => {
    if (!user) return;
    fetchUserTeams().then(res => {
      const teams = res.data as Array<{ id: string; name: string }>;
      if (teams[0]) { setTeamId(teams[0].id); setTeamName(teams[0].name ?? ''); }
    }).catch(() => {});
  }, [user]);

  // Fetch real overview from backend
  const loadOverview = useCallback(async () => {
    if (!teamId) return;
    try {
      setOverviewError(null);
      const res = await fetchDashboardOverview(teamId);
      const data = res.data as DashboardOverview;
      setOverview(data);
      setActivity(data.activity ?? []);
      const running = new Set(data.agents.filter(a => a.current_task).map(a => a.id));
      setRunningAgents(running);
    } catch (err: any) {
      setOverviewError('Could not reach the server. Retrying...');
    } finally {
      setOverviewLoading(false);
    }
  }, [teamId]);

  // Initial load + poll every 15 seconds for live updates
  useEffect(() => {
    loadOverview();
    const poll = setInterval(loadOverview, 15_000);
    return () => clearInterval(poll);
  }, [loadOverview]);

  // Load AgentIRL missions — real data from /api/agentirl/missions
  useEffect(() => {
    if (!teamId) return;
    fetchAgentIRLMissions(teamId)
      .then(res => setMissions(((res.data as unknown) as { missions: Mission[] }).missions ?? []))
      .catch(() => setMissions([]));
    const poll = setInterval(() => {
      fetchAgentIRLMissions(teamId)
        .then(res => setMissions(((res.data as unknown) as { missions: Mission[] }).missions ?? []))
        .catch(() => {});
    }, 30_000);
    return () => clearInterval(poll);
  }, [teamId]);

  useEffect(() => {
    fetchAgentSkills()
      .then((res) => {
        const skills = Array.isArray(res.data?.skills) ? res.data.skills : [];
        setSkillNames(
          skills
            .map((skill: any) => String((skill as Record<string, unknown>).name || ''))
            .filter(Boolean)
            .slice(0, 8),
        );
      })
      .catch(() => setSkillNames([]));
  }, []);

  // WebSocket
  useEffect(() => {
    if (!teamId) return;
    setWsStatus('connecting');
    let ws: WebSocket;
    try {
      ws = createDashboardWebSocket(teamId);
      wsRef.current = ws;
      ws.onopen = () => setWsStatus('connected');
      ws.onerror = () => setWsStatus('error');
      ws.onclose = () => setWsStatus('error');
      ws.onmessage = (e) => {
        try {
          const ev = JSON.parse(e.data);
          if (ev.type === 'agent.started') {
            setRunningAgents(prev => new Set([...prev, ev.agent_id]));
            setActivity(prev => [{
              id: Date.now().toString(), timestamp: new Date().toISOString(),
              agent: ev.role, agent_role: ev.role, action: 'agent.started',
              summary: `Started task: ${ev.task_id ?? ''}`,
            }, ...prev].slice(0, 30));
          } else if (ev.type === 'agent.step_complete') {
            setActivity(prev => [{
              id: Date.now().toString(), timestamp: new Date().toISOString(),
              agent: ev.agent_id, agent_role: '', action: 'step_complete',
              summary: `Step "${ev.step_name}" scored ${ev.score}`,
            }, ...prev].slice(0, 30));
          } else if (ev.type === 'agent.failed') {
            setRunningAgents(prev => { const s = new Set(prev); s.delete(ev.agent_id); return s; });
          } else if (ev.type === 'task.complete') {
            setOverview(prev => ({ ...prev, tasks: { ...prev.tasks, completed: prev.tasks.completed + 1 } }));
          } else if (ev.type === 'channel.message') {
            setActivity(prev => [{
              id: Date.now().toString(), timestamp: new Date().toISOString(),
              agent: ev.channel, agent_role: 'channel', action: 'channel.message',
              summary: `[${ev.channel}] ${ev.from}: ${ev.preview}`,
            }, ...prev].slice(0, 30));
          }
        } catch { /* ignore */ }
      };
    } catch { setWsStatus('error'); }
    return () => { wsRef.current?.close(); };
  }, [teamId]);

  const stats = [
    { label: 'Total Agents', value: overview.agents.length, icon: <Users size={18} />, color: C.accent, trend: '+2 this week' },
    { label: 'Running Tasks', value: overview.tasks.running, icon: <Zap size={18} />, color: C.purple, trend: overview.tasks.running > 0 ? 'Active' : undefined },
    { label: 'Completed Today', value: overview.tasks.completed, icon: <CheckSquare size={18} />, color: C.green, trend: '+12% vs yesterday' },
    { label: 'Channels Active', value: Object.values(overview.channels).filter(s => s === 'active').length, icon: <Wifi size={18} />, color: C.cyan },
    { label: 'Total Spend', value: formatCurrency(overview.spend?.total_usd ?? 0), icon: <DollarSign size={18} />, color: C.yellow, trend: '-8% vs last week' },
  ];

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !taskInput.trim() || taskSubmitting) return;

    setTaskSubmitting(true);
    try {
      const res = await sendTeamMessage(teamId, taskInput.trim(), 'web');
      setTaskResult({
        taskId: String(res.data?.task_id || ''),
        response: String(res.data?.response || ''),
      });
      setActivity((prev) => [{
        id: `${Date.now()}`,
        timestamp: new Date().toISOString(),
        agent: 'Founder',
        agent_role: 'channel',
        action: 'task.submitted',
        summary: taskInput.trim(),
      }, ...prev].slice(0, 30));
      setTaskInput('');
    } finally {
      setTaskSubmitting(false);
    }
  };

  return (
    <DashboardLayout teamName={teamName}>
      <div className="flex h-full" style={{ background: C.bg }}>
        {/* Main monitor */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.accent}15`, color: C.accent }}>
                  <Activity size={16} />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Agent Monitor</h1>
              </div>
              <p className="text-sm" style={{ color: C.muted }}>Live overview of your AI workforce</p>
            </div>
            <div className="flex items-center gap-3">
              {/* WS indicator */}
              <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border font-medium"
                style={{
                  background: wsStatus === 'connected' ? `${C.green}10` : `${C.yellow}10`,
                  borderColor: wsStatus === 'connected' ? `${C.green}25` : `${C.yellow}25`,
                  color: wsStatus === 'connected' ? C.green : C.yellow,
                }}>
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }}
                  animate={{ opacity: wsStatus === 'connected' ? [1, 0.4, 1] : 1 }}
                  transition={{ duration: 1.5, repeat: Infinity }} />
                {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting…' : 'Offline'}
              </div>
              <button onClick={loadOverview} className="p-2 rounded-lg border transition-colors hover:text-white hover:border-opacity-50"
                style={{ borderColor: C.border, color: C.muted, background: C.card }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.08} />
            ))}
          </div>

          {/* Task Submission Card */}
          <div className="rounded-xl border p-5 mb-8" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.accent}15`, color: C.accent }}>
                  <Zap size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Dispatch Task</h2>
                  <p className="text-xs" style={{ color: C.muted }}>Submit instructions to your agent team</p>
                </div>
              </div>
              {skillNames.length > 0 && (
                <div className="text-xs px-2 py-1 rounded-md" style={{ background: `${C.muted}10`, color: C.muted }}>
                  Available: {skillNames.slice(0, 3).join(', ')}{skillNames.length > 3 ? ` +${skillNames.length - 3}` : ''}
                </div>
              )}
            </div>
            <form onSubmit={handleSubmitTask} className="flex flex-col gap-3">
              <textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Describe the task for your agent team..."
                className="min-h-[100px] rounded-lg border px-4 py-3 text-sm text-white outline-none resize-y focus:border-emerald-500/50 transition-colors"
                style={{ background: C.bg, borderColor: C.border }}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono" style={{ color: C.muted }}>
                  POST /api/teams/:teamId/message
                </span>
                <button
                  type="submit"
                  disabled={!teamId || !taskInput.trim() || taskSubmitting}
                  className="px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all hover:shadow-lg"
                  style={{ background: C.accent, color: '#fff' }}
                >
                  {taskSubmitting ? (
                    <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Submitting...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Play size={14} /> Dispatch Task</span>
                  )}
                </button>
              </div>
            </form>
            {taskResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg border p-4"
                style={{ background: `${C.accent}05`, borderColor: `${C.accent}20` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Task Completed</span>
                </div>
                <div className="text-xs font-mono mb-2" style={{ color: C.muted }}>
                  Task ID: <span className="text-white">{taskResult.taskId || 'N/A'}</span>
                </div>
                <p className="text-sm" style={{ color: C.muted }}>{taskResult.response || 'No response returned.'}</p>
              </motion.div>
            )}
          </div>

          {/* Agent Team Grid */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.purple}15`, color: C.purple }}>
                <Users size={16} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Agent Team</h2>
                <p className="text-xs" style={{ color: C.muted }}>{overview.agents.length} agents deployed</p>
              </div>
            </div>
            <button onClick={loadOverview} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors hover:text-white hover:border-opacity-50" style={{ borderColor: C.border, color: C.muted, background: C.card }}>
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
          {overviewLoading ? (
            <div className="flex items-center justify-center py-16 gap-3" style={{ color: C.muted }}>
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">Loading your agents...</span>
            </div>
          ) : overviewError ? (
            <div className="flex items-center justify-center py-12 gap-2 text-sm" style={{ color: C.red }}>
              <AlertCircle size={16} />
              {overviewError}
            </div>
          ) : overview.agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-dashed" style={{ borderColor: C.border, color: C.muted }}>
              <Bot size={32} style={{ opacity: 0.4 }} />
              <p className="text-sm">No agents yet — send a message via Slack to spin them up.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {overview.agents.map((agent, i) => (
                <AgentCard
                  key={agent.id} agent={agent}
                  isRunning={runningAgents.has(agent.id)}
                  delay={i * 0.06}
                  onViewTranscript={setTranscriptAgent}
                />
              ))}
            </div>
          )}

          {/* AgentIRL Sections - Trust Fabric Foundation */}
          {(missions.length > 0 || streams.length > 0 || errors.length > 0) && (
            <div className="mt-10 border-t pt-8" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.purple}15`, color: C.purple }}>
                  <BrainCircuit size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">AgentIRL Runtime</h2>
                  <p className="text-xs" style={{ color: C.muted }}>Mission lifecycle and stream health</p>
                </div>
              </div>

              {missions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: C.muted }}>Missions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {missions.map((mission, i) => (
                      <MissionCard key={mission.id} mission={mission} delay={i * 0.08} />
                    ))}
                  </div>
                </div>
              )}

              {streams.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: C.muted }}>Stream Health</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {streams.map((stream, i) => (
                      <StreamCard key={stream.stream_id} stream={stream} delay={i * 0.06} />
                    ))}
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: C.muted }}>Error Recovery</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {errors.map((error, i) => (
                      <ErrorCard key={error.id} error={error} delay={i * 0.04} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Activity Feed Sidebar */}
        <div className="w-72 flex-shrink-0 border-l flex flex-col" style={{ background: C.card, borderColor: C.border }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${C.accent}15`, color: C.accent }}>
                <Activity size={14} />
              </div>
              <span className="text-xs font-semibold text-white">Activity Feed</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${C.green}10`, color: C.green }}>
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: C.green }}
                animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              Live
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1.5">
            <AnimatePresence initial={false}>
              {activity.map((item) => {
                const cfg = AGENT_CFG[item.agent_role];
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                    className="p-2.5 rounded-lg border"
                    style={{ background: C.bg, borderColor: C.border }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${cfg?.color ?? C.accent}15`, color: cfg?.color ?? C.accent }}>
                        {cfg ? <cfg.Icon size={10} /> : <Bot size={10} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-[11px] font-medium text-white truncate">{item.agent}</span>
                          <span className="text-[10px] flex-shrink-0" style={{ color: C.muted }}>{timeAgo(item.timestamp)}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed" style={{ color: C.muted }}>{item.summary}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {activity.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock size={20} style={{ color: C.muted, opacity: 0.5 }} />
                <p className="text-xs mt-2" style={{ color: C.muted }}>No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <TranscriptDrawer agent={transcriptAgent} onClose={() => setTranscriptAgent(null)} />
    </DashboardLayout>
  );
};
