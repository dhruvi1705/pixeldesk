import React from "react";
import { CompanionBehavior } from "./CompanionBehavior";

/**
 * PixelCompanion Component
 * Renders the persistent desktop companion card.
 * 
 * Shows what the character is doing purely through its visual appearance,
 * behavior overlays, and animations. No text status labels.
 * 
 * @param {object} props
 * @param {object} props.avatar - avatarConfig object
 * @param {object} props.avatarConfig - avatarConfig object (alias)
 * @param {string} props.state - current companion state
 * @param {function} [props.onOpenStudio] - callback to open Avatar Studio
 */
export function PixelCompanion({
  avatar,
  avatarConfig,
  state = "IDLE",
  onOpenStudio
}) {
  const currentAvatar = avatar || avatarConfig || {};

  return (
    <aside
      aria-label="Pixel Companion"
      className={`pixel-companion-card companion-state-${state.toLowerCase()}`}
      style={{
        backgroundColor: "var(--surface)",
        border: "2px solid var(--border)",
        boxShadow: "3px 3px 0 var(--shadow)",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        width: "128px",
        position: "relative",
        userSelect: "none"
      }}
    >
      {/* Companion Card Header: COMPANION on left, EDIT on right */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "5px"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            color: "var(--text-primary)",
            letterSpacing: "0.5px"
          }}
        >
          COMPANION
        </span>

        {onOpenStudio && (
          <button
            type="button"
            onClick={onOpenStudio}
            title="Customize avatar in Avatar Studio"
            aria-label="Edit avatar in Studio"
            style={{
              background: "transparent",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-pixel)",
              fontSize: "6.5px",
              padding: "1px 4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              lineHeight: 1.2
            }}
          >
            EDIT
          </button>
        )}
      </div>

      {/* Tiny living character window with behavior overlays */}
      <CompanionBehavior
        avatarConfig={currentAvatar}
        state={state}
        size={100}
      />
    </aside>
  );
}
