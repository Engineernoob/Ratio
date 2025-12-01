"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Scroll } from "./ScrollCard";
import { TagPill } from "./TagPill";
import { useState } from "react";

interface ExpandedScrollModalProps {
  scroll: Scroll | null;
  microLessonTitle?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToMemoria?: (scroll: Scroll) => void;
  onAddAllLessons?: (scroll: Scroll) => void;
}

type ViewMode = "strength" | "date";

export function ExpandedScrollModal({
  scroll,
  microLessonTitle,
  isOpen,
  onClose,
  onAddToMemoria,
  onAddAllLessons,
}: ExpandedScrollModalProps) {
  const [, setViewMode] = useState<ViewMode>("strength");

  if (!scroll) return null;

  const strengthLabels: Record<string, string> = {
    novus: "NOVUS",
    medius: "MEDIVS",
    fragilis: "FRAGILIS",
  };

  const strengthLabel = scroll.strength
    ? strengthLabels[scroll.strength] || scroll.strength.toUpperCase()
    : "MEDIVS";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                "relative w-full max-w-4xl max-h-[90vh] overflow-y-auto",
                "bg-[rgba(0,0,0,0.8)]",
                "border border-[rgba(215,196,158,0.4)]",
                "backdrop-blur-sm",
                "p-8",
                "pointer-events-auto"
              )}
              style={{
                boxShadow:
                  "inset 0 2px 8px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.7), 0 0 40px rgba(215,196,158,0.1)",
              }}
            >
              {/* Dither overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-mono text-sm text-[rgba(215,196,158,0.9)] mb-2">
                      {microLessonTitle || scroll.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {scroll.tags.map((tag) => (
                        <TagPill key={tag} label={`TAG: ${tag}`} />
                      ))}
                      <button
                        className="font-mono text-[10px] text-[rgba(215,196,158,0.6)] hover:text-[rgba(215,196,158,0.9)] transition-colors"
                        onClick={() => {}}
                      >
                        OPEN SCROLL
                      </button>
                    </div>
                    <p className="font-mono text-[10px] text-[rgba(215,196,158,0.6)]">
                      SCROLL VNROLLED ‣ LIBER PRIMVS
                    </p>
                  </div>
                </div>

                {/* Main content */}
                <div className="mb-6">
                  <h2 className="font-serif text-2xl uppercase tracking-widest mb-2">
                    {scroll.title}
                  </h2>
                  <p className="font-mono text-xs text-[rgba(215,196,158,0.7)] mb-4">
                    SOVRCE: BOOK SVMMARY ‣ {scroll.author || "VNKNOWN"}
                  </p>
                  <p className="font-mono text-sm text-muted-foreground mb-4 leading-relaxed">
                    {scroll.summary}
                  </p>
                  <div className="font-mono text-[10px] text-[rgba(215,196,158,0.6)] mb-4">
                    TAG: {scroll.tags.join(" ")} ORIGIN: BIBLIOTHECA ADDED: 14
                    DIES ANTE MEMORIA STRENGTH: {strengthLabel}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[rgba(215,196,158,0.3)] mb-6" />

                {/* Navigation tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    className="font-mono text-[10px] text-[rgba(215,196,158,0.6)] hover:text-[rgba(215,196,158,0.9)] transition-colors"
                    onClick={() => setViewMode("strength")}
                  >
                    BY STRENGTH
                  </button>
                  <button
                    onClick={() => setViewMode("date")}
                    className="font-mono text-[10px] text-[rgba(215,196,158,0.6)] hover:text-[rgba(215,196,158,0.9)] transition-colors"
                  >
                    BY DATE
                  </button>
                </div>

                {/* Chapter list */}
                {scroll.chapters && scroll.chapters.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {scroll.chapters.map((chapter, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.3)] border border-[rgba(215,196,158,0.2)]"
                      >
                        <div className="flex-1">
                          <h4 className="font-mono text-xs text-[rgba(215,196,158,0.9)] mb-1">
                            {chapter.title}
                          </h4>
                          {chapter.strength && (
                            <p className="font-mono text-[10px] text-[rgba(215,196,158,0.6)]">
                              STRENGTH:{" "}
                              {strengthLabels[chapter.strength] ||
                                chapter.strength.toUpperCase()}
                            </p>
                          )}
                          <p className="font-mono text-[10px] text-muted-foreground mt-1">
                            ADD ‣ {14 - index} DIES ANTE
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {}}>REVIEW</button>
                          <button onClick={() => {}}>OPEN CHAPTER</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4 mb-6">
                  {onAddToMemoria && (
                    <button onClick={() => onAddToMemoria(scroll)}>
                      ADD TO MEMORIA
                    </button>
                  )}
                  {onAddAllLessons && (
                    <button onClick={() => onAddAllLessons(scroll)}>
                      ADD ALL LESSONS
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[rgba(215,196,158,0.3)]">
                  <button onClick={onClose}>CLOSE SCROLL</button>
                  <p className="font-mono text-[10px] text-[rgba(215,196,158,0.6)]">
                    SCROLL WILL ROLL BACK INTO ITS CUBBY ‣ INDEX PRESERVED
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
