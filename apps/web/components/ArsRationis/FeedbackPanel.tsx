"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface FeedbackPanelProps {
  isValid: boolean | null;
  message?: string;
}

export function FeedbackPanel({ isValid, message }: FeedbackPanelProps) {
  return (
    <AnimatePresence>
      {isValid !== null && (
        <motion.div
          className="mt-6 p-6 rounded-lg"
          style={{
            background: isValid
              ? "rgba(200, 182, 141, 0.1)"
              : "rgba(200, 182, 141, 0.05)",
            border: `1px solid ${
              isValid ? "rgba(200, 182, 141, 0.4)" : "rgba(200, 182, 141, 0.2)"
            }`,
            boxShadow: isValid ? "0 0 30px rgba(200, 182, 141, 0.2)" : "none",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            {isValid ? (
              <Check size={20} style={{ color: "#C8B68D" }} />
            ) : (
              <X size={20} style={{ color: "rgba(200, 182, 141, 0.7)" }} />
            )}
            <span className="font-mono text-sm" style={{ color: "#C8B68D" }}>
              {message || (isValid ? "Valid argument" : "Invalid argument")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
