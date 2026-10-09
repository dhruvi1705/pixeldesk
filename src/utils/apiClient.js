/**
 * PixelDesk Authenticated API Client
 * Manages versioned API calls with JWT Bearer authentication,
 * error handling, and automatic expired session redirection.
 */

import { authService } from "./authService";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

async function request(endpoint, options = {}) {
  const token = authService.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    authService.logout();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();
  if (!res.ok) {
    const message = data.detail || (typeof data === "string" ? data : "API Request failed");
    throw new Error(message);
  }
  return data;
}

export const apiClient = {
  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return request(url, { method: "GET" });
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body) {
    return request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return request(endpoint, { method: "DELETE" });
  },

  // 1. Tasks API
  tasks: {
    list(params) {
      return apiClient.get("/tasks", params);
    },
    create(data) {
      return apiClient.post("/tasks", {
        id: data.id,
        title: data.title,
        description: data.description || null,
        due_date: data.dueDate || data.due_date || null,
        priority: data.priority || "Medium",
        category: data.category || "Other",
        completed: Boolean(data.completed),
      });
    },
    update(id, data) {
      const payload = {};
      if (data.title !== undefined) payload.title = data.title;
      if (data.description !== undefined) payload.description = data.description;
      if (data.dueDate !== undefined || data.due_date !== undefined) payload.due_date = data.dueDate || data.due_date;
      if (data.priority !== undefined) payload.priority = data.priority;
      if (data.category !== undefined) payload.category = data.category;
      if (data.completed !== undefined) payload.completed = data.completed;
      return apiClient.patch(`/tasks/${id}`, payload);
    },
    delete(id) {
      return apiClient.delete(`/tasks/${id}`);
    },
  },

  // 2. Notes API
  notes: {
    list(params) {
      return apiClient.get("/notes", params);
    },
    create(data) {
      return apiClient.post("/notes", {
        id: data.id,
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        accent: data.accent || "lavender",
        pinned: Boolean(data.pinned),
      });
    },
    update(id, data) {
      const payload = {};
      if (data.title !== undefined) payload.title = data.title;
      if (data.content !== undefined) payload.content = data.content;
      if (data.tags !== undefined) payload.tags = data.tags;
      if (data.accent !== undefined) payload.accent = data.accent;
      if (data.pinned !== undefined) payload.pinned = data.pinned;
      return apiClient.patch(`/notes/${id}`, payload);
    },
    delete(id) {
      return apiClient.delete(`/notes/${id}`);
    },
  },

  // 3. Calendar Events API
  calendar: {
    list(params) {
      return apiClient.get("/calendar", params);
    },
    create(data) {
      return apiClient.post("/calendar", {
        id: data.id,
        title: data.title,
        date: data.date,
        start_time: data.startTime || data.start_time || null,
        end_time: data.endTime || data.end_time || null,
        all_day: Boolean(data.allDay || data.all_day),
        category: data.category || "Other",
        description: data.description || null,
      });
    },
    update(id, data) {
      const payload = {};
      if (data.title !== undefined) payload.title = data.title;
      if (data.date !== undefined) payload.date = data.date;
      if (data.startTime !== undefined || data.start_time !== undefined) payload.start_time = data.startTime || data.start_time;
      if (data.endTime !== undefined || data.end_time !== undefined) payload.end_time = data.endTime || data.end_time;
      if (data.allDay !== undefined || data.all_day !== undefined) payload.all_day = data.allDay ?? data.all_day;
      if (data.category !== undefined) payload.category = data.category;
      if (data.description !== undefined) payload.description = data.description;
      return apiClient.patch(`/calendar/${id}`, payload);
    },
    delete(id) {
      return apiClient.delete(`/calendar/${id}`);
    },
  },

  // 4. Focus Sessions API
  focus: {
    list(params) {
      return apiClient.get("/focus", params);
    },
    log(data) {
      return apiClient.post("/focus", {
        id: data.id,
        task_id: data.taskId || data.task_id || null,
        task_title: data.taskTitle || data.task_title || null,
        duration_minutes: Number(data.durationMinutes || data.duration_minutes || 25),
        mode: data.mode || "focus",
        completed_at: data.completedAt || data.completed_at || new Date().toISOString(),
      });
    },
    delete(id) {
      return apiClient.delete(`/focus/${id}`);
    },
  },

  // 5. Finance Transactions API
  finance: {
    list(params) {
      return apiClient.get("/finance", params);
    },
    create(data) {
      return apiClient.post("/finance", {
        id: data.id,
        type: data.type,
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        description: data.description || null,
      });
    },
    update(id, data) {
      const payload = {};
      if (data.type !== undefined) payload.type = data.type;
      if (data.amount !== undefined) payload.amount = Number(data.amount);
      if (data.category !== undefined) payload.category = data.category;
      if (data.date !== undefined) payload.date = data.date;
      if (data.description !== undefined) payload.description = data.description;
      return apiClient.patch(`/finance/${id}`, payload);
    },
    delete(id) {
      return apiClient.delete(`/finance/${id}`);
    },
  },
};
