import { useState, useEffect, useCallback, useMemo } from "react";
import { scopedStorage } from "../utils/storage";
import { apiClient } from "../utils/apiClient";

const STORAGE_KEY = "notes";

export function useNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      const stored = scopedStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to read notes from scopedStorage:", err);
    }
    return [];
  });

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sync notes from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchNotes() {
      setIsLoading(true);
      try {
        const remoteNotes = await apiClient.notes.list();
        if (isMounted && Array.isArray(remoteNotes)) {
          const normalized = remoteNotes.map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            tags: n.tags || [],
            accent: n.accent || "lavender",
            pinned: Boolean(n.pinned),
            createdAt: n.created_at,
            updatedAt: n.updated_at,
          }));
          setNotes(normalized);
          scopedStorage.setItem(STORAGE_KEY, normalized);
        }
      } catch (err) {
        console.warn("Backend notes sync unavailable; using local cache:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchNotes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist immediately on changes to user-scoped storage
  useEffect(() => {
    try {
      scopedStorage.setItem(STORAGE_KEY, notes);
    } catch (err) {
      console.error("Failed to save notes to scopedStorage:", err);
    }
  }, [notes]);

  // Optional event dispatch for future companion/desktop integrations
  const emitNoteEvent = (action, note) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("pixeldesk_note_event", {
          detail: { action, note, timestamp: new Date().toISOString() }
        })
      );
    }
  };

  const createNote = useCallback(async (noteData) => {
    const trimmedTitle = (noteData.title || "").trim();
    const trimmedContent = (noteData.content || "").trim();

    if (!trimmedTitle) {
      return { success: false, error: "Note title is required." };
    }
    if (!trimmedContent) {
      return { success: false, error: "Note content is required." };
    }

    const tempId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newNote = {
      id: tempId,
      title: trimmedTitle.slice(0, 100),
      content: trimmedContent.slice(0, 5000),
      tags: Array.isArray(noteData.tags) ? noteData.tags.map(t => t.trim()).filter(Boolean) : [],
      accent: noteData.accent || "lavender",
      pinned: Boolean(noteData.pinned),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes((prev) => [newNote, ...prev]);
    emitNoteEvent("noteCreated", newNote);

    try {
      const created = await apiClient.notes.create(newNote);
      if (created && created.id) {
        setNotes((prev) =>
          prev.map((n) => (n.id === tempId ? { ...n, id: created.id } : n))
        );
      }
    } catch (err) {
      console.warn("Note creation saved locally, backend sync failed:", err.message);
    }

    return { success: true, note: newNote };
  }, []);

  const updateNote = useCallback(async (id, updates) => {
    const trimmedTitle = updates.title !== undefined ? updates.title.trim() : undefined;
    const trimmedContent = updates.content !== undefined ? updates.content.trim() : undefined;

    if (trimmedTitle !== undefined && !trimmedTitle) {
      return { success: false, error: "Note title cannot be empty." };
    }
    if (trimmedContent !== undefined && !trimmedContent) {
      return { success: false, error: "Note content cannot be empty." };
    }

    let updatedNote = null;
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          updatedNote = {
            ...n,
            ...updates,
            ...(trimmedTitle !== undefined ? { title: trimmedTitle.slice(0, 100) } : {}),
            ...(trimmedContent !== undefined ? { content: trimmedContent.slice(0, 5000) } : {}),
            ...(updates.tags !== undefined
              ? { tags: Array.isArray(updates.tags) ? updates.tags.map(t => t.trim()).filter(Boolean) : [] }
              : {}),
            createdAt: n.createdAt,
            updatedAt: new Date().toISOString()
          };
          return updatedNote;
        }
        return n;
      })
    );

    if (updatedNote) {
      emitNoteEvent("noteUpdated", updatedNote);
      try {
        await apiClient.notes.update(id, updates);
      } catch (err) {
        console.warn("Note update saved locally, backend sync failed:", err.message);
      }
      return { success: true, note: updatedNote };
    }
    return { success: false, error: "Note not found." };
  }, []);

  const togglePin = useCallback(async (id) => {
    let nextPinned = false;
    let updatedNote = null;

    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          nextPinned = !n.pinned;
          updatedNote = {
            ...n,
            pinned: nextPinned,
            updatedAt: new Date().toISOString()
          };
          return updatedNote;
        }
        return n;
      })
    );

    if (updatedNote) {
      emitNoteEvent("notePinnedToggle", updatedNote);
      try {
        await apiClient.notes.update(id, { pinned: nextPinned });
      } catch (err) {
        console.warn("Note pin toggle saved locally, backend sync failed:", err.message);
      }
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    let deletedNote = null;
    setNotes((prev) => {
      deletedNote = prev.find((n) => n.id === id);
      return prev.filter((n) => n.id !== id);
    });
    if (deletedNote) {
      emitNoteEvent("noteDeleted", deletedNote);
      try {
        await apiClient.notes.delete(id);
      } catch (err) {
        console.warn("Note deletion performed locally, backend sync failed:", err.message);
      }
    }
  }, []);

  // Filter and search logic with strict pinned precedence
  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = notes.filter((note) => {
      // 1. Search Query Filter (title, content, tags)
      if (query) {
        const titleMatch = note.title.toLowerCase().includes(query);
        const contentMatch = (note.content || "").toLowerCase().includes(query);
        const tagsMatch = (note.tags || []).some((t) => t.toLowerCase().includes(query));
        if (!titleMatch && !contentMatch && !tagsMatch) {
          return false;
        }
      }

      // 2. Active Filter tab (ALL vs PINNED)
      if (activeFilter === "PINNED" && !note.pinned) {
        return false;
      }

      // 3. Tag Filter (if a tag filter is active)
      if (selectedTag && !(note.tags || []).includes(selectedTag)) {
        return false;
      }

      return true;
    });

    // Pinned notes appear first, then sorted by updatedAt descending
    return filtered.sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, activeFilter, selectedTag, searchQuery]);

  // Stats for badges & counts
  const stats = useMemo(() => {
    const total = notes.length;
    const pinned = notes.filter((n) => n.pinned).length;

    // Collect all unique tags and their counts
    const tagCounts = {};
    notes.forEach((n) => {
      (n.tags || []).forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });

    return {
      total,
      pinned,
      tagCounts
    };
  }, [notes]);

  return {
    notes,
    filteredNotes,
    stats,
    activeFilter,
    setActiveFilter,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    togglePin
  };
}
