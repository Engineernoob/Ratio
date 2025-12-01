"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CodexChromeProps {
  currentPage: number;
  totalPages: number;
  chapterTitle?: string;
  pageRange?: { start: number; end: number };
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  ritualMode?: boolean;
}

export function CodexChrome({
  currentPage,
  totalPages,
  chapterTitle,
  pageRange,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  ritualMode = false,
}: CodexChromeProps) {
  // Check if current page is within chapter range
  const isInChapterRange = pageRange
    ? currentPage >= pageRange.start && currentPage <= pageRange.end
    : true;
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-20"
      animate={{ opacity: ritualMode ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Chapter title above spine */}
      {chapterTitle && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 text-center"
          style={{ color: "#C8B68D" }}
        >
          <motion.h2
            className="font-serif text-sm opacity-60"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {chapterTitle}
          </motion.h2>
        </div>
      )}

      {/* Page numbers */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8">
        <motion.div
          className="font-serif text-xs"
          style={{
            color: isInChapterRange
              ? "rgba(200, 182, 141, 0.7)"
              : "rgba(200, 182, 141, 0.3)",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isInChapterRange ? 0.7 : 0.3,
          }}
          transition={{ delay: 0.2 }}
        >
          {currentPage} / {totalPages}
        </motion.div>
        {pageRange && (
          <motion.div
            className="font-mono text-xs"
            style={{
              color: "rgba(200, 182, 141, 0.4)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.3 }}
          >
            ({pageRange.start}-{pageRange.end})
          </motion.div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <motion.button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="pointer-events-auto p-3 rounded-full transition-all"
          style={{
            background: canGoPrevious
              ? "rgba(200, 182, 141, 0.1)"
              : "rgba(200, 182, 141, 0.05)",
            border: "1px solid rgba(200, 182, 141, 0.2)",
            color: canGoPrevious ? "#C8B68D" : "rgba(200, 182, 141, 0.3)",
            cursor: canGoPrevious ? "pointer" : "not-allowed",
          }}
          whileHover={
            canGoPrevious
              ? { scale: 1.1, background: "rgba(200, 182, 141, 0.15)" }
              : {}
          }
          whileTap={canGoPrevious ? { scale: 0.95 } : {}}
        >
          <ChevronLeft size={20} />
        </motion.button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <motion.button
          onClick={onNext}
          disabled={!canGoNext}
          className="pointer-events-auto p-3 rounded-full transition-all"
          style={{
            background: canGoNext
              ? "rgba(200, 182, 141, 0.1)"
              : "rgba(200, 182, 141, 0.05)",
            border: "1px solid rgba(200, 182, 141, 0.2)",
            color: canGoNext ? "#C8B68D" : "rgba(200, 182, 141, 0.3)",
            cursor: canGoNext ? "pointer" : "not-allowed",
          }}
          whileHover={
            canGoNext
              ? { scale: 1.1, background: "rgba(200, 182, 141, 0.15)" }
              : {}
          }
          whileTap={canGoNext ? { scale: 0.95 } : {}}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}
