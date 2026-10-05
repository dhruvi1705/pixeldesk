import React from "react";

export function AnalyticsPeriodSelector({
  period,
  onSelectPeriod
}) {
  const options = [
    { id: "7d", label: "7 DAYS" },
    { id: "30d", label: "30 DAYS" },
    { id: "month", label: "THIS MONTH" },
    { id: "all", label: "ALL TIME" }
  ];

  return (
    <div
      role="group"
      aria-label="Filter analytics by period"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexWrap: "wrap"
      }}
    >
      {options.map((opt) => {
        const isActive = period === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelectPeriod(opt.id)}
            className={`pixel-button pixel-button-sm ${isActive ? "pixel-button-teal" : ""}`}
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              padding: "4px 8px"
            }}
            aria-pressed={isActive}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
