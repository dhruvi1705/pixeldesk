import React from "react";

export function NoteSearch({ searchQuery, onSearchChange, onClear }) {
  return (
    <div
      className="note-search-wrapper"
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
        placeholder="Search notes..."
        aria-label="Search notes by title, content, or tags"
        className="pixel-input"
        style={{
          paddingLeft: "26px",
          paddingRight: searchQuery ? "28px" : "10px",
          paddingTop: "5px",
          paddingBottom: "5px",
          fontSize: "13px",
          height: "32px",
          borderRadius: "0px",
          width: "100%"
        }}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear note search"
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
