"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { PageHeader } from "./PageHeader";
import { ReadingSettings } from "./ReadingSettings";
import { ChapterNavigation } from "./ChapterNavigation";
import { HighlightSystem } from "./HighlightSystem";
import { NotesPanel } from "./NotesPanel";
import { AIToolsPanel } from "./AIToolsPanel";
import { BookmarkPanel } from "./BookmarkPanel";
import { PageTransition } from "./PageTransition";
import type { BookManifest, BookChapterRef, ChapterContent } from "@/lib/books/types";
import type { Highlight } from "@/lib/notes/types";

interface AdvancedCodexReaderProps {
  bookId: string;
  manifest: BookManifest;
  currentChapter: ChapterContent | null;
  selectedChapter: BookChapterRef | null;
  onSelectChapter: (chapter: BookChapterRef) => void;
  highlights: Highlight[];
  onHighlightCreated: (highlight: {
    pageNumber: number;
    text: string;
    bounds: DOMRect;
    chapterId?: string;
  }) => void;
  onNoteCreated: (note: {
    chapterId?: string;
    selectionId?: string;
    text: string;
  }) => void;
}

export function AdvancedCodexReader({
  bookId,
  manifest,
  currentChapter,
  selectedChapter,
  onSelectChapter,
  highlights,
  onHighlightCreated,
  onNoteCreated,
}: AdvancedCodexReaderProps) {
  const { currentTheme } = useTheme();
  const [readingMode, setReadingMode] = useState<
    "page-curl" | "smooth-scroll" | "two-column"
  >("page-curl");
  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get theme-specific styles
  const getThemeStyles = () => {
    const themeId = currentTheme.id;

    switch (themeId) {
      case "AETHER":
        return {
          background:
            "linear-gradient(135deg, rgba(139, 164, 184, 0.05) 0%, rgba(10, 13, 18, 0.95) 100%)",
          pageBackground: "rgba(139, 164, 184, 0.02)",
          border: "1px solid rgba(139, 164, 184, 0.1)",
        };
      case "NOX":
        return {
          background: "#000000",
          pageBackground: "rgba(107, 107, 107, 0.02)",
          border: "1px solid rgba(107, 107, 107, 0.1)",
        };
      case "FLAMMA":
        return {
          background:
            "linear-gradient(135deg, rgba(212, 165, 116, 0.05) 0%, rgba(15, 10, 5, 0.95) 100%)",
          pageBackground: "rgba(212, 165, 116, 0.02)",
          border: "1px solid rgba(212, 165, 116, 0.1)",
        };
      case "UMBRA":
        return {
          background:
            "linear-gradient(135deg, rgba(154, 154, 154, 0.05) 0%, rgba(5, 5, 5, 0.95) 100%)",
          pageBackground: "rgba(154, 154, 154, 0.02)",
          border: "1px solid rgba(154, 154, 154, 0.1)",
        };
      case "GLACIES":
        return {
          background:
            "linear-gradient(135deg, rgba(184, 212, 227, 0.05) 0%, rgba(10, 20, 25, 0.95) 100%)",
          pageBackground: "rgba(184, 212, 227, 0.05)",
          border: "1px solid rgba(184, 212, 227, 0.2)",
        };
      case "SYNAPSE":
        return {
          background:
            "linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0.95) 100%)",
          pageBackground: "rgba(0, 255, 136, 0.02)",
          border: "2px solid rgba(0, 255, 136, 0.2)",
        };
      case "FERRO":
        return {
          background:
            "linear-gradient(135deg, rgba(255, 68, 68, 0.05) 0%, rgba(26, 26, 26, 0.95) 100%)",
          pageBackground: "rgba(255, 68, 68, 0.02)",
          border: "3px solid rgba(255, 68, 68, 0.3)",
        };
      default: // AUREA
        return {
          background:
            "linear-gradient(135deg, rgba(200, 182, 141, 0.05) 0%, rgba(10, 10, 10, 0.95) 100%)",
          pageBackground: "rgba(200, 182, 141, 0.02)",
          border: "1px solid rgba(200, 182, 141, 0.1)",
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: themeStyles.background,
        color: currentTheme.accent,
      }}
    >
      {/* Page Header */}
      <PageHeader
        chapterTitle={selectedChapter?.title || manifest.title}
        pageNumber={currentPage}
        totalPages={
          selectedChapter
            ? (selectedChapter.pageEnd || 100) -
              (selectedChapter.pageStart || 1) +
              1
            : 100
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Chapter Navigation Panel */}
        <AnimatePresence>
          {showChapters && (
            <ChapterNavigation
              chapters={manifest.chapters || []}
              selectedChapterId={selectedChapter?.id || null}
              onSelectChapter={(chapter) => {
                onSelectChapter(chapter);
                setShowChapters(false);
              }}
              onClose={() => setShowChapters(false)}
            />
          )}
        </AnimatePresence>

        {/* Reading Content */}
        <div className="flex-1 relative overflow-hidden">
          <PageTransition
            mode={readingMode}
            currentChapter={currentChapter}
            selectedChapter={selectedChapter}
            theme={currentTheme}
            onTextSelect={setSelectedText}
            highlights={highlights}
            onHighlightCreated={onHighlightCreated}
          />
          <HighlightSystem
            bookId={bookId}
            chapterId={selectedChapter?.id}
            highlights={highlights}
            theme={currentTheme}
            onHighlightCreated={onHighlightCreated}
          />
        </div>

        {/* Side Panels */}
        <AnimatePresence>
          {showNotes && (
            <NotesPanel
              bookId={bookId}
              chapterId={selectedChapter?.id}
              highlights={highlights}
              onNoteCreated={onNoteCreated}
              onClose={() => setShowNotes(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAITools && selectedText && (
            <AIToolsPanel
              selectedText={selectedText}
              bookId={bookId}
              chapterId={selectedChapter?.id}
              onClose={() => {
                setShowAITools(false);
                setSelectedText(null);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBookmarks && (
            <BookmarkPanel
              bookId={bookId}
              chapters={manifest.chapters}
              onClose={() => setShowBookmarks(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div
        className="h-16 flex items-center justify-between px-6 border-t"
        style={{
          borderColor: currentTheme.accent + "20",
          background: currentTheme.background + "F0",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowChapters(!showChapters)}
            className="px-4 py-2 rounded font-mono text-sm transition-colors"
            style={{
              background: showChapters
                ? currentTheme.accent + "20"
                : "transparent",
              border: `1px solid ${currentTheme.accent}40`,
              color: currentTheme.accent,
            }}
          >
            Chapters
          </button>
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="px-4 py-2 rounded font-mono text-sm transition-colors"
            style={{
              background: showBookmarks
                ? currentTheme.accent + "20"
                : "transparent",
              border: `1px solid ${currentTheme.accent}40`,
              color: currentTheme.accent,
            }}
          >
            Bookmarks
          </button>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="px-4 py-2 rounded font-mono text-sm transition-colors"
            style={{
              background: showNotes
                ? currentTheme.accent + "20"
                : "transparent",
              border: `1px solid ${currentTheme.accent}40`,
              color: currentTheme.accent,
            }}
          >
            Notes
          </button>
          {selectedText && (
            <button
              onClick={() => setShowAITools(!showAITools)}
              className="px-4 py-2 rounded font-mono text-sm transition-colors"
              style={{
                background: showAITools
                  ? currentTheme.accent + "20"
                  : "transparent",
                border: `1px solid ${currentTheme.accent}40`,
                color: currentTheme.accent,
              }}
            >
              AI Tools
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={readingMode}
            onChange={(e) => setReadingMode(e.target.value as any)}
            className="px-4 py-2 rounded font-mono text-sm bg-transparent"
            style={{
              border: `1px solid ${currentTheme.accent}40`,
              color: currentTheme.accent,
            }}
          >
            <option value="page-curl">Page Curl</option>
            <option value="smooth-scroll">Smooth Scroll</option>
            <option value="two-column">Two Column</option>
          </select>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 rounded font-mono text-sm transition-colors"
            style={{
              background: showSettings
                ? currentTheme.accent + "20"
                : "transparent",
              border: `1px solid ${currentTheme.accent}40`,
              color: currentTheme.accent,
            }}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Reading Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <ReadingSettings
            onClose={() => setShowSettings(false)}
            theme={currentTheme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
