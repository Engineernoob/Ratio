"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MemoryCard } from "@/lib/memoria/types";
import { RecallRating } from "./RecallRating";

interface MemoryCardProps {
  card: MemoryCard;
  onRate: (quality: "easy" | "good" | "hard" | "forgot") => void;
  isRevealed: boolean;
  onReveal: () => void;
}

export const MemoryCard = memo(function MemoryCard({
  card,
  onRate,
  isRevealed,
  onReveal,
}: MemoryCardProps) {
  const [isRating, setIsRating] = useState(false);

  const handleRate = async (quality: "easy" | "good" | "hard" | "forgot") => {
    setIsRating(true);
    await onRate(quality);
    setIsRating(false);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="p-8 rounded-lg"
        style={{
          border: "1px solid rgba(200, 182, 141, 0.2)",
          background: "rgba(10, 10, 10, 0.7)",
        }}
      >
        {/* Question */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl mb-4" style={{ color: "#C8B68D" }}>
            {card.question || card.title}
          </h2>
          {card.content && !card.question && (
            <p
              className="font-mono text-sm leading-relaxed opacity-80"
              style={{ color: "#C8B68D" }}
            >
              {card.content}
            </p>
          )}
        </div>

        {/* Reveal Button */}
        {!isRevealed && (
          <motion.button
            onClick={onReveal}
            className="w-full py-4 font-mono text-sm mb-8"
            style={{
              color: "#C8B68D",
              border: "1px solid rgba(200, 182, 141, 0.3)",
              background: "rgba(200, 182, 141, 0.1)",
              borderRadius: "4px",
            }}
            whileHover={{
              scale: 1.02,
              background: "rgba(200, 182, 141, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Reveal Answer
          </motion.button>
        )}

        {/* Answer */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="p-6 mb-8 rounded"
                style={{
                  background: "rgba(200, 182, 141, 0.05)",
                  border: "1px solid rgba(200, 182, 141, 0.2)",
                }}
              >
                <h3
                  className="font-serif text-lg mb-3"
                  style={{ color: "#C8B68D" }}
                >
                  Answer
                </h3>
                <p
                  className="font-mono text-sm leading-relaxed"
                  style={{ color: "rgba(200, 182, 141, 0.9)" }}
                >
                  {card.answer || card.content}
                </p>
              </div>

              {/* Rating Buttons */}
              <RecallRating onRate={handleRate} disabled={isRating} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});
