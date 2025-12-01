"use client";

import { motion } from "framer-motion";
import { BookMeta } from "./BookSpine";

interface ReaderProgressBarProps {
  book: BookMeta;
  chapterIndex: number;
  currentChapter: { id: string; title: string; file: string } | undefined;
  scrollProgress: number;
  readingMode: "scroll" | "page";
  currentPage: number;
  totalPages: number;
}

export function ReaderProgressBar({
  book,
  chapterIndex,
  currentChapter,
  scrollProgress,
  readingMode,
  currentPage,
  totalPages,
}: ReaderProgressBarProps) {
  if (!currentChapter) return null;

  const chapterNumber = chapterIndex + 1;
  const totalChapters = book.chapters?.length || 0;

  // Calculate progress percentage - ensure it's a valid number
  let progressPercentage = 0;
  let pageDisplay = "";

  if (readingMode === "scroll") {
    progressPercentage = isNaN(scrollProgress) ? 0 : Math.round(scrollProgress);
  } else {
    // Page mode
    if (totalPages > 0) {
      progressPercentage = Math.round(((currentPage + 1) / totalPages) * 100);
      pageDisplay = `${currentPage + 1} / ${totalPages}`;
    } else {
      progressPercentage = 0;
    }
  }

  // Ensure progress is between 0 and 100
  progressPercentage = Math.min(100, Math.max(0, progressPercentage));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="font-mono text-xs text-[#888]">
            Chapter {chapterNumber} — {progressPercentage}%
          </p>
          {pageDisplay ? (
            <p className="font-mono text-xs text-[#888]">{pageDisplay}</p>
          ) : (
            <p className="font-mono text-xs text-[#888]">
              {chapterNumber} / {totalChapters}
            </p>
          )}
        </div>
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#e8e8e8]/85"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
