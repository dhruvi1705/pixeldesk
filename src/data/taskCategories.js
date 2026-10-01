export const TASK_CATEGORIES = [
  { id: "Study", label: "Study", icon: "📚", color: "var(--color-teal)" },
  { id: "Work", label: "Work", icon: "💼", color: "var(--color-navy)" },
  { id: "Personal", label: "Personal", icon: "🏠", color: "var(--color-lavender)" },
  { id: "Other", label: "Other", icon: "📌", color: "var(--color-yellow)" }
];

export const TASK_PRIORITIES = [
  { id: "Low", label: "Low", badge: "LOW", color: "var(--color-lavender)", sortOrder: 1 },
  { id: "Medium", label: "Medium", badge: "MED", color: "var(--color-yellow)", sortOrder: 2 },
  { id: "High", label: "High", badge: "HIGH", color: "var(--color-coral)", sortOrder: 3 }
];

export const TASK_FILTERS = [
  { id: "ALL", label: "ALL" },
  { id: "TODAY", label: "TODAY" },
  { id: "UPCOMING", label: "UPCOMING" },
  { id: "COMPLETED", label: "COMPLETED" }
];

// Helper to get local date as YYYY-MM-DD
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Relative human date helper
export function formatTaskDueDate(dueDateString) {
  if (!dueDateString) return null;
  const todayStr = getLocalDateString();
  
  if (dueDateString === todayStr) {
    return { text: "Today", isToday: true, isOverdue: false, isUpcoming: false };
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrow);
  if (dueDateString === tomorrowStr) {
    return { text: "Tomorrow", isToday: false, isOverdue: false, isUpcoming: true };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);
  if (dueDateString === yesterdayStr) {
    return { text: "Yesterday", isToday: false, isOverdue: true, isUpcoming: false };
  }

  if (dueDateString < todayStr) {
    return { text: dueDateString, isToday: false, isOverdue: true, isUpcoming: false };
  }

  return { text: dueDateString, isToday: false, isOverdue: false, isUpcoming: true };
}
