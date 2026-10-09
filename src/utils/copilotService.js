/**
 * PixelDesk Copilot Service Boundary
 * 
 * Defines the interface for:
 * 1. Local deterministic workspace queries (executed client-side against read-only user-scoped workspace context).
 * 2. Future AI-backed model requests (designed to route to a secure backend endpoint, never exposing frontend secrets).
 */

export const COPILOT_CONFIG = {
  VERSION: "v0.9 — Foundation",
  MODE: "local-query", // "local-query" | "backend-ai"
  BACKEND_ENDPOINT: null, // Points to backend proxy in future AI milestones
  AI_MODEL_NAME: "None (Local Workspace Engine)"
};

/**
 * Check if a secure backend AI endpoint is connected and available.
 */
export function isAiBackendConfigured() {
  return Boolean(COPILOT_CONFIG.BACKEND_ENDPOINT);
}

/**
 * Suggested standard prompts supported by the local workspace query engine.
 */
export const SUGGESTED_PROMPTS = [
  "How many tasks have I completed?",
  "What tasks are due soon?",
  "Show my pending tasks.",
  "Summarize my upcoming calendar.",
  "How much focus time did I complete this week?",
  "Summarize my spending this month.",
  "Give me an overview of my productivity."
];

/**
 * Normalizes user queries for consistent deterministic pattern matching.
 */
export function normalizeQuery(text = "") {
  return (text || "")
    .toLowerCase()
    .replace(/[?!.,;:'"()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Analyze user input and classify its local query intent.
 * Returns an intent key or null if unsupported locally.
 */
export function detectQueryIntent(text = "") {
  const norm = normalizeQuery(text);
  if (!norm) return null;

  // 1. Completed tasks / work finished queries
  if (
    norm.includes("completed task") ||
    norm.includes("completed tasks") ||
    norm.includes("tasks completed") ||
    norm.includes("task completed") ||
    norm.includes("i completed") ||
    norm.includes("have i completed") ||
    norm.includes("did i complete") ||
    norm.includes("tasks have i finished") ||
    norm.includes("work have i finished") ||
    norm.includes("work i finished") ||
    norm.includes("have i finished") ||
    norm.includes("did i finish") ||
    norm.includes("finished tasks") ||
    norm.includes("tasks finished") ||
    norm.includes("done tasks") ||
    norm.includes("tasks done") ||
    norm.includes("tasks are done") ||
    norm.includes("tasks are completed") ||
    norm.includes("task completion") ||
    norm.includes("completion progress") ||
    norm.includes("completion rate") ||
    norm === "completed" ||
    norm === "finished"
  ) {
    return "TASKS_COMPLETED";
  }

  // 2. Overdue tasks queries
  if (
    norm.includes("overdue") ||
    norm.includes("late tasks") ||
    norm.includes("missed deadlines") ||
    norm.includes("missed tasks") ||
    norm.includes("past due")
  ) {
    return "TASKS_OVERDUE";
  }

  // 3. Tasks due today
  if (
    norm.includes("due today") ||
    norm.includes("tasks today") ||
    norm.includes("today tasks") ||
    norm.includes("todays tasks") ||
    norm.includes("tasks for today") ||
    norm.includes("finish today") ||
    norm.includes("do today") ||
    norm === "tasks today"
  ) {
    return "TASKS_DUE_TODAY";
  }

  // 4. Upcoming deadlines / tasks due soon
  if (
    norm.includes("due soon") ||
    norm.includes("deadlines") ||
    norm.includes("deadline") ||
    norm.includes("finish soon") ||
    norm.includes("coming up") ||
    norm.includes("upcoming tasks") ||
    norm.includes("upcoming task") ||
    norm.includes("next tasks") ||
    norm.includes("due this week") ||
    norm.includes("what is due") ||
    norm.includes("whats due") ||
    norm.includes("what tasks are due")
  ) {
    return "TASKS_DUE_SOON";
  }

  // 5. Pending / Incomplete tasks
  if (
    norm.includes("pending") ||
    norm.includes("unfinished") ||
    norm.includes("incomplete") ||
    norm.includes("left to do") ||
    norm.includes("remaining tasks") ||
    norm.includes("tasks left") ||
    norm.includes("to do tasks") ||
    norm.includes("todo tasks") ||
    norm.includes("active tasks")
  ) {
    return "TASKS_PENDING";
  }

  // 6. All tasks / general task list
  if (
    norm.includes("all tasks") ||
    norm.includes("list tasks") ||
    norm.includes("my tasks") ||
    norm.includes("task summary") ||
    norm.includes("tasks summary") ||
    norm.includes("tasks overview") ||
    norm.includes("show tasks") ||
    norm === "tasks" ||
    norm === "task"
  ) {
    return "TASKS_ALL";
  }

  // 7. Today's calendar
  if (
    norm.includes("events today") ||
    norm.includes("calendar today") ||
    norm.includes("today's events") ||
    norm.includes("todays events") ||
    norm.includes("schedule today")
  ) {
    return "CALENDAR_TODAY";
  }

  // 8. Upcoming calendar events
  if (
    norm.includes("calendar") ||
    norm.includes("events") ||
    norm.includes("schedule") ||
    norm.includes("appointments") ||
    norm.includes("meetings")
  ) {
    return "CALENDAR_UPCOMING";
  }

  // 9. Focus time & Pomodoro sessions
  if (
    norm.includes("focus") ||
    norm.includes("pomodoro") ||
    norm.includes("deep work") ||
    norm.includes("study time")
  ) {
    return "FOCUS_WEEKLY";
  }

  // 10. Spending / Finance
  if (
    norm.includes("spending") ||
    norm.includes("expense") ||
    norm.includes("finance") ||
    norm.includes("money") ||
    norm.includes("budget") ||
    norm.includes("income") ||
    norm.includes("balance")
  ) {
    return "FINANCE_MONTHLY";
  }

  // 11. Productivity Overview
  if (
    norm.includes("productivity") ||
    norm.includes("overview") ||
    norm.includes("summary") ||
    norm.includes("report") ||
    norm.includes("dashboard") ||
    norm.includes("stats")
  ) {
    return "PRODUCTIVITY_OVERVIEW";
  }

  // 12. Notes Summary
  if (
    norm.includes("notes") ||
    norm.includes("note") ||
    norm.includes("scratchpad")
  ) {
    return "NOTES_SUMMARY";
  }

  return null;
}

/**
 * Execute a deterministic local query against the provided workspace context.
 */
export function executeLocalQuery(intent, context) {
  const { tasks = {}, calendar = {}, focus = {}, finance = {}, notes = {}, productivity = {} } = context || {};

  switch (intent) {
    case "TASKS_COMPLETED": {
      const completedList = tasks.completedList || tasks.completed || [];
      const total = tasks.total || 0;
      const completedCount = tasks.completedCount !== undefined ? tasks.completedCount : completedList.length;
      const rate = tasks.completionRate !== undefined ? tasks.completionRate : (total > 0 ? Math.round((completedCount / total) * 100) : 0);

      if (completedCount === 0) {
        return {
          intent,
          status: "success",
          source: "local-engine",
          text: `✨ **Completed Tasks (0)**\n\nYou have not completed any tasks yet (0 of ${total} finished • 0% completion rate).\n\nCheck off tasks in the Tasks app as you complete them to track your progress!`,
          data: { completedCount: 0, total, completionRate: 0, completedList: [] }
        };
      }

      let text = `✅ **Completed Tasks (${completedCount}/${total} • ${rate}% Complete)**\n\n`;
      text += `You have finished **${completedCount} ${completedCount === 1 ? "task" : "tasks"}**:\n\n`;

      const displayList = completedList.slice(0, 10);
      displayList.forEach((t, i) => {
        const prio = t.priority ? `(${t.priority})` : "";
        const cat = t.category ? `[${t.category}]` : "";
        text += `${i + 1}. **${t.title}** ${prio} ${cat}\n   └ ✓ Completed\n`;
      });

      if (completedList.length > 10) {
        text += `\n*...and ${completedList.length - 10} more completed task(s).*`;
      }

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: { completedCount, total, completionRate: rate, completedList }
      };
    }

    case "TASKS_DUE_SOON":
    case "TASKS_UPCOMING": {
      const overdue = tasks.overdueList || tasks.overdue || [];
      const dueToday = tasks.dueTodayPendingList || tasks.dueTodayPending || [];
      const upcoming = tasks.upcomingList || tasks.upcoming || [];
      const totalDueSoon = overdue.length + dueToday.length + upcoming.length;

      if (totalDueSoon === 0) {
        let msg = "📅 **Upcoming Tasks & Deadlines**\n\n";
        if (tasks.pendingCount > 0) {
          msg += `You have **${tasks.pendingCount} pending ${tasks.pendingCount === 1 ? "task" : "tasks"}**, but none have an immediate deadline set.`;
        } else if (tasks.total > 0) {
          msg += "All your tasks are currently completed! Great job staying ahead!";
        } else {
          msg += "You have no tasks created yet. Add a task in the Tasks app to track deadlines.";
        }
        return {
          intent,
          status: "success",
          source: "local-engine",
          text: msg,
          data: { totalDueSoon: 0, overdueCount: 0, dueTodayCount: 0, upcomingCount: 0 }
        };
      }

      let text = `📅 **Upcoming Deadlines & Due Tasks (${totalDueSoon})**\n\n`;

      if (overdue.length > 0) {
        text += `⚠️ **Overdue (${overdue.length})**:\n`;
        overdue.slice(0, 5).forEach((t, i) => {
          text += `${i + 1}. **${t.title}** — Due: ${t.dueDate || "Past"} [${t.priority || "Medium"}]\n`;
        });
        if (overdue.length > 5) text += `   *...and ${overdue.length - 5} more overdue*\n`;
        text += "\n";
      }

      if (dueToday.length > 0) {
        text += `⏰ **Due Today (${dueToday.length})**:\n`;
        dueToday.slice(0, 5).forEach((t, i) => {
          text += `${i + 1}. **${t.title}** [${t.category || "General"}] (${t.priority || "Medium"})\n`;
        });
        if (dueToday.length > 5) text += `   *...and ${dueToday.length - 5} more due today*\n`;
        text += "\n";
      }

      if (upcoming.length > 0) {
        text += `🗓️ **Upcoming Deadlines (${upcoming.length})**:\n`;
        upcoming.slice(0, 8).forEach((t, i) => {
          text += `${i + 1}. **${t.title}** — Due: ${t.dueDate} [${t.category || "General"}]\n`;
        });
        if (upcoming.length > 8) text += `   *...and ${upcoming.length - 8} more upcoming*\n`;
      }

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: {
          totalDueSoon,
          overdueCount: overdue.length,
          dueTodayCount: dueToday.length,
          upcomingCount: upcoming.length
        }
      };
    }

    case "TASKS_PENDING": {
      const pendingList = tasks.pendingList || tasks.pending || [];
      const pendingCount = tasks.pendingCount !== undefined ? tasks.pendingCount : pendingList.length;

      if (pendingCount === 0) {
        return {
          intent,
          status: "success",
          source: "local-engine",
          text: "🎉 **Pending Tasks (0)**\n\nAll tasks are completed! You have no pending tasks on your list.",
          data: { pendingCount: 0, pendingList: [] }
        };
      }

      let text = `📋 **Pending Tasks (${pendingCount})**\n\n`;
      const displayList = pendingList.slice(0, 10);
      displayList.forEach((t, i) => {
        const dueStr = t.dueDate ? ` • Due: ${t.dueDate}` : "";
        const prio = t.priority ? `(${t.priority})` : "";
        const cat = t.category ? `[${t.category}]` : "";
        text += `${i + 1}. **${t.title}** ${prio} ${cat}${dueStr}\n`;
      });

      if (pendingList.length > 10) {
        text += `\n*...and ${pendingList.length - 10} more pending task(s).*`;
      }

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: { pendingCount, pendingList }
      };
    }

    case "TASKS_DUE_TODAY": {
      const dueTodayList = tasks.dueTodayList || tasks.dueToday || [];
      const pendingCount = tasks.dueTodayPendingCount !== undefined ? tasks.dueTodayPendingCount : dueTodayList.filter(t => !t.completed).length;
      const completedCount = tasks.dueTodayCompletedCount !== undefined ? tasks.dueTodayCompletedCount : dueTodayList.filter(t => t.completed).length;
      const overdueCount = tasks.overdueCount || 0;

      if (dueTodayList.length === 0) {
        let msg = "📅 **Tasks Due Today**\n\nYou have **no tasks due today**.";
        if (overdueCount > 0) {
          msg += ` However, you have **${overdueCount} overdue ${overdueCount === 1 ? "task" : "tasks"}** requiring attention.`;
        }
        return {
          intent,
          status: "success",
          source: "local-engine",
          text: msg,
          data: { dueToday: [], overdueCount }
        };
      }

      let text = `📅 **Tasks Due Today (${dueTodayList.length})**\n`;
      text += `Status: ${completedCount} completed, ${pendingCount} pending.\n\n`;

      dueTodayList.forEach((t, i) => {
        const checkbox = t.completed ? "✓ [COMPLETED]" : "○ [PENDING]";
        const prio = t.priority ? `(${t.priority} Priority)` : "";
        const cat = t.category ? `[${t.category}]` : "";
        text += `${i + 1}. **${t.title}** ${prio} ${cat}\n   └ ${checkbox}\n`;
      });

      if (overdueCount > 0) {
        text += `\n⚠️ *Note: You also have ${overdueCount} overdue ${overdueCount === 1 ? "task" : "tasks"}.*`;
      }

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: { count: dueTodayList.length, pendingCount, completedCount, overdueCount }
      };
    }

    case "TASKS_OVERDUE": {
      const overdueList = tasks.overdueList || tasks.overdue || [];
      if (overdueList.length === 0) {
        return {
          intent,
          status: "success",
          source: "local-engine",
          text: "✨ **Overdue Tasks**\n\nGreat job! You have **0 overdue tasks**.",
          data: { overdueCount: 0, overdueList: [] }
        };
      }

      let text = `⚠️ **Overdue Tasks (${overdueList.length})**\n\n`;
      overdueList.forEach((t, i) => {
        text += `${i + 1}. **${t.title}** (Due: ${t.dueDate || "Past"}) [${t.priority || "Medium"}]\n`;
      });

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: { overdueCount: overdueList.length, overdueList }
      };
    }

    case "TASKS_ALL": {
      const total = tasks.total || 0;
      const completed = tasks.completedCount || 0;
      const rate = tasks.completionRate || 0;
      const pending = tasks.pendingCount || 0;
      const dueToday = tasks.dueTodayCount || 0;
      const overdue = tasks.overdueCount || 0;
      const highPrio = tasks.highPriorityCount || 0;

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: `📋 **Workspace Tasks Summary**\n\n- **Total Tasks:** ${total}\n- **Completed:** ${completed} (${rate}%)\n- **Pending:** ${pending}\n- **Due Today:** ${dueToday}\n- **Overdue:** ${overdue}\n- **High Priority:** ${highPrio}`,
        data: { total, completed, pending, dueToday, overdue, highPrio }
      };
    }

    case "CALENDAR_UPCOMING": {
      const upcoming = calendar.upcomingEvents || [];
      if (upcoming.length === 0) {
        return {
          intent,
          status: "success",
          source: "local-engine",
          text: "🗓️ **Upcoming Calendar**\n\nNo upcoming events found on your calendar for the coming days.",
          data: { upcomingCount: 0 }
        };
      }

      let text = `🗓️ **Upcoming Calendar Events (${upcoming.length})**\n\n`;
      const displayEvents = upcoming.slice(0, 6);
      displayEvents.forEach((evt, i) => {
        const timeStr = evt.allDay ? "All Day" : evt.startTime ? `${evt.startTime}${evt.endTime ? ` - ${evt.endTime}` : ""}` : "Scheduled";
        const cat = evt.category ? `[${evt.category}]` : "";
        text += `${i + 1}. **${evt.title}** ${cat}\n   └ Date: ${evt.date} • ${timeStr}\n`;
      });

      if (upcoming.length > 6) {
        text += `\n*...and ${upcoming.length - 6} more upcoming event(s).*`;
      }

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: { upcomingCount: upcoming.length }
      };
    }

    case "CALENDAR_TODAY": {
      const todayList = calendar.todayEvents || [];
      if (todayList.length === 0) {
        return {
          intent,
          status: "success",
          source: "local-engine",
          text: "🗓️ **Today's Schedule**\n\nYou have **no calendar events scheduled for today**.",
          data: { todayCount: 0 }
        };
      }

      let text = `🗓️ **Today's Scheduled Events (${todayList.length})**\n\n`;
      todayList.forEach((evt, i) => {
        const timeStr = evt.allDay ? "All Day" : evt.startTime ? `${evt.startTime}${evt.endTime ? ` - ${evt.endTime}` : ""}` : "Scheduled";
        text += `${i + 1}. **${evt.title}** [${evt.category || "General"}] — ${timeStr}\n`;
      });

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: { todayCount: todayList.length }
      };
    }

    case "FOCUS_WEEKLY": {
      const { weekMinutes = 0, weekFormatted = "0m", weekSessionsCount = 0, todayFormatted = "0m", todaySessionsCount = 0 } = focus || {};
      
      let text = `⏱️ **Focus Timer Summary (This Week)**\n\n`;
      text += `- **Weekly Focus Time:** **${weekFormatted}** (${weekMinutes} mins)\n`;
      text += `- **Sessions Completed:** ${weekSessionsCount} focus session(s)\n`;
      text += `- **Today's Focus:** ${todayFormatted} (${todaySessionsCount} session(s))\n`;
      
      if (weekSessionsCount === 0) {
        text += `\n*Tip: Start a focus session in the Focus app to track your daily deep work.*`;
      } else {
        const avg = Math.round(weekMinutes / (weekSessionsCount || 1));
        text += `- **Average Duration:** ~${avg} mins / session`;
      }

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: { weekMinutes, weekSessionsCount }
      };
    }

    case "FINANCE_MONTHLY": {
      const { monthExpensesFormatted = "₹0", monthIncomeFormatted = "₹0", monthBalanceFormatted = "₹0", monthBalance = 0, topCategory = null, categoryBreakdown = [], monthTransactionsCount = 0 } = finance || {};

      let text = `💰 **Monthly Finance Summary**\n\n`;
      text += `- **Total Expenses:** **${monthExpensesFormatted}**\n`;
      text += `- **Total Income:** ${monthIncomeFormatted}\n`;
      text += `- **Net Balance:** **${monthBalanceFormatted}** ${monthBalance >= 0 ? "(Surplus)" : "(Deficit)"}\n`;
      text += `- **Logged Transactions:** ${monthTransactionsCount}\n`;

      if (topCategory) {
        text += `\n🏷️ **Top Spending Category:**\n`;
        text += `- **${topCategory.category}:** ${financeSummaryFormatCurrency(topCategory.amount)} (${topCategory.percentage}% of total expenses)\n`;
      }

      if (categoryBreakdown && categoryBreakdown.length > 1) {
        text += `\n📊 **Breakdown:**\n`;
        categoryBreakdown.slice(0, 4).forEach((c) => {
          text += `• ${c.category}: ${financeSummaryFormatCurrency(c.amount)} (${c.percentage}%)\n`;
        });
      }

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: { monthExpensesFormatted, monthIncomeFormatted, monthBalanceFormatted }
      };
    }

    case "PRODUCTIVITY_OVERVIEW": {
      const { tasks: pTasks = {}, focus: pFocus = {}, calendar: pCal = {}, finance: pFin = {}, notes: pNotes = {} } = productivity || {};

      let text = `📊 **PixelDesk Productivity Overview**\n\n`;
      text += `**Tasks Status:**\n`;
      text += `• Completion Rate: **${pTasks.rate || 0}%** (${pTasks.completed || 0}/${pTasks.total || 0} completed)\n`;
      text += `• Due Today: ${pTasks.dueToday || 0} | Overdue: ${pTasks.overdue || 0}\n\n`;

      text += `**Deep Focus:**\n`;
      text += `• Completed this week: **${pFocus.weekFormatted || "0m"}** (${pFocus.weekSessions || 0} session(s))\n`;
      text += `• Today's Focus: ${pFocus.todayFormatted || "0m"}\n\n`;

      text += `**Schedule & Workspace:**\n`;
      text += `• Upcoming Events: ${pCal.upcomingEventsCount || 0} (Today: ${pCal.todayEventsCount || 0})\n`;
      text += `• Notes in Pad: ${pNotes.total || 0} (${pNotes.pinned || 0} pinned)\n\n`;

      text += `**Monthly Finance:**\n`;
      text += `• Spending: ${pFin.monthExpenses || "₹0"} | Income: ${pFin.monthIncome || "₹0"} (Net: ${pFin.monthBalance || "₹0"})\n`;

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: text.trim(),
        data: productivity
      };
    }

    case "NOTES_SUMMARY": {
      const total = notes.total || 0;
      const pinned = notes.pinnedCount || 0;
      const tags = notes.tags || [];

      return {
        intent,
        status: "success",
        source: "local-engine",
        text: `📝 **Notes Pad Summary**\n\n- **Total Notes:** ${total}\n- **Pinned Notes:** ${pinned}\n- **Active Tags:** ${tags.length > 0 ? tags.join(", ") : "None"}\n\n*(Note bodies are kept private and not displayed in general summaries).*`,
        data: { total, pinned }
      };
    }

    default:
      return null;
  }
}

function financeSummaryFormatCurrency(amount) {
  const num = Number(amount) || 0;
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num)}`;
}

/**
 * Handle unsupported user queries honestly without pretending an AI model is connected.
 */
export function generateUnsupportedResponse(userMessage = "") {
  const text = `🤖 **Local Workspace Engine (v0.9 Foundation)**\n\n` +
    `PixelDesk Copilot operates in **Deterministic Local Query Mode** using your real user-scoped data.\n\n` +
    `**Supported Workspace Queries You Can Ask Right Now:**\n` +
    `• ✅ *"How many tasks have I completed?"* or *"Show my completed tasks."*\n` +
    `• 📅 *"What tasks are due soon?"* or *"What deadlines are coming up?"*\n` +
    `• 📋 *"Show my pending tasks."* or *"What tasks are due today?"*\n` +
    `• ⚠️ *"Show my overdue tasks."*\n` +
    `• 🗓️ *"Summarize my upcoming calendar."*\n` +
    `• ⏱️ *"How much focus time did I complete this week?"*\n` +
    `• 💰 *"Summarize my spending this month."*\n` +
    `• 📊 *"Give me an overview of my productivity."*\n\n` +
    `Click one of the suggested prompt buttons below or type any of the questions above!`;

  return {
    intent: "UNSUPPORTED",
    status: "notice",
    source: "local-engine",
    text,
    unsupportedQuery: userMessage
  };
}

/**
 * Future AI Service Boundary Interface
 */
export async function sendToAiBackend({ query: _query, context: _context, history: _history }) {
  if (!isAiBackendConfigured()) {
    throw new Error("AI Backend Endpoint is not configured in this environment.");
  }
}

/**
 * Main query dispatcher for Copilot.
 * Resolves local queries or returns an honest explanation of capabilities.
 */
export async function processCopilotQuery(userMessage, workspaceContext) {
  const trimmed = (userMessage || "").trim();
  if (!trimmed) {
    return {
      intent: "EMPTY",
      status: "error",
      source: "local-engine",
      text: "Please enter a question or select a prompt."
    };
  }

  // 1. Check if backend AI is configured (future level)
  if (isAiBackendConfigured()) {
    try {
      return await sendToAiBackend({ query: trimmed, context: workspaceContext });
    } catch (err) {
      console.warn("Backend AI request failed, falling back to local query:", err);
    }
  }

  // 2. Local Query Engine
  const intent = detectQueryIntent(trimmed);
  if (intent) {
    const localResult = executeLocalQuery(intent, workspaceContext);
    if (localResult) {
      return localResult;
    }
  }

  // 3. Honest fallback for unsupported prompts
  return generateUnsupportedResponse(trimmed);
}
