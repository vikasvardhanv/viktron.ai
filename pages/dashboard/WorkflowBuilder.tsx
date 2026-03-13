import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Briefcase, Code2, CheckSquare, TrendingUp, Headphones, PenTool,
  MessageSquare, Clock, Webhook, Zap, Save, FolderOpen, Play, Trash2,
  X, ChevronRight, Plus, Loader2,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { fetchUserTeams, fetchWorkflows, createWorkflow, updateWorkflow, type WorkflowDef } from '../../services/dashboardApi';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#09090f', card: '#111118', border: '#1e1e2e',
  accent: '#0ea5e9', purple: '#a855f7', pink: '#ec4899',
  cyan: '#06b6d4', green: '#22c55e', red: '#ef4444',
  yellow: '#f59e0b', orange: '#f97316', muted: '#6b7280',
};

// ── Palette config ────────────────────────────────────────────────────────────
const AGENT_NODES = [
  { type: 'ceo',       label: 'CEO Agent',       Icon: Crown,        color: C.purple },
  { type: 'pm',        label: 'PM Agent',         Icon: Briefcase,    color: C.accent },
  { type: 'developer', label: 'Developer Agent',  Icon: Code2,        color: C.cyan },
  { type: 'qa',        label: 'QA Agent',         Icon: CheckSquare,  color: C.yellow },
  { type: 'sales',     label: 'Sales Agent',      Icon: TrendingUp,   color: C.green },
  { type: 'support',   label: 'Support Agent',    Icon: Headphones,   color: C.pink },
  { type: 'content',   label: 'Content Agent',    Icon: PenTool,      color: C.orange },
];

const TRIGGER_NODES = [
  { type: 'trigger_whatsapp', label: 'WhatsApp Msg', Icon: MessageSquare, color: '#25D366' },
  { type: 'trigger_slack',    label: 'Slack Msg',    Icon: MessageSquare, color: '#4A154B' },
  { type: 'trigger_schedule', label: 'Schedule',     Icon: Clock,         color: C.yellow },
  { type: 'trigger_webhook',  label: 'Webhook',      Icon: Webhook,       color: C.muted },
];

const isTrigger = (type: string) => type.startsWith('trigger_');

// ── Canvas node / edge types ──────────────────────────────────────────────────
interface CanvasNode {
  id: string; type: string; x: number; y: number;
  task?: string; condition?: string; timeout?: number; retries?: number;
}
interface CanvasEdge { id: string; from: string; to: string; condition?: string; }

// ── Utility: node color ───────────────────────────────────────────────────────
function nodeColor(type: string) {
  return [...AGENT_NODES, ...TRIGGER_NODES].find(n => n.type === type)?.color ?? C.accent;
}
function nodeLabel(type: string) {
  return [...AGENT_NODES, ...TRIGGER_NODES].find(n => n.type === type)?.label ?? type;
}
function NodeIcon({ type, size = 16 }: { type: string; size?: number }) {
  const cfg = [...AGENT_NODES, ...TRIGGER_NODES].find(n => n.type === type);
  if (!cfg) return <Zap size={size} />;
  return <cfg.Icon size={size} />;
}

const GRID = 20; // snap grid size

// ── Canvas component ──────────────────────────────────────────────────────────
interface CanvasProps {
  nodes: CanvasNode[]; edges: CanvasEdge[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onDrop: (type: string, x: number, y: number) => void;
  onConnect: (from: string, to: string) => void;
  onDeleteNode: (id: string) => void;
}

const WorkflowCanvas: React.FC<CanvasProps> = ({
  nodes, edges, selected, onSelect, onMoveNode, onDrop, onConnect, onDeleteNode,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const connecting = useRef<string | null>(null);

  const snap = (v: number) => Math.round(v / GRID) * GRID;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(e.clientX - rect.left - dragging.current.ox);
    const y = snap(e.clientY - rect.top - dragging.current.oy);
    onMoveNode(dragging.current.id, Math.max(0, x), Math.max(0, y));
  }, [onMoveNode]);

  const handleMouseUp = useCallback(() => { dragging.current = null; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [handleMouseMove, handleMouseUp]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };
  const handleDropCanvas = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const type = e.dataTransfer.getData('nodeType');
    if (!type) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = snap(e.clientX - rect.left - 70);
    const y = snap(e.clientY - rect.top - 30);
    onDrop(type, x, y);
  };

  // Build edge paths (straight lines between node centers)
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden cursor-default"
      style={{ background: C.bg }}
      onDragOver={handleDragOver}
      onDrop={handleDropCanvas}
      onClick={() => onSelect(null)}
    >
      {/* Grid dots */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, ${C.border} 1px, transparent 1px)`,
        backgroundSize: `${GRID}px ${GRID}px`,
        opacity: 0.7,
      }} />

      {/* SVG edges */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={C.muted} />
          </marker>
        </defs>
        {edges.map(edge => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
          const x1 = from.x + 140, y1 = from.y + 34;
          const x2 = to.x, y2 = to.y + 34;
          const mx = (x1 + x2) / 2;
          const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
          return (
            <g key={edge.id}>
              <path d={d} fill="none" stroke={C.border} strokeWidth={2} strokeDasharray="6 3" markerEnd="url(#arrowhead)" />
              {edge.condition && (
                <text x={mx} y={(y1 + y2) / 2 - 6} textAnchor="middle" fontSize={10}
                  fill={C.yellow} fontFamily="monospace">{edge.condition}</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(node => {
        const color = nodeColor(node.type);
        const label = nodeLabel(node.type);
        const isSelected = selected === node.id;
        const isTrig = isTrigger(node.type);

        return (
          <div
            key={node.id}
            className="absolute select-none"
            style={{ left: node.x, top: node.y, width: 140, zIndex: isSelected ? 20 : 10 }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onSelect(node.id);
              dragging.current = { id: node.id, ox: e.nativeEvent.offsetX, oy: e.nativeEvent.offsetY };
            }}
          >
            {/* Node shape — diamond for triggers, rounded rect for agents */}
            {isTrig ? (
              <div className="relative flex items-center justify-center" style={{ height: 68 }}>
                <div
                  className="w-16 h-16 rotate-45 border-2 flex items-center justify-center"
                  style={{
                    background: `${color}15`,
                    borderColor: isSelected ? color : `${color}60`,
                    boxShadow: isSelected ? `0 0 0 2px ${color}40` : 'none',
                  }}
                />
                <div className="absolute flex flex-col items-center gap-1 pointer-events-none">
                  <div style={{ color }}><NodeIcon type={node.type} size={14} /></div>
                  <span className="text-xs font-medium text-white leading-none">{label}</span>
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl border px-3 py-2.5 cursor-grab active:cursor-grabbing"
                style={{
                  background: C.card,
                  borderColor: isSelected ? color : `${color}40`,
                  boxShadow: isSelected ? `0 0 0 2px ${color}30` : 'none',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, color }}>
                    <NodeIcon type={node.type} size={12} />
                  </div>
                  <span className="text-xs font-semibold text-white truncate">{label}</span>
                </div>
                {node.task && (
                  <p className="text-xs mt-1.5 truncate" style={{ color: C.muted }}>{node.task}</p>
                )}
                {/* Output handle */}
                <div
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-crosshair z-30"
                  style={{ background: C.card, borderColor: color }}
                  onMouseDown={e => { e.stopPropagation(); connecting.current = node.id; }}
                  onMouseUp={e => {
                    e.stopPropagation();
                    if (connecting.current && connecting.current !== node.id) {
                      onConnect(connecting.current, node.id);
                    }
                    connecting.current = null;
                  }}
                />
              </div>
            )}

            {/* Delete button */}
            {isSelected && (
              <button
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center z-40"
                style={{ background: C.red }}
                onClick={e => { e.stopPropagation(); onDeleteNode(node.id); }}
              >
                <X size={10} color="white" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Inspector panel ───────────────────────────────────────────────────────────
interface InspectorProps {
  node: CanvasNode | null;
  edge: CanvasEdge | null;
  onChange: (patch: Partial<CanvasNode>) => void;
  onEdgeChange: (patch: Partial<CanvasEdge>) => void;
}
const Inspector: React.FC<InspectorProps> = ({ node, edge, onChange, onEdgeChange }) => {
  if (!node && !edge) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ChevronRight size={24} style={{ color: C.muted }} />
        <p className="text-sm mt-3" style={{ color: C.muted }}>Select a node or edge to inspect</p>
      </div>
    );
  }

  const inputCls = 'w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-sky-500 transition-colors';
  const inputStyle = { background: C.bg, borderColor: C.border };
  const label = (t: string) => <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>{t}</label>;

  if (edge) {
    return (
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white">Edge Condition</h3>
        <div>
          {label('Condition (e.g. score > 7)')}
          <input className={inputCls} style={inputStyle}
            placeholder="Leave blank for unconditional"
            value={edge.condition ?? ''}
            onChange={e => onEdgeChange({ condition: e.target.value })}
          />
        </div>
      </div>
    );
  }

  if (!node) return null;
  const isTrig = isTrigger(node.type);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: `${nodeColor(node.type)}18`, color: nodeColor(node.type) }}>
          <NodeIcon type={node.type} size={12} />
        </div>
        <h3 className="text-sm font-semibold text-white">{nodeLabel(node.type)}</h3>
      </div>

      {isTrig ? (
        <>
          <div>
            {label('Condition')}
            <input className={inputCls} style={inputStyle}
              placeholder="e.g. message_contains:lead"
              value={node.condition ?? ''}
              onChange={e => onChange({ condition: e.target.value })}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            {label('Task description')}
            <textarea className={inputCls} style={inputStyle} rows={3}
              placeholder="What should this agent do?"
              value={node.task ?? ''}
              onChange={e => onChange({ task: e.target.value })}
            />
          </div>
          <div>
            {label('Timeout (seconds)')}
            <input type="number" className={inputCls} style={inputStyle}
              value={node.timeout ?? 300}
              onChange={e => onChange({ timeout: Number(e.target.value) })}
            />
          </div>
          <div>
            {label('Retry count')}
            <input type="number" className={inputCls} style={inputStyle}
              value={node.retries ?? 2}
              onChange={e => onChange({ retries: Number(e.target.value) })}
            />
          </div>
        </>
      )}
    </div>
  );
};

// ── Workflow Builder page ─────────────────────────────────────────────────────
export const WorkflowBuilder: React.FC = () => {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [edges, setEdges] = useState<CanvasEdge[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [savedWorkflows, setSavedWorkflows] = useState<WorkflowDef[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchUserTeams().then(res => {
      const teams = res.data as Array<{ id: string; name: string }>;
      if (teams[0]) { setTeamId(teams[0].id); setTeamName(teams[0].name ?? ''); }
    }).catch(() => {});
  }, [user]);

  const loadWorkflowList = useCallback(async () => {
    if (!teamId) return;
    try {
      const res = await fetchWorkflows(teamId);
      setSavedWorkflows(res.data as WorkflowDef[]);
    } catch { /* ignore */ }
  }, [teamId]);

  useEffect(() => { loadWorkflowList(); }, [loadWorkflowList]);

  // Canvas operations
  const addNode = (type: string, x: number, y: number) => {
    const id = `n_${Date.now()}`;
    setNodes(prev => [...prev, { id, type, x, y }]);
  };

  const moveNode = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const patchNode = (patch: Partial<CanvasNode>) => {
    setNodes(prev => prev.map(n => n.id === selected ? { ...n, ...patch } : n));
  };

  const patchEdge = (patch: Partial<CanvasEdge>) => {
    setEdges(prev => prev.map(e => e.id === selected ? { ...e, ...patch } : e));
  };

  const connect = (from: string, to: string) => {
    if (edges.find(e => e.from === from && e.to === to)) return;
    setEdges(prev => [...prev, { id: `e_${Date.now()}`, from, to }]);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id));
    if (selected === id) setSelected(null);
  };

  const clearCanvas = () => { setNodes([]); setEdges([]); setSelected(null); setCurrentId(null); setWorkflowName('New Workflow'); };

  const getSelectedNode = () => nodes.find(n => n.id === selected) ?? null;
  const getSelectedEdge = () => edges.find(e => e.id === selected) ?? null;

  const saveWorkflow = async () => {
    if (!teamId) return;
    setSaving(true);
    const trigger = nodes.find(n => isTrigger(n.type));
    const def = {
      trigger: trigger ? { type: trigger.type, condition: trigger.condition } : null,
      nodes: nodes.filter(n => !isTrigger(n.type)).map(n => ({
        id: n.id, agent: n.type, task: n.task ?? '', x: n.x, y: n.y,
      })),
      edges: edges.map(e => ({ from: e.from, to: e.to, condition: e.condition })),
    };
    try {
      if (currentId) {
        await updateWorkflow(currentId, { name: workflowName, definition: def });
      } else {
        const res = await createWorkflow(teamId, { name: workflowName, definition: def });
        setCurrentId((res.data as WorkflowDef).id);
      }
      await loadWorkflowList();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const loadWorkflow = (wf: WorkflowDef) => {
    const def = wf.definition as any;
    const loadedNodes: CanvasNode[] = [];
    if (def.trigger) {
      loadedNodes.push({ id: `trig_${Date.now()}`, type: def.trigger.type, x: 60, y: 80, condition: def.trigger.condition });
    }
    (def.nodes ?? []).forEach((n: any) => {
      loadedNodes.push({ id: n.id, type: n.agent, x: n.x, y: n.y, task: n.task });
    });
    setNodes(loadedNodes);
    setEdges((def.edges ?? []).map((e: any, i: number) => ({ id: `e_${i}`, from: e.from, to: e.to, condition: e.condition })));
    setWorkflowName(wf.name);
    setCurrentId(wf.id);
    setShowDrawer(false);
  };

  return (
    <DashboardLayout teamName={teamName}>
      <div className="flex flex-col h-full" style={{ background: C.bg }}>
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b flex-shrink-0" style={{ background: C.card, borderColor: C.border }}>
          <input
            className="bg-transparent text-white font-semibold text-sm border-none outline-none w-48 placeholder:text-gray-500"
            value={workflowName}
            onChange={e => setWorkflowName(e.target.value)}
          />
          <div className="h-4 border-l mx-1" style={{ borderColor: C.border }} />
          <div className="flex items-center gap-2 flex-1">
            <button onClick={saveWorkflow} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all"
              style={{ background: C.accent }}>
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save
            </button>
            <button onClick={() => { setShowDrawer(true); loadWorkflowList(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:text-white"
              style={{ borderColor: C.border, color: C.muted, background: C.bg }}>
              <FolderOpen size={13} /> Load
            </button>
            <button onClick={clearCanvas}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:text-red-400"
              style={{ borderColor: C.border, color: C.muted, background: C.bg }}>
              <Trash2 size={13} /> Clear
            </button>
          </div>
          <span className="text-xs" style={{ color: C.muted }}>
            {nodes.length} nodes · {edges.length} edges
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Palette */}
          <div className="w-52 flex-shrink-0 border-r overflow-auto" style={{ background: C.card, borderColor: C.border }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: C.border }}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.muted }}>Agents</p>
            </div>
            <div className="p-2 space-y-1">
              {AGENT_NODES.map(({ type, label, Icon, color }) => (
                <div key={type}
                  draggable
                  onDragStart={e => { e.dataTransfer.setData('nodeType', type); e.dataTransfer.effectAllowed = 'copy'; }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-grab transition-all hover:text-white border border-transparent hover:border-opacity-30"
                  style={{ color: C.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${color}10`)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, color }}>
                    <Icon size={12} />
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-b" style={{ borderColor: C.border }}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.muted }}>Triggers</p>
            </div>
            <div className="p-2 space-y-1">
              {TRIGGER_NODES.map(({ type, label, Icon, color }) => (
                <div key={type}
                  draggable
                  onDragStart={e => { e.dataTransfer.setData('nodeType', type); e.dataTransfer.effectAllowed = 'copy'; }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-grab transition-all hover:text-white"
                  style={{ color: C.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${color}10`)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18`, color }}>
                    <Icon size={12} />
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
            <div className="p-3">
              <p className="text-xs text-center" style={{ color: C.muted }}>Drag tiles onto the canvas →</p>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden">
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <Plus size={28} style={{ color: C.border }} />
                <p className="text-sm mt-3" style={{ color: C.muted }}>Drag nodes from the palette to start building</p>
              </div>
            )}
            <WorkflowCanvas
              nodes={nodes} edges={edges} selected={selected}
              onSelect={setSelected} onMoveNode={moveNode}
              onDrop={addNode} onConnect={connect} onDeleteNode={deleteNode}
            />
          </div>

          {/* Inspector */}
          <div className="w-64 flex-shrink-0 border-l flex flex-col" style={{ background: C.card, borderColor: C.border }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: C.border }}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.muted }}>Inspector</p>
            </div>
            <div className="flex-1 overflow-auto">
              <Inspector
                node={getSelectedNode()} edge={getSelectedEdge()}
                onChange={patchNode} onEdgeChange={patchEdge}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Load drawer */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)} />
            <motion.div
              className="fixed top-0 right-0 h-full w-80 z-50 flex flex-col border-l"
              style={{ background: C.card, borderColor: C.border }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
                <h3 className="text-sm font-semibold text-white">Saved Workflows</h3>
                <button onClick={() => setShowDrawer(false)} style={{ color: C.muted }}><X size={16} /></button>
              </div>
              <div className="flex-1 overflow-auto p-3 space-y-2">
                {savedWorkflows.length === 0 ? (
                  <p className="text-center text-sm py-8" style={{ color: C.muted }}>No workflows saved yet</p>
                ) : (
                  savedWorkflows.map(wf => (
                    <button key={wf.id}
                      onClick={() => loadWorkflow(wf)}
                      className="w-full text-left px-4 py-3 rounded-lg border transition-all hover:border-sky-500/40"
                      style={{ background: C.bg, borderColor: C.border }}
                    >
                      <div className="text-sm font-medium text-white">{wf.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: C.muted }}>
                        {new Date(wf.created_at).toLocaleDateString()}
                        {!wf.is_active && ' · Inactive'}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};
