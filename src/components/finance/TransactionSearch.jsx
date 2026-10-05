import React from "react";

export function TransactionSearch({
  searchQuery,
  onSearchChange
}) {
  return (
    <div
      className="pixel-input-wrapper"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%"
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "8px",
          fontSize: "13px",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.7
        }}
      >
        🔍
      </span>

      <input
        type="text"
        className="pixel-input"
        style={{
          paddingLeft: "28px",
          paddingRight: searchQuery ? "28px" : "10px",
          fontSize: "12.5px"
        }}
        placeholder="Search transactions..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search transactions"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          style={{
            position: "absolute",
            right: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-secondary)",
            padding: "2px"
          }}
          aria-label="Clear search query"
        >
          ✕
        </button>
      )}
    </div>
  );
}
