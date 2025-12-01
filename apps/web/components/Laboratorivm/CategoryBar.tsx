"use client";

import { motion } from "framer-motion";
import type { PuzzleCategory } from "@/lib/puzzles/types";

interface CategoryBarProps {
  selectedCategory: PuzzleCategory | "All";
  onCategoryChange: (category: PuzzleCategory | "All") => void;
}

const categories: Array<PuzzleCategory | "All"> = [
  "All",
  "Logic",
  "Math",
  "Patterns",
  "Rhetoric",
  "Memory",
  "Philosophy",
];

export function CategoryBar({
  selectedCategory,
  onCategoryChange,
}: CategoryBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          className="px-4 py-2 font-mono text-xs"
          style={{
            color:
              selectedCategory === category
                ? "#C8B68D"
                : "rgba(200, 182, 141, 0.5)",
            border: `1px solid ${
              selectedCategory === category
                ? "rgba(200, 182, 141, 0.4)"
                : "rgba(200, 182, 141, 0.2)"
            }`,
            background:
              selectedCategory === category
                ? "rgba(200, 182, 141, 0.15)"
                : "rgba(10, 10, 10, 0.6)",
            borderRadius: "4px",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
}
