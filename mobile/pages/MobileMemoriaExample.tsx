"use client";

import { SwipeCardStack } from "@/components/mobile/SwipeCardStack";
import { BottomNav } from "@/components/mobile/BottomNav";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

interface MemoryCard {
  id: string;
  question: string;
  answer: string;
  revealed: boolean;
}

/**
 * Mobile-optimized Memoria page example
 *
 * Features:
 * - SwipeCardStack (Tinder-like)
 * - Left swipe: Forgot
 * - Right swipe: Easy
 * - Tap to reveal answer
 */
export function MobileMemoriaExample() {
  const { currentTheme } = useTheme();
  const [cards, setCards] = useState<MemoryCard[]>([
    {
      id: "1",
      question: "What is the definition of virtue?",
      answer: "Virtue is a mean between extremes...",
      revealed: false,
    },
    {
      id: "2",
      question: "Explain the concept of habitus",
      answer: "Habitus refers to...",
      revealed: false,
    },
  ]);

  const handleSwipeLeft = (card: MemoryCard) => {
    console.log("Forgot:", card.id);
    // Mark as forgotten, reschedule
  };

  const handleSwipeRight = (card: MemoryCard) => {
    console.log("Easy:", card.id);
    // Mark as easy, increase interval
  };

  const handleTap = (card: MemoryCard) => {
    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, revealed: !c.revealed } : c))
    );
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: currentTheme.background }}
    >
      <MobileHeader title="MEMORIA" subtitle="Memory Practice" />

      <div className="pt-20 pb-24">
        <SwipeCardStack
          items={cards}
          renderCard={(card, index) => (
            <div className="p-6 h-full flex flex-col justify-center">
              <div
                className="font-mono text-xs uppercase mb-4"
                style={{ color: `${currentTheme.accent}99` }}
              >
                Card {index + 1} of {cards.length}
              </div>
              <h2
                className="font-serif text-2xl mb-6"
                style={{ color: currentTheme.accent }}
              >
                {card.question}
              </h2>
              {card.revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg"
                  style={{
                    background: `${currentTheme.accent}10`,
                    border: `1px solid ${currentTheme.accent}33`,
                  }}
                >
                  <p
                    className="font-mono text-sm"
                    style={{ color: currentTheme.accent }}
                  >
                    {card.answer}
                  </p>
                </motion.div>
              )}
              {!card.revealed && (
                <p
                  className="font-mono text-xs italic mt-4"
                  style={{ color: `${currentTheme.accent}60` }}
                >
                  Tap to reveal answer
                </p>
              )}
            </div>
          )}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onTap={handleTap}
          leftActionLabel="Forgot"
          rightActionLabel="Easy"
        />
      </div>

      <BottomNav />
    </div>
  );
}
