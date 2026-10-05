import React from "react";
import { CALENDAR_CATEGORIES } from "../../data/calendarCategories";

export function CalendarDay({
  cell,
  events = [],
  onSelect
}) {
  const { dateStr, dayNumber, isCurrentMonth, isToday, isSelected } = cell;

  const eventCount = events.length;
  const ariaLabel = `${dateStr}, ${eventCount} ${eventCount === 1 ? "event" : "events"}${isToday ? ", today" : ""}${isSelected ? ", selected" : ""}`;

  // Get category colors for up to 3 dot indicators
  const displayedDots = events.slice(0, 3).map((evt) => {
    const cat = CALENDAR_CATEGORIES.find((c) => c.id === evt.category);
    return {
      id: evt.id,
      color: cat ? cat.color : "var(--color-yellow-dark)"
    };
  });

  return (
    <button
      type="button"
      onClick={() => onSelect(dateStr)}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={`calendar-day-cell ${isCurrentMonth ? "in-month" : "out-of-month"} ${
        isToday ? "is-today" : ""
      } ${isSelected ? "is-selected" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "44px",
        padding: "4px 2px",
        background: isSelected
          ? "var(--color-teal-light)"
          : isToday
          ? "var(--color-yellow-light)"
          : isCurrentMonth
          ? "#ffffff"
          : "rgba(237, 229, 211, 0.4)",
        border: isSelected
          ? "2px solid var(--color-teal)"
          : isToday
          ? "2px solid var(--color-yellow-dark)"
          : "1px solid var(--border-subtle)",
        boxShadow: isSelected
          ? "inset 1px 1px 0 rgba(78, 159, 154, 0.3), 1px 1px 0 var(--shadow)"
          : "1px 1px 0 rgba(0, 0, 0, 0.04)",
        cursor: "pointer",
        position: "relative",
        userSelect: "none",
        borderRadius: "0px",
        transition: "all 0.1s ease",
        color: isCurrentMonth ? "var(--text-primary)" : "var(--text-muted)",
        opacity: isCurrentMonth ? 1 : 0.45
      }}
    >
      {/* Today Pill indicator (corner badge if today) */}
      {isToday && (
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            width: "5px",
            height: "5px",
            backgroundColor: "var(--color-yellow-dark)",
            borderRadius: "0px"
          }}
          title="Today"
          aria-hidden="true"
        />
      )}

      {/* Day Number */}
      <span
        style={{
          fontFamily: isSelected || isToday ? "var(--font-pixel)" : "var(--font-retro)",
          fontSize: isSelected || isToday ? "10px" : "15px",
          fontWeight: isSelected || isToday ? 700 : 500,
          color: isSelected
            ? "var(--color-navy)"
            : isToday
            ? "var(--color-navy-dark)"
            : isCurrentMonth
            ? "var(--text-primary)"
            : "var(--text-muted)",
          lineHeight: 1.1
        }}
      >
        {dayNumber}
      </span>

      {/* Compact Event Dots Indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2.5px",
          height: "6px",
          minHeight: "6px",
          marginTop: "2px"
        }}
        aria-hidden="true"
      >
        {displayedDots.map((dot) => (
          <span
            key={dot.id}
            style={{
              width: "4px",
              height: "4px",
              backgroundColor: dot.color,
              border: "0.5px solid rgba(0,0,0,0.3)",
              borderRadius: "0px",
              display: "inline-block"
            }}
          />
        ))}
        {eventCount > 3 && (
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "6px",
              lineHeight: 1,
              color: "var(--text-muted)"
            }}
          >
            +
          </span>
        )}
      </div>
    </button>
  );
}
