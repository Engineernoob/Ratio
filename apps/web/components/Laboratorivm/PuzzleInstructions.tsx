"use client";

import { motion } from "framer-motion";
import type { Puzzle } from "@/lib/puzzles/types";

interface PuzzleInstructionsProps {
  puzzle: Puzzle;
}

export function PuzzleInstructions({ puzzle }: PuzzleInstructionsProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-serif text-2xl mb-4" style={{ color: "#C8B68D" }}>
        {puzzle.prompt}
      </h2>
      {puzzle.difficulty && (
        <div className="flex items-center gap-2 mb-4">
          <span
            className="font-mono text-xs px-2 py-1"
            style={{
              color: "rgba(200, 182, 141, 0.7)",
              background: "rgba(200, 182, 141, 0.1)",
              borderRadius: "4px",
            }}
          >
            {puzzle.difficulty}
          </span>
          {puzzle.category && (
            <span
              className="font-mono text-xs px-2 py-1"
              style={{
                color: "rgba(200, 182, 141, 0.7)",
                background: "rgba(200, 182, 141, 0.1)",
                borderRadius: "4px",
              }}
            >
              {puzzle.category}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
