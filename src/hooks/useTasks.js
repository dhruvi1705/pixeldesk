import { useState, useEffect, useCallback, useMemo } from "react";
import { getLocalDateString } from "../data/taskCategories";

const STORAGE_KEY = "pixeldesk_tasks";

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to read tasks from localStorage:", err);
    }
    return [];
  });

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Failed to save tasks to localStorage:", err);
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

  const createTask = useCallback((taskData) => {
    const trimmedTitle = (taskData.title || "").trim();
    if (!trimmedTitle) {
      return { success: false, error: "Task title is required." };
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: trimmedTitle,
      description: (taskData.description || "").trim(),
      dueDate: taskData.dueDate || "",
      priority: taskData.priority || "Medium",
      category: taskData.category || "Other",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
    emitTaskEvent("taskCreated", newTask);
    return { success: true, task: newTask };
  }, []);

  const updateTask = useCallback((id, updates) => {
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
      return { success: true, task: updatedTask };
    }
    return { success: false, error: "Task not found." };
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          const updated = {
            ...t,
            completed: nextCompleted,
            updatedAt: new Date().toISOString()
          };
          emitTaskEvent(nextCompleted ? "taskCompleted" : "taskUncompleted", updated);
          return updated;
        }
        return t;
      })
    );
  }, []);

  const deleteTask = useCallback((id) => {
    let deletedTask = null;
    setTasks((prev) => {
      deletedTask = prev.find((t) => t.id === id);
      return prev.filter((t) => t.id !== id);
    });
    if (deletedTask) {
      emitTaskEvent("taskDeleted", deletedTask);
    }
  }, []);

  const loadStarterTasks = useCallback(() => {
    const today = getLocalDateString();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = getLocalDateString(tomorrowDate);

    const starterData = [
      {
        id: `task_${Date.now()}_1`,
        title: "Finish project documentation",
        description: "Review system architecture diagrams and setup instructions.",
        dueDate: today,
        priority: "High",
        category: "Study",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `task_${Date.now()}_2`,
        title: "Submit assignment",
        description: "Submit PDF report to student workspace portal.",
        dueDate: today,
        priority: "Medium",
        category: "Work",
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `task_${Date.now()}_3`,
        title: "Prepare presentation",
        description: "Draft 8-bit slides for the team demo showcase.",
        dueDate: tomorrow,
        priority: "Low",
        category: "Personal",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setTasks(starterData);
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
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    loadStarterTasks
  };
}
