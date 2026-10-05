import React from "react";
import { formatRupee, EXPENSE_CATEGORIES } from "../../data/financeCategories";

export function FinanceCategoryBreakdown({
  breakdown = []
}) {
  if (breakdown.length === 0) {
    return (
      <div
        className="pixel-box"
        style={{
          padding: "10px",
          textAlign: "center",
          backgroundColor: "var(--surface-dark)",
          border: "1px dashed var(--border-subtle)"
        }}
      >
        <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-muted)" }}>
          No expenses recorded for this month.
        </span>
      </div>
    );
  }

  return (
    <div
      className="pixel-box"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "8px 10px",
        backgroundColor: "var(--surface)",
        border: "var(--pixel-border)",
        boxShadow: "var(--pixel-shadow-sm)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px dashed var(--border-subtle)",
          paddingBottom: "4px"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--text-secondary)"
          }}
        >
          SPENDING BY CATEGORY
        </span>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "12px",
            color: "var(--text-muted)"
          }}
        >
          {breakdown.length} Categories
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "2px" }}>
        {breakdown.map((item) => {
          const catObj = EXPENSE_CATEGORIES.find((c) => c.id === item.category);
          const icon = catObj ? catObj.icon : "📌";
          const barColor = catObj ? catObj.color : "var(--color-coral)";

          return (
            <div key={item.category} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  fontFamily: "var(--font-body)"
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                  <span>{icon}</span>
                  <span>{item.category}</span>
                </span>
                <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", fontWeight: 700 }}>
                  {formatRupee(item.amount)} ({item.percentage}%)
                </span>
              </div>

              {/* Horizontal Pixel Bar */}
              <div
                style={{
                  height: "7px",
                  backgroundColor: "var(--surface-dark)",
                  border: "1px solid var(--border-subtle)",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${item.percentage}%`,
                    backgroundColor: barColor,
                    transition: "width 0.2s ease"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
