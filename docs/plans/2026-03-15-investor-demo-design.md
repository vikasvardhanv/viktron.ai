# Investor Demo Page — Design Doc
**Date:** 2026-03-15
**Route:** `/demo`
**Goal:** Public, no-login investor demo at `viktron.ai/demo`

## What We're Building

A polished white-theme demo page where an investor clicks "Send to Agents" and watches a scripted agent workflow play out in real time. The CEO's plan step makes a real Anthropic API call; all other steps are scripted with realistic delays.

## Scenario

**Prompt (pre-filled, locked):**
> "Launch our new AI consulting service — draft an outreach campaign and identify our first 10 target customers."

**5-stage flow:**
1. Founder clicks "Send to Agents"
2. **CEO Agent** → real Anthropic API call → streams a live delegation plan
3. **Sales Agent** → scripted → identifies 10 named target companies with rationale
4. **Content Agent** → scripted → drafts 3-email outreach sequence
5. **CEO Agent** → scripted summary → "Campaign ready. 10 targets identified. Outreach queued."

## Design

- **Theme:** White background, blue-600/indigo-600 accents — matches existing Viktron site
- **Layout:** Two-column (left: command panel, right: agent activity feed)
- **Left (40%):** Locked founder prompt card + "Send to Agents" blue gradient button + company context badge
- **Right (60%):** Scrolling agent feed — role avatar, typing indicator, streamed text per agent
- **Top:** Hero banner with "live AI" trust badge
- **Bottom:** CTA — "Ready to deploy your own agent team?" → links to /contact

## Files

- `pages/InvestorDemo.tsx` — new page component
- `App.tsx` — add `/demo` route (public, no ProtectedRoute)
- Backend: CEO plan calls `POST /api/teams/{demo_team_id}/message` or directly hits Anthropic via a proxy endpoint

## API Strategy

The CEO plan step calls the existing backend at `api.viktron.ai`. A pre-seeded demo team (created once manually) handles the real LLM call. The frontend streams the response and then continues with scripted steps 3–5.

If the backend call fails, fall back to a scripted CEO response so the demo never breaks.
