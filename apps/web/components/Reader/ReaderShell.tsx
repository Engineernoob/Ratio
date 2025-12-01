"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, X, Sparkles } from "lucide-react";
import { ChapterSidebar } from "./ChapterSidebar";
import { ChapterContent } from "./ChapterContent";
import { CodexReader } from "./CodexReader";
import { NotesPanel } from "./NotesPanel";
import { LightVignette } from "@/components/ui/LightVignette";
import type {
  BookChapterRef,
  ChapterContent as ChapterContentType,
  BookManifest,
} from "@/lib/books/types";
import type { Highlight } from "@/lib/notes/types";

interface ReaderShellProps {
  bookTitle: string;
  author?: string;
  chapters: BookChapterRef[];
  currentChapter: ChapterContentType | null;
  selectedChapter: BookChapterRef | null;
  onSelectChapter: (chapter: BookChapterRef) => void;
  manifest: BookManifest;
  pdfPath?: string;
  notes: Highlight[];
  onSelectNote: (note: Highlight) => void;
  onHighlightCreated?: () => void;
}

export function ReaderShell({
  bookTitle,
  author,
  chapters,
  currentChapter,
  selectedChapter,
  onSelectChapter,
  manifest,
  pdfPath,
  notes,
  onSelectNote,
  onHighlightCreated,
}: ReaderShellProps) {
  const [showNotesPanel, setShowNotesPanel] = useState(true);
  const [ritualMode, setRitualMode] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 flex"
      style={{
        background: ritualMode ? "#000000" : "#0A0A0A",
      }}
      animate={{
        background: ritualMode ? "#000000" : "#0A0A0A",
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Dithering texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url('/images/textures/texture_bayer.png')",
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Ritual Mode Vignette (stronger when active) */}

      {/* Ritual Mode Toggle Button */}
      <div className="absolute top-4 left-4 z-30">
        <motion.button
          onClick={() => setRitualMode(!ritualMode)}
          className="p-3 rounded-full transition-all"
          style={{
            background: ritualMode
              ? "rgba(200, 182, 141, 0.2)"
              : "rgba(200, 182, 141, 0.1)",
            border: "1px solid rgba(200, 182, 141, 0.2)",
            color: "#C8B68D",
          }}
          whileHover={{
            background: "rgba(200, 182, 141, 0.25)",
            scale: 1.1,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={18} />
        </motion.button>
      </div>

      {/* Main Layout - Responsive */}
      <div className="relative flex-1 flex h-full w-full">
        {/* Left Sidebar - Chapters */}
        <AnimatePresence>
          {!ritualMode && (
            <motion.div
              className="shrink-0"
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <ChapterSidebar
                chapters={chapters}
                selectedChapterId={selectedChapter?.id || null}
                onSelectChapter={onSelectChapter}
                bookTitle={bookTitle}
                author={author}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Panel - CodexReader */}
        <motion.div
          className="flex-1 flex flex-col border-r min-w-0"
          style={{ borderColor: "rgba(200, 182, 141, 0.1)" }}
          animate={{
            marginLeft: ritualMode ? "auto" : 0,
            marginRight: ritualMode ? "auto" : 0,
            maxWidth: ritualMode ? "1200px" : "100%",
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-[600px] w-full shrink-0 relative"
            style={{
              background: "#0A0A0A",
              borderBottom: "1px solid rgba(200, 182, 141, 0.1)",
            }}
            animate={{
              scale: ritualMode ? 1.05 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <CodexReader
              bookId={manifest.id}
              manifest={manifest}
              pdfPath={pdfPath}
              selectedChapter={selectedChapter}
              onHighlightCreated={onHighlightCreated}
              ritualMode={ritualMode}
            />
          </motion.div>

          {/* Chapter Content */}
          <AnimatePresence>
            {!ritualMode && (
              <motion.div
                className="flex-1 overflow-hidden min-h-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ChapterContent chapter={currentChapter} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Toggle Notes Panel Button */}
        <AnimatePresence>
          {!ritualMode && (
            <motion.div
              className="absolute top-4 right-4 z-30"
              style={{ right: showNotesPanel ? "280px" : "20px" }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={() => setShowNotesPanel(!showNotesPanel)}
                className="p-3 rounded-full transition-all"
                style={{
                  background: showNotesPanel
                    ? "rgba(200, 182, 141, 0.15)"
                    : "rgba(200, 182, 141, 0.1)",
                  border: "1px solid rgba(200, 182, 141, 0.2)",
                  color: "#C8B68D",
                }}
                whileHover={{
                  background: "rgba(200, 182, 141, 0.2)",
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {showNotesPanel ? <X size={18} /> : <StickyNote size={18} />}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Sidebar - Notes Panel */}
        <AnimatePresence>
          {showNotesPanel && !ritualMode && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-64 shrink-0 border-l"
              style={{
                background: "rgba(10, 10, 10, 0.95)",
                borderColor: "rgba(200, 182, 141, 0.1)",
              }}
            >
              <NotesPanel
                notes={notes}
                chapters={chapters}
                onSelectNote={onSelectNote}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
