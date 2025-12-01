"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Highlighter,
  StickyNote,
  BookOpen,
  Sparkles,
  Copy,
  X,
} from "lucide-react";

interface HighlightActionBubbleProps {
  x: number;
  y: number;
  selectedText: string;
  onHighlight: () => void;
  onAddNote: () => void;
  onAddToMemoria: () => void;
  onSummarize: () => void;
  onCopy: () => void;
  onClose: () => void;
}

export function HighlightActionBubble({
  x,
  y,
  selectedText,
  onHighlight,
  onAddNote,
  onAddToMemoria,
  onSummarize,
  onCopy,
  onClose,
}: HighlightActionBubbleProps) {
  const actions = [
    {
      label: "Highlight",
      icon: Highlighter,
      onClick: onHighlight,
      color: "#C8B68D",
    },
    {
      label: "Add Note",
      icon: StickyNote,
      onClick: onAddNote,
      color: "#C8B68D",
    },
    {
      label: "Commit to Memoria",
      icon: BookOpen,
      onClick: onAddToMemoria,
      color: "#C8B68D",
    },
    {
      label: "Summarize",
      icon: Sparkles,
      onClick: onSummarize,
      color: "#C8B68D",
    },
    {
      label: "Copy",
      icon: Copy,
      onClick: onCopy,
      color: "#C8B68D",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="absolute z-50 pointer-events-auto"
        style={{
          left: `${x}px`,
          top: `${y - 60}px`,
        }}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="rounded-lg shadow-2xl border"
          style={{
            background: "rgba(10, 10, 10, 0.95)",
            borderColor: "rgba(200, 182, 141, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Selected text preview */}
          <div
            className="px-4 py-2 border-b max-w-xs"
            style={{
              borderColor: "rgba(200, 182, 141, 0.1)",
            }}
          >
            <p
              className="font-mono text-xs leading-relaxed line-clamp-2"
              style={{ color: "rgba(200, 182, 141, 0.8)" }}
            >
              {selectedText}
            </p>
          </div>

          {/* Actions */}
          <div className="p-2 flex flex-wrap gap-1">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  onClick={action.onClick}
                  className="flex items-center gap-2 px-3 py-2 rounded transition-all"
                  style={{
                    background: "rgba(200, 182, 141, 0.1)",
                    border: "1px solid rgba(200, 182, 141, 0.2)",
                    color: "#C8B68D",
                  }}
                  whileHover={{
                    background: "rgba(200, 182, 141, 0.2)",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Icon size={14} />
                  <span className="font-mono text-xs">{action.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Close button */}
          <div className="absolute top-2 right-2">
            <motion.button
              onClick={onClose}
              className="p-1 rounded"
              style={{
                color: "rgba(200, 182, 141, 0.6)",
              }}
              whileHover={{
                background: "rgba(200, 182, 141, 0.1)",
                scale: 1.1,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
