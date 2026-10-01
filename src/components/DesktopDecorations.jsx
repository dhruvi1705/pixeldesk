import React from "react";

export function DesktopDecorations() {
  return (
    <div
      className="desktop-decorations"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1
      }}
      aria-hidden="true"
    >
      {/* Top Left Retro Cloud (Warm Cream, subtle) */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "46px",
          left: "220px",
          color: "var(--color-cream)",
          opacity: 0.25
        }}
      >
        <svg width="44" height="20" viewBox="0 0 22 10" fill="currentColor">
          <rect x="6" y="1" width="10" height="2" />
          <rect x="4" y="3" width="14" height="2" />
          <rect x="2" y="5" width="18" height="3" />
          <rect x="4" y="8" width="14" height="1" />
        </svg>
      </div>

      {/* Top Right Retro Cloud (Warm Cream, subtle) */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "56px",
          right: "130px",
          color: "var(--color-cream)",
          opacity: 0.2,
          animationDelay: "2s"
        }}
      >
        <svg width="36" height="16" viewBox="0 0 22 10" fill="currentColor">
          <rect x="7" y="1" width="8" height="2" />
          <rect x="4" y="3" width="14" height="2" />
          <rect x="2" y="5" width="18" height="3" />
          <rect x="4" y="8" width="14" height="1" />
        </svg>
      </div>

      {/* Golden Yellow Sparkle / Cross Star - Top Center (Highlights) */}
      <div
        className="animate-twinkle"
        style={{
          position: "absolute",
          top: "70px",
          left: "52%",
          color: "var(--color-yellow)",
          opacity: 0.75,
          animationDelay: "0.4s"
        }}
      >
        <svg width="12" height="12" viewBox="0 0 6 6" fill="currentColor">
          <rect x="2" y="0" width="2" height="6" />
          <rect x="0" y="2" width="6" height="2" />
        </svg>
      </div>

      {/* Muted Lavender Pixel Star - Mid Right (Notes / AI accent) */}
      <div
        className="animate-twinkle"
        style={{
          position: "absolute",
          top: "220px",
          right: "90px",
          color: "var(--color-lavender)",
          opacity: 0.65,
          animationDelay: "1.2s"
        }}
      >
        <svg width="10" height="10" viewBox="0 0 6 6" fill="currentColor">
          <rect x="2" y="0" width="2" height="6" />
          <rect x="0" y="2" width="6" height="2" />
        </svg>
      </div>

      {/* Muted Teal Sparkle - Mid Left (Productivity accent) */}
      <div
        className="animate-twinkle"
        style={{
          position: "absolute",
          top: "360px",
          left: "140px",
          color: "var(--color-teal)",
          opacity: 0.7,
          animationDelay: "1.8s"
        }}
      >
        <svg width="12" height="12" viewBox="0 0 6 6" fill="currentColor">
          <rect x="2" y="0" width="2" height="6" />
          <rect x="0" y="2" width="6" height="2" />
        </svg>
      </div>

      {/* Retro Pixel Coffee Mug - Bottom Left (Productivity Workstation vibe) */}
      <div
        style={{
          position: "absolute",
          bottom: "82px",
          left: "36px",
          opacity: 0.8
        }}
        title="Fuel for productivity"
      >
        {/* Floating subtle pixel steam */}
        <div
          className="animate-float"
          style={{
            position: "absolute",
            top: "-12px",
            left: "6px",
            color: "var(--color-cream)",
            opacity: 0.4
          }}
        >
          <svg width="14" height="12" viewBox="0 0 7 6" fill="currentColor">
            <rect x="1" y="0" width="1" height="2" />
            <rect x="2" y="2" width="1" height="2" />
            <rect x="4" y="1" width="1" height="2" />
            <rect x="5" y="3" width="1" height="2" />
          </svg>
        </div>

        {/* Coffee Mug SVG */}
        <svg width="28" height="24" viewBox="0 0 14 12" fill="none">
          {/* Mug Body (Warm Cream with dark outline) */}
          <rect x="2" y="2" width="8" height="9" fill="var(--color-cream)" />
          <rect x="3" y="1" width="6" height="2" fill="var(--color-navy)" />
          <rect x="1" y="3" width="1" height="7" fill="var(--color-navy)" />
          <rect x="10" y="3" width="1" height="7" fill="var(--color-navy)" />
          <rect x="2" y="10" width="8" height="1" fill="var(--color-navy)" />
          {/* Handle */}
          <rect x="10" y="4" width="3" height="1" fill="var(--color-navy)" />
          <rect x="12" y="5" width="1" height="3" fill="var(--color-navy)" />
          <rect x="10" y="8" width="3" height="1" fill="var(--color-navy)" />
          {/* Coffee liquid surface line */}
          <rect x="3" y="3" width="6" height="1" fill="var(--color-coral)" />
        </svg>
      </div>

      {/* Retro Pixel Desk Succulent Plant - Bottom Right (Cozy desk plant) */}
      <div
        style={{
          position: "absolute",
          bottom: "82px",
          right: "48px",
          opacity: 0.8
        }}
        title="Pixel desk plant"
      >
        <svg width="26" height="28" viewBox="0 0 13 14" fill="none">
          {/* Succulent Leaves (Muted Teal) */}
          <rect x="5" y="1" width="3" height="3" fill="var(--color-teal)" />
          <rect x="2" y="3" width="4" height="3" fill="var(--color-teal)" />
          <rect x="7" y="3" width="4" height="3" fill="var(--color-teal)" />
          <rect x="4" y="4" width="5" height="3" fill="var(--color-teal-hover)" />
          {/* Pot Rim (Warm Cream & Navy outline) */}
          <rect x="2" y="7" width="9" height="2" fill="var(--color-cream)" stroke="var(--color-navy)" strokeWidth="0.8" />
          {/* Pot Body */}
          <rect x="3" y="9" width="7" height="4" fill="var(--color-cream-panel)" stroke="var(--color-navy)" strokeWidth="0.8" />
          {/* Pot Accent Stripe (Terracotta / Coral) */}
          <rect x="4" y="10" width="5" height="1" fill="var(--color-coral)" />
        </svg>
      </div>
    </div>
  );
}
