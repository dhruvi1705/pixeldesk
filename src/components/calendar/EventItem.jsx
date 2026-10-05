import React, { useState } from "react";
import { CALENDAR_CATEGORIES, formatEventTime } from "../../data/calendarCategories";

export function EventItem({
  event,
  onEdit,
  onDelete
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const categoryObj = CALENDAR_CATEGORIES.find((c) => c.id === event.category) || {
    label: event.category || "Other",
    icon: "📌",
    color: "var(--color-yellow-dark)",
    bgLight: "var(--color-yellow-light)"
  };

  const timeDisplay = formatEventTime(event);

  return (
    <article
      className="calendar-event-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "8px 10px",
        backgroundColor: "#ffffff",
        border: "2px solid var(--border)",
        boxShadow: "2px 2px 0 var(--shadow)",
        position: "relative",
        transition: "transform 0.1s ease, border-color 0.1s ease"
      }}
    >
      {/* Top Row: Time display & Category Tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "15px",
            color: event.allDay ? "var(--color-teal)" : "var(--color-navy)",
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}
        >
          {timeDisplay}
        </span>

        {/* Category Badge */}
        <span
          className="pixel-tag"
          style={{
            borderColor: categoryObj.color,
            backgroundColor: categoryObj.bgLight,
            color: "var(--color-navy-dark)"
          }}
        >
          <span>{categoryObj.icon}</span>
          <span>{categoryObj.label}</span>
        </span>
      </div>

      {/* Title */}
      <h4
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--text-primary)",
          margin: 0,
          lineHeight: 1.3
        }}
      >
        {event.title}
      </h4>

      {/* Description if available */}
      {event.description && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-secondary)",
            margin: 0,
            lineHeight: 1.4,
            whiteSpace: "pre-line"
          }}
        >
          {event.description}
        </p>
      )}

      {/* Action Controls & Inline Delete Confirmation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "6px",
          marginTop: "4px",
          paddingTop: "6px",
          borderTop: "1px dashed var(--border-subtle)"
        }}
      >
        {isConfirmingDelete ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "var(--color-coral-light)",
              padding: "2px 6px",
              border: "1px solid var(--color-coral)"
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7.5px",
                color: "var(--color-coral)",
                fontWeight: 700
              }}
            >
              DELETE?
            </span>
            <button
              type="button"
              onClick={() => onDelete(event.id)}
              className="pixel-button pixel-button-sm pixel-button-primary"
              style={{ padding: "2px 6px", fontSize: "7.5px" }}
            >
              YES
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="pixel-button pixel-button-sm"
              style={{ padding: "2px 6px", fontSize: "7.5px" }}
            >
              NO
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="pixel-button pixel-button-sm"
              style={{
                padding: "2px 6px",
                fontSize: "7.5px",
                gap: "3px"
              }}
              aria-label={`Edit event ${event.title}`}
            >
              ✏️ EDIT
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="pixel-button pixel-button-sm"
              style={{
                padding: "2px 6px",
                fontSize: "7.5px",
                color: "var(--color-coral)"
              }}
              aria-label={`Delete event ${event.title}`}
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </article>
  );
}
