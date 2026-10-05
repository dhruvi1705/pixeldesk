import React from "react";
import { FOCUS_MODES, MODE_CONFIG } from "../../data/focusSettings";

export function FocusSettings({
  mode,
  settings,
  onSetDuration,
  onUpdateSettings,
  disabled
}) {
  const focusPresets = MODE_CONFIG[FOCUS_MODES.FOCUS].presets;
  const shortBreakPresets = MODE_CONFIG[FOCUS_MODES.SHORT_BREAK].presets;
  const longBreakPresets = MODE_CONFIG[FOCUS_MODES.LONG_BREAK].presets;

  return (
    <div
      className="focus-settings-section"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundColor: "var(--surface-dark)",
        border: "1px solid var(--border-subtle)",
        padding: "8px 10px",
        width: "100%"
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "8px",
          color: "var(--text-secondary)",
          borderBottom: "1px dashed var(--border-subtle)",
          paddingBottom: "3px"
        }}
      >
        DURATION PRESETS (MINUTES)
      </span>

      {/* Focus duration presets */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
        <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-primary)" }}>
          Focus:
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {focusPresets.map((dur) => (
            <button
              key={dur}
              type="button"
              disabled={disabled}
              onClick={() => onSetDuration(dur)}
              className={`pixel-button pixel-button-sm ${
                settings.focusDuration === dur && mode === FOCUS_MODES.FOCUS ? "pixel-button-teal" : ""
              }`}
              style={{
                padding: "2px 7px",
                fontSize: "7.5px",
                minWidth: "28px"
              }}
            >
              {dur}
            </button>
          ))}
        </div>
      </div>

      {/* Short break presets */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
        <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-primary)" }}>
          Short Break:
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {shortBreakPresets.map((dur) => (
            <button
              key={dur}
              type="button"
              disabled={disabled}
              onClick={() => onSetDuration(dur)}
              className={`pixel-button pixel-button-sm ${
                settings.shortBreakDuration === dur && mode === FOCUS_MODES.SHORT_BREAK ? "pixel-button-teal" : ""
              }`}
              style={{
                padding: "2px 7px",
                fontSize: "7.5px",
                minWidth: "28px"
              }}
            >
              {dur}
            </button>
          ))}
        </div>
      </div>

      {/* Long break presets */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
        <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-primary)" }}>
          Long Break:
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {longBreakPresets.map((dur) => (
            <button
              key={dur}
              type="button"
              disabled={disabled}
              onClick={() => onSetDuration(dur)}
              className={`pixel-button pixel-button-sm ${
                settings.longBreakDuration === dur && mode === FOCUS_MODES.LONG_BREAK ? "pixel-button-teal" : ""
              }`}
              style={{
                padding: "2px 7px",
                fontSize: "7.5px",
                minWidth: "28px"
              }}
            >
              {dur}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Toggles: Audio sound */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px dashed var(--border-subtle)",
          paddingTop: "6px",
          marginTop: "2px"
        }}
      >
        <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-primary)" }}>
          Retro Chime Sound:
        </span>
        <button
          type="button"
          onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          className={`pixel-button pixel-button-sm ${settings.soundEnabled ? "pixel-button-teal" : ""}`}
          style={{ padding: "2px 8px", fontSize: "7.5px" }}
        >
          {settings.soundEnabled ? "🔔 ON" : "🔕 OFF"}
        </button>
      </div>
    </div>
  );
}
