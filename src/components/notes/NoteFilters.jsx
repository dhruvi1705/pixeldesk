import React from "react";
import { NOTE_FILTERS } from "../../data/noteCategories";

export function NoteFilters({
  activeFilter,
  onSelectFilter,
  counts = {},
  selectedTag,
  onClearTag
}) {
  return (
    <nav
      aria-label="Note Filters"
      style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        alignItems: "center"
      }}
    >
      {NOTE_FILTERS.map((f) => {
        const isSelected = activeFilter === f.id;
        const count = counts[f.id] ?? 0;

        return (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectFilter(f.id)}
            className={`pixel-button pixel-button-sm ${isSelected ? "active" : ""}`}
            style={{
              backgroundColor: isSelected ? "var(--color-lavender-light)" : "var(--surface)",
              borderColor: isSelected ? "var(--color-lavender)" : "var(--border)",
              boxShadow: isSelected
                ? "inset 1px 1px 0 rgba(0,0,0,0.15), 1px 1px 0 var(--shadow)"
                : "1px 1px 0 var(--shadow)",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 8px",
              fontSize: "8px",
              color: isSelected ? "var(--color-navy)" : "var(--text-primary)"
            }}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
            {count !== undefined && (
              <span
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "13px",
                  padding: "0 4px",
                  backgroundColor: isSelected ? "var(--color-lavender)" : "var(--surface-dark)",
                  color: isSelected ? "#ffffff" : "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)",
                  lineHeight: 1
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}

      {selectedTag && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "var(--color-teal-light)",
            border: "1.5px solid var(--color-teal)",
            padding: "2px 6px",
            fontSize: "12px",
            fontFamily: "var(--font-retro)"
          }}
        >
          <span>Tag: #{selectedTag}</span>
          <button
            type="button"
            onClick={onClearTag}
            title="Clear tag filter"
            aria-label={`Clear filter for tag ${selectedTag}`}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-coral)",
              cursor: "pointer",
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              padding: "0 2px"
            }}
          >
            ✕
          </button>
        </div>
      )}
    </nav>
  );
}
