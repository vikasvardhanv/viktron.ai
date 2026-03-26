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

const teamMessageApi = axios.create({ baseURL: AGENT_API });

teamMessageApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY) ?? '';
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface TeamMessageResult {
  success: boolean;
  message: string;
  task_id: string;
  response: string;
}

export const sendTeamTask = async (teamId: string, message: string, channel = 'web') => {
  const response = await teamMessageApi.post<TeamMessageResult>(`/api/teams/${teamId}/message`, {
    message,
    channel,
  });
  return response.data;
};

export const fetchBackendSkills = async () => {
  const response = await teamMessageApi.get<{ skills: Array<Record<string, unknown>>; count: number }>('/api/skills');
  return response.data;
};
