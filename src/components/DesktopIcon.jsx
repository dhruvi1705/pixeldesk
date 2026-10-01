import React from "react";

export function DesktopIcon({ app, onClick, isSelected }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(app.id);
    }
  };

  // Determine badge color role based on accentType
  const getBadgeStyle = () => {
    switch (app.accentType) {
      case "teal":
        return { backgroundColor: "var(--color-teal)", color: "#ffffff" };
      case "coral":
        return { backgroundColor: "var(--color-coral)", color: "#ffffff" };
      case "yellow":
        return { backgroundColor: "var(--color-yellow)", color: "var(--color-navy)" };
      case "lavender":
        return { backgroundColor: "var(--color-lavender)", color: "#ffffff" };
      default:
        return { backgroundColor: "var(--surface-dark)", color: "var(--text-primary)" };
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(app.id)}
      onKeyDown={handleKeyDown}
      className={`desktop-icon ${isSelected ? "selected" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "90px",
        minHeight: "88px",
        padding: "8px 2px",
        margin: "4px",
        cursor: "pointer",
        position: "relative",
        userSelect: "none",
        backgroundColor: isSelected ? "rgba(247, 241, 227, 0.14)" : "transparent",
        border: isSelected ? "2px dashed var(--color-teal)" : "2px solid transparent",
        borderRadius: "0px",
        transition: "all 0.15s ease"
      }}
      title={`${app.name} (${app.status === "ready" ? "Active" : "Coming Soon"})`}
      aria-label={`Open ${app.name} application`}
    >
      {/* Icon Graphic Container */}
      <div
        className="icon-art-box"
        style={{
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          backgroundColor: "var(--surface)",
          border: "var(--pixel-border)",
          boxShadow: "var(--pixel-shadow-sm)",
          marginBottom: "6px",
          position: "relative",
          borderRadius: "0px",
          transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.15s ease"
        }}
      >
        <span>{app.icon}</span>

        {/* Small corner badge for category / status */}
        {app.badge && (
          <span
            style={{
              position: "absolute",
              bottom: "-4px",
              right: "-6px",
              fontFamily: "var(--font-retro)",
              fontSize: "12px",
              lineHeight: 1,
              border: "1px solid var(--border)",
              padding: "1px 4px",
              borderRadius: "0px",
              ...getBadgeStyle()
            }}
          >
            {app.badge}
          </span>
        )}
      </div>

      {/* Label - Warm Cream on Navy Desktop Wallpaper */}
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "8px",
          lineHeight: 1.35,
          color: "var(--desktop-text)",
          textAlign: "center",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
          wordBreak: "keep-all",
          overflowWrap: "normal",
          padding: "2px 4px",
          backgroundColor: isSelected ? "var(--color-navy-dark)" : "transparent",
          borderRadius: "0px"
        }}
      >
        {app.name}
      </span>
    </div>
  );
}
