import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Unlock, CheckCircle2, XCircle, AlertTriangle,
  Plus, Trash2, Edit2, Settings, Zap, Eye, EyeOff, Filter,
  Search, ChevronRight, ChevronDown, ToggleLeft, ToggleRight,
  Bell, BellOff, Clock, DollarSign, Database, Globe, Wrench,
  Layers, GitBranch, AlertCircle, Info, Copy, ExternalLink,
  Activity, Loader2, RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { fetchUserTeams, agentApi } from '../../services/dashboardApi';

const C = {
  bg: '#0B0F19', card: '#111827', border: '#1F2937',
  accent: '#10B981', purple: '#8B5CF6', blue: '#3B82F6',
  red: '#EF4444', yellow: '#F59E0B', orange: '#F97316',
  cyan: '#06B6D4', muted: '#6B7280',
};

// Safe formatting helper
const formatCost = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  return `$${(value as number).toFixed(2)}`;
};

interface PolicyRuleCondition {
  field: 'tool' | 'domain' | 'cost' | 'data_sensitivity' | 'agent_role' | 'time_of_day';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'regex';
  value: string | number | string[];
}

interface PolicyRuleActions {
  type: 'allow' | 'deny' | 'require_approval' | 'limit_scope' | 'audit_only';
  approval_required?: boolean;
  approvers?: string[];
  max_cost_usd?: number;
  max_time_hours?: number;
  data_masking?: boolean;
}

interface PolicyRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  enabled: boolean;
  conditions: PolicyRuleCondition[];
  actions: PolicyRuleActions;
  statistics: {
    total_evaluations: number;
    approvals: number;
    denials: number;
    pending: number;
    last_triggered: string | null;
  };
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface PendingApproval {
  id: string;
  rule_id: string;
  rule_name: string;
  agent_id: string;
  agent_name: string;
  action: {
    type: string;
    tool?: string;
    domain?: string;
    cost_usd?: number;
    data_sensitivity?: string;
    description: string;
  };
  requested_at: string;
  expires_at: string;
  status: 'pending' | 'approved' | 'denied' | 'escalated';
  approvers: {
    email: string;
    status: 'pending' | 'approved' | 'denied';
    responded_at?: string;
    comment?: string;
  }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Map the backend policy rule shape to the frontend PolicyRule interface. */
function mapApiRuleToUi(apiRule: any): PolicyRule {
  // Backend condition is a JSON object like:
  //   { "type": "spend", "amount": { "$gt": 1000 } }
  //   { "risk_level": { "$in": ["high", "critical"] } }
  //   { "tool": "browser_tool" }
  // We convert it to the UI's conditions array format.
  const conditions: PolicyRuleCondition[] = [];
  const rawCondition = apiRule.condition || {};

  for (const [field, value] of Object.entries(rawCondition)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Operator-style condition like { "$gt": 1000 }
      for (const [op, val] of Object.entries(value as Record<string, unknown>)) {
        conditions.push({
          field: field as PolicyRuleCondition['field'],
          operator: opToOperator(op),
          value: val as string | number | string[],
        });
      }
    } else if (Array.isArray(value)) {
      conditions.push({
        field: field as PolicyRuleCondition['field'],
        operator: 'in',
        value: value as string[],
      });
    } else {
      conditions.push({
        field: field as PolicyRuleCondition['field'],
        operator: 'equals',
        value: value as string | number,
      });
    }
  }

  // Backend effect is a string: "allow", "deny", "require_approval"
  const effect = apiRule.effect || 'deny';
  const actionType = effect === 'require_approval' ? 'require_approval' : effect;

  // Determine approvers and max_cost from condition hints (not directly in backend model)
  const actions: PolicyRuleActions = { type: actionType as PolicyRuleActions['type'] };
  if (actionType === 'require_approval') {
    actions.approval_required = true;
  }

  return {
    id: apiRule.id,
    name: apiRule.name || 'Unnamed Rule',
    description: apiRule.description || '',
    priority: apiRule.priority ?? 0,
    enabled: apiRule.enabled ?? true,
    conditions,
    actions,
    statistics: {
      total_evaluations: apiRule.total_evaluations ?? 0,
      approvals: apiRule.approvals ?? 0,
      denials: apiRule.denials ?? 0,
      pending: apiRule.pending ?? 0,
      last_triggered: apiRule.last_triggered ?? null,
    },
    created_at: apiRule.created_at || new Date().toISOString(),
    updated_at: apiRule.updated_at || new Date().toISOString(),
    created_by: apiRule.created_by || apiRule.team_id || 'system',
  };
}

function opToOperator(op: string): PolicyRuleCondition['operator'] {
  const map: Record<string, PolicyRuleCondition['operator']> = {
    '$gt': 'greater_than',
    '$gte': 'greater_than',
    '$lt': 'less_than',
    '$lte': 'less_than',
    '$in': 'in',
    '$nin': 'not_in',
    '$eq': 'equals',
    '$ne': 'not_in',
    '$regex': 'regex',
  };
  return map[op] || 'equals';
}

function uiConditionToApi(conditions: PolicyRuleCondition[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const cond of conditions) {
    switch (cond.operator) {
      case 'greater_than':
        result[cond.field] = { '$gt': cond.value };
        break;
      case 'less_than':
        result[cond.field] = { '$lt': cond.value };
        break;
      case 'in':
        result[cond.field] = Array.isArray(cond.value) ? cond.value : [String(cond.value)];
        break;
      case 'not_in':
        result[cond.field] = { '$nin': Array.isArray(cond.value) ? cond.value : [String(cond.value)] };
        break;
      case 'regex':
        result[cond.field] = { '$regex': cond.value };
        break;
      case 'contains':
        result[cond.field] = { '$regex': cond.value };
        break;
      case 'equals':
      default:
        result[cond.field] = cond.value;
        break;
    }
  }
  return result;
}

const RuleCard: React.FC<{ rule: PolicyRule; onToggle: () => void; onEdit: () => void; onDelete: () => void }> = ({ rule, onToggle, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const actionColors = {
    allow: C.accent,
    deny: C.red,
    require_approval: C.orange,
    limit_scope: C.yellow,
    audit_only: C.blue,
  };

  const actionLabels = {
    allow: 'Allow',
    deny: 'Deny',
    require_approval: 'Require Approval',
    limit_scope: 'Limit Scope',
    audit_only: 'Audit Only',
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${rule.enabled ? '' : 'opacity-50'}`}
              style={{ background: `${actionColors[rule.actions.type]}15`, color: actionColors[rule.actions.type] }}>
              <Shield size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white truncate">{rule.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide flex-shrink-0`}
                  style={{
                    background: `${actionColors[rule.actions.type]}15`,
                    color: actionColors[rule.actions.type],
                  }}>
                  {actionLabels[rule.actions.type]}
                </span>
              </div>
              <p className="text-xs" style={{ color: C.muted }}>{rule.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggle} className={`p-2 rounded-lg transition-colors ${rule.enabled ? '' : 'opacity-50'}`}
              style={{ color: rule.enabled ? C.accent : C.muted }}>
              {rule.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            </button>
            <button onClick={onEdit} className="p-2 rounded-lg transition-colors" style={{ color: C.blue }}>
              <Edit2 size={16} />
            </button>
            <button onClick={onDelete} className="p-2 rounded-lg transition-colors" style={{ color: C.red }}>
              <Trash2 size={16} />
            </button>
            <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-lg transition-colors" style={{ color: C.muted }}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-3 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1" style={{ color: C.muted }}>
            <Activity size={12} />
            {rule.statistics.total_evaluations.toLocaleString()} evaluations
          </span>
          <span className="flex items-center gap-1" style={{ color: C.accent }}>
            <CheckCircle2 size={12} />
            {rule.statistics.approvals.toLocaleString()}
          </span>
          <span className="flex items-center gap-1" style={{ color: C.red }}>
            <XCircle size={12} />
            {rule.statistics.denials.toLocaleString()}
          </span>
          {rule.statistics.pending > 0 && (
            <span className="flex items-center gap-1" style={{ color: C.orange }}>
              <Clock size={12} />
              {rule.statistics.pending} pending
            </span>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t"
            style={{ borderColor: C.border }}
          >
            <div className="p-4 space-y-4">
              {/* Conditions */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: C.muted }}>
                  Conditions (ALL must match)
                </h4>
                <div className="space-y-2">
                  {rule.conditions.map((cond, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ background: `${C.muted}05` }}>
                      <span className="font-mono px-2 py-0.5 rounded" style={{ background: `${C.blue}15`, color: C.blue }}>
                        {cond.field}
                      </span>
                      <span className="font-mono px-2 py-0.5 rounded" style={{ background: `${C.purple}15`, color: C.purple }}>
                        {cond.operator}
                      </span>
                      <span className="font-mono flex-1 truncate" style={{ color: C.muted }}>
                        {Array.isArray(cond.value) ? `[${cond.value.length} values]` : String(cond.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: C.muted }}>
                  Actions
                </h4>
                <div className="p-3 rounded-lg border" style={{ background: `${actionColors[rule.actions.type]}05`, borderColor: `${actionColors[rule.actions.type]}20` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: actionColors[rule.actions.type] }}>
                      → {actionLabels[rule.actions.type]}
                    </span>
                  </div>
                  {rule.actions.approvers && rule.actions.approvers.length > 0 && (
                    <div className="text-xs" style={{ color: C.muted }}>
                      Approvers: {rule.actions.approvers.join(', ')}
                    </div>
                  )}
                  {rule.actions.max_cost_usd && (
                    <div className="text-xs mt-1" style={{ color: C.muted }}>
                      Max cost: ${rule.actions.max_cost_usd}
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-3 border-t text-xs" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-between">
                  <span style={{ color: C.muted }}>Created by {rule.created_by}</span>
                  <span className="font-mono" style={{ color: C.muted }}>
                    Updated {new Date(rule.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ApprovalCard: React.FC<{ approval: PendingApproval; onApprove: () => void; onDeny: () => void }> = ({ approval, onApprove, onDeny }) => {
  const timeUntilExpiry = new Date(approval.expires_at).getTime() - Date.now();
  const isUrgent = timeUntilExpiry < 3600000; // Less than 1 hour

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border p-4"
      style={{ background: C.card, borderColor: isUrgent ? `${C.red}30` : C.border }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ background: `${C.orange}15`, color: C.orange }}>
            <Bell size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{approval.rule_name}</h3>
            <p className="text-xs" style={{ color: C.muted }}>{approval.agent_name}</p>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${isUrgent ? 'animate-pulse' : ''}`}
          style={{
            background: isUrgent ? `${C.red}15` : `${C.yellow}15`,
            color: isUrgent ? C.red : C.yellow,
          }}>
          {isUrgent ? 'Expiring Soon' : 'Pending'}
        </span>
      </div>

      {/* Action Details */}
      <div className="mb-3 p-3 rounded-lg border" style={{ background: `${C.muted}05`, borderColor: C.border }}>
        <p className="text-xs mb-2" style={{ color: C.muted }}>{approval.action.description}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {approval.action.tool && (
            <span className="px-2 py-0.5 rounded" style={{ background: `${C.blue}15`, color: C.blue }}>
              {approval.action.tool}
            </span>
          )}
          {approval.action.cost_usd && (
            <span className="px-2 py-0.5 rounded flex items-center gap-1" style={{ background: `${C.yellow}15`, color: C.yellow }}>
              <DollarSign size={10} />{formatCost(approval.action.cost_usd)}
            </span>
          )}
          {approval.action.data_sensitivity && (
            <span className="px-2 py-0.5 rounded capitalize" style={{ background: `${C.purple}15`, color: C.purple }}>
              {approval.action.data_sensitivity}
            </span>
          )}
        </div>
      </div>

      {/* Approvers */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: C.muted }}>Approvers</span>
          <span className="text-[10px]" style={{ color: C.muted }}>
            {approval.approvers.filter(a => a.status === 'approved').length}/{approval.approvers.length} approved
          </span>
        </div>
        <div className="space-y-1.5">
          {approval.approvers.map((approver, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 rounded" style={{ background: `${C.muted}05` }}>
              <span className="font-mono" style={{ color: approver.status === 'approved' ? C.accent : approver.status === 'denied' ? C.red : C.muted }}>
                {approver.email}
              </span>
              <div className="flex items-center gap-2">
                {approver.status === 'approved' && <CheckCircle2 size={12} style={{ color: C.accent }} />}
                {approver.status === 'denied' && <XCircle size={12} style={{ color: C.red }} />}
                {approver.status === 'pending' && <Clock size={12} style={{ color: C.yellow }} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onApprove} className="flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          style={{ background: `${C.accent}15`, color: C.accent }}>
          <CheckCircle2 size={12} /> Approve
        </button>
        <button onClick={onDeny} className="flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          style={{ background: `${C.red}15`, color: C.red }}>
          <XCircle size={12} /> Deny
        </button>
      </div>

      {/* Expiry */}
      <div className="mt-2 text-center">
        <span className={`text-[10px] ${isUrgent ? 'text-red-400' : ''}`} style={{ color: C.muted }}>
          Expires in {Math.round(timeUntilExpiry / 3600000)}h {Math.round((timeUntilExpiry % 3600000) / 60000)}m
        </span>
      </div>
    </motion.div>
  );
};

const CreateRuleModal: React.FC<{ onClose: () => void; onCreate: (rule: Partial<PolicyRule>) => void; creating: boolean }> = ({ onClose, onCreate, creating }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 1,
    conditions: [] as PolicyRuleCondition[],
    actionType: 'allow' as PolicyRuleActions['type'],
    approvers: [] as string[],
    maxCost: 0,
  });

  const fieldOptions = [
    { value: 'tool', label: 'Tool', icon: Wrench },
    { value: 'domain', label: 'Domain', icon: Globe },
    { value: 'cost', label: 'Cost (USD)', icon: DollarSign },
    { value: 'data_sensitivity', label: 'Data Sensitivity', icon: Database },
    { value: 'agent_role', label: 'Agent Role', icon: Layers },
    { value: 'time_of_day', label: 'Time of Day', icon: Clock },
  ];

  const operatorOptions = {
    cost: ['equals', 'greater_than', 'less_than'],
    data_sensitivity: ['equals', 'not_equals', 'in'],
    default: ['equals', 'contains', 'in', 'not_in', 'regex'],
  };

  const sensitivityOptions = ['public', 'internal', 'confidential', 'restricted'];
  const timeOptions = ['before_9am', 'after_6pm', 'weekend', 'holiday'];

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
        className="w-full max-w-2xl rounded-2xl border"
        style={{ background: C.card, borderColor: C.border }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.accent}15`, color: C.accent }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Policy Rule</h2>
              <p className="text-xs" style={{ color: C.muted }}>Define conditions and actions for pre-action checks</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: C.muted }}>
            <XCircle size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: 'Basics' },
              { num: 2, label: 'Conditions' },
              { num: 3, label: 'Actions' },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-2 ${step >= s.num ? '' : 'opacity-50'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${step >= s.num ? 'text-white' : ''}`}
                    style={{ background: step >= s.num ? C.accent : C.border }}>
                    {s.num}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.num ? 'text-white' : ''}`} style={{ color: C.muted }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div className={`flex-1 h-px mx-2 ${step > s.num ? 'bg-emerald-500' : ''}`} style={{ background: C.border }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Rule Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., High-Cost Action Approval"
                  className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                  style={{ background: C.bg, borderColor: C.border }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this rule does..."
                  className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  style={{ background: C.bg, borderColor: C.border }}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Priority (lower = higher priority)</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                  style={{ background: C.bg, borderColor: C.border }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium" style={{ color: C.muted }}>Conditions</label>
                <button
                  onClick={() => setFormData({
                    ...formData,
                    conditions: [...formData.conditions, { field: 'tool', operator: 'equals', value: '' }]
                  })}
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded"
                  style={{ background: `${C.accent}15`, color: C.accent }}
                >
                  <Plus size={12} /> Add Condition
                </button>
              </div>
              <div className="space-y-2">
                {formData.conditions.map((cond, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg border" style={{ background: `${C.muted}05`, borderColor: C.border }}>
                    <select
                      value={cond.field}
                      onChange={e => {
                        const newField = e.target.value as typeof cond.field;
                        setFormData({
                          ...formData,
                          conditions: formData.conditions.map((c, j) => j === i ? { ...c, field: newField, operator: 'equals', value: '' } : c)
                        });
                      }}
                      className="px-2 py-1 rounded text-xs text-white outline-none"
                      style={{ background: C.bg, borderColor: C.border }}
                    >
                      {fieldOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <select
                      value={cond.operator}
                      onChange={e => setFormData({
                        ...formData,
                        conditions: formData.conditions.map((c, j) => j === i ? { ...c, operator: e.target.value as any } : c)
                      })}
                      className="px-2 py-1 rounded text-xs text-white outline-none"
                      style={{ background: C.bg, borderColor: C.border }}
                    >
                      {(cond.field === 'cost' ? operatorOptions.cost : cond.field === 'data_sensitivity' ? ['equals', 'not_equals', 'in'] : operatorOptions.default).map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                    {cond.field === 'data_sensitivity' ? (
                      <select
                        value={String(cond.value)}
                        onChange={e => setFormData({
                          ...formData,
                          conditions: formData.conditions.map((c, j) => j === i ? { ...c, value: e.target.value } : c)
                        })}
                        className="flex-1 px-2 py-1 rounded text-xs text-white outline-none"
                        style={{ background: C.bg, borderColor: C.border }}
                      >
                        {sensitivityOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : cond.field === 'time_of_day' ? (
                      <select
                        value={String(cond.value)}
                        onChange={e => setFormData({
                          ...formData,
                          conditions: formData.conditions.map((c, j) => j === i ? { ...c, value: e.target.value } : c)
                        })}
                        className="flex-1 px-2 py-1 rounded text-xs text-white outline-none"
                        style={{ background: C.bg, borderColor: C.border }}
                      >
                        {timeOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={String(cond.value)}
                        onChange={e => setFormData({
                          ...formData,
                          conditions: formData.conditions.map((c, j) => j === i ? { ...c, value: e.target.value } : c)
                        })}
                        placeholder="Value"
                        className="flex-1 px-2 py-1 rounded text-xs text-white outline-none"
                        style={{ background: C.bg, borderColor: C.border }}
                      />
                    )}
                    <button
                      onClick={() => setFormData({ ...formData, conditions: formData.conditions.filter((_, j) => j !== i) })}
                      className="p-1 rounded hover:bg-white/5"
                      style={{ color: C.red }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {formData.conditions.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: C.muted }}>
                    No conditions added. Click "Add Condition" to start.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: C.muted }}>Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['allow', 'deny', 'require_approval', 'audit_only'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, actionType: type })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${formData.actionType === type ? 'border-emerald-500' : ''}`}
                      style={{
                        background: formData.actionType === type ? `${C.accent}15` : C.bg,
                        borderColor: formData.actionType === type ? C.accent : C.border,
                        color: formData.actionType === type ? C.accent : C.muted,
                      }}
                    >
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {formData.actionType === 'require_approval' && (
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: C.muted }}>Approvers (comma-separated emails)</label>
                  <input
                    type="text"
                    placeholder="finance@viktron.ai, ops@viktron.ai"
                    onChange={e => setFormData({ ...formData, approvers: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                    style={{ background: C.bg, borderColor: C.border }}
                  />
                </div>
              )}

              {formData.actionType === 'require_approval' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Max Cost Limit (USD)</label>
                  <input
                    type="number"
                    value={formData.maxCost}
                    onChange={e => setFormData({ ...formData, maxCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                    style={{ background: C.bg, borderColor: C.border }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-between gap-3" style={{ borderColor: C.border }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
              style={{ borderColor: C.border, color: C.muted, background: C.card }}>
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                onCreate({
                  name: formData.name,
                  description: formData.description,
                  priority: formData.priority,
                  conditions: formData.conditions,
                  actions: {
                    type: formData.actionType,
                    approvers: formData.approvers,
                    max_cost_usd: formData.maxCost,
                  },
                });
              }
            }}
            disabled={creating || !formData.name || (step === 2 && formData.conditions.length === 0)}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ background: C.accent }}
          >
            {creating ? <Loader2 className="animate-spin mx-auto" size={16} /> : step < 3 ? 'Continue' : 'Create Rule'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const PolicyGateway: React.FC = () => {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [rules, setRules] = useState<PolicyRule[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Loading and error states
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [togglingRuleId, setTogglingRuleId] = useState<string | null>(null);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);

  // ── Resolve team ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    fetchUserTeams()
      .then(res => {
        const teams = res.data as any;
        const list = Array.isArray(teams) ? teams : teams?.teams ?? teams?.data ?? [];
        if (list[0]) {
          setTeamId(list[0].id);
        }
      })
      .catch(() => {});
  }, [user]);

  // ── Fetch rules ────────────────────────────────────────────────────────────
  const fetchRules = useCallback(async () => {
    if (!teamId) return;
    setRulesError(null);
    try {
      const res = await agentApi.get(`/api/agentirl/policy/rules?team_id=${teamId}`);
      const rawRules = res.data?.rules ?? res.data ?? [];
      const mapped = (Array.isArray(rawRules) ? rawRules : []).map(mapApiRuleToUi);
      setRules(mapped);
    } catch (err: any) {
      console.error('[PolicyGateway] Failed to fetch rules:', err);
      setRulesError(err?.response?.data?.detail || err?.message || 'Failed to load policy rules');
    } finally {
      setRulesLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // ── Create rule ────────────────────────────────────────────────────────────
  const handleCreateRule = useCallback(async (ruleData: Partial<PolicyRule>) => {
    if (!teamId) return;
    setCreating(true);
    try {
      const condition = uiConditionToApi(ruleData.conditions || []);
      const payload = {
        name: ruleData.name,
        description: ruleData.description || '',
        condition,
        effect: ruleData.actions?.type || 'allow',
        risk_category: ruleData.actions?.type === 'deny' ? 'critical' : ruleData.actions?.type === 'require_approval' ? 'high' : 'medium',
        priority: ruleData.priority ?? 1,
      };
      const res = await agentApi.post(`/api/agentirl/policy/rules?team_id=${teamId}`, payload);
      const newRule = mapApiRuleToUi(res.data);
      setRules(prev => [newRule, ...prev]);
      setShowCreateModal(false);
    } catch (err: any) {
      console.error('[PolicyGateway] Failed to create rule:', err);
      setRulesError(err?.response?.data?.detail || err?.message || 'Failed to create policy rule');
    } finally {
      setCreating(false);
    }
  }, [teamId]);

  // ── Toggle rule ─────────────────────────────────────────────────────────────
  const handleToggleRule = useCallback(async (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule || !teamId) return;

    setTogglingRuleId(ruleId);
    // Optimistic update
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));

    try {
      // The backend doesn't have a dedicated toggle endpoint, so we update by
      // re-creating the rule with the toggled enabled flag. We use PATCH semantics
      // by re-submitting the full rule with the toggled state.
      await agentApi.post(`/api/agentirl/policy/rules?team_id=${teamId}`, {
        name: rule.name,
        description: rule.description,
        condition: uiConditionToApi(rule.conditions),
        effect: rule.actions.type,
        risk_category: rule.actions.type === 'deny' ? 'critical' : rule.actions.type === 'require_approval' ? 'high' : 'medium',
        priority: rule.priority,
        enabled: !rule.enabled,
      });
    } catch (err: any) {
      console.error('[PolicyGateway] Failed to toggle rule:', err);
      // Revert optimistic update
      setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: rule.enabled } : r));
      setRulesError(err?.response?.data?.detail || err?.message || 'Failed to toggle rule');
    } finally {
      setTogglingRuleId(null);
    }
  }, [rules, teamId]);

  // ── Delete rule ────────────────────────────────────────────────────────────
  const handleDeleteRule = useCallback(async (ruleId: string) => {
    if (!teamId) return;

    setDeletingRuleId(ruleId);
    // Optimistic update
    const removed = rules.find(r => r.id === ruleId);
    setRules(prev => prev.filter(r => r.id !== ruleId));

    try {
      await agentApi.delete(`/api/agentirl/policy/rules/${ruleId}`);
    } catch (err: any) {
      console.error('[PolicyGateway] Failed to delete rule:', err);
      // Revert optimistic update
      if (removed) setRules(prev => [removed, ...prev]);
      setRulesError(err?.response?.data?.detail || err?.message || 'Failed to delete rule');
    } finally {
      setDeletingRuleId(null);
    }
  }, [rules, teamId]);

  const filteredRules = rules.filter(rule => {
    if (filter === 'active' && !rule.enabled) return false;
    if (filter === 'disabled' && rule.enabled) return false;
    if (searchQuery && !rule.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: rules.length,
    active: rules.filter(r => r.enabled).length,
    pendingApprovals: pendingApprovals.filter(a => a.status === 'pending').length,
    totalEvaluations: rules.reduce((sum, r) => sum + r.statistics.total_evaluations, 0),
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
              <h1 className="text-xl font-bold text-white">Policy Gateway</h1>
              <p className="text-sm" style={{ color: C.muted }}>Pre-action authorization and approval gates</p>
            </div>
            <button
              onClick={fetchRules}
              className="ml-auto p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: C.muted }}
              title="Refresh"
            >
              <RefreshCw size={16} className={rulesLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {rulesError && (
          <div className="mb-6 p-4 rounded-xl border flex items-center gap-3" style={{ background: `${C.red}10`, borderColor: `${C.red}30` }}>
            <AlertCircle size={18} style={{ color: C.red }} />
            <span className="text-sm" style={{ color: C.red }}>{rulesError}</span>
            <button onClick={() => { setRulesError(null); fetchRules(); }} className="ml-auto text-xs px-3 py-1 rounded-lg" style={{ background: `${C.red}15`, color: C.red }}>
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} style={{ color: C.muted }} />
              <span className="text-xs" style={{ color: C.muted }}>Total Rules</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {rulesLoading ? <Loader2 className="animate-spin inline" size={20} /> : stats.total}
            </p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} style={{ color: C.accent }} />
              <span className="text-xs" style={{ color: C.muted }}>Active</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.active}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Bell size={16} style={{ color: C.orange }} />
              <span className="text-xs" style={{ color: C.muted }}>Pending Approvals</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} style={{ color: C.purple }} />
              <span className="text-xs" style={{ color: C.muted }}>Total Evaluations</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalEvaluations.toLocaleString()}</p>
          </div>
        </div>

        {/* Pending Approvals Section */}
        {stats.pendingApprovals > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.orange}15`, color: C.orange }}>
                  <Bell size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Pending Approvals</h2>
                  <p className="text-xs" style={{ color: C.muted }}>Awaiting your decision</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {pendingApprovals.filter(a => a.status === 'pending').map(approval => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onApprove={() => {
                    approval.approvers.forEach(a => { a.status = 'approved'; a.responded_at = new Date().toISOString(); });
                    approval.status = 'approved';
                    setPendingApprovals([...pendingApprovals]);
                  }}
                  onDeny={() => {
                    approval.approvers.forEach(a => { a.status = 'denied'; a.responded_at = new Date().toISOString(); });
                    approval.status = 'denied';
                    setPendingApprovals([...pendingApprovals]);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Rules Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.purple}15`, color: C.purple }}>
                <Layers size={16} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Policy Rules</h2>
                <p className="text-xs" style={{ color: C.muted }}>Conditions and actions for pre-action checks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Filter */}
              <div className="flex items-center gap-1 p-1 rounded-lg border" style={{ borderColor: C.border, background: C.card }}>
                {(['all', 'active', 'disabled'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? '' : ''}`}
                    style={{
                      background: filter === f ? `${C.accent}15` : 'transparent',
                      color: filter === f ? C.accent : C.muted,
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search rules..."
                  className="pl-9 pr-3 py-1.5 rounded-lg border text-xs text-white outline-none focus:border-emerald-500/50 transition-colors"
                  style={{ background: C.bg, borderColor: C.border }}
                />
              </div>
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: C.accent }}>
                <Plus size={14} /> Create Rule
              </button>
            </div>
          </div>

          {/* Loading state */}
          {rulesLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin mb-4" size={32} style={{ color: C.accent }} />
              <p className="text-sm" style={{ color: C.muted }}>Loading policy rules...</p>
            </div>
          )}

          {/* Rules list */}
          {!rulesLoading && (
            <div className="space-y-3">
              {filteredRules.map(rule => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  onToggle={() => handleToggleRule(rule.id)}
                  onEdit={() => {}}
                  onDelete={() => handleDeleteRule(rule.id)}
                />
              ))}
            </div>
          )}

          {!rulesLoading && filteredRules.length === 0 && (
            <div className="text-center py-16">
              <Shield size={48} style={{ color: C.muted, opacity: 0.3 }} />
              <p className="text-sm mt-4" style={{ color: C.muted }}>
                {searchQuery ? 'No rules match your search' : 'No policy rules yet'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: `${C.accent}15`, color: C.accent }}
                >
                  Create your first policy rule
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateRuleModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateRule}
            creating={creating}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default PolicyGateway;