"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface PuzzleHintsProps {
  hints?: string[];
}

export function PuzzleHints({ hints }: PuzzleHintsProps) {
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  if (!hints || hints.length === 0) {
    return null;
  }

  const revealNextHint = () => {
    const nextIndex = revealedHints.size;
    if (nextIndex < hints.length) {
      setRevealedHints(new Set([...revealedHints, nextIndex]));
    }
  };

  return (
    <div className="mt-6">
      <motion.button
        onClick={() => setShowHints(!showHints)}
        className="flex items-center gap-2 px-4 py-2 font-mono text-xs"
        style={{
          color: "#C8B68D",
          border: "1px solid rgba(200, 182, 141, 0.2)",
          background: "rgba(10, 10, 10, 0.6)",
          borderRadius: "4px",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Lightbulb size={16} />
        Hints ({revealedHints.size}/{hints.length})
      </motion.button>

      <AnimatePresence>
        {showHints && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {hints.map((hint, index) => (
              <AnimatePresence key={index}>
                {revealedHints.has(index) && (
                  <motion.div
                    className="p-4 rounded"
                    style={{
                      background: "rgba(200, 182, 141, 0.05)",
                      border: "1px solid rgba(200, 182, 141, 0.2)",
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p
                      className="font-mono text-sm"
                      style={{ color: "rgba(200, 182, 141, 0.8)" }}
                    >
                      Hint {index + 1}: {hint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
            {revealedHints.size < hints.length && (
              <motion.button
                onClick={revealNextHint}
                className="w-full py-2 font-mono text-xs"
                style={{
                  color: "#C8B68D",
                  border: "1px solid rgba(200, 182, 141, 0.3)",
                  background: "rgba(200, 182, 141, 0.1)",
                  borderRadius: "4px",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reveal Next Hint
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
