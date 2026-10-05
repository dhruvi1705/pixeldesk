import React, { useState } from "react";
import { PRESET_TAGS } from "../../data/noteCategories";

/**
 * NoteTags:
 * - Read-only mode: Displays note tags with crisp retro pixel badge styling.
 * - Interactive mode (isEditable = true): Allows picking preset tags or typing custom tags.
 * - Filter mode (isFilter = true): Displays tag chips for fast filtering by tag.
 */
export function NoteTags({
  tags = [],
  isEditable = false,
  isFilter = false,
  selectedTag = null,
  onSelectTag,
  onAddTag,
  onRemoveTag
}) {
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleAddCustom = (e) => {
    e?.preventDefault();
    const clean = customTagInput.trim().replace(/^#+/, "");
    if (clean && !tags.includes(clean)) {
      onAddTag(clean);
      setCustomTagInput("");
      setShowCustomInput(false);
    }
  };

  // 1. Filter bar mode (clickable tags to filter list)
  if (isFilter) {
    if (!tags || tags.length === 0) return null;

    return (
      <div
        className="note-tags-filter-bar"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          overflowX: "auto",
          paddingBottom: "2px",
          maxWidth: "100%"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            color: "var(--text-secondary)",
            flexShrink: 0
          }}
        >
          TAGS:
        </span>
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(isSelected ? null : tag)}
              className="pixel-button pixel-button-sm"
              style={{
                fontSize: "7.5px",
                padding: "2px 6px",
                backgroundColor: isSelected ? "var(--color-teal)" : "var(--surface-dark)",
                color: isSelected ? "#ffffff" : "var(--text-primary)",
                borderColor: isSelected ? "var(--color-navy)" : "var(--border-subtle)",
                boxShadow: isSelected ? "none" : "1px 1px 0 var(--shadow)",
                flexShrink: 0
              }}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Editable mode inside Note Editor
  if (isEditable) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {/* Current Active Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "14px",
                lineHeight: 1,
                backgroundColor: "var(--surface-dark)",
                border: "1px solid var(--border)",
                padding: "3px 6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--text-primary)",
                boxShadow: "1px 1px 0 var(--shadow)"
              }}
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                aria-label={`Remove tag ${tag}`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-coral)",
                  fontFamily: "var(--font-pixel)",
                  fontSize: "8px",
                  padding: "0 2px"
                }}
              >
                ✕
              </button>
            </span>
          ))}

          {tags.length === 0 && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "var(--text-muted)",
                fontStyle: "italic"
              }}
            >
              No tags added yet. Choose from presets or type your own below.
            </span>
          )}
        </div>

        {/* Preset quick-add tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--text-secondary)",
              marginRight: "4px"
            }}
          >
            QUICK ADD:
          </span>
          {PRESET_TAGS.map((preset) => {
            const hasTag = tags.includes(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => (hasTag ? onRemoveTag(preset) : onAddTag(preset))}
                className="pixel-button pixel-button-sm"
                style={{
                  fontSize: "7.5px",
                  padding: "2px 5px",
                  backgroundColor: hasTag ? "var(--color-teal-light)" : "var(--surface)",
                  borderColor: hasTag ? "var(--color-teal)" : "var(--border-subtle)",
                  color: hasTag ? "var(--color-navy)" : "var(--text-secondary)",
                  opacity: hasTag ? 1 : 0.85
                }}
              >
                {hasTag ? "✓" : "+"} {preset}
              </button>
            );
          })}

          {/* Custom Tag Input Toggle */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="pixel-button pixel-button-sm"
              style={{
                fontSize: "7.5px",
                padding: "2px 6px",
                backgroundColor: "var(--surface)",
                borderColor: "var(--border-subtle)",
                color: "var(--color-navy)"
              }}
            >
              + Custom Tag
            </button>
          ) : (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom();
                  } else if (e.key === "Escape") {
                    setShowCustomInput(false);
                  }
                }}
                placeholder="tag name..."
                maxLength={20}
                className="pixel-input"
                style={{
                  fontSize: "12px",
                  padding: "2px 6px",
                  height: "24px",
                  width: "95px"
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddCustom}
                className="pixel-button pixel-button-sm pixel-button-primary"
                style={{ fontSize: "7px", padding: "2px 5px", height: "24px" }}
              >
                ADD
              </button>
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="pixel-button pixel-button-sm"
                style={{ fontSize: "7px", padding: "2px 5px", height: "24px" }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Read-only tags list (e.g. inside NoteCard)
  if (!tags || tags.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        alignItems: "center"
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "13px",
            lineHeight: 1,
            backgroundColor: "var(--surface-dark)",
            border: "1px solid var(--border-subtle)",
            padding: "1px 5px",
            color: "var(--text-secondary)",
            borderRadius: "0px"
          }}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
