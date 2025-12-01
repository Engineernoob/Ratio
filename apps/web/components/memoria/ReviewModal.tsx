"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReviewItem } from "@/lib/memoriaData";

interface ReviewModalProps {
  item: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkRemembered: () => void;
  onAgainSoon: () => void;
}

export function ReviewModal({
  item,
  isOpen,
  onClose,
  onMarkRemembered,
  onAgainSoon,
}: ReviewModalProps) {
  if (!item) return null;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center p-4",
              "pointer-events-none"
            )}
          >
            <div
              className={cn(
                "w-full max-w-4xl rounded-lg p-8",
                "bg-[rgba(0,0,0,0.6)]",
                "border border-[rgba(42,42,42,0.3)]",
                "backdrop-blur-sm",
                "pointer-events-auto"
              )}
              style={{
                boxShadow:
                  "inset 0 4px 8px rgba(0,0,0,0.5), inset 0 -4px 8px rgba(255,255,255,0.05), 0 0 40px rgba(0,0,0,0.7)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-gold flex-1">
                  {item.title}
                </h2>
                <button
                  onClick={onClose}
                  className={cn(
                    "px-4 py-2 rounded",
                    "border border-gold",
                    "text-gold font-mono text-xs uppercase tracking-wider",
                    "bg-[rgba(0,0,0,0.3)]",
                    "hover:bg-[rgba(215,196,158,0.1)]",
                    "transition-all duration-200",
                    "ml-4"
                  )}
                >
                  BEGIN REVIEV
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full",
                      "border border-[rgba(215,196,158,0.3)]",
                      "bg-[rgba(215,196,158,0.1)]",
                      "text-gold font-mono text-[10px] uppercase tracking-wider"
                    )}
                  >
                    {tag}
                  </span>
                ))}
                {item.dueNow && item.singleTabula && (
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full",
                      "border border-[rgba(215,196,158,0.3)]",
                      "bg-[rgba(215,196,158,0.1)]",
                      "text-gold font-mono text-[10px] uppercase tracking-wider"
                    )}
                  >
                    DVE NOW B7 SINGLE TABVLA
                  </span>
                )}
                {item.dueNow && !item.singleTabula && (
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full",
                      "border border-[rgba(215,196,158,0.3)]",
                      "bg-[rgba(215,196,158,0.1)]",
                      "text-gold font-mono text-[10px] uppercase tracking-wider"
                    )}
                  >
                    DVE NOW
                  </span>
                )}
                {!item.dueNow && item.singleTabula && (
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full",
                      "border border-[rgba(215,196,158,0.3)]",
                      "bg-[rgba(215,196,158,0.1)]",
                      "text-gold font-mono text-[10px] uppercase tracking-wider"
                    )}
                  >
                    SINGLE TABVLA
                  </span>
                )}
              </div>

              {/* Content Sections */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* INTERROGATVM */}
                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-gold">
                    INTERROGATVM
                  </h3>
                  <p className="font-mono text-xs text-gold leading-relaxed">
                    {item.interrogatum}
                  </p>
                  <textarea
                    className={cn(
                      "w-full h-32 p-3 rounded",
                      "bg-[rgba(0,0,0,0.4)]",
                      "border border-[rgba(215,196,158,0.2)]",
                      "text-gold font-mono text-xs",
                      "resize-none",
                      "focus:outline-none focus:border-gold",
                      "placeholder:text-gold/40"
                    )}
                    placeholder="Your response..."
                  />
                </div>

                {/* RESPONSVM REVELATVM */}
                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-gold">
                    RESPONSVM REVELATVM
                  </h3>
                  <p className="font-mono text-xs text-gold leading-relaxed">
                    {item.responsumRevelatum}
                  </p>
                  <textarea
                    className={cn(
                      "w-full h-32 p-3 rounded",
                      "bg-[rgba(0,0,0,0.4)]",
                      "border border-[rgba(215,196,158,0.2)]",
                      "text-gold font-mono text-xs",
                      "resize-none",
                      "focus:outline-none focus:border-gold",
                      "placeholder:text-gold/40"
                    )}
                    placeholder="Your answer..."
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-4 pt-6 border-t border-[rgba(215,196,158,0.2)]">
                <button
                  onClick={onMarkRemembered}
                  className={cn(
                    "flex-1 px-4 py-2 rounded",
                    "border border-gold",
                    "text-gold font-mono text-xs uppercase tracking-wider",
                    "bg-[rgba(0,0,0,0.3)]",
                    "hover:bg-[rgba(215,196,158,0.1)]",
                    "transition-all duration-200"
                  )}
                >
                  MARK AS REMEMBERED
                </button>
                <button
                  onClick={onAgainSoon}
                  className={cn(
                    "flex-1 px-4 py-2 rounded",
                    "border border-gold",
                    "text-gold font-mono text-xs uppercase tracking-wider",
                    "bg-[rgba(0,0,0,0.3)]",
                    "hover:bg-[rgba(215,196,158,0.1)]",
                    "transition-all duration-200"
                  )}
                >
                  AGAIN (SOON)
                </button>
                <div className="flex-1 flex items-center justify-end">
                  <button
                    onClick={onClose}
                    className={cn(
                      "px-4 py-2 rounded",
                      "border border-gold",
                      "text-gold font-mono text-xs uppercase tracking-wider",
                      "bg-[rgba(0,0,0,0.3)]",
                      "hover:bg-[rgba(215,196,158,0.1)]",
                      "transition-all duration-200"
                    )}
                  >
                    CLOSE TABVLA
                  </button>
                  <span className="ml-3 font-mono text-[10px] text-gold/60">
                    ON COMPLETION: TABVLA GLOWS AVREA B7 INTERVAL EXTENDED
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
