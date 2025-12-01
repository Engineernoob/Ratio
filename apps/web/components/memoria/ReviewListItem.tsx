"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MemoryItem } from "@/lib/memoriaData";

interface ReviewListItemProps {
  item: MemoryItem;
  onReview: () => void;
  delay?: number;
}

export function ReviewListItem({
  item,
  onReview,
  delay = 0,
}: ReviewListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "rounded-lg p-4",
        "bg-[rgba(0,0,0,0.6)]",
        "border border-[rgba(42,42,42,0.15)]",
        "backdrop-blur-sm"
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), 0 0 15px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-serif text-sm font-bold text-gold mb-1">
            {item.title}
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-gold">
            MEMORY STRENGTH: {item.memoryStrength}
          </span>
        </div>
        <button
          onClick={onReview}
          className={cn(
            "px-3 py-1.5 rounded",
            "border border-gold",
            "text-gold font-mono text-[10px] uppercase tracking-wider",
            "bg-[rgba(0,0,0,0.3)]",
            "hover:bg-[rgba(215,196,158,0.1)]",
            "transition-all duration-200",
            "whitespace-nowrap"
          )}
          style={{
            boxShadow: "0 0 8px rgba(215,196,158,0.15)",
          }}
        >
          REVIEW
        </button>
      </div>
    </motion.div>
  );
}
