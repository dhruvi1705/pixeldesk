import React from "react";

export function FocusTaskSelector({
  activeTasks = [],
  selectedTask,
  onSelectTask,
  disabled
}) {
  const handleSelectChange = (e) => {
    const taskId = e.target.value;
    if (!taskId) {
      onSelectTask(null);
      return;
    }
    const task = activeTasks.find((t) => t.id === taskId);
    if (task) {
      onSelectTask(task);
    }
  };

  const handleClear = () => {
    if (!disabled) {
      onSelectTask(null);
    }
  };

  return (
    <div
      className="focus-task-selector pixel-box"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "8px 10px",
        backgroundColor: "var(--surface-dark)",
        border: "1px solid var(--border-subtle)",
        width: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "var(--font-pixel)",
          fontSize: "8px",
          color: "var(--text-secondary)"
        }}
      >
        <span>WORKING ON:</span>
        {selectedTask && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--color-coral)",
              padding: "1px 3px"
            }}
            aria-label="Clear selected task"
          >
            ✕ CLEAR
          </button>
        )}
      </div>

      {/* Selected Task Highlight OR Dropdown */}
      {selectedTask ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--border)",
            padding: "6px 8px",
            boxShadow: "1px 1px 0 var(--shadow)",
            gap: "6px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
            <span style={{ fontSize: "14px" }}>📋</span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={selectedTask.title}
            >
              {selectedTask.title}
            </span>
          </div>

          <span
            className="pixel-tag"
            style={{
              fontSize: "7.5px",
              backgroundColor: "var(--color-teal-light)",
              borderColor: "var(--color-teal)",
              color: "var(--color-navy)",
              flexShrink: 0
            }}
          >
            ACTIVE
          </span>
        </div>
      ) : (
        <select
          value=""
          onChange={handleSelectChange}
          disabled={disabled}
          className="pixel-input"
          style={{
            fontSize: "12.5px",
            padding: "6px 8px",
            backgroundColor: "#ffffff",
            cursor: disabled ? "not-allowed" : "pointer"
          }}
          aria-label="Select an active task to focus on"
        >
          <option value="">Select a task from Tasks app...</option>
          {activeTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title} ({task.category || "General"})
            </option>
          ))}
          {activeTasks.length === 0 && (
            <option value="" disabled>
              (No active tasks found in Tasks app)
            </option>
          )}
        </select>
      )}
    </div>
  );
}
