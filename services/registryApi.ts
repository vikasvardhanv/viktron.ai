/**
 * registryApi.ts — Client for the Viktron Agent Registry (Python backend).
 *
 * Base URL is controlled by VITE_AGENT_API_URL.
 *   Dev:  http://localhost:8000
 *   Prod: https://api.viktron.ai  (or wherever the Python backend is deployed)
 *
 * Auth: passes the JWT Bearer token stored in localStorage by AuthContext.
 * The Python backend validates it using the same JWT_SECRET as the Node.js backend.
 */

const AGENT_API_BASE =
  (import.meta.env.VITE_AGENT_API_URL as string | undefined) ||
  (import.meta.env.DEV ? 'http://localhost:8000' : '/agent-api');

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${AGENT_API_BASE}${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface RegistryEnvVar {
  key: string;
  description: string;
  required: boolean;
}

export interface RegistryIntegration {
  name: string;
  logo: string;
  optional: boolean;
}

export interface RegistryAgent {
  slug: string;
  display_name: string;
  tagline: string | null;
  description: string;
  category: string;
  tags: string[];
  docker_image: string;
  docker_tag: string;
  version: string;
  llm_provider: string;
  llm_model: string;
  capabilities: string[];
  integrations: RegistryIntegration[];
  tools_enabled: string[];
  env_vars_required: RegistryEnvVar[];
  is_featured: boolean;
  is_open_source: boolean;
  source_repo?: string;
  license?: string;
  supports_local: boolean;
  supports_hosted: boolean;
  supports_cloud_deploy: boolean;
  hosted_price_usd_month: number | null;
  pulls_count: number;
  stars_count: number;
}

export interface DockerCommands {
  pull: string;
  run: string;
  compose: string;
}

export interface RentedInstance {
  instance_id: string;
  slug: string;
  status: string;
  endpoint: string | null;
  message: string;
}

// ── API methods ────────────────────────────────────────────────────────────

export const registryApi = {
  /** List all agents, optionally filtered */
  listAgents(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    open_source?: boolean;
  }): Promise<RegistryAgent[]> {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.search) qs.set('search', params.search);
    if (params?.featured) qs.set('featured', 'true');
    if (params?.open_source) qs.set('open_source', 'true');
    const query = qs.toString();
    return apiFetch<RegistryAgent[]>(`/api/v1/registry/agents${query ? `?${query}` : ''}`);
  },

  /** Get a single agent's full details */
  getAgent(slug: string): Promise<RegistryAgent> {
    return apiFetch<RegistryAgent>(`/api/v1/registry/agents/${slug}`);
  },

  /** Get docker pull/run/compose commands for an agent */
  getDockerCommands(slug: string, port = 8080): Promise<DockerCommands> {
    return apiFetch<DockerCommands>(`/api/v1/registry/agents/${slug}/docker?port=${port}`);
  },

  /** List available categories */
  listCategories(): Promise<string[]> {
    return apiFetch<string[]>('/api/v1/registry/categories');
  },

  /** Provision a hosted agent instance (requires auth) */
  rentAgent(slug: string, envOverrides?: Record<string, string>): Promise<RentedInstance> {
    return apiFetch<RentedInstance>(`/api/v1/registry/agents/${slug}/rent`, {
      method: 'POST',
      body: JSON.stringify({ env_overrides: envOverrides || {} }),
    });
  },
};
