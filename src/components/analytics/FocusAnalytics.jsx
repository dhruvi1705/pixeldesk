import React from "react";
import { AnalyticsBarChart } from "./AnalyticsBarChart";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";

export function FocusAnalytics({
  focus,
  onOpenFocus
}) {
  const {
    sessionCount = 0,
    formattedTime = "0m",
    formattedAvg = "0m",
    formattedLongest = "0m",
    dailyChart = [],
    hasData = false
  } = focus || {};

  if (!hasData) {
    return (
      <AnalyticsEmptyState
        icon="⏱"
        title="NO FOCUS SESSIONS YET"
        message="Start a 25-minute Pomodoro session in Focus to see your focus streaks and weekly habits."
        actionLabel="OPEN FOCUS"
        onAction={onOpenFocus}
      />
    );
  }

  return (
    <div
      className="focus-analytics-card pixel-box"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px 12px",
        backgroundColor: "var(--surface)",
        border: "var(--pixel-border)",
        boxShadow: "var(--pixel-shadow-sm)",
        height: "100%"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          FOCUS THIS PERIOD
        </h3>
        <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-secondary)" }}>
          {sessionCount} Sessions
        </span>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "4px 6px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border)"
          }}
        >
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)" }}>
            TOTAL
          </span>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "16px", fontWeight: 700, color: "var(--color-teal)" }}>
            {formattedTime}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "4px 6px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border)"
          }}
        >
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)" }}>
            AVG LENGTH
          </span>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "16px", fontWeight: 700, color: "var(--color-navy)" }}>
            {formattedAvg}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "4px 6px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border)"
          }}
        >
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)" }}>
            LONGEST
          </span>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "16px", fontWeight: 700, color: "var(--color-yellow-dark)" }}>
            {formattedLongest}
          </span>
        </div>
      </div>

      {/* Daily Chart (MON - SUN) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7px",
            color: "var(--text-secondary)"
          }}
        >
          DAILY FOCUS ACTIVITY
        </span>
        <AnalyticsBarChart items={dailyChart} orientation="vertical" maxHeight={80} />
      </div>
    </div>
  );
}
