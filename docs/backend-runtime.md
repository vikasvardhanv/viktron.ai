# Backend Runtime

## Current model

- `viktron-api`: receives HTTP and Slack traffic, stores tasks, exposes status
- `viktron-worker`: claims queued tasks and executes them
- `lightagent-style orchestration`: planner, memory, tool routing, and branch selection live inside Viktron
- Shared persistent volume at `/workspaces`
- Shared Postgres queue via `agent_tasks`

## Workspace model

Each logical workspace gets a persistent filesystem under:

- `/workspaces/<workspace>/work`
- `/workspaces/<workspace>/repos`
- `/workspaces/<workspace>/downloads`
- `/workspaces/<workspace>/logs`

This is the closest current equivalent to a persistent Linux workspace.

## How terminal execution works

Shell-backed tasks use `/bin/bash -lc "<script>"` from the worker container.
The worker sets these environment variables for every run:

- `VIKTRON_WORKSPACE`
- `VIKTRON_WORKSPACE_ROOT`
- `VIKTRON_WORK_DIR`
- `VIKTRON_REPOS_DIR`
- `VIKTRON_DOWNLOADS_DIR`
- `VIKTRON_LOGS_DIR`

Every run is logged as JSON in the workspace `logs` directory.

## Scaling guidance

Do not spin up one Docker container per normal task.

For 100 users or 100 concurrent tasks, the better model is:

1. API nodes stay stateless.
2. Tasks are queued in Postgres.
3. A worker pool processes tasks.
4. Most tasks run inside long-lived worker containers.
5. Only high-trust or high-risk tasks use ephemeral isolated containers.

## Recommended production modes

### Standard tasks

- research
- summaries
- data transforms
- document generation
- Slack responses

Run these inside the normal worker pool.

### Isolated tasks

- arbitrary shell from user-provided prompts
- third-party code execution
- repo mutation with secrets
- browser automation against authenticated systems

Run shell and repo mutation jobs in ephemeral job containers. Browser automation now has a Browser Use adapter for web-first tasks; use isolated infrastructure for high-trust auth workflows.

## Why not one container per task?

- startup overhead is high
- container scheduling latency adds up
- cost scales badly
- 100 simultaneous lightweight tasks do not need 100 isolated runtimes

Queue + worker pool is the default. Ephemeral containers are the exception path.
