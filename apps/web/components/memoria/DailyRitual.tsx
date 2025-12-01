"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayDate } from "@/lib/utils/date";
import type { MemoryCard } from "@/lib/memoria/types";
import { MemoryCard as MemoryCardComponent } from "./MemoryCard";
import { StatsPanel } from "./StatsPanel";
import { calculateStats } from "@/lib/memoria/utils";

interface DailyRitualProps {
  cards: MemoryCard[];
  onCardReviewed: () => void;
}

export function DailyRitual({ cards, onCardReviewed }: DailyRitualProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const dueCards = useMemo(() => {
    const today = getTodayDate();
    return cards.filter((card) => card.due <= today);
  }, [cards]);

  const currentCard = dueCards[currentIndex];
  const stats = calculateStats(cards);

  useEffect(() => {
    setIsRevealed(false);
  }, [currentIndex]);

  const handleRate = async (quality: "easy" | "good" | "hard" | "forgot") => {
    if (!currentCard) return;

    setIsTransitioning(true);

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
        setTimeout(() => {
          if (currentIndex < dueCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            // All cards reviewed
            setCurrentIndex(0);
          }
          setIsTransitioning(false);
          setIsRevealed(false);
          onCardReviewed();
        }, 500);
      }
    } catch (error) {
      console.error("Error reviewing card:", error);
      setIsTransitioning(false);
    }
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
          No cards due for review today. Great work!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Card Area */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {currentCard && (
            <MemoryCardComponent
              key={currentCard.id}
              card={currentCard}
              onRate={handleRate}
              isRevealed={isRevealed}
              onReveal={() => setIsRevealed(true)}
            />
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <p
            className="font-mono text-xs opacity-50"
            style={{ color: "#C8B68D" }}
          >
            {currentIndex + 1} of {dueCards.length}
          </p>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="lg:col-span-1">
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
}
