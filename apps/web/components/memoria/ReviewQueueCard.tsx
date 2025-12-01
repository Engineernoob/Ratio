"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReviewItem } from "@/lib/memoriaData";

interface ReviewQueueCardProps {
  item: ReviewItem;
  onBeginReview: (item: ReviewItem) => void;
  delay?: number;
}

export function ReviewQueueCard({
  item,
  onBeginReview,
  delay = 0,
}: ReviewQueueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "rounded-lg p-5 mb-4",
        "bg-[rgba(0,0,0,0.6)]",
        "border border-[rgba(42,42,42,0.15)]",
        "backdrop-blur-sm"
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="font-serif text-lg font-bold text-gold">
            {item.title}
          </h3>
          <p className="font-mono text-xs text-gold leading-relaxed">
            {item.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-gold">
              ORIGO: {item.origo}
            </span>
          </div>
        </div>
        <button
          onClick={() => onBeginReview(item)}
          className={cn(
            "px-4 py-2 rounded",
            "border border-gold",
            "text-gold font-mono text-xs uppercase tracking-wider",
            "bg-[rgba(0,0,0,0.3)]",
            "hover:bg-[rgba(215,196,158,0.1)]",
            "transition-all duration-200",
            "whitespace-nowrap"
          )}
          style={{
            boxShadow: "0 0 10px rgba(215,196,158,0.2)",
          }}
        >
          BEGIN REVIEW
        </button>
      </div>
    </motion.div>
  );
}
