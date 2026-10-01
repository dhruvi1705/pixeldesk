import React from "react";

export function AvatarOption({
  option,
  isSelected,
  onSelect,
  category
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`${category}: ${option.label}`}
      onClick={() => onSelect(option.id)}
      className={`avatar-option-btn ${isSelected ? "selected" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px",
        minHeight: "32px",
        backgroundColor: isSelected ? "var(--color-teal-light)" : "var(--surface)",
        color: "var(--text-primary)",
        border: isSelected ? "2px solid var(--color-teal)" : "1.5px solid var(--border)",
        boxShadow: isSelected
          ? "inset 1px 1px 0 rgba(0,0,0,0.15), 1px 1px 0 var(--shadow)"
          : "1px 1px 0 var(--shadow)",
        cursor: "pointer",
        position: "relative",
        borderRadius: "0px",
        userSelect: "none",
        fontFamily: "var(--font-retro)",
        fontSize: "15px",
        lineHeight: 1,
        transition: "background-color 0.12s ease, border-color 0.12s ease, transform 0.1s ease"
      }}
    >
      {/* Active Teal Pip Indicator */}
      {isSelected && (
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            width: "4px",
            height: "4px",
            backgroundColor: "var(--color-teal)",
            border: "0.5px solid var(--border)",
            display: "inline-block"
          }}
          aria-hidden="true"
        />
      )}

      {/* Mini Preview: Color chip or mini asset icon */}
      {option.colorChip ? (
        <span
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: option.colorChip,
            border: "1px solid var(--border)",
            display: "inline-block",
            flexShrink: 0
          }}
          aria-hidden="true"
        />
      ) : option.asset ? (
        <span
          style={{
            width: "18px",
            height: "18px",
            backgroundColor: "var(--surface-dark)",
            border: "1px solid var(--border-subtle)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0
          }}
          aria-hidden="true"
        >
          <img
            src={option.asset}
            alt=""
            style={{
              width: "28px",
              height: "28px",
              objectFit: "contain",
              imageRendering: "pixelated"
            }}
          />
        </span>
      ) : null}

      {/* Option Label */}
      <span
        style={{
          fontFamily: "var(--font-retro)",
          fontSize: "16px",
          letterSpacing: "0.3px",
          fontWeight: isSelected ? 700 : 400
        }}
      >
        {option.label}
      </span>
    </button>
  );
}
