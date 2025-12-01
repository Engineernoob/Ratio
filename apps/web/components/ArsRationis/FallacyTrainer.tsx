"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Fallacy } from "@/lib/logic/types";

interface FallacyTrainerProps {
  fallacies: Fallacy[];
}

export function FallacyTrainer({ fallacies }: FallacyTrainerProps) {
  const [currentFallacy, setCurrentFallacy] = useState<Fallacy | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (fallacies.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallacies.length);
      setCurrentFallacy(fallacies[randomIndex]);
      setIsRevealed(false);
      setUserAnswer("");
      setIsCorrect(false);
    }
  }, [fallacies]);

  const handleSubmit = () => {
    if (!currentFallacy) return;

    const correct =
      userAnswer.toLowerCase().trim() ===
      currentFallacy.name.toLowerCase().trim();
    setIsCorrect(correct);
    setIsRevealed(true);
  };

  const handleNext = () => {
    if (fallacies.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallacies.length);
      setCurrentFallacy(fallacies[randomIndex]);
      setIsRevealed(false);
      setUserAnswer("");
      setIsCorrect(false);
    }
  };

  if (!currentFallacy) {
    return (
      <div className="text-center py-20">
        <p
          className="font-mono text-sm opacity-60"
          style={{ color: "#C8B68D" }}
        >
          Loading fallacies...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="p-8 rounded-lg"
        style={{
          background: "rgba(10, 10, 10, 0.8)",
          border: "1px solid rgba(200, 182, 141, 0.2)",
        }}
      >
        {/* Example */}
        <div className="mb-6">
          <h3 className="font-serif text-lg mb-4" style={{ color: "#C8B68D" }}>
            Example
          </h3>
          <div
            className="p-4 rounded"
            style={{
              background: "rgba(200, 182, 141, 0.05)",
              border: "1px solid rgba(200, 182, 141, 0.2)",
            }}
          >
            <p
              className="font-mono text-sm leading-relaxed"
              style={{ color: "rgba(200, 182, 141, 0.9)" }}
            >
              {currentFallacy.example}
            </p>
          </div>
        </div>

        {/* Answer Input */}
        {!isRevealed && (
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              className="w-full px-4 py-3 bg-transparent border font-mono text-sm outline-none"
              style={{
                color: "#C8B68D",
                borderColor: "rgba(200, 182, 141, 0.3)",
                background: "rgba(10, 10, 10, 0.5)",
                borderRadius: "4px",
              }}
              placeholder="What fallacy is this?"
            />
            <motion.button
              onClick={handleSubmit}
              className="w-full py-3 font-mono text-sm"
              style={{
                color: "#C8B68D",
                border: "1px solid rgba(200, 182, 141, 0.3)",
                background: "rgba(200, 182, 141, 0.1)",
                borderRadius: "4px",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Answer
            </motion.button>
          </div>
        )}

        {/* Revealed Answer */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div
                className={`p-4 rounded ${
                  isCorrect ? "border-green-500" : "border-red-500"
                }`}
                style={{
                  background: isCorrect
                    ? "rgba(200, 182, 141, 0.1)"
                    : "rgba(200, 182, 141, 0.05)",
                  border: `1px solid ${
                    isCorrect
                      ? "rgba(200, 182, 141, 0.4)"
                      : "rgba(200, 182, 141, 0.2)"
                  }`,
                }}
              >
                <h4
                  className="font-serif text-lg mb-2"
                  style={{ color: "#C8B68D" }}
                >
                  {currentFallacy.name}
                </h4>
                <p
                  className="font-mono text-sm leading-relaxed mb-3"
                  style={{ color: "rgba(200, 182, 141, 0.8)" }}
                >
                  {currentFallacy.description}
                </p>
                <div
                  className="p-3 rounded mt-3"
                  style={{
                    background: "rgba(200, 182, 141, 0.05)",
                    border: "1px solid rgba(200, 182, 141, 0.2)",
                  }}
                >
                  <p
                    className="font-mono text-xs mb-2 opacity-60"
                    style={{ color: "#C8B68D" }}
                  >
                    Correction:
                  </p>
                  <p
                    className="font-mono text-sm"
                    style={{ color: "rgba(200, 182, 141, 0.9)" }}
                  >
                    {currentFallacy.correction}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleNext}
                className="w-full py-3 font-mono text-sm"
                style={{
                  color: "#C8B68D",
                  border: "1px solid rgba(200, 182, 141, 0.3)",
                  background: "rgba(200, 182, 141, 0.1)",
                  borderRadius: "4px",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next Fallacy
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
