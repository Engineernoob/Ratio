"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import type { BookChapterRef } from "@/lib/books/types";

interface ChapterNavigationProps {
  chapters: BookChapterRef[];
  selectedChapterId: string | null;
  onSelectChapter: (chapter: BookChapterRef) => void;
  onClose: () => void;
}

export function ChapterNavigation({
  chapters,
  selectedChapterId,
  onSelectChapter,
  onClose,
}: ChapterNavigationProps) {
  const [dragX, setDragX] = useState(0);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -100) {
      onClose();
    }
    setDragX(0);
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: dragX }}
      exit={{ x: "-100%" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onDrag={(_, info) => setDragX(Math.min(0, info.offset.x))}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-80 h-full border-r overflow-y-auto"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        borderColor: "rgba(200, 182, 141, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl" style={{ color: "#C8B68D" }}>
            Chapters
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded transition-colors"
            style={{
              color: "#C8B68D",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(200, 182, 141, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {chapters && chapters.length > 0 ? (
            chapters.map((chapter, index) => {
              const isSelected = chapter.id === selectedChapterId;
              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Marble Divider */}
                  {index > 0 && (
                    <div
                      className="h-px my-4 opacity-30"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(200, 182, 141, 0.5), transparent)",
                      }}
                    />
                  )}

                  <button
                    onClick={() => onSelectChapter(chapter)}
                    className="w-full text-left p-4 rounded transition-all"
                    style={{
                      background: isSelected
                        ? "rgba(200, 182, 141, 0.15)"
                        : "transparent",
                      border: `1px solid ${
                        isSelected
                          ? "rgba(200, 182, 141, 0.3)"
                          : "rgba(200, 182, 141, 0.1)"
                      }`,
                      color: isSelected
                        ? "#C8B68D"
                        : "rgba(200, 182, 141, 0.7)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          "rgba(200, 182, 141, 0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <div className="font-serif text-sm mb-1">
                      {chapter.title}
                    </div>
                    {chapter.pageStart && chapter.pageEnd && (
                      <div className="font-mono text-xs opacity-60">
                        Pages {chapter.pageStart}-{chapter.pageEnd}
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p
                className="font-mono text-sm opacity-60"
                style={{ color: "#888888" }}
              >
                No chapters available
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
