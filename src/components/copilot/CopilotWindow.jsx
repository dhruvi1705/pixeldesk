import React, { useRef, useEffect } from "react";
import { useCopilot } from "../../hooks/useCopilot";
import { CopilotHeader } from "./CopilotHeader";
import { WorkspaceContextPanel } from "./WorkspaceContextPanel";
import { ChatMessage } from "./ChatMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ChatInput } from "./ChatInput";

export function CopilotWindow({ onClose: _onClose }) {
  const {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
    showClearConfirm,
    setShowClearConfirm,
    isContextPanelOpen,
    toggleContextPanel,
    suggestedPrompts,
    workspaceContext
  } = useCopilot();

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div
      className="copilot-window-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "calc(82vh - 70px)",
        minHeight: "340px",
        gap: "8px",
        fontFamily: "var(--font-body)"
      }}
    >
      {/* 1. Header with Title, Mode Badges, Context Toggle & Clear Action */}
      <CopilotHeader
        isContextPanelOpen={isContextPanelOpen}
        onToggleContextPanel={toggleContextPanel}
        showClearConfirm={showClearConfirm}
        onOpenClearConfirm={() => setShowClearConfirm(true)}
        onCancelClearConfirm={() => setShowClearConfirm(false)}
        onConfirmClear={clearConversation}
      />

      {/* 2. Live Workspace Context Panel Drawer */}
      {isContextPanelOpen && (
        <WorkspaceContextPanel
          context={workspaceContext}
          onClose={toggleContextPanel}
        />
      )}

      {/* 3. Scrollable Conversation Thread */}
      <div
        className="copilot-messages-scroll-area"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "8px 6px",
          backgroundColor: "var(--surface-dark)",
          border: "2px solid var(--border)",
          boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.08)",
          minHeight: "220px"
        }}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Loading / Typing Indicator */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              backgroundColor: "var(--surface)",
              border: "2px solid var(--border)",
              boxShadow: "var(--pixel-shadow-sm)",
              width: "fit-content",
              marginBottom: "8px"
            }}
          >
            <span style={{ fontSize: "14px" }}>🤖</span>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "9px",
                color: "var(--color-teal-hover)"
              }}
            >
              QUERYING WORKSPACE DATA...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Suggested Prompts Pill Bar */}
      <SuggestedPrompts
        prompts={suggestedPrompts}
        onSelectPrompt={sendMessage}
        disabled={isLoading}
      />

      {/* 5. Chat Input Field */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
