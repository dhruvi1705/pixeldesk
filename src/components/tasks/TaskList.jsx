import React from "react";
import { TaskItem } from "./TaskItem";

export function TaskList({
  tasks,
  totalTasksCount,
  activeFilter,
  searchQuery,
  onToggle,
  onEdit,
  onDelete,
  onNewTask,
  onLoadStarterTasks
}) {
  // Empty states handling
  if (tasks.length === 0) {
    if (searchQuery) {
      return (
        <div
          className="task-empty-state"
          style={{
            border: "1.5px dashed var(--border-subtle)",
            padding: "28px 16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--surface-dark)"
          }}
        >
          <span style={{ fontSize: "24px" }}>🔍</span>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "var(--text-primary)",
              margin: 0
            }}
          >
            No matching tasks found.
          </p>
          <p
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "15px",
              color: "var(--text-secondary)",
              margin: 0
            }}
          >
            Try adjusting your search query or clear the filter.
          </p>
        </div>
      );
    }

    if (activeFilter === "COMPLETED") {
      return (
        <div
          className="task-empty-state"
          style={{
            border: "1.5px dashed var(--border-subtle)",
            padding: "28px 16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--surface-dark)"
          }}
        >
          <span style={{ fontSize: "24px" }}>☑️</span>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "var(--text-primary)",
              margin: 0
            }}
          >
            No completed tasks yet.
          </p>
          <p
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "15px",
              color: "var(--text-secondary)",
              margin: 0
            }}
          >
            Check off tasks as you finish them to see them here!
          </p>
        </div>
      );
    }

    if (activeFilter === "TODAY") {
      return (
        <div
          className="task-empty-state"
          style={{
            border: "1.5px dashed var(--border-subtle)",
            padding: "28px 16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--surface-dark)"
          }}
        >
          <span style={{ fontSize: "24px" }}>☀️</span>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9px",
              color: "var(--text-primary)",
              margin: 0
            }}
          >
            No tasks due today.
          </p>
          <p
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "15px",
              color: "var(--text-secondary)",
              margin: 0
            }}
          >
            Enjoy your free schedule or create a task for today.
          </p>
          <button
            type="button"
            onClick={onNewTask}
            className="pixel-button pixel-button-primary pixel-button-sm"
            style={{ marginTop: "4px" }}
          >
            + NEW TASK
          </button>
        </div>
      );
    }

    if (totalTasksCount === 0) {
      return (
        <div
          className="task-empty-state"
          style={{
            border: "2px dashed var(--border)",
            padding: "32px 16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "var(--surface-dark)"
          }}
        >
          <span style={{ fontSize: "28px", lineHeight: 1 }}>📋</span>
          <div>
            <p
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "10px",
                color: "var(--text-primary)",
                margin: "0 0 4px 0"
              }}
            >
              No tasks yet.
            </p>
            <p
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "16px",
                color: "var(--text-secondary)",
                margin: 0
              }}
            >
              Create your first task and get started.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "4px" }}>
            <button
              type="button"
              onClick={onNewTask}
              className="pixel-button pixel-button-primary"
              style={{ display: "inline-flex", gap: "6px" }}
            >
              <span>+</span>
              <span>NEW TASK</span>
            </button>
            {onLoadStarterTasks && (
              <button
                type="button"
                onClick={onLoadStarterTasks}
                className="pixel-button"
                style={{ fontSize: "8px" }}
              >
                LOAD DEMO TASKS
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className="task-empty-state"
        style={{
          border: "1.5px dashed var(--border-subtle)",
          padding: "24px 16px",
          textAlign: "center",
          backgroundColor: "var(--surface-dark)"
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          No tasks match the selected filter.
        </p>
      </div>
    );
  }

  return (
    <div
      className="task-items-list"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
