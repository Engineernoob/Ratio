"use client";

import { motion } from "framer-motion";

type RatingQuality = "easy" | "good" | "hard" | "forgot";

interface RecallRatingProps {
  onRate: (quality: RatingQuality) => void;
  disabled?: boolean;
}

export function RecallRating({ onRate, disabled = false }: RecallRatingProps) {
  const ratings: Array<{
    quality: RatingQuality;
    label: string;
    color: string;
  }> = [
    { quality: "easy", label: "Easy", color: "rgba(200, 182, 141, 0.8)" },
    { quality: "good", label: "Good", color: "rgba(200, 182, 141, 0.6)" },
    { quality: "hard", label: "Hard", color: "rgba(200, 182, 141, 0.4)" },
    { quality: "forgot", label: "Forgot", color: "rgba(200, 182, 141, 0.2)" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {ratings.map((rating, index) => (
        <motion.button
          key={rating.quality}
          onClick={() => !disabled && onRate(rating.quality)}
          disabled={disabled}
          className="px-6 py-3 font-mono text-sm"
          style={{
            color: rating.color,
            border: `1px solid ${rating.color}`,
            background: disabled
              ? "rgba(10, 10, 10, 0.3)"
              : "rgba(10, 10, 10, 0.6)",
            borderRadius: "4px",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: disabled ? 0.5 : 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={
            !disabled
              ? { scale: 1.05, background: "rgba(200, 182, 141, 0.1)" }
              : {}
          }
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          {rating.label}
        </motion.button>
      ))}
    </div>
  );
}
