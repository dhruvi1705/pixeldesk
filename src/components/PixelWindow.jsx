import React, { useState, useRef, useEffect } from "react";

export function PixelWindow({
  id,
  title,
  icon,
  children,
  zIndex,
  isActive,
  isMinimized,
  initialPosition = { x: 80, y: 60 },
  defaultWidth = 480,
  onFocus,
  onClose,
  onMinimize
}) {
  const [position, setPosition] = useState(initialPosition);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const windowRef = useRef(null);

  // Bring to front on click
  const handleMouseDown = () => {
    onFocus(id);
  };

  // Dragging logic for window header on desktop
  const handleHeaderMouseDown = (e) => {
    if (isMaximized) return;
    // Don't drag if clicking buttons
    if (e.target.closest("button")) return;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y
    };
    onFocus(id);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      // Constrain inside viewport
      const newX = Math.max(10, Math.min(window.innerWidth - 120, dragStartRef.current.posX + deltaX));
      const newY = Math.max(45, Math.min(window.innerHeight - 80, dragStartRef.current.posY + deltaY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (isMinimized) {
    return null;
  }

  return (
    <article
      ref={windowRef}
      role="dialog"
      aria-label={title}
      onMouseDown={handleMouseDown}
      className={`pixel-window animate-window-pop ${isActive ? "active-window" : "inactive-window"} ${
        isMaximized ? "maximized-window" : ""
      }`}
      style={{
        position: "absolute",
        zIndex: zIndex,
        ...(isMaximized
          ? {
              top: "44px",
              left: "12px",
              right: "12px",
              bottom: "74px",
              width: "auto",
              height: "auto"
            }
          : {
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: `${defaultWidth}px`,
              maxWidth: "calc(100vw - 24px)",
              maxHeight: "calc(100vh - 120px)"
            }),
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--surface)",
        border: "2px solid var(--border)",
        boxShadow: isActive ? "var(--pixel-shadow-lg)" : "var(--pixel-shadow)",
        filter: isActive ? "none" : "brightness(0.97)",
        borderRadius: "0px",
        transition: isDragging ? "none" : "box-shadow 0.15s ease, filter 0.15s ease"
      }}
    >
      {/* Window Title Bar (Deep Navy when active, Warm Cream panel when inactive) */}
      <header
        onMouseDown={handleHeaderMouseDown}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          backgroundColor: isActive ? "var(--color-navy)" : "var(--window-header-inactive)",
          color: isActive ? "var(--color-cream)" : "var(--window-header-inactive-text)",
          borderBottom: "2px solid var(--border)",
          cursor: isMaximized ? "default" : "grab",
          userSelect: "none"
        }}
        className="window-header"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
          {/* Active window indicator pill (Teal) */}
          <span
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: isActive ? "var(--color-teal)" : "var(--border-subtle)",
              display: "inline-block",
              border: "1px solid var(--color-navy-dark)"
            }}
            aria-hidden="true"
          />
          <span style={{ fontSize: "14px" }}>{icon}</span>
          <h2
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              margin: 0,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
          >
            {title}
          </h2>
        </div>

        {/* Action Controls: Minimize, Maximize, Close */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* Minimize */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(id);
            }}
            aria-label="Minimize Window"
            title="Minimize"
            className="win-btn win-btn-minimize"
            style={{
              width: "22px",
              height: "20px",
              padding: "0",
              backgroundColor: "var(--surface)",
              color: "var(--text-primary)",
              border: "1.5px solid var(--border)",
              boxShadow: "1px 1px 0 var(--shadow)",
              cursor: "pointer",
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ─
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            aria-label={isMaximized ? "Restore Window" : "Maximize Window"}
            title={isMaximized ? "Restore" : "Maximize"}
            className="win-btn win-btn-maximize"
            style={{
              width: "22px",
              height: "20px",
              padding: "0",
              backgroundColor: "var(--surface)",
              color: "var(--text-primary)",
              border: "1.5px solid var(--border)",
              boxShadow: "1px 1px 0 var(--shadow)",
              cursor: "pointer",
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isMaximized ? "❐" : "□"}
          </button>

          {/* Close Control: Coral (#E76F51) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            aria-label="Close Window"
            title="Close"
            className="win-btn win-btn-close"
            style={{
              width: "22px",
              height: "20px",
              padding: "0",
              backgroundColor: "var(--color-coral)",
              color: "#ffffff",
              border: "1.5px solid var(--border)",
              boxShadow: "1px 1px 0 var(--shadow)",
              cursor: "pointer",
              fontFamily: "var(--font-pixel)",
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>
      </header>

      {/* Window Content Area (Warm Cream Surface with Deep Navy Text) */}
      <section
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          color: "var(--text-primary)",
          fontSize: "14px",
          lineHeight: 1.5,
          backgroundColor: "var(--surface)"
        }}
        className="window-body"
      >
        {children}
      </section>
    </article>
  );
}
