"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMeta } from "./BookSpine";
import { ReaderHeader } from "./ReaderHeader";
import { ReaderContent } from "./ReaderContent";
import { ReaderSettingsPanel } from "./ReaderSettingsPanel";
import { ReaderChaptersDrawer } from "./ReaderChaptersDrawer";
import { ReaderProgressBar } from "./ReaderProgressBar";

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  columnWidth: "narrow" | "normal" | "wide";
  theme: "monochrome" | "sepia" | "oled" | "solarized";
  readingMode: "scroll" | "page";
  fontFamily: "serif" | "sans-serif";
}

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 18,
  lineHeight: 1.7,
  columnWidth: "normal",
  theme: "monochrome",
  readingMode: "scroll",
  fontFamily: "serif",
};

interface ReaderModalProps {
  book: BookMeta | null;
  onClose: () => void;
}

export function ReaderModal({ book, onClose }: ReaderModalProps) {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("readerSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Error loading reader settings:", e);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("readerSettings", JSON.stringify(settings));
  }, [settings]);

  // Initialize to first chapter
  useEffect(() => {
    if (book) {
      if (book.chapters && book.chapters.length > 0) {
        setCurrentChapterIndex(0);
      } else {
        setCurrentChapterIndex(-1); // No chapters
      }
    }
  }, [book]);

  // In page mode, always show header
  useEffect(() => {
    if (settings.readingMode === "page") {
      setHeaderVisible(true);
    }
  }, [settings.readingMode]);

  const currentChapter = book?.chapters[currentChapterIndex];

  const handleNextChapter = () => {
    if (book && currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    setShowChapters(false);
  };

  if (!book) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="reader-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="reader-shell"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="reader-texture" />
          <div className="reader-vignette" />

          {/* Header */}
          <ReaderHeader
            book={book}
            currentChapter={currentChapter}
            onClose={onClose}
            onBack={handlePrevChapter}
            onShowSettings={() => setShowSettings(true)}
            onShowChapters={() => setShowChapters(true)}
            visible={headerVisible}
            canGoBack={currentChapterIndex > 0}
          />

          {/* Content */}
          <motion.div
            className="reader-surface"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ReaderContent
              book={book}
              chapterIndex={currentChapterIndex}
              settings={settings}
              onNextChapter={handleNextChapter}
              onPrevChapter={handlePrevChapter}
              onChapterChange={setCurrentChapterIndex}
              onScrollProgress={setScrollProgress}
              onPageInfo={(page, total) => {
                setCurrentPage(page);
                setTotalPages(total);
              }}
              onHeaderVisibility={setHeaderVisible}
            />
          </motion.div>

          {/* Progress Bar */}
          {currentChapter && (
            <ReaderProgressBar
              book={book}
              chapterIndex={currentChapterIndex}
              currentChapter={currentChapter}
              scrollProgress={scrollProgress}
              readingMode={settings.readingMode}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}

          {/* Settings Panel */}
          <ReaderSettingsPanel
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSettingsChange={setSettings}
          />

          {/* Chapters Drawer */}
          <ReaderChaptersDrawer
            isOpen={showChapters}
            onClose={() => setShowChapters(false)}
            book={book}
            currentChapterIndex={currentChapterIndex}
            onChapterSelect={handleChapterSelect}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
