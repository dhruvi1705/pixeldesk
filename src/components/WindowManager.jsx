import React from "react";
import { PixelWindow } from "./PixelWindow";
import { WelcomeWindow } from "./WelcomeWindow";
import { SettingsWindow } from "./SettingsWindow";
import { HelpWindow } from "./HelpWindow";
import { ComingSoonWindow } from "./ComingSoonWindow";
import { AvatarStudio } from "./avatar/AvatarStudio";
import { TaskWindow } from "./tasks/TaskWindow";
import { APPS } from "../data/apps";

export function WindowManager({
  openWindows,
  activeWindowId,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  // Settings props
  theme,
  setTheme,
  animationsEnabled,
  setAnimationsEnabled,
  clockFormat,
  setClockFormat,
  reducedMotion,
  setReducedMotion,
  onResetDefaults,
  onOpenApp
}) {
  return (
    <div className="window-manager-container" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {openWindows.map((win) => {
        const app = APPS.find((a) => a.id === win.id);
        if (!app) return null;

        const isActive = activeWindowId === win.id;

        // Render appropriate window body
        let content = null;
        let defaultWidth = 460;

        if (win.id === "welcome") {
          defaultWidth = 480;
          content = (
            <WelcomeWindow
              onClose={() => onCloseWindow("welcome")}
              onOpenSettings={() => onOpenApp("settings")}
            />
          );
        } else if (win.id === "settings") {
          defaultWidth = 440;
          content = (
            <SettingsWindow
              theme={theme}
              setTheme={setTheme}
              animationsEnabled={animationsEnabled}
              setAnimationsEnabled={setAnimationsEnabled}
              clockFormat={clockFormat}
              setClockFormat={setClockFormat}
              reducedMotion={reducedMotion}
              setReducedMotion={setReducedMotion}
              onResetDefaults={onResetDefaults}
            />
          );
        } else if (win.id === "avatar") {
          defaultWidth = 640;
          content = (
            <AvatarStudio
              onClose={() => onCloseWindow("avatar")}
            />
          );
        } else if (win.id === "tasks") {
          defaultWidth = 520;
          content = (
            <TaskWindow
              onClose={() => onCloseWindow("tasks")}
            />
          );
        } else if (win.id === "help") {
          defaultWidth = 440;
          content = <HelpWindow />;
        } else {
          // Placeholder apps (tasks, notes, calendar, focus, finance, analytics, ai)
          defaultWidth = 380;
          content = (
            <ComingSoonWindow
              app={app}
              onClose={() => onCloseWindow(win.id)}
            />
          );
        }

        return (
          <div key={win.id} style={{ pointerEvents: "auto" }}>
            <PixelWindow
              id={win.id}
              title={app.name}
              icon={app.icon}
              zIndex={win.zIndex}
              isActive={isActive}
              isMinimized={win.minimized}
              initialPosition={win.position}
              defaultWidth={defaultWidth}
              onFocus={onFocusWindow}
              onClose={onCloseWindow}
              onMinimize={onMinimizeWindow}
            >
              {content}
            </PixelWindow>
          </div>
        );
      })}
    </div>
  );
}
