import React from "react";
import { Link, useNavigate } from "react-router-dom";

export function AuthWindow({ title, icon = "🖥️", children, backTo = "/" }) {
  const navigate = useNavigate();

  return (
    <div
      className="pixel-auth-layout pixel-page-transition"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        position: "relative",
        overflowX: "hidden"
      }}
    >
      {/* Background Tiled Grid */}
      <div className="pixel-desktop-wallpaper" aria-hidden="true" />

      {/* Top subtle branding link */}
      <nav
        style={{
          position: "absolute",
          top: "16px",
          left: "20px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--color-cream)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 8px",
            backgroundColor: "rgba(36, 50, 74, 0.8)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "1px 1px 0 var(--shadow)"
          }}
          title="Back to Boot Screen"
          aria-label="Back to Launch Screen"
        >
          <span>◀</span>
          <span>PIXELDESK</span>
        </Link>
      </nav>

      {/* Centered Auth Window */}
      <div
        className="pixel-window animate-window-pop"
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          boxShadow: "var(--pixel-shadow)",
          zIndex: 5,
          position: "relative",
          margin: "auto 0"
        }}
        role="dialog"
        aria-label={title}
      >
        {/* Retro Window Titlebar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px",
            backgroundColor: "var(--color-navy)",
            color: "var(--color-cream)",
            borderBottom: "2px solid var(--border)",
            userSelect: "none"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "var(--color-teal)",
                display: "inline-block",
                border: "1px solid var(--color-navy-dark)"
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: "14px" }}>{icon}</span>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px"
              }}
            >
              {title}
            </span>
          </div>

          {/* Window action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              type="button"
              onClick={() => navigate(backTo)}
              aria-label="Back"
              title="Back"
              className="win-btn"
              style={{
                width: "20px",
                height: "18px",
                padding: 0,
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                boxShadow: "1px 1px 0 var(--shadow)",
                cursor: "pointer",
                fontFamily: "var(--font-pixel)",
                fontSize: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Close to Launch"
              title="Close"
              className="win-btn win-btn-close"
              style={{
                width: "20px",
                height: "18px",
                padding: 0,
                backgroundColor: "var(--color-coral)",
                color: "#ffffff",
                border: "1px solid var(--border)",
                boxShadow: "1px 1px 0 var(--shadow)",
                cursor: "pointer",
                fontFamily: "var(--font-pixel)",
                fontSize: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✕
            </button>
          </div>
        </header>

        {/* Window Body */}
        <div
          style={{
            padding: "20px 18px",
            backgroundColor: "var(--surface)"
          }}
        >
          {children}
        </div>
      </div>

      {/* Subtle Bottom Footer */}
      <footer
        style={{
          marginTop: "16px",
          fontFamily: "var(--font-retro)",
          fontSize: "14px",
          color: "var(--desktop-text-muted)",
          zIndex: 5,
          textAlign: "center"
        }}
      >
        PIXELDESK OS • RETRO PRODUCTIVITY WORKSPACE
      </footer>
    </div>
  );
}
