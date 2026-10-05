import React from "react";
import { AnalyticsPeriodSelector } from "./AnalyticsPeriodSelector";

export function AnalyticsHeader({
  period,
  onSelectPeriod,
  onRefresh
}) {
  return (
    <header
      className="analytics-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1.5px solid var(--border-subtle)",
        paddingBottom: "8px",
        gap: "8px",
        flexWrap: "wrap"
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "11px",
            color: "var(--text-primary)",
            margin: "0 0 3px 0",
            letterSpacing: "0.5px"
          }}
        >
          ANALYTICS
        </h2>
        <p
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "18px",
            color: "var(--text-primary)",
            margin: 0,
            lineHeight: 1.2
          }}
        >
          "See how your pixels are being spent."
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <AnalyticsPeriodSelector
          period={period}
          onSelectPeriod={onSelectPeriod}
        />
        <button
          type="button"
          onClick={onRefresh}
          className="pixel-button pixel-button-sm"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            padding: "4px 7px"
          }}
          title="Refresh analytics data"
          aria-label="Refresh analytics data"
        >
          ↻
        </button>
      </div>
    </header>
  );
}
