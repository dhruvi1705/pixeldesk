// PixelDesk Calendar Data & Utility Constants

export const CALENDAR_CATEGORIES = [
  {
    id: "Study",
    label: "Study",
    icon: "📚",
    color: "var(--color-teal)",
    badgeColor: "var(--color-teal)",
    bgLight: "var(--color-teal-light)"
  },
  {
    id: "Work",
    label: "Work",
    icon: "💼",
    color: "var(--color-navy)",
    badgeColor: "var(--color-navy)",
    bgLight: "rgba(36, 50, 74, 0.12)"
  },
  {
    id: "Personal",
    label: "Personal",
    icon: "🏠",
    color: "var(--color-lavender)",
    badgeColor: "var(--color-lavender)",
    bgLight: "var(--color-lavender-light)"
  },
  {
    id: "Other",
    label: "Other",
    icon: "📌",
    color: "var(--color-yellow-dark)",
    badgeColor: "var(--color-yellow)",
    bgLight: "var(--color-yellow-light)"
  }
];

export const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

export const MONTH_NAMES_SHORT = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

// Helper to get local date as YYYY-MM-DD
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Format specific year, month (1-indexed), day as YYYY-MM-DD
export function formatLocalDate(year, month, day) {
  const y = String(year);
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Convert 24h "HH:MM" to 12h display e.g. "10:00 AM"
export function formatTime12h(time24) {
  if (!time24 || typeof time24 !== "string") return "";
  const parts = time24.split(":");
  let h = parseInt(parts[0], 10);
  const m = parts[1] ? parts[1].padStart(2, "0") : "00";
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

// Format time range for an event
export function formatEventTime(event) {
  if (!event) return "";
  if (event.allDay) return "ALL DAY";
  if (event.startTime && event.endTime) {
    return `${formatTime12h(event.startTime)} – ${formatTime12h(event.endTime)}`;
  }
  if (event.startTime) {
    return formatTime12h(event.startTime);
  }
  return "ALL DAY";
}

// Format selected date header label
export function formatSelectedDateTitle(dateStr) {
  if (!dateStr) return "TODAY";
  const todayStr = getLocalDateString();
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const monthShort = MONTH_NAMES_SHORT[month - 1] || "";
  const monthFull = MONTH_NAMES[month - 1] || "";

  if (dateStr === todayStr) {
    return `TODAY — ${monthShort} ${day}`;
  }

  return `${monthFull} ${day}, ${year}`;
}

// Generate the 35 or 42 grid cells for a given month (Monday-first)
export function generateMonthGrid(year, monthIndex, selectedDateStr) {
  const todayStr = getLocalDateString();
  
  // 1st day of the target month
  const firstDay = new Date(year, monthIndex, 1);
  // Monday-first offset: 0 for Mon, 1 for Tue, ..., 6 for Sun
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
  
  // Number of days in current month
  const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
  
  // Number of days in previous month
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
  
  const cells = [];
  
  // 1. Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, monthIndex - 1, dayNum);
    const dateStr = getLocalDateString(prevMonthDate);
    cells.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr
    });
  }
  
  // 2. Current month days
  for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
    const dateStr = formatLocalDate(year, monthIndex + 1, dayNum);
    cells.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr
    });
  }
  
  // 3. Next month leading days to complete full weeks
  const totalCellsNeeded = Math.ceil(cells.length / 7) * 7;
  const remainingCells = totalCellsNeeded - cells.length;
  
  for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
    const nextMonthDate = new Date(year, monthIndex + 1, dayNum);
    const dateStr = getLocalDateString(nextMonthDate);
    cells.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr
    });
  }
  
  return cells;
}

// Starter events relative to current date
export function getStarterEvents(baseDate = new Date()) {
  const todayStr = getLocalDateString(baseDate);

  const tomorrow = new Date(baseDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrow);

  const inFourDays = new Date(baseDate);
  inFourDays.setDate(inFourDays.getDate() + 4);
  const inFourDaysStr = getLocalDateString(inFourDays);

  return [
    {
      id: "evt_starter_1",
      title: "Project Meeting",
      date: todayStr,
      startTime: "10:00",
      endTime: "11:30",
      allDay: false,
      category: "Work",
      description: "PixelDesk architecture sync and Level 3 milestone review.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "evt_starter_2",
      title: "Study DAA",
      date: todayStr,
      startTime: "16:00",
      endTime: "17:30",
      allDay: false,
      category: "Study",
      description: "Review Divide & Conquer algorithms, recurrence relations, and Master Theorem.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "evt_starter_3",
      title: "Pixel Art Sprint",
      date: tomorrowStr,
      startTime: "14:00",
      endTime: "15:30",
      allDay: false,
      category: "Personal",
      description: "Design 8-bit icons and calendar window decorations.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "evt_starter_4",
      title: "Retro Hackathon",
      date: inFourDaysStr,
      startTime: "",
      endTime: "",
      allDay: true,
      category: "Other",
      description: "Showcase PixelDesk browser operating system workspace.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
