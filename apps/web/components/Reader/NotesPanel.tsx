"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import type { Highlight } from "@/lib/notes/types";
import type { BookChapterRef } from "@/lib/books/types";

interface NotesPanelProps {
  bookId: string;
  chapterId?: string;
  highlights: Highlight[];
  onNoteCreated: (note: {
    chapterId?: string;
    selectionId?: string;
    text: string;
  }) => void;
  onClose: () => void;
}

export function NotesPanel({
  bookId,
  chapterId,
  highlights,
  onNoteCreated,
  onClose,
}: NotesPanelProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(
    null
  );

  // Group notes by chapter
  const notesByChapter = useMemo(() => {
    const grouped = new Map<string, Highlight[]>();

    highlights.forEach((note) => {
      const chId = note.chapterId || "uncategorized";
      if (!grouped.has(chId)) {
        grouped.set(chId, []);
      }
      grouped.get(chId)!.push(note);
    });

    // Sort notes within each chapter by page, then by timestamp
    grouped.forEach((chapterNotes) => {
      chapterNotes.sort((a, b) => {
        if (a.pageNumber !== b.pageNumber) {
          return a.pageNumber - b.pageNumber;
        }
        return (
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    });

    return grouped;
  }, [highlights]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    await onNoteCreated({
      chapterId,
      selectionId: selectedHighlightId || undefined,
      text: noteText,
    });

    setNoteText("");
    setSelectedHighlightId(null);
    setShowAddNote(false);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 80): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "…";
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-80 h-full border-l flex flex-col"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        borderColor: "rgba(200, 182, 141, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header */}
      <div
        className="p-6 border-b shrink-0 flex items-center justify-between"
        style={{ borderColor: "rgba(200, 182, 141, 0.1)" }}
      >
        <div>
          <h2 className="font-serif text-lg mb-1" style={{ color: "#C8B68D" }}>
            Notes
          </h2>
          <p
            className="font-mono text-xs opacity-60"
            style={{ color: "#C8B68D" }}
          >
            {highlights.length} {highlights.length === 1 ? "note" : "notes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddNote(!showAddNote)}
            className="p-2 rounded transition-colors"
            style={{ color: "#C8B68D" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(200, 182, 141, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Plus size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded transition-colors"
            style={{ color: "#C8B68D" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(200, 182, 141, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(200, 182, 141, 0.1)" }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note..."
            className="w-full p-3 rounded font-mono text-sm resize-none"
            style={{
              background: "rgba(200, 182, 141, 0.05)",
              border: "1px solid rgba(200, 182, 141, 0.1)",
              color: "#C8B68D",
              minHeight: "100px",
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddNote}
              className="px-4 py-2 rounded font-mono text-sm transition-colors"
              style={{
                background: "rgba(200, 182, 141, 0.2)",
                border: "1px solid rgba(200, 182, 141, 0.3)",
                color: "#C8B68D",
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setNoteText("");
                setShowAddNote(false);
              }}
              className="px-4 py-2 rounded font-mono text-sm transition-colors"
              style={{
                background: "transparent",
                border: "1px solid rgba(200, 182, 141, 0.1)",
                color: "#C8B68D",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {highlights.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <p
            className="font-mono text-xs text-center opacity-40"
            style={{ color: "#C8B68D" }}
          >
            No notes yet.
            <br />
            Select text to create highlights.
          </p>
        </div>
      )}

      {/* Scrollable content with shadow overlays */}
      {highlights.length > 0 && (
        <div className="flex-1 overflow-y-auto relative">
        {/* Top shadow */}
        <div
          className="sticky top-0 h-8 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10, 10, 10, 0.8), transparent)",
          }}
        />

        {/* Notes grouped by chapter */}
        <div className="p-4 space-y-6">
          {Array.from(notesByChapter.entries()).map(([chId, chapterNotes]) => (
            <div key={chId} className="space-y-3">
              {/* Chapter header */}
              <div
                className="pb-2 border-b"
                style={{ borderColor: "rgba(200, 182, 141, 0.1)" }}
              >
                <h3
                  className="font-serif text-sm"
                  style={{ color: "rgba(200, 182, 141, 0.8)" }}
                >
                  {chId === "uncategorized" ? "Uncategorized" : chId}
                </h3>
              </div>

              {/* Notes in this chapter */}
              <div className="space-y-2">
                {chapterNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    className="w-full text-left p-3 rounded border"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(200, 182, 141, 0.05)",
                    }}
                  >
                    {/* Page marker */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="font-mono text-xs opacity-40"
                        style={{ color: "#C8B68D" }}
                      >
                        Page {note.pageNumber}
                      </span>
                      <span
                        className="font-mono text-xs opacity-30"
                        style={{ color: "#C8B68D" }}
                      >
                        •
                      </span>
                      <span
                        className="font-mono text-xs opacity-40"
                        style={{ color: "#C8B68D" }}
                      >
                        {formatTimestamp(note.timestamp)}
                      </span>
                    </div>

                    {/* Text preview */}
                    <p
                      className="font-mono text-xs leading-relaxed mb-2"
                      style={{ color: "rgba(200, 182, 141, 0.7)" }}
                    >
                      {truncateText(note.text)}
                    </p>

                    {/* Tags (if any) */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 rounded text-xs font-mono"
                            style={{
                              background: "rgba(200, 182, 141, 0.1)",
                              color: "rgba(200, 182, 141, 0.6)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom shadow */}
        <div
          className="sticky bottom-0 h-8 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(10, 10, 10, 0.8), transparent)",
          }}
        />
        </div>
      )}
    </motion.div>
  );
}
