"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayDate } from "@/lib/utils/date";
import type { MemoryCard } from "@/lib/memoria/types";
import { RecallRating } from "./RecallRating";
import { StatsPanel } from "./StatsPanel";
import { calculateStats } from "@/lib/memoria/utils";

interface ScholarModeProps {
  cards: MemoryCard[];
  onCardReviewed: () => void;
}

export function ScholarMode({ cards, onCardReviewed }: ScholarModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const dueCards = useMemo(() => {
    const today = getTodayDate();
    return cards.filter((card) => card.due <= today);
  }, [cards]);

  const currentCard = dueCards[currentIndex];
  const stats = calculateStats(cards);

  // Timer
  useEffect(() => {
    if (startTime === null) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
    if (startTime === null) {
      setStartTime(Date.now());
    }
  }, [startTime]);

  const handleRate = useCallback(
    async (quality: "easy" | "good" | "hard" | "forgot") => {
      if (!currentCard) return;

      try {
        const response = await fetch("/api/memoria/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId: currentCard.id,
            quality,
          }),
        });

        if (response.ok) {
          // Move to next card
          setCurrentIndex((prev) => {
            if (prev < dueCards.length - 1) {
              return prev + 1;
            } else {
              return 0;
            }
          });
          setIsRevealed(false);
          setStartTime(null);
          setElapsedTime(0);
          onCardReviewed();
        }
      } catch (error) {
        console.error("Error reviewing card:", error);
      }
    },
    [currentCard, dueCards.length, onCardReviewed]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentCard) return;

      if (e.key === " " && !isRevealed) {
        e.preventDefault();
        handleReveal();
        return;
      }

      if (!isRevealed) return;

      switch (e.key) {
        case "1":
          handleRate("easy");
          break;
        case "2":
          handleRate("good");
          break;
        case "3":
          handleRate("hard");
          break;
        case "4":
          handleRate("forgot");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentCard, isRevealed, handleReveal, handleRate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (dueCards.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="font-serif text-2xl mb-4" style={{ color: "#C8B68D" }}>
          All Caught Up
        </h2>
        <p
          className="font-mono text-sm opacity-60"
          style={{ color: "#C8B68D" }}
        >
          No cards due for review today.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Study Area */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-2 gap-6">
          {/* Question Side */}
          <motion.div
            className="p-8 rounded-lg"
            style={{
              border: "1px solid rgba(200, 182, 141, 0.2)",
              background: "rgba(10, 10, 10, 0.7)",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={currentCard?.id}
          >
            <h2
              className="font-serif text-xl mb-4"
              style={{ color: "#C8B68D" }}
            >
              Question
            </h2>
            <p
              className="font-mono text-sm leading-relaxed"
              style={{ color: "rgba(200, 182, 141, 0.9)" }}
            >
              {currentCard?.question || currentCard?.title}
            </p>
          </motion.div>

          {/* Answer Side */}
          <motion.div
            className="p-8 rounded-lg relative"
            style={{
              border: "1px solid rgba(200, 182, 141, 0.2)",
              background: "rgba(10, 10, 10, 0.7)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={currentCard?.id}
          >
            <h2
              className="font-serif text-xl mb-4"
              style={{ color: "#C8B68D" }}
            >
              Answer
            </h2>
            {!isRevealed ? (
              <div>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: "rgba(10, 10, 10, 0.9)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <motion.button
                    onClick={handleReveal}
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
                    Reveal Answer
                  </motion.button>
                </div>
                <p
                  className="font-mono text-sm leading-relaxed blur-sm"
                  style={{ color: "rgba(200, 182, 141, 0.3)" }}
                >
                  {currentCard?.answer || currentCard?.content}
                </p>
              </div>
            ) : (
              <p
                className="font-mono text-sm leading-relaxed"
                style={{ color: "rgba(200, 182, 141, 0.9)" }}
              >
                {currentCard?.answer || currentCard?.content}
              </p>
            )}
          </motion.div>
        </div>

        {/* Timer and Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div
            className="font-mono text-sm"
            style={{ color: "rgba(200, 182, 141, 0.6)" }}
          >
            {startTime !== null && `Time: ${formatTime(elapsedTime)}`}
          </div>
          <div
            className="font-mono text-xs opacity-50"
            style={{ color: "#C8B68D" }}
          >
            {currentIndex + 1} of {dueCards.length}
          </div>
        </div>

        {/* Rating Buttons */}
        {isRevealed && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RecallRating onRate={handleRate} />
            <p
              className="text-center mt-4 font-mono text-xs opacity-50"
              style={{ color: "#C8B68D" }}
            >
              Press 1-4 or click to rate
            </p>
          </motion.div>
        )}
      </div>

      {/* Stats Panel */}
      <div className="lg:col-span-1">
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
}
