"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  explanation?: string;
  onClose: () => void;
  onNext?: () => void;
}

export function ResultModal({
  isOpen,
  isCorrect,
  explanation,
  onClose,
  onNext,
}: ResultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto p-8 rounded-lg"
              style={{
                background: "#0A0A0A",
                border: `1px solid ${
                  isCorrect
                    ? "rgba(200, 182, 141, 0.4)"
                    : "rgba(200, 182, 141, 0.2)"
                }`,
                boxShadow: isCorrect
                  ? "0 0 40px rgba(200, 182, 141, 0.3)"
                  : "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-full"
                    style={{
                      background: isCorrect
                        ? "rgba(200, 182, 141, 0.2)"
                        : "rgba(200, 182, 141, 0.1)",
                    }}
                  >
                    {isCorrect ? (
                      <Check size={24} style={{ color: "#C8B68D" }} />
                    ) : (
                      <X
                        size={24}
                        style={{ color: "rgba(200, 182, 141, 0.7)" }}
                      />
                    )}
                  </div>
                  <h2
                    className="font-serif text-2xl"
                    style={{ color: "#C8B68D" }}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </h2>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:opacity-70 transition-opacity"
                  style={{ color: "#C8B68D" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {explanation && (
                <div className="mb-6">
                  <h3
                    className="font-serif text-lg mb-3"
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
                </div>
              )}

              <div className="flex gap-3">
                {onNext && (
                  <motion.button
                    onClick={onNext}
                    className="px-6 py-3 font-mono text-sm"
                    style={{
                      color: "#C8B68D",
                      border: "1px solid rgba(200, 182, 141, 0.3)",
                      background: "rgba(200, 182, 141, 0.1)",
                      borderRadius: "4px",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next Puzzle
                  </motion.button>
                )}
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 font-mono text-sm"
                  style={{
                    color: "#C8B68D",
                    border: "1px solid rgba(200, 182, 141, 0.3)",
                    background: "rgba(200, 182, 141, 0.1)",
                    borderRadius: "4px",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
