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

const agentApi = axios.create({ baseURL: AGENT_API });
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
