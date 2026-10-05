import React, { useState } from "react";
import { NOTE_ACCENTS, formatDateTime } from "../../data/noteCategories";
import { NoteTags } from "./NoteTags";

export function NoteEditor({
  initialNote = null,
  onSave,
  onCancel,
  onDelete
}) {
  const isEditing = Boolean(initialNote && initialNote.id);

  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [tags, setTags] = useState(initialNote?.tags || []);
  const [accent, setAccent] = useState(initialNote?.accent || "lavender");
  const [pinned, setPinned] = useState(initialNote?.pinned || false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle) {
      setErrorMsg("Title is required!");
      return;
    }
    if (!cleanContent) {
      setErrorMsg("Content cannot be empty!");
      return;
    }

    onSave({
      title: cleanTitle,
      content: cleanContent,
      tags,
      accent,
      pinned
    });
  };

  const currentAccent = NOTE_ACCENTS.find((a) => a.id === accent) || NOTE_ACCENTS[0];

  return (
    <form
      onSubmit={handleSubmit}
      className="note-editor-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        backgroundColor: "var(--surface)",
        padding: "12px",
        border: "2px solid var(--border)",
        boxShadow: "2px 2px 0 var(--shadow)",
        borderRadius: "0px",
        borderTop: `4px solid ${currentAccent.color}`
      }}
    >
      {/* Editor Navigation & Title Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "8px",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={onCancel}
            className="pixel-button pixel-button-sm"
            style={{
              padding: "4px 8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "8px"
            }}
          >
            <span>←</span>
            <span>BACK</span>
          </button>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "var(--text-primary)"
            }}
          >
            {isEditing ? "EDIT NOTE" : "NEW NOTE"}
          </span>
        </div>

        {/* Pin to top toggle */}
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontFamily: "var(--font-retro)",
            fontSize: "15px",
            userSelect: "none"
          }}
        >
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            style={{
              accentColor: "var(--color-yellow-dark)",
              cursor: "pointer",
              width: "14px",
              height: "14px"
            }}
          />
          <span>📌 Pin to top</span>
        </label>
      </div>

      {/* Error alert if validation fails */}
      {errorMsg && (
        <div
          role="alert"
          style={{
            backgroundColor: "var(--color-coral-light)",
            border: "1.5px solid var(--color-coral)",
            color: "var(--color-coral)",
            padding: "4px 8px",
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Field: Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <label
            htmlFor="note-title-input"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--text-primary)"
            }}
          >
            TITLE *
          </label>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "12px", color: "var(--text-muted)" }}>
            {title.length}/100
          </span>
        </div>
        <input
          id="note-title-input"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder="e.g. DAA Important Notes..."
          maxLength={100}
          className="pixel-input"
          style={{
            fontSize: "14px",
            padding: "6px 8px",
            borderRadius: "0px",
            width: "100%"
          }}
          autoFocus
        />
      </div>

      {/* Field: Accent Picker */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--text-primary)"
          }}
        >
          ACCENT COLOR
        </span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {NOTE_ACCENTS.map((item) => {
            const isSelected = accent === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAccent(item.id)}
                aria-label={`Select ${item.name} accent`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 8px",
                  backgroundColor: isSelected ? item.bgLight : "var(--surface-dark)",
                  border: isSelected ? `2px solid ${item.color}` : "1.5px solid var(--border-subtle)",
                  boxShadow: isSelected ? "inset 1px 1px 0 rgba(0,0,0,0.1), 1px 1px 0 var(--shadow)" : "1px 1px 0 var(--shadow)",
                  cursor: "pointer",
                  borderRadius: "0px"
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: item.color,
                    border: "1px solid var(--border)",
                    display: "inline-block"
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontFamily: "var(--font-retro)",
                    fontSize: "14px",
                    color: "var(--color-navy)",
                    lineHeight: 1
                  }}
                >
                  {item.name}
                </span>
                {isSelected && <span style={{ fontSize: "10px", color: "var(--color-navy)" }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Field: Tags */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--text-primary)"
          }}
        >
          TAGS
        </span>
        <NoteTags
          tags={tags}
          isEditable={true}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>

      {/* Field: Content Editor */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <label
            htmlFor="note-content-input"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--text-primary)"
            }}
          >
            CONTENT *
          </label>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "12px", color: "var(--text-muted)" }}>
            {content.length}/5000
          </span>
        </div>
        <textarea
          id="note-content-input"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder="Write your note here... (plain text with line breaks)"
          maxLength={5000}
          rows={8}
          className="pixel-input"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            lineHeight: 1.5,
            padding: "8px",
            borderRadius: "0px",
            resize: "vertical",
            minHeight: "150px",
            maxHeight: "360px",
            backgroundColor: "#FFFFFF",
            color: "var(--color-navy)",
            width: "100%"
          }}
        />
      </div>

      {/* Timestamps (for existing notes) */}
      {isEditing && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            padding: "4px 8px",
            backgroundColor: "var(--surface-dark)",
            border: "1px dashed var(--border-subtle)",
            fontFamily: "var(--font-retro)",
            fontSize: "13px",
            color: "var(--text-secondary)"
          }}
        >
          {initialNote.createdAt && (
            <span>Created: {formatDateTime(initialNote.createdAt)}</span>
          )}
          {initialNote.updatedAt && (
            <span>Updated: {formatDateTime(initialNote.updatedAt)}</span>
          )}
        </div>
      )}

      {/* Action Footer: Delete (if editing) & Save / Cancel */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1.5px solid var(--border-subtle)",
          paddingTop: "10px",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        <div>
          {isEditing && onDelete && (
            confirmDelete ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7.5px",
                    color: "var(--color-coral)"
                  }}
                >
                  DELETE THIS NOTE?
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(initialNote.id)}
                  className="pixel-button pixel-button-sm pixel-button-primary"
                  style={{ fontSize: "7.5px", padding: "3px 6px" }}
                >
                  YES, DELETE
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="pixel-button pixel-button-sm"
                  style={{ fontSize: "7.5px", padding: "3px 6px" }}
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="pixel-button pixel-button-sm"
                style={{
                  fontSize: "8px",
                  padding: "4px 8px",
                  color: "var(--color-coral)",
                  borderColor: "var(--color-coral)"
                }}
              >
                DELETE NOTE
              </button>
            )
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={onCancel}
            className="pixel-button"
            style={{ fontSize: "8px", padding: "6px 12px" }}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="pixel-button pixel-button-primary"
            style={{
              fontSize: "8px",
              padding: "6px 14px",
              backgroundColor: "var(--color-lavender)",
              borderColor: "var(--color-navy)",
              color: "#FFFFFF"
            }}
          >
            {isEditing ? "SAVE CHANGES" : "SAVE NOTE"}
          </button>
        </div>
      </div>
    </form>
  );
}
