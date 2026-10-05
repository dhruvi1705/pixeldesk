import React from "react";

export function AnalyticsBarChart({
  items = [],
  orientation = "horizontal", // "horizontal" | "vertical"
  maxHeight = 90
}) {
  if (items.length === 0) return null;

  if (orientation === "vertical") {
    // Vertical day bars (e.g. for focus day by day)
    return (
      <div
        className="analytics-vertical-barchart"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "6px",
          height: `${maxHeight}px`,
          padding: "6px 4px 0 4px",
          backgroundColor: "var(--surface-dark)",
          border: "1px solid var(--border-subtle)",
          width: "100%"
        }}
      >
        {items.map((item) => {
          const heightPercent = Math.max(4, Math.min(100, item.percentage || 0));
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                height: "100%",
                justifyContent: "flex-end",
                gap: "3px"
              }}
              title={`${item.label}: ${item.display || item.value}`}
            >
              {/* Bar */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "20px",
                  height: `${heightPercent}%`,
                  backgroundColor: item.color || "var(--color-teal)",
                  border: "1px solid var(--border)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                  transition: "height 0.25s ease"
                }}
              />
              {/* Label */}
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "6.5px",
                  color: "var(--text-secondary)",
                  lineHeight: 1
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal bar rows
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              fontFamily: "var(--font-body)"
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", fontWeight: 700 }}>
              {item.display !== undefined ? item.display : `${item.percentage}%`}
            </span>
          </div>

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
                width: `${Math.max(0, Math.min(100, item.percentage || 0))}%`,
                backgroundColor: item.color || "var(--color-teal)",
                transition: "width 0.2s ease"
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
