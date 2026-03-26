name: viktor_use_cases_reference
description: Use case reference for research, automation, web apps, documents, engineering, and workflow orchestration.

Reference imported from viktor_use_cases.pdf

COMPREHENSIVE GUIDE
Viktor Use CasesEverything your AI coworker can do — from
research and reports to full-stack apps and
automated workflows.
Prepared for viktronai  ·  March 2026  ·  v1.0 
1
Contents
01 Research & Analysis 6 use cases
02 Document Creation & Editing 8 use cases
03 Media & Creative 6 use cases
04 Software Engineering 6 use cases
05 Web Apps & Dashboards 5 use cases
06 Automation & Scheduling 7 use cases
07 Web Browsing & Data Extraction 5 use cases
08 Communication & Email 5 use cases
09 Integrations & Workflow Orchestration 5 use cases
10 Data & Spreadsheets 5 use cases
2
01
Research & Analysis
Deep research, fact-finding, and analytical reports on any topic.
🔍
Deep Research Reports
Give me any topic and I'll produce a comprehensive research report — market analysis, competitive
landscape, industry trends, technology comparisons. I search the web, cross-reference sources, and
compile everything into a formatted PDF or document.
web search pdf creation analysis
📊
Competitor Analysis
Research competitors' products, pricing, positioning, and strategy. I browse their websites, read
reviews, analyze their public data, and deliver a side-by-side comparison with strategic insights.
browser web search pdf creation
📰
News & Industry Monitoring
Set up daily or weekly digests on topics you care about — industry news, regulatory changes,
competitor activity, technology developments. Delivered to Slack on a schedule.
scheduled cron web search slack
📋
Summarize Documents & Data
Upload any document — PDF, Word, Excel, PowerPoint — and I'll read it, extract the key points, and
produce a clean summary. Great for contracts, reports, academic papers, or lengthy proposals.
file-to-markdownanalysis
3
💡
Technical Feasibility Research
Exploring a new technology, API, or framework? I'll research it, read the documentation, evaluate pros/
cons, and give you an honest assessment with code examples.
library docs web search coding
🧮
Data Analysis & Insights
Give me a dataset (CSV, Excel, database export) and I'll analyze it — find patterns, calculate statistics,
create visualizations, and present findings in a clear report.
python excel pdf creation
4
02
Document Creation & Editing
Create and modify PDFs, Word docs, Excel files, and PowerPoint
presentations.
📄
PDF Reports & Documents
Create beautiful, professionally designed PDF reports from scratch — financial reports, audit
documents, proposals, client deliverables. Custom HTML/CSS design with your brand colors and
typography.
pdf creation html/css branding
📝
Fill Out PDF Forms
Got a PDF form that needs filling? I detect fillable fields, populate them with your data, and handle
both interactive forms and coordinate-based placement for non-interactive ones.
pdf form fillingautomation
✍️
Sign PDF Documents
Add digital signatures to PDFs — place a handwriting-style signature on contracts, agreements, or any
document that needs signing.
pdf signing
📃
Word Document Editing
Create or modify Word documents (.docx) — update content, reformat sections, merge documents, or
generate new ones from templates while preserving all formatting.
docx editing python-docx
5
📊
Excel Spreadsheet Creation
Build Excel files with formulas, formatting, charts, and multiple sheets. Financial models, data
templates, trackers — with proper Excel formulas (not hardcoded values) so your spreadsheets stay
dynamic.
excel editing formulas charts
🎯
PowerPoint Presentations
Create or edit PowerPoint decks — pitch decks, quarterly reviews, training materials. I handle layouts,
content, and formatting in .pptx format.
pptx editing python-pptx
🔄
Document Format Conversion
Convert between document formats — PDF to Markdown, DOCX to PDF, Excel to CSV, PPTX to images,
and more. Extract text from any document type.
file-to-markdownconversion
📑
Template-Based Document Generation
Create reusable document templates and generate batches of personalized documents — invoices,
certificates, letters, reports — from your data.
automation pdf creation docx
6
03
Media & Creative
Generate images, videos, audio, and motion graphics.
🎨
AI Image Generation & Editing
Generate illustrations, logos, social media graphics, mockups, thumbnails, and concept art. Edit
existing images — change backgrounds, add elements, adjust styles. Supports multiple aspect ratios.
image generationediting creative
🎬
AI Video Generation
Generate short videos from text prompts or reference images — product animations, cinematic clips,
social media content. Multiple models available including Sora, Veo, and Grok.
video generationsora veo
🎥
Programmatic Video Production
Create full-length videos with Remotion — motion graphics, animated explainers, data visualizations,
audio-reactive visuals, and videos with captions/subtitles. Full React-based video pipeline.
remotion react animation
🔊
Text-to-Speech Audio
Convert text to natural-sounding speech with multiple voices (Rachel, Josh, Bella, and more). Generate
voiceovers, podcasts, audio narrations, and accessibility content.
elevenlabs tts audio
7
🎙️
Speech-to-Text Transcription
Transcribe audio files to text — meeting recordings, interviews, podcasts, voice notes. Get full text plus
timestamped chunks for easy reference.
elevenlabs stt transcription
📈
Data Visualizations & Charts
Create publication-quality charts and dashboards using Python (matplotlib, plotly, seaborn) — bar
charts, line graphs, heatmaps, interactive plots, exported as images or HTML.
python matplotlib plotly
8
04
Software Engineering
Code on your repositories — branches, PRs, debugging, and new features.
🛠️
Code on Your Repositories
Connect GitHub and I'll clone your repos, create branches, write code, and open PRs. Bug fixes, new
features, refactors — I follow proper git workflows with worktrees so your main branch stays clean.
github git PRs
🐛
Bug Investigation & Fixing
Describe a bug and I'll investigate — read the codebase, trace the issue, identify root causes, and
submit a fix. I understand complex codebases across multiple languages.
debugging codebase analysis
📖
Code Review & Documentation
Review PRs, suggest improvements, add documentation to existing code, or generate API docs. I check
for best practices, security issues, and maintainability.
review docs quality
🧪
Write & Run Tests
Generate test suites — unit tests, integration tests, end-to-end tests. I write them, run them, fix
failures, and ensure coverage. Works with any testing framework.
testing playwright pytest
9
📚
Library Docs Lookup
Need to use a library but unsure about the API? I look up current documentation for any library,
framework, or tool — verified examples, correct syntax, latest APIs.
docs lookup context7
⚡
Script Writing & Automation
Write Python scripts for any task — data processing, API integrations, file manipulation, web scraping,
automation pipelines. I write, test, and iterate until it works.
python scripting automation
10
05
Web Apps & Dashboards
Full-stack mini apps with database, auth, and hosting via Viktor Spaces.
🌐
Custom Web Applications
I build and deploy full-stack web apps — complete with a real-time database, user authentication, and
hosting on a custom subdomain (yourapp.viktor.space). From idea to live app.
viktor spaces convex react
📊
Internal Dashboards & Tools
Need a KPI dashboard, admin panel, or internal tool? I'll build it with real-time data, charts, filters, and
role-based access. Deployed and accessible from anywhere.
dashboard shadcn/ui tailwind
🧰
Interactive Prototypes
Quickly prototype ideas as working web apps — test concepts, validate UX flows, or create demos for
stakeholders. Full functionality, not just mockups.
prototyping rapid dev
🗃️
CRUD Applications
Customer portals, inventory trackers, project management tools, CRM-like apps — any app that
manages data with create/read/update/delete operations.
database auth hosting
11
🤖
AI-Powered Apps
Build apps that leverage AI tools — search, image generation, text-to-speech — through Viktor's tool
gateway. Create intelligent apps without managing AI infrastructure.
ai tools tool gateway
12
06
Automation & Scheduling
Set up recurring tasks, cron jobs, and automated workflows.
⏰
Scheduled AI Tasks (Agent Crons)
Schedule Viktor to run tasks on any cadence — daily standup summaries, weekly reports, hourly
monitoring. I use AI reasoning to handle complex, variable tasks that require judgment.
cron agent scheduling
📜
Automated Script Execution
Run Python scripts on a schedule — data syncs, cleanup routines, health checks, metric aggregations.
Lightweight, fast, and cost-effective for deterministic tasks.
script cron python
🔔
Conditional Monitoring
Only run when conditions are met — new Slack messages, data anomalies, metric thresholds, file
updates. Condition scripts check before each execution to avoid unnecessary runs.
conditional monitoring
📧
Automated Reports & Digests
Daily/weekly/monthly reports delivered to Slack or email — sales summaries, customer activity, team
updates, metrics dashboards. Fully automated on your schedule.
reports slack email
13
🔄
Multi-Step Workflow Orchestration
Coordinate complex workflows with parallel threads — fan-out tasks, wait for results, compile outputs.
Handle dependencies, timeouts, and error recovery gracefully.
orchestration parallel
🧠
Custom Skill / Workflow Memory
I learn and remember your processes. When I discover a new workflow, I save it as a reusable skill — so
next time it's faster and more accurate. Your team's institutional knowledge, codified.
skills memory
🔗
API-to-API Data Pipelines
Connect services that don't natively integrate — pull data from one API, transform it, push it to
another. Schedule data syncs, migrations, and cross-platform updates.
api integration pipeline
14
07
Web Browsing & Data Extraction
Browse websites, scrape data, and automate web-based tasks.
🌍
Web Scraping & Data Collection
Extract structured data from any website — product listings, directories, job postings, public records. I
use a real browser (Playwright) so JavaScript-heavy sites work perfectly.
browser playwright scraping
📱
Web Task Automation
Automate repetitive web tasks — fill forms, click through workflows, submit applications, download
files. Anything you do in a browser, I can automate.
browser automation
📸
Website Screenshots & Monitoring
Take screenshots of web pages, monitor visual changes, track competitor websites. Set up recurring
checks to detect updates to important pages.
screenshots monitoring
🔎
Price & Product Monitoring
Track prices, availability, and product listings across e-commerce sites. Get alerts when prices drop or
products come back in stock.
browser cron alerts
15
🧪
Website Testing & QA
Test your web applications — functional testing, link checking, form validation, cross-page navigation.
Catch issues before your users do.
testing qa browser
16
08
Communication & Email
Send emails, manage Slack, and streamline team communication.
✉️
Send Emails with Attachments
Compose and send emails — professional correspondence, report distribution, client updates.
Supports attachments, CC/BCC, reply threading, and markdown formatting.
email attachments
📬
Email Monitoring & Response
Monitor incoming emails, process attachments, extract key information, and draft or send responses.
Set up automated email workflows for common patterns.
email inbox automation
💬
Slack Workspace Management
List channels, join conversations, look up users, check reactions, and coordinate across your Slack
workspace. I'm a native Slack citizen — @ me anywhere.
slack admin channels
📢
Content Drafting & Distribution
Draft announcements, newsletters, social posts, or internal communications. I write, you review, then
we distribute across channels.
writing distribution
17
👥
Team Onboarding & Invites
Invite team members to Viktor, set up integrations, and configure workflows for new hires. Help them
discover what Viktor can do for their specific role.
team onboarding
18
09
Integrations & Workflow Orchestration
Connect 3,000+ services and build cross-platform workflows.
🔌
3,000+ Service Integrations
Connect to thousands of services — CRM (HubSpot, Salesforce), project management (Linear, Jira,
Asana), databases, payment platforms, analytics tools, and more. OAuth and API key based.
oauth api pipedream mcp
☁️
Cloud Storage Integration
Connect Google Drive, OneDrive, Notion, and other storage/knowledge platforms. Read, write, and
organize files across your cloud services.
google drive onedrive notion
🔧
Custom API Connections
Need to connect to a service that isn't in our catalog? I can set up custom API integrations with any
REST API — just provide the endpoint details and authentication.
custom api http
🔀
Cross-Platform Workflows
Build workflows that span multiple services — e.g., when a deal closes in CRM, generate an invoice,
email the client, update the spreadsheet, and notify the team in Slack.
multi-service orchestration
19
⚙️
Approval-Based Tool Execution
Configure which actions need your approval and which run automatically. Fine-grained control over
every tool — from auto-approve for reads to manual approval for writes.
permissions approval safety
20
10
Data & Spreadsheets
Process, transform, and analyze data across formats.
🗄️
Data Cleaning & Transformation
Clean messy datasets — fix formatting, remove duplicates, standardize values, handle missing data.
Transform data between formats and structures for analysis or import.
pandas python etl
📐
Financial Models & Calculators
Build Excel financial models with proper formulas, color-coded inputs, and industry-standard
formatting. Revenue projections, DCF models, budgets, and scenario analysis.
excel formulas finance
🔃
Bulk Data Processing
Process large volumes of data — merge multiple files, batch transformations, aggregate across
sources, and generate consolidated outputs.
batch merge aggregate
📉
Trend Analysis & Forecasting
Analyze historical data to identify trends, seasonality, and patterns. Generate forecasts using
statistical methods and present findings in visual reports.
statistics forecasting visualization
21
💬 How to Get Started
DM me in Slack or @viktor me in any channel. Just describe what you need in plain language —
I'll figure out the rest. No commands to memorize, no setup required. If I need something (like an
integration or file), I'll ask. 
✅
Data Validation & Quality Checks
Validate data against rules — check for consistency, completeness, and accuracy. Run quality checks
on spreadsheets, databases, and data pipelines.
validation quality checks
22
