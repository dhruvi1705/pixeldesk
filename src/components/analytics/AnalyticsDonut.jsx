import React from "react";

const PALETTE_COLORS = [
  "var(--color-teal)",
  "var(--color-coral)",
  "var(--color-yellow-dark)",
  "var(--color-lavender)",
  "var(--color-navy)",
  "#5A8B78",
  "#D97D64",
  "#C9A048"
];

export function AnalyticsDonut({
  items = [], // [{ label: "Food", value: 1450, percentage: 35, display: "₹1,450" }]
  size = 110,
  emptyMessage = "No category data"
}) {
  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
          textAlign: "center"
        }}
      >
        {/* Empty donut outline */}
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: "12px solid var(--surface-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-muted)" }}>
            0%
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            color: "var(--text-secondary)",
            marginTop: "6px"
          }}
        >
          {emptyMessage}
        </span>
      </div>
    );
  }

  // Build conic-gradient segments
  const { stops: gradientStops, current: totalCumulative } = items.reduce(
    (acc, item, idx) => {
      const color = item.color || PALETTE_COLORS[idx % PALETTE_COLORS.length];
      const start = acc.current;
      const next = Math.min(100, start + (item.percentage || 0));
      acc.stops.push(`${color} ${start}% ${next}%`);
      acc.current = next;
      return acc;
    },
    { current: 0, stops: [] }
  );

  // Fill remainder if sum < 100
  if (totalCumulative < 100) {
    gradientStops.push(`var(--surface-dark) ${totalCumulative}% 100%`);
  }

  const conicStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    background: `conic-gradient(${gradientStops.join(", ")})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid var(--border)",
    boxShadow: "1px 1px 0 var(--shadow)",
    flexShrink: 0
  };

  const centerHoleStyle = {
    width: `${size * 0.58}px`,
    height: `${size * 0.58}px`,
    borderRadius: "50%",
    backgroundColor: "var(--surface)",
    border: "2px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <div
      className="analytics-donut-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        flexWrap: "wrap",
        width: "100%",
        padding: "4px"
      }}
    >
      {/* Donut graphic */}
      <div style={conicStyle} aria-hidden="true">
        <div style={centerHoleStyle}>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "16px", fontWeight: 700 }}>
            {items.length}
          </span>
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)" }}>
            GROUPS
          </span>
        </div>
      </div>

      {/* Accessible Numeric Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          minWidth: "120px",
          maxHeight: "130px",
          overflowY: "auto",
          flex: 1
        }}
      >
        {items.map((item, idx) => {
          const color = item.color || PALETTE_COLORS[idx % PALETTE_COLORS.length];
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
                fontFamily: "var(--font-body)",
                gap: "6px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px", overflow: "hidden" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: color,
                    border: "1px solid var(--border)",
                    flexShrink: 0
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={item.label}
                >
                  {item.label}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "13px",
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {item.display ? `${item.display} (${item.percentage}%)` : `${item.percentage}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
