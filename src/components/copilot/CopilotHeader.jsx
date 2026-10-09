import React, { useEffect } from "react";

export function CopilotHeader({
  isContextPanelOpen,
  onToggleContextPanel,
  showClearConfirm,
  onOpenClearConfirm,
  onCancelClearConfirm,
  onConfirmClear
}) {
  // Dismiss clear confirmation on Escape key
  useEffect(() => {
    if (!showClearConfirm) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancelClearConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showClearConfirm, onCancelClearConfirm]);

  return (
    <header
      className="copilot-header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: "8px 10px",
        backgroundColor: "var(--surface-dark)",
        border: "2px solid var(--border)",
        boxShadow: "var(--pixel-shadow-sm)",
        gap: "8px",
        position: "relative"
      }}
    >
      {/* Left: Robot icon and title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: "var(--color-lavender-light)",
            border: "2px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.4)"
          }}
          aria-hidden="true"
        >
          🤖
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "11px",
                color: "var(--text-primary)",
                letterSpacing: "0.5px"
              }}
            >
              AI COPILOT
            </span>
            <span
              style={{
                fontSize: "9px",
                fontFamily: "var(--font-pixel)",
                backgroundColor: "var(--color-teal)",
                color: "var(--color-cream)",
                padding: "2px 4px",
                border: "1px solid var(--border)",
                lineHeight: 1
              }}
              title="Operating in local offline query mode (zero network requests)"
            >
              LOCAL ENGINE
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Deterministic Workspace Queries • Zero Cloud AI
          </div>
        </div>
      </div>

      {/* Right: Actions (Context Toggle & Clear Chat) */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Context panel toggle */}
        <button
          onClick={onToggleContextPanel}
          title="Inspect live connected workspace stores"
          aria-expanded={isContextPanelOpen}
          aria-label="Toggle workspace context panel"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            backgroundColor: isContextPanelOpen ? "var(--color-lavender)" : "var(--surface)",
            color: isContextPanelOpen ? "#FFFFFF" : "var(--text-primary)",
            border: "2px solid var(--border)",
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            cursor: "pointer",
            boxShadow: isContextPanelOpen ? "inset 1px 1px 0 rgba(0,0,0,0.2)" : "1px 1px 0 var(--shadow)",
            transition: "all 0.1s ease"
          }}
        >
          <span>🗄️</span>
          <span>CONTEXT</span>
        </button>

        {/* Clear chat button */}
        <button
          onClick={onOpenClearConfirm}
          title="Clear conversation history"
          aria-label="Clear conversation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            backgroundColor: "var(--surface)",
            color: "var(--color-coral)",
            border: "2px solid var(--border)",
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            cursor: "pointer",
            boxShadow: "1px 1px 0 var(--shadow)",
            transition: "all 0.1s ease"
          }}
        >
          <span>🗑️</span>
          <span>CLEAR</span>
        </button>
      </div>

      {/* Clear conversation confirmation modal overlay */}
      {showClearConfirm && (
        <div
          role="dialog"
          aria-labelledby="clear-chat-dialog-title"
          style={{
            position: "absolute",
            top: "100%",
            right: "8px",
            marginTop: "4px",
            backgroundColor: "var(--surface)",
            border: "2px solid var(--border)",
            boxShadow: "var(--pixel-shadow)",
            padding: "10px",
            zIndex: 100,
            width: "230px"
          }}
        >
          <div
            id="clear-chat-dialog-title"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "10px",
              color: "var(--color-coral)",
              marginBottom: "6px"
            }}
          >
            RESET CHAT?
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-primary)", marginBottom: "8px" }}>
            This will reset conversation history back to the starting prompt.
          </div>
          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
            <button
              onClick={onCancelClearConfirm}
              style={{
                padding: "3px 8px",
                fontSize: "10px",
                fontFamily: "var(--font-pixel)",
                backgroundColor: "var(--surface-dark)",
                border: "1px solid var(--border)",
                cursor: "pointer"
              }}
            >
              CANCEL
            </button>
            <button
              onClick={onConfirmClear}
              style={{
                padding: "3px 8px",
                fontSize: "10px",
                fontFamily: "var(--font-pixel)",
                backgroundColor: "var(--color-coral)",
                color: "#FFFFFF",
                border: "1px solid var(--border)",
                cursor: "pointer"
              }}
            >
              CONFIRM
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
