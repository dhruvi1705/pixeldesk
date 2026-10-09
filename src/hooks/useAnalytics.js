import { useState, useEffect, useCallback, useMemo } from "react";
import { scopedStorage } from "../utils/storage";

const TASKS_KEY = "tasks";
const FOCUS_KEY = "focus_sessions";
const FINANCE_KEY = "transactions";
const CALENDAR_KEY = "events";

// Safely parse scopedStorage JSON
function safeParse(key) {
  try {
    const raw = scopedStorage.getItem(key);
    if (!raw) return [];
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn(`Failed to parse ${key}:`, err);
    return [];
  }
}

// Convert minutes to "3h 45m" or "25m"
export function formatMinutes(totalMinutes) {
  const mins = Math.max(0, Math.round(totalMinutes || 0));
  if (mins === 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// Convert number to Indian Rupee string
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(num);
  return `₹${formatted}`;
}

// Get local date YYYY-MM-DD
function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useAnalytics() {
  const [period, setPeriod] = useState("30d"); // "7d" | "30d" | "month" | "all"
  const [tick, setTick] = useState(0);

  // Manual or event-driven refresh
  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  // Listen for storage & PixelDesk custom events
  useEffect(() => {
    const handleUpdate = () => refresh();

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("pixeldesk_task_event", handleUpdate);
    window.addEventListener("pixeldesk_focus_event", handleUpdate);
    window.addEventListener("pixeldesk_calendar_event", handleUpdate);
    window.addEventListener("pixeldesk_finance_event", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("pixeldesk_task_event", handleUpdate);
      window.removeEventListener("pixeldesk_focus_event", handleUpdate);
      window.removeEventListener("pixeldesk_calendar_event", handleUpdate);
      window.removeEventListener("pixeldesk_finance_event", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [refresh]);

  // Raw data read safely from localStorage (tick forces refresh on custom events)
  const rawData = useMemo(() => {
    if (tick < 0) return { tasks: [], focusSessions: [], transactions: [], events: [] };

    return {
      tasks: safeParse(TASKS_KEY),
      focusSessions: safeParse(FOCUS_KEY),
      transactions: safeParse(FINANCE_KEY),
      events: safeParse(CALENDAR_KEY)
    };
  }, [tick]);

  const hasAnyData = useMemo(() => {
    return (
      rawData.tasks.length > 0 ||
      rawData.focusSessions.length > 0 ||
      rawData.transactions.length > 0 ||
      rawData.events.length > 0
    );
  }, [rawData]);

  // Date filtering predicate based on period
  const filterByPeriod = useCallback(
    (itemDateStr) => {
      if (period === "all" || !itemDateStr) return true;

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-11

      const d = new Date(itemDateStr);
      if (isNaN(d.getTime())) return true;

      if (period === "month") {
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      }

      const diffMs = now.getTime() - d.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (period === "7d") {
        return diffDays >= -7 && diffDays <= 7;
      }
      if (period === "30d") {
        return diffDays >= -30 && diffDays <= 30;
      }

      return true;
    },
    [period]
  );

  // 1. Task Metrics
  const tasksAnalytics = useMemo(() => {
    const todayStr = getLocalDateString();
    const all = rawData.tasks;
    const filtered = all.filter((t) => filterByPeriod(t.dueDate || t.createdAt));

    const total = filtered.length;
    const completed = filtered.filter((t) => t.completed).length;
    const active = filtered.filter((t) => !t.completed).length;
    const overdue = filtered.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Categories breakdown
    const catMap = {};
    for (const t of filtered) {
      const c = t.category || "Other";
      catMap[c] = (catMap[c] || 0) + 1;
    }
    const categories = Object.entries(catMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      completed,
      active,
      overdue,
      completionRate,
      categories,
      hasData: total > 0
    };
  }, [rawData.tasks, filterByPeriod]);

  // 2. Focus Metrics
  const focusAnalytics = useMemo(() => {
    const all = rawData.focusSessions.filter((s) => s.type === "focus");
    const filtered = all.filter((s) => filterByPeriod(s.completedAt));

    const sessionCount = filtered.length;
    const totalMinutes = filtered.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
    const avgMinutes = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;
    const longestMinutes = sessionCount > 0 ? Math.max(...filtered.map((s) => Number(s.durationMinutes) || 0)) : 0;

    // Daily distribution (last 7 days or days of week)
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayTotals = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };

    for (const s of filtered) {
      if (s.completedAt) {
        const d = new Date(s.completedAt);
        const dayName = days[d.getDay()];
        if (dayTotals[dayName] !== undefined) {
          dayTotals[dayName] += Number(s.durationMinutes) || 0;
        }
      }
    }

    const maxDayMinutes = Math.max(1, ...Object.values(dayTotals));
    const dailyChart = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => ({
      label: day,
      value: dayTotals[day],
      percentage: Math.round((dayTotals[day] / maxDayMinutes) * 100),
      display: formatMinutes(dayTotals[day])
    }));

    return {
      sessionCount,
      totalMinutes,
      formattedTime: formatMinutes(totalMinutes),
      avgMinutes,
      formattedAvg: formatMinutes(avgMinutes),
      longestMinutes,
      formattedLongest: formatMinutes(longestMinutes),
      dailyChart,
      hasData: sessionCount > 0
    };
  }, [rawData.focusSessions, filterByPeriod]);

  // 3. Finance Metrics
  const financeAnalytics = useMemo(() => {
    const all = rawData.transactions;
    const filtered = all.filter((tx) => filterByPeriod(tx.date || tx.createdAt));

    let income = 0;
    let expenses = 0;
    const expenseList = [];

    const categoryMap = {};

    for (const tx of filtered) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        income += amt;
      } else if (tx.type === "expense") {
        expenses += amt;
        expenseList.push(amt);
        const cat = tx.category || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + amt;
      }
    }

    const avgExpense = expenseList.length > 0 ? Math.round(expenses / expenseList.length) : 0;
    const largestExpense = expenseList.length > 0 ? Math.max(...expenseList) : 0;

    // Spending categories
    const categories = Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: expenses > 0 ? Math.round((amount / expenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categories[0] || null;

    return {
      income,
      expenses,
      netBalance: income - expenses,
      avgExpense,
      largestExpense,
      categories,
      topCategory,
      hasData: filtered.length > 0
    };
  }, [rawData.transactions, filterByPeriod]);

  // 4. Calendar Metrics
  const calendarAnalytics = useMemo(() => {
    const all = rawData.events;
    const filtered = all.filter((evt) => filterByPeriod(evt.date || evt.createdAt));

    const totalEvents = filtered.length;
    const allDayEvents = filtered.filter((e) => e.allDay).length;
    const timedEvents = totalEvents - allDayEvents;

    // Categories
    const catMap = {};
    const dateMap = {};

    for (const evt of filtered) {
      const c = evt.category || "Other";
      catMap[c] = (catMap[c] || 0) + 1;

      if (evt.date) {
        dateMap[evt.date] = (dateMap[evt.date] || 0) + 1;
      }
    }

    const categories = Object.entries(catMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Busiest day
    let busiestDay = null;
    let maxCount = 0;
    for (const [date, count] of Object.entries(dateMap)) {
      if (count > maxCount) {
        maxCount = count;
        busiestDay = { date, count };
      }
    }

    return {
      totalEvents,
      allDayEvents,
      timedEvents,
      categories,
      busiestDay,
      hasData: totalEvents > 0
    };
  }, [rawData.events, filterByPeriod]);

  // 5. High-level Summary Cards
  const summary = useMemo(() => {
    return {
      tasksCompleted: tasksAnalytics.completed,
      focusTimeFormatted: focusAnalytics.formattedTime,
      spentFormatted: formatCurrency(financeAnalytics.expenses),
      eventsCount: calendarAnalytics.totalEvents
    };
  }, [tasksAnalytics.completed, focusAnalytics.formattedTime, financeAnalytics.expenses, calendarAnalytics.totalEvents]);

  // 6. Productivity Overview
  const productivity = useMemo(() => {
    return {
      completionRate: tasksAnalytics.completionRate,
      completedTasks: tasksAnalytics.completed,
      activeTasks: tasksAnalytics.active,
      overdueTasks: tasksAnalytics.overdue,
      totalTasks: tasksAnalytics.total,
      focusMinutes: focusAnalytics.totalMinutes,
      focusSessions: focusAnalytics.sessionCount,
      eventsCount: calendarAnalytics.totalEvents
    };
  }, [tasksAnalytics, focusAnalytics, calendarAnalytics]);

  return {
    period,
    setPeriod,
    summary,
    productivity,
    tasks: tasksAnalytics,
    focus: focusAnalytics,
    finance: financeAnalytics,
    calendar: calendarAnalytics,
    hasAnyData,
    refresh
  };
}
