"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

type FeedbackType = "correct" | "incorrect" | null;

interface FeedbackPanelProps {
  feedback: FeedbackType;
  message?: string;
}

export function FeedbackPanel({ feedback, message }: FeedbackPanelProps) {
  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex items-center gap-3 px-6 py-4 rounded-lg"
            style={{
              background:
                feedback === "correct"
                  ? "rgba(200, 182, 141, 0.15)"
                  : "rgba(200, 182, 141, 0.1)",
              border: `1px solid ${
                feedback === "correct"
                  ? "rgba(200, 182, 141, 0.4)"
                  : "rgba(200, 182, 141, 0.2)"
              }`,
              boxShadow:
                feedback === "correct"
                  ? "0 0 30px rgba(200, 182, 141, 0.3)"
                  : "none",
            }}
            animate={
              feedback === "incorrect"
                ? {
                    x: [0, -10, 10, -10, 10, 0],
                  }
                : {
                    scale: [1, 1.05, 1],
                  }
            }
            transition={
              feedback === "incorrect"
                ? { duration: 0.5, ease: "easeInOut" }
                : { duration: 0.3 }
            }
          >
            {feedback === "correct" ? (
              <Check size={20} style={{ color: "#C8B68D" }} />
            ) : (
              <X size={20} style={{ color: "rgba(200, 182, 141, 0.7)" }} />
            )}
            <span className="font-mono text-sm" style={{ color: "#C8B68D" }}>
              {message ||
                (feedback === "correct" ? "Correct!" : "Incorrect. Try again.")}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
