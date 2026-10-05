import React from "react";
import { MONTH_NAMES } from "../../data/calendarCategories";

export function CalendarHeader({
  viewYear,
  viewMonth,
  onPrevMonth,
  onNextMonth,
  onGoToToday
}) {
  const monthName = MONTH_NAMES[viewMonth] || "";

  return (
    <div
      className="calendar-header-nav"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 8px",
        backgroundColor: "var(--surface-dark)",
        border: "var(--pixel-border)",
        boxShadow: "var(--pixel-shadow-sm)",
        gap: "8px"
      }}
    >
      {/* Month & Year Navigation: [ < ] Month Year [ > ] */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="pixel-button pixel-button-sm"
          style={{
            padding: "4px 8px",
            fontSize: "10px",
            lineHeight: 1
          }}
        >
          &lt;
        </button>

        <h2
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "11px",
            margin: 0,
            color: "var(--text-primary)",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap"
          }}
        >
          {monthName} {viewYear}
        </h2>

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="pixel-button pixel-button-sm"
          style={{
            padding: "4px 8px",
            fontSize: "10px",
            lineHeight: 1
          }}
        >
          &gt;
        </button>
      </div>

      {/* TODAY quick jump button */}
      <button
        type="button"
        onClick={onGoToToday}
        aria-label="Jump to today"
        className="pixel-button pixel-button-sm pixel-button-teal"
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "8px",
          padding: "4px 8px"
        }}
      >
        TODAY
      </button>
    </div>
  );
}
