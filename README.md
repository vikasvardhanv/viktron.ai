Viktron Overview


Viktron is a cutting-edge platform designed to empower businesses, agencies, and creators with advanced AI-driven services and interactive digital agents. Our mission is to streamline operations, enhance customer engagement, and unlock new possibilities for growth through automation, intelligent workflows, and immersive digital experiences.

---

## What We Do

Viktron provides a unified platform for automating business processes, engaging customers, and delivering innovative digital experiences. We combine AI agents, workflow automation, and interactive demos to help organizations:
- Automate repetitive tasks and communications
- Enhance customer support and lead generation
- Centralize marketing and outreach
- Deliver immersive product and service experiences
- Integrate with popular tools and APIs for seamless operations

---

## How We Do It

Our platform leverages modular AI agents, customizable workflows, and interactive demos. Users can select, configure, and deploy agents tailored to their needs, or experience our technology through live demos. Integration with third-party services (social media, email, SMS, data sources) is seamless, enabling end-to-end automation and engagement.

---

## Detailed List of Services, Agents, Demos, and Use Cases

### Services
Viktron offers a range of automation and engagement services:
- **Social Media Posting Automation**: Schedule and publish content across multiple platforms automatically.
- **Email and SMS Campaign Automation**: Design, send, and track campaigns to reach your audience efficiently.
- **Data Extraction and Reporting**: Collect, process, and visualize business data for actionable insights.
- **PDF and Document Processing**: Automate document generation, conversion, and management.
- **Web Scraping and Content Aggregation**: Gather and organize information from the web for research or marketing.

### AI Agents
Our modular agents are designed for specific business functions:
- **Sales Assistants**: Automate lead generation, qualification, and follow-up. Integrate with CRM systems to nurture prospects and close deals.
- **Marketing Hubs**: Centralize campaign management, automate posting, and analyze engagement across channels.
- **Consultation Agents**: Provide instant support, expert advice, and personalized recommendations to customers 24/7.
- **Scheduling Agents**: Manage appointments, bookings, and calendar events for teams and clients.
- **Industry-Specific Agents**: Custom solutions for:
	- Real Estate: Virtual tours, lead capture, property info
	- Healthcare: Appointment scheduling, patient support
	- Education: Student engagement, course info, FAQ bots
	- E-commerce: Product recommendations, order tracking

### Interactive Demos
Experience our technology through hands-on demos:
- **Chatbots**: AI-powered bots for customer support, FAQs, and personalized interactions.
- **Voice Agents**: Voice-driven assistants for hands-free help and accessibility.
- **Virtual Try-On**: 360° product/service experiences for retail, fashion, and more.
- **Games & Engagement Tools**:
	- Snake Game: Fun, interactive module for user engagement
	- Tilt Card: Dynamic UI element for showcasing products or offers

### Automation Workflows
Our platform integrates with popular tools and APIs to automate:
- Social media posting and monitoring
- Email and SMS campaigns
- Data extraction, transformation, and reporting
- PDF/document creation and processing
- Web scraping and aggregation

---

## Use Cases
Viktron is ideal for:
- **Small Businesses**: Automate operations, improve customer service, and grow with minimal overhead.
- **Agencies**: Offer white-label AI services, manage multiple clients, and deliver innovative solutions.
- **Enterprises**: Scale customer engagement, centralize marketing, and streamline workflows.
- **Creators & Influencers**: Automate content workflows, engage audiences, and analyze performance.

---

## Example Scenarios

- A real estate agency uses our Virtual Try-On and Chatbot agents to provide virtual property tours and answer client questions instantly.
- An e-commerce store automates order tracking and product recommendations with our Sales Assistant and Consultation Agent.
- A marketing agency manages campaigns for multiple clients using our Marketing Hub and automation workflows.
- A healthcare provider streamlines appointment scheduling and patient support with our Scheduling Agent and custom workflows.

---

## Getting Started

1. Explore our live demos to experience agents and workflows in action.
2. Select and configure agents tailored to your business needs.
3. Integrate with your existing tools and platforms for seamless automation.
4. Contact our team for a personalized walkthrough or custom solution.



# Viktron Agent Backend

Enterprise AI agent orchestration — CEO, PM, Developer, QA agents that run in the cloud,
coordinate over WhatsApp/SMS/email, and execute real work on codebases.

---

## Architecture Overview

## How Agent Provisioning Works (No Confusion)

There are two different product modes in this system, and they are often mixed up:

### 1) Enterprise Managed Mode (default for client projects)

This is the "we need X agents for our business" flow.

- Client gives business requirements (industry, channels, goals, workflows).
- Viktron creates a `Team` + `BusinessProfile`.
- Backend auto-generates the right agent set for that team (CEO, PM, Dev, QA, Sales, Support, Content, etc.) via `team_generator.py`.
- Agents run in Viktron cloud workers (Celery + Redis), with checkpoints/memory/state in PostgreSQL.
- Client does **not** clone repos or run Docker manually.
- Client interacts through WhatsApp/SMS/email/web; orchestration happens server-side.

In short: for enterprise onboarding, provisioning is backend-managed and automatic.

### 2) Rent Agent / Self-Hosted Mode (marketplace-style)

This is the "give me an image so I can run it myself" flow.

- User pulls a Docker image (or deploys hosted from marketplace when provisioning worker is enabled).
- If registry access is denied (private GHCR package), local fallback is shown: clone source + build image.
- Clone/build is **not** the enterprise managed path; it's only a self-hosting fallback.

Why clone appears at all:
- Some open-source agents may be published with source visibility but image pull restricted by registry permissions.
- In that case, build-from-source keeps local deployment unblocked.

### Expected UX Direction

- Enterprise mode: zero Docker commands for the client.
- Marketplace hosted mode: one-click deploy (no clone).
- Self-host mode: Docker pull (and clone/build only if registry auth is missing).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INBOUND CHANNELS                                  │
│                                                                             │
│   WhatsApp ──┐                                                              │
│   SMS ───────┼──► POST /api/messages/webhoo=[.k/{channel}                     │
│   Email ─────┘         │                                                    │
│   Web/API ─────────────┤                                                    │
└────────────────────────┼────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SEMANTIC ROUTER  (router.py)                          │
│                                                                             │
│   1. Find team by recipient phone/email                                     │
│   2. Embed incoming message (text-embedding-3-small)                        │
│   3. Cosine similarity against agent keyword profiles      ◄── LlamaIndex   │
│   4. Route to best-matching agent role                                      │
│                                                                             │
│   Routes: sales │ support │ content │ pm │ developer │ qa │ ceo            │
└────────────────────────┬────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR  (orchestrator.py)                        │
│                                                                             │
│   handle_founder_message() ──► CEO Agent                                   │
│   dispatch_task()         ──► Any agent                                    │
│   _compress_handoff_history() ── OpenAI SDK pattern: compress prior        │
│                                  conversation before each agent handoff     │
└────────────────────────┬────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT HIERARCHY                                     │
│                                                                             │
│                        ┌─────────┐                                         │
│                        │   CEO   │  ◄── Founder messages                   │
│                        │ (ceo.py)│      Plans, delegates, reflects         │
│                        └────┬────┘      Spawns new agents dynamically      │
│                             │                                               │
│              ┌──────────────┼──────────────────┐                           │
│              │              │                  │                            │
│         ┌────▼────┐   ┌─────▼────┐   ┌────────▼──┐                        │
│         │  SALES  │   │ SUPPORT  │   │  CONTENT  │                        │
│         │(sales.py│   │(support) │   │(content)  │  Business agents        │
│         └─────────┘   └──────────┘   └───────────┘                        │
│                                                                             │
│              ┌──────────────┐                                               │
│              │      PM      │  ◄── Technical work                          │
│              │   (pm.py)    │      Task Ledger + Progress Ledger            │
│              └──────┬───────┘      GroupChat with CEO before starting      │
│                     │              Manager re-evaluates every output        │
│          ┌──────────┴──────────┐                                           │
│          │                     │                                            │
│    ┌─────▼──────┐       ┌──────▼─────┐                                     │
│    │ DEVELOPER  │       │     QA     │                                      │
│    │(developer) │       │  (qa.py)   │                                      │
│    │ file/shell │       │ test runs  │                                      │
│    │ code/browse│       │ bug reports│                                      │
│    └────────────┘       └────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Full Message Flow: WhatsApp → Agents → Reply

```
You (WhatsApp): "Hey, Megan AI project needs UI cleanup and app creation"
        │
        ▼
Twilio webhook → POST /api/messages/webhook/whatsapp
        │
        ▼
MessageRouterService.route_incoming()
  ├─ Find team by recipient phone number
  ├─ classify_intent_semantic()  ← embeds msg, cosine similarity
  │     "code project" → routes to CEO
  └─ Creates Message record + Task record in PostgreSQL
        │
        ▼
CEOAgent._process_instruction()
  ├─ GroupChat: CEO + PM plan together (2-3 rounds)  ◄── AutoGen
  │     CEO: "We need UI cleanup + app creation feature"
  │     PM:  "I'll break into 4 steps: audit, fix, build, test"
  │     CEO: "Approved. Proceed."
  ├─ DAG planning: complex → uses TaskDAGEngine
  └─ Dispatches to PM with compressed history  ◄── OpenAI SDK
        │
        ▼
ProjectManagerAgent._run_pm_loop()
  ├─ Load checkpoint (resume if crashed)  ◄── LangGraph
  ├─ ProgressLedger.set_task_ledger([...])  ◄── Magentic-One
  │
  ├─ STEP 1: "Audit current UI components"
  │     ├─ Checkpoint BEFORE executing  ◄── LangGraph
  │     ├─ ledger.start_step("step_1", agent="developer")
  │     ├─ DeveloperAgent.execute(sub_task)
  │     │     └─ Tool loop: file.list → file.read → analyze → report
  │     ├─ Quality check: PM reviews output  ◄── CrewAI
  │     │     score 8/10 → PASSED
  │     └─ checkpoint.mark_complete("step_1")
  │
  ├─ STEP 2: "Fix Dashboard sidebar spacing"
  │     ├─ DeveloperAgent reads Dashboard.tsx, patches CSS
  │     ├─ Runs: shell("npm run build") → exit 0
  │     ├─ PM quality check: 9/10 → PASSED
  │     └─ checkpoint.mark_complete("step_2")
  │
  ├─ STEP 3: "Build CreateApp modal component"
  │     ├─ DeveloperAgent writes CreateAppModal.tsx
  │     ├─ PM quality check: 6/10 → RETRY
  │     ├─ DeveloperAgent revises (attempt 2)
  │     ├─ PM quality check: 8/10 → PASSED
  │     └─ checkpoint.mark_complete("step_3")
  │
  ├─ STEP 4: "Run full test suite"
  │     ├─ QAAgent.execute(sub_task)
  │     │     └─ Discovers pytest, runs tests, parses output
  │     ├─ 47 passed, 1 failed (auth.py:142 JWT expiry)
  │     ├─ Bug report generated with severity/location
  │     └─ checkpoint.mark_complete("step_4")
  │
  └─ PM generates CEO report
        │
        ▼
CEOAgent._reflect_and_learn()
  ├─ Stores lessons in permanent memory  ◄── Google ADK tier 3
  └─ Generates WhatsApp reply
        │
        ▼
Twilio API → Your WhatsApp:
  "Done. UI fixed (sidebar + Dashboard). CreateApp modal built.
   47/48 tests pass. 1 blocker: JWT expiry in auth.py:142.
   Reply 'fix auth' to continue."
```

---

## The 15 Framework Extractions — Where They Live

| Framework | What We Took | File |
|-----------|-------------|------|
| **CrewAI** | Manager re-evaluation — PM checks dev output quality before marking step done | `app/agents/pm.py` → `_quality_check()` |
| **LangGraph** | Superstep checkpointing — save state before each step, resume on crash | `app/services/checkpoint.py` + wired into `pm.py` |
| **AutoGen** | GroupChat — CEO + PM plan together before executing | `app/services/group_chat.py` |
| **Magentic-One** | Task Ledger + Progress Ledger + stall detection (3 fails → replan) | `app/services/progress_ledger.py` + `pm.py` |
| **Spacebot** | Context compaction at 80%/85%/95% token fill thresholds | `app/services/context_compactor.py` |
| **OpenAI SDK** | History compression on agent handoff (collapse transcript between agents) | `app/services/orchestrator.py` → `_compress_handoff_history()` |
| **Google ADK** | 3-tier memory: temp (per-turn) / session (per-task) / permanent (forever) | `app/services/tiered_memory.py` + `base.py` |
| **Strands** | Tool library — file, shell, code, browser + agentic loop | `app/tools/` — 4 tools + `llm_client.chat_with_tools()` |
| **Bedrock** | Pluggable LLM providers — swap OpenAI for Anthropic/Gemini at runtime | `app/services/llm_client.py` — multi-provider with fallback |
| **Nanobot** | YAML agent definitions — agents defined in config files, not code | `app/agents/definitions/*.yaml` + `loader.py` |
| **MCP** | Standard tool registry — JSON-RPC 2.0, any LLM can call our tools | `app/tools/mcp_adapter.py` |
| **Pydantic AI** | Dependency injection — TieredMemory auto-injected into every agent | `app/agents/base.py` |
| **LlamaIndex** | Semantic routing — embedding + cosine similarity picks best agent | `app/services/router.py` → `classify_intent_semantic()` |
| **CAMEL** | Inception prompts — loaded from YAML, prepended for every agent automatically | `app/agents/base.py` + `definitions/*.yaml` |
| **Sem. Kernel** | Skills registry — auto-discovers `skills/*.md` files, agents can invoke by name | `app/services/skills_registry.py` |

---

## File Map

```
viktron-backend/
│
├── app/
│   │
│   ├── agents/                     ← AI agent implementations
│   │   ├── base.py                 ← Abstract base: memory, tools, event bus, inception
│   │   ├── ceo.py                  ← CEO: plans, delegates, reflects, spawns
│   │   ├── pm.py                   ← PM: Task Ledger, Progress Ledger, quality gates
│   │   ├── developer.py            ← Developer: file/shell/code/browser tool loop
│   │   ├── qa.py                   ← QA: discovers tests, runs, generates bug reports
│   │   ├── sales.py                ← Sales: lead qualification, appointment booking
│   │   ├── support.py              ← Support: customer issue resolution
│   │   ├── content.py              ← Content: writing, social media, email copy
│   │   ├── loader.py               ← YAML definition loader (Nanobot pattern)
│   │   └── definitions/            ← Agent config files (YAML)
│   │       ├── ceo.yaml
│   │       ├── pm.yaml
│   │       ├── developer.yaml
│   │       ├── qa.yaml
│   │       └── sales.yaml
│   │
│   ├── services/                   ← Core business logic
│   │   ├── llm_client.py           ← Multi-provider LLM (OpenAI + Anthropic + Gemini)
│   │   ├── orchestrator.py         ← Routes founder messages, dispatches tasks
│   │   ├── router.py               ← Semantic + keyword message routing
│   │   ├── task_dag.py             ← Task DAG: topological sort, parallel execution
│   │   ├── event_bus.py            ← Agent-to-agent messaging (A2A)
│   │   ├── subagent_registry.py    ← Dynamic agent spawning at runtime
│   │   ├── team_generator.py       ← Creates agents from BusinessProfile
│   │   ├── group_chat.py           ← AutoGen-style CEO + PM planning session
│   │   ├── checkpoint.py           ← LangGraph step-level crash recovery
│   │   ├── progress_ledger.py      ← Magentic-One stall detection + replan
│   │   ├── context_compactor.py    ← Spacebot 80%/85%/95% token compaction
│   │   ├── tiered_memory.py        ← Google ADK 3-tier state (temp/session/permanent)
│   │   ├── skills_registry.py      ← Semantic Kernel skills (auto-discovers .md files)
│   │   ├── rag.py                  ← Vector similarity search (pgvector)
│   │   ├── feedback_loop.py        ← Learns from task outcomes over time
│   │   └── reporter.py             ← Daily report generation
│   │
│   ├── tools/                      ← Agent tools (Strands pattern)
│   │   ├── base.py                 ← BaseTool + ToolRegistry
│   │   ├── file_tool.py            ← Read, write, list, patch files (sandboxed)
│   │   ├── shell_tool.py           ← Run shell commands (blocked: rm -rf /, etc.)
│   │   ├── code_tool.py            ← Execute Python in subprocess (isolated)
│   │   ├── browser_tool.py         ← Fetch URLs, extract text/links
│   │   ├── mcp_adapter.py          ← MCP JSON-RPC 2.0 protocol adapter
│   │   ├── knowledge_tool.py       ← Search team knowledge base
│   │   ├── email_tool.py           ← Send emails via SMTP
│   │   ├── sms_tool.py             ← Send SMS via Twilio
│   │   └── calendar_tool.py        ← Calendar operations
│   │
│   ├── models/                     ← PostgreSQL data models (SQLAlchemy)
│   │   ├── team.py                 ← Team + BusinessProfile
│   │   ├── agent.py                ← Agent record (role, model, config, status)
│   │   ├── task.py                 ← Task (type, status, input/output, DAG deps)
│   │   ├── message.py              ← Inbound/outbound messages (all channels)
│   │   ├── memory.py               ← Agent memory (key-value JSONB per agent)
│   │   ├── knowledge.py            ← Knowledge base entries with embeddings
│   │   └── activity.py             ← Activity log (every agent action)
│   │
│   ├── api/routes/                 ← FastAPI endpoints
│   │   ├── health.py               ← GET /api/health
│   │   ├── teams.py                ← CRUD /api/teams
│   │   ├── agents.py               ← CRUD /api/agents
│   │   └── messages.py             ← POST /api/messages/webhook/{email,sms,whatsapp}
│   │
│   ├── workers/
│   │   └── tasks.py                ← Celery tasks (background, survives server restart)
│   │
│   ├── main.py                     ← FastAPI app + WebSocket bridge endpoint
│   ├── config.py                   ← Settings from .env (all secrets)
│   ├── database.py                 ← Async PostgreSQL session
│   └── auth.py                     ← JWT auth middleware
│
├── skills/                         ← Skill definition files (Semantic Kernel / OpenClaw)
│   └── *.md                        ← Auto-discovered at startup
│
├── alembic/                        ← Database migrations
├── tests/                          ← Test suite
├── docker-compose.yml              ← PostgreSQL + Redis + backend
├── requirements.txt
└── README.md
```

---

## What Is Actually Working vs What Needs Config

### ✅ Fully implemented (code complete, logic correct)

| Component | Status |
|-----------|--------|
| CEO Agent — DAG planning, delegation, reflection, spawn | ✅ |
| PM Agent — Task Ledger, Progress Ledger, quality gates, replan | ✅ |
| Developer Agent — file/shell/code/browser agentic tool loop | ✅ |
| QA Agent — test discovery, execution, bug reports | ✅ |
| Sales / Support / Content agents | ✅ |
| TaskDAGEngine — topological sort, parallel execution, auto-replan | ✅ |
| Agent-to-Agent Event Bus (A2A messaging) | ✅ |
| SubAgent Registry (spawn agents dynamically at runtime) | ✅ |
| LLMClient — OpenAI + Anthropic + Gemini with fallback | ✅ |
| Tool loop — `chat_with_tools()` agentic loop (30 turns max) | ✅ |
| FileTool — sandboxed read/write/patch (100KB limit, blocks .env) | ✅ |
| ShellTool — subprocess with timeout, blocked dangerous commands | ✅ |
| CodeTool — Python REPL in subprocess isolation | ✅ |
| BrowserTool — httpx fetch + HTML→text extraction | ✅ |
| MCP Adapter — JSON-RPC 2.0, any LLM can call our tools | ✅ |
| Checkpoint Service — step-level crash recovery (LangGraph) | ✅ |
| Progress Ledger — stall detection, snapshots, replan trigger | ✅ |
| Context Compactor — 80%/85%/95% tiered compaction | ✅ |
| Tiered Memory — temp / session / permanent (Google ADK) | ✅ |
| GroupChat — CEO + PM planning session (AutoGen) | ✅ |
| Skills Registry — auto-discovers `skills/*.md` (Semantic Kernel) | ✅ |
| YAML Agent Definitions — Nanobot-style config files | ✅ |
| Semantic Router — embedding + cosine similarity routing | ✅ |
| History Compression on handoff (OpenAI SDK pattern) | ✅ |
| Inception Prompts on ALL agents (auto from YAML) | ✅ |
| Celery background workers (survive server restart) | ✅ |
| WebSocket bridge endpoint (`/ws/bridge/{team_id}`) | ✅ |
| WhatsApp / SMS / Email webhooks (Twilio) | ✅ |
| RAG knowledge search (pgvector cosine similarity) | ✅ |
| Feedback loop (learns from past task outcomes) | ✅ |
| JWT auth, CORS, multi-tenant teams | ✅ |

### ⚠️ Needs configuration to run (code done, env vars missing)

| What | What's needed |
|------|--------------|
| WhatsApp replies sending back | Twilio credentials + sandbox number configured in `.env` |
| LLM calls working | `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in `.env` |
| Database | PostgreSQL running, `DATABASE_URL` in `.env`, migrations run |
| Background workers | Redis running, `celery -A app.workers.tasks worker` started |
| Bridge (local file access) | `python3 viktron-local/bridge.py --team-id X --api-key Y` |

---

## How to Run

### 1. Set up environment

```bash
cp .env.example .env
# Fill in:
# DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/viktron
# OPENAI_API_KEY=sk-...
# TWILIO_ACCOUNT_SID=AC...
# TWILIO_AUTH_TOKEN=...
# TWILIO_PHONE_NUMBER=+18446608065
# REDIS_URL=redis://localhost:6379/0
```

### 2. Start infrastructure

```bash
docker-compose up -d    # starts PostgreSQL + Redis
```

### 3. Run migrations

```bash
alembic upgrade head
```

### 4. Start the backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 5. Start background workers (Celery)

```bash
# In a second terminal — agents run here even if browser closes
celery -A app.workers.tasks worker --loglevel=info
```

### 6. Connect WhatsApp (Twilio)

- Twilio Console → Messaging → Sandbox
- Set webhook URL: `https://your-domain.com/api/messages/webhook/whatsapp`
- Scan the QR code with your phone

### 7. (Optional) Start local bridge for file access

```bash
python3 viktron-local/bridge.py \
  --team-id YOUR_TEAM_ID \
  --api-key YOUR_API_KEY \
  --project /path/to/your/project
```

---

## Enterprise Onboarding Playbook (Your Step-by-Step Guide)

This is the **exact flow** you give to enterprise customers. No Docker, no cloning required.

### Prerequisites
- Viktron account (sign up on viktron.ai)
- JWT auth token (login gives you this)
- `curl` or Postman
- Backend running at `https://api.viktron.ai`

### Step 1: Authenticate & Get JWT Token

```bash
# Sign up (or login if you already have an account)
curl -X POST https://viktron.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-enterprise@company.com",
    "password": "your-secure-password"
  }'

# Response: { "data": { "token": "eyJhbGc..." } }
# Store the token:
export TOKEN="eyJhbGc..."
```

### Step 2: Create Your Enterprise Team (Auto-Provisions Agents)

Describe your business in one API call. The backend **automatically creates CEO, PM, Developer, QA, Sales, Support, and Content agents** tailored to your industry.

```bash
curl -X POST https://api.viktron.ai/api/teams/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "business_name": "Your Company",
      "industry": "software",
      "description": "AI automation and SaaS consulting for enterprise",
      "services": [
        "Custom AI agent development",
        "Workflow automation",
        "Integration services"
      ],
      "pricing": [
        {"service": "Starter", "price": "$5K/month"},
        {"service": "Professional", "price": "$15K/month"},
        {"service": "Enterprise", "price": "Custom"}
      ],
      "faq": [
        {
          "question": "What LLM do you use?",
          "answer": "GPT-4o by default, with Anthropic Claude as fallback"
        }
      ],
      "channels": ["web", "whatsapp", "sms", "email"],
      "business_hours": "Mon-Fri 9AM-5PM EST",
      "location": "San Francisco, CA",
      "agent_roles": ["ceo", "pm", "developer", "qa", "sales", "support", "content"]
    }
  }'

# Response: { "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Your Company AI Team", ... }
# Store the team_id:
export TEAM_ID="550e8400-e29b-41d4-a716-446655440000"
```

### Step 3: Verify Agents Were Created

```bash
curl https://api.viktron.ai/api/teams/$TEAM_ID \
  -H "Authorization: Bearer $TOKEN"

# Response shows agents array with all 7 agents active
```

### Step 4: Send Your First Instruction (Founder Message)

Your CEO agent is now running in the cloud, listening for instructions.

```bash
curl -X POST https://api.viktron.ai/api/teams/$TEAM_ID/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a plan for launching our new AI consulting service and what resources we need",
    "channel": "web"
  }'

# Response: { "success": true, "task_id": "...", "response": "... CEO'\''s detailed response ..." }
```

The CEO agent:
1. Reads your instruction
2. Plans with the PM (GroupChat AutoGen)
3. Delegates to Sales, Content, or Dev agents as needed
4. Returns a comprehensive response with next steps

### Step 5: Monitor Activity & Logs

```bash
# See all actions agents took
curl https://api.viktron.ai/api/teams/$TEAM_ID/activity?page=1 \
  -H "Authorization: Bearer $TOKEN"

# Response: { "activities": [ { "action": "team_created", ... }, ... ] }
```

### Step 6: Continuous Operations

Send as many instructions as you want. Agents use permanent memory + checkpoints.

```bash
# Example: Fix a bug
curl -X POST https://api.viktron.ai/api/teams/$TEAM_ID/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Our users report they cannot reset their password. Debug and fix this",
    "channel": "web"
  }'

# Developer agent runs, QA validates, PM checks quality, CEO reports back
```

---

## Troubleshooting Enterprise Onboarding

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Invalid/expired JWT token | Re-login on viktron.ai to get fresh token |
| `404 Team not found` | Used wrong team_id | Verify team_id from step 2 response |
| `500 Database error` | Backend DB unreachable | Check `DATABASE_URL` env var + PostgreSQL running |
| `502 Bad Gateway` | LLM service down | Check `OPENAI_API_KEY` + OpenAI API status |
| `Message times out` | Celery workers not running | Start: `celery -A app.workers.tasks worker` |
| `Agents not creating` | Missing agent_roles or invalid roles | Use roles: `["ceo", "pm", "developer", "qa", "sales", "support", "content"]` |

---

## Test the Full Flow

### Create a team + agents via API (Local Dev)

```bash
curl -X POST http://localhost:8000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Forge AI",
    "business_name": "Forge AI",
    "industry": "software",
    "business_data": {
      "phone": "+18446608065",
      "services": ["AI development", "App building"]
    }
  }'
```

### Send a founder message directly (Local Dev)

```bash
curl -X POST http://localhost:8000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": "YOUR_TEAM_ID",
    "message": "Fix the auth bug in my project",
    "channel": "web"
  }'
```

### Check activity log (Local Dev)

```bash
curl http://localhost:8000/api/teams/YOUR_TEAM_ID/activity
```

---

## How Agent Memory Works

```
Every agent has 3 memory tiers (Google ADK pattern):

┌─────────────────────────────────────────────────┐
│  TIER 1 — TEMP (per LLM turn)                   │
│  mem.set_temp("current_file", "auth.py")        │
│  Cleared automatically at the start of each     │
│  new tool-use turn. Never written to DB.        │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  TIER 2 — SESSION (per task execution)          │
│  await mem.set_session("files_read", [...])     │
│  Survives within one task. Written to DB.       │
│  Cleared when task completes.                   │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  TIER 3 — PERMANENT (forever)                   │
│  await mem.set("learned_pattern", "use pytest") │
│  Persists across restarts. Retrieved every run. │
│  Agents improve over time from this tier.       │
└─────────────────────────────────────────────────┘
```

---

## How the PM Execution Loop Works

```
PM receives instruction from CEO
         │
         ▼
┌─────────────────────────────────┐
│  Load checkpoint (crash resume) │  ◄── LangGraph
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  GroupChat: CEO + PM plan       │  ◄── AutoGen
│  (2-3 rounds, CEO approves)     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Create Task Ledger             │  ◄── Magentic-One
│  [{step_1: dev}, {step_2: qa}] │
└────────────┬────────────────────┘
             │
       ┌─────▼──────────────────────────────────────────────┐
       │  For each step:                                     │
       │                                                     │
       │  1. Skip if already done (checkpoint)  ◄ LangGraph │
       │  2. Save checkpoint BEFORE executing               │
       │  3. ledger.start_step()               ◄ Magentic-1 │
       │  4. Run Developer or QA agent                      │
       │  5. PM quality check (score/10)       ◄ CrewAI     │
       │  6. If failed → retry (max 2x)                     │
       │  7. stall = ledger.check_stall()      ◄ Magentic-1 │
       │     If stall → replan                              │
       │  8. checkpoint.mark_complete()        ◄ LangGraph  │
       │  9. Save full task state snapshot                  │
       └─────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Generate report → CEO          │
│  CEO → WhatsApp reply to you    │
└─────────────────────────────────┘
```

---

## Key Design Decisions

**Why PostgreSQL + pgvector?**
All agent memory, task state, and knowledge base live in one DB.
pgvector enables semantic search without a separate vector DB.

**Why Celery + Redis?**
Tasks persist in Redis. If the server restarts mid-task, Celery picks it up.
Agents keep running even if the web server restarts.

**Why the bridge is optional, not required?**
Cloud agents (CEO, PM, QA) run entirely on the server.
The bridge only adds local file/shell access.
For GitHub-hosted projects: agents can clone + work entirely in cloud.

**Why YAML agent definitions?**
Allows non-engineers to create/edit agents without touching Python.
New agent = new YAML file. No code change required.

**Why inception prompts matter?**
Without inception: LLM might say "I'll help with..." (assistant mode).
With inception: LLM acts as "I AM the developer" — makes decisions, not suggestions.
CAMEL showed this dramatically improves task completion quality.

---

## Stack

| Layer | Technology |
|-------|-----------|
| API | FastAPI + Uvicorn |
| Database | PostgreSQL 15 + pgvector |
| Background jobs | Celery + Redis |
| LLM providers | OpenAI GPT-4o + Anthropic Claude |
| Embeddings | OpenAI text-embedding-3-small (1536 dims) |
| Auth | JWT (RS256) |
| Channels | Twilio (WhatsApp, SMS), SMTP (email) |
| Containers | Docker + docker-compose |
| Migrations | Alembic |

---

## Telegram + DB Ops Runbook (Production)

Use this when `/api/telegram-tools/latest` or `/api/telegram-tools/sync` fails in production.

### 1. Quick API checks

```bash
curl -iS --max-time 20 "https://api.viktron.ai/health"
curl -iS --max-time 30 "https://api.viktron.ai/api/telegram-tools/latest?channel=toolspireai&limit=5"
curl -iS --max-time 120 -X POST "https://api.viktron.ai/api/telegram-tools/sync?channel=toolspireai&limit=120"
```

### 2. Find the current backend container ID (after redeploy, ID changes)

```bash
CID="$(docker ps -q | while read -r id; do docker inspect -f '{{join .Config.Cmd " "}}' "$id" 2>/dev/null | grep -q 'uvicorn app.main:app' && { echo "$id"; break; }; done)"
echo "CID=$CID"
```

### 3. Print runtime DB URL from inside container (`sh -lc`)

```bash
docker exec "$CID" sh -lc 'echo "$DATABASE_URL"'
```

### 4. Tail backend logs

```bash
docker logs --tail 200 "$CID"
```

### 5. DB reachability test from backend container (TCP)

```bash
docker exec "$CID" python -c 'import socket; targets=[("76.13.124.154",5432),("172.17.0.1",5432),("host.docker.internal",5432)];
for h,p in targets:
    s=socket.socket(); s.settimeout(5)
    try: s.connect((h,p)); print("TCP_OK",h,p)
    except Exception as e: print("TCP_FAIL",h,p,repr(e))
    finally: s.close()'
```

### 6. Find working DB host + SSL mode automatically

```bash
CID="$(docker ps -q | while read -r id; do docker inspect -f '{{join .Config.Cmd " "}}' "$id" 2>/dev/null | grep -q 'uvicorn app.main:app' && { echo "$id"; break; }; done)"
PASS='YOUR_DB_PASSWORD_HERE'
FOUND=0

for HOST in p4wcowwowwgoccksgc00w0sk-proxy p4wcowwowwgoccksgc00w0sk supabase-db-hg4s008ggs0wgkccwgswwoks 10.0.1.8 10.0.1.10; do
  for SSLMODE in require disable; do
    echo "TEST host=$HOST ssl=$SSLMODE"
    if docker exec -e HOST="$HOST" -e SSLMODE="$SSLMODE" -e PASS="$PASS" "$CID" python -c 'import os,sys,asyncio,asyncpg; h=os.environ["HOST"]; sm=os.environ["SSLMODE"]; pw=os.environ["PASS"]; ssl=("require" if sm=="require" else False); loop=asyncio.new_event_loop(); asyncio.set_event_loop(loop); ok=False;
try:
 c=loop.run_until_complete(asyncpg.connect(user="postgres",password=pw,database="postgres",host=h,port=5432,ssl=ssl,timeout=8)); v=loop.run_until_complete(c.fetchval("select 1")); loop.run_until_complete(c.close()); print(f"DB_OK host={h} ssl={sm} value={v}"); ok=True
except Exception as e:
 print(f"DB_FAIL host={h} ssl={sm} err={repr(e)}")
finally:
 loop.close()
sys.exit(0 if ok else 1)'; then
      echo "WINNER_HOST=$HOST WINNER_SSL=$SSLMODE"
      FOUND=1
      break 2
    fi
  done
done

[ "$FOUND" -eq 1 ] || echo "NO_WORKING_TARGET"
```

### 7. Known working production DB URL (from incident fix)

```bash
postgresql+asyncpg://postgres:YOUR_DB_PASSWORD_HERE@p4wcowwowwgoccksgc00w0sk-proxy:5432/postgres?ssl=require
```

### 8. Post-fix validation (exact sequence)

```bash
curl -iS --max-time 30 "https://api.viktron.ai/api/telegram-tools/latest?channel=toolspireai&limit=5"
curl -iS --max-time 120 -X POST "https://api.viktron.ai/api/telegram-tools/sync?channel=toolspireai&limit=120"
curl -iS --max-time 30 "https://api.viktron.ai/api/telegram-tools/latest?channel=toolspireai&limit=5"
```

### 9. Daily auto-sync cron (06:00 server time)

```bash
(crontab -l 2>/dev/null; echo '0 6 * * * curl -sS -X POST "https://api.viktron.ai/api/telegram-tools/sync?channel=toolspireai&limit=120" >/dev/null 2>&1') | crontab -
```

### 10. Optional: verify cron entry

```bash
crontab -l
```






1. Patient Intake — How Long, Will It Work?
Honest answer: the full flow as I described is 6-8 weeks of work and has real blockers:

Problem	Reality
Twilio number for SMS	Clinic needs a dedicated number, $1/mo + A2P 10DLC registration (2-3 weeks approval from carriers)
EHR integration via FHIR	Epic charges clinics $40K+ to enable FHIR. Most small clinics = no API
Browser automation for EHR	Works but fragile — EHR portals change, break overnight
Insurance verification	Payer eligibility APIs need provider NPI + clearinghouse contracts
HIPAA compliance	PHI in logs, SMS, database — need BAA with every vendor
The flow is real and correct — Phreesia, Luma, Klara all do exactly this. But Phreesia has 800 employees and 15 years of EHR partnerships. You can't replicate that in a sprint.

What you CAN build in 1-2 weeks that's genuinely useful:


POST /task {patient_name, phone, appointment_date, specialty}
→ Agent conducts SMS intake conversation via Twilio
→ Collects structured data
→ Returns FHIR-ready JSON packet + PDF summary
→ Sends to clinic via email/Slack
No EHR push (too complex). No insurance verification (needs clearinghouse). Just: automated intake conversation → structured packet → clinic gets it. That's real value, ships fast, and you can add EHR push later as a premium feature.

2. Agent IRL — What It Is and What You Have
This is your most intellectually complete product idea. The AGENTIRL.md document you wrote nails the real market gap:


The gap nobody is solving:
- LangSmith, Arize, Maxim = observability only (watch agents)  
- LangChain, CrewAI, AutoGen = frameworks only (build agents)
- MCP = tool protocol only (connect tools)

Nobody = reliability + integration + observability + governance
         all in one layer, framework-agnostic
What you actually have in viktron-backend that maps to AgentIRL:

AgentIRL Concept	What You Built
Smart tool adapters	app/tools/ — browser, file, email, slack, sms, calendar, code tools
Workflow decomposition	Task DAG with depends_on, dag_level in Task model
Human-in-the-loop gating	request_approval() in BaseAgent
Cross-framework support	LLMClient (OpenAI + Anthropic) with fallback
Observability layer	OpenTelemetry spans, ObservabilityService, trace_id through all calls
Audit logs	ActivityLog model, every agent action recorded
Policy/governance	Agent budgets, monthly_budget, current_spend tracking
Skill marketplace	Skills registry with YAML-defined skills
You have 70% of AgentIRL already built inside Viktron. What's missing is exposing it as a standalone SDK that any agent framework can plug into — not just your own agents.

3. The Cloud/Observability Platform — The Real Gap
You were thinking about something like Amplitude but for agents. This is the most interesting idea because the gap is genuinely unsolved.

Here's what exists today:

Tool	What it does	Gap
LangSmith	Traces LangChain calls	LangChain-only, no multi-agent
Arize	LLM evaluation + drift detection	Offline eval, not real-time agent behavior
AgentOps	Python SDK for agent tracing	No structured workflow understanding
Maxim	LLM testing + monitoring	No autonomous agent support
Helicone	LLM proxy + logging	API calls only, no agent logic
OpenTelemetry	Traces + metrics + logs	No agent-aware semantics
What none of them do:


- "Agent X completed 847 tasks this week, 94% success rate"
- "Step 3 of patient intake fails 31% of the time — insurance lookup"  
- "This agent costs $0.34/task average — going up since model change"
- "3 agents are stuck in approval-requested state for > 2 hours"
- "Agent hallucinated on these 12 tasks — here's why"
- "Skill 'browser_search' is the slowest step across all agents"
You already have the raw data for all of this in viktron-backend:

ActivityLog — every action
ObservabilityService — OpenTelemetry spans
Task model — status, timing, input/output
Agent.metrics — success_rate, avg_response_time
AgentMemory — persistent state
What you don't have is a product that surfaces this clearly. That's the cloud platform — a dashboard at cloud.viktron.ai or analytics.viktron.ai where anyone running Viktron agents (or any agents via the AgentIRL SDK) can see:


┌─────────────────────────────────────────────────────┐
│  AGENT FLEET — ACME CORP                            │
├──────────┬──────────┬──────────┬───────────────────┤
│ Agent    │ Tasks/wk │ Success  │ Avg Cost/task     │
├──────────┼──────────┼──────────┼───────────────────┤
│ CEO      │ 1,204    │ 96.2%    │ $0.12             │
│ Support  │ 8,441    │ 91.4%    │ $0.08             │
│ Intake   │ 312      │ 87.1% ⚠ │ $0.34             │
├──────────┴──────────┴──────────┴───────────────────┤
│ TOP FAILURE: patient-intake step 3 (insurance)      │
│ COST SPIKE: CEO agent +40% this week                │
└─────────────────────────────────────────────────────┘
The Honest Big Picture
You have three distinct products here, not one:

Product 1 — Viktron (what you're building now)
AI agent teams for businesses. Slack-native, multi-agent, CEO → specialist. Already works. Revenue path: $199-999/month per team.

Product 2 — rent.viktron.ai (agent marketplace)
Individual agents as Docker images. Unique to you — nobody else does this. Revenue path: $49-149/month per agent hosted, or pay-per-pull.

Product 3 — AgentIRL / cloud.viktron.ai
Observability + reliability layer for ANY agent framework. The "Datadog for agents." This is the biggest market ($50B by 2030) but also the hardest to build and sell.

My honest recommendation on priority:

Don't try to build full patient intake automation right now — it has too many third-party dependencies (Twilio A2P, EHR APIs, HIPAA) that block you.

Instead:

Ship the per-agent console UIs (Option A we agreed on) — makes rent.viktron.ai actually demonstrable in days
The console IS the MVP of AgentIRL — when someone runs docker run agent-patient-intake and sees a purpose-built UI with live logs, task traces, cost per task, step success rates — that IS the agent observability story, shipped inside every image
The console you build for patient-intake becomes the seed of the cloud monitoring platform. Same data, same design, just aggregated across all your customers' agents on the cloud version.

Want me to start with the per-agent console design now — starting with patient-intake — keeping it scoped to what's buildable without EHR/Twilio dependencies?

