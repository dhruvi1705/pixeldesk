import React from "react";
import { TIMER_STATUS, FOCUS_MODES } from "../../data/focusSettings";

export function FocusControls({
  status,
  mode,
  onStart,
  onPause,
  onResume,
  onReset,
  onStartNext
}) {
  return (
    <div
      className="focus-controls-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "100%",
        flexWrap: "wrap"
      }}
    >
      {/* 1. IDLE State: [ ▶ START ] */}
      {status === TIMER_STATUS.IDLE && (
        <button
          type="button"
          onClick={onStart}
          className="pixel-button pixel-button-teal"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            padding: "8px 22px",
            gap: "6px"
          }}
        >
          ▶ START
        </button>
      )}

      {/* 2. RUNNING State: [ ❚❚ PAUSE ] [ ↻ RESET ] */}
      {status === TIMER_STATUS.RUNNING && (
        <>
          <button
            type="button"
            onClick={onPause}
            className="pixel-button"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              padding: "7px 18px",
              gap: "6px"
            }}
          >
            ❚❚ PAUSE
          </button>
          <button
            type="button"
            onClick={onReset}
            className="pixel-button"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              padding: "7px 14px",
              color: "var(--color-coral)",
              borderColor: "var(--color-coral)"
            }}
          >
            ↻ RESET
          </button>
        </>
      )}

      {/* 3. PAUSED State: [ ▶ RESUME ] [ ↻ RESET ] */}
      {status === TIMER_STATUS.PAUSED && (
        <>
          <button
            type="button"
            onClick={onResume}
            className="pixel-button pixel-button-teal"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              padding: "7px 18px",
              gap: "6px"
            }}
          >
            ▶ RESUME
          </button>
          <button
            type="button"
            onClick={onReset}
            className="pixel-button"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              padding: "7px 14px",
              color: "var(--color-coral)",
              borderColor: "var(--color-coral)"
            }}
          >
            ↻ RESET
          </button>
        </>
      )}

      {/* 4. COMPLETED State: [ ✓ COMPLETE ] & [ START BREAK / NEXT ] */}
      {status === TIMER_STATUS.COMPLETED && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "var(--color-teal)"
            }}
          >
            <span>✓</span>
            <span>{mode === FOCUS_MODES.FOCUS ? "FOCUS SESSION COMPLETE" : "BREAK FINISHED"}</span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={onStartNext}
              className="pixel-button pixel-button-teal"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "9px",
                padding: "8px 16px"
              }}
            >
              {mode === FOCUS_MODES.FOCUS ? "☕ START BREAK" : "⚡ START FOCUS"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="pixel-button"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "9px",
                padding: "8px 12px"
              }}
            >
              ↻ RESET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
