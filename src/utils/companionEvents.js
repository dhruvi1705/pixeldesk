/**
 * Central event definitions and helpers for the Pixel Companion system.
 */

export const COMPANION_STATES = {
  IDLE: "IDLE",
  WORKING: "WORKING",
  FOCUSING: "FOCUSING",
  BREAK: "BREAK",
  SLEEPING: "SLEEPING",
  CELEBRATING: "CELEBRATING",
  WRITING: "WRITING",
  CALENDAR: "CALENDAR",
  FINANCE: "FINANCE",
  ANALYTICS: "ANALYTICS",
  ALERT: "ALERT",
  WAKING: "WAKING"
};

export const COMPANION_MESSAGES = {
  IDLE: "Ready when you are.",
  WORKING: "Let's get things done.",
  FOCUSING: "One thing at a time.",
  BREAK: "Take a little break.",
  SLEEPING: "Zzz...",
  CELEBRATING: "Task complete! 🎉",
  WRITING: "Writing...",
  CALENDAR: "Planning the day.",
  FINANCE: "Keeping track.",
  ALERT: "You have an overdue task.",
  WAKING: "Welcome back!"
};

export const COMPANION_STATUS_LABELS = {
  IDLE: "READY",
  WORKING: "WORKING...",
  FOCUSING: "FOCUS MODE",
  BREAK: "BREAK TIME",
  SLEEPING: "Zzz...",
  CELEBRATING: "COMPLETE! ✦",
  WRITING: "WRITING...",
  CALENDAR: "CALENDAR",
  FINANCE: "FINANCE",
  ALERT: "OVERDUE TASK",
  WAKING: "WAKING UP..."
};

export const COMPANION_PRIORITIES = {
  CELEBRATING: 100,
  WAKING: 95,
  ALERT: 90,
  FOCUSING: 80,
  BREAK: 80,
  WRITING: 60,
  CALENDAR: 60,
  FINANCE: 60,
  ANALYTICS: 60,
  WORKING: 40,
  IDLE: 20,
  SLEEPING: 10
};

export const COMPANION_IDLE_THRESHOLD = 30000;   // 30 seconds
export const COMPANION_SLEEP_THRESHOLD = 120000; // 2 minutes (configurable)

/**
 * Dispatch a custom event on the window for the companion to react to.
 * @param {string} type
 * @param {object} payload
 */
export function dispatchCompanionEvent(type, payload = {}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("pixeldesk_companion_event", {
        detail: { type, ...payload, timestamp: new Date().toISOString() }
      })
    );
  }
}
