import React from "react";

export function ProductivityOverview({
  productivity
}) {
  const {
    completionRate = 0,
    completedTasks = 0,
    activeTasks = 0,
    overdueTasks = 0,
    totalTasks = 0
  } = productivity || {};

  return (
    <div
      className="productivity-overview-card pixel-box"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "10px 12px",
        backgroundColor: "var(--surface)",
        border: "var(--pixel-border)",
        boxShadow: "var(--pixel-shadow-sm)",
        width: "100%"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-primary)"
          }}
        >
          PRODUCTIVITY OVERVIEW
        </span>

        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "14px",
            color: "var(--text-secondary)"
          }}
        >
          {totalTasks} Total Tasks
        </span>
      </div>

      {/* Completion Rate Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          backgroundColor: "#ffffff",
          border: "1.5px solid var(--border)",
          boxShadow: "inset 0 1px 0 rgba(0,0,0,0.05)",
          gap: "12px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)"
            }}
          >
            TASK COMPLETION RATE
          </span>
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "32px",
              fontWeight: 700,
              color: completionRate >= 60 ? "var(--color-teal)" : completionRate > 0 ? "var(--color-yellow-dark)" : "var(--text-muted)",
              lineHeight: 1
            }}
          >
            {completionRate}%
          </span>
        </div>

        {/* Status Metrics Pills */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "6px",
            flex: 1,
            minWidth: "220px"
          }}
        >
          {/* Completed */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 6px",
              backgroundColor: "var(--color-teal-light)",
              border: "1px solid var(--color-teal)"
            }}
          >
            <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--color-navy)" }}>
              COMPLETED
            </span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "18px", fontWeight: 700, color: "var(--color-navy)" }}>
              {completedTasks}
            </span>
          </div>

          {/* In Progress */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 6px",
              backgroundColor: "var(--color-yellow-light)",
              border: "1px solid var(--color-yellow-dark)"
            }}
          >
            <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--color-navy)" }}>
              IN PROGRESS
            </span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "18px", fontWeight: 700, color: "var(--color-navy)" }}>
              {activeTasks}
            </span>
          </div>

          {/* Overdue */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 6px",
              backgroundColor: "var(--color-coral-light)",
              border: "1px solid var(--color-coral)"
            }}
          >
            <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--color-coral)" }}>
              OVERDUE
            </span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "18px", fontWeight: 700, color: "var(--color-coral)" }}>
              {overdueTasks}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar of Completion */}
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "var(--surface-dark)",
          border: "1px solid var(--border)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${completionRate}%`,
            backgroundColor: "var(--color-teal)",
            transition: "width 0.25s ease"
          }}
        />
      </div>
    </div>
  );
}
