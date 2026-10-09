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
import { scopedStorage } from "../utils/storage";
import { apiClient } from "../utils/apiClient";
import { authService } from "../utils/authService";

const SETTINGS_KEY = "focus_settings";
const SESSIONS_KEY = "focus_sessions";
const TIMER_STATE_KEY = "focus_timer_state";
const TASKS_STORAGE_KEY = "tasks";

function normalizeSession(sess) {
  if (!sess) return null;
  return {
    id: sess.id,
    taskId: sess.task_id || sess.taskId || null,
    taskTitle: sess.task_title || sess.taskTitle || "Focus Session",
    durationMinutes: sess.duration_minutes !== undefined ? sess.duration_minutes : (sess.durationMinutes || 25),
    mode: sess.mode || "focus",
    type: "focus",
    completedAt: sess.completed_at || sess.completedAt || new Date().toISOString()
  };
}

export function useFocusTimer() {
  // 1. Settings state
  const [settings, setSettings] = useState(() => {
    try {
      const stored = scopedStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        return { ...DEFAULT_FOCUS_SETTINGS, ...parsed };
      }
    } catch (err) {
      console.warn("Failed to read focus settings:", err);
    }
    return DEFAULT_FOCUS_SETTINGS;
  });

  // 2. Completed sessions history
  const [sessions, setSessions] = useState(() => {
    try {
      const stored = scopedStorage.getItem(SESSIONS_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        if (Array.isArray(parsed)) return parsed.map(normalizeSession).filter(Boolean);
      }
    } catch (err) {
      console.warn("Failed to read focus sessions:", err);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // 3. Active tasks from Tasks application
  const [activeTasks, setActiveTasks] = useState(() => {
    try {
      const stored = scopedStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        if (Array.isArray(parsed)) {
          return parsed.filter((t) => !t.completed);
        }
      }
    } catch (err) {
      console.warn("Failed to read tasks:", err);
    }
    return [];
  });

  // Fetch sessions from backend
  const fetchSessions = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsSyncing(true);
      const remoteSessions = await apiClient.focus.list();
      if (Array.isArray(remoteSessions)) {
        const normalized = remoteSessions.map(normalizeSession).filter(Boolean);
        setSessions(normalized);
        try {
          scopedStorage.setItem(SESSIONS_KEY, normalized);
        } catch (storageErr) {
          console.error("Failed to cache remote focus sessions:", storageErr);
        }
      }
    } catch (err) {
      console.warn("Backend focus sessions fetch failed, using cached data:", err.message);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Listen to Tasks app custom events to refresh active task list
  useEffect(() => {
    const handleTaskChange = () => {
      try {
        const stored = scopedStorage.getItem(TASKS_STORAGE_KEY);
        if (stored) {
          const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
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

  // Helper to read initial timer state from scopedStorage synchronously
  const [initialSnapshot] = useState(() => {
    try {
      const saved = scopedStorage.getItem(TIMER_STATE_KEY);
      if (saved) {
        const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
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
      scopedStorage.setItem(SETTINGS_KEY, settings);
    } catch (err) {
      console.error("Failed to save focus settings:", err);
    }
  }, [settings]);

  // Save sessions when changed
  useEffect(() => {
    try {
      scopedStorage.setItem(SESSIONS_KEY, sessions);
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
      scopedStorage.setItem(TIMER_STATE_KEY, snapshot);
    } catch (err) {
      console.error("Failed to save timer state:", err);
    }
  }, [mode, status, remainingSeconds, selectedTask]);

  // Clear timer snapshot
  const clearTimerState = useCallback(() => {
    try {
      scopedStorage.removeItem(TIMER_STATE_KEY);
    } catch (err) {
      console.error("Failed to clear timer state:", err);
    }
  }, []);

  // Complete session handler
  const handleSessionComplete = useCallback(async () => {
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
      const tempId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const completedAtIso = new Date().toISOString();
      const taskTitle = selectedTask ? selectedTask.title : "Focus Session";
      const taskId = selectedTask ? selectedTask.id : null;

      const newSession = {
        id: tempId,
        type: "focus",
        durationMinutes: settings.focusDuration,
        completedAt: completedAtIso,
        taskId: taskId,
        taskTitle: taskTitle
      };

      setSessions((prev) => [newSession, ...prev]);

      // Backend sync
      if (authService.isAuthenticated()) {
        try {
          setIsSyncing(true);
          const payload = {
            duration_minutes: settings.focusDuration,
            task_id: taskId,
            task_title: taskTitle,
            mode: "focus",
            completed_at: completedAtIso
          };

          let remote = null;
          try {
            remote = await apiClient.focus.log(payload);
          } catch (logErr) {
            // If linking failed due to non-backend task ID, retry without task_id
            if (taskId) {
              remote = await apiClient.focus.log({
                ...payload,
                task_id: null
              });
            } else {
              throw logErr;
            }
          }

          if (remote && remote.id) {
            const synced = normalizeSession(remote);
            setSessions((prev) => prev.map((s) => (s.id === tempId ? synced : s)));
          }
        } catch (err) {
          console.warn("Backend focus session log failed:", err.message);
        } finally {
          setIsSyncing(false);
        }
      }
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
    isLoading,
    isSyncing,
    refreshSessions: fetchSessions,
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
