import React from "react";
import { formatTimerDigits, MODE_CONFIG, TIMER_STATUS, FOCUS_MODES } from "../../data/focusSettings";

export function FocusTimer({
  mode,
  status,
  remainingSeconds,
  totalSeconds
}) {
  const config = MODE_CONFIG[mode];
  const digits = formatTimerDigits(remainingSeconds);

  // Calculate percentage completed (0 to 100)
  const percentComplete = totalSeconds > 0
    ? Math.min(100, Math.max(0, Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100)))
    : 0;

  const isBreak = mode !== FOCUS_MODES.FOCUS;
  const progressColor = isBreak ? "var(--color-yellow)" : "var(--color-teal)";

  const getStatusBadge = () => {
    if (status === TIMER_STATUS.COMPLETED) {
      return { text: "✓ COMPLETE", bg: "var(--color-teal)", color: "#ffffff" };
    }
    if (status === TIMER_STATUS.PAUSED) {
      return { text: "❚❚ PAUSED", bg: "var(--color-yellow)", color: "var(--color-navy)" };
    }
    if (status === TIMER_STATUS.RUNNING) {
      return { text: isBreak ? "☕ RESTING" : "⚡ FOCUSING", bg: progressColor, color: isBreak ? "var(--color-navy)" : "#ffffff" };
    }
    return { text: config.badge, bg: "var(--surface-dark)", color: "var(--text-secondary)" };
  };

  const badge = getStatusBadge();

  return (
    <div
      className="focus-timer-card pixel-box"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 12px",
        backgroundColor: "var(--surface)",
        border: "var(--pixel-border)",
        boxShadow: "var(--pixel-shadow)",
        gap: "10px",
        width: "100%"
      }}
    >
      {/* Session Title / Status Badge */}
      <div
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "8.5px",
          padding: "3px 8px",
          backgroundColor: badge.bg,
          color: badge.color,
          border: "1px solid var(--border)",
          boxShadow: "1px 1px 0 var(--shadow)",
          letterSpacing: "0.5px"
        }}
      >
        {badge.text}
      </div>

      {/* Large Readable Timer Display */}
      <div
        role="timer"
        aria-live="off"
        aria-label={`Time remaining: ${digits}`}
        style={{
          fontFamily: "var(--font-retro)",
          fontSize: "56px",
          lineHeight: 1,
          fontWeight: 700,
          color: status === TIMER_STATUS.PAUSED ? "var(--text-secondary)" : "var(--text-primary)",
          letterSpacing: "2px",
          userSelect: "none"
        }}
      >
        {digits}
      </div>

      {/* Visual Pixel Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={percentComplete}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Session progress"
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "14px",
          backgroundColor: "var(--surface-dark)",
          border: "2px solid var(--border)",
          boxShadow: "inset 1px 1px 0 rgba(0, 0, 0, 0.15)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percentComplete}%`,
            backgroundColor: progressColor,
            transition: "width 0.25s linear",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.4)"
          }}
        />
      </div>

      {/* Progress percentage label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "320px",
          fontFamily: "var(--font-retro)",
          fontSize: "13px",
          color: "var(--text-secondary)"
        }}
      >
        <span>{percentComplete}% Completed</span>
        <span>{formatTimerDigits(totalSeconds)} Total</span>
      </div>
    </div>
  );
}
