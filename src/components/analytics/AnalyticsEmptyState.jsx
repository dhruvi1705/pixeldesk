import React from "react";

export function AnalyticsEmptyState({
  icon = "📊",
  title = "NO DATA AVAILABLE",
  message = "No activity recorded for this period.",
  actionLabel,
  onAction
}) {
  return (
    <div
      className="pixel-box"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px 12px",
        backgroundColor: "var(--surface-dark)",
        border: "1.5px dashed var(--border-subtle)",
        textAlign: "center",
        gap: "6px",
        width: "100%"
      }}
    >
      <span style={{ fontSize: "24px" }} role="img" aria-label={title}>
        {icon}
      </span>
      <h4
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "8.5px",
          color: "var(--text-primary)",
          margin: 0
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontFamily: "var(--font-retro)",
          fontSize: "14px",
          color: "var(--text-secondary)",
          margin: 0,
          maxWidth: "340px"
        }}
      >
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="pixel-button pixel-button-sm pixel-button-teal"
          style={{
            marginTop: "6px",
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            padding: "4px 8px"
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
