// PixelDesk Focus & Pomodoro Data, Configurations & Helpers

export const FOCUS_MODES = {
  FOCUS: "focus",
  SHORT_BREAK: "short_break",
  LONG_BREAK: "long_break"
};

export const TIMER_STATUS = {
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused",
  COMPLETED: "completed"
};

export const MODE_CONFIG = {
  focus: {
    id: "focus",
    label: "FOCUS",
    defaultDuration: 25,
    presets: [15, 25, 45, 60],
    color: "var(--color-teal)",
    colorLight: "var(--color-teal-light)",
    badge: "Focus Session",
    companionState: "WORKING"
  },
  short_break: {
    id: "short_break",
    label: "SHORT BREAK",
    defaultDuration: 5,
    presets: [5, 10],
    color: "var(--color-yellow)",
    colorLight: "var(--color-yellow-light)",
    badge: "Short Break",
    companionState: "BREAK"
  },
  long_break: {
    id: "long_break",
    label: "LONG BREAK",
    defaultDuration: 15,
    presets: [15, 30],
    color: "var(--color-yellow-dark)",
    colorLight: "var(--color-yellow-light)",
    badge: "Long Break",
    companionState: "BREAK"
  }
};

export const DEFAULT_FOCUS_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreak: false,
  autoStartFocus: false,
  soundEnabled: true
};

// Convert seconds into MM:SS format
export function formatTimerDigits(totalSeconds) {
  const safeSec = Math.max(0, Math.floor(totalSeconds || 0));
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Convert minutes into human readable "1h 15m" or "25m"
export function formatMinutesHuman(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return "0m";
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}m`;
}

// Check if a date string is from today
export function isTodayDate(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

// Subtle retro 8-bit audio chime synthesizer
export function playFocusChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    // Pleasant 3-note ascending retro arpeggio: C5 -> E5 -> G5
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.26);
    });
  } catch (err) {
    console.warn("Audio chime playback error:", err);
  }
}
