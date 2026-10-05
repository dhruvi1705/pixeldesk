import React, { useState } from "react";
import { CALENDAR_CATEGORIES } from "../../data/calendarCategories";

export function EventForm({
  initialEvent = null,
  defaultDate = "",
  onSave,
  onCancel
}) {
  const isEditing = !!initialEvent;

  const [title, setTitle] = useState(() => initialEvent?.title || "");
  const [date, setDate] = useState(() => initialEvent?.date || defaultDate || "");
  const [allDay, setAllDay] = useState(() => !!initialEvent?.allDay);
  const [startTime, setStartTime] = useState(() => initialEvent?.startTime || "");
  const [endTime, setEndTime] = useState(() => initialEvent?.endTime || "");
  const [category, setCategory] = useState(() => initialEvent?.category || "Work");
  const [description, setDescription] = useState(() => initialEvent?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Event title is required.");
      return;
    }

    if (trimmedTitle.length > 100) {
      setError("Title cannot exceed 100 characters.");
      return;
    }

    if (!date) {
      setError("Event date is required.");
      return;
    }

    if (!allDay && startTime && endTime && endTime < startTime) {
      setError("End time cannot be earlier than start time.");
      return;
    }

    setError("");
    onSave({
      title: trimmedTitle,
      date,
      allDay,
      startTime: allDay ? "" : startTime,
      endTime: allDay ? "" : endTime,
      category,
      description: description.trim()
    });
  };

  return (
    <div
      role="dialog"
      aria-label={isEditing ? "Edit Event" : "Create New Event"}
      className="calendar-event-form animate-window-pop"
      style={{
        border: "2px solid var(--border)",
        backgroundColor: "var(--surface)",
        boxShadow: "var(--pixel-shadow)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "6px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>{isEditing ? "✏️" : "📅"}</span>
          <h3
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9.5px",
              margin: 0,
              color: "var(--text-primary)"
            }}
          >
            {isEditing ? "EDIT EVENT" : "NEW EVENT"}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close event form"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--text-primary)"
          }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Error notification */}
        {error && (
          <div
            className="pixel-error-message"
            style={{
              backgroundColor: "var(--color-coral-light)",
              padding: "4px 8px",
              border: "1px solid var(--color-coral)"
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Title Input */}
        <div className="pixel-form-group">
          <label htmlFor="calendar-event-title" className="pixel-label">
            <span>TITLE *</span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "12px", color: "var(--text-muted)" }}>
              {title.length}/100
            </span>
          </label>
          <input
            id="calendar-event-title"
            type="text"
            className="pixel-input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Project Meeting, DAA Exam"
            maxLength={100}
            required
            autoFocus
          />
        </div>

        {/* Date & All-Day Toggle Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", alignItems: "flex-end" }}>
          <div className="pixel-form-group">
            <label htmlFor="calendar-event-date" className="pixel-label">
              <span>DATE *</span>
            </label>
            <input
              id="calendar-event-date"
              type="date"
              className="pixel-input"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>

          {/* All-Day Toggle */}
          <button
            type="button"
            onClick={() => setAllDay(!allDay)}
            className={`pixel-toggle-btn ${allDay ? "active" : ""}`}
            style={{
              height: "36px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "8.5px"
            }}
          >
            <span>{allDay ? "✓" : "○"}</span>
            <span>ALL DAY</span>
          </button>
        </div>

        {/* Time Inputs (visible if not all-day) */}
        {!allDay && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div className="pixel-form-group">
              <label htmlFor="calendar-start-time" className="pixel-label">
                <span>START TIME</span>
              </label>
              <input
                id="calendar-start-time"
                type="time"
                className="pixel-input"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>

            <div className="pixel-form-group">
              <label htmlFor="calendar-end-time" className="pixel-label">
                <span>END TIME</span>
              </label>
              <input
                id="calendar-end-time"
                type="time"
                className="pixel-input"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          </div>
        )}

        {/* Category Selector */}
        <div className="pixel-form-group">
          <label className="pixel-label">
            <span>CATEGORY</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
            {CALENDAR_CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`pixel-toggle-btn ${isSelected ? "active" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                    padding: "4px 2px",
                    fontSize: "8px",
                    backgroundColor: isSelected ? cat.color : "var(--surface-dark)",
                    color: isSelected && (cat.id === "Work" || cat.id === "Study") ? "#ffffff" : "var(--text-primary)",
                    borderColor: isSelected ? "var(--border)" : "var(--border-subtle)"
                  }}
                >
                  <span style={{ fontSize: "12px" }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description textarea */}
        <div className="pixel-form-group">
          <label htmlFor="calendar-description" className="pixel-label">
            <span>DESCRIPTION (OPTIONAL)</span>
          </label>
          <textarea
            id="calendar-description"
            rows={2}
            className="pixel-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add agenda, location, notes, or links..."
            style={{ resize: "vertical", minHeight: "50px", fontFamily: "var(--font-body)" }}
          />
        </div>

        {/* Submit / Cancel Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
          <button
            type="button"
            onClick={onCancel}
            className="pixel-button"
            style={{ fontSize: "8.5px", padding: "6px 12px" }}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="pixel-button pixel-button-teal"
            style={{ fontSize: "8.5px", padding: "6px 14px" }}
          >
            {isEditing ? "UPDATE EVENT" : "SAVE EVENT"}
          </button>
        </div>
      </form>
    </div>
  );
}
