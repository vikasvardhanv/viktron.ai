import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Download, Shield, Zap, Code2, Megaphone,
  HeartHandshake, BarChart3,
  ChevronRight, Copy, Check, ExternalLink, Globe,
  Lock, Cpu, Terminal, Layout, Users, ShoppingBag,
  X, ArrowRight, Package, CloudUpload, Play,
  Crown, FileText, FlaskConical, ShieldCheck, ClipboardList,
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
  container_port?: number;
}

// ── Agent avatar map — unique icon + gradient per slug ───────────────────────
const AGENT_AVATAR: Record<string, { icon: React.ReactNode; bg: string; ring: string }> = {
  ceo:            { icon: <Crown size={20} />,         bg: 'bg-violet-100', ring: 'border-violet-200 text-violet-600' },
  marketing:      { icon: <Megaphone size={20} />,     bg: 'bg-pink-100',   ring: 'border-pink-200 text-pink-600' },
  developer:      { icon: <Code2 size={20} />,         bg: 'bg-blue-100',   ring: 'border-blue-200 text-blue-600' },
  hermes:         { icon: <Zap size={20} />,           bg: 'bg-green-100',  ring: 'border-green-200 text-green-600' },
  outreach:       { icon: <Users size={20} />,         bg: 'bg-yellow-100', ring: 'border-yellow-200 text-yellow-700' },
  support:        { icon: <HeartHandshake size={20} />,bg: 'bg-teal-100',   ring: 'border-teal-200 text-teal-600' },
  content:        { icon: <FileText size={20} />,      bg: 'bg-orange-100', ring: 'border-orange-200 text-orange-600' },
  research:       { icon: <Search size={20} />,        bg: 'bg-cyan-100',   ring: 'border-cyan-200 text-cyan-700' },
  qa:             { icon: <ShieldCheck size={20} />,   bg: 'bg-indigo-100', ring: 'border-indigo-200 text-indigo-600' },
  'data-analyst': { icon: <BarChart3 size={20} />,     bg: 'bg-emerald-100',ring: 'border-emerald-200 text-emerald-600' },
  'social-autopilot': { icon: <Globe size={20} />,    bg: 'bg-sky-100',    ring: 'border-sky-200 text-sky-700' },
  ecommerce:      { icon: <ShoppingBag size={20} />,   bg: 'bg-amber-100',  ring: 'border-amber-200 text-amber-600' },
  pm:             { icon: <Layout size={20} />,         bg: 'bg-rose-100',   ring: 'border-rose-200 text-rose-600' },
  'form-filler':  { icon: <ClipboardList size={20} />, bg: 'bg-lime-100',   ring: 'border-lime-200 text-lime-700' },
};
const defaultAvatar = { icon: <Cpu size={20} />, bg: 'bg-slate-100', ring: 'border-slate-200 text-slate-500' };

// ── Per-agent console UI labels ───────────────────────────────────────────────
const CONSOLE_UI_LABELS: Record<string, string> = {
  "patient-intake": "🧙 Step-by-step wizard",
  "data-analyst":   "📊 Query dashboard",
  "marketing":      "📣 Campaign builder",
  "prior-auth":     "🧙 Guided workflow",
  "research":       "🔍 Research monitor",
};

// ── Per-agent banner images ───────────────────────────────────────────────────
const AGENT_IMAGES: Record<string, string> = {
  ceo:            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=200',
  marketing:      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=200',
  developer:      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600&h=200',
  hermes:         'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600&h=200',
  outreach:       'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600&h=200',
  support:        'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=600&h=200',
  content:        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=600&h=200',
  research:       'https://images.unsplash.com/photo-1532094349884-543559c5b916?auto=format&fit=crop&q=80&w=600&h=200',
  qa:             'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=600&h=200',
  'data-analyst': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=200',
  'social-autopilot': 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=80&w=600&h=200',
  ecommerce:      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=200',
  pm:             'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600&h=200',
};

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
    docker_image: 'ghcr.io/vikasvardhanv/agent-ceo',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-marketing',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-developer',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-hermes',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-outreach',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-support',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-content',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-research',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-qa',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-data-analyst',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-social-autopilot',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-ecommerce',
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
    docker_image: 'ghcr.io/vikasvardhanv/agent-pm',
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
  {
    slug: 'form-filler',
    display_name: 'Form Filler Agent',
    tagline: 'Fills any form autonomously — PDFs, web forms, and spreadsheets',
    description: 'AI-powered form filling agent with browser automation. Discovers customer data from local files (CSV, JSON, Excel, VCF), maps fields intelligently, and fills PDF, Word, Excel, and web-based forms. Supports batch processing, login-gated forms, and screenshot verification.',
    category: 'data',
    tags: ['forms', 'browser-automation', 'pdf', 'playwright', 'data-entry'],
    docker_image: 'ghcr.io/vikasvardhanv/agent-form-filler',
    docker_tag: 'latest',
    version: '1.0.0',
    llm_provider: 'openai', llm_model: 'gpt-4o',
    capabilities: ['pdf_form_filling', 'web_form_filling', 'data_discovery', 'batch_processing', 'browser_automation'],
    integrations: [
      { name: 'Playwright', logo: 'playwright', optional: false },
      { name: 'OpenAI', logo: 'openai', optional: false },
    ],
    tools_enabled: ['browser', 'file_reader', 'pdf_writer'],
    env_vars_required: [
      { key: 'OPENAI_API_KEY', description: 'LLM access (GPT-4o)', required: true },
      { key: 'ANTHROPIC_API_KEY', description: 'Alternative LLM (Claude)', required: false },
      { key: 'GOOGLE_API_KEY', description: 'Alternative LLM (Gemini)', required: false },
    ],
    is_featured: true, is_open_source: false,
    supports_local: true, supports_hosted: true, supports_cloud_deploy: true,
    hosted_price_usd_month: 49, pulls_count: 0, stars_count: 0,
    container_port: 8000,
  },
];

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  all: { label: 'All Agents', icon: <Layout size={14} />, color: 'text-slate-500' },
  orchestration: { label: 'Orchestration', icon: <Cpu size={14} />, color: 'text-violet-600' },
  marketing: { label: 'Marketing', icon: <Megaphone size={14} />, color: 'text-pink-600' },
  dev: { label: 'Developer', icon: <Code2 size={14} />, color: 'text-blue-600' },
  sales: { label: 'Sales', icon: <Zap size={14} />, color: 'text-yellow-700' },
  support: { label: 'Support', icon: <HeartHandshake size={14} />, color: 'text-green-600' },
  content: { label: 'Content', icon: <FlaskConical size={14} />, color: 'text-orange-600' },
  research: { label: 'Research', icon: <Search size={14} />, color: 'text-cyan-700' },
  data: { label: 'Data', icon: <BarChart3 size={14} />, color: 'text-teal-600' },
  hr: { label: 'HR', icon: <Users size={14} />, color: 'text-rose-600' },
  healthcare: { label: 'Healthcare', icon: <HeartHandshake size={14} />, color: 'text-emerald-600' },
  defense: { label: 'Defense', icon: <Shield size={14} />, color: 'text-slate-600' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function getLocalImageTag(agent: AgentEntry): string {
  return `viktron/${agent.slug}:local`;
}

function getRunImage(agent: AgentEntry): string {
  if (agent.is_open_source) return getLocalImageTag(agent);
  return `${agent.docker_image}:${agent.docker_tag}`;
}

function buildDockerPull(agent: AgentEntry): string {
  const remote = `${agent.docker_image}:${agent.docker_tag}`;
  if (agent.is_open_source && agent.source_repo) {
    const localImage = getLocalImageTag(agent);
    return [
      '# Option A: pull from GHCR (public — no login required)',
      `docker pull ${remote}`,
      '',
      '# Option B: build locally from source',
      `git clone ${agent.source_repo}`,
      `cd ${agent.slug}-agent || cd $(basename ${agent.source_repo} .git)`,
      `docker build -t ${localImage} .`,
    ].join('\n');
  }
  // All Viktron agent images are public on ghcr.io — no auth needed
  return `docker pull ${remote}`;
}

function buildDockerRun(agent: AgentEntry): string {
  const required = agent.env_vars_required.filter(v => v.required);
  const containerPort = agent.container_port ?? 8080;
  const envLines = [
    `  -e AGENT_SLUG=${agent.slug}`,
    ...required.map(v => `  -e ${v.key}="\${${v.key}}"`),
  ].join(' \\\n');
  const image = getRunImage(agent);
  return [
    `docker run -d \\`,
    `  --name ${agent.slug}-agent \\`,
    `  -p 8080:${containerPort} \\`,
    `${envLines} \\`,
    `  ${image}`,
  ].filter(Boolean).join('\n');
}

function buildCompose(agent: AgentEntry): string {
  const required = agent.env_vars_required.filter(v => v.required);
  const containerPort = agent.container_port ?? 8080;
  const envBlock = [
    `      - AGENT_SLUG=${agent.slug}`,
    ...required.map(v => `      - ${v.key}=\${${v.key}}`),
  ].join('\n');
  const image = getRunImage(agent);
  return `version: "3.9"
services:
  ${agent.slug}-agent:
    image: ${image}
    ports:
      - "8080:${containerPort}"
    environment:
${envBlock || '      # No required env vars'}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-sf", "http://localhost:${containerPort}/health"]
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
      className={`flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition-colors ${className}`}
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
          className="relative z-10 w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{agent.display_name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{agent.tagline}</p>
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
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-slate-200 px-6">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-sm border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
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

                {agent.is_open_source && (
                  <p className="mt-3 text-xs text-slate-500">
                    Open-source tip: run the commands in <span className="font-medium">Pull Image</span> first.
                    The <span className="font-medium">Run Locally</span> and <span className="font-medium">Docker Compose</span>
                    commands use the local image tag <code className="font-mono">{getLocalImageTag(agent)}</code>.
                  </p>
                )}

                {agent.slug === 'form-filler' && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-1">Legacy Form Filler UI</p>
                    <p className="text-xs text-slate-500 mb-2">
                      Click to open the old standalone console (forced legacy UI for form-filler).
                    </p>
                    <a
                      href="http://localhost:8080"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Open old form-filler UI
                    </a>
                  </div>
                )}

                <p className="mt-3 text-xs text-slate-500">
                  Runtime note: local containers require <code className="font-mono">AGENT_SLUG={agent.slug}</code>.
                  Viktron injects that automatically for hosted deploys.
                </p>

                {/* Required env vars */}
                {agent.env_vars_required.filter(v => v.required).length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-500 mb-2">Required environment variables</p>
                    <div className="space-y-2">
                      {agent.env_vars_required.filter(v => v.required).map(v => (
                        <div key={v.key} className="flex items-center gap-3 bg-slate-100 rounded-lg px-3 py-2">
                          <code className="text-xs text-yellow-700 font-mono">{v.key}</code>
                          <span className="text-xs text-slate-500">{v.description}</span>
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
                          <code className="text-xs text-slate-600 font-mono">{v.key}</code>
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
                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                      Host {agent.display_name} on Viktron
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
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
                        <p className="text-xs text-slate-500">{rentResult.message}</p>
                        <p className="text-xs text-slate-400">Instance: <code className="text-slate-700 font-mono">{rentResult.instance_id}</code></p>
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
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Lock size={22} className="text-slate-500" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">Sign in to deploy</h3>
                    <p className="text-sm text-slate-600 mb-5">
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
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
                  <div className="flex items-start gap-3">
                    <Shield size={16} className="text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">Privacy & Security</p>
                      <p className="text-xs text-slate-500 mt-0.5">
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const catMeta = CATEGORY_META[agent.category] || CATEGORY_META.all;
  const avatar = AGENT_AVATAR[agent.slug] || defaultAvatar;
  const image = AGENT_IMAGES[agent.slug];

  const handleDeploy = () => {
    if (agent.hosted_price_usd_month !== null && !isAuthenticated) {
      navigate('/login');
      return;
    }
    onDeploy(agent);
  };

  return (
    <motion.div
      className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
    >
      {/* Banner image */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shrink-0">
        {image && (
          <img
            src={image}
            alt={agent.display_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Badge */}
        <div className="absolute top-2.5 right-2.5">
          {agent.is_open_source ? (
            <span className="px-2 py-0.5 bg-green-500/90 backdrop-blur-sm rounded-full text-[10px] text-white font-semibold tracking-wide uppercase">Open Source</span>
          ) : agent.is_featured ? (
            <span className="px-2 py-0.5 bg-blue-600/90 backdrop-blur-sm rounded-full text-[10px] text-white font-semibold tracking-wide uppercase">Featured</span>
          ) : null}
        </div>

        {/* Avatar floated over image */}
        <div className={`absolute bottom-0 left-4 translate-y-1/2 w-11 h-11 rounded-xl ${avatar.bg} border-2 border-white ${avatar.ring} flex items-center justify-center shadow-md`}>
          {avatar.icon}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 pt-8">
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">{agent.display_name}</h3>
          <p className={`text-xs mt-0.5 ${catMeta.color}`}>{catMeta.label}</p>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2 flex-1">
          {agent.tagline}
        </p>

        {CONSOLE_UI_LABELS[agent.slug] && (
          <span style={{
            display: "inline-block",
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
            borderRadius: "6px",
            padding: "2px 8px",
            fontSize: "0.72rem",
            fontWeight: 600,
            marginTop: "4px",
            marginBottom: "8px",
          }}>
            {CONSOLE_UI_LABELS[agent.slug]}
          </span>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] text-slate-600 font-mono">
            {agent.llm_model}
          </span>
          <span className="text-[10px] text-slate-400">v{agent.version}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {agent.capabilities.slice(0, 3).map(cap => (
            <span key={cap} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">
              {cap.replace(/_/g, ' ')}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-400">+{agent.capabilities.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Download size={11} /> {formatCount(agent.pulls_count)}</span>
          <span className="flex items-center gap-1"><Star size={11} /> {formatCount(agent.stars_count)}</span>
          {agent.is_open_source && agent.source_repo && (
            <a href={agent.source_repo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-700 transition-colors ml-auto"
              onClick={e => e.stopPropagation()}>
              <ExternalLink size={10} /> Source
            </a>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div>
            {agent.hosted_price_usd_month === null ? (
              <span className="text-xs text-green-600 font-medium">Free</span>
            ) : (
              <span className="text-xs">
                <span className="text-slate-900 font-semibold">${agent.hosted_price_usd_month}</span>
                <span className="text-slate-400">/mo</span>
              </span>
            )}
          </div>
          <button
            onClick={handleDeploy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
          >
            {agent.hosted_price_usd_month !== null && !isAuthenticated
              ? <><Lock size={12} /> Sign in</>
              : <><ChevronRight size={12} /> Deploy</>}
          </button>
        </div>
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
    registryApi.listAgents().then((data) => {
      setAgents(data as AgentEntry[]);
    }).catch(() => { /* keep inline fallback */ });
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

      <div className="min-h-screen bg-slate-50">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-slate-200 bg-white">
          {/* Background imagery + gradient blobs — matching Landing page */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')" }}
          />
          {/* Gradient mesh */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top-right blue glow */}
            <div className="absolute -top-40 -right-40 w-[900px] h-[900px] bg-blue-200/50 blur-[160px] rounded-full" />
            {/* Bottom-left indigo glow */}
            <div className="absolute -bottom-20 -left-40 w-[700px] h-[700px] bg-indigo-200/40 blur-[140px] rounded-full" />
            {/* Center violet accent */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-100/30 blur-[120px] rounded-full" />
            {/* Top-left teal micro-accent */}
            <div className="absolute top-20 left-16 w-[300px] h-[300px] bg-cyan-100/40 blur-[100px] rounded-full" />
          </div>
          {/* Subtle dot-grid pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-medium mb-6">
                <Globe size={12} />
                rent.viktron.ai
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                Rent a pre-built<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                  AI Agent
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Like a Docker image for AI. Pull an agent, configure your API keys,
                and deploy anywhere — locally, on your cloud, or hosted by Viktron.
              </p>

              {/* Quick stats */}
              <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mb-10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-0.5">{totalAgents}</div>
                  <div>pre-built agents</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-0.5">{formatCount(totalPulls)}</div>
                  <div>total pulls</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-0.5">{openSourceCount}</div>
                  <div>open source</div>
                </div>
              </div>

              {/* How it works */}
              <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-sm shadow-sm">
                <code className="text-green-400 font-mono text-xs">docker pull ghcr.io/vikasvardhanv/agent-marketing</code>
                <CopyButton text="docker pull ghcr.io/vikasvardhanv/agent-marketing" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Filters & Search ─────────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search agents, tools, integrations..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map(cat => {
                const meta = CATEGORY_META[cat];
                const count = cat === 'all' ? agents.length : agents.filter(a => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                  featuredOnly ? 'bg-yellow-50 text-yellow-700 border border-yellow-300' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Star size={11} /> Featured
              </button>
              <button
                onClick={() => setOpenSourceOnly(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  openSourceOnly ? 'bg-green-50 text-green-700 border border-green-300' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              <p className="text-slate-500">No agents match your filters.</p>
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

        {/* ── Governance & Trust Section ───────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-700 p-8 md:p-12">
            <div className="text-center mb-8">
              <span className="inline-block rounded-full bg-sky-500/15 px-4 py-1.5 text-sm font-semibold text-sky-300 tracking-wide mb-4">
                Every Rented Agent Runs Under AgentIRL Governance
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Trust is built in, not bolted on
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                When you rent an agent from the marketplace, it automatically inherits the full AgentIRL trust fabric: delegation tokens, policy gates, and immutable provenance trails.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: <Shield size={18} />,
                  title: 'Delegation Tokens',
                  desc: 'Task-scoped JWT tokens that can only narrow permissions. Revocation cascades to child tokens.',
                },
                {
                  icon: <Lock size={18} />,
                  title: 'Policy Gates',
                  desc: 'Pre-action checks before every tool call, API request, or data write. Denied actions never execute.',
                },
                {
                  icon: <FileText size={18} />,
                  title: 'Provenance Trail',
                  desc: 'Immutable SHA-256 hash chain answering who authorized, what goal, what changed. Tamper-evident.',
                },
                {
                  icon: <ShieldCheck size={18} />,
                  title: 'Trust Scores',
                  desc: 'Dynamic scoring from 0-100. Low-trust agents require approval. High-trust agents earn autonomy.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400 mb-3">
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Cpu size={18} className="text-green-600" />,
                  title: 'Runs in Your VPC',
                  body: 'Deploy agents in your own cloud. No data leaves your environment.',
                },
                {
                  icon: <Lock size={18} className="text-blue-600" />,
                  title: 'Security by Default',
                  body: 'Non-root containers, TLS 1.3, API key auth, rate limiting, and read-only filesystems.',
                },
                {
                  icon: <Globe size={18} className="text-violet-600" />,
                  title: 'Deploy Anywhere',
                  body: 'Local, self-hosted, or managed. Standard Docker — no lock-in.',
                },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 border border-slate-600/50 flex items-center justify-center shrink-0">
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
