import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_AVATAR_CONFIG,
  getRandomAvatarConfig,
  sanitizeAvatarConfig
} from "../data/avatarOptions";
import { scopedStorage } from "../utils/storage";

const STORAGE_KEY = "avatar";

export function useAvatar() {
  const [avatarConfig, setAvatarConfig] = useState(() => {
    try {
      const stored = scopedStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        return sanitizeAvatarConfig(parsed);
      }
    } catch (err) {
      console.warn("Failed to load saved avatar from scopedStorage:", err);
    }
    return { ...DEFAULT_AVATAR_CONFIG };
  });

  const [lastSavedConfig, setLastSavedConfig] = useState(() => {
    try {
      const stored = scopedStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        return sanitizeAvatarConfig(parsed);
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_AVATAR_CONFIG };
  });

  const [notification, setNotification] = useState(null);

  // Auto-clear notification after 3.5 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [notification]);

  const updateCategory = useCallback((category, value) => {
    setAvatarConfig((prev) => ({
      ...prev,
      [category]: value
    }));
  }, []);

  const randomize = useCallback(() => {
    const newConfig = getRandomAvatarConfig();
    setAvatarConfig(newConfig);
    setNotification({
      type: "info",
      text: "Avatar randomized!"
    });
  }, []);

  const reset = useCallback(() => {
    setAvatarConfig({ ...DEFAULT_AVATAR_CONFIG });
    setNotification({
      type: "info",
      text: "Reset to default avatar."
    });
  }, []);

  const save = useCallback(() => {
    try {
      scopedStorage.setItem(STORAGE_KEY, avatarConfig);
      setLastSavedConfig({ ...avatarConfig });
      setNotification({
        type: "success",
        text: "Avatar saved."
      });
      // Dispatch custom event so other components can listen if needed
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("pixeldesk_avatar_changed", { detail: avatarConfig }));
        window.dispatchEvent(new CustomEvent("pixeldesk_avatar_updated", { detail: avatarConfig }));
      }
      return true;
    } catch (err) {
      console.error("Failed to save avatar to scopedStorage:", err);
      setNotification({
        type: "error",
        text: "Could not save avatar."
      });
      return false;
    }
  }, [avatarConfig]);

  const isDirty = JSON.stringify(avatarConfig) !== JSON.stringify(lastSavedConfig);

  return {
    avatarConfig,
    setAvatarConfig,
    updateCategory,
    randomize,
    reset,
    save,
    notification,
    clearNotification: () => setNotification(null),
    isDirty
  };
}
