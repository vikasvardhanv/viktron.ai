# Open Source & AI Resources for AgentIRL

A curated list of every open-source framework, tool, model, and resource we use or reference for building AgentIRL — the AI Team as a Service platform.

---

## Table of Contents

- [Agent Kernel / Runtime](#agent-kernel--runtime)
- [Multi-Agent Frameworks](#multi-agent-frameworks)
- [Platform SDKs (Big Three)](#platform-sdks-big-three)
- [Self-Improving Agents / Research](#self-improving-agents--research)
- [Multi-Agent "Company" Simulations](#multi-agent-company-simulations)
- [Personal AI Assistants](#personal-ai-assistants)
- [Open Source Models (Run Locally)](#open-source-models-run-locally)
- [MCP Servers & Tool Integration](#mcp-servers--tool-integration)
- [Browser Automation for Agents](#browser-automation-for-agents)
- [AI Coding Agents](#ai-coding-agents)
- [Observability & Monitoring](#observability--monitoring)
- [Voice & Speech](#voice--speech)
- [Learning Resources & Reference](#learning-resources--reference)
- [Agent Directories & Lists](#agent-directories--lists)
- [How We Use Each Tool](#how-we-use-each-tool)

---

## Agent Kernel / Runtime

The lightweight core that hosts and runs our agents.

| Project | Stars | Description | License | Link |
|---------|-------|-------------|---------|------|
| **Nanobot** | 18.5k | Ultra-lightweight OpenClaw. 3,500 lines of core code. 0.8s startup, 45MB RAM. Multi-channel (Telegram, Discord, WhatsApp, Slack, Email, QQ). Multi-LLM (Claude, GPT, DeepSeek, Qwen, local via vLLM/Ollama). Our primary agent kernel. | MIT | [github.com/HKUDS/nanobot](https://github.com/HKUDS/nanobot) |

---

## Multi-Agent Frameworks

The frameworks we use to define agent roles, workflows, and coordination.

| Project | Stars | What It Does | We Use It For | License | Link |
|---------|-------|-------------|---------------|---------|------|
| **CrewAI** | 44.1k | Role-based multi-agent orchestration. Define agents with roles/goals/backstories. Most intuitive for non-engineers. | Simple role agents: Sales Agent, Content Agent, Research Agent. Best "job description" model. | MIT | [github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| **LangGraph** | 24.7k | Stateful agent workflows as directed graphs. Durable execution, survives failures. Most production-ready framework. Used by Klarna, Replit, Elastic. | Complex multi-step workflows: Support Agent (read → search KB → draft → send/escalate), Finance Agent. | MIT | [github.com/langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) |
| **CAMEL** | 16k | Multi-agent communication & role-playing. Research framework for agent scaling laws. Claims scalability to 1M agents. | Agent-to-agent coordination. CEO Agent managing and communicating with all other agents. | Apache 2.0 | [github.com/camel-ai/camel](https://github.com/camel-ai/camel) |
| **AutoGen** | 54.5k | Microsoft's multi-agent conversation framework. Strong human-in-the-loop. AutoGen Studio GUI. | Reference architecture for agent conversations. CEO Agent discussion patterns. Note: Microsoft steering toward their own Agent Framework — use cautiously. | MIT | [github.com/microsoft/autogen](https://github.com/microsoft/autogen) |
| **Semantic Kernel** | 27.2k | Microsoft's enterprise SDK. Multi-language (Python, .NET, Java). Plugin ecosystem. MCP support. | Reference for enterprise patterns. Useful if targeting .NET enterprise shops. | MIT | [github.com/microsoft/semantic-kernel](https://github.com/microsoft/semantic-kernel) |
| **LlamaIndex** | 47k | Data framework for LLM apps. 300+ data connectors. Best-in-class RAG. | Knowledge base / FAQ search inside Support Agent. Use as a tool provider, not as agent framework. | MIT | [github.com/run-llama/llama_index](https://github.com/run-llama/llama_index) |
| **Haystack** | 20k+ | Production-ready RAG and AI pipelines. Modular. | Alternative to LlamaIndex for document retrieval pipelines. | Apache 2.0 | [github.com/deepset-ai/haystack](https://github.com/deepset-ai/haystack) |

---

## Platform SDKs (Big Three)

Official agent SDKs from the major AI providers.

| Project | Stars | What It Does | We Use It For | License | Link |
|---------|-------|-------------|---------------|---------|------|
| **OpenAI Agents SDK** | 18.9k | Lightweight multi-agent framework. Handoffs between agents, guardrails (input/output validation), sessions, tracing. Works with 100+ models. | When using GPT models. Clean handoff pattern for agent-to-agent work passing. Guardrails for safety. | MIT | [github.com/openai/openai-agents-python](https://github.com/openai/openai-agents-python) |
| **Google ADK** | 17.6k | Code-first agent framework. Hierarchical multi-agent. Built-in dev UI. MCP tool support. Deploys to Cloud Run / Vertex AI. | When using Gemini models (we already use Gemini). MCP integration. Built-in testing UI. | Apache 2.0 | [github.com/google/adk-python](https://github.com/google/adk-python) |
| **Anthropic MCP** | 7.2k | Model Context Protocol — universal standard for connecting AI models to tools. "USB-C for AI tools." | ALL integrations built as MCP servers. Future-proof. Works with Claude, Cursor, LangGraph, Google ADK, and growing ecosystem. | MIT | [github.com/modelcontextprotocol/specification](https://github.com/modelcontextprotocol/specification) |

---

## Self-Improving Agents / Research

Making agents that get better over time without manual prompt tuning.

| Project | Stars | What It Does | We Use It For | License | Link |
|---------|-------|-------------|---------------|---------|------|
| **ADAS** | ICLR 2025 | Automated Design of Agentic Systems. Meta Agent Search algorithm — agents design better agents. Iteratively creates, evaluates, and improves agent architectures in code space. | Background optimizer. Runs weekly. Analyzes which agent responses led to good outcomes. Generates improved agent configs. A/B tests and promotes winners. **Our competitive moat.** | MIT | [github.com/ShengranHu/ADAS](https://github.com/ShengranHu/ADAS) |

**Research paper:** [arxiv.org/abs/2408.08435](https://arxiv.org/abs/2408.08435)

---

## Multi-Agent "Company" Simulations

Projects that simulate organizations with AI agents in different roles. We study these for architecture patterns.

| Project | Stars | What It Does | What We Learn | License | Link |
|---------|-------|-------------|---------------|---------|------|
| **MetaGPT** | 64.2k | Simulates a software company. Agents play PM, Architect, Engineer roles. SOP-driven design. | SOP (Standard Operating Procedure) pattern — agents follow defined procedures, not just prompts. Role hierarchy design. | MIT | [github.com/geekan/MetaGPT](https://github.com/geekan/MetaGPT) |
| **ChatDev 2.0** | 31k | Zero-code multi-agent platform. Visual workflow canvas. Templates for games, data viz, 3D, research. | No-code visual canvas concept. Pre-built workflow templates. Multi-agent orchestration UX. | Apache 2.0 | [github.com/OpenBMB/ChatDev](https://github.com/OpenBMB/ChatDev) |
| **Eigent** | 12.4k | Desktop AI workforce. Built on CAMEL. Developer, Browser, Document, Multi-Modal agents working in parallel. MCP integration. Human-in-the-loop. | **Closest to our vision.** Study their parallel agent execution, MCP tool integration, and workforce UX. Desktop-focused (we're cloud SaaS). | Apache 2.0 | [github.com/eigent-ai/eigent](https://github.com/eigent-ai/eigent) |
| **AgentVerse** | 4.9k | Multi-agent deployment and simulation. Task-solving and behavior observation modes. NVIDIA featured. | Academic research on multi-agent behavior patterns. | Apache 2.0 | [github.com/OpenBMB/AgentVerse](https://github.com/OpenBMB/AgentVerse) |

---

## Personal AI Assistants

Products for individual use — we study their architecture for the business version.

| Project | Stars | What It Does | What We Learn | License | Link |
|---------|-------|-------------|---------------|---------|------|
| **OpenClaw** | 150k+ | The original personal AI assistant. Self-hosted. Multi-channel (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams). WebSocket Gateway architecture. Browser control. Voice via ElevenLabs. | **Gateway architecture** — how to route messages across channels. Multi-channel inbox pattern. Too heavy to embed (430k lines) but the design is excellent. | AGPL-3.0 | [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) |
| **BabyAGI** | 22.1k | Self-building autonomous agent experiment. Function management system. Historical significance — sparked the agent framework wave. | Historical reference only. Not production-ready. Creator says "not meant for production use." | MIT | [github.com/yoheinakajima/babyagi](https://github.com/yoheinakajima/babyagi) |
| **SuperAGI** | 17.2k | Autonomous agent platform with GUI and marketplace. | Marketplace concept for agent tools. Development has slowed — commercial pivot. | MIT | [github.com/TransformerOptimus/SuperAGI](https://github.com/TransformerOptimus/SuperAGI) |

---

## Open Source Models (Run Locally)

Models we can run on-device or self-hosted to reduce API costs and enable offline/private operation.

| Project | Stars | What It Does | We Use It For | License | Link |
|---------|-------|-------------|---------------|---------|------|
| **MiniCPM-o 4.5** | 23.8k | 9B parameter multimodal model. Vision + speech + text. Approaches Gemini 2.5 Flash quality. Real-time voice conversation. Video understanding. Runs on consumer hardware. | On-device voice agent. Vision tasks (reading documents, receipts). Reduces API costs for routine multimodal tasks. Full-duplex streaming (see + listen + speak simultaneously). | Apache 2.0 | [github.com/OpenBMB/MiniCPM-o](https://github.com/OpenBMB/MiniCPM-o) |
| **Ollama** | 120k+ | Run LLMs locally. One-command install. Supports Llama, Mistral, Gemma, Phi, Qwen, and more. | Local model serving for development and cost-sensitive deployments. Nanobot supports Ollama natively. | MIT | [github.com/ollama/ollama](https://github.com/ollama/ollama) |
| **vLLM** | 45k+ | High-throughput LLM serving engine. PagedAttention for efficient memory use. | Production-grade local model serving when self-hosting for enterprise customers. | Apache 2.0 | [github.com/vllm-project/vllm](https://github.com/vllm-project/vllm) |

---

## MCP Servers & Tool Integration

Pre-built MCP servers that let agents connect to real-world tools.

| Project / Resource | What It Does | Link |
|--------------------|-------------|------|
| **MCP Server Directory** | Browse 100+ MCP servers for databases, APIs, tools | [mcp.so](https://mcp.so/) |
| **PulseMCP** | 513 MCP clients and servers directory | [pulsemcp.com](https://www.pulsemcp.com/clients) |
| **Playwright MCP** (12k stars) | Browser automation — agents interact with web pages, scrape, fill forms | [github.com/anthropics/mcp-playwright](https://github.com/anthropics/mcp-playwright) |
| **mcp-agent** | Build agents using MCP + simple workflow patterns | [github.com/lastmile-ai/mcp-agent](https://github.com/lastmile-ai/mcp-agent) |
| **LangFlow** | Low-code platform for building AI agents and MCP servers | [github.com/langflow-ai/langflow](https://github.com/langflow-ai/langflow) |

### MCP Servers We Need to Build / Integrate

| Integration | Purpose | Approach |
|-------------|---------|----------|
| **Gmail/Outlook** | Read/send emails for Sales + Support agents | OAuth + Gmail API wrapped as MCP server |
| **Google Calendar** | Book appointments for Scheduling Agent | Google Calendar API as MCP server |
| **HubSpot CRM** | Log leads, track deals for Sales Agent | HubSpot free API as MCP server |
| **Stripe** | Invoice, payment tracking for Finance Agent | Stripe API as MCP server (we have Stripe already) |
| **Twilio** | SMS/WhatsApp messaging | Twilio API as MCP server (we have Twilio already) |
| **Instagram/Buffer** | Post content for Content Agent | Social media APIs as MCP server |
| **Web Search** | Research Agent web browsing | Existing search MCP servers |

---

## Browser Automation for Agents

When agents need to interact with websites.

| Project | What It Does | Link |
|---------|-------------|------|
| **Playwright MCP** | Most popular browser automation for agents. 12k stars. | [github.com/anthropics/mcp-playwright](https://github.com/anthropics/mcp-playwright) |
| **Open Operator** | Browser-Use team's answer to OpenAI Operator. Chrome control via simplified DOM. Autonomous + approval modes. | [github.com/browser-use/open-operator](https://github.com/browser-use/open-operator) |
| **AutoBrowser MCP** | MCP server for vision-based browser interaction via Claude. | Available via MCP directory |

---

## AI Coding Agents

For the Code Building Agent role (Phase 2+).

| Project | What It Does | Link |
|---------|-------------|------|
| **OpenCode** | Open-source AI coding agent. Terminal UI. Multi-session. 75+ models. CLI + desktop + IDE extensions. | [github.com/opencode-ai/opencode](https://github.com/opencode-ai/opencode) |
| **Claude Code** | Anthropic's CLI coding assistant. MCP server support. | [docs.anthropic.com](https://docs.anthropic.com) |
| **Cursor** | AI-first code editor. Production-proven. | [cursor.com](https://cursor.com) |
| **Aider** | AI pair programming in terminal. Works with any LLM. | [github.com/paul-gauthier/aider](https://github.com/paul-gauthier/aider) |

---

## Observability & Monitoring

For debugging and monitoring agent behavior in production.

| Project | What It Does | Link |
|---------|-------------|------|
| **LangSmith** | LangChain's observability platform. Traces, evaluations, datasets. | [smith.langchain.com](https://smith.langchain.com) |
| **Langfuse** | Open-source LLM observability. Traces, metrics, evaluations. | [github.com/langfuse/langfuse](https://github.com/langfuse/langfuse) |
| **Arize Phoenix** | Open-source AI observability. Traces, evaluations. | [github.com/Arize-ai/phoenix](https://github.com/Arize-ai/phoenix) |
| **AgentOps** | Agent-specific observability and replay. | [github.com/AgentOps-AI/agentops](https://github.com/AgentOps-AI/agentops) |

---

## Voice & Speech

For voice agent capabilities.

| Project | What It Does | Link |
|---------|-------------|------|
| **ElevenLabs** | High-quality text-to-speech. Voice cloning. Real-time streaming. Used by OpenClaw and Nanobot. | [elevenlabs.io](https://elevenlabs.io) |
| **MiniCPM-o** | On-device bilingual voice conversation. Voice cloning. Full-duplex. | [github.com/OpenBMB/MiniCPM-o](https://github.com/OpenBMB/MiniCPM-o) |
| **Vapi** | Voice AI platform for building phone agents. | [vapi.ai](https://vapi.ai) |
| **Bland.ai** | AI phone calling agent platform. | [bland.ai](https://bland.ai) |

---

## Learning Resources & Reference

| Project | Stars | What It Contains | Link |
|---------|-------|-----------------|------|
| **AI Engineering Hub** | 29.4k | 93+ production-ready AI projects. Beginner to advanced. RAG, agents, MCP implementations, fine-tuning, voice processing. Includes AI Engineering Roadmap. | [github.com/patchy631/ai-engineering-hub](https://github.com/patchy631/ai-engineering-hub) |
| **ADAS Paper** | ICLR 2025 | Research on automated agent design. Meta Agent Search algorithm. | [arxiv.org/abs/2408.08435](https://arxiv.org/abs/2408.08435) |
| **ADAS Project Page** | — | Overview, demos, results | [shengranhu.com/ADAS](https://www.shengranhu.com/ADAS/) |
| **Awesome AI Agents** | 15k+ | Curated list of AI autonomous agents | [github.com/e2b-dev/awesome-ai-agents](https://github.com/e2b-dev/awesome-ai-agents) |
| **AI Agent Tools Landscape** | — | 120+ tools mapped for 2026 | [stackone.com/blog/ai-agent-tools-landscape-2026](https://www.stackone.com/blog/ai-agent-tools-landscape-2026) |

---

## Agent Directories & Lists

| Resource | What It Covers | Link |
|----------|---------------|------|
| **Top 9 AI Agent Frameworks (Shakudo)** | Comparison of frameworks with benchmarks | [shakudo.io/blog/top-9-ai-agent-frameworks](https://www.shakudo.io/blog/top-9-ai-agent-frameworks) |
| **Top 5 Agentic AI Frameworks (AIMultiple)** | Framework comparison for production use | [aimultiple.com/agentic-frameworks](https://aimultiple.com/agentic-frameworks) |
| **Langfuse Framework Comparison** | Side-by-side agent framework analysis | [langfuse.com/blog/2025-03-19-ai-agent-comparison](https://langfuse.com/blog/2025-03-19-ai-agent-comparison) |
| **50+ Open Source AI Agents (AIMultiple)** | Comprehensive agent list | [aimultiple.com/open-source-ai-agents](https://aimultiple.com/open-source-ai-agents) |
| **Top MCP Servers & Clients (DataCamp)** | MCP ecosystem overview | [datacamp.com/blog/top-mcp-servers-and-clients](https://www.datacamp.com/blog/top-mcp-servers-and-clients) |

---

## How We Use Each Tool

### Quick Reference Map

```
WHAT WE BUILD          WHAT WE USE                    WHY THIS ONE
─────────────────────────────────────────────────────────────────────

Agent Kernel         → Nanobot                       Lightest runtime (45MB, 0.8s)
                                                     Multi-channel built-in

Sales Agent          → CrewAI                        Best role-based model
Support Agent        → LangGraph                     Best for complex workflows
CEO Agent            → CAMEL                         Best for agent coordination
Content Agent        → CrewAI                        Simple role definition
Research Agent       → CrewAI + web tools            Role + browsing

Tool Connections     → MCP protocol                  Universal standard
  Email              → Gmail API as MCP server       OAuth, read/send
  Calendar           → Google Calendar MCP           Book appointments
  CRM                → HubSpot MCP                   Log leads
  Payments           → Stripe MCP                    Invoice/track (existing)
  Messaging          → Twilio MCP                    SMS/WhatsApp (existing)
  Social             → Buffer/Instagram MCP          Post content
  Browser            → Playwright MCP                Web browsing

Self-Improvement     → ADAS                          Agents improve weekly
Local Models         → MiniCPM-o + Ollama            Reduce API costs
Voice                → ElevenLabs / MiniCPM-o        Phone + voice agents
Observability        → Langfuse (open source)        Debug agent behavior
Knowledge Base       → LlamaIndex + pgvector         FAQ search / RAG

Reference Only       → OpenClaw (Gateway pattern)
(study, don't embed) → Eigent (workforce UX)
                     → MetaGPT (SOP design)
                     → ChatDev (visual canvas)
```

### Framework Selection Logic

```
When a new agent is created, we pick the framework automatically:

IF agent has a simple, defined role (sales, content, research)
   → USE CrewAI (intuitive role model, fast setup)

IF agent needs multi-step workflow with branching (support, finance)
   → USE LangGraph (stateful graphs, durable execution)

IF agent needs to coordinate other agents (CEO, manager)
   → USE CAMEL (multi-agent communication protocol)

IF using OpenAI models specifically
   → USE OpenAI Agents SDK (handoffs + guardrails)

IF using Gemini models specifically
   → USE Google ADK (MCP native, built-in UI)

The business owner never sees this decision.
They just get the best-performing agent for their use case.
```

---

## Quick Start for Developers

### Prerequisites

```bash
# Node.js (frontend + backend)
node >= 18

# Python (agent kernel)
python >= 3.10

# Database
postgresql >= 14
```

### Install Everything

```bash
# Clone the repo
git clone https://github.com/your-org/viktron.ai
cd viktron.ai

# Frontend + Backend (existing)
npm install

# Agent kernel (new)
pip install nanobot crewai langgraph camel-ai openai-agents google-adk
pip install langfuse  # observability

# Optional: local models
pip install ollama vllm
```

### Key Links

| Resource | URL |
|----------|-----|
| Nanobot docs | [github.com/HKUDS/nanobot](https://github.com/HKUDS/nanobot) |
| CrewAI docs | [docs.crewai.com](https://docs.crewai.com) |
| LangGraph docs | [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph) |
| CAMEL docs | [camel-ai.github.io](https://camel-ai.github.io) |
| MCP spec | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| ADAS paper | [arxiv.org/abs/2408.08435](https://arxiv.org/abs/2408.08435) |
| MiniCPM-o | [github.com/OpenBMB/MiniCPM-o](https://github.com/OpenBMB/MiniCPM-o) |
| AI Engineering Hub | [github.com/patchy631/ai-engineering-hub](https://github.com/patchy631/ai-engineering-hub) |

---

*Last updated: February 2026*
*Built for AgentIRL / Viktron AI*
