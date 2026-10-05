import { useState, useEffect, useRef, useCallback } from "react";
import {
  DEFAULT_AVATAR_CONFIG,
  sanitizeAvatarConfig
} from "../data/avatarOptions";
import {
  COMPANION_STATES,
  COMPANION_MESSAGES,
  COMPANION_IDLE_THRESHOLD,
  COMPANION_SLEEP_THRESHOLD
} from "../utils/companionEvents";

const AVATAR_KEY = "pixeldesk_avatar";
const FOCUS_TIMER_KEY = "pixeldesk_focus_timer_state";
const TASKS_KEY = "pixeldesk_tasks";

export function useCompanion() {
  // 1. Persistent Avatar Configuration (synced with Avatar Studio)
  const [avatarConfig, setAvatarConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(AVATAR_KEY);
      if (stored) {
        return sanitizeAvatarConfig(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to load avatar in companion:", err);
    }
    return { ...DEFAULT_AVATAR_CONFIG };
  });

  // Listen to Avatar Studio save events
  useEffect(() => {
    const handleAvatarUpdate = (e) => {
      const newConfig = e.detail;
      if (newConfig) {
        setAvatarConfig(sanitizeAvatarConfig(newConfig));
      } else {
        try {
          const stored = localStorage.getItem(AVATAR_KEY);
          if (stored) {
            setAvatarConfig(sanitizeAvatarConfig(JSON.parse(stored)));
          }
        } catch {}
      }
    };

    window.addEventListener("pixeldesk_avatar_updated", handleAvatarUpdate);
    window.addEventListener("pixeldesk_avatar_changed", handleAvatarUpdate);

    return () => {
      window.removeEventListener("pixeldesk_avatar_updated", handleAvatarUpdate);
      window.removeEventListener("pixeldesk_avatar_changed", handleAvatarUpdate);
    };
  }, []);

  // 2. Base State & Reaction Management
  const [baseState, setBaseState] = useState(() => {
    // Check if active Focus timer exists on page load
    try {
      const savedTimer = localStorage.getItem(FOCUS_TIMER_KEY);
      if (savedTimer) {
        const parsed = JSON.parse(savedTimer);
        if (parsed.status === "running") {
          return parsed.mode === "focus" ? COMPANION_STATES.FOCUSING : COMPANION_STATES.BREAK;
        }
      }
    } catch {}
    return COMPANION_STATES.IDLE;
  });

  const [previousState, setPreviousState] = useState(COMPANION_STATES.IDLE);
  const [temporaryReaction, setTemporaryReaction] = useState(null);
  const [customMessage, setCustomMessage] = useState(null);

  const reactionTimeoutRef = useRef(null);
  const appContextTimeoutRef = useRef(null);
  const lastActivityAtRef = useRef(0);
  const hiddenAtRef = useRef(null);
  const alertTriggeredForDateRef = useRef(null);

  useEffect(() => {
    lastActivityAtRef.current = Date.now();
  }, []);

  // Derived state to display: temporary reaction wins over baseState
  const derivedDisplayState = temporaryReaction || baseState;

  // Derive display message
  const message = customMessage || COMPANION_MESSAGES[derivedDisplayState] || "Ready when you are.";

  // Safe base state transition
  const setBaseStateSafe = useCallback((newState, msg = null) => {
    setBaseState((prev) => {
      if (prev !== newState) {
        setPreviousState(prev);
      }
      return newState;
    });
    if (msg) setCustomMessage(msg);
    else setCustomMessage(null);
  }, []);

  // Trigger temporary reaction (e.g. CELEBRATING, WAKING, ALERT)
  const triggerReaction = useCallback((reactionState, durationMs = 2500, msg = null) => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
      reactionTimeoutRef.current = null;
    }

    setTemporaryReaction(reactionState);
    if (msg) setCustomMessage(msg);

    reactionTimeoutRef.current = setTimeout(() => {
      setTemporaryReaction(null);
      setCustomMessage(null);
      reactionTimeoutRef.current = null;
    }, durationMs);
  }, []);

  // Reset to previous state
  const resetToPreviousState = useCallback(() => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
      reactionTimeoutRef.current = null;
    }
    setTemporaryReaction(null);
    setCustomMessage(null);
    setBaseState(previousState);
  }, [previousState]);

  // 3. User Activity Tracking (Inactivity / Wakeup)
  useEffect(() => {
    let lastThrottledRecord = 0;

    const handleUserInteraction = () => {
      const now = Date.now();
      if (now - lastThrottledRecord < 800) return;
      lastThrottledRecord = now;
      lastActivityAtRef.current = now;

      // If companion was SLEEPING, wake up!
      setBaseState((currBase) => {
        if (currBase === COMPANION_STATES.SLEEPING) {
          triggerReaction(COMPANION_STATES.WAKING, 2200, "Welcome back!");
          return COMPANION_STATES.IDLE;
        }
        return currBase;
      });
    };

    const events = ["mousemove", "mousedown", "keydown", "pointerdown", "touchstart", "focus"];
    events.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
      });
    };
  }, [triggerReaction]);

  // 4. Inactivity Periodic Evaluation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityAtRef.current;

      setBaseState((currBase) => {
        // Do not interrupt active Focus sessions with sleep
        if (currBase === COMPANION_STATES.FOCUSING || currBase === COMPANION_STATES.BREAK) {
          return currBase;
        }

        // Check for prolonged inactivity -> SLEEPING
        if (elapsed >= COMPANION_SLEEP_THRESHOLD && currBase !== COMPANION_STATES.SLEEPING) {
          return COMPANION_STATES.SLEEPING;
        }

        // Return from WORKING/WRITING/CALENDAR/FINANCE to IDLE after idle threshold
        if (
          elapsed >= COMPANION_IDLE_THRESHOLD &&
          (currBase === COMPANION_STATES.WORKING ||
            currBase === COMPANION_STATES.WRITING ||
            currBase === COMPANION_STATES.CALENDAR ||
            currBase === COMPANION_STATES.FINANCE ||
            currBase === COMPANION_STATES.ANALYTICS)
        ) {
          return COMPANION_STATES.IDLE;
        }

        return currBase;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 5. Visibility Change (Tab background / foreground)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
      } else {
        const now = Date.now();
        if (hiddenAtRef.current) {
          const hiddenElapsed = now - hiddenAtRef.current;
          hiddenAtRef.current = null;
          lastActivityAtRef.current = now;

          // If away for more than sleep threshold, show waking
          if (hiddenElapsed >= COMPANION_SLEEP_THRESHOLD) {
            triggerReaction(COMPANION_STATES.WAKING, 2200, "Welcome back!");
            setBaseStateSafe(COMPANION_STATES.IDLE);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [triggerReaction, setBaseStateSafe]);

  // 6. Overdue Tasks Check Helper
  const checkOverdueTasks = useCallback(() => {
    try {
      const stored = localStorage.getItem(TASKS_KEY);
      if (!stored) return;
      const tasks = JSON.parse(stored);
      if (!Array.isArray(tasks)) return;

      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const todayStr = `${y}-${m}-${d}`;

      const hasOverdue = tasks.some(
        (t) => !t.completed && t.dueDate && t.dueDate < todayStr
      );

      // Only trigger once per day / condition change
      if (hasOverdue && alertTriggeredForDateRef.current !== todayStr) {
        alertTriggeredForDateRef.current = todayStr;
        triggerReaction(COMPANION_STATES.ALERT, 3500);
      }
    } catch {}
  }, [triggerReaction]);

  // Check overdue on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      checkOverdueTasks();
    }, 200);
    return () => clearTimeout(timer);
  }, [checkOverdueTasks]);

  // 7. Event Bus Listeners
  useEffect(() => {
    // Tasks Integration
    const handleTaskEvent = (e) => {
      lastActivityAtRef.current = Date.now();
      const action = e.detail?.action;

      if (action === "taskCompleted") {
        // High priority celebration reaction (2.5s)
        triggerReaction(COMPANION_STATES.CELEBRATING, 2600);
      } else if (action === "taskCreated" || action === "taskUpdated" || action === "taskDeleted") {
        // Normal activity
        setBaseState((prev) => {
          if (prev === COMPANION_STATES.FOCUSING || prev === COMPANION_STATES.BREAK) {
            return prev;
          }
          return COMPANION_STATES.WORKING;
        });
        checkOverdueTasks();
      }
    };

    // Focus / Pomodoro Integration
    const handleFocusEvent = (e) => {
      lastActivityAtRef.current = Date.now();
      const action = e.detail?.action || e.detail?.state;
      const mode = e.detail?.mode;

      if (action === "WORKING" || (action === "RUNNING" && mode === "focus")) {
        setBaseStateSafe(COMPANION_STATES.FOCUSING);
      } else if (action === "BREAK" || (action === "RUNNING" && (mode === "shortBreak" || mode === "longBreak"))) {
        setBaseStateSafe(COMPANION_STATES.BREAK);
      } else if (action === "COMPLETED") {
        triggerReaction(COMPANION_STATES.CELEBRATING, 3000, "Session complete! ✦");
        setBaseStateSafe(COMPANION_STATES.IDLE);
      } else if (action === "IDLE" || action === "RESET") {
        setBaseStateSafe(COMPANION_STATES.IDLE);
      } else if (action === "PAUSED") {
        setBaseStateSafe(COMPANION_STATES.WORKING, "Timer paused.");
      }
    };

    // Central Companion Event Bus
    const handleCompanionEvent = (e) => {
      lastActivityAtRef.current = Date.now();
      const type = e.detail?.type;
      const action = e.detail?.action;
      const eventType = type || action;
      const msg = e.detail?.message;
      const mode = e.detail?.mode;

      if (eventType === "TASK_COMPLETED" || eventType === "CELEBRATING") {
        triggerReaction(COMPANION_STATES.CELEBRATING, 2600, msg);
      } else if (eventType === "ALERT") {
        triggerReaction(COMPANION_STATES.ALERT, 3500, msg);
      } else if (eventType === "WAKING") {
        triggerReaction(COMPANION_STATES.WAKING, 2200, msg || "Welcome back!");
      } else if (
        eventType === "FOCUSING" ||
        (eventType === "WORKING" && mode === "focus") ||
        (eventType === "RUNNING" && mode === "focus")
      ) {
        setBaseStateSafe(COMPANION_STATES.FOCUSING, msg);
      } else if (
        eventType === "BREAK" ||
        (eventType === "RUNNING" && (mode === "shortBreak" || mode === "longBreak"))
      ) {
        setBaseStateSafe(COMPANION_STATES.BREAK, msg);
      } else if (eventType === "COMPLETED") {
        triggerReaction(COMPANION_STATES.CELEBRATING, 3000, msg || "Session complete! ✦");
        setBaseStateSafe(COMPANION_STATES.IDLE);
      } else if (eventType === "WRITING") {
        setBaseStateSafe(COMPANION_STATES.WRITING, msg);
      } else if (eventType === "CALENDAR") {
        setBaseStateSafe(COMPANION_STATES.CALENDAR, msg);
      } else if (eventType === "FINANCE") {
        setBaseStateSafe(COMPANION_STATES.FINANCE, msg);
      } else if (eventType === "ANALYTICS") {
        setBaseStateSafe(COMPANION_STATES.ANALYTICS, msg);
      } else if (eventType === "WORKING") {
        setBaseStateSafe(COMPANION_STATES.WORKING, msg);
      } else if (eventType === "IDLE" || eventType === "RESET") {
        setBaseStateSafe(COMPANION_STATES.IDLE, msg);
      } else if (eventType === "PAUSED") {
        setBaseStateSafe(COMPANION_STATES.WORKING, msg || "Timer paused.");
      }
    };

    // Notes Integration
    const handleNotesEvent = (e) => {
      lastActivityAtRef.current = Date.now();
      const type = e.detail?.type;

      if (type === "EDITING") {
        setBaseState((prev) => {
          if (prev === COMPANION_STATES.FOCUSING || prev === COMPANION_STATES.BREAK) {
            return prev;
          }
          return COMPANION_STATES.WRITING;
        });
      } else if (type === "SAVED") {
        // Brief positive reaction if not focusing
        setBaseState((prev) => {
          if (prev === COMPANION_STATES.FOCUSING || prev === COMPANION_STATES.BREAK) {
            return prev;
          }
          return COMPANION_STATES.WORKING;
        });
      } else if (type === "CLOSED") {
        setBaseState((prev) => {
          if (prev === COMPANION_STATES.WRITING) {
            return COMPANION_STATES.IDLE;
          }
          return prev;
        });
      }
    };

    // Calendar Integration
    const handleCalendarEvent = () => {
      lastActivityAtRef.current = Date.now();
      setBaseState((prev) => {
        if (prev === COMPANION_STATES.FOCUSING || prev === COMPANION_STATES.BREAK) {
          return prev;
        }
        return COMPANION_STATES.CALENDAR;
      });

      if (appContextTimeoutRef.current) clearTimeout(appContextTimeoutRef.current);
      appContextTimeoutRef.current = setTimeout(() => {
        setBaseState((prev) => (prev === COMPANION_STATES.CALENDAR ? COMPANION_STATES.WORKING : prev));
      }, 4000);
    };

    // Finance Integration
    const handleFinanceEvent = () => {
      lastActivityAtRef.current = Date.now();
      setBaseState((prev) => {
        if (prev === COMPANION_STATES.FOCUSING || prev === COMPANION_STATES.BREAK) {
          return prev;
        }
        return COMPANION_STATES.FINANCE;
      });

      if (appContextTimeoutRef.current) clearTimeout(appContextTimeoutRef.current);
      appContextTimeoutRef.current = setTimeout(() => {
        setBaseState((prev) => (prev === COMPANION_STATES.FINANCE ? COMPANION_STATES.WORKING : prev));
      }, 4000);
    };

    window.addEventListener("pixeldesk_task_event", handleTaskEvent);
    window.addEventListener("pixeldesk_focus_event", handleFocusEvent);
    window.addEventListener("pixeldesk_companion_event", handleCompanionEvent);
    window.addEventListener("pixeldesk_notes_event", handleNotesEvent);
    window.addEventListener("pixeldesk_calendar_event", handleCalendarEvent);
    window.addEventListener("pixeldesk_finance_event", handleFinanceEvent);

    return () => {
      window.removeEventListener("pixeldesk_task_event", handleTaskEvent);
      window.removeEventListener("pixeldesk_focus_event", handleFocusEvent);
      window.removeEventListener("pixeldesk_companion_event", handleCompanionEvent);
      window.removeEventListener("pixeldesk_notes_event", handleNotesEvent);
      window.removeEventListener("pixeldesk_calendar_event", handleCalendarEvent);
      window.removeEventListener("pixeldesk_finance_event", handleFinanceEvent);
      if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
      if (appContextTimeoutRef.current) clearTimeout(appContextTimeoutRef.current);
    };
  }, [triggerReaction, setBaseStateSafe, checkOverdueTasks]);

  return {
    avatarConfig,
    state: derivedDisplayState,
    baseState,
    previousState,
    message,
    setState: setBaseStateSafe,
    triggerReaction,
    resetToPreviousState,
    isSleeping: derivedDisplayState === COMPANION_STATES.SLEEPING,
    isActive: derivedDisplayState !== COMPANION_STATES.SLEEPING && derivedDisplayState !== COMPANION_STATES.IDLE
  };
}
