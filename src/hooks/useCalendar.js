import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getLocalDateString,
  getStarterEvents
} from "../data/calendarCategories";

const STORAGE_KEY = "pixeldesk_events";

export function useCalendar() {
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to read events from localStorage:", err);
    }
    return getStarterEvents();
  });

  // Active view: month (0-11) and full year
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  // Selected date: YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  // Persist to localStorage whenever events change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (err) {
      console.error("Failed to save events to localStorage:", err);
    }
  }, [events]);

  // Dispatch custom event for companion integration
  const emitCalendarEvent = (action, eventData) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("pixeldesk_calendar_event", {
          detail: { action, event: eventData, timestamp: new Date().toISOString() }
        })
      );
    }
  };

  // Month navigation: Next month
  const goToNextMonth = useCallback(() => {
    setViewMonth((prevMonth) => {
      if (prevMonth === 11) {
        setViewYear((prevYear) => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  }, [setViewMonth, setViewYear]);

  // Month navigation: Previous month
  const goToPrevMonth = useCallback(() => {
    setViewMonth((prevMonth) => {
      if (prevMonth === 0) {
        setViewYear((prevYear) => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  }, [setViewMonth, setViewYear]);

  // Month navigation: Go to Today
  const goToToday = useCallback(() => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDate(getLocalDateString(now));
  }, [setViewYear, setViewMonth, setSelectedDate]);

  // Create an event
  const createEvent = useCallback((eventData) => {
    const trimmedTitle = (eventData.title || "").trim();
    if (!trimmedTitle) {
      return { success: false, error: "Event title is required." };
    }
    if (trimmedTitle.length > 100) {
      return { success: false, error: "Title cannot exceed 100 characters." };
    }
    if (!eventData.date) {
      return { success: false, error: "Event date is required." };
    }

    const allDay = !!eventData.allDay;
    const startTime = allDay ? "" : (eventData.startTime || "");
    const endTime = allDay ? "" : (eventData.endTime || "");

    if (!allDay && startTime && endTime && endTime < startTime) {
      return { success: false, error: "End time cannot be earlier than start time." };
    }

    const newEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: trimmedTitle,
      date: eventData.date,
      startTime,
      endTime,
      allDay,
      category: eventData.category || "Other",
      description: (eventData.description || "").trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEvents((prev) => [newEvent, ...prev]);
    setSelectedDate(eventData.date);

    // Keep view synced with created event month
    const [y, m] = eventData.date.split("-").map(Number);
    if (!isNaN(y) && !isNaN(m)) {
      setViewYear(y);
      setViewMonth(m - 1);
    }

    emitCalendarEvent("eventCreated", newEvent);
    return { success: true, event: newEvent };
  }, []);

  // Update an existing event
  const updateEvent = useCallback((id, updates) => {
    const trimmedTitle = updates.title !== undefined ? updates.title.trim() : undefined;
    if (trimmedTitle !== undefined && !trimmedTitle) {
      return { success: false, error: "Event title cannot be empty." };
    }
    if (trimmedTitle && trimmedTitle.length > 100) {
      return { success: false, error: "Title cannot exceed 100 characters." };
    }

    const allDay = updates.allDay !== undefined ? !!updates.allDay : undefined;
    const startTime = allDay ? "" : updates.startTime;
    const endTime = allDay ? "" : updates.endTime;

    if (!allDay && startTime && endTime && endTime < startTime) {
      return { success: false, error: "End time cannot be earlier than start time." };
    }

    let updatedEvent = null;
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          updatedEvent = {
            ...evt,
            ...updates,
            ...(trimmedTitle !== undefined ? { title: trimmedTitle } : {}),
            ...(allDay !== undefined ? { allDay } : {}),
            ...(startTime !== undefined ? { startTime } : {}),
            ...(endTime !== undefined ? { endTime } : {}),
            description: updates.description !== undefined ? updates.description.trim() : evt.description,
            updatedAt: new Date().toISOString()
          };
          return updatedEvent;
        }
        return evt;
      })
    );

    if (updatedEvent) {
      emitCalendarEvent("eventUpdated", updatedEvent);
      return { success: true, event: updatedEvent };
    }
    return { success: false, error: "Event not found." };
  }, []);

  // Delete an event
  const deleteEvent = useCallback((id) => {
    let deleted = null;
    setEvents((prev) => {
      deleted = prev.find((e) => e.id === id);
      return prev.filter((e) => e.id !== id);
    });

    if (deleted) {
      emitCalendarEvent("eventDeleted", deleted);
      return { success: true };
    }
    return { success: false };
  }, []);

  // Map of events grouped by date: { 'YYYY-MM-DD': [event1, event2] }
  const eventsByDate = useMemo(() => {
    const map = {};
    for (const evt of events) {
      if (!map[evt.date]) {
        map[evt.date] = [];
      }
      map[evt.date].push(evt);
    }
    return map;
  }, [events]);

  // Helper to get events for any date
  const getEventsForDate = useCallback(
    (dateStr) => {
      return eventsByDate[dateStr] || [];
    },
    [eventsByDate]
  );

  // Selected day's events, chronologically sorted (All Day first, then by startTime)
  const selectedDayEvents = useMemo(() => {
    const dayEvents = eventsByDate[selectedDate] || [];
    return [...dayEvents].sort((a, b) => {
      // 1. All-day events first
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;

      // 2. Both all-day or neither: sort by startTime
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      if (a.startTime && !b.startTime) return -1;
      if (!a.startTime && b.startTime) return 1;

      // 3. Fallback to createdAt
      return (a.createdAt || "").localeCompare(b.createdAt || "");
    });
  }, [eventsByDate, selectedDate]);

  // Reset to starter events
  const loadStarterEvents = useCallback(() => {
    const starters = getStarterEvents();
    setEvents(starters);
    goToToday();
  }, [goToToday]);

  return {
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
  };
}
