import React from "react";

export function TaskSearch({ searchQuery, onSearchChange, onClear }) {
  return (
    <div
      className="task-search-wrapper"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        flex: 1,
        minWidth: "160px"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "8px",
          fontSize: "12px",
          color: "var(--text-muted)",
          pointerEvents: "none"
        }}
      >
        🔍
      </span>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks by title, description, or category"
        className="pixel-input"
        style={{
          paddingLeft: "26px",
          paddingRight: searchQuery ? "28px" : "10px",
          paddingTop: "5px",
          paddingBottom: "5px",
          fontSize: "13px",
          height: "32px",
          borderRadius: "0px"
        }}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          style={{
            position: "absolute",
            right: "4px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "2px 6px",
            fontFamily: "var(--font-pixel)",
            fontSize: "9px"
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
