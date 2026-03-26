name: integrations
description: Check, connect, and configure third-party integrations. Use when managing integrations or adding

name: integrations
description: Check, connect, and configure third-party integrations. Use when managing integrations or adding
custom API connections.
When you need to use an integration that the user hasn't connected yet, or when a user asks about available
integrations, use this skill to guide them to the appropriate connection page.
Reference Files
Available integrations: See /work/sdk/docs/available_integrations.json for the complete list of
integrations that CAN be connected. One integration per line (JSON format) with name, slug, description,
connect_url, integration_type, and auth_type. Use grep to search by name or description.
Connected integrations:
MCP integrations have dedicated files under /work/sdk/tools/ (e.g., mcp_linear.py, mcp_hubspot.py).
Pipedream integrations have dedicated files under /work/sdk/tools/ using pd_.py (e.g., pd_attio.py).
Custom API integrations have dedicated files under /work/sdk/tools/ using custom_api_.py.
Built-in OAuth integrations (e.g., Google Drive, OneDrive, Notion) are grouped into service modules like 
google_drive_tools.py, onedrive_tools.py, notion_tools.py.
Use /work/sdk/docs/tools.md as the source of truth for currently available tool functions.
Custom API integrations: See references/custom-api-integration.md for adding direct HTTP API
connections. Only use this if the service is NOT in the 3000+ integrations listed in 
available_integrations.json - always check there first!
Checking Connection Status
To see which integrations are currently connected:
# 1) Full callable tool list (authoritative)
cat /work/sdk/docs/tools.md
# 2) Optional: quickly check for a specific integration/tool prefix
grep -nE "mcp_linear|pd_attio|custom_api_" /work/sdk/docs/tools.md || true
When to Use
A tool call fails because the required integration isn't connected
The user asks what integrations are available to connect
The user asks what integrations are already connected
The user asks how to connect a specific service (e.g., "How do I connect Linear?")
You need access to a service that requires user authorization
The user needs a custom API integration (only if the service is NOT in available_integrations.json)
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
19
Checking if User Has a Viktor Account
Before sharing a connect URL with a Slack user, check if they have a Viktor account (has_viktor_account field).
If not, use coworker_invite_slack_user_to_team to invite them first.
uv run python -c "import asyncio; from sdk.tools.slack_admin_tools import 
coworker_list_slack_users; print(asyncio.run(coworker_list_slack_users()))"
How to Request Connection
Check if user has Viktor account: Use coworker_list_slack_users to verify the user has 
has_viktor_account: true
Invite if needed: If they don't have a Viktor account, use coworker_invite_slack_user_to_team first
Check if already connected: Verify from /work/sdk/docs/tools.md (source of truth). Optionally use grep
on that file for a specific slug/tool prefix.
Find the slug: Look up the integration slug in /work/sdk/docs/available_integrations.json (use grep
to search by name).
Get the connect URL: Use the SDK helper with the slug to get the URL with thread tracking:
Explain the need: Tell the user what you're trying to do and why the integration is needed
uv run python -c "from sdk.utils.integrations import get_integration_connect_url; 
print(get_integration_connect_url('SLUG'))"
Share the link: Send the URL to the user. Once they connect, the conversation resumes automatically.
Example Response Format
When an integration needs to be connected, format your message like this:
I'd love to help you create that issue in Linear! However, I notice that Linear
isn't connected to your account yet.
Please connect it here: {url from get_integration_connect_url("linear")}
Once you've connected it, I'll continue automatically.
Important Notes
Use the get_integration_connect_url(slug) helper from sdk.utils.integrations to get connect URLs
— it automatically includes thread tracking so the conversation resumes after connection.
The user must complete the OAuth flow in their browser
Some integrations (like Salesforce) have additional setup steps
After connection, the SDK is regenerated and new tool files appear in /work/sdk/tools/
Only users with Viktor accounts can connect integrations - check has_viktor_account first
Users can toggle whether each tool requires manual approval (or runs automatically) in their integration
settings at https://app.getviktor.com/integrations/
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
20
