import { useState, useEffect, useCallback, useMemo } from "react";
import { getLocalDateString } from "../data/taskCategories";
import { scopedStorage } from "../utils/storage";
import { apiClient } from "../utils/apiClient";

const STORAGE_KEY = "tasks";

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = scopedStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to read tasks from scopedStorage:", err);
    }
    return [];
  });

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sync tasks from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchTasks() {
      setIsLoading(true);
      try {
        const remoteTasks = await apiClient.tasks.list();
        if (isMounted && Array.isArray(remoteTasks)) {
          // Normalize remote snake_case fields to camelCase for UI compatibility
          const normalized = remoteTasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            dueDate: t.due_date || "",
            priority: t.priority || "Medium",
            category: t.category || "Other",
            completed: Boolean(t.completed),
            createdAt: t.created_at,
            updatedAt: t.updated_at,
          }));
          setTasks(normalized);
          scopedStorage.setItem(STORAGE_KEY, normalized);
        }
      } catch (err) {
        console.warn("Backend tasks sync unavailable; using local cache:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist to user-scoped storage whenever tasks change
  useEffect(() => {
    try {
      scopedStorage.setItem(STORAGE_KEY, tasks);
    } catch (err) {
      console.error("Failed to save tasks to scopedStorage:", err);
    }
  }, [tasks]);

  // Dispatch companion-ready events
  const emitTaskEvent = (action, task) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("pixeldesk_task_event", {
          detail: { action, task, timestamp: new Date().toISOString() }
        })
      );
    }
  };

  const createTask = useCallback(async (taskData) => {
    const trimmedTitle = (taskData.title || "").trim();
    if (!trimmedTitle) {
      return { success: false, error: "Task title is required." };
    }

    const tempId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newTask = {
      id: tempId,
      title: trimmedTitle,
      description: (taskData.description || "").trim(),
      dueDate: taskData.dueDate || "",
      priority: taskData.priority || "Medium",
      category: taskData.category || "Other",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Optimistic UI update
    setTasks((prev) => [newTask, ...prev]);
    emitTaskEvent("taskCreated", newTask);

    // Backend sync
    try {
      const created = await apiClient.tasks.create(newTask);
      if (created && created.id) {
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? { ...t, id: created.id } : t))
        );
      }
    } catch (err) {
      console.warn("Task creation saved locally, backend sync failed:", err.message);
    }

    return { success: true, task: newTask };
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    const trimmedTitle = updates.title !== undefined ? updates.title.trim() : undefined;
    if (trimmedTitle !== undefined && !trimmedTitle) {
      return { success: false, error: "Task title cannot be empty." };
    }

    let updatedTask = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          updatedTask = {
            ...t,
            ...updates,
            ...(trimmedTitle !== undefined ? { title: trimmedTitle } : {}),
            updatedAt: new Date().toISOString()
          };
          return updatedTask;
        }
        return t;
      })
    );

    if (updatedTask) {
      emitTaskEvent("taskUpdated", updatedTask);
      try {
        await apiClient.tasks.update(id, updates);
      } catch (err) {
        console.warn("Task update saved locally, backend sync failed:", err.message);
      }
      return { success: true, task: updatedTask };
    }
    return { success: false, error: "Task not found." };
  }, []);

  const toggleTask = useCallback(async (id) => {
    let nextCompleted = false;
    let updatedTask = null;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          nextCompleted = !t.completed;
          updatedTask = {
            ...t,
            completed: nextCompleted,
            updatedAt: new Date().toISOString()
          };
          return updatedTask;
        }
        return t;
      })
    );

    if (updatedTask) {
      emitTaskEvent(nextCompleted ? "taskCompleted" : "taskUncompleted", updatedTask);
      try {
        await apiClient.tasks.update(id, { completed: nextCompleted });
      } catch (err) {
        console.warn("Task toggle saved locally, backend sync failed:", err.message);
      }
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    let deletedTask = null;
    setTasks((prev) => {
      deletedTask = prev.find((t) => t.id === id);
      return prev.filter((t) => t.id !== id);
    });
    if (deletedTask) {
      emitTaskEvent("taskDeleted", deletedTask);
      try {
        await apiClient.tasks.delete(id);
      } catch (err) {
        console.warn("Task deletion performed locally, backend sync failed:", err.message);
      }
    }
  }, []);

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    const todayStr = getLocalDateString();
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      // 1. Search Query Filter
      if (query) {
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = (task.description || "").toLowerCase().includes(query);
        const catMatch = (task.category || "").toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !catMatch) {
          return false;
        }
      }

      // 2. Active Tab Filter
      if (activeFilter === "COMPLETED") {
        return task.completed;
      }
      if (activeFilter === "TODAY") {
        return task.dueDate === todayStr;
      }
      if (activeFilter === "UPCOMING") {
        return !task.completed && task.dueDate && task.dueDate > todayStr;
      }

      // "ALL"
      return true;
    });
  }, [tasks, activeFilter, searchQuery]);

  // Dynamic progress stats
  const stats = useMemo(() => {
    const todayStr = getLocalDateString();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;

    const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
    const todayTotal = todayTasks.length;
    const todayCompleted = todayTasks.filter((t) => t.completed).length;

    // Overdue count (not completed, has dueDate < today)
    const overdueCount = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr).length;

    // Use today's progress if there are tasks for today, otherwise overall progress
    const baseTotal = todayTotal > 0 ? todayTotal : total;
    const baseCompleted = todayTotal > 0 ? todayCompleted : completed;
    const percent = baseTotal > 0 ? Math.round((baseCompleted / baseTotal) * 100) : 0;

    return {
      total,
      completed,
      todayTotal,
      todayCompleted,
      overdueCount,
      percent,
      isTodayMode: todayTotal > 0
    };
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    stats,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    createTask,
    updateTask,
    toggleTask,
    deleteTask
  };
}
