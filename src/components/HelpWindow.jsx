import React from "react";

export function HelpWindow() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        fontFamily: "var(--font-body)"
      }}
    >
      {/* Title & Description */}
      <div style={{ textAlign: "center", padding: "4px 0" }}>
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "12px",
            color: "var(--text-primary)",
            marginBottom: "8px"
          }}
        >
          About PixelDesk
        </h3>
        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.5,
            color: "var(--text-secondary)",
            maxWidth: "360px",
            margin: "0 auto"
          }}
        >
          PixelDesk is a mature retro-productivity workspace built to make daily planning, studying, and task management focused and aesthetically enjoyable.
        </p>
      </div>

      {/* Version Tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: "var(--surface-dark)",
          border: "2px solid var(--border)",
          borderRadius: "0px"
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>System Version</span>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "16px",
            backgroundColor: "var(--color-navy)",
            color: "var(--color-cream)",
            padding: "2px 8px",
            border: "1px solid var(--border)"
          }}
        >
          v0.1 — Active Preview
        </span>
      </div>

      {/* Current Level 1 Features */}
      <div
        style={{
          border: "2px solid var(--border)",
          padding: "12px",
          backgroundColor: "var(--surface-dark)",
          borderRadius: "0px"
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            color: "var(--text-primary)",
            marginBottom: "8px"
          }}
        >
          Active Foundation
        </h4>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontSize: "12px",
            color: "var(--text-primary)"
          }}
        >
          <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--color-teal)", fontWeight: "bold" }}>✔</span> Balanced Navy & Cream retro-productivity palette
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--color-teal)", fontWeight: "bold" }}>✔</span> Functional color roles (Teal, Coral, Yellow, Lavender)
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--color-teal)", fontWeight: "bold" }}>✔</span> Draggable, stackable retro window manager
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--color-teal)", fontWeight: "bold" }}>✔</span> Live battery and real-time system clock
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "var(--color-teal)", fontWeight: "bold" }}>✔</span> Responsive mobile & desktop multi-tasking
          </li>
        </ul>
      </div>

      {/* Future Roadmap / Level 2 Modules */}
      <div
        style={{
          border: "2px dashed var(--border)",
          padding: "12px",
          backgroundColor: "var(--surface)",
          borderRadius: "0px"
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            color: "var(--text-primary)",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span>Productivity Suite</span>
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "13px",
              backgroundColor: "var(--surface-dark)",
              color: "var(--color-teal)",
              padding: "1px 6px",
              border: "1px solid var(--border)"
            }}
          >
            Level 2 Roadmap
          </span>
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            fontSize: "11px",
            color: "var(--text-secondary)"
          }}
        >
          <div>📋 Tasks Module</div>
          <div>📝 Notes Scratchpad</div>
          <div>⏰ Pomodoro Focus</div>
          <div>📅 Calendar Planner</div>
          <div>💰 Budget Log</div>
          <div>🤖 AI Copilot</div>
        </div>
      </div>
    </div>
  );
}
