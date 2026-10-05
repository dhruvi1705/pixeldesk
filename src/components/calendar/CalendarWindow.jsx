import React, { useState } from "react";
import { useCalendar } from "../../hooks/useCalendar";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { EventList } from "./EventList";
import { EventForm } from "./EventForm";

export function CalendarWindow({ onClose: _onClose }) {
  const {
    events,
    viewYear,
    viewMonth,
    selectedDate,
    setSelectedDate,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    selectedDayEvents,
    getEventsForDate,
    createEvent,
    updateEvent,
    deleteEvent,
    loadStarterEvents
  } = useCalendar();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleOpenCreateForm = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleSaveForm = (eventData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      createEvent(eventData);
    }
    handleCloseForm();
  };

  return (
    <div
      className="calendar-app-window"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "var(--font-body)",
        maxWidth: "100%"
      }}
    >
      {/* Subtitle Banner */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "8px",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "19px",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.2
            }}
          >
            "Keep your days on track."
          </p>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)",
              margin: "3px 0 0 0"
            }}
          >
            {events.length} TOTAL EVENTS SCHEDULED
          </p>
        </div>

        {/* Quick starter reset / count */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={loadStarterEvents}
            className="pixel-button pixel-button-sm"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              padding: "3px 6px"
            }}
            title="Reset to starter calendar demo events"
          >
            ↺ DEMO DATA
          </button>
        </div>
      </header>

      {/* Main Body: If form is open, show form overlay; else show grid + day events */}
      {isFormOpen ? (
        <EventForm
          key={editingEvent ? editingEvent.id : `new_${selectedDate}`}
          initialEvent={editingEvent}
          defaultDate={selectedDate}
          onSave={handleSaveForm}
          onCancel={handleCloseForm}
        />
      ) : (
        <div
          className="calendar-main-content-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "12px",
            alignItems: "start"
          }}
        >
          {/* Left Column: Month Navigation + Calendar Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
            <CalendarHeader
              viewYear={viewYear}
              viewMonth={viewMonth}
              onPrevMonth={goToPrevMonth}
              onNextMonth={goToNextMonth}
              onGoToToday={goToToday}
            />

            <CalendarGrid
              viewYear={viewYear}
              viewMonth={viewMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              getEventsForDate={getEventsForDate}
            />
          </div>

          {/* Right Column: Selected Day Events & Management */}
          <div style={{ width: "100%" }}>
            <EventList
              selectedDate={selectedDate}
              events={selectedDayEvents}
              onNewEvent={handleOpenCreateForm}
              onEditEvent={handleOpenEditForm}
              onDeleteEvent={deleteEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
}
