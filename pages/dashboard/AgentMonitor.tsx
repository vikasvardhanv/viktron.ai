import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckSquare, Wifi, Crown, Briefcase,
  Code2, TrendingUp, Headphones, PenTool, Zap, AlertCircle,
  Activity, Bot, RefreshCw, BrainCircuit, DollarSign,
  Heart, Clock, ChevronRight, X, Terminal, Loader2,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  fetchUserTeams, fetchDashboardOverview, createDashboardWebSocket, sendTeamMessage, fetchAgentSkills,
  fetchAgentTranscript,
  type AgentOverview, type DashboardOverview, type AgentTranscript, type TranscriptTask,
} from '../../services/dashboardApi';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#09090f', card: '#111118', border: '#1e1e2e',
  accent: '#0ea5e9', purple: '#a855f7', pink: '#ec4899',
  cyan: '#06b6d4', green: '#22c55e', red: '#ef4444',
  yellow: '#f59e0b', orange: '#f97316', muted: '#6b7280',
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

const MOCK_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Q4 Sales Pipeline Optimization',
    status: 'executing',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 600000).toISOString(),
    assigned_agent_role: 'sales',
    executive_summary: 'Analyzing sales data and optimizing lead scoring algorithm'
  },
  {
    id: 'm2',
    title: 'Content Calendar Planning',
    status: 'pending_approval',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    assigned_agent_role: 'content',
    executive_summary: 'Drafting social media content strategy for next quarter'
  },
  {
    id: 'm3',
    title: 'API Integration Testing',
    status: 'complete',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    assigned_agent_role: 'developer',
    executive_summary: 'Successfully integrated Stripe payment processing'
  }
];

const MOCK_STREAMS: StreamHealth[] = [
  {
    stream_id: 's1',
    mission_id: 'm1',
    last_heartbeat: new Date().toISOString(),
    sequence_number: 15,
    total_chunks: 15,
    total_errors: 0,
    status: 'healthy',
    meta: { source: 'sales_agent', agent_role: 'sales' }
  },
  {
    stream_id: 's2',
    mission_id: 'm2',
    last_heartbeat: new Date(Date.now() - 45000).toISOString(),
    sequence_number: 8,
    total_chunks: 8,
    total_errors: 1,
    status: 'degraded',
    meta: { source: 'content_agent', agent_role: 'content' }
  }
];

const MOCK_ERRORS: AgentError[] = [
  {
    id: 'e1',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    mission_id: 'm2',
    stream_id: 's2',
    category: 'provider',
    message: 'OpenAI API rate limit exceeded',
    recovery: 'retry',
    resolved: false
  },
  {
    id: 'e2',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    mission_id: 'm1',
    category: 'validation',
    message: 'Invalid email format in lead data',
    recovery: 'fallback',
    resolved: true
  }
];

// ── Sub-components ────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string; value: number | string; icon: React.ReactNode;
  color: string; delay?: number;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    className="rounded-xl p-5 border relative overflow-hidden"
    style={{ background: C.card, borderColor: C.border }}
  >
    <div className="absolute inset-0 opacity-5 rounded-xl"
      style={{ background: `radial-gradient(circle at top left, ${color}, transparent 60%)` }} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: C.muted }}>{label}</p>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, color }}>
        {icon}
      </div>
    </div>
    <div className="mt-3 h-0.5 w-12 rounded-full" style={{ background: color, opacity: 0.5 }} />
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

interface AgentCardProps { agent: AgentOverview; isRunning: boolean; delay?: number; onViewTranscript: (agent: AgentOverview) => void; }
const AgentCard: React.FC<AgentCardProps> = ({ agent, isRunning, delay = 0, onViewTranscript }) => {
  const cfg = AGENT_CFG[agent.role] ?? { color: C.accent, Icon: Bot, label: agent.role };
  const { Icon } = cfg;

  const statusColor = agent.status === 'error' ? C.red : isRunning ? C.accent : C.green;
  const statusLabel = agent.status === 'error' ? 'Error' : isRunning ? 'Running' : 'Idle';

  const budgetPct = agent.monthly_budget > 0
    ? Math.min(100, (agent.current_spend / agent.monthly_budget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl p-5 border relative overflow-hidden cursor-pointer group"
      style={{ background: C.card, borderColor: isRunning ? `${cfg.color}40` : C.border }}
      onClick={() => onViewTranscript(agent)}
    >
      {isRunning && (
        <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ border: `1px solid ${cfg.color}` }} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${cfg.color}18`, color: cfg.color }}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium"
          style={{ background: `${statusColor}12`, borderColor: `${statusColor}30`, color: statusColor }}>
          {isRunning && <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />}
          {statusLabel}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-semibold text-white">{agent.display_name}</h3>
        <p className="text-xs mt-0.5 truncate" style={{ color: C.muted }}>
          {agent.current_task ?? 'Idle — awaiting tasks'}
        </p>
      </div>

      {/* Stats row */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {/* Memory */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs" style={{ color: C.muted }}>Memory</span>
          <span className="text-xs font-medium text-white">{agent.memory_kb}</span>
        </div>
        {/* Age */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs flex items-center gap-1" style={{ color: C.muted }}><Clock size={10} />Age</span>
          <span className="text-xs font-medium text-white">{ageSince(agent.created_at)}</span>
        </div>
        {/* Heartbeat */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs flex items-center gap-1" style={{ color: C.muted }}><Heart size={10} />Beat</span>
          <span className="text-xs font-medium" style={{ color: agent.last_heartbeat ? C.green : C.muted }}>
            {agent.last_heartbeat ? timeAgo(agent.last_heartbeat) : '—'}
          </span>
        </div>
      </div>

      {/* Cost bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: C.muted }}>
          <span className="flex items-center gap-1"><DollarSign size={10} />Spend</span>
          <span style={{ color: agent.current_spend > 0 ? C.yellow : C.muted }}>
            ${agent.current_spend.toFixed(4)}
            {agent.monthly_budget > 0 && ` / $${agent.monthly_budget.toFixed(2)}`}
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: budgetPct > 80 ? C.red : C.yellow, opacity: 0.8 }}
            initial={{ width: 0 }}
            animate={{ width: `${budgetPct || (agent.current_spend > 0 ? 5 : 0)}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
          />
        </div>
      </div>

      {/* Transcript hint */}
      <div className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs flex items-center gap-1" style={{ color: C.muted }}>
          <Terminal size={10} />{agent.total_tokens.toLocaleString()} tokens
        </span>
        <span className="text-xs flex items-center gap-1" style={{ color: cfg.color }}>
          View transcript <ChevronRight size={10} />
        </span>
      </div>
    </motion.div>
  );
};

// ── Transcript Drawer ─────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  completed: '#22c55e', running: '#0ea5e9', failed: '#ef4444',
  pending: '#f59e0b', needs_approval: '#a855f7',
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Drawer */}
        <motion.div className="relative w-full max-w-xl h-full flex flex-col overflow-hidden shadow-2xl"
          style={{ background: C.bg, borderLeft: `1px solid ${C.border}` }}
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${cfg.color}18`, color: cfg.color }}>
                <cfg.Icon size={16} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">{agent.display_name} — Transcript</h2>
                <p className="text-xs" style={{ color: C.muted }}>
                  {agent.total_tokens.toLocaleString()} tokens · ${agent.current_spend.toFixed(4)} spent · age {ageSince(agent.created_at)}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: C.muted }}>
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-16 gap-2" style={{ color: C.muted }}>
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Loading transcript...</span>
              </div>
            )}
            {!loading && (!transcript || transcript.tasks.length === 0) && (
              <div className="flex flex-col items-center justify-center py-16 gap-2" style={{ color: C.muted }}>
                <Terminal size={28} style={{ opacity: 0.3 }} />
                <p className="text-sm">No tasks yet for this agent.</p>
              </div>
            )}
            {!loading && transcript?.tasks.map((task) => (
              <div key={task.id} className="rounded-xl border overflow-hidden"
                style={{ borderColor: C.border, background: C.card }}>
                {/* Task header */}
                <button className="w-full flex items-start justify-between p-4 text-left hover:bg-white/3 transition-colors"
                  onClick={() => setExpanded(expanded === task.id ? null : task.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${STATUS_COLORS[task.status] || C.muted}18`, color: STATUS_COLORS[task.status] || C.muted }}>
                        {task.status}
                      </span>
                      <span className="text-xs" style={{ color: C.muted }}>{timeAgo(task.created_at)}</span>
                      {task.duration_ms && <span className="text-xs" style={{ color: C.muted }}>{task.duration_ms}ms</span>}
                    </div>
                    <p className="text-sm text-white truncate">{task.description || task.type}</p>
                  </div>
                  <ChevronRight size={14} className={`flex-shrink-0 mt-1 transition-transform ${expanded === task.id ? 'rotate-90' : ''}`} style={{ color: C.muted }} />
                </button>

                {/* Expanded details */}
                {expanded === task.id && (
                  <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: C.border }}>
                    {/* Input */}
                    {task.input && Object.keys(task.input).length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>Input</p>
                        <pre className="text-xs rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8' }}>
                          {JSON.stringify(task.input, null, 2)}
                        </pre>
                      </div>
                    )}
                    {/* Output */}
                    {task.output && (
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>Output</p>
                        <pre className="text-xs rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8' }}>
                          {JSON.stringify(task.output, null, 2)}
                        </pre>
                      </div>
                    )}
                    {/* Error */}
                    {task.error && (
                      <div className="rounded-lg p-3" style={{ background: `${C.red}12`, border: `1px solid ${C.red}30` }}>
                        <p className="text-xs font-medium mb-1" style={{ color: C.red }}>Error</p>
                        <p className="text-xs" style={{ color: C.red }}>{task.error}</p>
                      </div>
                    )}
                    {/* Steps / traces */}
                    {task.steps.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2" style={{ color: C.muted }}>Execution steps ({task.steps.length})</p>
                        <div className="space-y-1.5">
                          {task.steps.map((step, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2"
                              style={{ background: 'rgba(255,255,255,0.04)' }}>
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                                  style={{ background: 'rgba(255,255,255,0.08)', color: C.accent }}>
                                  {step.action_type}
                                </span>
                                {step.summary && <span className="text-xs truncate" style={{ color: C.muted }}>{step.summary}</span>}
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0 ml-2 text-xs" style={{ color: C.muted }}>
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
              </div>
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

  useEffect(() => {
    fetchAgentSkills()
      .then((res) => {
        const skills = Array.isArray(res.data?.skills) ? res.data.skills : [];
        setSkillNames(
          skills
            .map((skill) => String((skill as Record<string, unknown>).name || ''))
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
    { label: 'Total Agents', value: overview.agents.length, icon: <Users size={20} />, color: C.accent },
    { label: 'Running Tasks', value: overview.tasks.running, icon: <Zap size={20} />, color: C.purple },
    { label: 'Completed Today', value: overview.tasks.completed, icon: <CheckSquare size={20} />, color: C.green },
    { label: 'Channels Active', value: Object.values(overview.channels).filter(s => s === 'active').length, icon: <Wifi size={20} />, color: C.cyan },
    { label: 'Total Spend', value: `$${(overview.spend?.total_usd ?? 0).toFixed(4)}`, icon: <DollarSign size={20} />, color: C.yellow },
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-white">Agent Monitor</h1>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>Live overview of your AI workforce</p>
            </div>
            <div className="flex items-center gap-3">
              {/* WS indicator */}
              <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border"
                style={{
                  background: wsStatus === 'connected' ? `${C.green}10` : `${C.yellow}10`,
                  borderColor: wsStatus === 'connected' ? `${C.green}30` : `${C.yellow}30`,
                  color: wsStatus === 'connected' ? C.green : C.yellow,
                }}>
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }}
                  animate={{ opacity: wsStatus === 'connected' ? [1, 0.4, 1] : 1 }}
                  transition={{ duration: 2, repeat: Infinity }} />
                {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting…' : 'Offline'}
              </div>
              <button onClick={loadOverview} className="p-2 rounded-lg border transition-colors hover:text-white"
                style={{ borderColor: C.border, color: C.muted, background: C.card }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.08} />
            ))}
          </div>

          <div className="rounded-xl border p-5 mb-6" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-sm font-medium text-white">Run A Backend Task</h2>
                <p className="text-xs mt-1" style={{ color: C.muted }}>
                  Submit a founder instruction through the frontend and capture the backend `task_id` plus response.
                </p>
              </div>
              {skillNames.length > 0 && (
                <div className="text-xs text-right" style={{ color: C.muted }}>
                  Skills: {skillNames.join(', ')}
                </div>
              )}
            </div>
            <form onSubmit={handleSubmitTask} className="flex flex-col gap-3">
              <textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Example: Research the top 5 AI coding assistants and summarize pricing, strengths, and risks."
                className="min-h-[110px] rounded-lg border px-4 py-3 text-sm text-white outline-none resize-y"
                style={{ background: C.bg, borderColor: C.border }}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs" style={{ color: C.muted }}>
                  Route: `/api/teams/:teamId/message`
                </span>
                <button
                  type="submit"
                  disabled={!teamId || !taskInput.trim() || taskSubmitting}
                  className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ background: C.accent, color: '#fff' }}
                >
                  {taskSubmitting ? 'Submitting…' : 'Run Task'}
                </button>
              </div>
            </form>
            {taskResult && (
              <div className="mt-4 rounded-lg border p-4" style={{ background: C.bg, borderColor: C.border }}>
                <div className="text-xs mb-2" style={{ color: C.muted }}>Latest backend result</div>
                <div className="text-xs mb-2 text-white">Task ID: {taskResult.taskId || 'missing'}</div>
                <p className="text-sm whitespace-pre-wrap" style={{ color: '#d1d5db' }}>{taskResult.response || 'No response returned.'}</p>
              </div>
            )}
          </div>

          {/* Agent grid */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white">Agent Team</h2>
            <button onClick={loadOverview} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-white/5 transition-colors" style={{ color: C.muted }}>
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

          {/* AgentIRL Mission Lifecycle */}
          {missions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <BrainCircuit size={16} style={{ color: C.purple }} />
                AgentIRL Missions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missions.map((mission, i) => (
                  <MissionCard key={mission.id} mission={mission} delay={i * 0.08} />
                ))}
              </div>
            </div>
          )}

          {/* AgentIRL Stream Health */}
          {streams.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Activity size={16} style={{ color: C.cyan }} />
                Stream Health
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {streams.map((stream, i) => (
                  <StreamCard key={stream.stream_id} stream={stream} delay={i * 0.06} />
                ))}
              </div>
            </div>
          )}

          {/* AgentIRL Error Recovery */}
          <div className="mt-8">
            <h2 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <AlertCircle size={16} style={{ color: C.red }} />
              Error Recovery
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {errors.map((error, i) => (
                <ErrorCard key={error.id} error={error} delay={i * 0.04} />
              ))}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="w-80 flex-shrink-0 border-l flex flex-col" style={{ background: C.card, borderColor: C.border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <Activity size={15} style={{ color: C.accent }} />
              <span className="text-sm font-medium text-white">Activity Feed</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${C.accent}15`, color: C.accent }}>
              Live
            </span>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            <AnimatePresence initial={false}>
              {activity.map((item) => {
                const cfg = AGENT_CFG[item.agent_role];
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className="p-3 rounded-lg border"
                    style={{ background: C.bg, borderColor: C.border }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${cfg?.color ?? C.accent}18`, color: cfg?.color ?? C.accent }}>
                        {cfg ? <cfg.Icon size={12} /> : <Bot size={12} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-medium text-white truncate">{item.agent}</span>
                          <span className="text-xs flex-shrink-0" style={{ color: C.muted }}>{timeAgo(item.timestamp)}</span>
                        </div>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: C.muted }}>{item.summary}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {activity.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock size={24} style={{ color: C.muted }} />
                <p className="text-sm mt-3" style={{ color: C.muted }}>No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
    <TranscriptDrawer agent={transcriptAgent} onClose={() => setTranscriptAgent(null)} />
  );
};
