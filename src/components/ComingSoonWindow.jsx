import React from "react";

export function ComingSoonWindow({ app, onClose }) {
  if (!app) return null;

  // Category pill style based on color roles
  const getCategoryStyle = () => {
    switch (app.accentType) {
      case "teal":
        return { backgroundColor: "var(--color-teal)", color: "#ffffff" };
      case "lavender":
        return { backgroundColor: "var(--color-lavender)", color: "#ffffff" };
      case "yellow":
        return { backgroundColor: "var(--color-yellow)", color: "var(--color-navy)" };
      case "coral":
        return { backgroundColor: "var(--color-coral)", color: "#ffffff" };
      default:
        return { backgroundColor: "var(--surface-dark)", color: "var(--text-primary)" };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "14px",
        padding: "8px 4px",
        fontFamily: "var(--font-body)"
      }}
    >
      {/* App Icon Presentation */}
      <div
        style={{
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          backgroundColor: "var(--surface-dark)",
          border: "2px solid var(--border)",
          boxShadow: "var(--pixel-shadow-sm)",
          borderRadius: "0px"
        }}
      >
        {app.icon}
      </div>

      <div>
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "12px",
            color: "var(--text-primary)",
            marginBottom: "6px"
          }}
        >
          {app.name}
        </h3>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "2px 8px",
            border: "1px solid var(--border)",
            borderRadius: "0px",
            display: "inline-block",
            ...getCategoryStyle()
          }}
        >
          {app.category || "Module"}
        </span>
      </div>

      <p
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          maxWidth: "320px",
          lineHeight: 1.5,
          margin: "0 auto"
        }}
      >
        {app.description}
      </p>

      {/* Retro Status Panel (Warm Cream sub-panel with crisp border) */}
      <div
        style={{
          backgroundColor: "var(--surface-dark)",
          border: "2px solid var(--border)",
          padding: "10px 14px",
          width: "100%",
          maxWidth: "340px",
          boxShadow: "1px 1px 0 var(--shadow)",
          borderRadius: "0px"
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            lineHeight: 1.6,
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          Scheduled for Level 2 Release
        </p>
        <span
          style={{
            fontSize: "11px",
            color: "var(--text-secondary)",
            marginTop: "4px",
            display: "inline-block"
          }}
        >
          UI preview active • Full interactivity arriving in next phase
        </span>
      </div>

      <button
        onClick={onClose}
        className="pixel-button"
        style={{ marginTop: "4px" }}
      >
        Close
      </button>
    </div>
  );
}
