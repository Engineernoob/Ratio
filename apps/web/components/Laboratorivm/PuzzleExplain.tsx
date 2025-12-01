"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";

interface PuzzleExplainProps {
  explanation?: string;
}

export function PuzzleExplain({ explanation }: PuzzleExplainProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!explanation) {
    return null;
  }

  return (
    <div className="mt-6">
      <motion.button
        onClick={() => setShowExplanation(!showExplanation)}
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
        <BookOpen size={16} />
        {showExplanation ? "Hide" : "Show"} Explanation
      </motion.button>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            className="mt-4 p-6 rounded-lg"
            style={{
              background: "rgba(200, 182, 141, 0.05)",
              border: "1px solid rgba(200, 182, 141, 0.2)",
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3
              className="font-serif text-sm mb-3"
              style={{ color: "#C8B68D" }}
            >
              Explanation
            </h3>
            <p
              className="font-mono text-sm leading-relaxed"
              style={{ color: "rgba(200, 182, 141, 0.8)" }}
            >
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
