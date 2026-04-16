/**
 * Onboarding service — handles enterprise team provisioning
 */

import { getAuthToken } from '../context/AuthContext';

const toApiBase = (value?: string) => {
  if (!value) return '/api';
  const trimmed = String(value).trim().replace(/\/$/, '');
  if (!trimmed) return '/api';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return toApiBase(import.meta.env.VITE_API_URL);
  }

  const host = window.location.hostname.replace(/^www\./, '');
  if (/localhost|127\.0\.0\.1/.test(host)) {
    return toApiBase(import.meta.env.VITE_API_URL);
  }

  if (host === 'viktron.ai' || host.endsWith('.viktron.ai')) {
    return 'https://api.viktron.ai/api';
  }

  return toApiBase(import.meta.env.VITE_API_URL);
};

export interface OnboardingRequest {
  tier: 'starter' | 'growth' | 'enterprise' | 'custom';
  company_name: string;
  company_size: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  use_cases?: string[];
  intake_data?: Record<string, any>;
  channels?: string[];
  llm_provider?: string;
  llm_api_key?: string;
  llm_gateway_mode?: string;
  langflow?: Record<string, any>;
}

export interface OnboardingResponse {
  onboarding_id: string;
  team_id: string;
  tier: string;
  status: string;
  provisioned_agents: string[];
  message: string;
}

export interface TierCatalogResponse {
  tiers: Array<{
    tier: string;
    agents: string[];
    pricing: Record<string, any>;
    description: string;
  }>;
}

export const onboardingService = {
  /**
   * Get available tiers and agent rosters
   */
  async getTierCatalog(): Promise<TierCatalogResponse> {
    const token = getAuthToken();
    const apiBase = getApiBaseUrl();

    const response = await fetch(`${apiBase}/onboard/tiers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tier catalog: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Validate onboarding data without provisioning
   */
  async validateOnboarding(data: OnboardingRequest): Promise<{ ready: boolean; issues: any[]; recommendations: string[] }> {
    const apiBase = getApiBaseUrl();

    const response = await fetch(`${apiBase}/onboard/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Validation failed: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create onboarding and provision team
   */
  async createOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
    const token = getAuthToken();
    const apiBase = getApiBaseUrl();

    if (!token) {
      throw new Error('No authentication token found. Please sign in first.');
    }

    const response = await fetch(`${apiBase}/onboard/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.detail || error.message || `Provisioning failed: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get onboarding status
   */
  async getOnboardingStatus(onboarding_id: string): Promise<OnboardingResponse> {
    const token = getAuthToken();
    const apiBase = getApiBaseUrl();

    if (!token) {
      throw new Error('No authentication token found.');
    }

    const response = await fetch(`${apiBase}/onboard/${onboarding_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Check team readiness for production
   */
  async checkReadiness(onboarding_id: string): Promise<{
    onboarding_id: string;
    team_id: string;
    ready: boolean;
    score: number;
    max_score: number;
    checks: Array<{ key: string; ok: boolean; message: string }>;
  }> {
    const token = getAuthToken();
    const apiBase = getApiBaseUrl();

    if (!token) {
      throw new Error('No authentication token found.');
    }

    const response = await fetch(`${apiBase}/onboard/${onboarding_id}/readiness`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check readiness: ${response.statusText}`);
    }

    return response.json();
  },
};
