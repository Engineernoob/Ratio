"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChapterItemProps {
  chapterNumber: number;
  title: string;
  description?: string;
  microLessonsCount?: number;
  microLessonsTime?: string;
  microLessonsType?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function ChapterItem({
  chapterNumber,
  title,
  description,
  microLessonsCount = 0,
  microLessonsTime = "5 MIN",
  microLessonsType = "PROMPTA",
  isExpanded = false,
  onToggle,
  className,
}: ChapterItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "border-b border-[rgba(255,255,255,0.05)] pb-4 mb-4 last:border-0 last:mb-0",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={onToggle} className="w-full text-left group">
        <div className="flex items-start gap-3 mb-2">
          <span
            className={cn(
              "font-serif text-lg transition-colors",
              isExpanded ? "text-[#d4af37]" : "text-[rgba(232,230,225,0.6)]"
            )}
          >
            {isExpanded ? "▲" : "•"}
          </span>
          <div className="flex-1">
            <h3
              className={cn(
                "font-serif text-lg uppercase tracking-wide mb-2 transition-colors",
                isExpanded || isHovered
                  ? "text-[rgba(232,230,225,0.95)]"
                  : "text-[rgba(232,230,225,0.8)]"
              )}
              style={{
                textShadow: isExpanded
                  ? "1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.1)"
                  : "none",
              }}
            >
              CAPVT {chapterNumber} {title}
            </h3>
            <AnimatePresence>
              {isExpanded && description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-sm text-[rgba(232,230,225,0.7)] leading-relaxed mb-3"
                >
                  {description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </button>

      {/* Micro-Lesson Metadata */}
      {microLessonsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: isExpanded ? 0.1 : 0 }}
          className="ml-6"
        >
          <div
            className="inline-block px-3 py-1 rounded-full border border-[rgba(212,175,55,0.2)] bg-linear-to-r from-[rgba(212,175,55,0.05)] to-transparent"
            style={{
              boxShadow: "inset 0 1px 0 rgba(212,175,55,0.1)",
            }}
          >
            <p className="font-mono text-xs text-[rgba(212,175,55,0.8)]">
              MICRO-LESSONS AVAILABLE / {microLessonsTime} • {microLessonsCount}{" "}
              {microLessonsType}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
