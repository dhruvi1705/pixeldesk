import test from "node:test";
import assert from "node:assert/strict";
import {
  detectQueryIntent,
  executeLocalQuery,
  normalizeQuery,
  processCopilotQuery
} from "../src/utils/copilotService.js";

test("normalizeQuery removes punctuation and normalizes whitespace", () => {
  assert.equal(normalizeQuery("  How many tasks have I completed?!!  "), "how many tasks have i completed");
  assert.equal(normalizeQuery("What tasks are due soon???"), "what tasks are due soon");
  assert.equal(normalizeQuery("Show my pending tasks."), "show my pending tasks");
});

test("detectQueryIntent recognizes completed-task queries", () => {
  const completedQueries = [
    "How many tasks have I completed?",
    "Show my completed tasks.",
    "What work have I finished?",
    "Give me my task completion progress.",
    "completed tasks",
    "done tasks",
    "finished tasks",
    "what tasks are completed",
    "tasks completed",
    "what have I completed",
    "what have I finished"
  ];

  for (const q of completedQueries) {
    assert.equal(detectQueryIntent(q), "TASKS_COMPLETED", `Failed to match query: "${q}"`);
  }
});

test("detectQueryIntent recognizes upcoming-deadline queries", () => {
  const deadlineQueries = [
    "What tasks are due soon?",
    "What deadlines are coming up?",
    "Which tasks should I finish soon?",
    "Upcoming deadlines",
    "Upcoming tasks",
    "What is due soon?",
    "Tasks due this week"
  ];

  for (const q of deadlineQueries) {
    assert.equal(detectQueryIntent(q), "TASKS_DUE_SOON", `Failed to match query: "${q}"`);
  }
});

test("detectQueryIntent recognizes overdue and today task queries", () => {
  assert.equal(detectQueryIntent("Show my overdue tasks."), "TASKS_OVERDUE");
  assert.equal(detectQueryIntent("What do I need to finish today?"), "TASKS_DUE_TODAY");
  assert.equal(detectQueryIntent("What tasks are due today?"), "TASKS_DUE_TODAY");
});

test("detectQueryIntent recognizes pending task queries", () => {
  assert.equal(detectQueryIntent("Show my pending tasks"), "TASKS_PENDING");
  assert.equal(detectQueryIntent("What tasks are pending?"), "TASKS_PENDING");
  assert.equal(detectQueryIntent("What do I have left to do?"), "TASKS_PENDING");
});

test("executeLocalQuery for TASKS_COMPLETED formats real counts accurately", () => {
  const mockContext = {
    tasks: {
      total: 5,
      completedCount: 3,
      completionRate: 60,
      completedList: [
        { id: "t1", title: "Build backend", category: "Work", priority: "High", completed: true },
        { id: "t2", title: "Write tests", category: "Work", priority: "Medium", completed: true },
        { id: "t3", title: "Buy groceries", category: "Personal", priority: "Low", completed: true }
      ]
    }
  };

  const result = executeLocalQuery("TASKS_COMPLETED", mockContext);
  assert.equal(result.status, "success");
  assert.equal(result.data.completedCount, 3);
  assert.equal(result.data.completionRate, 60);
  assert.match(result.text, /3\/5 • 60% Complete/);
  assert.match(result.text, /Build backend/);
  assert.match(result.text, /Write tests/);
  assert.match(result.text, /Buy groceries/);
});

test("executeLocalQuery for TASKS_COMPLETED handles 0 completed tasks", () => {
  const mockContext = {
    tasks: {
      total: 4,
      completedCount: 0,
      completionRate: 0,
      completedList: []
    }
  };

  const result = executeLocalQuery("TASKS_COMPLETED", mockContext);
  assert.equal(result.status, "success");
  assert.equal(result.data.completedCount, 0);
  assert.match(result.text, /0 of 4 finished/);
});

test("executeLocalQuery for TASKS_DUE_SOON separates overdue, today, and upcoming", () => {
  const mockContext = {
    tasks: {
      total: 6,
      pendingCount: 4,
      overdueList: [{ id: "t1", title: "Tax filing", dueDate: "2026-10-01", priority: "High" }],
      dueTodayPendingList: [{ id: "t2", title: "Team standup prep", category: "Work", priority: "High" }],
      upcomingList: [{ id: "t3", title: "Sprint review", dueDate: "2026-10-15", category: "Work" }]
    }
  };

  const result = executeLocalQuery("TASKS_DUE_SOON", mockContext);
  assert.equal(result.status, "success");
  assert.equal(result.data.totalDueSoon, 3);
  assert.match(result.text, /Overdue \(1\)/);
  assert.match(result.text, /Tax filing/);
  assert.match(result.text, /Due Today \(1\)/);
  assert.match(result.text, /Team standup prep/);
  assert.match(result.text, /Upcoming Deadlines \(1\)/);
  assert.match(result.text, /Sprint review/);
});

test("executeLocalQuery for TASKS_DUE_SOON handles empty deadlines gracefully", () => {
  const mockContext = {
    tasks: {
      total: 2,
      pendingCount: 2,
      overdueList: [],
      dueTodayPendingList: [],
      upcomingList: []
    }
  };

  const result = executeLocalQuery("TASKS_DUE_SOON", mockContext);
  assert.equal(result.status, "success");
  assert.equal(result.data.totalDueSoon, 0);
  assert.match(result.text, /none have an immediate deadline set/);
});

test("processCopilotQuery dispatches correctly end-to-end", async () => {
  const mockContext = {
    tasks: {
      total: 3,
      completedCount: 2,
      completionRate: 67,
      completedList: [
        { id: "1", title: "Deploy release", completed: true },
        { id: "2", title: "Review PR", completed: true }
      ]
    }
  };

  const response = await processCopilotQuery("How many tasks have I completed?", mockContext);
  assert.equal(response.status, "success");
  assert.equal(response.intent, "TASKS_COMPLETED");
  assert.match(response.text, /Deploy release/);
});
