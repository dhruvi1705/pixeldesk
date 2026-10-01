import React, { useState } from "react";
import { AvatarPreview } from "./AvatarPreview";
import { AvatarCategory } from "./AvatarCategory";
import { AvatarControls } from "./AvatarControls";
import { AVATAR_CATEGORIES } from "../../data/avatarOptions";
import { useAvatar } from "../../hooks/useAvatar";

export function AvatarStudio({ onClose }) {
  const {
    avatarConfig,
    updateCategory,
    randomize,
    reset,
    save,
    notification,
    isDirty
  } = useAvatar();

  const [activeTab, setActiveTab] = useState("all");

  const visibleCategories =
    activeTab === "all"
      ? AVATAR_CATEGORIES
      : AVATAR_CATEGORIES.filter((c) => c.id === activeTab);

  return (
    <div
      className="avatar-studio-app"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "var(--font-body)",
        maxWidth: "100%"
      }}
    >
      {/* Studio Window Subtitle Banner */}
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
            "Build your little pixel identity."
          </p>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)",
              margin: "3px 0 0 0"
            }}
          >
            CUSTOM 32×32 RETRO CHARACTER COMPOSITION
          </p>
        </div>

        {/* Studio Lavender Accent Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "var(--color-lavender-light)",
            border: "1.5px solid var(--color-lavender)",
            padding: "2px 8px",
            fontFamily: "var(--font-retro)",
            fontSize: "15px",
            color: "var(--color-navy)"
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "var(--color-lavender)",
              display: "inline-block"
            }}
            aria-hidden="true"
          />
          <span>STUDIO v0.2</span>
        </div>
      </header>

      {/* Main Two-Column Studio Layout */}
      <main className="avatar-studio-layout">
        {/* Left Column: Avatar Preview */}
        <section
          aria-label="Avatar Preview"
          className="avatar-preview-column"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            minWidth: "200px"
          }}
        >
          <AvatarPreview avatarConfig={avatarConfig} size={192} />

          {/* Configuration Summary Pill Grid */}
          <div
            style={{
              width: "100%",
              maxWidth: "192px",
              backgroundColor: "var(--surface-dark)",
              border: "1px solid var(--border-subtle)",
              padding: "5px 8px",
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              lineHeight: 1.6,
              color: "var(--text-secondary)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>SKIN:</span>
              <strong style={{ color: "var(--text-primary)" }}>{avatarConfig.skin}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>HAIR:</span>
              <strong style={{ color: "var(--text-primary)" }}>{avatarConfig.hair}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>EYES:</span>
              <strong style={{ color: "var(--text-primary)" }}>{avatarConfig.eyes}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>OUTFIT:</span>
              <strong style={{ color: "var(--text-primary)" }}>{avatarConfig.outfit}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>GEAR:</span>
              <strong style={{ color: "var(--text-primary)" }}>{avatarConfig.accessory}</strong>
            </div>
          </div>
        </section>

        {/* Right Column: Customization Controls */}
        <section
          aria-label="Customization Controls"
          className="avatar-categories-column"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minWidth: "260px"
          }}
        >
          {/* Category Quick Filter Tabs */}
          <nav
            aria-label="Category Navigation"
            style={{
              display: "flex",
              gap: "4px",
              flexWrap: "wrap"
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              aria-pressed={activeTab === "all"}
              className="pixel-button pixel-button-sm"
              style={{
                backgroundColor: activeTab === "all" ? "var(--color-teal-light)" : "var(--surface)",
                borderColor: activeTab === "all" ? "var(--color-teal)" : "var(--border)",
                fontSize: "7.5px"
              }}
            >
              ALL
            </button>
            {AVATAR_CATEGORIES.map((cat) => {
              const isSelected = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  aria-pressed={isSelected}
                  className="pixel-button pixel-button-sm"
                  style={{
                    backgroundColor: isSelected ? "var(--color-teal-light)" : "var(--surface)",
                    borderColor: isSelected ? "var(--color-teal)" : "var(--border)",
                    fontSize: "7.5px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px"
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {/* List of Customization Categories */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "295px",
              overflowY: "auto",
              paddingRight: "4px"
            }}
          >
            {visibleCategories.map((cat) => (
              <AvatarCategory
                key={cat.id}
                category={cat}
                currentValue={avatarConfig[cat.id]}
                onSelect={updateCategory}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Action Controls: Randomize, Reset, Save Avatar */}
      <AvatarControls
        onRandomize={randomize}
        onReset={reset}
        onSave={save}
        isDirty={isDirty}
        notification={notification}
      />
    </div>
  );
}
