import React from "react";
import { ALL_CATEGORIES } from "../../data/financeCategories";

export function TransactionFilters({
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange
}) {
  const types = [
    { id: "ALL", label: "ALL" },
    { id: "INCOME", label: "INCOME" },
    { id: "EXPENSES", label: "EXPENSES" }
  ];

  // Unique categories for the dropdown
  const uniqueCategoryNames = Array.from(new Set(ALL_CATEGORIES.map((c) => c.label)));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "6px",
        flexWrap: "wrap",
        width: "100%"
      }}
    >
      {/* Type Filter Buttons */}
      <div style={{ display: "flex", gap: "4px" }}>
        {types.map((t) => {
          const isActive = typeFilter === t.id;
          let activeBg = "var(--color-navy)";
          if (t.id === "INCOME") activeBg = "var(--color-teal)";
          if (t.id === "EXPENSES") activeBg = "var(--color-coral)";

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTypeFilterChange(t.id)}
              className={`pixel-button pixel-button-sm ${isActive ? "active" : ""}`}
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7.5px",
                padding: "3px 7px",
                backgroundColor: isActive ? activeBg : "var(--surface-dark)",
                color: isActive ? "#ffffff" : "var(--text-primary)",
                borderColor: isActive ? "var(--border)" : "var(--border-subtle)"
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Category Dropdown */}
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value)}
        className="pixel-input"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          padding: "3px 6px",
          width: "auto",
          maxWidth: "130px",
          height: "26px"
        }}
        aria-label="Filter by category"
      >
        <option value="ALL">All Categories</option>
        {uniqueCategoryNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
