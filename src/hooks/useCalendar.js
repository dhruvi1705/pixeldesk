import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getLocalDateString,
  getStarterEvents
} from "../data/calendarCategories";
import { scopedStorage } from "../utils/storage";
import { apiClient } from "../utils/apiClient";
import { authService } from "../utils/authService";

const STORAGE_KEY = "events";

function normalizeEvent(evt) {
  if (!evt) return null;
  return {
    id: evt.id,
    title: evt.title || "",
    description: evt.description || "",
    category: evt.category || "Other",
    date: typeof evt.date === "string" ? evt.date : String(evt.date),
    startTime: evt.start_time !== undefined ? (evt.start_time || "") : (evt.startTime || ""),
    endTime: evt.end_time !== undefined ? (evt.end_time || "") : (evt.endTime || ""),
    allDay: evt.all_day !== undefined ? Boolean(evt.all_day) : Boolean(evt.allDay),
    createdAt: evt.created_at || evt.createdAt || new Date().toISOString(),
    updatedAt: evt.updated_at || evt.updatedAt || new Date().toISOString()
  };
}

export function useCalendar() {
  const [events, setEvents] = useState(() => {
    try {
      const stored = scopedStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeEvent).filter(Boolean);
        }
      }
    } catch (err) {
      console.warn("Failed to read events from scopedStorage:", err);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Active view: month (0-11) and full year
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  // Selected date: YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  // Fetch events from authenticated API
  const fetchEvents = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsSyncing(true);
      setError(null);
      const remoteEvents = await apiClient.calendar.list();
      if (Array.isArray(remoteEvents)) {
        const normalized = remoteEvents.map(normalizeEvent).filter(Boolean);
        setEvents(normalized);
        try {
          scopedStorage.setItem(STORAGE_KEY, normalized);
        } catch (storageErr) {
          console.error("Failed to cache remote events:", storageErr);
        }
      }
    } catch (err) {
      console.warn("Backend calendar fetch failed, using cached events:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Persist to scopedStorage whenever events change
  useEffect(() => {
    try {
      scopedStorage.setItem(STORAGE_KEY, events);
    } catch (err) {
      console.error("Failed to save events to scopedStorage:", err);
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
  const createEvent = useCallback(async (eventData) => {
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

    const tempId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newEvent = {
      id: tempId,
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

    // Optimistic UI update
    setEvents((prev) => [newEvent, ...prev]);
    setSelectedDate(eventData.date);

    // Keep view synced with created event month
    const [y, m] = eventData.date.split("-").map(Number);
    if (!isNaN(y) && !isNaN(m)) {
      setViewYear(y);
      setViewMonth(m - 1);
    }

    emitCalendarEvent("eventCreated", newEvent);

    // Sync with backend if authenticated
    if (authService.isAuthenticated()) {
      try {
        setIsSyncing(true);
        const remote = await apiClient.calendar.create(newEvent);
        if (remote && remote.id) {
          const synced = normalizeEvent(remote);
          setEvents((prev) => prev.map((e) => (e.id === tempId ? synced : e)));
          return { success: true, event: synced };
        }
      } catch (err) {
        console.warn("Backend event creation failed:", err.message);
        setError(err.message);
      } finally {
        setIsSyncing(false);
      }
    }

    return { success: true, event: newEvent };
  }, []);

  // Update an existing event
  const updateEvent = useCallback(async (id, updates) => {
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

      if (authService.isAuthenticated()) {
        try {
          setIsSyncing(true);
          const remote = await apiClient.calendar.update(id, updates);
          if (remote) {
            const synced = normalizeEvent(remote);
            setEvents((prev) => prev.map((e) => (e.id === id ? synced : e)));
          }
        } catch (err) {
          console.warn("Backend calendar update failed:", err.message);
          setError(err.message);
        } finally {
          setIsSyncing(false);
        }
      }

      return { success: true, event: updatedEvent };
    }
    return { success: false, error: "Event not found." };
  }, []);

  // Delete an event
  const deleteEvent = useCallback(async (id) => {
    let deleted = null;
    setEvents((prev) => {
      deleted = prev.find((e) => e.id === id);
      return prev.filter((e) => e.id !== id);
    });

    if (deleted) {
      emitCalendarEvent("eventDeleted", deleted);

      if (authService.isAuthenticated()) {
        try {
          setIsSyncing(true);
          await apiClient.calendar.delete(id);
        } catch (err) {
          console.warn("Backend calendar delete failed:", err.message);
          setError(err.message);
        } finally {
          setIsSyncing(false);
        }
      }

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
    isLoading,
    isSyncing,
    error,
    refreshEvents: fetchEvents,
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
