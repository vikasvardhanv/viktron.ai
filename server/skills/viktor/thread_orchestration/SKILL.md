name: thread_orchestration
description: Monitor and coordinate parallel agent threads. Use when checking thread progress, listing running

name: thread_orchestration
description: Monitor and coordinate parallel agent threads. Use when checking thread progress, listing running
threads, or debugging stuck workflows.
These monitoring tools are available via Python scripts (from sdk.tools.<module> import <function>).
Note: create_thread, send_message_to_thread, and wait_for_paths are native tools — call them directly.
This skill covers the SDK-only *monitoring* tools.
1. List Running Paths — list_running_paths
List all currently running agent threads.
from sdk.tools.thread_orchestration_tools import list_running_paths
result = await list_running_paths()
for path in result.running_paths:
    print(f"Running: {path}")
Input: None
Output: running_paths (list[str]) — paths of currently active threads
When to use: Before creating new threads (check load), monitoring progress of spawned work, debugging
stuck workflows
2. Get Path Info — get_path_info
Get detailed information about any path — works for both cron jobs and threads.
from sdk.tools.thread_orchestration_tools import get_path_info
result = await get_path_info(path="/reports/weekly")
if result.info:
    if result.info.path_type == "cron":
        print(f"Cron: {result.info.cron.title} ({result.info.cron.cron})")
    elif result.info.path_type == "thread":
        print(f"Thread: {result.info.thread.title} - {result.info.thread.status}")
    else:
        print("Path not found")
Input: path (str) — the path to look up
Output: info.path_type ( "cron", "thread", or "not_found"), plus info.cron or info.thread
details
Cron info: id, path, title, description, cron, dependent_paths, deleted, created_at, 
updated_at, threads
Thread info: id, title, status, timestamp, updated, path, thread_type
When to use: Checking if a path exists before creating it, inspecting cron schedules, debugging thread status
• 
• 
• 
• 
• 
• 
• 
• 
38
Common Workflows
Fan-out / fan-in pattern
Create threads with create_thread (native tool)
Call wait_for_paths directly (native tool) with the paths and a timeout
Once complete, compile results
Monitor and report on running work
from sdk.tools.thread_orchestration_tools import get_path_info, list_running_paths
running = await list_running_paths()
for path in running.running_paths:
    info = await get_path_info(path=path)
    if info.info and info.info.path_type == "thread":
        t = info.info.thread
        print(f"{t.title}: {t.status} (updated: {t.updated})")
Quick Reference
Need Tool
List active threads list_running_paths()
Inspect a path get_path_info(path)
These are async SDK tools — run scripts with uv run python script.py.
• 
• 
• 
39
