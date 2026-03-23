import { useEffect, useState, useCallback } from "react";

interface AgentEvent {
  event_type: string;
  agent_id: string;
  timestamp: string;
  data: Record<string, unknown>;
}

interface AgentStat {
  slug: string;
  taskCount: number;
  errorCount: number;
  lastSeen: string;
  costUsd: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.viktron.ai";

export default function CloudDashboard() {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [stats, setStats] = useState<AgentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [evtRes, _metricsRes] = await Promise.all([
        fetch(`${API_BASE}/api/observability/events?limit=100`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        }),
        fetch(`${API_BASE}/api/observability/metrics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
        }),
      ]);

      if (!evtRes.ok) {
        setError(`API error: ${evtRes.status}`);
        return;
      }

      const evtData = await evtRes.json();
      const evtList: AgentEvent[] = evtData.events || [];
      setEvents(evtList);

      // Derive per-agent stats
      const agentMap: Record<string, AgentStat> = {};
      for (const evt of evtList) {
        const slug = evt.agent_id || "unknown";
        if (!agentMap[slug]) {
          agentMap[slug] = { slug, taskCount: 0, errorCount: 0, lastSeen: evt.timestamp, costUsd: 0 };
        }
        if (evt.event_type === "task" && (evt.data?.status as string) === "completed") {
          agentMap[slug].taskCount++;
        }
        if (evt.data?.error) agentMap[slug].errorCount++;
        if (typeof evt.data?.cost_usd === "number") agentMap[slug].costUsd += evt.data.cost_usd as number;
        if (evt.timestamp > agentMap[slug].lastSeen) agentMap[slug].lastSeen = evt.timestamp;
      }
      setStats(Object.values(agentMap).sort((a, b) => b.taskCount - a.taskCount));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div style={{ padding: "1.5rem", maxWidth: "960px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Agent Fleet Dashboard</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Live view of all agents reporting to cloud.viktron.ai · refreshes every 10s
        </p>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      {/* Fleet stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Active Agents" value={stats.length} />
        <StatCard label="Total Tasks" value={stats.reduce((s, a) => s + a.taskCount, 0)} />
        <StatCard
          label="Total Cost"
          value={`$${stats.reduce((s, a) => s + a.costUsd, 0).toFixed(4)}`}
        />
      </div>

      {/* Fleet table */}
      <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.85rem" }}>
          Agent Status
        </h2>
        {loading ? (
          <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Loading...</div>
        ) : stats.length === 0 ? (
          <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            No agents have reported events yet. Deploy an agent and run a task to see it here.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                {["Agent", "Tasks", "Errors", "Cost (USD)", "Last Seen"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "0.5rem 0.75rem 0.5rem 0", color: "#64748b", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.slug} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.6rem 0.75rem 0.6rem 0", fontFamily: "monospace", color: "#0f172a" }}>{s.slug}</td>
                  <td style={{ padding: "0.6rem 0.75rem 0.6rem 0" }}>{s.taskCount}</td>
                  <td style={{ padding: "0.6rem 0.75rem 0.6rem 0", color: s.errorCount > 0 ? "#dc2626" : "#94a3b8" }}>{s.errorCount}</td>
                  <td style={{ padding: "0.6rem 0.75rem 0.6rem 0" }}>${s.costUsd.toFixed(4)}</td>
                  <td style={{ padding: "0.6rem 0 0.6rem 0", color: "#94a3b8" }}>{new Date(s.lastSeen).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Live event feed */}
      <section style={{ background: "#0f172a", borderRadius: "12px", padding: "1.25rem" }}>
        <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.85rem" }}>
          Live Event Feed
        </h2>
        <div style={{ fontFamily: "monospace", fontSize: "0.78rem", maxHeight: "320px", overflowY: "auto" }}>
          {events.slice(0, 40).map((evt, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.2rem 0", lineHeight: 1.6 }}>
              <span style={{ color: "#475569", flexShrink: 0 }}>{new Date(evt.timestamp).toLocaleTimeString()}</span>
              <span style={{ color: "#60a5fa", flexShrink: 0 }}>[{evt.agent_id}]</span>
              <span style={{ color: "#a3e635" }}>{evt.event_type}</span>
              {evt.data?.error && (
                <span style={{ color: "#f87171" }}>ERR: {String(evt.data.error)}</span>
              )}
            </div>
          ))}
          {events.length === 0 && !loading && (
            <div style={{ color: "#475569" }}>Waiting for agent events...</div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem 1.25rem" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "0.35rem" }}>{label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>{value}</div>
    </div>
  );
}
