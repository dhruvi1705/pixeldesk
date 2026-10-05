export const NOTE_ACCENTS = [
  {
    id: "lavender",
    name: "Lavender",
    color: "#8D86C9",
    bgLight: "#F1EFF9",
    border: "#7870B8"
  },
  {
    id: "teal",
    name: "Teal",
    color: "#4E9F9A",
    bgLight: "#E6F3F2",
    border: "#438A85"
  },
  {
    id: "coral",
    name: "Coral",
    color: "#E76F51",
    bgLight: "#FDF0ED",
    border: "#D45D3F"
  },
  {
    id: "yellow",
    name: "Yellow",
    color: "#E9C46A",
    bgLight: "#FDF8EB",
    border: "#D4AF53"
  },
  {
    id: "cream",
    name: "Cream",
    color: "#F7F1E3",
    bgLight: "#FFFFFF",
    border: "#EDE5D3"
  }
];

export const PRESET_TAGS = [
  "Study",
  "Work",
  "Personal",
  "Ideas",
  "Project",
  "Other"
];

export const NOTE_FILTERS = [
  { id: "ALL", label: "ALL", icon: "📑" },
  { id: "PINNED", label: "PINNED", icon: "📌" }
];

export function formatRelativeTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
      return "just now";
    }
    if (diffMin < 60) {
      return `${diffMin}m ago`;
    }
    if (diffHour < 24 && date.getDate() === now.getDate()) {
      return `${diffHour}h ago`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "yesterday";
    }

    if (diffDay < 7) {
      return `${diffDay}d ago`;
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  } catch {
    return "";
  }
}

export function formatDateTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  } catch {
    return "";
  }
}
