"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface DailyChallengeBadgeProps {
  puzzleId: string;
  isCompleted: boolean;
  onClick: () => void;
}

export function DailyChallengeBadge({
  puzzleId,
  isCompleted,
  onClick,
}: DailyChallengeBadgeProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={onClick}
        className="flex items-center gap-3 px-6 py-4 w-full"
        style={{
          border: `1px solid ${isCompleted ? "rgba(200, 182, 141, 0.4)" : "rgba(200, 182, 141, 0.2)"}`,
          background: isCompleted
            ? "rgba(200, 182, 141, 0.1)"
            : "rgba(10, 10, 10, 0.7)",
          borderRadius: "8px",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={
          isCompleted
            ? {
                boxShadow: [
                  "0 0 0px rgba(200, 182, 141, 0.3)",
                  "0 0 20px rgba(200, 182, 141, 0.4)",
                  "0 0 0px rgba(200, 182, 141, 0.3)",
                ],
              }
            : {}
        }
        transition={
          isCompleted
            ? {
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
            : {}
        }
      >
        <Sparkles
          size={20}
          style={{ color: isCompleted ? "#C8B68D" : "rgba(200, 182, 141, 0.5)" }}
        />
        <div className="flex-1 text-left">
          <h3
            className="font-serif text-lg mb-1"
            style={{ color: "#C8B68D" }}
          >
            Daily Challenge
          </h3>
          <p
            className="font-mono text-xs opacity-60"
            style={{ color: "#C8B68D" }}
          >
            {isCompleted
              ? "Challenge completed today"
              : "Complete today's puzzle"}
          </p>
        </div>
        {isCompleted && (
          <motion.div
            className="font-mono text-xs px-3 py-1"
            style={{
              color: "#C8B68D",
              background: "rgba(200, 182, 141, 0.2)",
              borderRadius: "4px",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            ✓
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
}
