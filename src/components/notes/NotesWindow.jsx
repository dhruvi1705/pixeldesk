import React, { useState } from "react";
import { useNotes } from "../../hooks/useNotes";
import { NoteSearch } from "./NoteSearch";
import { NoteFilters } from "./NoteFilters";
import { NoteTags } from "./NoteTags";
import { NotesList } from "./NotesList";
import { NoteEditor } from "./NoteEditor";

export function NotesWindow({ onClose: _onClose }) {
  const {
    notes,
    filteredNotes,
    stats,
    activeFilter,
    setActiveFilter,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    loadStarterNotes
  } = useNotes();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      createNote(noteData);
    }
    handleCloseEditor();
  };

  const handleDeleteFromEditor = (id) => {
    deleteNote(id);
    handleCloseEditor();
  };

  // Filter counts for badges
  const filterCounts = {
    ALL: stats.total,
    PINNED: stats.pinned
  };

  // Unique tags for tag filter bar
  const availableTags = Object.keys(stats.tagCounts || {});

  return (
    <div
      className="notes-app-window"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "var(--font-body)",
        maxWidth: "100%"
      }}
    >
      {/* Subtitle Banner Header */}
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
            "Keep your thoughts in one little place."
          </p>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)",
              margin: "3px 0 0 0"
            }}
          >
            RETRO SCRATCHPAD & THOUGHT LOG
          </p>
        </div>

        {/* Notes Lavender Accent Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "var(--color-lavender-light)",
            border: "1.5px solid var(--color-lavender)",
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
              backgroundColor: "var(--color-lavender)",
              display: "inline-block"
            }}
            aria-hidden="true"
          />
          <span>NOTES v0.4</span>
        </div>
      </header>

      {/* Main Content Area: Either Editor or List */}
      {isEditorOpen ? (
        <NoteEditor
          initialNote={editingNote}
          onSave={handleSaveNote}
          onCancel={handleCloseEditor}
          onDelete={editingNote ? handleDeleteFromEditor : undefined}
        />
      ) : (
        <>
          {/* Action Row: Create Note & Search */}
          <div
            className="notes-action-row"
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
              onClick={handleOpenCreate}
              className="pixel-button pixel-button-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                backgroundColor: "var(--color-lavender)",
                color: "#FFFFFF"
              }}
            >
              <span>+</span>
              <span>NEW NOTE</span>
            </button>

            <NoteSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
            />
          </div>

          {/* Filter Bar */}
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
            <NoteFilters
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              counts={filterCounts}
              selectedTag={selectedTag}
              onClearTag={() => setSelectedTag(null)}
            />

            {searchQuery && (
              <span
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "14px",
                  color: "var(--text-secondary)"
                }}
              >
                {filteredNotes.length} {filteredNotes.length === 1 ? "result" : "results"}
              </span>
            )}
          </div>

          {/* Tag Filter Chips (if any tags exist) */}
          {availableTags.length > 0 && (
            <div style={{ padding: "0 2px" }}>
              <NoteTags
                tags={availableTags}
                isFilter={true}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
              />
            </div>
          )}

          {/* Scrollable Notes List */}
          <main
            style={{
              maxHeight: "360px",
              overflowY: "auto",
              paddingRight: "2px",
              paddingBottom: "4px"
            }}
          >
            <NotesList
              notes={filteredNotes}
              totalNotesCount={notes.length}
              activeFilter={activeFilter}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onEdit={handleOpenEdit}
              onDelete={deleteNote}
              onTogglePin={togglePin}
              onNewNote={handleOpenCreate}
              onLoadStarterNotes={notes.length === 0 ? loadStarterNotes : undefined}
            />
          </main>
        </>
      )}
    </div>
  );
}
