import React, { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { TaskProgress } from "./TaskProgress";
import { TaskFilters } from "./TaskFilters";
import { TaskSearch } from "./TaskSearch";
import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";
import { getLocalDateString } from "../../data/taskCategories";

export function TaskWindow({ onClose: _onClose }) {
  const {
    tasks,
    filteredTasks,
    stats,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    loadStarterTasks
  } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleOpenCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSaveForm = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      createTask(taskData);
    }
    handleCloseForm();
  };

  // Filter counts
  const todayStr = getLocalDateString();
  const filterCounts = {
    ALL: tasks.length,
    TODAY: tasks.filter((t) => t.dueDate === todayStr).length,
    UPCOMING: tasks.filter((t) => !t.completed && t.dueDate && t.dueDate > todayStr).length,
    COMPLETED: tasks.filter((t) => t.completed).length
  };

  return (
    <div
      className="task-app-window"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "var(--font-body)",
        maxWidth: "100%"
      }}
    >
      {/* Subtitle Banner */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "8px",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "19px",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.2
            }}
          >
            "Get things done, one pixel at a time."
          </p>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)",
              margin: "3px 0 0 0"
            }}
          >
            LOCAL RETRO TASK MANAGEMENT
          </p>
        </div>

        {/* Productivity Teal Accent Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "var(--color-teal-light)",
            border: "1.5px solid var(--color-teal)",
            padding: "2px 8px",
            fontFamily: "var(--font-retro)",
            fontSize: "15px",
            color: "var(--color-navy)"
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "var(--color-teal)",
              display: "inline-block"
            }}
            aria-hidden="true"
          />
          <span>TASKS v0.3</span>
        </div>
      </header>

      {/* Progress Section */}
      <TaskProgress stats={stats} />

      {/* Action Row: Create Task & Search */}
      <div
        className="task-action-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        <button
          type="button"
          onClick={handleOpenCreateForm}
          className="pixel-button pixel-button-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px"
          }}
        >
          <span>+</span>
          <span>NEW TASK</span>
        </button>

        <TaskSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "8px"
        }}
      >
        <TaskFilters
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={filterCounts}
        />

        {searchQuery && (
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "14px",
              color: "var(--text-secondary)"
            }}
          >
            {filteredTasks.length} {filteredTasks.length === 1 ? "result" : "results"}
          </span>
        )}
      </div>

      {/* Task Creation / Edit Form Overlay */}
      {isFormOpen && (
        <TaskForm
          initialTask={editingTask}
          onSave={handleSaveForm}
          onCancel={handleCloseForm}
        />
      )}

      {/* Task List */}
      <main
        style={{
          maxHeight: "340px",
          overflowY: "auto",
          paddingRight: "2px"
        }}
      >
        <TaskList
          tasks={filteredTasks}
          totalTasksCount={tasks.length}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onToggle={toggleTask}
          onEdit={handleOpenEditForm}
          onDelete={deleteTask}
          onNewTask={handleOpenCreateForm}
          onLoadStarterTasks={tasks.length === 0 ? loadStarterTasks : undefined}
        />
      </main>
    </div>
  );
}
