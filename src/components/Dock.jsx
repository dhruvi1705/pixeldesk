import React from "react";
import { APPS } from "../data/apps";

export function Dock({ openWindows, activeWindowId, onToggleApp }) {
  // Primary dock apps for quick launching
  const dockAppIds = ["welcome", "tasks", "notes", "focus", "calendar", "settings", "help"];
  const dockApps = dockAppIds.map(id => APPS.find(a => a.id === id)).filter(Boolean);

  return (
    <footer
      className="pixel-dock-container"
      style={{
        position: "absolute",
        bottom: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 90,
        maxWidth: "96vw"
      }}
    >
      <nav
        aria-label="Desktop Dock"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--dock-bg)",
          border: "2px solid var(--dock-border)",
          boxShadow: "var(--pixel-shadow)",
          padding: "6px 12px",
          backdropFilter: "blur(6px)",
          borderRadius: "0px"
        }}
        className="pixel-dock"
      >
        {dockApps.map((app) => {
          const isOpen = openWindows.some((w) => w.id === app.id && !w.minimized);
          const isMinimized = openWindows.some((w) => w.id === app.id && w.minimized);
          const isActive = activeWindowId === app.id;

          return (
            <button
              key={app.id}
              onClick={() => onToggleApp(app.id)}
              title={`${app.name} (${isOpen ? (isActive ? "Active" : "Open") : isMinimized ? "Minimized" : "Launch"})`}
              aria-label={`${app.name} ${isOpen ? "open" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "44px",
                backgroundColor: isActive ? "var(--color-teal-light)" : "var(--surface)",
                border: isActive ? "2px solid var(--color-teal)" : "2px solid var(--border)",
                boxShadow: isActive ? "inset 1px 1px 0 rgba(0,0,0,0.2)" : "1px 1px 0 var(--shadow)",
                cursor: "pointer",
                position: "relative",
                borderRadius: "0px",
                transition: "transform 0.15s ease, background 0.15s ease, border-color 0.15s ease"
              }}
              className="dock-item-btn"
            >
              <span style={{ fontSize: "19px", lineHeight: 1 }}>{app.icon}</span>

              {/* Status indicator pip: Teal for active, Yellow for open */}
              {(isOpen || isMinimized) && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    width: "4px",
                    height: "4px",
                    backgroundColor: isActive ? "var(--color-teal)" : "var(--color-yellow)",
                    border: "0.5px solid var(--color-navy)",
                    borderRadius: "0px"
                  }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
