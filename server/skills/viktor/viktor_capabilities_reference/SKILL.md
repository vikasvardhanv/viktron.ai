name: viktor_capabilities_reference
description: Technical reference for Viktor skills, capabilities, tools, and integration points.

Reference imported from viktor_skills_capabilities.pdf

TECHNICAL REFERENCE
Viktor Skills &
CapabilitiesA detailed breakdown of every skill, tool, and capability
available — with technical details, supported formats,
and integration points.
Prepared for viktronai  ·  March 2026  ·  v1.0  ·  18 Skills 
1
All Skills
01 Browser Automation
02 Codebase Engineering
03 Word Document Editing (DOCX)
04 Excel Spreadsheet Editing
05 General Tools (Search, Email, Media)
06 Third-Party Integrations
07 PDF Creation
08 PDF Form Filling
09 PDF Signing
10 PowerPoint Editing (PPTX)
11 Programmatic Video (Remotion)
12 Scheduled Crons & Automation
13 Skill Creation & Memory
14 Slack Administration
15 Viktor Account Management
16 Viktor Spaces (Full-Stack Apps)
17 Workflow Discovery
2
18 Thread Orchestration
3
🌐
Browser Automationskills/browser
Browse websites, fill forms, scrape data, and automate web tasks using a real
browser powered by Playwright and Browserbase. Every session is recorded for
review.
CAPABILITIES
HOW IT WORKS
Sessions run on Browserbase with a real Chromium browser. Named sessions persist across script runs,
so I can do multi-step web tasks. Two modes: Exploration (step-by-step, screenshot each step) and 
Automation (single script for known flows).
Key detail: Sessions are recorded and viewable at a recording URL — you can watch exactly what
Viktor did in the browser, step by step.
Navigate to any URL, go back/forward, reload pages▸
Click, double-click, right-click, drag elements on page▸
Type text, press keyboard shortcuts (Enter, Tab, Ctrl+A, etc.)▸
Scroll in any direction (up, down, left, right)▸
Take screenshots and accessibility tree snapshots▸
Download files from web pages▸
Fill complex forms with multiple fields▸
Execute JavaScript via the Playwright Page API▸
Proxy support for geo-restricted content▸
4
💻
Codebase Engineeringskills/codebase_engineering
Work directly on your GitHub repositories — clone repos, create feature
branches, write code, submit pull requests, and debug issues like a software
engineer.
CAPABILITIES
WORKFLOW
I follow a professional git workflow: (1) Pull latest main → (2) Create a worktree with a feature branch → 
(3) Make changes and test → (4) Push and create PR → (5) Clean up after merge. Branch naming: feat/,
fix/, refactor/.
REQUIRES
GitHub integration must be connected. Use the integrations page to authorize Viktor for your
repositories.
Clone and manage GitHub repositories▸
Create feature branches using git worktrees (main branch stays clean)▸
Write, modify, and refactor code across any language▸
Open pull requests with descriptive titles and bodies▸
Debug issues by tracing through codebases▸
Write and run test suites▸
Generate code documentation▸
5
📝
Word Document Editingskills/docx_editing
Create and edit Word documents (.docx) while preserving all original formatting
— fonts, styles, colors, and layout.
CAPABILITIES
TECHNICAL DETAILS
Uses the python-docx library with run-aware replacement. Before editing, Viktor reads the full
document structure to identify text split across multiple runs, ensuring formatting is never accidentally
destroyed.
Create new Word documents from scratch▸
Edit existing .docx files preserving all formatting▸
Replace text across multiple runs without breaking styles▸
Add/remove sections, paragraphs, tables, and images▸
Merge multiple documents into one▸
Generate documents from templates with variable substitution▸
6
📊
Excel Spreadsheet Editingskills/excel_editing
Create and modify Excel spreadsheets with proper formulas, formatting, charts,
and multi-sheet structures. Financial-model quality output.
CAPABILITIES
QUALITY STANDARDS
Standard Details
Formulas over hardcoded valuesAll calculations use Excel formulas for dynamic updates
Zero formula errors Validated: no #REF!, #DIV/0!, #VALUE!, #N/A, #NAME?
Color coding Blue = inputs, Black = formulas, Green = cross-sheet links
Division protection =IF(B1=0,0,A1/B1) prevents #DIV/0!
Create workbooks with multiple sheets, formulas, and formatting▸
Edit existing .xlsx files preserving structure and formulas▸
Build financial models with industry-standard color coding▸
Dynamic formulas (SUM, VLOOKUP, IF, INDEX/MATCH, etc.)▸
Number formatting: currency, percentages, dates, custom masks▸
Data analysis with pandas integration▸
Automated formula validation and error checking▸
7
🧰
General Toolsskills/general_tools
A suite of general-purpose tools — web search, email, image generation, video
generation, text-to-speech, speech-to-text, file conversion, and library
documentation lookup.
TOOL INVENTORY
Tool What It Does
Web Search Search the web for real-time information — news, prices, facts, events. Returns
formatted answers with sources.
Send Email Compose and send emails with attachments, CC/BCC, and reply threading.
Markdown body support.
Image
Generation
Generate or edit images from text prompts. Logos, illustrations, social media
graphics. Multiple aspect ratios.
Video
Generation
Create videos from text or reference images. Models: Sora 2 Pro, Veo 3.1, Grok. Up to
1080p.
Text-to-SpeechConvert text to natural speech. 10+ voices (Rachel, Josh, Bella, etc.) via ElevenLabs.
Speech-to-TextTranscribe audio files to text with timestamps. Supports multiple languages.
File-to-
Markdown Convert PDF, DOCX, XLSX, PPTX, RTF, ODS, ODP to readable markdown.
Library Docs Look up current documentation for any library, framework, or API with verified
examples.
VIDEO MODELS COMPARED
Model Best For
Veo 3.1 Audio Default. High quality with synchronized audio.
Sora 2 Pro Complex scenes, image-guided video. Up to 1024p.
Grok Imagine Budget option, fast turnaround. 480p or 720p.
8
🔌
Third-Party Integrationsskills/integrations
Connect Viktor to 3,000+ services via OAuth, API keys, or custom API
connections. CRM, project management, databases, payments, analytics, and
more.
INTEGRATION TYPES
HOW CONNECTION WORKS
(1) Viktor identifies that an integration is needed → (2) Sends you a connection link → (3) You complete
the OAuth flow in your browser → (4) Viktor automatically gains access to the new tools and continues
the task.
POPULAR INTEGRATIONS
Category Services
CRM HubSpot, Salesforce, Attio, Pipedrive
Project Management Linear, Jira, Asana, Monday.com, Trello
Cloud Storage Google Drive, OneDrive, Dropbox, Notion
Communication Slack (native), Gmail, Outlook
Payments Stripe, QuickBooks, Xero
Development GitHub, GitLab, Bitbucket
Analytics Google Analytics, Mixpanel, Amplitude
Approval controls: Every tool action can be configured as auto-approve, broad approval,
specific approval, or forbidden — giving you full control over what Viktor can do autonomously.
MCP Integrations — Direct protocol connections (e.g., Linear, HubSpot)▸
Pipedream Integrations — 3,000+ services via Pipedream's catalog▸
Built-in OAuth — Google Drive, OneDrive, Notion, and others▸
Custom API — Connect any REST API with custom endpoint configuration▸
9
📄
PDF Creationskills/pdf_creation
Create beautifully designed PDF documents from HTML/CSS using WeasyPrint.
Professional reports, proposals, branded documents — with custom
typography, colors, and layouts.
CAPABILITIES
DESIGN PHILOSOPHY
Viktor avoids generic "AI look" design. Each PDF is crafted with distinctive typography, cohesive color
themes, deliberate whitespace, visual hierarchy, and context-specific character. Light or dark themes,
varied fonts, creative layouts.
Create PDFs from HTML/CSS with full design control▸
Custom typography — pre-installed fonts (Roboto, Lato, EB Garamond, Fira Code) plus Google Fonts▸
Icon support with Font Awesome and Material Design Icons▸
Proper page breaks — avoid cutting elements in half▸
Brand-aware design — can extract styles from your website▸
Flexbox layouts for complex card and column designs▸
Verify output with PyMuPDF before delivery▸
10
📋
PDF Form Fillingskills/pdf_form_filling
Programmatically fill out PDF form fields — both interactive fillable forms and
non-interactive forms using coordinate-based text placement.
CAPABILITIES
HOW IT WORKS
Uses PyMuPDF (fitz) to first scan for fillable fields. If found, fills them natively. If not, uses coordinate-
based placement — visually identifying where text should go and placing it precisely on the page.
Detect and list all fillable fields in a PDF▸
Fill interactive form fields (text boxes, checkboxes, dropdowns)▸
Handle non-interactive PDFs using visual coordinate placement▸
Preserve original PDF formatting and layout▸
Batch fill multiple forms from data▸
11
✍️
PDF Signingskills/pdf_signing
Add digital, handwriting-style signatures to PDF documents — contracts,
agreements, and any document requiring a signature.
CAPABILITIES
Generate handwriting-style signatures using the Kalam font▸
Place signatures at precise locations on any PDF page▸
Sign contracts, agreements, and legal documents▸
Preserve original document formatting▸
12
🎯
PowerPoint Editingskills/pptx_editing
Create and edit PowerPoint presentations (.pptx) — pitch decks, quarterly
reviews, training materials, and client presentations with proper layouts and
formatting.
CAPABILITIES
TECHNICAL DETAILS
Built with python-pptx. Viktor reads the presentation structure first to understand existing content,
then uses blank slide layouts or cleans up placeholders to avoid unwanted text artifacts.
Create new presentations from scratch▸
Edit existing .pptx files while preserving styles▸
Add and modify slides, text, images, and shapes▸
Work with slide layouts and master templates▸
Remove placeholder text ("Insert text here") automatically▸
Read and understand existing presentation structures▸
13
🎥
Programmatic Video (Remotion)skills/remotion_video
Create real MP4 videos programmatically using Remotion — a React-based
video framework. Motion graphics, animated explainers, data visualizations, and
videos with captions.
CAPABILITIES
USE CASES
Product demos, explainer videos, social media content, data storytelling, animated presentations,
podcast visualizations, marketing videos, and any content that benefits from programmatic video
generation.
Create videos as React components — every frame is a render▸
Animations using spring physics, easing curves, and interpolation▸
Scene transitions (fade, slide, wipe, etc.)▸
Text animations and typography effects▸
Audio integration — import, trim, adjust volume and speed▸
Audio visualization — spectrum bars, waveforms, bass-reactive effects▸
Captions and subtitles with word-level timing▸
3D content with Three.js and React Three Fiber▸
Charts and data visualizations (bar, pie, line, stock)▸
GIF embedding, Lottie animations, map animations▸
Tailwind CSS and Google Fonts support▸
Light leak overlays and transparent video rendering▸
FFmpeg operations for trimming, silence detection, format conversion▸
14
⏰
Scheduled Crons & Automationskills/scheduled_crons
Create, modify, and manage scheduled tasks — both AI-powered agent crons
(for complex reasoning) and lightweight script crons (for deterministic tasks).
CRON TYPES
Type Best For How It Works
Agent Cron Complex tasks needing judgmentRuns a full AI agent with a prompt on schedule
Script Cron Deterministic, fast tasks Runs a Python script directly — no AI overhead
FEATURES
Cost tip: Agent crons consume credits each run. Use condition scripts to skip unnecessary runs,
or limit to work hours. Script crons are much cheaper for simple tasks.
Any cron schedule: hourly, daily, weekly, custom expressions▸
Conditional execution — only run when conditions are met (new data, business hours, thresholds)▸
Multiple AI models available: Claude Opus, GPT-5.4, Claude Sonnet, Gemini Flash▸
Custom Slack display names per cron▸
Manual trigger for immediate testing▸
Learnings file for self-improvement across runs▸
15
🧠
Skill Creation & Memoryskills/skill_creation
Viktor's persistent memory system — skills are SKILL.md files that store
knowledge, best practices, workflows, and scripts so they persist across
conversations and improve over time.
HOW IT WORKS
WHAT GETS STORED
Why This Matters
Unlike typical AI assistants that forget everything between conversations, Viktor accumulates
knowledge over time. The more you work with Viktor, the better it gets — learning your
preferences, understanding your processes, and avoiding past mistakes.
Skills are structured knowledge files (Markdown with YAML frontmatter)▸
Each skill has a description that auto-loads into Viktor's context▸
Skills can include scripts, reference docs, templates, and assets▸
Viktor reads relevant skills before any task, and updates them after learning▸
New skills can be created for any domain or workflow▸
Company information and team structure▸
Best practices for your specific workflows▸
Reusable scripts and automation patterns▸
Lessons learned and edge cases▸
Integration configurations and preferences▸
16
💬
Slack Administrationskills/slack_admin
Manage the Slack workspace — list and join channels, open group DMs, look up
users, invite team members, check message reactions, and report issues.
AVAILABLE ACTIONS
Action Description
List Channels See all channels with access status (public/private, bot access)
Join/Leave Channels Join public channels or leave channels (with approval)
Open Group DMs Start multi-person conversations
List Users Look up users with details (name, email, role, Viktor account status)
Invite to Team Invite Slack users to join Viktor with a personal message
Check Reactions Get emoji reactions on specific messages (counts and users)
Report Issues Submit anonymized bug reports to the Viktor team
17
⚙️
Viktor Account Managementskills/viktor_account
Manage your Viktor account — check subscription details, analyze credit usage,
optimize costs, configure integration permissions, and navigate account
settings.
ACCOUNT TOOLS
PLANS
Plans range from $50/month (20,000 credits) to $5,000/month (2,000,000 credits). Annual billing
saves 15%. Trial users receive 10,000 reward credits that never expire.
COST OPTIMIZATION
Subscription Info — Plan name, credit balance, burn rate, projected run-out date▸
Usage Overview — Daily, weekly, and monthly credit consumption with breakdowns▸
Usage Threads — Find the most expensive tasks/crons for cost optimization▸
Integration Settings — Check approval levels for every tool action▸
Identify expensive crons and reduce frequency or add conditions▸
Use cheaper AI models for routine tasks▸
Start new threads for unrelated tasks (avoids context accumulation)▸
Minimize unnecessary image generation and web browsing▸
Monitor burn rate to prevent credit exhaustion▸
18
🚀
Viktor Spaces (Full-Stack Apps)skills/viktor_spaces_dev
Build and deploy complete web applications with a real-time database, user
authentication, frontend hosting, and a custom subdomain — from idea to live
app.
WHAT EACH APP INCLUDES
DEVELOPMENT WORKFLOW
(1) Initialize project → (2) Implement features → (3) Write E2E tests → (4) Build & test → (5) Deploy
preview → (6) User reviews with screenshots → (7) Deploy to production. Separate dev/prod databases
ensure safe iteration.
APP MANAGEMENT TOOLS
Tool Purpose
init_app_project Create a new app with Convex + Vercel
deploy_app Deploy to preview or production
list_apps List all created apps
get_app_status Get URLs and deployment status
query_app_database Query data from either environment
delete_app_project Delete an app and all its resources
Real-time Database — Convex backend with separate dev and production environments▸
User Authentication — Email/password with OTP verification, password reset▸
Frontend Hosting — Deployed on Vercel with custom subdomain (yourapp.viktor.space)▸
53 UI Components — Pre-installed shadcn/ui: Button, Card, Dialog, Form, Table, etc.▸
Tailwind CSS v4 — With light/dark theme support▸
AI Tool Gateway — Apps can call any Viktor SDK tool (search, image gen, etc.)▸
E2E Testing — Playwright test utilities with auto-login test user▸
19
🔍
Workflow Discoveryskills/workflow_discovery
Proactively investigate how team members work via Slack history, identify pain
points and repetitive tasks, and propose personalized automation workflows.
HOW IT WORKS
PROPOSAL QUALITY
Every proposal includes: what was observed (the pain point), what Viktor would do (the solution), 
how it works (implementation approach — cron, script, on-demand), what you'd get (the output), and 
what's needed (inputs, integrations).
Phase 1: Check connected integrations to understand available tools▸
Phase 2: Deep-read Slack messages per person — their role, complaints, recurring tasks, tools▸
Phase 3: Generate specific, implementable workflow ideas (not vague suggestions)▸
Phase 4: Identify integration opportunities that would unlock more automation▸
Phase 5: DM personalized proposals to team members with clear implementation plans▸
Phase 6: When approved, ask clarifying questions then build and test the workflow▸
20
🔀
Thread Orchestrationskills/thread_orchestration
Monitor and coordinate parallel agent threads — fan-out work, track progress,
wait for completion, and compile results from multiple concurrent tasks.
CAPABILITIES
USE CASES
Research tasks that need parallel investigation, complex reports with multiple data sources, batch
processing with result compilation, and any workflow where speed improves from parallelization.
Summary
Viktor is a complete AI coworker with 18 core skills spanning research, document creation,
media production, software engineering, web development, automation, browser tasks,
communication, integrations, and data analysis. It learns and improves over time through its skill
memory system, and connects to 3,000+ services to automate work across your entire tech
stack.
List Running Paths — See all currently active agent threads▸
Get Path Info — Inspect any path (cron or thread) for detailed status▸
Fan-Out / Fan-In — Spawn multiple parallel threads, wait for all to complete, compile results▸
Dependency Management — Create threads that wait for other paths to finish before starting▸
Timeout Handling — Set maximum wait times to prevent stuck workflows▸
21
