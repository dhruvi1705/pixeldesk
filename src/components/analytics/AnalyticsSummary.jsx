import React from "react";

export function AnalyticsSummary({
  summary
}) {
  const {
    tasksCompleted = 0,
    focusTimeFormatted = "0m",
    spentFormatted = "₹0",
    eventsCount = 0
  } = summary || {};

  const cards = [
    {
      label: "TASKS COMPLETED",
      value: tasksCompleted,
      icon: "📋",
      color: "var(--color-teal)"
    },
    {
      label: "FOCUS TIME",
      value: focusTimeFormatted,
      icon: "⏱",
      color: "var(--color-yellow-dark)"
    },
    {
      label: "SPENT",
      value: spentFormatted,
      icon: "💰",
      color: "var(--color-coral)"
    },
    {
      label: "EVENTS",
      value: eventsCount,
      icon: "📅",
      color: "var(--color-lavender)"
    }
  ];

  return (
    <div
      className="analytics-summary-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "8px",
        width: "100%"
      }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          className="pixel-box"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 10px",
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--border)",
            borderTop: `3px solid ${c.color}`,
            boxShadow: "1px 1px 0 var(--shadow)",
            gap: "2px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                color: "var(--text-secondary)",
                letterSpacing: "0.5px"
              }}
            >
              {c.label}
            </span>
            <span style={{ fontSize: "12px" }}>{c.icon}</span>
          </div>

          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.1,
              marginTop: "2px"
            }}
          >
            {c.value}
          </span>
        </div>
      ))}
    </div>
  );
}
