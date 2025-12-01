"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KnowledgeStreakIndicatorProps {
  days: number;
  variant?: "dots" | "bar";
  className?: string;
  delay?: number;
}

export function KnowledgeStreakIndicator({
  days,
  variant = "dots",
  className,
  delay = 0,
}: KnowledgeStreakIndicatorProps) {
  if (variant === "bar") {
    return (
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className={cn("relative h-2 bg-[rgba(255,255,255,0.1)]", className)}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (days / 30) * 100)}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className="h-full bg-linear-to-r from-bronze to-[rgba(198,122,58,0.6)]"
          style={{
            boxShadow: "0 0 8px rgba(198,122,58,0.4)",
          }}
        />
      </motion.div>
    );
  }

  // Dots variant
  const maxDots = 30;
  const activeDots = Math.min(days, maxDots);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className={cn("flex gap-1", className)}
    >
      {Array.from({ length: maxDots }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: i < activeDots ? 1 : 0.3,
            opacity: i < activeDots ? 1 : 0.2,
          }}
          transition={{ duration: 0.2, delay: delay + i * 0.02 }}
          className={cn(
            "w-2 h-2 rounded-full",
            i < activeDots ? "bg-bronze" : "bg-[rgba(255,255,255,0.1)]"
          )}
          style={{
            boxShadow: i < activeDots ? "0 0 4px rgba(198,122,58,0.5)" : "none",
          }}
        />
      ))}
    </motion.div>
  );
}
