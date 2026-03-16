import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import {
  Send, RotateCcw, ArrowRight, Loader2, CheckCircle2,
  Brain, Users, FileText, Headphones, Code2, ClipboardList, TestTube2,
  Terminal as TerminalIcon, Share2,
} from 'lucide-react';

// ── Constants ────────────────────────────────────────────────────────────────

const DEMO_API = 'https://api.viktron.ai/api/demo/ceo-plan';

// ── Types ────────────────────────────────────────────────────────────────────

type DeployState = 'idle' | 'deploying' | 'live' | 'done';
type AgentStatus = 'idle' | 'provisioning' | 'active' | 'done';
type TabId = 'terminal' | 'graph';

interface TerminalLine {
  id: string;
  ts: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'agent' | 'response';
  agentColor?: string;
}

interface AgentDef {
  id: string;
  name: string;
  shortName: string;
  role: string;
  color: string;
  hex: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  icon: React.ReactNode;
  cx: number;
  cy: number;
}

// ── Agent definitions ────────────────────────────────────────────────────────

const ALL_AGENTS: AgentDef[] = [
  {
    id: 'ceo',
    name: 'CEO Agent',
    shortName: 'CEO',
    role: 'Orchestrator',
    color: 'text-blue-400',
    hex: '#60a5fa',
    bgColor: 'bg-blue-950/60',
    borderColor: 'border-blue-700/50',
    dotColor: 'bg-blue-400',
    icon: <Brain className="h-4 w-4" />,
    cx: 50, cy: 50,
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    shortName: 'Sales',
    role: 'Lead Research',
    color: 'text-emerald-400',
    hex: '#34d399',
    bgColor: 'bg-emerald-950/60',
    borderColor: 'border-emerald-700/50',
    dotColor: 'bg-emerald-400',
    icon: <Users className="h-4 w-4" />,
    cx: 75, cy: 22,
  },
  {
    id: 'content',
    name: 'Content Agent',
    shortName: 'Content',
    role: 'Copywriter',
    color: 'text-violet-400',
    hex: '#a78bfa',
    bgColor: 'bg-violet-950/60',
    borderColor: 'border-violet-700/50',
    dotColor: 'bg-violet-400',
    icon: <FileText className="h-4 w-4" />,
    cx: 82, cy: 72,
  },
  {
    id: 'support',
    name: 'Support Agent',
    shortName: 'Support',
    role: 'Customer Success',
    color: 'text-amber-400',
    hex: '#fbbf24',
    bgColor: 'bg-amber-950/60',
    borderColor: 'border-amber-700/50',
    dotColor: 'bg-amber-400',
    icon: <Headphones className="h-4 w-4" />,
    cx: 50, cy: 85,
  },
  {
    id: 'pm',
    name: 'PM Agent',
    shortName: 'PM',
    role: 'Project Manager',
    color: 'text-cyan-400',
    hex: '#22d3ee',
    bgColor: 'bg-cyan-950/60',
    borderColor: 'border-cyan-700/50',
    dotColor: 'bg-cyan-400',
    icon: <ClipboardList className="h-4 w-4" />,
    cx: 18, cy: 72,
  },
  {
    id: 'developer',
    name: 'Developer Agent',
    shortName: 'Dev',
    role: 'Engineer',
    color: 'text-rose-400',
    hex: '#fb7185',
    bgColor: 'bg-rose-950/60',
    borderColor: 'border-rose-700/50',
    dotColor: 'bg-rose-400',
    icon: <Code2 className="h-4 w-4" />,
    cx: 25, cy: 22,
  },
  {
    id: 'qa',
    name: 'QA Agent',
    shortName: 'QA',
    role: 'Quality Assurance',
    color: 'text-orange-400',
    hex: '#fb923c',
    bgColor: 'bg-orange-950/60',
    borderColor: 'border-orange-700/50',
    dotColor: 'bg-orange-400',
    icon: <TestTube2 className="h-4 w-4" />,
    cx: 8, cy: 46,
  },
];

const OPTIONAL_AGENTS = ALL_AGENTS.filter(a => a.id !== 'ceo');
const CEO = ALL_AGENTS.find(a => a.id === 'ceo')!;

// ── Scripted messages ────────────────────────────────────────────────────────

const CEO_FALLBACK =
  "Understood. I'm delegating this immediately. Sales Agent will identify the top 10 target customers based on our ICP. Content Agent will draft a 3-email outreach sequence. I'll consolidate their outputs and have the full campaign ready within the hour.";

const SCRIPTED: Record<string, { delay: number; lines: string[] }> = {
  sales: {
    delay: 1400,
    lines: [
      'Scanning ICP database — filtering by industry, headcount, and AI spend signals...',
      'Cross-referencing LinkedIn, Crunchbase, and job board signals...',
      '10 high-fit targets identified with active buying signals.',
    ],
  },
  content: {
    delay: 1200,
    lines: [
      'Drafting 3-email outreach sequence...',
      'Email 1 — Awareness: subject line drafted, 2-sentence hook written.',
      "Email 2 — Value Prop: personalised to each target's pain point.",
      'Email 3 — Direct Ask: CEO-to-CEO tone, 15-minute call request. All 3 emails ready.',
    ],
  },
  support: {
    delay: 1000,
    lines: ['Configuring customer success playbooks...', 'Onboarding sequences and escalation paths set up.'],
  },
  pm: {
    delay: 1100,
    lines: ['Creating project board...', 'Sprint 1 tasks assigned, milestones set.'],
  },
  developer: {
    delay: 1300,
    lines: ['Cloning repo access...', 'Setting up CI/CD pipeline. First PR template ready.'],
  },
  qa: {
    delay: 900,
    lines: ['Initialising test harness...', 'Test coverage baseline recorded.'],
  },
};

const CEO_SUMMARY =
  'Campaign complete. All agents have reported back. Outputs reviewed — quality gate passed. Ready to deploy on your signal.';

// ── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function now(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

let _lineId = 0;
function mkLine(text: string, type: TerminalLine['type'], agentColor?: string): TerminalLine {
  return { id: String(++_lineId), ts: now(), text, type, agentColor };
}

// ── Constellation graph ──────────────────────────────────────────────────────

interface ConstellationProps {
  agents: AgentDef[];
  statuses: Record<string, AgentStatus>;
}

// Trim line endpoints so they stop at circle edges (avoids Pac-Man look)
function trimLine(ax: number, ay: number, ar: number, bx: number, by: number, br: number) {
  const dx = bx - ax, dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x1: ax + (dx / len) * (ar + 1.5),
    y1: ay + (dy / len) * (ar + 1.5),
    x2: bx - (dx / len) * (br + 1.5),
    y2: by - (dy / len) * (br + 1.5),
  };
}

const Constellation: React.FC<ConstellationProps> = ({ agents, statuses }) => {
  return (
    // viewBox padding so labels near edges aren't clipped
    <svg viewBox="-12 -12 124 124" className="w-full h-full">
      <defs>
        {agents.map(a => (
          <radialGradient key={a.id} id={`gd-${a.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={a.hex} stopOpacity="0.45" />
            <stop offset="100%" stopColor={a.hex} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Connections — drawn before nodes so nodes sit on top */}
      {agents.filter(a => a.id !== 'ceo').map(a => {
        const active = statuses[a.id] === 'active' || statuses[a.id] === 'provisioning';
        const done   = statuses[a.id] === 'done';
        const pt = trimLine(CEO.cx, CEO.cy, 7, a.cx, a.cy, 5);
        const pathD = `M ${pt.x1},${pt.y1} L ${pt.x2},${pt.y2}`;

        return (
          <g key={`conn-${a.id}`}>
            {/* Static base line */}
            <line
              x1={pt.x1} y1={pt.y1} x2={pt.x2} y2={pt.y2}
              stroke={active || done ? a.hex : '#1e293b'}
              strokeWidth={active ? 0.7 : done ? 0.5 : 0.3}
              strokeOpacity={active ? 1 : done ? 0.55 : 0.35}
            />
            {/* Signal particle travelling from CEO → agent */}
            {active && (
              <circle r="1.4" fill={a.hex} opacity="0.95">
                <animateMotion dur="0.75s" repeatCount="indefinite" path={pathD} />
              </circle>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {agents.map(a => {
        const status = statuses[a.id] ?? 'idle';
        const active = status === 'active' || status === 'provisioning';
        const done   = status === 'done';
        const r = a.id === 'ceo' ? 7 : 5;

        return (
          <g key={a.id}>
            {/* Glow halo */}
            {(active || done) && (
              <circle cx={a.cx} cy={a.cy} r={r * 2.8}
                fill={`url(#gd-${a.id})`} opacity={active ? 1 : 0.45}
              />
            )}
            {/* Pulse ring */}
            {active && (
              <circle cx={a.cx} cy={a.cy} r={r + 1} fill="none"
                stroke={a.hex} strokeWidth="0.6" opacity="0.7">
                <animate attributeName="r"
                  values={`${r + 1};${r + 4};${r + 1}`} dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity"
                  values="0.7;0;0.7" dur="1.4s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Circle body */}
            <circle
              cx={a.cx} cy={a.cy} r={r}
              fill={active || done ? a.hex : '#0f172a'}
              fillOpacity={active ? 0.22 : done ? 0.28 : 1}
              stroke={a.hex}
              strokeWidth={active ? 1.4 : done ? 1 : 0.5}
              strokeOpacity={active || done ? 1 : 0.3}
            />
            {/* Done indicator — small solid dot in centre */}
            {done && <circle cx={a.cx} cy={a.cy} r={1.8} fill={a.hex} />}
            {/* Label below node */}
            <text
              x={a.cx} y={a.cy + r + 5.5}
              textAnchor="middle"
              fontSize={a.id === 'ceo' ? 5.5 : 4.5}
              fill={active || done ? a.hex : '#475569'}
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontWeight={active ? 'bold' : 'normal'}
            >
              {a.shortName}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Status pill ───────────────────────────────────────────────────────────────

const StatusPill: React.FC<{ status: AgentStatus; dotColor: string }> = ({ status, dotColor }) => {
  if (status === 'idle') return <span className="w-2 h-2 rounded-full bg-slate-700 flex-shrink-0" />;
  if (status === 'done') return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />;
  return (
    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-60`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`} />
    </span>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const InvestorDemo: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(new Set(['sales', 'content']));

  const [deployState, setDeployState] = useState<DeployState>('idle');
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [activeTab, setActiveTab] = useState<TabId>('terminal');

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const termScrollRef = useRef<HTMLDivElement>(null);

  const activeAgents = [CEO, ...OPTIONAL_AGENTS.filter(a => selectedAgentIds.has(a.id))];

  useEffect(() => {
    const el = termScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const setStatus = useCallback((id: string, s: AgentStatus) =>
    setAgentStatuses(prev => ({ ...prev, [id]: s })), []);

  const addLine = useCallback((text: string, type: TerminalLine['type'], agentColor?: string) =>
    setLines(prev => [...prev, mkLine(text, type, agentColor)]), []);

  const toggleAgent = (id: string) => {
    setSelectedAgentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const canDeploy = companyName.trim().length > 0 && deployState === 'idle';

  const deploy = async () => {
    if (!canDeploy) return;
    setDeployState('deploying');
    setLines([]);
    setAgentStatuses({});
    setActiveTab('terminal');

    const company = companyName.trim();
    const ind = industry.trim() || 'General';
    const agentList = activeAgents.map(a => a.name).join(', ');

    addLine(`Connecting to Viktron API...`, 'info');
    await sleep(400);
    addLine(`Provisioning team for ${company} (${ind})`, 'info');
    await sleep(500);
    addLine(`Spinning up agents: ${agentList}`, 'info');
    await sleep(600);

    activeAgents.forEach(a => setStatus(a.id, 'provisioning'));
    await sleep(700);

    addLine(`Team online. Sending instruction to CEO Agent...`, 'success');
    setStatus('ceo', 'active');
    await sleep(500);

    let ceoPlan = '';
    try {
      const res = await fetch(DEMO_API, { method: 'POST' });
      const data = await res.json();
      ceoPlan = data.plan ?? CEO_FALLBACK;
    } catch {
      ceoPlan = CEO_FALLBACK;
    }

    addLine(`CEO Agent → ${ceoPlan}`, 'response', CEO.hex);
    setStatus('ceo', 'done');
    setDeployState('live');
    await sleep(900);

    const subAgents = activeAgents.filter(a => a.id !== 'ceo');
    for (const agent of subAgents) {
      setStatus(agent.id, 'active');
      const script = SCRIPTED[agent.id];
      if (script) {
        for (const line of script.lines) {
          await sleep(script.delay);
          // Personalise scripted lines with company name where relevant
          const personalised = line.replace(/\[company\]/gi, company);
          addLine(`${agent.name} → ${personalised}`, 'agent', agent.hex);
        }
      }
      setStatus(agent.id, 'done');
      await sleep(400);
    }

    setStatus('ceo', 'active');
    await sleep(600);
    addLine(`CEO Agent → ${CEO_SUMMARY}`, 'response', CEO.hex);
    setStatus('ceo', 'done');
    await sleep(300);

    // Slack notification
    await sleep(400);
    addLine(`Slack #${company.toLowerCase().replace(/\s+/g, '-')}-agents  ✓  Team deployed. First deliverables from ${subAgents.length} agent${subAgents.length !== 1 ? 's' : ''} ready for review.`, 'success');

    await sleep(200);
    addLine(`✓ All agents reported back. Team is live.`, 'success');
    setDeployState('done');
  };

  const reset = () => {
    setDeployState('idle');
    setLines([]);
    setAgentStatuses({});
    setCompanyName('');
    setIndustry('');
    setMessage('');
    setSelectedAgentIds(new Set(['sales', 'content']));
  };

  return (
    <Layout>
      {/* Hero — pt-16 offsets the fixed 64px navbar */}
      <div className="bg-white border-b border-slate-100 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Live Anthropic AI — CEO Agent powered by Claude
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Deploy your AI team{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              in seconds
            </span>
          </h1>
          <p className="mt-3 text-slate-500 text-base max-w-lg mx-auto">
            Fill in your company details, pick your agents, and watch them coordinate in real time.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left: Form panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Company form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Your Company</span>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-600">Company name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  disabled={deployState !== 'idle'}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-600">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  placeholder="SaaS, Fintech, Healthcare…"
                  disabled={deployState !== 'idle'}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-600">Goal / instruction</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="e.g. Launch our AI consulting service — identify 10 target customers and draft outreach."
                  disabled={deployState !== 'idle'}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Agent selector */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Select Agents</span>
                <span className="text-xs text-slate-400">{selectedAgentIds.size + 1} selected</span>
              </div>

              {/* CEO always on */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-200 mb-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-600">
                  <Brain className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800">CEO Agent</div>
                  <div className="text-xs text-slate-400">Orchestrator · Always included</div>
                </div>
                <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
              </div>

              <div className="flex flex-col gap-1.5">
                {OPTIONAL_AGENTS.map(agent => {
                  const on = selectedAgentIds.has(agent.id);
                  return (
                    <button
                      key={agent.id}
                      onClick={() => deployState === 'idle' && toggleAgent(agent.id)}
                      disabled={deployState !== 'idle'}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 disabled:cursor-not-allowed ${
                        on ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${agent.bgColor} ${agent.color}`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800">{agent.name}</div>
                        <div className="text-xs text-slate-400">{agent.role}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                        on ? 'border-slate-400 bg-slate-600' : 'border-slate-300 bg-white'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deploy button */}
            <div>
              {deployState === 'idle' && (
                <motion.button
                  onClick={deploy}
                  disabled={!canDeploy}
                  whileHover={canDeploy ? { scale: 1.02 } : {}}
                  whileTap={canDeploy ? { scale: 0.98 } : {}}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    canDeploy
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  Deploy Agent Team
                </motion.button>
              )}
              {(deployState === 'deploying' || deployState === 'live') && (
                <div className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-slate-300 font-semibold text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  Agents deploying…
                </div>
              )}
              {deployState === 'done' && (
                <motion.button
                  onClick={reset}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset demo
                </motion.button>
              )}
            </div>
          </div>

          {/* Right: Terminal + Graph */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Tab header */}
            <div className="flex items-center gap-1 mb-3">
              <button
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'terminal'
                    ? 'bg-slate-900 text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <TerminalIcon className="h-3.5 w-3.5" />
                Terminal
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'graph'
                    ? 'bg-slate-900 text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                Agent Graph
              </button>
              {(deployState === 'deploying' || deployState === 'live') && (
                <span className="ml-auto text-xs text-emerald-500 font-medium animate-pulse">● Live</span>
              )}
              {deployState === 'done' && (
                <span className="ml-auto text-xs text-emerald-500 font-medium">● Complete</span>
              )}
            </div>

            {/* Panel — fixed height so it never grows the page */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col h-[calc(100vh-280px)] min-h-[480px]">

              {/* Terminal tab */}
              {activeTab === 'terminal' && (
                <div ref={termScrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
                  {lines.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-2 opacity-30">
                      <TerminalIcon className="h-8 w-8 text-slate-500" />
                      <p className="text-slate-500">Fill in your details and click Deploy</p>
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {lines.map(line => (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex gap-2 mb-1"
                      >
                        <span className="text-slate-600 flex-shrink-0 select-none">{line.ts}</span>
                        <span
                          className={
                            line.type === 'success' ? 'text-emerald-400' :
                            line.type === 'warn'    ? 'text-amber-400' :
                            line.type === 'info'    ? 'text-slate-400' :
                            'text-slate-200'
                          }
                          style={line.agentColor ? { color: line.agentColor } : undefined}
                        >
                          {line.text}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Graph tab */}
              {activeTab === 'graph' && (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 p-6">
                    <Constellation agents={activeAgents} statuses={agentStatuses} />
                  </div>
                  <div className="border-t border-slate-800 px-4 py-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    {activeAgents.map(agent => {
                      const status = agentStatuses[agent.id] ?? 'idle';
                      return (
                        <div key={agent.id} className="flex items-center gap-1.5">
                          <StatusPill status={status} dotColor={agent.dotColor} />
                          <span className={`text-xs font-medium ${status === 'idle' ? 'text-slate-600' : agent.color}`}>
                            {agent.shortName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Done CTA */}
        <AnimatePresence>
          {deployState === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/20"
            >
              <div>
                <p className="font-bold text-lg">Ready to deploy your real agent team?</p>
                <p className="text-blue-100 text-sm mt-0.5">
                  Get your actual {companyName || 'company'} team running in 24 hours.
                </p>
              </div>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-xl text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default InvestorDemo;
