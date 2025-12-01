"use client";

import { motion } from "framer-motion";
import { FogCard } from "@/components/core/FogCard";
import { ChapterList, Chapter } from "./ChapterList";
import { cn } from "@/lib/utils";

interface BookOverviewProps {
  book: {
    id: string;
    title: string;
    author: string;
    description?: string;
  } | null;
  chapters: Chapter[];
  expandedChapterId?: string;
  onToggleChapter?: (chapterId: string) => void;
  onViewSummary?: () => void;
  className?: string;
}

export function BookOverview({
  book,
  chapters,
  expandedChapterId,
  onToggleChapter,
  onViewSummary,
  className,
}: BookOverviewProps) {
  if (!book) {
    return null;
  }

  return (
    <FogCard className={cn("p-8 mt-8", className)} delay={0.4}>
      {/* Decorative top border - positioned at card edge, escaping padding */}
      <div className="absolute -top-8 -left-8 -right-8 h-px bg-linear-to-r from-transparent via-[rgba(212,175,55,0.3)] to-transparent z-20 pointer-events-none" />

      {/* Title & Author */}
      <div className="mb-6">
        <h2
          className="font-serif text-4xl uppercase tracking-widest engraved-text mb-2"
          style={{
            textShadow:
              "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1), 0 0 20px rgba(232, 230, 225, 0.2)",
          }}
        >
          {book.title}
        </h2>
        <p className="font-serif text-lg text-[rgba(232,230,225,0.7)] tracking-wide">
          {book.author}
        </p>
      </div>

      {/* Description */}
      {book.description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="font-serif text-base text-[rgba(232,230,225,0.8)] leading-relaxed mb-6"
        >
          {book.description}
        </motion.p>
      )}

      {/* Summary Button */}
      {onViewSummary && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewSummary}
          className="mb-8 py-2 px-4 border border-[#d4af37] bg-linear-to-r from-[rgba(212,175,55,0.1)] to-transparent hover:from-[rgba(212,175,55,0.15)] transition-all duration-300 font-mono text-xs uppercase tracking-wide text-[#d4af37]"
          style={{
            boxShadow:
              "0 0 15px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          • VIEW SUMMARY & MICRO-LESSONS
        </motion.button>
      )}

      {/* Chapter List */}
      {chapters.length > 0 && (
        <div className="mt-8">
          <ChapterList
            chapters={chapters}
            expandedChapterId={expandedChapterId}
            onToggleChapter={onToggleChapter}
          />
        </div>
      )}
    </FogCard>
  );
}
