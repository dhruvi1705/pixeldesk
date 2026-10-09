import React from "react";

// Simple markdown-to-formatted-elements parser for Copilot responses
function formatMessageContent(content = "") {
  const lines = content.split("\n");

  return lines.map((line, idx) => {
    // Empty line
    if (!line.trim()) {
      return <div key={idx} style={{ height: "6px" }} />;
    }

    // Bullet point line
    if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      const cleanLine = line.replace(/^[•\-*]\s+/, "");
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "6px",
            margin: "2px 0 2px 8px"
          }}
        >
          <span style={{ color: "var(--color-teal)", fontWeight: "bold" }}>▸</span>
          <span>{renderInlineStyles(cleanLine)}</span>
        </div>
      );
    }

    // Numbered or sub-list line
    if (/^\d+\.\s+/.test(line)) {
      return (
        <div key={idx} style={{ margin: "3px 0 1px 4px", fontWeight: 500 }}>
          {renderInlineStyles(line)}
        </div>
      );
    }

    // Sub-item tree line (e.g. "   └ ...")
    if (line.trim().startsWith("└") || line.trim().startsWith("├")) {
      return (
        <div
          key={idx}
          style={{
            margin: "1px 0 3px 20px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            fontFamily: "monospace"
          }}
        >
          {renderInlineStyles(line.trim())}
        </div>
      );
    }

    // Standard paragraph
    return (
      <div key={idx} style={{ margin: "2px 0" }}>
        {renderInlineStyles(line)}
      </div>
    );
  });
}

// Inline styling for bold **text**, italics *text*, and inline code `code`
function renderInlineStyles(text) {
  // Split on bold, code, and italic markers
  const parts = [];

  // Regex to match **bold** or *italic* or `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} style={{ fontWeight: 600, color: "var(--text-primary)" }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          style={{
            backgroundColor: "var(--surface-dark)",
            padding: "1px 4px",
            border: "1px solid var(--border)",
            fontSize: "11px",
            fontFamily: "monospace"
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Format timestamp into human time (e.g. 10:45 AM)
function formatTime(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function ChatMessage({ message }) {
  const isUser = message.sender === "user";
  const isNotice = message.status === "notice";
  const isError = message.status === "error";

  return (
    <div
      className={`copilot-chat-message ${isUser ? "user-msg" : "assistant-msg"}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        width: "100%",
        marginBottom: "10px"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-start",
          gap: "8px",
          maxWidth: isUser ? "85%" : "95%"
        }}
      >
        {/* Avatar badge */}
        <div
          style={{
            width: "26px",
            height: "26px",
            flexShrink: 0,
            backgroundColor: isUser ? "var(--color-teal)" : "var(--color-lavender-light)",
            border: "2px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isUser ? "13px" : "14px",
            boxShadow: "1px 1px 0 var(--shadow)"
          }}
          aria-hidden="true"
        >
          {isUser ? "👤" : "🤖"}
        </div>

        {/* Message bubble card */}
        <div
          style={{
            backgroundColor: isUser
              ? "var(--color-teal-light)"
              : isNotice
              ? "var(--color-yellow-light)"
              : isError
              ? "var(--color-coral-light)"
              : "var(--surface)",
            border: isNotice
              ? "2px solid var(--color-yellow-dark)"
              : isError
              ? "2px solid var(--color-coral)"
              : "2px solid var(--border)",
            boxShadow: "var(--pixel-shadow-sm)",
            padding: "8px 12px",
            color: "var(--text-primary)",
            fontSize: "13px",
            lineHeight: 1.45,
            wordBreak: "break-word",
            overflowWrap: "anywhere"
          }}
        >
          {/* Assistant tag header */}
          {!isUser && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
                borderBottom: "1px solid rgba(36, 50, 74, 0.1)",
                paddingBottom: "3px"
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "9px",
                  color: isNotice ? "var(--color-yellow-dark)" : "var(--color-teal-hover)",
                  letterSpacing: "0.5px"
                }}
              >
                {isNotice ? "OFFLINE COPILOT" : "WORKSPACE QUERY ENGINE"}
              </span>
              <span
                style={{
                  fontSize: "8px",
                  fontFamily: "monospace",
                  backgroundColor: "rgba(36,50,74,0.08)",
                  padding: "1px 3px"
                }}
              >
                READ-ONLY
              </span>
            </div>
          )}

          {/* Formatted body */}
          <div className="message-text-content">{formatMessageContent(message.text)}</div>

          {/* Timestamp footer */}
          <div
            style={{
              fontSize: "10px",
              color: "var(--text-muted)",
              marginTop: "4px",
              textAlign: isUser ? "right" : "left",
              fontFamily: "monospace"
            }}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}
