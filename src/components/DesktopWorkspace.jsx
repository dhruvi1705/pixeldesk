import React, { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Desktop } from "./Desktop";
import { Dock } from "./Dock";
import { WindowManager } from "./WindowManager";

export function DesktopWorkspace() {
  // 1. Persistent User Settings
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("pixeldesk_theme");
    if (!saved || saved === "pink") return "default";
    return saved;
  });

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem("pixeldesk_animations");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [clockFormat, setClockFormat] = useState(() => {
    return localStorage.getItem("pixeldesk_clock_format") || "12h";
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem("pixeldesk_reduced_motion");
    if (saved !== null) return JSON.parse(saved);
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // Sync settings with localStorage and HTML document attributes
  useEffect(() => {
    localStorage.setItem("pixeldesk_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("pixeldesk_animations", JSON.stringify(animationsEnabled));
    if (!animationsEnabled) {
      document.documentElement.classList.add("animations-off");
    } else {
      document.documentElement.classList.remove("animations-off");
    }
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem("pixeldesk_clock_format", clockFormat);
  }, [clockFormat]);

  useEffect(() => {
    localStorage.setItem("pixeldesk_reduced_motion", JSON.stringify(reducedMotion));
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }, [reducedMotion]);

  // 2. Window Management State
  const [zIndexCounter, setZIndexCounter] = useState(20);
  const [activeWindowId, setActiveWindowId] = useState("welcome");

  // Initial state: Welcome window is open on load
  const [openWindows, setOpenWindows] = useState(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;
    const initialPos = isMobile
      ? { x: 12, y: 52 }
      : {
          x: Math.max(20, Math.floor((typeof window !== "undefined" ? window.innerWidth : 1000) / 2 - 240)),
          y: 65
        };

    return [
      {
        id: "welcome",
        zIndex: 10,
        minimized: false,
        position: initialPos
      }
    ];
  });

  // Focus a window and bring it to top
  const handleFocusWindow = (id) => {
    setZIndexCounter((prev) => {
      const nextZ = prev + 1;
      setOpenWindows((wins) =>
        wins.map((w) => (w.id === id ? { ...w, zIndex: nextZ, minimized: false } : w))
      );
      return nextZ;
    });
    setActiveWindowId(id);
  };

  // Open an app (or bring it to front if already open)
  const handleOpenApp = (id) => {
    setOpenWindows((currentWindows) => {
      const existing = currentWindows.find((w) => w.id === id);
      const nextZ = zIndexCounter + 1;
      setZIndexCounter(nextZ);
      setActiveWindowId(id);

      if (existing) {
        return currentWindows.map((w) =>
          w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w
        );
      }

      // Calculate staggered placement for new windows
      const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;
      const count = currentWindows.length;
      const offset = (count % 6) * 26;

      const newPos = isMobile
        ? { x: 12, y: 52 }
        : {
            x: Math.min(window.innerWidth - 380, Math.max(30, 80 + offset)),
            y: Math.min(window.innerHeight - 300, Math.max(55, 65 + offset))
          };

      return [
        ...currentWindows,
        {
          id,
          zIndex: nextZ,
          minimized: false,
          position: newPos
        }
      ];
    });
  };

  // Close a window
  const handleCloseWindow = (id) => {
    setOpenWindows((currentWindows) => {
      const remaining = currentWindows.filter((w) => w.id !== id);
      if (activeWindowId === id) {
        const visible = remaining.filter((w) => !w.minimized);
        if (visible.length > 0) {
          const topWindow = visible.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visible[0]);
          setActiveWindowId(topWindow.id);
        } else {
          setActiveWindowId(null);
        }
      }
      return remaining;
    });
  };

  // Minimize a window
  const handleMinimizeWindow = (id) => {
    setOpenWindows((currentWindows) =>
      currentWindows.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );

    const visibleRemaining = openWindows.filter((w) => w.id !== id && !w.minimized);
    if (visibleRemaining.length > 0) {
      const topRemaining = visibleRemaining.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), visibleRemaining[0]);
      setActiveWindowId(topRemaining.id);
    } else {
      setActiveWindowId(null);
    }
  };

  // Toggle app from dock
  const handleToggleApp = (id) => {
    const existing = openWindows.find((w) => w.id === id);
    if (existing && !existing.minimized && activeWindowId === id) {
      handleMinimizeWindow(id);
    } else {
      handleOpenApp(id);
    }
  };

  // Reset defaults
  const handleResetDefaults = () => {
    setTheme("default");
    setAnimationsEnabled(true);
    setClockFormat("12h");
    setReducedMotion(false);
  };

  return (
    <div
      className="pixeldesk-app pixel-page-transition"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Top System Bar */}
      <TopBar
        clockFormat={clockFormat}
        onOpenApp={handleOpenApp}
        currentTheme={theme}
      />

      {/* Main Desktop Canvas with Icons and Wallpaper */}
      <Desktop
        onOpenApp={handleOpenApp}
        animationsEnabled={animationsEnabled && !reducedMotion}
      />

      {/* Layered Window Manager */}
      <WindowManager
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        onFocusWindow={handleFocusWindow}
        onCloseWindow={handleCloseWindow}
        onMinimizeWindow={handleMinimizeWindow}
        theme={theme}
        setTheme={setTheme}
        animationsEnabled={animationsEnabled}
        setAnimationsEnabled={setAnimationsEnabled}
        clockFormat={clockFormat}
        setClockFormat={setClockFormat}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        onResetDefaults={handleResetDefaults}
        onOpenApp={handleOpenApp}
      />

      {/* Bottom Dock */}
      <Dock
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        onToggleApp={handleToggleApp}
      />
    </div>
  );
}
