import React from "react";
import { AnalyticsBarChart } from "./AnalyticsBarChart";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";

export function CalendarAnalytics({
  calendar,
  onOpenCalendar
}) {
  const {
    totalEvents = 0,
    allDayEvents = 0,
    timedEvents = 0,
    categories = [],
    busiestDay = null,
    hasData = false
  } = calendar || {};

  if (!hasData) {
    return (
      <AnalyticsEmptyState
        icon="📅"
        title="NO CALENDAR ACTIVITY YET"
        message="Schedule agenda items and meetings in Calendar to track your time commitments and busiest days."
        actionLabel="OPEN CALENDAR"
        onAction={onOpenCalendar}
      />
    );
  }

  const typeBars = [
    {
      label: "TIMED EVENTS",
      percentage: totalEvents > 0 ? Math.round((timedEvents / totalEvents) * 100) : 0,
      display: `${timedEvents} (${totalEvents > 0 ? Math.round((timedEvents / totalEvents) * 100) : 0}%)`,
      color: "var(--color-teal)"
    },
    {
      label: "ALL-DAY EVENTS",
      percentage: totalEvents > 0 ? Math.round((allDayEvents / totalEvents) * 100) : 0,
      display: `${allDayEvents} (${totalEvents > 0 ? Math.round((allDayEvents / totalEvents) * 100) : 0}%)`,
      color: "var(--color-yellow-dark)"
    }
  ];

  const categoryBars = categories.map((cat) => ({
    label: cat.name,
    percentage: cat.percentage,
    display: `${cat.count} (${cat.percentage}%)`,
    color: "var(--color-lavender)"
  }));

  return (
    <div
      className="calendar-analytics-card pixel-box"
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
          CALENDAR ACTIVITY
        </h3>
        <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-secondary)" }}>
          {totalEvents} Events
        </span>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 8px",
          backgroundColor: "#ffffff",
          border: "1px solid var(--border)",
          fontSize: "12px",
          fontFamily: "var(--font-body)"
        }}
      >
        <div>
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)", display: "block" }}>
            SCHEDULE TYPE
          </span>
          <span style={{ fontWeight: 600 }}>
            {timedEvents} Timed / {allDayEvents} All-Day
          </span>
        </div>

        {busiestDay && (
          <div style={{ textAlign: "right" }}>
            <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)", display: "block" }}>
              BUSIEST DAY
            </span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", fontWeight: 700, color: "var(--color-navy)" }}>
              {busiestDay.date} ({busiestDay.count} evts)
            </span>
          </div>
        )}
      </div>

      {/* Schedule type bar chart */}
      <AnalyticsBarChart items={typeBars} orientation="horizontal" />

      {/* Categories if available */}
      {categories.length > 0 && (
        <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "6px", marginTop: "2px" }}>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: "4px"
            }}
          >
            EVENT CATEGORIES
          </span>
          <AnalyticsBarChart items={categoryBars} orientation="horizontal" />
        </div>
      )}
    </div>
  );
}
