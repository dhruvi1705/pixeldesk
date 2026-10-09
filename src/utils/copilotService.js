/**
 * PixelDesk Copilot Service Boundary
 * 
 * Defines the interface for:
 * 1. Local deterministic workspace queries (executed client-side against read-only workspace context).
 * 2. Future AI-backed model requests (designed to route to a secure backend endpoint, never exposing frontend secrets).
 */

export const COPILOT_CONFIG = {
  VERSION: "v0.9 — Foundation",
  MODE: "local-query", // "local-query" | "backend-ai"
  BACKEND_ENDPOINT: null, // Will point to backend proxy in future levels (e.g. /api/copilot/v1/query)
  AI_MODEL_NAME: "None (Local Workspace Engine)"
};

/**
 * Check if a secure backend AI endpoint is connected and available.
 */
export function isAiBackendConfigured() {
  return Boolean(COPILOT_CONFIG.BACKEND_ENDPOINT);
}

/**
 * Suggested standard prompts that are 100% supported by the local workspace query engine.
 */
export const SUGGESTED_PROMPTS = [
  "What tasks are due today?",
  "Summarize my upcoming calendar.",
  "How much focus time did I complete this week?",
  "Summarize my spending this month.",
  "Give me an overview of my productivity."
];

/**
 * Analyze user input and classify its local query intent.
 * Returns an intent key or null if unsupported locally.
 */
export function detectQueryIntent(text = "") {
  const normalized = text.trim().toLowerCase();

  // 1. Tasks due today
  if (
    normalized.includes("due today") ||
    normalized.includes("tasks today") ||
    normalized.includes("today's tasks") ||
    normalized.includes("tasks for today") ||
    normalized.includes("today tasks") ||
    normalized === "what tasks are due today?" ||
    normalized === "what tasks are due today" ||
    normalized === "tasks today?" ||
    normalized === "tasks"
  ) {
    return "TASKS_DUE_TODAY";
  }

  // 2. Overdue tasks
  if (
    normalized.includes("overdue") ||
    normalized.includes("late tasks") ||
    normalized.includes("missed tasks")
  ) {
    return "TASKS_OVERDUE";
  }

  // 3. All tasks / Pending tasks
  if (
    normalized.includes("all tasks") ||
    normalized.includes("list tasks") ||
    normalized.includes("my tasks") ||
    normalized.includes("pending tasks") ||
    normalized.includes("task summary")
  ) {
    return "TASKS_ALL";
  }

  // 4. Upcoming calendar events
  if (
    normalized.includes("upcoming calendar") ||
    normalized.includes("upcoming events") ||
    normalized.includes("calendar summary") ||
    normalized.includes("what events are coming up") ||
    normalized.includes("what's coming up") ||
    normalized.includes("my schedule") ||
    normalized.includes("upcoming schedule") ||
    normalized.includes("next events") ||
    normalized === "summarize my upcoming calendar." ||
    normalized === "summarize my upcoming calendar" ||
    normalized === "calendar" ||
    normalized === "events"
  ) {
    return "CALENDAR_UPCOMING";
  }

  // 5. Today's calendar
  if (
    normalized.includes("events today") ||
    normalized.includes("calendar today") ||
    normalized.includes("today's events") ||
    normalized.includes("schedule today")
  ) {
    return "CALENDAR_TODAY";
  }

  // 6. Focus time this week
  if (
    normalized.includes("focus time this week") ||
    normalized.includes("focus this week") ||
    normalized.includes("focus duration this week") ||
    normalized.includes("how much focus time") ||
    normalized.includes("how long did i focus") ||
    normalized.includes("weekly focus") ||
    normalized.includes("focus sessions this week") ||
    normalized.includes("pomodoro time") ||
    normalized === "how much focus time did i complete this week?" ||
    normalized === "how much focus time did i complete this week" ||
    normalized === "focus" ||
    normalized === "focus stats"
  ) {
    return "FOCUS_WEEKLY";
  }

  // 7. Spending / Finance this month
  if (
    normalized.includes("spending this month") ||
    normalized.includes("spend this month") ||
    normalized.includes("monthly spending") ||
    normalized.includes("expenses this month") ||
    normalized.includes("monthly expenses") ||
    normalized.includes("finance summary") ||
    normalized.includes("spending summary") ||
    normalized.includes("how much did i spend") ||
    normalized.includes("money spent") ||
    normalized === "summarize my spending this month." ||
    normalized === "summarize my spending this month" ||
    normalized === "finance" ||
    normalized === "expenses"
  ) {
    return "FINANCE_MONTHLY";
  }

  // 8. Productivity Overview
  if (
    normalized.includes("overview of my productivity") ||
    normalized.includes("productivity overview") ||
    normalized.includes("productivity summary") ||
    normalized.includes("how productive was i") ||
    normalized.includes("productivity report") ||
    normalized.includes("productivity stats") ||
    normalized.includes("daily summary") ||
    normalized === "give me an overview of my productivity." ||
    normalized === "give me an overview of my productivity" ||
    normalized === "productivity"
  ) {
    return "PRODUCTIVITY_OVERVIEW";
  }

  // 9. Notes Summary
  if (
    normalized.includes("notes summary") ||
    normalized.includes("my notes") ||
    normalized.includes("what notes do i have") ||
    normalized.includes("list notes") ||
    normalized === "notes"
  ) {
    return "NOTES_SUMMARY";
  }

  return null;
}

/**
 * Execute a deterministic local query against the provided workspace context.
 */
export function executeLocalQuery(intent, context) {
  const { tasks, calendar, focus, finance, notes, productivity } = context;

  switch (intent) {
    case "TASKS_DUE_TODAY": {
      const dueTodayList = tasks.dueToday || [];
      const pendingCount = tasks.dueTodayPendingCount;
      const completedCount = tasks.dueTodayCompletedCount;
      const overdueCount = tasks.overdueCount;

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
        text,
        data: { count: dueTodayList.length, pendingCount, completedCount, overdueCount }
      };
    }

    case "TASKS_OVERDUE": {
      const overdueList = tasks.overdue || [];
      if (overdueList.length === 0) {
        return {
          intent,
          status: "success",
          source: "local-engine",
          text: "✨ **Overdue Tasks**\n\nGreat job! You have **0 overdue tasks**.",
          data: { overdueCount: 0 }
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
        text,
        data: { overdueCount: overdueList.length }
      };
    }

    case "TASKS_ALL": {
      return {
        intent,
        status: "success",
        source: "local-engine",
        text: `📋 **Workspace Tasks Summary**\n\n- **Total Tasks:** ${tasks.total}\n- **Completed:** ${tasks.completedCount} (${tasks.completionRate}%)\n- **Pending:** ${tasks.pendingCount}\n- **Due Today:** ${tasks.dueTodayCount}\n- **Overdue:** ${tasks.overdueCount}\n- **High Priority:** ${tasks.highPriorityCount}`,
        data: { total: tasks.total, completed: tasks.completedCount, pending: tasks.pendingCount }
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
        text,
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
        text,
        data: { todayCount: todayList.length }
      };
    }

    case "FOCUS_WEEKLY": {
      const { weekMinutes, weekFormatted, weekSessionsCount, todayFormatted, todaySessionsCount } = focus;
      
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
        text,
        data: { weekMinutes, weekSessionsCount }
      };
    }

    case "FINANCE_MONTHLY": {
      const { monthExpensesFormatted, monthIncomeFormatted, monthBalanceFormatted, monthBalance, topCategory, categoryBreakdown, monthTransactionsCount } = finance;

      let text = `💰 **Monthly Finance Summary**\n\n`;
      text += `- **Total Expenses:** **${monthExpensesFormatted}**\n`;
      text += `- **Total Income:** ${monthIncomeFormatted}\n`;
      text += `- **Net Balance:** **${monthBalanceFormatted}** ${monthBalance >= 0 ? "(Surplus)" : "(Deficit)"}\n`;
      text += `- **Logged Transactions:** ${monthTransactionsCount}\n`;

      if (topCategory) {
        text += `\n🏷️ **Top Spending Category:**\n`;
        text += `- **${topCategory.category}:** ${financeSummaryFormatCurrency(topCategory.amount)} (${topCategory.percentage}% of total expenses)\n`;
      }

      if (categoryBreakdown.length > 1) {
        text += `\n📊 **Breakdown:**\n`;
        categoryBreakdown.slice(0, 4).forEach((c) => {
          text += `• ${c.category}: ${financeSummaryFormatCurrency(c.amount)} (${c.percentage}%)\n`;
        });
      }

      return {
        intent,
        status: "success",
        source: "local-engine",
        text,
        data: { monthExpensesFormatted, monthIncomeFormatted, monthBalanceFormatted }
      };
    }

    case "PRODUCTIVITY_OVERVIEW": {
      const { tasks: pTasks, focus: pFocus, calendar: pCal, finance: pFin, notes: pNotes } = productivity;

      let text = `📊 **PixelDesk Productivity Overview**\n\n`;
      text += `**Tasks Status:**\n`;
      text += `• Completion Rate: **${pTasks.rate}%** (${pTasks.completed}/${pTasks.total} completed)\n`;
      text += `• Due Today: ${pTasks.dueToday} | Overdue: ${pTasks.overdue}\n\n`;

      text += `**Deep Focus:**\n`;
      text += `• Completed this week: **${pFocus.weekFormatted}** (${pFocus.weekSessions} session(s))\n`;
      text += `• Today's Focus: ${pFocus.todayFormatted}\n\n`;

      text += `**Schedule & Workspace:**\n`;
      text += `• Upcoming Events: ${pCal.upcomingEventsCount} (Today: ${pCal.todayEventsCount})\n`;
      text += `• Notes in Pad: ${pNotes.total} (${pNotes.pinned} pinned)\n\n`;

      text += `**Monthly Finance:**\n`;
      text += `• Spending: ${pFin.monthExpenses} | Income: ${pFin.monthIncome} (Net: ${pFin.monthBalance})\n`;

      return {
        intent,
        status: "success",
        source: "local-engine",
        text,
        data: productivity
      };
    }

    case "NOTES_SUMMARY": {
      return {
        intent,
        status: "success",
        source: "local-engine",
        text: `📝 **Notes Pad Summary**\n\n- **Total Notes:** ${notes.total}\n- **Pinned Notes:** ${notes.pinnedCount}\n- **Active Tags:** ${notes.tags.length > 0 ? notes.tags.join(", ") : "None"}\n\n*(Note bodies are kept private and not displayed in general summaries).*`,
        data: { total: notes.total, pinned: notes.pinnedCount }
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
    `PixelDesk Copilot is currently operating in **Deterministic Local Query Mode**.\n\n` +
    `A connected external AI model or backend endpoint is **not configured** in this version. I cannot generate open-ended text, poems, code, or answer general knowledge questions.\n\n` +
    `**What I can answer right now from your real local workspace:**\n` +
    `• 📋 *"What tasks are due today?"*\n` +
    `• 🗓️ *"Summarize my upcoming calendar."*\n` +
    `• ⏱️ *"How much focus time did I complete this week?"*\n` +
    `• 💰 *"Summarize my spending this month."*\n` +
    `• 📊 *"Give me an overview of my productivity."*\n\n` +
    `Click one of the suggested prompts below or ask a question about your Tasks, Calendar, Focus, or Finance!`;

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
 * 
 * When a backend endpoint is configured in later levels, this function will send the
 * query to the authenticated server proxy.
 */
export async function sendToAiBackend({ query: _query, context: _context, history: _history }) {
  if (!isAiBackendConfigured()) {
    throw new Error("AI Backend Endpoint is not configured in this environment.");
  }
  
  // Future implementation:
  // const response = await fetch(COPILOT_CONFIG.BACKEND_ENDPOINT, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ query, context, history })
  // });
  // return await response.json();
}

/**
 * Main query dispatcher for Copilot.
 * Resolves local queries or returns an honest explanation of capabilities.
 */
export async function processCopilotQuery(userMessage, workspaceContext) {
  // Clean whitespace
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
