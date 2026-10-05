import React from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { AnalyticsSummary } from "./AnalyticsSummary";
import { ProductivityOverview } from "./ProductivityOverview";
import { TaskAnalytics } from "./TaskAnalytics";
import { FocusAnalytics } from "./FocusAnalytics";
import { FinanceAnalytics } from "./FinanceAnalytics";
import { CalendarAnalytics } from "./CalendarAnalytics";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";

export function AnalyticsWindow({
  onClose: _onClose,
  onOpenApp = () => {}
}) {
  const {
    period,
    setPeriod,
    summary,
    productivity,
    tasks,
    focus,
    finance,
    calendar,
    hasAnyData,
    refresh
  } = useAnalytics();

  return (
    <div
      className="analytics-app-window"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "var(--font-body)",
        maxWidth: "100%",
        paddingBottom: "8px"
      }}
    >
      {/* 1. Analytics Header with Subtitle & Period Selector */}
      <AnalyticsHeader
        period={period}
        onSelectPeriod={setPeriod}
        onRefresh={refresh}
      />

      {/* 2. Global Empty State or Full Dashboard */}
      {!hasAnyData ? (
        <AnalyticsEmptyState
          icon="📊"
          title="NO PIXEL DATA YET"
          message="Use Tasks, Focus, Finance, or Calendar and your productivity activity will appear here automatically."
          actionLabel="OPEN TASKS"
          onAction={() => onOpenApp("tasks")}
        />
      ) : (
        <div
          className="analytics-dashboard-scroll"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxHeight: "calc(80vh - 120px)",
            overflowY: "auto",
            paddingRight: "2px"
          }}
        >
          {/* Top 4 Summary Cards */}
          <AnalyticsSummary summary={summary} />

          {/* Productivity Overview (Completion Rate & status tiles) */}
          <ProductivityOverview productivity={productivity} />

          {/* Two-Column Section 1: Task Analytics | Focus Analytics */}
          <div
            className="analytics-two-column-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              alignItems: "stretch"
            }}
          >
            <TaskAnalytics
              tasks={tasks}
              onOpenTasks={() => onOpenApp("tasks")}
            />
            <FocusAnalytics
              focus={focus}
              onOpenFocus={() => onOpenApp("focus")}
            />
          </div>

          {/* Two-Column Section 2: Finance Analytics | Calendar Analytics */}
          <div
            className="analytics-two-column-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              alignItems: "stretch"
            }}
          >
            <FinanceAnalytics
              finance={finance}
              onOpenFinance={() => onOpenApp("finance")}
            />
            <CalendarAnalytics
              calendar={calendar}
              onOpenCalendar={() => onOpenApp("calendar")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
