import React, { useState } from "react";
import { useFocusTimer } from "../../hooks/useFocusTimer";
import { FocusModes } from "./FocusModes";
import { FocusTimer } from "./FocusTimer";
import { FocusControls } from "./FocusControls";
import { FocusTaskSelector } from "./FocusTaskSelector";
import { FocusStats } from "./FocusStats";
import { FocusHistory } from "./FocusHistory";
import { FocusSettings } from "./FocusSettings";
import { TIMER_STATUS, FOCUS_MODES } from "../../data/focusSettings";

export function FocusWindow({ onClose: _onClose }) {
  const {
    mode,
    status,
    remainingSeconds,
    totalSeconds,
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
  } = useFocusTimer();

  const [showSettings, setShowSettings] = useState(false);

  const isRunning = status === TIMER_STATUS.RUNNING;

  const handleStartNext = () => {
    if (mode === FOCUS_MODES.FOCUS) {
      switchMode(FOCUS_MODES.SHORT_BREAK);
    } else {
      switchMode(FOCUS_MODES.FOCUS);
    }
  };

  return (
    <div
      className="focus-app-window"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "var(--font-body)",
        maxWidth: "100%"
      }}
    >
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" style={{ position: "absolute", left: "-9999px" }}>
        {announceMessage}
      </div>

      {/* Subtitle Banner Header */}
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
            "One thing at a time."
          </p>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)",
              margin: "3px 0 0 0"
            }}
          >
            {todayStats.sessionCount} COMPLETED SESSIONS TODAY ({todayStats.formattedTime})
          </p>
        </div>

        {/* Settings Toggle Button */}
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`pixel-button pixel-button-sm ${showSettings ? "pixel-button-teal" : ""}`}
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7.5px",
            padding: "3px 7px"
          }}
          aria-label="Toggle focus timer settings"
        >
          ⚙ {showSettings ? "CLOSE" : "PRESETS"}
        </button>
      </header>

      {/* Main Focus Layout */}
      <div
        className="focus-main-content-layout"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%"
        }}
      >
        {/* Mode Selector Tabs: FOCUS | SHORT BREAK | LONG BREAK */}
        <FocusModes
          currentMode={mode}
          onSelectMode={switchMode}
          disabled={isRunning}
        />

        {/* Timer Card with large digits & dynamic progress bar */}
        <FocusTimer
          mode={mode}
          status={status}
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
        />

        {/* Timer Controls: START / PAUSE / RESUME / RESET */}
        <FocusControls
          status={status}
          mode={mode}
          onStart={startTimer}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onReset={resetTimer}
          onStartNext={handleStartNext}
        />

        {/* Working on Task Selector */}
        <FocusTaskSelector
          activeTasks={activeTasks}
          selectedTask={selectedTask}
          onSelectTask={setSelectedTask}
          disabled={isRunning}
        />

        {/* Optional Collapsible Settings */}
        {showSettings && (
          <FocusSettings
            mode={mode}
            settings={settings}
            onSetDuration={setModeDuration}
            onUpdateSettings={updateSettings}
            disabled={isRunning}
          />
        )}

        {/* Bottom Section: Today's Statistics & Recent Session History */}
        <div
          className="focus-stats-history-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            alignItems: "stretch"
          }}
        >
          <FocusStats todayStats={todayStats} />
          <FocusHistory sessions={sessions} />
        </div>
      </div>
    </div>
  );
}
