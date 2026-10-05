import React from "react";

export function FocusHistory({
  sessions = []
}) {
  // Show most recent 4 completed sessions from today
  const recentSessions = sessions.slice(0, 4);

  return (
    <div
      className="focus-history-card pixel-box"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "8px 10px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border-subtle)",
        width: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px dashed var(--border-subtle)",
          paddingBottom: "4px"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--text-secondary)"
          }}
        >
          RECENT SESSIONS
        </span>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "12px",
            color: "var(--text-muted)"
          }}
        >
          TODAY
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          maxHeight: "110px",
          overflowY: "auto"
        }}
      >
        {recentSessions.length === 0 ? (
          <div
            style={{
              padding: "8px 0",
              textAlign: "center",
              fontFamily: "var(--font-retro)",
              fontSize: "14px",
              color: "var(--text-muted)"
            }}
          >
            No sessions completed today yet.
          </div>
        ) : (
          recentSessions.map((sess) => (
            <div
              key={sess.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "3px 6px",
                backgroundColor: "var(--surface-dark)",
                border: "1px solid var(--border-subtle)",
                fontSize: "12px",
                fontFamily: "var(--font-body)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7.5px",
                    color: "var(--color-teal)",
                    flexShrink: 0
                  }}
                >
                  {sess.durationMinutes}m
                </span>
                <span
                  style={{
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={sess.taskTitle}
                >
                  — {sess.taskTitle || "Focus Session"}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  flexShrink: 0
                }}
              >
                {new Date(sess.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
