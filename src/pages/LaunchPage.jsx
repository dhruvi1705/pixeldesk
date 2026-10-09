import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../utils/authService";

export function LaunchPage() {
  const navigate = useNavigate();

  // Boot sequence steps
  const bootLogs = [
    "> POWER ON ... SYSTEM OK",
    "> LOADING DESKTOP ENVIRONMENT",
    "> CHECKING PIXEL MODULES [TASKS, NOTES, FOCUS]",
    "> READY"
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const bootComplete = currentStep >= bootLogs.length;

  // Timed typewriter boot sequence (fast & snappy: ~400ms per step)
  useEffect(() => {
    if (currentStep < bootLogs.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [currentStep, bootLogs.length]);

  // Allow clicking anywhere to skip boot sequence
  const handleFastForward = () => {
    setCurrentStep(bootLogs.length);
  };

  return (
    <main
      className="pixel-page-transition"
      onClick={!bootComplete ? handleFastForward : undefined}
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        userSelect: "none",
        cursor: !bootComplete ? "pointer" : "default"
      }}
    >
      {/* Background Tiled Grid */}
      <div className="pixel-desktop-wallpaper" aria-hidden="true" />

      {/* Main Boot Frame */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "460px",
          width: "100%",
          zIndex: 5,
          position: "relative"
        }}
      >
        {/* Top Header: Brand Name */}
        <h1
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "20px",
            letterSpacing: "1.5px",
            color: "var(--color-cream)",
            marginBottom: "8px",
            textShadow: "2px 2px 0px var(--shadow)"
          }}
        >
          PIXELDESK
        </h1>

        <p
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "22px",
            color: "var(--color-teal)",
            marginBottom: "20px",
            letterSpacing: "0.5px"
          }}
        >
          Your little digital workspace.
        </p>

        {/* Pixel Art Computer / Monitor Illustration */}
        <div
          style={{
            width: "96px",
            height: "90px",
            backgroundColor: "var(--surface)",
            border: "3px solid var(--border)",
            boxShadow: "var(--pixel-shadow)",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            position: "relative"
          }}
          aria-hidden="true"
        >
          {/* Inner Screen Surface */}
          <div
            style={{
              width: "100%",
              height: "56px",
              backgroundColor: "var(--color-navy-dark)",
              border: "2px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Monitor glow & scanline */}
            <div
              style={{
                fontSize: "26px",
                lineHeight: 1
              }}
            >
              {bootComplete ? "🖥️" : "⏳"}
            </div>
            {/* Blinking cursor in corner */}
            <span
              style={{
                position: "absolute",
                bottom: "4px",
                right: "6px",
                width: "5px",
                height: "8px",
                backgroundColor: bootComplete ? "var(--color-teal)" : "var(--color-yellow)",
                animation: "twinkle 1s steps(2, start) infinite"
              }}
            />
          </div>

          {/* Monitor Base Stand */}
          <div
            style={{
              width: "36px",
              height: "6px",
              backgroundColor: "var(--surface-dark)",
              border: "1.5px solid var(--border)"
            }}
          />
        </div>

        {/* Terminal Boot Sequence Console */}
        <div
          style={{
            width: "100%",
            backgroundColor: "var(--color-navy-dark)",
            border: "2px solid var(--border-subtle)",
            boxShadow: "2px 2px 0 var(--shadow)",
            padding: "12px 14px",
            textAlign: "left",
            fontFamily: "var(--font-retro)",
            fontSize: "17px",
            lineHeight: 1.4,
            color: "var(--color-cream)",
            marginBottom: "22px",
            minHeight: "110px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
          aria-live="polite"
        >
          {bootLogs.slice(0, currentStep).map((log, index) => {
            const isLast = index === currentStep - 1;
            const isReady = log.includes("READY");
            return (
              <div
                key={index}
                style={{
                  color: isReady
                    ? "var(--color-teal)"
                    : isLast && !bootComplete
                    ? "var(--color-yellow)"
                    : "var(--color-cream)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>{log}</span>
                {isLast && !bootComplete && (
                  <span
                    style={{
                      width: "6px",
                      height: "12px",
                      backgroundColor: "var(--color-yellow)",
                      display: "inline-block"
                    }}
                  />
                )}
              </div>
            );
          })}

          {!bootComplete && currentStep === 0 && (
            <div style={{ color: "var(--color-yellow)" }}>INITIALIZING SYSTEM...</div>
          )}

          {!bootComplete && (
            <div
              style={{
                marginTop: "6px",
                fontSize: "13px",
                color: "var(--desktop-text-muted)",
                fontFamily: "var(--font-pixel)"
              }}
            >
              [click anywhere to skip boot]
            </div>
          )}
        </div>

        {/* Action Controls when Boot is Complete */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            opacity: bootComplete ? 1 : 0.4,
            pointerEvents: bootComplete ? "auto" : "none",
            transition: "opacity 0.25s ease"
          }}
        >
          {/* Main Enter Button (Coral #E76F51) */}
          <button
            type="button"
            onClick={() => navigate(authService.isAuthenticated() ? "/desktop" : "/login")}
            className="pixel-button pixel-button-primary"
            style={{
              width: "100%",
              maxWidth: "280px",
              padding: "12px 18px",
              fontSize: "11px",
              letterSpacing: "0.5px"
            }}
            disabled={!bootComplete}
          >
            [ ENTER PIXELDESK ]
          </button>
        </div>

        {/* Footer info badge */}
        <div
          style={{
            marginTop: "24px",
            fontFamily: "var(--font-retro)",
            fontSize: "15px",
            color: "var(--desktop-text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>v0.1 Preview</span>
          <span>•</span>
          <span>Retro Productivity Workspace</span>
        </div>
      </div>
    </main>
  );
}
