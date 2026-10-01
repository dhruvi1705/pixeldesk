import React, { useState } from "react";
import { formatTaskDueDate, TASK_CATEGORIES, TASK_PRIORITIES } from "../../data/taskCategories";

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dueInfo = formatTaskDueDate(task.dueDate);
  const categoryInfo = TASK_CATEGORIES.find((c) => c.id === task.category) || TASK_CATEGORIES[3];
  const priorityInfo = TASK_PRIORITIES.find((p) => p.id === task.priority) || TASK_PRIORITIES[1];

  const isCompleted = task.completed;
  const isOverdue = !isCompleted && dueInfo?.isOverdue;

  return (
    <article
      aria-label={`Task: ${task.title}`}
      className={`task-item-card ${isCompleted ? "task-completed" : ""} ${isOverdue ? "task-overdue" : ""}`}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "10px 12px",
        backgroundColor: isCompleted ? "var(--surface-dark)" : "#ffffff",
        border: isOverdue
          ? "2px solid var(--color-coral)"
          : isCompleted
          ? "1.5px solid var(--border-subtle)"
          : "2px solid var(--border)",
        boxShadow: isCompleted ? "none" : "2px 2px 0 var(--shadow)",
        borderRadius: "0px",
        transition: "background-color 0.15s ease, opacity 0.15s ease, border-color 0.15s ease",
        opacity: isCompleted ? 0.75 : 1
      }}
    >
      {/* Pixel Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isCompleted}
        aria-label={`Mark "${task.title}" as ${isCompleted ? "incomplete" : "complete"}`}
        onClick={() => onToggle(task.id)}
        style={{
          width: "20px",
          height: "20px",
          marginTop: "2px",
          backgroundColor: isCompleted ? "var(--color-teal)" : "#ffffff",
          border: isCompleted ? "2px solid var(--color-navy)" : "2px solid var(--border)",
          boxShadow: isCompleted ? "none" : "1px 1px 0 var(--shadow)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: 0,
          color: "#ffffff",
          fontFamily: "var(--font-pixel)",
          fontSize: "11px",
          lineHeight: 1
        }}
        className="task-checkbox-btn"
      >
        {isCompleted ? "✓" : ""}
      </button>

      {/* Task Content Column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title Row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 600,
              color: isCompleted ? "var(--text-secondary)" : "var(--text-primary)",
              textDecoration: isCompleted ? "line-through" : "none",
              margin: 0,
              wordBreak: "break-word"
            }}
          >
            {task.title}
          </h4>

          {/* Priority Badge */}
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              padding: "2px 5px",
              border: "1px solid var(--border)",
              boxShadow: "1px 1px 0 var(--shadow)",
              backgroundColor: priorityInfo.color,
              color: priorityInfo.id === "High" ? "#ffffff" : "var(--color-navy)",
              flexShrink: 0,
              lineHeight: 1
            }}
          >
            {priorityInfo.badge}
          </span>
        </div>

        {/* Optional Description */}
        {task.description && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: isCompleted ? "var(--text-muted)" : "var(--text-secondary)",
              margin: "3px 0 6px 0",
              wordBreak: "break-word",
              lineHeight: 1.35
            }}
          >
            {task.description}
          </p>
        )}

        {/* Meta details & action row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "6px"
          }}
        >
          {/* Category & Due Date tags */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {/* Category */}
            <span
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "14px",
                backgroundColor: "var(--surface-dark)",
                border: "1px solid var(--border-subtle)",
                padding: "0 6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--text-primary)"
              }}
            >
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.label}</span>
            </span>

            {/* Due Date */}
            {dueInfo && (
              <span
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "14px",
                  padding: "0 6px",
                  border: isOverdue ? "1px solid var(--color-coral)" : "1px solid var(--border-subtle)",
                  backgroundColor: isOverdue
                    ? "var(--color-coral-light)"
                    : dueInfo.isToday
                    ? "var(--color-yellow-light)"
                    : "var(--surface-dark)",
                  color: isOverdue ? "var(--color-coral)" : "var(--text-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <span>{isOverdue ? "⚠️ Overdue:" : dueInfo.isToday ? "⏰" : "📅"}</span>
                <span>{dueInfo.text}</span>
              </span>
            )}
          </div>

          {/* Action Buttons: Edit & Delete */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {confirmDelete ? (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "7px",
                    color: "var(--color-coral)"
                  }}
                >
                  DELETE?
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  aria-label={`Confirm delete task "${task.title}"`}
                  className="pixel-button pixel-button-sm pixel-button-primary"
                  style={{ fontSize: "7px", padding: "2px 5px" }}
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="pixel-button pixel-button-sm"
                  style={{ fontSize: "7px", padding: "2px 5px" }}
                >
                  NO
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  aria-label={`Edit task "${task.title}"`}
                  className="pixel-button pixel-button-sm"
                  style={{ fontSize: "7.5px", padding: "2px 6px" }}
                >
                  EDIT
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  aria-label={`Delete task "${task.title}"`}
                  className="pixel-button pixel-button-sm"
                  style={{
                    fontSize: "7.5px",
                    padding: "2px 6px",
                    color: "var(--color-coral)",
                    borderColor: "var(--color-coral)"
                  }}
                >
                  DEL
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
