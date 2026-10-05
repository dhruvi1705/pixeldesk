import React, { useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopDecorations } from "./DesktopDecorations";
import { PixelCompanion } from "./avatar/PixelCompanion";
import { APPS } from "../data/apps";

export function Desktop({ onOpenApp, animationsEnabled, companion }) {
  const [selectedIconId, setSelectedIconId] = useState(null);

  // Desktop apps to display on the canvas
  // Show all primary apps + Help/About
  const desktopApps = APPS.filter(app => app.id !== "welcome");

  const handleDesktopClick = (e) => {
    // If clicked on desktop canvas directly, clear selection
    if (e.target.classList.contains("desktop-canvas") || e.target.classList.contains("pixel-desktop-wallpaper")) {
      setSelectedIconId(null);
    }
  };

  return (
    <main
      className="desktop-canvas"
      onClick={handleDesktopClick}
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "calc(100vh - 38px)",
        padding: "16px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Tiled retro wallpaper */}
      <div className="pixel-desktop-wallpaper" aria-hidden="true" />

      {/* Tasteful floating decorations */}
      {animationsEnabled && <DesktopDecorations />}

      {/* Desktop App Icons Grid */}
      <section
        aria-label="Desktop Applications"
        className="desktop-icon-grid"
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 96px)",
          gridAutoFlow: "dense",
          gap: "8px",
          alignContent: "flex-start",
          maxWidth: "440px",
          maxHeight: "calc(100% - 70px)",
          overflowY: "auto",
          paddingBottom: "10px"
        }}
      >
        {desktopApps.map((app) => (
          <DesktopIcon
            key={app.id}
            app={app}
            isSelected={selectedIconId === app.id}
            onSelect={setSelectedIconId}
            onClick={(id) => {
              setSelectedIconId(id);
              onOpenApp(id);
            }}
          />
        ))}
      </section>

      {/* Pixel Companion Station */}
      {companion && (
        <div className="desktop-companion-station">
          <PixelCompanion
            avatar={companion.avatarConfig}
            state={companion.state}
            message={companion.message}
            onOpenStudio={() => onOpenApp("avatar")}
          />
        </div>
      )}

      {/* Decorative Brand Watermark in bottom corner */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "20px",
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0.35,
          textAlign: "right",
          fontFamily: "var(--font-pixel)",
          fontSize: "9px",
          lineHeight: 1.6,
          color: "var(--text-primary)"
        }}
        className="desktop-watermark"
      >
        <div>PIXELDESK OS</div>
        <div style={{ fontFamily: "var(--font-retro)", fontSize: "14px" }}>RETRO PRODUCTIVITY WORKSPACE</div>
      </div>
    </main>
  );
}
