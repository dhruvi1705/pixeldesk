import React from "react";
import { ASSET_MAP } from "../../data/avatarOptions";

// Behavioral Pixel Art Overlays
import workingOverlay from "../../assets/avatar/behavior/working.svg";
import focusOverlay from "../../assets/avatar/behavior/focus.svg";
import breakOverlay from "../../assets/avatar/behavior/break.svg";
import sleepOverlay from "../../assets/avatar/behavior/sleep.svg";
import celebrateOverlay from "../../assets/avatar/behavior/celebrate.svg";
import writingOverlay from "../../assets/avatar/behavior/writing.svg";
import calendarOverlay from "../../assets/avatar/behavior/calendar.svg";
import financeOverlay from "../../assets/avatar/behavior/finance.svg";
import analyticsOverlay from "../../assets/avatar/behavior/analytics.svg";
import wakingOverlay from "../../assets/avatar/behavior/waking.svg";

const BEHAVIOR_OVERLAYS = {
  WORKING: workingOverlay,
  FOCUSING: focusOverlay,
  BREAK: breakOverlay,
  SLEEPING: sleepOverlay,
  CELEBRATING: celebrateOverlay,
  WRITING: writingOverlay,
  CALENDAR: calendarOverlay,
  FINANCE: financeOverlay,
  ANALYTICS: analyticsOverlay,
  ALERT: focusOverlay,
  WAKING: wakingOverlay,
  IDLE: null
};

/**
 * CompanionBehavior Component
 * Composites the user's customized avatar with real-time behavioral
 * pixel-art overlays and animations based on active workspace state.
 * 
 * @param {object} props
 * @param {object} props.avatarConfig - user's saved avatar configuration
 * @param {string} props.state - current state machine state
 * @param {number} [props.size=104] - rendering dimension in px
 */
export function CompanionBehavior({ avatarConfig = {}, state = "IDLE", size = 104 }) {
  const bgAsset = ASSET_MAP.background[avatarConfig.background];
  const skinAsset = ASSET_MAP.skin[avatarConfig.skin];
  const eyesAsset = ASSET_MAP.eyes[avatarConfig.eyes];
  const hairAsset = ASSET_MAP.hair[avatarConfig.hair];
  const outfitAsset = ASSET_MAP.outfit[avatarConfig.outfit];
  const accAsset = ASSET_MAP.accessory[avatarConfig.accessory];

  const behaviorAsset = BEHAVIOR_OVERLAYS[state] || null;
  const stateClass = `state-${(state || "idle").toLowerCase()}`;

  return (
    <div
      className={`companion-behavior-stage companion-anim-${(state || "idle").toLowerCase()}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        aspectRatio: "1 / 1",
        position: "relative",
        backgroundColor: "var(--color-cream)",
        border: "2px solid var(--border)",
        boxShadow: "var(--pixel-shadow-sm)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none"
      }}
    >
      {/* Decorative Grid Texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(36, 50, 74, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(36, 50, 74, 0.05) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* Decorative Corner Pixel Brackets */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "3px",
          left: "3px",
          width: "4px",
          height: "4px",
          borderTop: "1.5px solid var(--border-subtle)",
          borderLeft: "1.5px solid var(--border-subtle)",
          pointerEvents: "none",
          zIndex: 20
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "3px",
          right: "3px",
          width: "4px",
          height: "4px",
          borderTop: "1.5px solid var(--border-subtle)",
          borderRight: "1.5px solid var(--border-subtle)",
          pointerEvents: "none",
          zIndex: 20
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "3px",
          left: "3px",
          width: "4px",
          height: "4px",
          borderBottom: "1.5px solid var(--border-subtle)",
          borderLeft: "1.5px solid var(--border-subtle)",
          pointerEvents: "none",
          zIndex: 20
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "3px",
          right: "3px",
          width: "4px",
          height: "4px",
          borderBottom: "1.5px solid var(--border-subtle)",
          borderRight: "1.5px solid var(--border-subtle)",
          pointerEvents: "none",
          zIndex: 20
        }}
      />

      {/* Layer 1: Background */}
      {bgAsset && (
        <img
          src={bgAsset}
          alt=""
          aria-hidden="true"
          className="avatar-layer-img avatar-layer-bg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            zIndex: 2
          }}
        />
      )}

      {/* Layer 2: Skin / Base Body */}
      {skinAsset && (
        <img
          src={skinAsset}
          alt="Avatar base skin"
          className="avatar-layer-img avatar-layer-skin"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            zIndex: 3
          }}
        />
      )}

      {/* Layer 3: Eyes (hidden during sleep so closed eyelids show cleanly) */}
      {eyesAsset && state !== "SLEEPING" && (
        <img
          src={eyesAsset}
          alt="Avatar eyes"
          className="avatar-layer-img avatar-layer-eyes"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            zIndex: 4
          }}
        />
      )}

      {/* Layer 4: Outfit */}
      {outfitAsset && (
        <img
          src={outfitAsset}
          alt="Avatar outfit"
          className="avatar-layer-img avatar-layer-outfit"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            zIndex: 5
          }}
        />
      )}

      {/* Layer 5: Hair */}
      {hairAsset && (
        <img
          src={hairAsset}
          alt="Avatar hair"
          className="avatar-layer-img avatar-layer-hair"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            zIndex: 6
          }}
        />
      )}

      {/* Layer 6: Accessory */}
      {accAsset && (
        <img
          src={accAsset}
          alt="Avatar accessory"
          className="avatar-layer-img avatar-layer-accessory"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            zIndex: 7
          }}
        />
      )}

      {/* Layer 7: Behavioral Visual Overlay (Desk, Lamp, Mug, Zzz, Writing, Calendar, Ledger, Chart) */}
      {behaviorAsset && (
        <img
          src={behaviorAsset}
          alt=""
          aria-hidden="true"
          className={`companion-behavior-overlay ${stateClass}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            zIndex: 10,
            pointerEvents: "none"
          }}
        />
      )}
    </div>
  );
}
