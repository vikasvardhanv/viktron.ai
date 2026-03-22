import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckSquare, MessageSquare, Wifi, Crown, Briefcase,
  Code2, TrendingUp, Headphones, PenTool, Clock, Zap, AlertCircle,
  Activity, Bot, RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  fetchUserTeams, fetchDashboardOverview, createDashboardWebSocket, sendTeamMessage, fetchAgentSkills,
  type AgentOverview, type DashboardOverview,
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

// ── Mock data for when API isn't available ────────────────────────────────────
const MOCK_OVERVIEW: DashboardOverview = {
  agents: [
    { id:'1', role:'ceo', display_name:'CEO Agent', status:'active', current_task:null, current_task_id:null, memory_kb:14, metrics:{} },
    { id:'2', role:'pm', display_name:'PM Agent', status:'active', current_task:'Drafting Q2 roadmap', current_task_id:'t2', memory_kb:8, metrics:{} },
    { id:'3', role:'developer', display_name:'Developer Agent', status:'active', current_task:null, current_task_id:null, memory_kb:22, metrics:{} },
    { id:'4', role:'qa', display_name:'QA Agent', status:'active', current_task:null, current_task_id:null, memory_kb:5, metrics:{} },
    { id:'5', role:'sales', display_name:'Sales Agent', status:'active', current_task:'Processing new lead', current_task_id:'t5', memory_kb:11, metrics:{} },
    { id:'6', role:'support', display_name:'Support Agent', status:'active', current_task:null, current_task_id:null, memory_kb:19, metrics:{} },
    { id:'7', role:'content', display_name:'Content Agent', status:'active', current_task:null, current_task_id:null, memory_kb:7, metrics:{} },
  ],
  tasks: { pending: 3, running: 2, completed: 47, failed: 1 },
  channels: { whatsapp: 'active', slack: 'not_configured', teams: 'active' },
  activity: [
    { id:'a1', timestamp: new Date().toISOString(), agent:'Sales Agent', agent_role:'sales', action:'lead_received', summary:'New lead from WhatsApp: "Interested in your pricing"' },
    { id:'a2', timestamp: new Date(Date.now()-60000).toISOString(), agent:'CEO Agent', agent_role:'ceo', action:'task_assigned', summary:'Delegated lead qualification to Sales agent' },
    { id:'a3', timestamp: new Date(Date.now()-180000).toISOString(), agent:'Content Agent', agent_role:'content', summary:'Generated 5 Instagram post drafts for review', action:'content_created' },
    { id:'a4', timestamp: new Date(Date.now()-300000).toISOString(), agent:'PM Agent', agent_role:'pm', action:'report_generated', summary:'Weekly progress report compiled and sent' },
  ],
};

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

interface AgentCardProps { agent: AgentOverview; isRunning: boolean; delay?: number; }
const AgentCard: React.FC<AgentCardProps> = ({ agent, isRunning, delay = 0 }) => {
  const cfg = AGENT_CFG[agent.role] ?? { color: C.accent, Icon: Bot, label: agent.role };
  const { Icon } = cfg;

  const statusColor = agent.status === 'active' && isRunning ? C.accent
    : agent.status === 'error' ? C.red : C.green;
  const statusLabel = agent.status === 'error' ? 'Failed'
    : isRunning ? 'Running' : 'Idle';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl p-5 border relative overflow-hidden group"
      style={{ background: C.card, borderColor: isRunning ? `${cfg.color}40` : C.border }}
    >
      {/* Pulse ring for running agents */}
      {isRunning && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ border: `1px solid ${cfg.color}` }}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${cfg.color}18`, color: cfg.color }}>
          <Icon size={18} />
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium"
          style={{ background: `${statusColor}12`, borderColor: `${statusColor}30`, color: statusColor }}>
          {isRunning && (
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          )}
          {statusLabel}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-white">{cfg.label} Agent</h3>
        <p className="text-xs mt-1 truncate" style={{ color: C.muted }}>
          {agent.current_task ?? 'Idle — awaiting tasks'}
        </p>
      </div>

      {/* Memory bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: C.muted }}>
          <span>Memory</span><span>{agent.memory_kb} entries</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: cfg.color, opacity: 0.7 }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (agent.memory_kb / 30) * 100)}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

function timeAgo(ts: string) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  return `${Math.round(diff / 3600)}h ago`;
}

// ── Main page ─────────────────────────────────────────────────────────────────
export const AgentMonitor: React.FC = () => {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [overview, setOverview] = useState<DashboardOverview>(MOCK_OVERVIEW);
  const [activity, setActivity] = useState(MOCK_OVERVIEW.activity);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set(['2', '5']));
  const [taskInput, setTaskInput] = useState('');
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskResult, setTaskResult] = useState<{ taskId: string; response: string } | null>(null);
  const [skillNames, setSkillNames] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Load team
  useEffect(() => {
    if (!user) return;
    fetchUserTeams().then(res => {
      const teams = res.data as Array<{ id: string; name: string }>;
      if (teams[0]) { setTeamId(teams[0].id); setTeamName(teams[0].name ?? ''); }
    }).catch(() => {});
  }, [user]);

  // Fetch overview
  const loadOverview = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetchDashboardOverview(teamId);
      const data = res.data as DashboardOverview;
      setOverview(data);
      setActivity(data.activity);
      const running = new Set(data.agents.filter(a => a.current_task).map(a => a.id));
      setRunningAgents(running);
    } catch { /* use mock */ }
  }, [teamId]);

  useEffect(() => { loadOverview(); }, [loadOverview]);

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
          <h2 className="text-sm font-medium text-white mb-3">Agent Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {overview.agents.map((agent, i) => (
              <AgentCard
                key={agent.id} agent={agent}
                isRunning={runningAgents.has(agent.id)}
                delay={i * 0.06}
              />
            ))}
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
  );
};
