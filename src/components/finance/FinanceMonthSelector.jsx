import React from "react";
import { MONTH_NAMES } from "../../data/financeCategories";

export function FinanceMonthSelector({
  selectedYear,
  selectedMonth,
  isCurrentMonth,
  onPrevMonth,
  onNextMonth,
  onCurrentMonth
}) {
  const monthName = MONTH_NAMES[selectedMonth] || "";

  return (
    <div
      className="finance-month-selector"
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
      {/* Month Navigation: [ < ] Month Year [ > ] */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          type="button"
          onClick={onPrevMonth}
          className="pixel-button pixel-button-sm"
          style={{ padding: "3px 8px", fontSize: "10px", lineHeight: 1 }}
          aria-label="Previous month"
        >
          &lt;
        </button>

        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            margin: 0,
            color: "var(--text-primary)",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap"
          }}
        >
          {monthName} {selectedYear}
        </h3>

        <button
          type="button"
          onClick={onNextMonth}
          className="pixel-button pixel-button-sm"
          style={{ padding: "3px 8px", fontSize: "10px", lineHeight: 1 }}
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>

      {/* Quick Jump: THIS MONTH */}
      {!isCurrentMonth && (
        <button
          type="button"
          onClick={onCurrentMonth}
          className="pixel-button pixel-button-sm pixel-button-teal"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            padding: "3px 6px"
          }}
        >
          THIS MONTH
        </button>
      )}
    </div>
  );
}
