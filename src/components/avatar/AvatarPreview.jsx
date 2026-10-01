import React, { useRef, useState } from "react";
import { ASSET_MAP } from "../../data/avatarOptions";

export function AvatarPreview({ avatarConfig, size = 224, showBadges = true }) {
  const [downloading, setDownloading] = useState(false);
  const containerRef = useRef(null);

  const bgAsset = ASSET_MAP.background[avatarConfig.background];
  const skinAsset = ASSET_MAP.skin[avatarConfig.skin];
  const eyesAsset = ASSET_MAP.eyes[avatarConfig.eyes];
  const hairAsset = ASSET_MAP.hair[avatarConfig.hair];
  const outfitAsset = ASSET_MAP.outfit[avatarConfig.outfit];
  const accAsset = ASSET_MAP.accessory[avatarConfig.accessory];

  // Export composed avatar as high-res crisp PNG
  const handleExportPng = async () => {
    try {
      setDownloading(true);
      const canvas = document.createElement("canvas");
      const exportSize = 256;
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;

      // Layers in composition order
      const layersToLoad = [
        bgAsset,
        skinAsset,
        eyesAsset,
        outfitAsset,
        hairAsset,
        accAsset
      ].filter(Boolean);

      const loadedImages = await Promise.all(
        layersToLoad.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          });
        })
      );

      // Draw each layer crisp and aligned
      for (const img of loadedImages) {
        ctx.drawImage(img, 0, 0, exportSize, exportSize);
      }

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `pixeldesk-avatar-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.warn("Could not export PNG:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="avatar-preview-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        width: "100%"
      }}
    >
      {/* Pixel-art display box with Warm Cream background and Deep Navy pixel border */}
      <div
        ref={containerRef}
        className="avatar-preview-box"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: "100%",
          aspectRatio: "1 / 1",
          position: "relative",
          backgroundColor: "var(--color-cream)",
          border: "3px solid var(--border)",
          boxShadow: "var(--pixel-shadow)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none"
        }}
      >
        {/* Subtle decorative retro grid pattern */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(36, 50, 74, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(36, 50, 74, 0.05) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            pointerEvents: "none",
            zIndex: 1
          }}
        />

        {/* Decorative corner pixel brackets */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "4px",
            left: "4px",
            width: "6px",
            height: "6px",
            borderTop: "2px solid var(--border-subtle)",
            borderLeft: "2px solid var(--border-subtle)",
            pointerEvents: "none",
            zIndex: 20
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "6px",
            height: "6px",
            borderTop: "2px solid var(--border-subtle)",
            borderRight: "2px solid var(--border-subtle)",
            pointerEvents: "none",
            zIndex: 20
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "4px",
            left: "4px",
            width: "6px",
            height: "6px",
            borderBottom: "2px solid var(--border-subtle)",
            borderLeft: "2px solid var(--border-subtle)",
            pointerEvents: "none",
            zIndex: 20
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            width: "6px",
            height: "6px",
            borderBottom: "2px solid var(--border-subtle)",
            borderRight: "2px solid var(--border-subtle)",
            pointerEvents: "none",
            zIndex: 20
          }}
        />

        {/* Layer 1: Background */}
        {bgAsset && (
          <img
            src={bgAsset}
            alt=""
            aria-hidden="true"
            className="avatar-layer-img avatar-layer-bg"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
              zIndex: 2
            }}
          />
        )}

        {/* Layer 2: Skin / Base Body */}
        {skinAsset && (
          <img
            src={skinAsset}
            alt="Avatar base skin"
            className="avatar-layer-img avatar-layer-skin"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
              zIndex: 3
            }}
          />
        )}

        {/* Layer 3: Eyes */}
        {eyesAsset && (
          <img
            src={eyesAsset}
            alt="Avatar eyes"
            className="avatar-layer-img avatar-layer-eyes"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
              zIndex: 4
            }}
          />
        )}

        {/* Layer 4: Outfit */}
        {outfitAsset && (
          <img
            src={outfitAsset}
            alt="Avatar outfit"
            className="avatar-layer-img avatar-layer-outfit"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
              zIndex: 5
            }}
          />
        )}

        {/* Layer 5: Hair */}
        {hairAsset && (
          <img
            src={hairAsset}
            alt="Avatar hair"
            className="avatar-layer-img avatar-layer-hair"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
              zIndex: 6
            }}
          />
        )}

        {/* Layer 6: Accessory */}
        {accAsset && (
          <img
            src={accAsset}
            alt="Avatar accessory"
            className="avatar-layer-img avatar-layer-accessory"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
              zIndex: 7
            }}
          />
        )}
      </div>

      {/* Meta tags and export button below preview */}
      {showBadges && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: `${size}px`,
            maxWidth: "100%",
            gap: "8px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--text-secondary)"
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "var(--color-teal)",
                border: "1px solid var(--border)",
                display: "inline-block"
              }}
              aria-hidden="true"
            />
            <span>32×32 PIXELS</span>
          </div>

          <button
            type="button"
            onClick={handleExportPng}
            disabled={downloading}
            title="Download crisp 256px PNG file"
            aria-label="Export avatar as PNG"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              padding: "2px 6px",
              cursor: "pointer",
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
            className="avatar-export-btn"
          >
            <span>💾</span>
            <span>{downloading ? "EXPORTING..." : "PNG"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
