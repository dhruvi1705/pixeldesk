import React from "react";

export function TaskProgress({ stats }) {
  const { total, completed, todayTotal, todayCompleted, overdueCount, percent, isTodayMode } = stats;

  const currentCount = isTodayMode ? todayCompleted : completed;
  const targetCount = isTodayMode ? todayTotal : total;
  const labelText = isTodayMode ? "Today's Progress" : "Task Progress";

  return (
    <div
      className="task-progress-box"
      style={{
        border: "2px solid var(--border)",
        backgroundColor: "var(--surface-dark)",
        padding: "10px 12px",
        boxShadow: "1px 1px 0 var(--shadow)",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px", lineHeight: 1 }}>📊</span>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "0.5px"
            }}
          >
            {labelText}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {overdueCount > 0 && (
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7.5px",
                backgroundColor: "var(--color-coral-light)",
                color: "var(--color-coral)",
                border: "1px solid var(--color-coral)",
                padding: "1px 5px",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px"
              }}
            >
              <span>⚠️</span>
              <span>{overdueCount} OVERDUE</span>
            </span>
          )}

          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-navy)"
            }}
          >
            {targetCount > 0 ? `${percent}%` : "0%"}
          </span>
        </div>
      </div>

      {/* Retro Pixel Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Tasks completion progress"
        style={{
          width: "100%",
          height: "14px",
          backgroundColor: "#ffffff",
          border: "1.5px solid var(--border)",
          boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.15)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: "var(--color-teal)",
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0, 0, 0, 0.08) 4px, rgba(0, 0, 0, 0.08) 8px)",
            transition: "width 0.25s ease"
          }}
        />
      </div>

      {/* Subtitle count text */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-retro)",
          fontSize: "15px",
          color: "var(--text-secondary)"
        }}
      >
        <span>
          {targetCount > 0
            ? `${currentCount} of ${targetCount} ${isTodayMode ? "today's tasks" : "tasks"} completed`
            : "No active tasks to track"}
        </span>
        {total > 0 && isTodayMode && (
          <span style={{ fontSize: "14px" }}>
            ({completed}/{total} total)
          </span>
        )}
      </div>
    </div>
  );
}
