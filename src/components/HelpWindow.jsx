import React from "react";
import { APPS } from "../data/apps";

export function HelpWindow() {
  // Filter primary productivity apps to display in the suite grid
  const productivityApps = APPS.filter(
    (app) => app.id !== "welcome" && app.id !== "help" && app.id !== "settings"
  );

  return (
    <div
      className="about-window-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "var(--font-body)",
        padding: "2px 0 10px 0",
        boxSizing: "border-box",
        maxWidth: "100%"
      }}
    >
      {/* SECTION A: Product Introduction (Hero Focus) */}
      <section
        aria-labelledby="about-heading"
        style={{
          border: "2px solid var(--border)",
          backgroundColor: "var(--surface-dark)",
          padding: "16px",
          boxShadow: "2px 2px 0 var(--shadow)",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "28px", lineHeight: 1 }} aria-hidden="true">
            💻
          </span>
          <div style={{ flex: 1, minWidth: "160px" }}>
            <h3
              id="about-heading"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "13px",
                color: "var(--text-primary)",
                margin: 0,
                letterSpacing: "0.5px"
              }}
            >
              About PixelDesk
            </h3>
            <p
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "15px",
                color: "var(--text-secondary)",
                margin: "2px 0 0 0"
              }}
            >
              RETRO-INSPIRED PRODUCTIVITY WORKSPACE
            </p>
          </div>
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "15px",
              backgroundColor: "var(--color-navy)",
              color: "var(--color-cream)",
              padding: "3px 8px",
              border: "1px solid var(--border)",
              boxShadow: "1px 1px 0 var(--shadow)"
            }}
          >
            v0.1 — Active Preview
          </span>
        </div>

        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.5,
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          A personal digital workspace that brings your tasks, notes, calendar, focus sessions, and finances together in one retro-inspired desktop.
        </p>
      </section>

      {/* SECTION B: Product Information */}
      <section aria-labelledby="product-info-heading">
        <h4
          id="product-info-heading"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-primary)",
            margin: "0 0 8px 0",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span style={{ color: "var(--color-teal)" }}>▶</span> PRODUCT INFORMATION
        </h4>

        <div
          style={{
            border: "1.5px solid var(--border)",
            backgroundColor: "#FFFFFF",
            boxShadow: "1.5px 1.5px 0 var(--shadow)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              padding: "7px 10px",
              borderBottom: "1px solid var(--border-subtle)",
              alignItems: "center",
              gap: "8px",
              fontSize: "12.5px"
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Product Name</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>PixelDesk</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              padding: "7px 10px",
              borderBottom: "1px solid var(--border-subtle)",
              backgroundColor: "var(--surface-dark)",
              alignItems: "center",
              gap: "8px",
              fontSize: "12.5px"
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Version</span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "15px", color: "var(--text-primary)" }}>v0.1 — Active Preview</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              padding: "7px 10px",
              borderBottom: "1px solid var(--border-subtle)",
              alignItems: "center",
              gap: "8px",
              fontSize: "12.5px"
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Category</span>
            <span style={{ color: "var(--text-primary)" }}>Personal Productivity Workspace</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              padding: "7px 10px",
              backgroundColor: "var(--surface-dark)",
              alignItems: "center",
              gap: "8px",
              fontSize: "12.5px"
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Design</span>
            <span style={{ color: "var(--text-primary)" }}>Mature Retro-Productivity Aesthetic</span>
          </div>
        </div>
      </section>

      {/* SECTION C: Design Philosophy */}
      <section aria-labelledby="design-philosophy-heading">
        <h4
          id="design-philosophy-heading"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-primary)",
            margin: "0 0 8px 0",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span style={{ color: "var(--color-coral)" }}>▶</span> DESIGN PHILOSOPHY
        </h4>

        <div
          style={{
            border: "1.5px solid var(--border)",
            backgroundColor: "#FFFFFF",
            boxShadow: "1.5px 1.5px 0 var(--shadow)",
            padding: "10px 14px"
          }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "12.5px",
              color: "var(--text-primary)"
            }}
          >
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "var(--color-teal)", flexShrink: 0 }}>◆</span>
              <span>Balanced navy and cream palette</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "var(--color-coral)", flexShrink: 0 }}>◆</span>
              <span>Teal, coral, and yellow accents</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "var(--color-yellow-dark)", flexShrink: 0 }}>◆</span>
              <span>Pixel-art visuals and retro window styling</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "var(--color-lavender-dark)", flexShrink: 0 }}>◆</span>
              <span>Draggable and stackable desktop windows</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ color: "var(--color-teal)", flexShrink: 0 }}>◆</span>
              <span>Responsive desktop and mobile layouts</span>
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION D: Productivity Suite */}
      <section aria-labelledby="productivity-suite-heading">
        <h4
          id="productivity-suite-heading"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-primary)",
            margin: "0 0 8px 0",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span style={{ color: "var(--color-yellow-dark)" }}>▶</span> PRODUCTIVITY SUITE
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "8px"
          }}
        >
          {productivityApps.map((app) => (
            <div
              key={app.id}
              className="about-app-card"
              style={{
                border: "1.5px solid var(--border)",
                backgroundColor: "#FFFFFF",
                padding: "8px 10px",
                boxShadow: "1.5px 1.5px 0 var(--shadow)",
                display: "flex",
                flexDirection: "column",
                gap: "3px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "16px" }} aria-hidden="true">{app.icon}</span>
                <span style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--text-primary)" }}>
                  {app.name}
                </span>
              </div>
              <p
                style={{
                  fontSize: "11.5px",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.35
                }}
              >
                {app.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION E: Technology Stack */}
      <section aria-labelledby="tech-stack-heading">
        <h4
          id="tech-stack-heading"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-primary)",
            margin: "0 0 8px 0",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span style={{ color: "var(--color-lavender-dark)" }}>▶</span> TECHNOLOGY STACK
        </h4>

        <div
          style={{
            border: "1.5px solid var(--border)",
            backgroundColor: "#FFFFFF",
            boxShadow: "1.5px 1.5px 0 var(--shadow)",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px"
              }}
            >
              FRONTEND
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>React 19</span>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>Vite</span>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>React Router 7</span>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>Vanilla CSS Design System</span>
            </div>
          </div>

          <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px"
              }}
            >
              BACKEND
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>FastAPI</span>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>Python</span>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>SQLAlchemy 2.0 (Async)</span>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>Alembic Migrations</span>
            </div>
          </div>

          <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: "4px"
              }}
            >
              DATABASE & SECURITY
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>PostgreSQL</span>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>JWT Authentication</span>
              <span className="pixel-tag" style={{ backgroundColor: "var(--surface-dark)" }}>Bcrypt Password Hashing</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: Current Status */}
      <footer
        style={{
          border: "1.5px solid var(--border-subtle)",
          backgroundColor: "var(--surface-dark)",
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "var(--color-teal)",
              display: "inline-block",
              boxShadow: "0 0 4px var(--color-teal)"
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-primary)",
              letterSpacing: "0.5px"
            }}
          >
            ACTIVE PREVIEW
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "14px",
            color: "var(--text-secondary)",
            margin: 0
          }}
        >
          PixelDesk is under active development. Designed for focused productivity.
        </p>
      </footer>
    </div>
  );
}
