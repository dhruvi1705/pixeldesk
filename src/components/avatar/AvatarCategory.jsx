import React from "react";
import { AvatarOption } from "./AvatarOption";

export function AvatarCategory({
  category,
  currentValue,
  onSelect
}) {
  const selectedOption = category.options.find((o) => o.id === currentValue);

  return (
    <div
      className="avatar-category-section"
      style={{
        border: "1.5px solid var(--border)",
        backgroundColor: "var(--surface-dark)",
        padding: "8px 10px",
        boxShadow: "1px 1px 0 var(--shadow)",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}
    >
      {/* Category Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px", lineHeight: 1 }}>{category.icon}</span>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              color: "var(--text-primary)"
            }}
          >
            {category.label}
          </span>
        </div>

        {/* Current Active Selection Tag */}
        {selectedOption && (
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "14px",
              backgroundColor: "var(--color-lavender-light)",
              border: "1px solid var(--color-lavender)",
              color: "var(--color-navy)",
              padding: "0 6px"
            }}
          >
            {selectedOption.label}
          </span>
        )}
      </div>

      {/* Options List */}
      <div
        role="radiogroup"
        aria-label={category.label}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px"
        }}
      >
        {category.options.map((option) => (
          <AvatarOption
            key={option.id}
            option={option}
            category={category.label}
            isSelected={currentValue === option.id}
            onSelect={(id) => onSelect(category.id, id)}
          />
        ))}
      </div>
    </div>
  );
}
