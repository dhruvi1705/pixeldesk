import React from "react";
import { formatSelectedDateTitle } from "../../data/calendarCategories";
import { EventItem } from "./EventItem";

export function EventList({
  selectedDate,
  events = [],
  onNewEvent,
  onEditEvent,
  onDeleteEvent
}) {
  const headingText = formatSelectedDateTitle(selectedDate);
  const count = events.length;

  return (
    <div
      className="calendar-event-list-section"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        height: "100%",
        minWidth: "220px"
      }}
    >
      {/* Header with Selected Date & New Event Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "6px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9.5px",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.2
            }}
          >
            {headingText}
          </h3>
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "14px",
              color: "var(--text-secondary)"
            }}
          >
            {count} {count === 1 ? "Event" : "Events"} Scheduled
          </span>
        </div>

        <button
          type="button"
          onClick={onNewEvent}
          className="pixel-button pixel-button-sm pixel-button-teal"
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            padding: "4px 8px"
          }}
        >
          + NEW EVENT
        </button>
      </div>

      {/* Events Container */}
      <div
        className="calendar-events-scroll"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxHeight: "360px",
          overflowY: "auto",
          paddingRight: "4px"
        }}
      >
        {events.length === 0 ? (
          /* Empty State per spec */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 12px",
              backgroundColor: "var(--surface-dark)",
              border: "1.5px dashed var(--border-subtle)",
              textAlign: "center",
              gap: "6px"
            }}
          >
            <span style={{ fontSize: "28px" }} role="img" aria-label="Calendar">
              📅
            </span>
            <p
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "9px",
                color: "var(--text-primary)",
                margin: "4px 0 0 0"
              }}
            >
              No events for this day.
            </p>
            <p
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "15px",
                color: "var(--text-secondary)",
                margin: 0
              }}
            >
              Your schedule is clear.
            </p>
            <button
              type="button"
              onClick={onNewEvent}
              className="pixel-button pixel-button-sm pixel-button-teal"
              style={{
                marginTop: "6px",
                fontSize: "8px",
                padding: "4px 8px"
              }}
            >
              + NEW EVENT
            </button>
          </div>
        ) : (
          events.map((evt) => (
            <EventItem
              key={evt.id}
              event={evt}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
            />
          ))
        )}
      </div>
    </div>
  );
}
