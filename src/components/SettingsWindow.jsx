import React from "react";

export function SettingsWindow({
  theme,
  setTheme,
  animationsEnabled,
  setAnimationsEnabled,
  clockFormat,
  setClockFormat,
  reducedMotion,
  setReducedMotion,
  onResetDefaults
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "var(--font-body)"
      }}
    >
      {/* SECTION 1: APPEARANCE */}
      <section
        style={{
          border: "2px solid var(--border)",
          padding: "12px 14px",
          backgroundColor: "var(--surface-dark)",
          boxShadow: "1px 1px 0 var(--shadow)",
          borderRadius: "0px"
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--text-primary)",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>🎨</span> Palette & Theme
        </h3>

        <div style={{ marginBottom: "6px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "8px"
            }}
          >
            Desktop Atmosphere
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px"
            }}
          >
            {/* Retro Navy & Cream (Default) */}
            <button
              type="button"
              onClick={() => setTheme("default")}
              className={`pixel-toggle-btn ${theme === "default" || theme === "pink" ? "active" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                padding: "8px 4px"
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                <span style={{ width: "12px", height: "12px", background: "#24324A", border: "1px solid #182232" }} />
                <span style={{ width: "12px", height: "12px", background: "#F7F1E3", border: "1px solid #182232" }} />
              </div>
              <span style={{ fontSize: "8.5px" }}>Navy/Cream</span>
            </button>

            {/* Warm Cream Studio */}
            <button
              type="button"
              onClick={() => setTheme("warm-cream")}
              className={`pixel-toggle-btn ${theme === "warm-cream" ? "active" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                padding: "8px 4px"
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                <span style={{ width: "12px", height: "12px", background: "#EDE5D3", border: "1px solid #24324A" }} />
                <span style={{ width: "12px", height: "12px", background: "#4E9F9A", border: "1px solid #24324A" }} />
              </div>
              <span style={{ fontSize: "8.5px" }}>Cream Desk</span>
            </button>

            {/* Midnight Console */}
            <button
              type="button"
              onClick={() => setTheme("midnight")}
              className={`pixel-toggle-btn ${theme === "midnight" ? "active" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                padding: "8px 4px"
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                <span style={{ width: "12px", height: "12px", background: "#161F2E", border: "1px solid #0E1520" }} />
                <span style={{ width: "12px", height: "12px", background: "#8D86C9", border: "1px solid #0E1520" }} />
              </div>
              <span style={{ fontSize: "8.5px" }}>Midnight</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERFACE */}
      <section
        style={{
          border: "2px solid var(--border)",
          padding: "12px 14px",
          backgroundColor: "var(--surface-dark)",
          boxShadow: "1px 1px 0 var(--shadow)",
          borderRadius: "0px"
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--text-primary)",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>✨</span> Interface & Motion
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px"
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
              Animations
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Window transitions, subtle steam & twinkle effects
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setAnimationsEnabled(true)}
              className={`pixel-toggle-btn ${animationsEnabled ? "active" : ""}`}
            >
              ON
            </button>
            <button
              type="button"
              onClick={() => setAnimationsEnabled(false)}
              className={`pixel-toggle-btn ${!animationsEnabled ? "active" : ""}`}
            >
              OFF
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: CLOCK */}
      <section
        style={{
          border: "2px solid var(--border)",
          padding: "12px 14px",
          backgroundColor: "var(--surface-dark)",
          boxShadow: "1px 1px 0 var(--shadow)",
          borderRadius: "0px"
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--text-primary)",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>⏰</span> System Clock
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px"
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
              Time Format
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Choose 12-hour (AM/PM) or 24-hour military display
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setClockFormat("12h")}
              className={`pixel-toggle-btn ${clockFormat === "12h" ? "active" : ""}`}
            >
              12-Hour
            </button>
            <button
              type="button"
              onClick={() => setClockFormat("24h")}
              className={`pixel-toggle-btn ${clockFormat === "24h" ? "active" : ""}`}
            >
              24-Hour
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: ACCESSIBILITY */}
      <section
        style={{
          border: "2px solid var(--border)",
          padding: "12px 14px",
          backgroundColor: "var(--surface-dark)",
          boxShadow: "1px 1px 0 var(--shadow)",
          borderRadius: "0px"
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--text-primary)",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>♿</span> Accessibility
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px"
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>
              Reduced Motion
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Disable all floating canvas effects and window popups
            </div>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setReducedMotion(false)}
              className={`pixel-toggle-btn ${!reducedMotion ? "active" : ""}`}
            >
              OFF
            </button>
            <button
              type="button"
              onClick={() => setReducedMotion(true)}
              className={`pixel-toggle-btn ${reducedMotion ? "active" : ""}`}
            >
              ON
            </button>
          </div>
        </div>
      </section>

      {/* Reset & Notice Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "4px",
          fontSize: "11px",
          color: "var(--text-secondary)"
        }}
      >
        <span>💾 Settings saved automatically</span>
        <button
          type="button"
          onClick={onResetDefaults}
          className="pixel-button pixel-button-sm"
          style={{ fontSize: "8px" }}
        >
          Reset Defaults
        </button>
      </div>
    </div>
  );
}
