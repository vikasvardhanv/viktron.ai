import axios from 'axios';

const resolveAgentApi = () => {
  const configured = (import.meta.env.VITE_AGENT_API_URL as string | undefined)?.trim();
  if (configured && configured !== 'http://localhost:8000') return configured;

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  return configured || 'https://api.viktron.ai';
};

const AGENT_API = resolveAgentApi();
const TOKEN_KEY = 'viktron_auth_token';

export const getAgentToken = () => localStorage.getItem(TOKEN_KEY) ?? '';

export const agentApi = axios.create({ baseURL: AGENT_API });
agentApi.interceptors.request.use((config) => {
  const token = getAgentToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchUserTeams = () => agentApi.get('/api/teams');
export const sendTeamMessage = (teamId: string, message: string, channel = 'web') =>
  agentApi.post(`/api/teams/${teamId}/message`, { message, channel });
export const fetchAgentSkills = () => agentApi.get('/api/skills');
export const fetchDashboardOverview = (teamId: string) => agentApi.get(`/api/dashboard/overview?team_id=${teamId}`);
export const fetchWorkflows = (teamId: string) => agentApi.get(`/api/workflows/?team_id=${teamId}`);
export const createWorkflow = (teamId: string, data: Record<string, unknown>) => agentApi.post(`/api/workflows/?team_id=${teamId}`, data);
export const updateWorkflow = (workflowId: string, data: Record<string, unknown>) => agentApi.put(`/api/workflows/${workflowId}`, data);
export const deleteWorkflow = (workflowId: string) => agentApi.delete(`/api/workflows/${workflowId}`);
export const fetchChannelConfig = (teamId: string) => agentApi.get(`/api/channels/config/${teamId}`);
export const verifySlackToken = (data: Record<string, unknown>) => agentApi.post('/api/channels/config/slack/verify', data);
export const verifyTeamsCredentials = (data: Record<string, unknown>) => agentApi.post('/api/channels/config/teams/verify', data);

export interface IntegrationsApp {
  name: string;
  display_name: string;
  categories: string[];
  logo: string | null;
}

export interface ConnectedApp {
  id: string;
  app_name: string;
  display_name: string;
  status: string;
  connected_at: string | null;
}

export const fetchAvailableIntegrations = () => agentApi.get<{ apps: IntegrationsApp[]; total: number }>('/api/integrations/apps');
export const fetchConnectedIntegrations = () => agentApi.get<{ connected_apps: ConnectedApp[] }>('/api/integrations/connected');
export const connectIntegration = (app: string, redirectUrl?: string) => 
  agentApi.post<{ redirect_url: string; connection_id: string; app: string; status: string }>('/api/integrations/connect', { 
    app, 
    redirect_url: redirectUrl || window.location.origin + '/integrations/callback' 
  });
export const disconnectIntegration = (appName: string) => agentApi.delete(`/api/integrations/${appName}`);

export const createDashboardWebSocket = (teamId: string): WebSocket => {
  const token = getAgentToken();
  const wsBase = AGENT_API.replace(/^https/, 'wss').replace(/^http/, 'ws');
  return new WebSocket(`${wsBase}/ws/dashboard/${teamId}?token=${encodeURIComponent(token)}`);
};

export interface AgentOverview {
  id: string; role: string; display_name: string; status: string;
  current_task: string | null; current_task_id: string | null;
  memory_kb: number; metrics: Record<string, unknown>;
  current_spend: number; monthly_budget: number; total_tokens: number;
  last_heartbeat: string | null; last_active: string | null; created_at: string;
  trust_score?: number;
}

export interface DashboardOverview {
  agents: AgentOverview[];
  tasks: { pending: number; running: number; completed: number; failed: number };
  channels: Record<string, string>;
  activity: Array<{ id: string; timestamp: string; agent: string; agent_role: string; action: string; summary: string }>;
  spend?: { total_usd: number };
}

export interface TraceStep {
  action_type: string; model: string | null;
  input_tokens: number; output_tokens: number;
  latency_ms: number | null; summary: string | null; started_at: string | null;
}
export interface TranscriptTask {
  id: string; type: string; description: string | null; status: string;
  input: Record<string, unknown>; output: Record<string, unknown> | null;
  error: string | null; created_at: string; started_at: string | null;
  completed_at: string | null; duration_ms: number | null; steps: TraceStep[];
}
export interface AgentTranscript {
  agent_id: string; agent_name: string; role: string; tasks: TranscriptTask[];
}

export const fetchAgentTranscript = (agentId: string, limit = 20) =>
  agentApi.get<AgentTranscript>(`/api/agents/${agentId}/transcript?limit=${limit}`);

export interface WorkflowDef {
  id: string; team_id: string; name: string;
  definition: Record<string, unknown>; is_active: boolean;
  created_at: string; updated_at: string | null;
}

export interface ChannelInfo {
  status: string; workspace_name?: string; workspace_id?: string;
  bot_name?: string; phone_number?: string; scopes?: string[];
}

// ── Provenance Ledger ─────────────────────────────────────────────────────

export interface ProvenanceEntry {
  id: string;
  sequence_number: number;
  timestamp: string;
  mission_id: string;
  stream_id: string;
  agent_id: string;
  agent_name: string;
  action_type: string;
  who_authorized: {
    user_id: string;
    user_email: string;
    delegation_token_id?: string;
    scope: string[];
  };
  what_goal: {
    task_description: string;
    success_criteria: string[];
    constraints: string[];
  };
  what_saw: {
    input_data: Record<string, any>;
    context_retrieved: string[];
    tools_used: string[];
  };
  why_chose: {
    reasoning_chain: string[];
    alternatives_considered: string[];
    confidence_score: number;
  };
  what_changed: {
    output: Record<string, any>;
    side_effects: string[];
    cost_usd: number;
    tokens_used: number;
    latency_ms: number;
  };
  hash: string;
  previous_hash: string;
  signature: string;
  data_sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  retention_policy: '30d' | '90d' | '1y' | '7y' | 'permanent';
  tags: string[];
}

export interface ProvenanceVerifyResult {
  valid: boolean;
  broken_links?: Array<{ sequence: number; expected_hash: string; actual_hash: string }>;
  checked_count: number;
}

export const fetchProvenanceChain = (missionId: string) =>
  agentApi.get<ProvenanceEntry[]>(`/api/agentirl/missions/${missionId}/provenance`);

export const verifyProvenanceChain = (missionId: string) =>
  agentApi.post<ProvenanceVerifyResult>(`/api/agentirl/missions/${missionId}/provenance/verify`);

export const fetchAgentProvenanceHistory = (agentId: string) =>
  agentApi.get<ProvenanceEntry[]>(`/api/agentirl/provenance/agent/${agentId}`);

// ── Memory Governance ────────────────────────────────────────────────────

export interface MemoryGovernanceStore {
  id: string;
  name: string;
  description: string;
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic' | 'procedural';
  owner_agent_id: string;
  owner_agent_name: string;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  retention_policy: {
    duration: '1h' | '24h' | '7d' | '30d' | '90d' | '1y' | '7y' | 'permanent';
    auto_delete: boolean;
    archive_after: string | null;
  };
  access_control: {
    read_roles: string[];
    write_roles: string[];
    delete_roles: string[];
    public_read: boolean;
  };
  statistics: {
    total_entries: number;
    size_bytes: number;
    read_count_24h: number;
    write_count_24h: number;
    oldest_entry: string | null;
    newest_entry: string | null;
  };
  encryption: {
    at_rest: boolean;
    in_transit: boolean;
    key_id: string | null;
  };
  compliance: {
    gdpr_relevant: boolean;
    hipaa_relevant: boolean;
    soc2_relevant: boolean;
    pii_detected: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface MemoryGovernancePolicy {
  id: string;
  name: string;
  description: string;
  sensitivity_levels: string[];
  default_retention: string;
  rules: Array<{ field: string; operator: string; value: string; action: string }>;
  created_at: string;
  updated_at: string;
}

export interface GovernedMemoryPayload {
  agent_id: string;
  key: string;
  value: string;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  retention_policy: string;
  metadata?: Record<string, any>;
}

export const fetchGovernancePolicies = () =>
  agentApi.get<MemoryGovernancePolicy[]>('/api/memory/governance/policies');

export const storeGovernedMemory = (payload: GovernedMemoryPayload) =>
  agentApi.post<MemoryGovernanceStore>('/api/memory/governed', payload);

export const retrieveGovernedMemory = (agentId: string, key: string, requestingAgentId?: string) => {
  const params = requestingAgentId ? `?requesting_agent_id=${requestingAgentId}` : '';
  return agentApi.get<{ key: string; value: string; sensitivity: string; metadata: Record<string, any> }>(
    `/api/memory/governed/${agentId}/${key}${params}`
  );
};

export const applyRetention = (teamId: string) =>
  agentApi.post<{ deleted_count: number; archived_count: number }>(`/api/memory/governance/retention/apply?team_id=${teamId}`);

// ── AgentIRL Delegation Tokens ────────────────────────────────────────────

export interface DelegationTokenScope {
  allowed_actions?: string[];
  allowed_tools?: string[];
  allowed_domains?: string[];
}

export interface DelegationTokenConstraints {
  max_cost?: number;
  max_duration_seconds?: number;
  data_sensitivity_max?: string;
  max_delegation_depth?: number;
}

export interface DelegationToken {
  id: string;
  mission_id: string;
  team_id: string;
  issuer_agent_id: string | null;
  subject_agent_id: string | null;
  scope: DelegationTokenScope;
  constraints: DelegationTokenConstraints;
  parent_token_id: string | null;
  depth: number;
  jwt_hash: string | null;
  issued_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  is_valid: boolean;
  created_at: string | null;
}

export interface AgentIRLMission {
  id: string;
  title: string;
  status: string;
  assigned_agent_role?: string;
  [key: string]: unknown;
}

export const fetchAgentIRLMissions = (teamId: string) =>
  agentApi.get<{ missions: AgentIRLMission[] }>(`/api/agentirl/missions?team_id=${teamId}`);

export const fetchMissionTokens = (missionId: string) =>
  agentApi.get<{ tokens: DelegationToken[] }>(`/api/agentirl/missions/${missionId}/tokens`);

export const issueDelegationToken = (teamId: string, data: {
  mission_id: string;
  scope?: DelegationTokenScope;
  constraints?: DelegationTokenConstraints;
  duration_seconds?: number;
  issuer_agent_id?: string;
  subject_agent_id?: string;
  parent_token_id?: string;
}) => agentApi.post<DelegationToken>(`/api/agentirl/tokens/issue?team_id=${teamId}`, data);

export const revokeDelegationToken = (tokenId: string) =>
  agentApi.post<{ status: string; token_id: string }>(`/api/agentirl/tokens/${tokenId}/revoke`);

// ── AgentIRL Trust & Stats ───────────────────────────────────────────────

export interface AgentTrustScore {
  id: string;
  agent_id: string;
  team_id: string;
  score: number;
  level: string;
  factors: Record<string, unknown>;
  history_trend: Array<{ score: number; level: string; timestamp: string }>;
  computed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface MissionStats {
  total_missions: number;
  success_rate: number;
  active_orchestrations: number;
  infrastructure_health: string;
  provider: string;
}

export const fetchAgentTrustScore = (agentId: string, teamId: string) =>
  agentApi.get<AgentTrustScore>(`/api/agentirl/agents/${agentId}/trust?team_id=${teamId}`);

export const fetchAgentTrustHistory = (agentId: string, teamId: string) =>
  agentApi.get<{ agent_id: string; current_score: number; current_level: string; history: Array<{ score: number; level: string; timestamp: string }> }>(
    `/api/agentirl/agents/${agentId}/trust/history?team_id=${teamId}`
  );

export const recomputeAgentTrustScore = (agentId: string, teamId: string) =>
  agentApi.post<AgentTrustScore>(`/api/agentirl/agents/${agentId}/trust/recompute?team_id=${teamId}`);

export const fetchAgentirlStats = (teamId: string) =>
  agentApi.get<MissionStats>(`/api/agentirl/stats?team_id=${teamId}`);
