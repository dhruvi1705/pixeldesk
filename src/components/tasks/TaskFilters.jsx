import React from "react";
import { TASK_FILTERS } from "../../data/taskCategories";

export function TaskFilters({ activeFilter, onSelectFilter, counts = {} }) {
  return (
    <nav
      aria-label="Task Filters"
      style={{
        display: "flex",
        gap: "4px",
        flexWrap: "wrap",
        alignItems: "center"
      }}
    >
      {TASK_FILTERS.map((f) => {
        const isSelected = activeFilter === f.id;
        const count = counts[f.id];

        return (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectFilter(f.id)}
            className={`pixel-button pixel-button-sm ${isSelected ? "active" : ""}`}
            style={{
              backgroundColor: isSelected ? "var(--color-teal-light)" : "var(--surface)",
              borderColor: isSelected ? "var(--color-teal)" : "var(--border)",
              boxShadow: isSelected
                ? "inset 1px 1px 0 rgba(0,0,0,0.15), 1px 1px 0 var(--shadow)"
                : "1px 1px 0 var(--shadow)",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 8px",
              fontSize: "8px"
            }}
          >
            <span>{f.label}</span>
            {count !== undefined && (
              <span
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "13px",
                  padding: "0 4px",
                  backgroundColor: isSelected ? "var(--color-teal)" : "var(--surface-dark)",
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
    </nav>
  );
}
