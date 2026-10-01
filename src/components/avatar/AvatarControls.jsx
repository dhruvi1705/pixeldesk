import React from "react";

export function AvatarControls({
  onRandomize,
  onReset,
  onSave,
  isDirty,
  notification
}) {
  return (
    <footer
      className="avatar-controls-container"
      style={{
        position: "sticky",
        bottom: "-16px",
        backgroundColor: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginTop: "8px",
        paddingTop: "8px",
        paddingBottom: "8px",
        borderTop: "2px solid var(--border)",
        boxShadow: "0 -4px 8px rgba(0,0,0,0.06)",
        zIndex: 15
      }}
    >
      {/* Small PixelDesk notification message */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="avatar-notification-banner animate-fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px",
            backgroundColor:
              notification.type === "success"
                ? "var(--color-teal-light)"
                : "var(--color-lavender-light)",
            border: `1.5px solid ${
              notification.type === "success"
                ? "var(--color-teal)"
                : "var(--color-lavender)"
            }`,
            boxShadow: "1px 1px 0 var(--shadow)",
            fontFamily: "var(--font-retro)",
            fontSize: "16px",
            color: "var(--color-navy)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>{notification.type === "success" ? "💾" : "✨"}</span>
            <span>{notification.text}</span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--text-secondary)"
            }}
          >
            LOCAL
          </span>
        </div>
      )}

      {/* Button Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Randomize Button: Muted Lavender outline */}
          <button
            type="button"
            onClick={onRandomize}
            title="Randomize avatar combination"
            className="pixel-button"
            style={{
              borderColor: "var(--color-lavender)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>🎲</span>
            <span>RANDOMIZE</span>
          </button>

          {/* Reset Button: Subtle */}
          <button
            type="button"
            onClick={onReset}
            title="Reset avatar to default configuration"
            className="pixel-button pixel-button-sm"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--border-subtle)"
            }}
          >
            RESET
          </button>
        </div>

        {/* Save Avatar: Coral primary action button */}
        <button
          type="button"
          onClick={onSave}
          title="Save avatar configuration to browser localStorage"
          className="pixel-button pixel-button-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "var(--pixel-shadow-sm)"
          }}
        >
          <span>💾</span>
          <span>SAVE AVATAR</span>
          {isDirty && (
            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "var(--color-yellow)",
                border: "1px solid #ffffff",
                display: "inline-block"
              }}
              aria-label="Unsaved changes"
            />
          )}
        </button>
      </div>
    </footer>
  );
}
