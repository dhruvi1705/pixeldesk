import { useState, useEffect, useCallback, useMemo } from "react";

const TASKS_KEY = "pixeldesk_tasks";
const NOTES_KEY = "pixeldesk_notes";
const EVENTS_KEY = "pixeldesk_events";
const FOCUS_KEY = "pixeldesk_focus_sessions";
const FINANCE_KEY = "pixeldesk_transactions";

// Safely parse JSON from localStorage with fallbacks
function safeParseStorage(key, fallback = []) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (err) {
    console.warn(`[useWorkspaceContext] Failed to parse localStorage key "${key}":`, err);
    return fallback;
  }
}

// Format local date string: YYYY-MM-DD
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Convert minutes to human readable "Xh Ym" or "Xm"
export function formatMinutesHuman(totalMinutes) {
  const mins = Math.max(0, Math.round(totalMinutes || 0));
  if (mins === 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// Format currency in Indian Rupees
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(num);
  return `₹${formatted}`;
}

// Start of current week (Monday 00:00:00)
export function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get date string N days from today
export function getDateNDaysFromNow(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return getLocalDateString(d);
}

// Current Year-Month prefix: YYYY-MM
export function getCurrentMonthPrefix() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function useWorkspaceContext() {
  const [versionTick, setVersionTick] = useState(0);

  const refreshContext = useCallback(() => {
    setVersionTick((t) => t + 1);
  }, []);

  // Listen to cross-tab storage changes and all PixelDesk app domain events
  useEffect(() => {
    const handleDomainEvent = () => refreshContext();

    window.addEventListener("storage", handleDomainEvent);
    window.addEventListener("pixeldesk_task_event", handleDomainEvent);
    window.addEventListener("pixeldesk_note_event", handleDomainEvent);
    window.addEventListener("pixeldesk_calendar_event", handleDomainEvent);
    window.addEventListener("pixeldesk_focus_event", handleDomainEvent);
    window.addEventListener("pixeldesk_finance_event", handleDomainEvent);
    window.addEventListener("pixeldesk_companion_event", handleDomainEvent);
    window.addEventListener("focus", handleDomainEvent);

    return () => {
      window.removeEventListener("storage", handleDomainEvent);
      window.removeEventListener("pixeldesk_task_event", handleDomainEvent);
      window.removeEventListener("pixeldesk_note_event", handleDomainEvent);
      window.removeEventListener("pixeldesk_calendar_event", handleDomainEvent);
      window.removeEventListener("pixeldesk_focus_event", handleDomainEvent);
      window.removeEventListener("pixeldesk_finance_event", handleDomainEvent);
      window.removeEventListener("pixeldesk_companion_event", handleDomainEvent);
      window.removeEventListener("focus", handleDomainEvent);
    };
  }, [refreshContext]);

  // Read raw store snapshots safely
  const rawStores = useMemo(() => {
    if (versionTick < 0) {
      return { tasks: [], notes: [], events: [], focusSessions: [], transactions: [] };
    }
    return {
      tasks: safeParseStorage(TASKS_KEY, []),
      notes: safeParseStorage(NOTES_KEY, []),
      events: safeParseStorage(EVENTS_KEY, []),
      focusSessions: safeParseStorage(FOCUS_KEY, []),
      transactions: safeParseStorage(FINANCE_KEY, [])
    };
  }, [versionTick]);

  // 1. Task Calculations
  const tasksSummary = useMemo(() => {
    const todayStr = getLocalDateString();
    const tasks = rawStores.tasks;

    const total = tasks.length;
    const completed = tasks.filter((t) => Boolean(t.completed));
    const pending = tasks.filter((t) => !t.completed);
    
    // Tasks due today
    const dueToday = tasks.filter((t) => t.dueDate === todayStr);
    const dueTodayPending = dueToday.filter((t) => !t.completed);
    const dueTodayCompleted = dueToday.filter((t) => t.completed);

    // Overdue tasks (incomplete and dueDate < today)
    const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr);

    // Upcoming tasks (incomplete and dueDate > today)
    const upcoming = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate > todayStr);

    // Priorities among pending
    const highPriority = pending.filter((t) => t.priority === "High");
    const mediumPriority = pending.filter((t) => t.priority === "Medium");
    const lowPriority = pending.filter((t) => t.priority === "Low");

    const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    return {
      total,
      completedCount: completed.length,
      pendingCount: pending.length,
      dueToday,
      dueTodayCount: dueToday.length,
      dueTodayPendingCount: dueTodayPending.length,
      dueTodayCompletedCount: dueTodayCompleted.length,
      overdue,
      overdueCount: overdue.length,
      upcoming,
      upcomingCount: upcoming.length,
      highPriorityCount: highPriority.length,
      mediumPriorityCount: mediumPriority.length,
      lowPriorityCount: lowPriority.length,
      completionRate,
      rawList: tasks
    };
  }, [rawStores.tasks]);

  // 2. Calendar Event Calculations
  const calendarSummary = useMemo(() => {
    const todayStr = getLocalDateString();
    const in7DaysStr = getDateNDaysFromNow(7);

    const events = rawStores.events;
    const total = events.length;

    // Filter upcoming events (on or after today)
    const upcomingEvents = events
      .filter((e) => e.date && e.date >= todayStr)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return (a.startTime || "").localeCompare(b.startTime || "");
      });

    // Today's events
    const todayEvents = upcomingEvents.filter((e) => e.date === todayStr);

    // Events in next 7 days
    const next7DaysEvents = upcomingEvents.filter((e) => e.date <= in7DaysStr);

    return {
      total,
      upcomingEvents,
      upcomingCount: upcomingEvents.length,
      todayEvents,
      todayCount: todayEvents.length,
      next7DaysEvents,
      next7DaysCount: next7DaysEvents.length,
      rawList: events
    };
  }, [rawStores.events]);

  // 3. Focus Session Calculations
  const focusSummary = useMemo(() => {
    const todayStr = getLocalDateString();
    const startOfWeek = getStartOfWeek();
    const startOfWeekMs = startOfWeek.getTime();

    const allSessions = rawStores.focusSessions.filter((s) => s.type === "focus" || !s.type);

    // Week sessions
    const weekSessions = allSessions.filter((s) => {
      if (!s.completedAt) return false;
      const t = new Date(s.completedAt).getTime();
      return !isNaN(t) && t >= startOfWeekMs;
    });

    const weekMinutes = weekSessions.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);

    // Today's sessions
    const todaySessions = allSessions.filter((s) => {
      if (!s.completedAt) return false;
      return s.completedAt.startsWith(todayStr);
    });

    const todayMinutes = todaySessions.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);

    const totalMinutes = allSessions.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);

    return {
      totalSessions: allSessions.length,
      totalMinutes,
      totalFormatted: formatMinutesHuman(totalMinutes),
      weekSessionsCount: weekSessions.length,
      weekMinutes,
      weekFormatted: formatMinutesHuman(weekMinutes),
      todaySessionsCount: todaySessions.length,
      todayMinutes,
      todayFormatted: formatMinutesHuman(todayMinutes),
      rawList: allSessions
    };
  }, [rawStores.focusSessions]);

  // 4. Finance Calculations
  const financeSummary = useMemo(() => {
    const currentMonthPrefix = getCurrentMonthPrefix();

    const transactions = rawStores.transactions;
    const totalCount = transactions.length;

    // Filter current month transactions
    const monthTransactions = transactions.filter((tx) => tx.date && tx.date.startsWith(currentMonthPrefix));

    let monthIncome = 0;
    let monthExpenses = 0;
    const categoryExpenseMap = {};

    for (const tx of monthTransactions) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        monthIncome += amt;
      } else if (tx.type === "expense") {
        monthExpenses += amt;
        const cat = tx.category || "Other";
        categoryExpenseMap[cat] = (categoryExpenseMap[cat] || 0) + amt;
      }
    }

    const monthBalance = monthIncome - monthExpenses;

    // Category breakdown
    const categoryBreakdown = Object.entries(categoryExpenseMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: monthExpenses > 0 ? Math.round((amount / monthExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categoryBreakdown[0] || null;

    return {
      totalCount,
      currentMonthPrefix,
      monthTransactionsCount: monthTransactions.length,
      monthIncome,
      monthIncomeFormatted: formatCurrency(monthIncome),
      monthExpenses,
      monthExpensesFormatted: formatCurrency(monthExpenses),
      monthBalance,
      monthBalanceFormatted: formatCurrency(monthBalance),
      topCategory,
      categoryBreakdown,
      rawList: transactions
    };
  }, [rawStores.transactions]);

  // 5. Notes Metadata (Privacy-safe: no raw contents dumped)
  const notesSummary = useMemo(() => {
    const notes = rawStores.notes;
    const total = notes.length;
    const pinned = notes.filter((n) => Boolean(n.pinned)).length;

    const tagSet = new Set();
    notes.forEach((n) => {
      if (Array.isArray(n.tags)) {
        n.tags.forEach((t) => tagSet.add(t));
      }
    });

    return {
      total,
      pinnedCount: pinned,
      tags: Array.from(tagSet),
      rawList: notes
    };
  }, [rawStores.notes]);

  // 6. Consolidated Productivity Overview
  const productivityOverview = useMemo(() => {
    return {
      tasks: {
        total: tasksSummary.total,
        completed: tasksSummary.completedCount,
        pending: tasksSummary.pendingCount,
        dueToday: tasksSummary.dueTodayCount,
        overdue: tasksSummary.overdueCount,
        rate: tasksSummary.completionRate
      },
      focus: {
        weekFormatted: focusSummary.weekFormatted,
        weekMinutes: focusSummary.weekMinutes,
        weekSessions: focusSummary.weekSessionsCount,
        todayFormatted: focusSummary.todayFormatted
      },
      calendar: {
        todayEventsCount: calendarSummary.todayCount,
        upcomingEventsCount: calendarSummary.upcomingCount
      },
      finance: {
        monthExpenses: financeSummary.monthExpensesFormatted,
        monthIncome: financeSummary.monthIncomeFormatted,
        monthBalance: financeSummary.monthBalanceFormatted
      },
      notes: {
        total: notesSummary.total,
        pinned: notesSummary.pinnedCount
      }
    };
  }, [tasksSummary, focusSummary, calendarSummary, financeSummary, notesSummary]);

  return {
    tasks: tasksSummary,
    calendar: calendarSummary,
    focus: focusSummary,
    finance: financeSummary,
    notes: notesSummary,
    productivity: productivityOverview,
    rawStores,
    refreshContext
  };
}
