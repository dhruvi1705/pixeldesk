import React from "react";

export function WorkspaceContextPanel({ context, onClose }) {
  const { tasks, calendar, focus, finance, notes } = context;

  const stores = [
    {
      id: "tasks",
      name: "Tasks Store",
      key: "pixeldesk_tasks",
      icon: "📋",
      color: "var(--color-teal)",
      stats: `${tasks.total} total • ${tasks.dueTodayCount} due today • ${tasks.overdueCount} overdue`
    },
    {
      id: "calendar",
      name: "Calendar Store",
      key: "pixeldesk_events",
      icon: "📅",
      color: "var(--color-yellow-dark)",
      stats: `${calendar.total} total • ${calendar.upcomingCount} upcoming • ${calendar.todayCount} today`
    },
    {
      id: "focus",
      name: "Focus Store",
      key: "pixeldesk_focus_sessions",
      icon: "⏱️",
      color: "var(--color-coral)",
      stats: `${focus.weekFormatted} this week (${focus.weekSessionsCount} sessions)`
    },
    {
      id: "finance",
      name: "Finance Store",
      key: "pixeldesk_transactions",
      icon: "💰",
      color: "var(--color-navy)",
      stats: `${finance.monthExpensesFormatted} spent this month • ${finance.monthTransactionsCount} txs`
    },
    {
      id: "notes",
      name: "Notes Store",
      key: "pixeldesk_notes",
      icon: "📝",
      color: "var(--color-lavender)",
      stats: `${notes.total} notes • ${notes.pinnedCount} pinned`
    }
  ];

  return (
    <div
      className="copilot-context-panel"
      style={{
        backgroundColor: "var(--surface)",
        border: "2px solid var(--border)",
        boxShadow: "var(--pixel-shadow-sm)",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontSize: "12px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>🗄️</span>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "10px",
              color: "var(--text-primary)"
            }}
          >
            ACTIVE LOCAL STORES (READ-ONLY)
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close context panel"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--text-muted)",
            padding: "2px 4px"
          }}
        >
          [✕ CLOSE]
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "6px"
        }}
      >
        {stores.map((s) => (
          <div
            key={s.id}
            style={{
              backgroundColor: "var(--surface-dark)",
              border: "1px solid var(--border)",
              padding: "6px 8px",
              display: "flex",
              flexDirection: "column",
              gap: "2px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: "11px", color: "var(--text-primary)" }}>
                {s.icon} {s.name}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontFamily: "monospace",
                  color: "var(--text-muted)"
                }}
              >
                {s.key}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{s.stats}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "var(--color-teal-hover)",
          fontFamily: "monospace",
          backgroundColor: "var(--color-teal-light)",
          padding: "4px 8px",
          border: "1px dashed var(--color-teal)"
        }}
      >
        🔒 <strong>PRIVACY GUARANTEE:</strong> Context is read safely in-browser from localStorage. Zero network requests or external model calls.
      </div>
    </div>
  );
}
