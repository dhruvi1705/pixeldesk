import React from "react";

const PROMPT_ICONS = {
  "What tasks are due today?": "📋",
  "Summarize my upcoming calendar.": "📅",
  "How much focus time did I complete this week?": "⏱️",
  "Summarize my spending this month.": "💰",
  "Give me an overview of my productivity.": "📊"
};

export function SuggestedPrompts({ prompts = [], onSelectPrompt, disabled = false }) {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div
      className="copilot-suggested-prompts"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "4px 0"
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "9px",
          color: "var(--text-secondary)",
          letterSpacing: "0.5px",
          marginBottom: "2px"
        }}
      >
        SUGGESTED WORKSPACE QUERIES:
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px"
        }}
      >
        {prompts.map((prompt, idx) => {
          const icon = PROMPT_ICONS[prompt] || "✨";
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(prompt)}
              disabled={disabled}
              className="copilot-prompt-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 8px",
                backgroundColor: "var(--surface)",
                border: "2px solid var(--border)",
                color: "var(--text-primary)",
                fontSize: "12px",
                cursor: disabled ? "not-allowed" : "pointer",
                boxShadow: "1px 1px 0 var(--shadow)",
                opacity: disabled ? 0.6 : 1,
                transition: "all 0.1s ease",
                textAlign: "left"
              }}
              title={`Ask: "${prompt}"`}
            >
              <span>{icon}</span>
              <span>{prompt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
