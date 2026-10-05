import React from "react";
import { AnalyticsBarChart } from "./AnalyticsBarChart";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";

export function TaskAnalytics({
  tasks,
  onOpenTasks
}) {
  const {
    total = 0,
    completed = 0,
    active = 0,
    overdue = 0,
    completionRate = 0,
    categories = [],
    hasData = false
  } = tasks || {};

  if (!hasData) {
    return (
      <AnalyticsEmptyState
        icon="📋"
        title="NO TASKS DATA"
        message="Create and complete tasks in Tasks app to see completion rates and category metrics."
        actionLabel="OPEN TASKS"
        onAction={onOpenTasks}
      />
    );
  }

  const performanceBars = [
    {
      label: "COMPLETED",
      percentage: completionRate,
      display: `${completed} (${completionRate}%)`,
      color: "var(--color-teal)"
    },
    {
      label: "ACTIVE",
      percentage: total > 0 ? Math.round((active / total) * 100) : 0,
      display: `${active} (${total > 0 ? Math.round((active / total) * 100) : 0}%)`,
      color: "var(--color-yellow-dark)"
    },
    ...(overdue > 0
      ? [
          {
            label: "OVERDUE",
            percentage: total > 0 ? Math.round((overdue / total) * 100) : 0,
            display: `${overdue} (${total > 0 ? Math.round((overdue / total) * 100) : 0}%)`,
            color: "var(--color-coral)"
          }
        ]
      : [])
  ];

  const categoryBars = categories.map((cat) => ({
    label: cat.name,
    percentage: cat.percentage,
    display: `${cat.count} (${cat.percentage}%)`,
    color: "var(--color-lavender)"
  }));

  return (
    <div
      className="task-analytics-card pixel-box"
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
          TASK PERFORMANCE
        </h3>
        <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-secondary)" }}>
          {total} Tasks
        </span>
      </div>

      {/* Completion vs Active Horizontal Bars */}
      <AnalyticsBarChart items={performanceBars} orientation="horizontal" />

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "8px", marginTop: "2px" }}>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: "6px"
            }}
          >
            CATEGORY DISTRIBUTION
          </span>
          <AnalyticsBarChart items={categoryBars} orientation="horizontal" />
        </div>
      )}
    </div>
  );
}
