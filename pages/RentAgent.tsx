import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Download, Shield, Zap, Code2, Megaphone,
  HeartHandshake, FlaskConical, BarChart3, Filter,
  ChevronRight, Copy, Check, ExternalLink, Globe,
  Lock, Cpu, Terminal, Layout, Users, ShoppingBag,
  X, ArrowRight, Package, CloudUpload, Play,
} from 'lucide-react';
import { Layout as PageLayout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { registryApi } from '../services/registryApi';

// ── Types ────────────────────────────────────────────────────────────────────

interface EnvVar {
  key: string;
  description: string;
  required: boolean;
}

interface Integration {
  name: string;
  logo: string;
  optional: boolean;
}

interface AgentEntry {
  slug: string;
  display_name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  docker_image: string;
  docker_tag: string;
  version: string;
  llm_provider: string;
  llm_model: string;
  capabilities: string[];
  integrations: Integration[];
  tools_enabled: string[];
  env_vars_required: EnvVar[];
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

// ── Inline catalog (mirrors backend catalog.py) ───────────────────────────────
// In production this is fetched from /api/v1/registry/agents

const AGENTS: AgentEntry[] = [
  {
    slug: 'ceo',
    display_name: 'CEO Agent',
    tagline: 'Your AI chief of staff — plans, delegates, and orchestrates',
    description: 'The orchestrator agent. Breaks complex goals into task DAGs, delegates to specialist agents, monitors progress, and reports back to you.',
    category: 'orchestration',
    tags: ['orchestration', 'planning', 'delegation', 'dag-execution'],
    docker_image: 'ghcr.io/viktron/agent-ceo',
    docker_tag: 'latest',
    version: '2.1.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['task_planning', 'agent_delegation', 'dag_execution', 'self_reflection', 'spawn_agents', 'daily_reports'],
    integrations: [],
    tools_enabled: ['task_dag', 'event_bus', 'tiered_memory'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'GPT-4o access', required: true },
    ],
    is_featured: true, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 49, pulls_count: 1280, stars_count: 94,
  },
  {
    slug: 'marketing',
    display_name: 'Marketing Agent',
    tagline: 'Runs your entire marketing stack — social, ads, SEO, email',
    description: 'Full-stack AI marketing agent. Manages social posting, paid ads (Meta, Google, LinkedIn, TikTok), SEO, email campaigns, and GA4 reporting.',
    category: 'marketing',
    tags: ['social-media', 'seo', 'email-marketing', 'paid-ads', 'analytics'],
    docker_image: 'ghcr.io/viktron/agent-marketing',
    docker_tag: 'latest',
    version: '1.4.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['social_media_scheduling', 'paid_ads_management', 'seo_research', 'email_campaign_management', 'analytics_reporting', 'copywriting'],
    integrations: [
      { name: 'Buffer', logo: 'buffer', optional: true },
      { name: 'Meta Ads', logo: 'meta', optional: true },
      { name: 'Google Ads', logo: 'google', optional: true },
      { name: 'LinkedIn Ads', logo: 'linkedin', optional: true },
      { name: 'HubSpot', logo: 'hubspot', optional: true },
      { name: 'Klaviyo', logo: 'klaviyo', optional: true },
      { name: 'Ahrefs', logo: 'ahrefs', optional: true },
      { name: 'GA4', logo: 'ga4', optional: true },
    ],
    tools_enabled: ['web_search', 'browser', 'image_generation', 'email'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'BUFFER_API_KEY', description: 'Social scheduling', required: false },
      { key: 'META_ADS_TOKEN', description: 'Facebook/Meta Ads', required: false },
      { key: 'HUBSPOT_API_KEY', description: 'CRM & marketing hub', required: false },
      { key: 'KLAVIYO_API_KEY', description: 'Email marketing', required: false },
    ],
    is_featured: true, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 79, pulls_count: 3120, stars_count: 241,
  },
  {
    slug: 'developer',
    display_name: 'Developer Agent',
    tagline: 'Writes, tests, and deploys code end-to-end',
    description: 'Full-stack AI software engineer. Reads requirements, writes code, runs tests, debugs failures, creates PRs, and deploys. Multi-environment: local, Docker, Modal, SSH.',
    category: 'dev',
    tags: ['coding', 'testing', 'deployment', 'git', 'devops'],
    docker_image: 'ghcr.io/viktron/agent-developer',
    docker_tag: 'latest',
    version: '2.0.1',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['code_generation', 'test_writing', 'debugging', 'git_operations', 'docker_build', 'ci_cd'],
    integrations: [
      { name: 'GitHub', logo: 'github', optional: true },
      { name: 'Docker Hub', logo: 'docker', optional: true },
      { name: 'Vercel', logo: 'vercel', optional: true },
    ],
    tools_enabled: ['terminal', 'file_tools', 'browser', 'code_execution', 'git'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'GITHUB_TOKEN', description: 'GitHub API access', required: false },
    ],
    is_featured: true, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 99, pulls_count: 5840, stars_count: 410,
  },
  {
    slug: 'hermes',
    display_name: 'Hermes Agent',
    tagline: 'Open-source multi-environment agent — terminal, browser, vision, code',
    description: 'Powerful open-source agent with terminal, browser, vision, TTS, cron, file ops, and multi-environment execution (local, Docker, Modal, SSH, Singularity).',
    category: 'dev',
    tags: ['open-source', 'terminal', 'browser', 'vision', 'cron', 'multi-environment'],
    docker_image: 'ghcr.io/viktron/agent-hermes',
    docker_tag: 'latest',
    version: '0.9.0',
    llm_provider: 'openrouter', llm_model: 'mistralai/mistral-large',
    capabilities: ['terminal_execution', 'browser_automation', 'vision_tasks', 'tts', 'cron_scheduling', 'mixture_of_agents'],
    integrations: [
      { name: 'OpenRouter', logo: 'openrouter', optional: false },
      { name: 'Modal', logo: 'modal', optional: true },
      { name: 'Docker', logo: 'docker', optional: true },
    ],
    tools_enabled: ['terminal', 'browser', 'vision', 'tts', 'cronjob', 'file_tools', 'memory'],
    env_vars_required: [
      { key: 'OPENROUTER_API_KEY', description: 'LLM routing', required: true },
    ],
    is_featured: true, is_open_source: true,
    source_repo: 'https://github.com/viktron/hermes-agent',
    license: 'MIT',
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: null, pulls_count: 6800, stars_count: 523,
  },
  {
    slug: 'outreach',
    display_name: 'Outreach Agent',
    tagline: 'Automated B2B lead gen & cold outreach that books meetings',
    description: 'AI SDR that sources leads from Apollo.io, crafts personalized cold email sequences, manages LinkedIn outreach, syncs to HubSpot, and books meetings on autopilot.',
    category: 'sales',
    tags: ['lead-generation', 'cold-email', 'linkedin', 'crm', 'pipeline'],
    docker_image: 'ghcr.io/viktron/agent-outreach',
    docker_tag: 'latest',
    version: '1.5.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['lead_sourcing', 'cold_email_sequences', 'linkedin_outreach', 'crm_sync', 'pipeline_reporting'],
    integrations: [
      { name: 'Apollo.io', logo: 'apollo', optional: true },
      { name: 'Instantly', logo: 'instantly', optional: true },
      { name: 'Lemlist', logo: 'lemlist', optional: true },
      { name: 'HubSpot CRM', logo: 'hubspot', optional: true },
    ],
    tools_enabled: ['web_search', 'browser', 'email'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'APOLLO_API_KEY', description: 'Lead database', required: false },
      { key: 'INSTANTLY_API_KEY', description: 'Cold email', required: false },
    ],
    is_featured: true, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 79, pulls_count: 4200, stars_count: 317,
  },
  {
    slug: 'support',
    display_name: 'Support Agent',
    tagline: '24/7 AI customer support — tickets, chat, escalation',
    description: 'AI customer support specialist. Handles tickets and live chat with empathy, uses your knowledge base for accurate answers, escalates to humans via Slack.',
    category: 'support',
    tags: ['customer-support', 'live-chat', 'ticketing', 'knowledge-base'],
    docker_image: 'ghcr.io/viktron/agent-support',
    docker_tag: 'latest',
    version: '1.3.0',
    llm_provider: 'openai', llm_model: 'gpt-4o-mini',
    capabilities: ['ticket_management', 'rag_knowledge_base', 'escalation_routing', 'weekly_reports'],
    integrations: [
      { name: 'Intercom', logo: 'intercom', optional: true },
      { name: 'Zendesk', logo: 'zendesk', optional: true },
      { name: 'Slack', logo: 'slack', optional: true },
    ],
    tools_enabled: ['web_search', 'tiered_memory'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'INTERCOM_ACCESS_TOKEN', description: 'Live chat', required: false },
    ],
    is_featured: false, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 39, pulls_count: 2880, stars_count: 205,
  },
  {
    slug: 'content',
    display_name: 'Content Agent',
    tagline: 'Blog posts, scripts, newsletters — published automatically',
    description: 'AI content strategist. Writes SEO-optimized blog posts, social copy, video scripts, and newsletters. Publishes directly to WordPress, Webflow, or Beehiiv.',
    category: 'content',
    tags: ['blogging', 'seo-content', 'video-scripts', 'newsletters'],
    docker_image: 'ghcr.io/viktron/agent-content',
    docker_tag: 'latest',
    version: '1.2.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['blog_writing', 'seo_copywriting', 'video_scripting', 'newsletter_creation', 'wordpress_publishing'],
    integrations: [
      { name: 'WordPress', logo: 'wordpress', optional: true },
      { name: 'Webflow', logo: 'webflow', optional: true },
      { name: 'Beehiiv', logo: 'beehiiv', optional: true },
    ],
    tools_enabled: ['web_search', 'browser', 'image_generation'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'WORDPRESS_URL', description: 'WordPress site URL', required: false },
    ],
    is_featured: false, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 49, pulls_count: 1740, stars_count: 159,
  },
  {
    slug: 'research',
    display_name: 'Research Agent',
    tagline: 'Deep-dive market research & competitive intel on demand',
    description: 'AI research analyst with web search, browser automation, and structured data extraction. Produces cited reports on markets, competitors, and companies.',
    category: 'research',
    tags: ['market-research', 'competitive-intel', 'web-scraping', 'reports'],
    docker_image: 'ghcr.io/viktron/agent-research',
    docker_tag: 'latest',
    version: '1.0.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['web_research', 'competitive_analysis', 'data_extraction', 'report_generation'],
    integrations: [
      { name: 'Serper (Google Search)', logo: 'google', optional: true },
      { name: 'Firecrawl', logo: 'firecrawl', optional: true },
    ],
    tools_enabled: ['web_search', 'browser', 'file_tools'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'SERPER_API_KEY', description: 'Google Search API', required: false },
    ],
    is_featured: false, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 39, pulls_count: 980, stars_count: 88,
  },
  {
    slug: 'qa',
    display_name: 'QA Agent',
    tagline: 'Automated testing — unit, integration, E2E, regression',
    description: 'AI QA engineer that writes and runs test suites, generates test cases from requirements, executes regression runs, and files bug reports. Integrates with GitHub Actions.',
    category: 'dev',
    tags: ['testing', 'qa', 'automation', 'ci-cd', 'regression'],
    docker_image: 'ghcr.io/viktron/agent-qa',
    docker_tag: 'latest',
    version: '1.2.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['unit_test_generation', 'e2e_testing', 'regression_testing', 'ci_integration'],
    integrations: [
      { name: 'GitHub Actions', logo: 'github', optional: true },
      { name: 'Playwright', logo: 'playwright', optional: false },
    ],
    tools_enabled: ['terminal', 'file_tools', 'code_execution', 'browser'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
    ],
    is_featured: false, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 49, pulls_count: 2100, stars_count: 178,
  },
  {
    slug: 'data-analyst',
    display_name: 'Data Analyst Agent',
    tagline: 'Turns raw data into insights — SQL, Python, dashboards',
    description: 'AI data analyst that connects to your databases, runs SQL queries, generates Python analysis, creates charts, and produces clear business insight reports.',
    category: 'data',
    tags: ['data-analysis', 'sql', 'python', 'dashboards', 'reporting'],
    docker_image: 'ghcr.io/viktron/agent-data-analyst',
    docker_tag: 'latest',
    version: '1.1.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['sql_queries', 'python_analysis', 'chart_generation', 'insight_reports'],
    integrations: [
      { name: 'PostgreSQL', logo: 'postgres', optional: true },
      { name: 'BigQuery', logo: 'bigquery', optional: true },
      { name: 'PostHog', logo: 'posthog', optional: true },
    ],
    tools_enabled: ['code_execution', 'file_tools', 'terminal'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'DATABASE_URL', description: 'PostgreSQL connection string', required: false },
    ],
    is_featured: false, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 69, pulls_count: 1320, stars_count: 112,
  },
  {
    slug: 'social-autopilot',
    display_name: 'Social Autopilot Agent',
    tagline: 'Fully autonomous social media — post, engage, grow',
    description: 'Open-source social media automation agent. Schedules and posts to Twitter/X, LinkedIn, Instagram, TikTok. Engages with mentions, tracks growth metrics.',
    category: 'marketing',
    tags: ['social-media', 'twitter', 'linkedin', 'instagram', 'tiktok', 'open-source'],
    docker_image: 'ghcr.io/viktron/agent-social-autopilot',
    docker_tag: 'latest',
    version: '1.0.0',
    llm_provider: 'openai', llm_model: 'gpt-4o-mini',
    capabilities: ['social_posting', 'comment_engagement', 'growth_tracking', 'trend_monitoring'],
    integrations: [
      { name: 'Buffer', logo: 'buffer', optional: false },
      { name: 'Twitter/X API', logo: 'twitter', optional: true },
    ],
    tools_enabled: ['browser', 'image_generation', 'web_search'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'BUFFER_API_KEY', description: 'Multi-platform posting', required: false },
    ],
    is_featured: false, is_open_source: true,
    source_repo: 'https://github.com/viktron/social-autopilot-agent',
    license: 'MIT',
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: null, pulls_count: 3600, stars_count: 289,
  },
  {
    slug: 'ecommerce',
    display_name: 'E-Commerce Agent',
    tagline: 'Manages your Shopify store — inventory, pricing, promotions',
    description: 'AI e-commerce ops agent. Monitors Shopify inventory, adjusts pricing dynamically, creates discount campaigns, manages listings, and runs abandoned cart recovery flows.',
    category: 'sales',
    tags: ['shopify', 'ecommerce', 'inventory', 'pricing', 'abandoned-cart'],
    docker_image: 'ghcr.io/viktron/agent-ecommerce',
    docker_tag: 'latest',
    version: '1.0.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['inventory_management', 'dynamic_pricing', 'discount_campaigns', 'abandoned_cart_recovery'],
    integrations: [
      { name: 'Shopify', logo: 'shopify', optional: false },
      { name: 'Klaviyo', logo: 'klaviyo', optional: true },
      { name: 'Stripe', logo: 'stripe', optional: true },
    ],
    tools_enabled: ['browser', 'web_search', 'email'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'SHOPIFY_STORE_URL', description: 'Your Shopify store', required: true },
      { key: 'SHOPIFY_ADMIN_API_TOKEN', description: 'Shopify admin access', required: true },
    ],
    is_featured: false, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 69, pulls_count: 2100, stars_count: 167,
  },
  {
    slug: 'pm',
    display_name: 'PM Agent',
    tagline: 'Turns chaos into roadmaps — sprint planning, tickets, status',
    description: 'AI product manager that creates and manages project backlogs, breaks epics into user stories, assigns work to agents, tracks progress, and sends status updates.',
    category: 'orchestration',
    tags: ['project-management', 'sprint-planning', 'roadmap', 'tickets'],
    docker_image: 'ghcr.io/viktron/agent-pm',
    docker_tag: 'latest',
    version: '1.1.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['backlog_management', 'sprint_planning', 'ticket_creation', 'progress_tracking'],
    integrations: [
      { name: 'Linear', logo: 'linear', optional: true },
      { name: 'Notion', logo: 'notion', optional: true },
      { name: 'Slack', logo: 'slack', optional: true },
    ],
    tools_enabled: ['task_dag', 'event_bus', 'tiered_memory'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access', required: true },
      { key: 'LINEAR_API_KEY', description: 'Issue tracking', required: false },
    ],
    is_featured: false, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 49, pulls_count: 1560, stars_count: 132,
  },
];

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  all: { label: 'All Agents', icon: <Layout size={14} />, color: 'text-slate-400' },
  orchestration: { label: 'Orchestration', icon: <Cpu size={14} />, color: 'text-violet-400' },
  marketing: { label: 'Marketing', icon: <Megaphone size={14} />, color: 'text-pink-400' },
  dev: { label: 'Developer', icon: <Code2 size={14} />, color: 'text-blue-400' },
  sales: { label: 'Sales', icon: <Zap size={14} />, color: 'text-yellow-400' },
  support: { label: 'Support', icon: <HeartHandshake size={14} />, color: 'text-green-400' },
  content: { label: 'Content', icon: <FlaskConical size={14} />, color: 'text-orange-400' },
  research: { label: 'Research', icon: <Search size={14} />, color: 'text-cyan-400' },
  data: { label: 'Data', icon: <BarChart3 size={14} />, color: 'text-teal-400' },
  hr: { label: 'HR', icon: <Users size={14} />, color: 'text-rose-400' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function buildDockerPull(agent: AgentEntry): string {
  return `docker pull ${agent.docker_image}:${agent.docker_tag}`;
}

function buildDockerRun(agent: AgentEntry): string {
  const required = agent.env_vars_required.filter(v => v.required);
  const envLines = required.map(v => `  -e ${v.key}="\${${v.key}}"`).join(' \\\n');
  return [
    `docker run -d \\`,
    `  --name ${agent.slug}-agent \\`,
    `  -p 8080:8080 \\`,
    envLines ? envLines + ' \\' : null,
    `  ${agent.docker_image}:${agent.docker_tag}`,
  ].filter(Boolean).join('\n');
}

function buildCompose(agent: AgentEntry): string {
  const required = agent.env_vars_required.filter(v => v.required);
  const envBlock = required.map(v => `      - ${v.key}=\${${v.key}}`).join('\n');
  return `version: "3.9"
services:
  ${agent.slug}-agent:
    image: ${agent.docker_image}:${agent.docker_tag}
    ports:
      - "8080:8080"
    environment:
${envBlock || '      # No required env vars'}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-sf", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3`;
}

// ── CopyButton ────────────────────────────────────────────────────────────────

const CopyButton: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors ${className}`}
      title="Copy"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

// ── Deploy Modal ──────────────────────────────────────────────────────────────

type DeployTab = 'pull' | 'run' | 'compose' | 'host';

const DeployModal: React.FC<{ agent: AgentEntry; onClose: () => void }> = ({ agent, onClose }) => {
  const [tab, setTab] = useState<DeployTab>('pull');
  const { isAuthenticated } = useAuth();
  const [renting, setRenting] = useState(false);
  const [rentResult, setRentResult] = useState<{ instance_id: string; endpoint: string | null; message: string } | null>(null);
  const [rentError, setRentError] = useState<string | null>(null);

  const handleRent = async () => {
    setRenting(true);
    setRentError(null);
    try {
      const result = await registryApi.rentAgent(agent.slug);
      setRentResult(result);
    } catch (err) {
      setRentError(err instanceof Error ? err.message : 'Failed to provision agent');
    } finally {
      setRenting(false);
    }
  };

  const tabs: { id: DeployTab; label: string; icon: React.ReactNode }[] = [
    { id: 'pull', label: 'Pull Image', icon: <Download size={13} /> },
    { id: 'run', label: 'Run Locally', icon: <Terminal size={13} /> },
    { id: 'compose', label: 'Docker Compose', icon: <Package size={13} /> },
    { id: 'host', label: 'Host on Viktron', icon: <CloudUpload size={13} /> },
  ];

  const codeMap: Record<DeployTab, string> = {
    pull: buildDockerPull(agent),
    run: buildDockerRun(agent),
    compose: buildCompose(agent),
    host: '',
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-lg font-semibold text-white">{agent.display_name}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{agent.tagline}</p>
            </div>
            <div className="flex items-center gap-3">
              {agent.hosted_price_usd_month === null ? (
                <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-400 font-medium">
                  Free / Open Source
                </span>
              ) : (
                <span className="px-2 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs text-primary font-medium">
                  ${agent.hosted_price_usd_month}/mo hosted
                </span>
              )}
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-slate-700 px-6">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-sm border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {tab !== 'host' ? (
              <div>
                <div className="relative">
                  <pre className="bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                    {codeMap[tab]}
                  </pre>
                  <div className="absolute top-3 right-3">
                    <CopyButton text={codeMap[tab]} />
                  </div>
                </div>

                {/* Required env vars */}
                {agent.env_vars_required.filter(v => v.required).length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-400 mb-2">Required environment variables</p>
                    <div className="space-y-2">
                      {agent.env_vars_required.filter(v => v.required).map(v => (
                        <div key={v.key} className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2">
                          <code className="text-xs text-yellow-300 font-mono">{v.key}</code>
                          <span className="text-xs text-slate-400">{v.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional env vars */}
                {agent.env_vars_required.filter(v => !v.required).length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-500 mb-2">Optional environment variables</p>
                    <div className="space-y-1">
                      {agent.env_vars_required.filter(v => !v.required).map(v => (
                        <div key={v.key} className="flex items-center gap-3 px-3 py-1.5">
                          <code className="text-xs text-slate-400 font-mono">{v.key}</code>
                          <span className="text-xs text-slate-500">{v.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Host on Viktron tab */
              <div className="text-center py-4">
                {isAuthenticated ? (
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                      <CloudUpload size={24} className="text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">
                      Host {agent.display_name} on Viktron
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
                      We provision, manage, and monitor the agent for you.
                      {agent.hosted_price_usd_month
                        ? ` $${agent.hosted_price_usd_month}/month — cancel anytime.`
                        : ' Free — open-source agent.'}
                    </p>
                    {rentResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 justify-center text-green-400">
                          <Check size={16} />
                          <span className="text-sm font-medium">Agent deployed!</span>
                        </div>
                        {rentResult.endpoint && (
                          <a
                            href={rentResult.endpoint}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink size={13} /> {rentResult.endpoint}
                          </a>
                        )}
                        <p className="text-xs text-slate-400">{rentResult.message}</p>
                        <p className="text-xs text-slate-500">Instance: <code className="text-slate-300 font-mono">{rentResult.instance_id}</code></p>
                      </div>
                    ) : (
                      <>
                        {rentError && (
                          <p className="text-sm text-red-400 mb-3">{rentError}</p>
                        )}
                        <button
                          className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 mx-auto"
                          onClick={handleRent}
                          disabled={renting}
                        >
                          {renting ? (
                            <><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" /> Provisioning…</>
                          ) : (
                            <><Play size={14} /> Deploy Now
                            {agent.hosted_price_usd_month ? ` — $${agent.hosted_price_usd_month}/mo` : ' — Free'}</>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                      <Lock size={22} className="text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">Sign in to deploy</h3>
                    <p className="text-sm text-slate-400 mb-5">
                      Create a free Viktron account to deploy hosted agents.
                    </p>
                    <a
                      href="/auth"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      Sign In <ArrowRight size={14} />
                    </a>
                  </div>
                )}

                {/* Security callout */}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-left">
                  <div className="flex items-start gap-3">
                    <Shield size={16} className="text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">Privacy & Security</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Each agent runs in an isolated container. Your API keys are stored encrypted
                        and never logged. Traffic runs over TLS 1.3. SOC 2 Type II in progress.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── AgentCard ─────────────────────────────────────────────────────────────────

const AgentCard: React.FC<{ agent: AgentEntry; onDeploy: (agent: AgentEntry) => void }> = ({
  agent,
  onDeploy,
}) => {
  const catMeta = CATEGORY_META[agent.category] || CATEGORY_META.all;

  return (
    <motion.div
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all duration-300 flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Featured badge */}
      {agent.is_featured && (
        <div className="absolute top-4 right-4 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-semibold tracking-wide uppercase">
          Featured
        </div>
      )}

      {/* Open-source badge */}
      {agent.is_open_source && (
        <div className="absolute top-4 right-4 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-semibold tracking-wide uppercase">
          Open Source
        </div>
      )}

      {/* Agent icon & title */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
          <span className={catMeta.color}>{catMeta.icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white leading-tight">{agent.display_name}</h3>
          <p className={`text-xs mt-0.5 ${catMeta.color}`}>{catMeta.label}</p>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2 flex-1">
        {agent.tagline}
      </p>

      {/* LLM badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-400 font-mono">
          {agent.llm_model}
        </span>
        <span className="text-[10px] text-slate-500">v{agent.version}</span>
      </div>

      {/* Capabilities chips */}
      <div className="flex flex-wrap gap-1 mb-4">
        {agent.capabilities.slice(0, 3).map(cap => (
          <span key={cap} className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400">
            {cap.replace(/_/g, ' ')}
          </span>
        ))}
        {agent.capabilities.length > 3 && (
          <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
            +{agent.capabilities.length - 3} more
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Download size={11} /> {formatCount(agent.pulls_count)}
        </span>
        <span className="flex items-center gap-1">
          <Star size={11} /> {formatCount(agent.stars_count)}
        </span>
        {agent.is_open_source && agent.source_repo && (
          <a
            href={agent.source_repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-slate-300 transition-colors ml-auto"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={10} /> Source
          </a>
        )}
      </div>

      {/* Pricing + Deploy */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div>
          {agent.hosted_price_usd_month === null ? (
            <span className="text-xs text-green-400 font-medium">Free</span>
          ) : (
            <span className="text-xs text-slate-300">
              <span className="text-white font-semibold">${agent.hosted_price_usd_month}</span>
              <span className="text-slate-500">/mo hosted</span>
            </span>
          )}
        </div>
        <button
          onClick={() => onDeploy(agent)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 hover:border-primary rounded-lg text-xs font-medium transition-all duration-200"
        >
          <ChevronRight size={12} /> Deploy
        </button>
      </div>
    </motion.div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export const RentAgent: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [deployAgent, setDeployAgent] = useState<AgentEntry | null>(null);
  // Live catalog — falls back to the inline AGENTS constant if the API is unreachable
  const [agents, setAgents] = useState<AgentEntry[]>(AGENTS);

  useEffect(() => {
    registryApi.listAgents().then(setAgents).catch(() => { /* keep inline fallback */ });
  }, []);

  const categories = useMemo(() => {
    const cats = ['all', ...Array.from(new Set(agents.map(a => a.category))).sort()];
    return cats;
  }, [agents]);

  const filtered = useMemo(() => {
    let items = [...agents];
    if (category !== 'all') items = items.filter(a => a.category === category);
    if (featuredOnly) items = items.filter(a => a.is_featured);
    if (openSourceOnly) items = items.filter(a => a.is_open_source);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        a =>
          a.slug.includes(q) ||
          a.display_name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some(t => t.includes(q)) ||
          a.capabilities.some(c => c.includes(q)),
      );
    }
    return items;
  }, [agents, category, search, featuredOnly, openSourceOnly]);

  const totalPulls = useMemo(() => agents.reduce((s, a) => s + a.pulls_count, 0), [agents]);
  const totalAgents = agents.length;
  const openSourceCount = agents.filter(a => a.is_open_source).length;

  return (
    <PageLayout showBackground={false}>
      <SEO
        title="Rent an Agent — Viktron AI Agent Marketplace"
        description="Pre-built AI agents you can deploy in minutes. Pull as a Docker image, run locally, or host on Viktron. Marketing, Dev, Sales, Support, Research, and more."
      />

      {deployAgent && (
        <DeployModal agent={deployAgent} onClose={() => setDeployAgent(null)} />
      )}

      <div className="min-h-screen bg-slate-950">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-slate-800">
          {/* Subtle gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-medium mb-6">
                <Globe size={12} />
                app.rent.viktron.ai
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
                Rent a pre-built<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
                  AI Agent
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Like a Docker image for AI. Pull an agent, configure your API keys,
                and deploy anywhere — locally, on your cloud, or hosted by Viktron.
              </p>

              {/* Quick stats */}
              <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mb-10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-0.5">{totalAgents}</div>
                  <div>pre-built agents</div>
                </div>
                <div className="w-px h-8 bg-slate-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-0.5">{formatCount(totalPulls)}</div>
                  <div>total pulls</div>
                </div>
                <div className="w-px h-8 bg-slate-700" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-0.5">{openSourceCount}</div>
                  <div>open source</div>
                </div>
              </div>

              {/* How it works */}
              <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-sm text-slate-400">
                <code className="text-green-400 font-mono text-xs">docker pull ghcr.io/viktron/agent-marketing</code>
                <CopyButton text="docker pull ghcr.io/viktron/agent-marketing" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Filters & Search ─────────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search agents, tools, integrations..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map(cat => {
                const meta = CATEGORY_META[cat];
                const count = cat === 'all' ? AGENTS.length : AGENTS.filter(a => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-primary text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {meta?.icon}
                    {meta?.label || cat}
                    <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Toggle filters */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setFeaturedOnly(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  featuredOnly ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Star size={11} /> Featured
              </button>
              <button
                onClick={() => setOpenSourceOnly(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  openSourceOnly ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Code2 size={11} /> Open Source
              </button>
            </div>
          </div>
        </div>

        {/* ── Agent Grid ───────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🤖</div>
              <p className="text-slate-400">No agents match your filters.</p>
              <button
                onClick={() => { setSearch(''); setCategory('all'); setFeaturedOnly(false); setOpenSourceOnly(false); }}
                className="mt-3 text-primary text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-6">
                Showing {filtered.length} of {totalAgents} agents
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((agent, i) => (
                  <motion.div
                    key={agent.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <AgentCard agent={agent} onDeploy={setDeployAgent} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Trust / Security Footer Banner ───────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Shield size={20} className="text-green-400" />,
                  title: 'Privacy First',
                  body: 'Each agent runs in an isolated Docker container. Your keys stay yours — stored encrypted, never logged.',
                },
                {
                  icon: <Lock size={20} className="text-blue-400" />,
                  title: 'Security by Default',
                  body: 'Non-root containers, read-only filesystems, TLS 1.3, API key auth, and rate limiting out of the box.',
                },
                {
                  icon: <Globe size={20} className="text-violet-400" />,
                  title: 'Deploy Anywhere',
                  body: 'Run on your laptop, self-host on any cloud, or let Viktron manage it. Standard Docker — no lock-in.',
                },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RentAgent;
