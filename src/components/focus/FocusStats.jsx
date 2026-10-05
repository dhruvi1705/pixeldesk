import React from "react";

export function FocusStats({
  todayStats
}) {
  const { sessionCount = 0, formattedTime = "0m" } = todayStats || {};

  return (
    <div
      className="focus-stats-card pixel-box"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        padding: "10px",
        backgroundColor: "var(--surface-dark)",
        border: "1px solid var(--border-subtle)",
        width: "100%"
      }}
    >
      {/* Stat 1: Total Focus Time */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 8px",
          backgroundColor: "#ffffff",
          border: "1px solid var(--border)",
          boxShadow: "1px 1px 0 var(--shadow)"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            color: "var(--text-secondary)",
            letterSpacing: "0.5px"
          }}
        >
          FOCUS TIME
        </span>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--color-teal)",
            lineHeight: 1.2,
            marginTop: "2px"
          }}
        >
          {formattedTime}
        </span>
      </div>

      {/* Stat 2: Completed Sessions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 8px",
          backgroundColor: "#ffffff",
          border: "1px solid var(--border)",
          boxShadow: "1px 1px 0 var(--shadow)"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            color: "var(--text-secondary)",
            letterSpacing: "0.5px"
          }}
        >
          SESSIONS
        </span>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--color-navy)",
            lineHeight: 1.2,
            marginTop: "2px"
          }}
        >
          {sessionCount}
        </span>
      </div>
    </div>
  );
}
