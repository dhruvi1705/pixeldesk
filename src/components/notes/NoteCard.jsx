import React, { useState } from "react";
import { formatRelativeTime, NOTE_ACCENTS } from "../../data/noteCategories";
import { NoteTags } from "./NoteTags";

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Find accent info or fallback to lavender
  const accent = NOTE_ACCENTS.find((a) => a.id === note.accent) || NOTE_ACCENTS[0];
  const relativeTime = formatRelativeTime(note.updatedAt || note.createdAt);

  // Content preview: first 120 chars, collapse multi-line to readable snippet
  const contentPreview = (note.content || "")
    .replace(/\s+/g, " ")
    .trim();
  const truncatedPreview =
    contentPreview.length > 130 ? `${contentPreview.slice(0, 130)}...` : contentPreview;

  const handleCardClick = (e) => {
    // If click is on an interactive element (button, pin, delete prompt), don't trigger edit
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input")) {
      return;
    }
    onEdit(note);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (!confirmDelete) {
        e.preventDefault();
        onEdit(note);
      }
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`Note: ${note.title}. ${note.pinned ? "Pinned." : ""} Click to open editor.`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={`note-card ${note.pinned ? "note-card-pinned" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        border: "2px solid var(--border)",
        borderTop: `4px solid ${accent.color}`,
        boxShadow: "2px 2px 0 var(--shadow)",
        borderRadius: "0px",
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease",
        textAlign: "left"
      }}
    >
      {/* Card Header: Pin + Title + Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "8px",
          padding: "8px 10px 4px 10px",
          borderBottom: "1px dashed var(--border-subtle)"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", flex: 1, minWidth: 0 }}>
          {/* Clickable Pin indicator */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            title={note.pinned ? "Unpin note" : "Pin note to top"}
            aria-label={note.pinned ? `Unpin note "${note.title}"` : `Pin note "${note.title}"`}
            className="pixel-button pixel-button-sm"
            style={{
              padding: "1px 4px",
              fontSize: "11px",
              lineHeight: 1,
              backgroundColor: note.pinned ? "var(--color-yellow-light)" : "transparent",
              borderColor: note.pinned ? "var(--color-yellow-dark)" : "var(--border-subtle)",
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            {note.pinned ? "📌" : "📍"}
          </button>

          {/* Title */}
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
              wordBreak: "break-word",
              lineHeight: 1.3
            }}
          >
            {note.title}
          </h4>
        </div>

        {/* Accent Color Pip indicator */}
        <span
          title={`Accent: ${accent.name}`}
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: accent.color,
            border: "1px solid var(--border)",
            display: "inline-block",
            flexShrink: 0,
            marginTop: "3px"
          }}
          aria-hidden="true"
        />
      </div>

      {/* Card Body: Content Preview */}
      <div style={{ padding: "8px 10px", flex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12.5px",
            lineHeight: 1.4,
            color: "var(--text-secondary)",
            margin: 0,
            wordBreak: "break-word",
            whiteSpace: "pre-line"
          }}
        >
          {truncatedPreview || <span style={{ fontStyle: "italic", color: "var(--text-muted)" }}>Empty note</span>}
        </p>
      </div>

      {/* Card Footer: Tags + Updated Time + Inline Delete/Edit */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          padding: "6px 10px 8px 10px",
          backgroundColor: "var(--surface-dark)",
          borderTop: "1px solid var(--border-subtle)"
        }}
      >
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <NoteTags tags={note.tags} isEditable={false} />
        )}

        {/* Timestamp & Actions Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "6px"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "13px",
              color: "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>🕒</span>
            <span>Updated {relativeTime}</span>
          </span>

          {/* Quick Actions (Inline Confirm Delete & Edit) */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {confirmDelete ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  backgroundColor: "var(--color-coral-light)",
                  border: "1px solid var(--color-coral)",
                  padding: "1px 4px"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7px",
                    color: "var(--color-coral)",
                    lineHeight: 1
                  }}
                >
                  DELETE?
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                  }}
                  aria-label={`Confirm delete note "${note.title}"`}
                  className="pixel-button pixel-button-sm pixel-button-primary"
                  style={{ fontSize: "7px", padding: "1px 4px" }}
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(false);
                  }}
                  className="pixel-button pixel-button-sm"
                  style={{ fontSize: "7px", padding: "1px 4px" }}
                >
                  NO
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(note);
                  }}
                  aria-label={`Edit note "${note.title}"`}
                  className="pixel-button pixel-button-sm"
                  style={{ fontSize: "7px", padding: "2px 5px" }}
                >
                  EDIT
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(true);
                  }}
                  aria-label={`Delete note "${note.title}"`}
                  className="pixel-button pixel-button-sm"
                  style={{
                    fontSize: "7px",
                    padding: "2px 5px",
                    color: "var(--color-coral)",
                    borderColor: "var(--color-coral)"
                  }}
                >
                  DEL
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
