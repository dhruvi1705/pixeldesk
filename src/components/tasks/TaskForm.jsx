import React, { useState } from "react";
import { TASK_CATEGORIES, TASK_PRIORITIES } from "../../data/taskCategories";

export function TaskForm({
  initialTask = null,
  onSave,
  onCancel
}) {
  const isEditing = !!initialTask;

  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || "");
  const [priority, setPriority] = useState(initialTask?.priority || "Medium");
  const [category, setCategory] = useState(initialTask?.category || "Other");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    if (trimmedTitle.length > 100) {
      setError("Task title cannot exceed 100 characters.");
      return;
    }

    setError("");
    onSave({
      title: trimmedTitle,
      description: description.trim(),
      dueDate,
      priority,
      category
    });
  };

  return (
    <div
      role="dialog"
      aria-label={isEditing ? "Edit Task" : "Create New Task"}
      className="task-form-overlay animate-window-pop"
      style={{
        border: "2px solid var(--border)",
        backgroundColor: "var(--surface)",
        boxShadow: "var(--pixel-shadow)",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      {/* Form Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "8px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>{isEditing ? "✏️" : "📝"}</span>
          <h3
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "10px",
              margin: 0,
              color: "var(--text-primary)"
            }}
          >
            {isEditing ? "EDIT TASK" : "CREATE NEW TASK"}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close task form"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--text-primary)"
          }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Task Title Field */}
        <div className="pixel-form-group">
          <label htmlFor="task-title-input" className="pixel-label">
            <span>
              Task Title <span style={{ color: "var(--color-coral)" }}>*</span>
            </span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-secondary)" }}>
              {title.length}/100
            </span>
          </label>
          <input
            id="task-title-input"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Finish project documentation"
            maxLength={100}
            required
            autoFocus
            className={`pixel-input ${error ? "error" : ""}`}
            style={{
              height: "34px",
              padding: "6px 10px",
              fontSize: "14px"
            }}
          />
          {error && (
            <p className="pixel-error-message" role="alert" style={{ fontSize: "8px", margin: "2px 0 0 0" }}>
              ▶ {error}
            </p>
          )}
        </div>

        {/* Task Description Field */}
        <div className="pixel-form-group">
          <label htmlFor="task-desc-input" className="pixel-label">
            <span>Description</span>
            <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", color: "var(--text-secondary)" }}>
              Optional
            </span>
          </label>
          <textarea
            id="task-desc-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add relevant notes, links, or subtasks..."
            rows={3}
            maxLength={250}
            className="pixel-input"
            style={{
              padding: "6px 10px",
              fontSize: "13px",
              fontFamily: "var(--font-body)",
              resize: "vertical"
            }}
          />
        </div>

        {/* Row with Due Date, Priority, Category */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "10px"
          }}
        >
          {/* Due Date */}
          <div className="pixel-form-group">
            <label htmlFor="task-due-date" className="pixel-label">
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="pixel-input"
              style={{
                height: "34px",
                padding: "4px 8px",
                fontSize: "13px"
              }}
            />
          </div>

          {/* Priority */}
          <div className="pixel-form-group">
            <label htmlFor="task-priority" className="pixel-label">
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="pixel-input"
              style={{
                height: "34px",
                padding: "4px 8px",
                fontSize: "13px",
                backgroundColor: "#ffffff",
                cursor: "pointer"
              }}
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="pixel-form-group">
            <label htmlFor="task-category" className="pixel-label">
              Category
            </label>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pixel-input"
              style={{
                height: "34px",
                padding: "4px 8px",
                fontSize: "13px",
                backgroundColor: "#ffffff",
                cursor: "pointer"
              }}
            >
              {TASK_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "6px",
            paddingTop: "8px",
            borderTop: "1.5px solid var(--border-subtle)"
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="pixel-button"
            style={{ fontSize: "8.5px", padding: "6px 12px" }}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="pixel-button pixel-button-primary"
            style={{ fontSize: "8.5px", padding: "6px 14px", display: "inline-flex", gap: "6px" }}
          >
            <span>💾</span>
            <span>{isEditing ? "SAVE CHANGES" : "ADD TASK"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
