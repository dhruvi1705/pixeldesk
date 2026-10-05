import { useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "pixeldesk_notes";

const INITIAL_STARTER_NOTES = [
  {
    id: "note_daa_algorithms",
    title: "DAA Important Topics",
    content: "Divide and conquer algorithms:\n- Merge sort & Quick sort recurrence relations\n- Master Theorem cases: T(n) = aT(n/b) + f(n)\n- Dynamic Programming: 0/1 Knapsack & Matrix Chain Multiplication\n- Greedy strategy vs Dynamic programming trade-offs",
    tags: ["Study", "Ideas"],
    accent: "lavender",
    pinned: true,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "note_cloud_architecture",
    title: "Cloud Architecture Notes",
    content: "Core Virtualization and Microservices:\n- Container isolation vs Hypervisor VM\n- Horizontal scaling with load balancer health checks\n- S3 storage buckets with lifecycle policies\n- Stateless API service design with JWT sessions",
    tags: ["Work", "Project"],
    accent: "teal",
    pinned: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "note_pixeldesk_ideas",
    title: "PixelDesk Feature Ideas",
    content: "Retro desktop brainstorm:\n- Monospace code block highlighter\n- Export notes as .txt or .md files\n- Sticky notes pinboard on the desktop wallpaper\n- Retro font switcher in settings",
    tags: ["Ideas"],
    accent: "yellow",
    pinned: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export function useNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to read notes from localStorage:", err);
    }
    return INITIAL_STARTER_NOTES;
  });

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Persist immediately on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (err) {
      console.error("Failed to save notes to localStorage:", err);
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

  const createNote = useCallback((noteData) => {
    const trimmedTitle = (noteData.title || "").trim();
    const trimmedContent = (noteData.content || "").trim();

    if (!trimmedTitle) {
      return { success: false, error: "Note title is required." };
    }
    if (!trimmedContent) {
      return { success: false, error: "Note content is required." };
    }

    const newNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
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
    return { success: true, note: newNote };
  }, []);

  const updateNote = useCallback((id, updates) => {
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
            createdAt: n.createdAt, // Preserve original creation timestamp
            updatedAt: new Date().toISOString()
          };
          return updatedNote;
        }
        return n;
      })
    );

    if (updatedNote) {
      emitNoteEvent("noteUpdated", updatedNote);
      return { success: true, note: updatedNote };
    }
    return { success: false, error: "Note not found." };
  }, []);

  const togglePin = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextPinned = !n.pinned;
          const updated = {
            ...n,
            pinned: nextPinned,
            updatedAt: new Date().toISOString()
          };
          emitNoteEvent("notePinnedToggle", updated);
          return updated;
        }
        return n;
      })
    );
  }, []);

  const deleteNote = useCallback((id) => {
    let deletedNote = null;
    setNotes((prev) => {
      deletedNote = prev.find((n) => n.id === id);
      return prev.filter((n) => n.id !== id);
    });
    if (deletedNote) {
      emitNoteEvent("noteDeleted", deletedNote);
    }
  }, []);

  const loadStarterNotes = useCallback(() => {
    setNotes(INITIAL_STARTER_NOTES);
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
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    loadStarterNotes
  };
}
