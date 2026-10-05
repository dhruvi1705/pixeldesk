import React from "react";
import { WEEKDAYS, generateMonthGrid } from "../../data/calendarCategories";
import { CalendarDay } from "./CalendarDay";

export function CalendarGrid({
  viewYear,
  viewMonth,
  selectedDate,
  onSelectDate,
  getEventsForDate
}) {
  const cells = generateMonthGrid(viewYear, viewMonth, selectedDate);

  return (
    <div
      className="calendar-grid-container"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        border: "var(--pixel-border)",
        boxShadow: "var(--pixel-shadow-sm)",
        backgroundColor: "var(--surface)",
        padding: "6px"
      }}
    >
      {/* Weekday Header Row: MON - SUN */}
      <div
        className="calendar-weekday-row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginBottom: "4px",
          textAlign: "center"
        }}
        aria-hidden="true"
      >
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              padding: "4px 2px",
              color: day === "SAT" || day === "SUN" ? "var(--color-coral)" : "var(--text-secondary)",
              backgroundColor: "var(--surface-dark)",
              border: "1px solid var(--border-subtle)"
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div
        className="calendar-days-grid"
        role="grid"
        aria-label="Calendar Days"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px"
        }}
      >
        {cells.map((cell) => {
          const events = getEventsForDate(cell.dateStr);
          return (
            <CalendarDay
              key={cell.dateStr}
              cell={cell}
              events={events}
              onSelect={onSelectDate}
            />
          );
        })}
      </div>
    </div>
  );
}
