/**
 * PixelDesk User-Scoped Storage Utility
 * Prevents cross-user data leakage by namespacing client-side storage keys
 * with the currently authenticated user's unique ID.
 */

import { authService } from "./authService";

export function getScopedKey(baseKey) {
  const user = authService.getStoredUser();
  const userId = user && user.id ? user.id : "anonymous";
  return `pixeldesk_u_${userId}_${baseKey}`;
}

export const scopedStorage = {
  getItem(baseKey) {
    try {
      const key = getScopedKey(baseKey);
      return localStorage.getItem(key);
    } catch (err) {
      console.warn(`[scopedStorage] Failed to read ${baseKey}:`, err);
      return null;
    }
  },

  setItem(baseKey, value) {
    try {
      const key = getScopedKey(baseKey);
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    } catch (err) {
      console.error(`[scopedStorage] Failed to write ${baseKey}:`, err);
    }
  },

  removeItem(baseKey) {
    try {
      const key = getScopedKey(baseKey);
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[scopedStorage] Failed to remove ${baseKey}:`, err);
    }
  },
};
