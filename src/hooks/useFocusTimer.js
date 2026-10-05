import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  FOCUS_MODES,
  TIMER_STATUS,
  MODE_CONFIG,
  DEFAULT_FOCUS_SETTINGS,
  formatMinutesHuman,
  isTodayDate,
  playFocusChime
} from "../data/focusSettings";

const SETTINGS_KEY = "pixeldesk_focus_settings";
const SESSIONS_KEY = "pixeldesk_focus_sessions";
const TIMER_STATE_KEY = "pixeldesk_focus_timer_state";
const TASKS_STORAGE_KEY = "pixeldesk_tasks";

export function useFocusTimer() {
  // 1. Settings state
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_FOCUS_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (err) {
      console.warn("Failed to read focus settings:", err);
    }
    return DEFAULT_FOCUS_SETTINGS;
  });

  // 2. Completed sessions history
  const [sessions, setSessions] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn("Failed to read focus sessions:", err);
    }
    return [];
  });

  // 3. Active tasks from Tasks application
  const [activeTasks, setActiveTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((t) => !t.completed);
        }
      }
    } catch (err) {
      console.warn("Failed to read tasks:", err);
    }
    return [];
  });

  // Listen to Tasks app custom events to refresh active task list
  useEffect(() => {
    const handleTaskChange = () => {
      try {
        const stored = localStorage.getItem(TASKS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setActiveTasks(parsed.filter((t) => !t.completed));
          }
        }
      } catch (err) {
        console.warn("Failed to sync tasks:", err);
      }
    };

    window.addEventListener("pixeldesk_task_event", handleTaskChange);
    return () => window.removeEventListener("pixeldesk_task_event", handleTaskChange);
  }, []);

  // Helper to read initial timer state from localStorage synchronously
  const [initialSnapshot] = useState(() => {
    try {
      const saved = localStorage.getItem(TIMER_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.status === TIMER_STATUS.RUNNING && parsed.endTime) {
          const now = Date.now();
          const diff = Math.max(0, Math.ceil((parsed.endTime - now) / 1000));
          if (diff > 0) {
            return {
              mode: parsed.mode || FOCUS_MODES.FOCUS,
              selectedTask: parsed.selectedTask || null,
              status: TIMER_STATUS.RUNNING,
              remainingSeconds: diff,
              endTime: parsed.endTime
            };
          }
        } else if (parsed.status === TIMER_STATUS.PAUSED && parsed.remainingSeconds) {
          return {
            mode: parsed.mode || FOCUS_MODES.FOCUS,
            selectedTask: parsed.selectedTask || null,
            status: TIMER_STATUS.PAUSED,
            remainingSeconds: parsed.remainingSeconds,
            endTime: null
          };
        }
      }
    } catch (err) {
      console.warn("Could not read timer state:", err);
    }
    return {
      mode: FOCUS_MODES.FOCUS,
      selectedTask: null,
      status: TIMER_STATUS.IDLE,
      remainingSeconds: (settings.focusDuration || 25) * 60,
      endTime: null
    };
  });

  // 4. Timer mode & selected task
  const [mode, setMode] = useState(initialSnapshot.mode);
  const [selectedTask, setSelectedTask] = useState(initialSnapshot.selectedTask);
  const [status, setStatus] = useState(initialSnapshot.status);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSnapshot.remainingSeconds);
  const [announceMessage, setAnnounceMessage] = useState("");

  // Durations
  const currentDuration = useMemo(() => {
    if (mode === FOCUS_MODES.FOCUS) return settings.focusDuration;
    if (mode === FOCUS_MODES.SHORT_BREAK) return settings.shortBreakDuration;
    return settings.longBreakDuration;
  }, [mode, settings]);

  // References for timestamp calculation
  const endTimeRef = useRef(initialSnapshot.endTime);
  const intervalRef = useRef(null);

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error("Failed to save focus settings:", err);
    }
  }, [settings]);

  // Save sessions when changed
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (err) {
      console.error("Failed to save focus sessions:", err);
    }
  }, [sessions]);

  // Emit companion event
  const emitCompanionEvent = useCallback((action, payload = {}) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("pixeldesk_companion_event", {
          detail: { action, ...payload, timestamp: new Date().toISOString() }
        })
      );
      window.dispatchEvent(
        new CustomEvent("pixeldesk_focus_event", {
          detail: { state: action, ...payload, timestamp: new Date().toISOString() }
        })
      );
    }
  }, []);

  // Save timer snapshot
  const saveTimerState = useCallback((stateUpdates) => {
    try {
      const snapshot = {
        mode,
        status,
        remainingSeconds,
        endTime: endTimeRef.current,
        selectedTask,
        ...stateUpdates
      };
      localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(snapshot));
    } catch (err) {
      console.error("Failed to save timer state:", err);
    }
  }, [mode, status, remainingSeconds, selectedTask]);

  // Clear timer snapshot
  const clearTimerState = useCallback(() => {
    try {
      localStorage.removeItem(TIMER_STATE_KEY);
    } catch (err) {
      console.error("Failed to clear timer state:", err);
    }
  }, []);

  // Complete session handler
  const handleSessionComplete = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;

    setRemainingSeconds(0);
    setStatus(TIMER_STATUS.COMPLETED);

    // Play subtle audio chime if enabled
    if (settings.soundEnabled) {
      playFocusChime();
    }

    const modeName = MODE_CONFIG[mode]?.label || "Session";
    setAnnounceMessage(`${modeName} complete!`);

    // Record session if it was a focus session
    if (mode === FOCUS_MODES.FOCUS) {
      const newSession = {
        id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: "focus",
        durationMinutes: settings.focusDuration,
        completedAt: new Date().toISOString(),
        taskId: selectedTask ? selectedTask.id : null,
        taskTitle: selectedTask ? selectedTask.title : "Focus Session"
      };
      setSessions((prev) => [newSession, ...prev]);
    }

    emitCompanionEvent("COMPLETED", {
      mode,
      task: selectedTask,
      duration: currentDuration
    });

    clearTimerState();
  }, [mode, settings, selectedTask, currentDuration, emitCompanionEvent, clearTimerState]);

  // Tick loop based on timestamps
  useEffect(() => {
    if (status === TIMER_STATUS.RUNNING) {
      intervalRef.current = setInterval(() => {
        if (!endTimeRef.current) return;
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));

        setRemainingSeconds(diff);

        if (diff <= 0) {
          handleSessionComplete();
        }
      }, 300);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, handleSessionComplete]);

  // Handle tab visibility change / blur to prevent timer drift
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && status === TIMER_STATUS.RUNNING && endTimeRef.current) {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
        setRemainingSeconds(diff);
        if (diff <= 0) {
          handleSessionComplete();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [status, handleSessionComplete]);

  // Start timer
  const startTimer = useCallback(() => {
    const secsToRun = remainingSeconds > 0 ? remainingSeconds : currentDuration * 60;
    const end = Date.now() + secsToRun * 1000;
    endTimeRef.current = end;
    setRemainingSeconds(secsToRun);
    setStatus(TIMER_STATUS.RUNNING);

    const companionState = mode === FOCUS_MODES.FOCUS ? "WORKING" : "BREAK";
    emitCompanionEvent(companionState, { mode, task: selectedTask });
    setAnnounceMessage(`${MODE_CONFIG[mode]?.label || "Session"} started.`);

    saveTimerState({
      status: TIMER_STATUS.RUNNING,
      endTime: end,
      remainingSeconds: secsToRun,
      mode,
      selectedTask
    });
  }, [remainingSeconds, currentDuration, mode, selectedTask, emitCompanionEvent, saveTimerState]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const now = Date.now();
    const remaining = endTimeRef.current ? Math.max(0, Math.ceil((endTimeRef.current - now) / 1000)) : remainingSeconds;
    endTimeRef.current = null;

    setRemainingSeconds(remaining);
    setStatus(TIMER_STATUS.PAUSED);

    emitCompanionEvent("PAUSED", { mode, task: selectedTask });
    setAnnounceMessage("Timer paused.");

    saveTimerState({
      status: TIMER_STATUS.PAUSED,
      endTime: null,
      remainingSeconds: remaining,
      mode,
      selectedTask
    });
  }, [remainingSeconds, mode, selectedTask, emitCompanionEvent, saveTimerState]);

  // Resume timer
  const resumeTimer = useCallback(() => {
    startTimer();
    setAnnounceMessage("Timer resumed.");
  }, [startTimer]);

  // Reset timer
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;

    const baseSecs = currentDuration * 60;
    setRemainingSeconds(baseSecs);
    setStatus(TIMER_STATUS.IDLE);

    emitCompanionEvent("IDLE", { mode });
    setAnnounceMessage("Timer reset.");
    clearTimerState();
  }, [currentDuration, mode, emitCompanionEvent, clearTimerState]);

  // Switch mode (Focus, Short Break, Long Break)
  const switchMode = useCallback((newMode) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;

    setMode(newMode);
    setStatus(TIMER_STATUS.IDLE);

    let durationMins = settings.focusDuration;
    if (newMode === FOCUS_MODES.SHORT_BREAK) durationMins = settings.shortBreakDuration;
    if (newMode === FOCUS_MODES.LONG_BREAK) durationMins = settings.longBreakDuration;

    setRemainingSeconds(durationMins * 60);
    setAnnounceMessage(`Switched to ${MODE_CONFIG[newMode]?.label || newMode}.`);
    clearTimerState();
  }, [settings, clearTimerState]);

  // Change duration preset for current mode
  const setModeDuration = useCallback((durationInMinutes) => {
    const mins = Math.max(1, parseInt(durationInMinutes, 10));
    setSettings((prev) => {
      if (mode === FOCUS_MODES.FOCUS) return { ...prev, focusDuration: mins };
      if (mode === FOCUS_MODES.SHORT_BREAK) return { ...prev, shortBreakDuration: mins };
      return { ...prev, longBreakDuration: mins };
    });

    if (status === TIMER_STATUS.IDLE) {
      setRemainingSeconds(mins * 60);
    }
  }, [mode, status]);

  // Update specific settings
  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // Today's statistics
  const todayStats = useMemo(() => {
    const todaySessions = sessions.filter((s) => s.type === "focus" && isTodayDate(s.completedAt));
    const totalMinutes = todaySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    return {
      sessionCount: todaySessions.length,
      totalMinutes,
      formattedTime: formatMinutesHuman(totalMinutes),
      sessions: todaySessions
    };
  }, [sessions]);

  return {
    mode,
    status,
    remainingSeconds,
    durationMinutes: currentDuration,
    totalSeconds: currentDuration * 60,
    selectedTask,
    setSelectedTask,
    activeTasks,
    settings,
    updateSettings,
    sessions,
    todayStats,
    announceMessage,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    switchMode,
    setModeDuration
  };
}
