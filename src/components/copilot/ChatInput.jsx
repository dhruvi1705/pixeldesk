import React, { useState, useRef, useEffect } from "react";

export function ChatInput({ onSend, isLoading = false }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-expand up to max height
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="copilot-chat-input-form"
      style={{
        display: "flex",
        gap: "6px",
        alignItems: "flex-end",
        backgroundColor: "var(--surface-dark)",
        border: "2px solid var(--border)",
        boxShadow: "var(--pixel-shadow-sm)",
        padding: "6px"
      }}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? "Analyzing workspace data..." : "Ask a question about tasks, calendar, focus, or finance..."}
        disabled={isLoading}
        aria-label="Chat with AI Copilot"
        style={{
          flex: 1,
          resize: "none",
          padding: "6px 8px",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--text-primary)",
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.1)",
          outline: "none",
          minHeight: "34px",
          maxHeight: "100px",
          lineHeight: 1.3
        }}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        aria-label="Send message"
        style={{
          padding: "8px 14px",
          height: "34px",
          backgroundColor: input.trim() && !isLoading ? "var(--color-coral)" : "var(--surface)",
          color: input.trim() && !isLoading ? "#FFFFFF" : "var(--text-muted)",
          border: "2px solid var(--border)",
          fontFamily: "var(--font-pixel)",
          fontSize: "10px",
          cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
          boxShadow: input.trim() && !isLoading ? "2px 2px 0 var(--shadow)" : "none",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          transition: "all 0.1s ease"
        }}
      >
        <span>SEND</span>
        <span style={{ fontSize: "11px" }}>↵</span>
      </button>
    </form>
  );
}
