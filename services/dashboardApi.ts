import axios from 'axios';

const AGENT_API = (import.meta.env.VITE_AGENT_API_URL as string | undefined) ?? 'https://api.viktron.ai';
const TOKEN_KEY = 'viktron_auth_token';

export const getAgentToken = () => localStorage.getItem(TOKEN_KEY) ?? '';

const agentApi = axios.create({ baseURL: AGENT_API });
agentApi.interceptors.request.use((config) => {
  const token = getAgentToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchUserTeams = () => agentApi.get('/api/teams');
export const fetchDashboardOverview = (teamId: string) => agentApi.get(`/api/dashboard/overview?team_id=${teamId}`);
export const fetchWorkflows = (teamId: string) => agentApi.get(`/api/workflows/?team_id=${teamId}`);
export const createWorkflow = (teamId: string, data: Record<string, unknown>) => agentApi.post(`/api/workflows/?team_id=${teamId}`, data);
export const updateWorkflow = (workflowId: string, data: Record<string, unknown>) => agentApi.put(`/api/workflows/${workflowId}`, data);
export const deleteWorkflow = (workflowId: string) => agentApi.delete(`/api/workflows/${workflowId}`);
export const fetchChannelConfig = (teamId: string) => agentApi.get(`/api/channels/config/${teamId}`);
export const verifySlackToken = (data: Record<string, unknown>) => agentApi.post('/api/channels/config/slack/verify', data);
export const verifyTeamsCredentials = (data: Record<string, unknown>) => agentApi.post('/api/channels/config/teams/verify', data);

export const createDashboardWebSocket = (teamId: string): WebSocket => {
  const token = getAgentToken();
  const wsBase = AGENT_API.replace(/^https/, 'wss').replace(/^http/, 'ws');
  return new WebSocket(`${wsBase}/ws/dashboard/${teamId}?token=${encodeURIComponent(token)}`);
};

export interface AgentOverview {
  id: string; role: string; display_name: string; status: string;
  current_task: string | null; current_task_id: string | null;
  memory_kb: number; metrics: Record<string, unknown>;
}

export interface DashboardOverview {
  agents: AgentOverview[];
  tasks: { pending: number; running: number; completed: number; failed: number };
  channels: Record<string, string>;
  activity: Array<{ id: string; timestamp: string; agent: string; agent_role: string; action: string; summary: string }>;
}

export interface WorkflowDef {
  id: string; team_id: string; name: string;
  definition: Record<string, unknown>; is_active: boolean;
  created_at: string; updated_at: string | null;
}

export interface ChannelInfo {
  status: string; workspace_name?: string; workspace_id?: string;
  bot_name?: string; phone_number?: string; scopes?: string[];
}
