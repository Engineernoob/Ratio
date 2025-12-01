"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookMeta } from "./BookSpine";

interface ReaderHeaderProps {
  book: BookMeta;
  currentChapter: { id: string; title: string; file: string } | undefined;
  onClose: () => void;
  onBack: () => void;
  onShowSettings: () => void;
  onShowChapters: () => void;
  visible: boolean;
  canGoBack: boolean;
}

export function ReaderHeader({
  book,
  currentChapter,
  onClose,
  onBack,
  onShowSettings,
  onShowChapters,
  visible,
  canGoBack,
}: ReaderHeaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/5"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <button
                onClick={onBack}
                disabled={!canGoBack}
                className={`font-mono text-sm px-2 md:px-3 py-1.5 md:py-2 transition-all duration-200 rounded ${
                  canGoBack
                    ? "text-[#e8e8e8] hover:bg-white/5 hover:text-white"
                    : "text-[#888] cursor-not-allowed"
                }`}
              >
                ←
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-base md:text-lg text-[#e8e8e8] truncate">
                  {book.title}
                </h2>
                {currentChapter ? (
                  <p className="font-mono text-xs text-[#888] truncate">
                    {currentChapter.title}
                  </p>
                ) : (
                  <p className="font-mono text-xs text-[#888] truncate">
                    No chapters available
                  </p>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={onShowSettings}
                className="font-mono text-sm text-[#e8e8e8] px-2 md:px-3 py-1.5 md:py-2 hover:bg-white/5 transition-all duration-200 rounded"
              >
                Aa
              </button>
              <button
                onClick={onShowChapters}
                className="font-mono text-xs md:text-sm text-[#e8e8e8] px-2 md:px-3 py-1.5 md:py-2 hover:bg-white/5 transition-all duration-200 rounded hidden md:block"
              >
                Chapters
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: book.title,
                      text: `Reading ${book.title} by ${book.author}`,
                    });
                  }
                }}
                className="font-mono text-xs md:text-sm text-[#e8e8e8] px-2 md:px-3 py-1.5 md:py-2 hover:bg-white/5 transition-all duration-200 rounded hidden md:block"
              >
                Share
              </button>
              <button
                onClick={onClose}
                className="font-mono text-lg md:text-xl text-[#e8e8e8] px-2 md:px-3 py-1.5 md:py-2 hover:bg-white/5 transition-all duration-200 rounded"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
