import React from "react";
import { useClock } from "../hooks/useClock";
import { useBattery } from "../hooks/useBattery";

export function TopBar({ clockFormat = "12h", onOpenApp }) {
  const { date, time } = useClock(clockFormat);
  const battery = useBattery();

  return (
    <header
      className="top-bar"
      style={{
        height: "38px",
        backgroundColor: "var(--topbar-bg)",
        borderBottom: "2px solid var(--topbar-border)",
        boxShadow: "0 2px 0px var(--shadow)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        zIndex: 100,
        position: "relative",
        userSelect: "none"
      }}
    >
      {/* Left: PixelDesk Brand / System Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() => onOpenApp("welcome")}
          aria-label="Open Welcome and PixelDesk System Menu"
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "4px 6px",
            borderRadius: "0px",
            color: "var(--topbar-text)"
          }}
          className="topbar-brand-btn"
        >
          <span style={{ fontSize: "15px" }}>🖥️</span>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "10px",
              letterSpacing: "0.5px",
              fontWeight: 700,
              color: "var(--topbar-text)"
            }}
          >
            PIXELDESK
          </span>
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "14px",
              backgroundColor: "var(--color-lavender)",
              border: "1px solid var(--color-navy-dark)",
              padding: "0px 5px",
              color: "#ffffff"
            }}
            className="topbar-ver-badge"
          >
            v0.1
          </span>
        </button>
      </div>

      {/* Center: Live Date & Time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontFamily: "var(--font-retro)",
          fontSize: "18px",
          color: "var(--topbar-text)"
        }}
        className="topbar-center"
      >
        <span className="topbar-date" style={{ opacity: 0.85 }}>{date}</span>
        <span
          style={{
            backgroundColor: "var(--color-navy-dark)",
            padding: "2px 8px",
            border: "1px solid var(--border-subtle)",
            fontFamily: "var(--font-retro)",
            fontSize: "18px",
            letterSpacing: "1px",
            color: "var(--color-cream)"
          }}
          className="topbar-clock"
        >
          {time}
        </span>
      </div>

      {/* Right: Battery & Status Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Battery Indicator */}
        <div
          title={battery.isSupported ? `Battery: ${battery.level}% (${battery.statusText})` : "System status: Online"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-retro)",
            fontSize: "16px",
            color: "var(--color-cream)",
            backgroundColor: "var(--color-navy-dark)",
            padding: "2px 7px",
            border: "1px solid var(--border-subtle)"
          }}
        >
          {/* Pixel-art battery outline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px"
            }}
          >
            <div
              style={{
                width: "20px",
                height: "11px",
                border: "1.5px solid var(--border-subtle)",
                padding: "1px",
                display: "flex",
                alignItems: "center",
                background: "var(--color-navy)"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, Math.max(10, battery.level))}%`,
                  backgroundColor: battery.charging ? "var(--color-yellow)" : "var(--color-teal)",
                  transition: "width 0.3s ease"
                }}
              />
            </div>
            <div
              style={{
                width: "2px",
                height: "5px",
                backgroundColor: "var(--border-subtle)"
              }}
            />
          </div>
          <span>{battery.level}%</span>
        </div>

        {/* Live Status indicator (Teal = active/healthy) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--desktop-text-muted)"
          }}
          className="topbar-status-text"
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              backgroundColor: "var(--color-teal)",
              border: "1px solid var(--color-navy-dark)",
              boxShadow: "0 0 4px var(--color-teal)",
              display: "inline-block"
            }}
            aria-hidden="true"
          />
          <span>{battery.statusText}</span>
        </div>

        {/* Quick Settings Icon */}
        <button
          onClick={() => onOpenApp("settings")}
          aria-label="Open Settings"
          title="Open Settings"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            padding: "2px 4px",
            color: "var(--color-cream)",
            display: "flex",
            alignItems: "center"
          }}
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
