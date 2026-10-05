import React from "react";
import { FOCUS_MODES, MODE_CONFIG } from "../../data/focusSettings";

export function FocusModes({
  currentMode,
  onSelectMode,
  disabled
}) {
  const modes = [
    FOCUS_MODES.FOCUS,
    FOCUS_MODES.SHORT_BREAK,
    FOCUS_MODES.LONG_BREAK
  ];

  return (
    <div
      role="tablist"
      aria-label="Focus timer modes"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "6px",
        width: "100%"
      }}
    >
      {modes.map((modeKey) => {
        const config = MODE_CONFIG[modeKey];
        const isActive = currentMode === modeKey;

        return (
          <button
            key={modeKey}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onSelectMode(modeKey)}
            className={`pixel-toggle-btn ${isActive ? "active" : ""}`}
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8.5px",
              padding: "6px 4px",
              textAlign: "center",
              lineHeight: 1.2,
              backgroundColor: isActive
                ? modeKey === FOCUS_MODES.FOCUS
                  ? "var(--color-teal)"
                  : "var(--color-yellow-dark)"
                : "var(--surface-dark)",
              color: isActive ? "#ffffff" : "var(--text-primary)",
              borderColor: isActive ? "var(--border)" : "var(--border-subtle)",
              opacity: disabled ? 0.6 : 1,
              cursor: disabled ? "not-allowed" : "pointer"
            }}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
