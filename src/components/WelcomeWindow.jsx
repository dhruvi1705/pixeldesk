import React from "react";

export function WelcomeWindow({ onClose }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        textAlign: "center",
        padding: "6px 2px"
      }}
    >
      {/* Pixel Hero Graphic */}
      <div
        style={{
          display: "inline-flex",
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          width: "60px",
          height: "60px",
          backgroundColor: "var(--surface-dark)",
          border: "2px solid var(--border)",
          boxShadow: "var(--pixel-shadow-sm)",
          fontSize: "30px",
          borderRadius: "0px"
        }}
      >
        🖥️
      </div>

      <div>
        <h1
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "var(--text-primary)",
            marginBottom: "6px"
          }}
        >
          Welcome to PixelDesk
        </h1>
        <p
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "21px",
            color: "var(--color-teal)",
            fontWeight: "bold",
            margin: 0
          }}
        >
          Your retro productivity workspace.
        </p>
      </div>

      <p
        style={{
          fontSize: "13.5px",
          color: "var(--text-secondary)",
          maxWidth: "380px",
          margin: "0 auto",
          lineHeight: 1.55
        }}
      >
        A focused digital desktop designed for studying, daily planning, and distraction-free organization.
      </p>

      {/* Highlights / Features Box (Warm Cream Sub-panel with Navy Border) */}
      <div
        style={{
          backgroundColor: "var(--surface-dark)",
          border: "2px solid var(--border)",
          padding: "12px 14px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          borderRadius: "0px"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <span style={{ fontSize: "16px", lineHeight: 1.2 }}>📋</span>
          <span style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.4 }}>
            <strong style={{ color: "var(--color-teal)" }}>Productivity Core:</strong> Modular tools for tasks, notes, calendar, and Pomodoro focus intervals.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <span style={{ fontSize: "16px", lineHeight: 1.2 }}>🖥️</span>
          <span style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.4 }}>
            <strong style={{ color: "var(--color-navy)" }}>Retro Window System:</strong> Multi-task freely with draggable windows, dock shortcuts, and system chrome.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <span style={{ fontSize: "16px", lineHeight: 1.2 }}>🎨</span>
          <span style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.4 }}>
            <strong style={{ color: "var(--color-lavender)" }}>Calm Aesthetic:</strong> Balanced multi-color palette designed for clean readability and mature appeal.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "4px"
        }}
      >
        {/* Coral Primary Action Button */}
        <button
          onClick={onClose}
          className="pixel-button pixel-button-primary"
          style={{ padding: "10px 20px", fontSize: "10px" }}
          aria-label="Explore PixelDesk"
        >
          [ EXPLORE PIXELDESK ]
        </button>
      </div>
    </div>
  );
}
