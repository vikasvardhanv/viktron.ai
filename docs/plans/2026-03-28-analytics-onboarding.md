# Analytics Onboarding & AI Ask Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Full self-serve onboarding flow — client gets invite link, signs up, lands on analytics, sees exactly what to do, installs a JS tracking snippet on their site, and can ask AI questions about their data.

**Architecture:**
- Frontend: AnalyticsApp.tsx gets 3 new views: `onboarding` (empty state wizard), `snippet` (install code), `ai-ask` (natural language chat)
- Backend: one new endpoint `POST /saas/ai/ask` that fetches workspace data + runs it through LLMClient to answer natural language questions
- The JS snippet calls the existing `/saas/events/ingest` endpoint — no new backend infra needed for tracking

**Tech Stack:** React 18, TypeScript, Tailwind, Framer Motion, FastAPI, SQLAlchemy, LLMClient (already exists in backend)

---

### Task 1: Backend — `POST /saas/ai/ask` endpoint

**Files:**
- Modify: `/Users/vikashvardhan/IdeaProjects/viktron-backend/app/api/routes/saas_analytics.py`

**What it does:**
1. Accepts `{ workspace_id, question }` in request body
2. Calls `_ensure_workspace_access` (auth check)
3. Fetches last 30 days of events via `fetch_events`
4. Builds a compact JSON context: event counts by category, top event names, LLM summary, mission summary, tool failures, page_view counts by URL
5. Calls `LLMClient` (anthropic provider, claude-sonnet-4-6) with a system prompt + the context + the user's question
6. Returns `{ answer, workspace_id, generated_at }`

**Add these classes/models just before the router definition (~line 98 area, with other BaseModel classes):**

```python
class AskAIRequest(BaseModel):
    workspace_id: str = Field(..., min_length=2, max_length=120)
    question: str = Field(..., min_length=3, max_length=1000)
```

**Add this endpoint at the end of the file, before any Slack webhook handlers:**

```python
@router.post("/ai/ask")
async def ask_ai_question(
    payload: AskAIRequest,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Answer a natural language question about the workspace's analytics data."""
    from app.services.llm_client import LLMClient
    from collections import Counter

    await _ensure_workspace_access(db, user, payload.workspace_id, require_manage=False, allow_create=False)

    all_events = await fetch_events(db, workspace_id=payload.workspace_id, lookback_hours=30 * 24)
    llm_events = await fetch_events(db, workspace_id=payload.workspace_id, lookback_hours=30 * 24, category="llm")
    mission_events = await fetch_events(db, workspace_id=payload.workspace_id, lookback_hours=30 * 24, category="mission")

    event_counts = Counter(e.event for e in all_events)
    category_counts = Counter(e.category for e in all_events)
    page_views = [e for e in all_events if e.event == "page_view"]
    top_pages = Counter(
        e.properties.get("url", "unknown") for e in page_views
    ).most_common(10) if page_views else []

    llm_summary = summarize_llm_events(llm_events)
    mission_summary = summarize_mission_events(mission_events)
    tool_failures = summarize_tool_failures(all_events)

    context = {
        "workspace_id": payload.workspace_id,
        "total_events_30d": len(all_events),
        "events_by_category": dict(category_counts.most_common(10)),
        "top_event_names": dict(event_counts.most_common(15)),
        "page_views_total": len(page_views),
        "top_pages_by_views": top_pages,
        "llm_metrics": llm_summary,
        "mission_metrics": mission_summary,
        "top_tool_failures": tool_failures[:5],
    }

    system_prompt = (
        "You are an AI analytics assistant for Viktron Analytics. "
        "You have access to real event data for the user's workspace. "
        "Answer questions concisely and specifically using the data provided. "
        "If data is insufficient to answer precisely, say so and suggest what data to collect. "
        "Format numbers clearly. Do not make up data not present in the context."
    )

    user_message = (
        f"Workspace analytics data (last 30 days):\n{context}\n\n"
        f"Question: {payload.question}"
    )

    llm = LLMClient(provider="anthropic", model="claude-haiku-4-5-20251001")
    try:
        answer = await llm.chat(
            messages=[{"role": "user", "content": user_message}],
            system=system_prompt,
            temperature=0.3,
            max_tokens=600,
        )
    except Exception as e:
        answer = f"AI analysis unavailable right now. Raw data: {len(all_events)} events tracked in the last 30 days."

    return {
        "answer": answer,
        "workspace_id": payload.workspace_id,
        "events_analyzed": len(all_events),
        "generated_at": datetime.now(UTC).isoformat(),
    }
```

**Check LLMClient.chat signature** — read the method signature in `/Users/vikashvardhan/IdeaProjects/viktron-backend/app/services/llm_client.py` first to confirm parameter names. Adapt if needed (it may be `system_prompt` not `system`).

**After adding:**
```bash
cd /Users/vikashvardhan/IdeaProjects/viktron-backend
python -c "from app.api.routes.saas_analytics import router; print('import OK')"
```

---

### Task 2: Frontend — empty-state onboarding view in AnalyticsApp

**Files:**
- Modify: `/Users/vikashvardhan/IdeaProjects/viktron.ai/pages/analytics/AnalyticsApp.tsx`

**Detect empty workspace:** After `loadOverview` resolves, check if `overview.kpis[0].value === 0` (total events = 0). If so, set a new state `isNewWorkspace = true`.

**Add `isNewWorkspace` state and detection:**

```tsx
const [isNewWorkspace, setIsNewWorkspace] = useState(false);
```

In `loadOverview`, after setting overview:
```tsx
const data = await res.json();
setOverview(data as OverviewPayload);
// Detect empty workspace — real backend returns total_events = 0 for new workspaces
const totalEvents = typeof data.kpis?.[0]?.value === 'number' ? data.kpis[0].value : 1;
setIsNewWorkspace(totalEvents === 0);
```

**Add `'onboarding'` and `'snippet'` and `'ai-ask'` to the View type:**
```tsx
type View = 'overview' | 'product' | 'engagement' | 'sources' | 'reddit' | 'pricing' | 'onboarding' | 'snippet' | 'ai-ask';
```

**Add 3 new nav items to the `nav` useMemo:**
```tsx
{ id: 'snippet' as const, label: 'Install Snippet', icon: Zap },
{ id: 'ai-ask' as const, label: 'Ask AI', icon: Sparkles },
```

**When `isNewWorkspace` is true and view is `'overview'`, render the onboarding UI instead of the normal overview. Add this inside `<main>` before the existing view-switch:**

```tsx
{view === 'overview' && isNewWorkspace && (
  <OnboardingEmptyState workspaceId={workspaceId!} onGoToSnippet={() => setView('snippet')} onGoToSources={() => setView('sources')} />
)}
```

**Create the `OnboardingEmptyState` component** (can be defined in the same file, above `AnalyticsApp`):

```tsx
const OnboardingEmptyState: React.FC<{
  workspaceId: string;
  onGoToSnippet: () => void;
  onGoToSources: () => void;
}> = ({ workspaceId, onGoToSnippet, onGoToSources }) => (
  <div className="space-y-6">
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-emerald-900 mb-1">Welcome to your analytics workspace</h2>
          <p className="text-emerald-700 text-sm">Your workspace <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-xs">{workspaceId}</code> is ready. No data yet — complete the steps below to start seeing insights.</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        {
          step: '01',
          title: 'Install the tracking snippet',
          desc: 'Paste one script tag on your website. Captures page views, clicks, and custom events automatically.',
          cta: 'Get snippet →',
          onClick: onGoToSnippet,
          active: true,
        },
        {
          step: '02',
          title: 'Connect a data source',
          desc: 'Connect PostHog, Google Analytics, Slack, or Stripe to pull in your existing data.',
          cta: 'Connect sources →',
          onClick: onGoToSources,
          active: false,
        },
        {
          step: '03',
          title: 'Ask AI about your data',
          desc: 'Once data flows in, ask plain-English questions. "Which pages have the highest drop-off?" "What did users do before converting?"',
          cta: 'Coming after step 1',
          onClick: () => {},
          active: false,
        },
      ].map(item => (
        <div key={item.step} className={`rounded-2xl border p-6 ${item.active ? 'border-emerald-300 bg-white shadow-sm' : 'border-slate-200 bg-slate-50/50'}`}>
          <div className={`text-xs font-mono font-bold mb-3 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`}>STEP {item.step}</div>
          <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">{item.desc}</p>
          <button
            onClick={item.onClick}
            disabled={!item.active}
            className={`text-sm font-medium ${item.active ? 'text-emerald-600 hover:text-emerald-800' : 'text-slate-400 cursor-default'}`}
          >
            {item.cta}
          </button>
        </div>
      ))}
    </div>
  </div>
);
```

---

### Task 3: Frontend — Install Snippet view

**Still in AnalyticsApp.tsx**, add a new view renderer for `'snippet'`.

The snippet view shows:
1. A headline: "Add Viktron Analytics to your website"
2. A subtitle explaining what it captures
3. A code block with the pre-filled snippet (workspaceId injected)
4. A "Copy" button that copies the snippet to clipboard
5. Below: "Advanced: track custom events" showing the `va('track', 'event_name', { prop: value })` API

**The snippet string** (build it as a template literal with `workspaceId` injected):

```javascript
<!-- Viktron Analytics -->
<script>
(function(w,d){
  var ws='WORKSPACE_ID_HERE';
  var api='https://api.viktron.ai/api';
  function va(event,props){
    fetch(api+'/saas/events/ingest',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({events:[{
        workspace_id:ws,
        category:'product',
        event:event,
        properties:Object.assign({
          url:location.href,
          path:location.pathname,
          title:document.title,
          referrer:document.referrer,
          screen:screen.width+'x'+screen.height
        },props||{})
      }]})
    }).catch(function(){});
  }
  w.va=va;
  va('page_view');
  var h=location.href;
  new MutationObserver(function(){
    if(location.href!==h){h=location.href;va('page_view');}
  }).observe(d,{subtree:true,childList:true});
})(window,document);
</script>
```

Replace `WORKSPACE_ID_HERE` with the actual `workspaceId`.

**The snippet view JSX:**

```tsx
{view === 'snippet' && (
  <div className="space-y-6">
    <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-1">Install your tracking snippet</h2>
      <p className="text-slate-400 text-sm mb-6">
        Paste this before the <code className="text-emerald-400">&lt;/body&gt;</code> tag on every page of your website.
        It automatically captures page views, navigation, and custom events.
      </p>

      <div className="relative">
        <pre className="bg-slate-950 border border-white/10 rounded-xl p-5 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {snippetCode}
        </pre>
        <button
          onClick={() => { navigator.clipboard.writeText(snippetCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Track custom events</p>
        <pre className="text-xs text-cyan-300 font-mono">
{`// Call this anywhere in your JS
va('button_click', { label: 'Sign Up', page: '/pricing' });
va('purchase', { amount: 99, plan: 'growth' });
va('form_submit', { form_id: 'contact' });`}
        </pre>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
        <strong>What gets captured automatically:</strong> page views on every navigation,
        URL path, page title, referrer source, screen resolution. Data appears in your
        Overview dashboard within seconds of installation.
      </div>
    </div>
  </div>
)}
```

**Add state for copy button:**
```tsx
const [copied, setCopied] = useState(false);
```

**Build `snippetCode`** as a `useMemo` that injects `workspaceId`:
```tsx
const snippetCode = useMemo(() => `<!-- Viktron Analytics -->
<script>
(function(w,d){
  var ws='${workspaceId}';
  ...rest of snippet...
})(window,document);
</script>`, [workspaceId]);
```

---

### Task 4: Frontend — Ask AI view

**In AnalyticsApp.tsx**, add the AI ask view.

**New state:**
```tsx
const [aiQuestion, setAiQuestion] = useState('');
const [aiAnswer, setAiAnswer] = useState<string | null>(null);
const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState('');
```

**`askAI` function:**
```tsx
const askAI = async () => {
  if (!aiQuestion.trim() || !workspaceId) return;
  setAiLoading(true);
  setAiAnswer(null);
  setAiError('');
  try {
    const res = await apiFetch('/saas/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace_id: workspaceId, question: aiQuestion }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Request failed');
    setAiAnswer(data.answer);
  } catch (err) {
    setAiError(err instanceof Error ? err.message : 'Request failed');
  } finally {
    setAiLoading(false);
  }
};
```

**The AI ask view JSX** (rendered when `view === 'ai-ask'`):

```tsx
{view === 'ai-ask' && (
  <div className="space-y-6">
    <div className="bg-[#0d131b] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
          <Sparkles className="w-4.5 h-4.5 text-[#062330]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Ask AI about your data</h2>
          <p className="text-slate-400 text-xs">Powered by Claude — analyzes your last 30 days of events</p>
        </div>
      </div>

      {/* Suggested questions */}
      <div className="flex flex-wrap gap-2 mt-5 mb-4">
        {[
          'Which pages get the most traffic?',
          'What is my busiest day of the week?',
          'What events are users triggering most?',
          'Are there any unusual spikes in activity?',
          'What is my conversion funnel drop-off?',
        ].map(q => (
          <button
            key={q}
            onClick={() => setAiQuestion(q)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-slate-300 hover:bg-white/10 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={aiQuestion}
          onChange={e => setAiQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !aiLoading && askAI()}
          placeholder="Ask anything about your analytics..."
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button
          onClick={askAI}
          disabled={aiLoading || !aiQuestion.trim()}
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2"
        >
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Ask
        </button>
      </div>

      {aiAnswer && (
        <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
          <p className="text-xs font-mono text-emerald-400 mb-2 uppercase tracking-wider">AI Answer</p>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
        </div>
      )}

      {aiError && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {aiError}
        </div>
      )}
    </div>
  </div>
)}
```

---

### Task 5: TypeScript check + fix

```bash
cd /Users/vikashvardhan/IdeaProjects/viktron.ai
npx tsc --noEmit
```

Fix any errors. Common ones:
- `w-4.5` is not valid Tailwind — use `w-5 h-5` instead
- Missing imports for new icons used
- `View` type needs to include all new view ids

---

### Task 6: Commit both repos

```bash
# Frontend
cd /Users/vikashvardhan/IdeaProjects/viktron.ai
git add pages/analytics/AnalyticsApp.tsx
git commit -m "feat: analytics onboarding empty state, tracking snippet, AI ask interface"

# Backend
cd /Users/vikashvardhan/IdeaProjects/viktron-backend
git add app/api/routes/saas_analytics.py
git commit -m "feat: POST /saas/ai/ask — natural language analytics queries via Claude"
```
