import React from "react";
import { NoteCard } from "./NoteCard";

export function NotesList({
  notes = [],
  totalNotesCount = 0,
  activeFilter = "ALL",
  searchQuery = "",
  selectedTag = null,
  onEdit,
  onDelete,
  onTogglePin,
  onNewNote,
  onLoadStarterNotes
}) {
  // Empty State 1: No notes at all in the application
  if (totalNotesCount === 0) {
    return (
      <div
        className="notes-empty-state"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 16px",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          border: "2px dashed var(--border-subtle)",
          boxShadow: "2px 2px 0 var(--shadow)",
          gap: "10px"
        }}
      >
        <span style={{ fontSize: "36px", lineHeight: 1 }} role="img" aria-label="Notes notepad">
          📝
        </span>
        <h3
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "24px",
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          No notes yet.
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0,
            maxWidth: "280px"
          }}
        >
          "Capture an idea before it disappears."
        </p>

        <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={onNewNote}
            className="pixel-button pixel-button-primary"
            style={{
              fontSize: "8px",
              padding: "6px 14px",
              backgroundColor: "var(--color-lavender)",
              color: "#FFFFFF"
            }}
          >
            + NEW NOTE
          </button>
          {onLoadStarterNotes && (
            <button
              type="button"
              onClick={onLoadStarterNotes}
              className="pixel-button"
              style={{ fontSize: "8px", padding: "6px 10px" }}
            >
              LOAD EXAMPLES
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty State 2: No search results
  if (searchQuery && notes.length === 0) {
    return (
      <div
        className="notes-empty-state"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          border: "2px dashed var(--border-subtle)",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "30px", lineHeight: 1 }} role="img" aria-label="Search magnifying glass">
          🔍
        </span>
        <h4
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "20px",
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          No matching notes found.
        </h4>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-secondary)",
            margin: 0
          }}
        >
          No notes match "{searchQuery}". Check your spelling or clear search.
        </p>
      </div>
    );
  }

  // Empty State 3: Filtered by Tag but no notes match
  if (selectedTag && notes.length === 0) {
    return (
      <div
        className="notes-empty-state"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          border: "2px dashed var(--border-subtle)",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "28px", lineHeight: 1 }} role="img" aria-label="Tag">
          🏷️
        </span>
        <h4
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "20px",
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          No notes tagged with #{selectedTag}.
        </h4>
      </div>
    );
  }

  // Empty State 4: Filtered by PINNED but no pinned notes
  if (activeFilter === "PINNED" && notes.length === 0) {
    return (
      <div
        className="notes-empty-state"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          border: "2px dashed var(--border-subtle)",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "30px", lineHeight: 1 }} role="img" aria-label="Pin">
          📌
        </span>
        <h4
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "20px",
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          No pinned notes yet.
        </h4>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-secondary)",
            margin: 0
          }}
        >
          Click the 📍 pin icon on any note card to keep it pinned to top.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Notes Collection"
      className="notes-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
        gap: "10px",
        alignItems: "start"
      }}
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
        />
      ))}
    </section>
  );
}
