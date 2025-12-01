"use client";

import { useState, useEffect, useCallback } from "react";
import type { MemoryCard, ReviewQuality } from "@/lib/memoria/types";

interface UseMemoriaQueueOptions {
  autoLoad?: boolean;
  date?: string;
}

interface UseMemoriaQueueReturn {
  cards: MemoryCard[];
  currentCard: MemoryCard | null;
  loading: boolean;
  error: string | null;
  reviewCard: (cardId: string, quality: ReviewQuality) => Promise<void>;
  loadDueCards: (date?: string) => Promise<void>;
  createCard: (input: {
    title: string;
    content: string;
    question?: string;
    answer?: string;
    source: string;
    sourceId?: string;
    sourceMetadata?: Record<string, unknown>;
    tags?: string[];
  }) => Promise<MemoryCard>;
  nextCard: () => void;
  hasMore: boolean;
}

export function useMemoriaQueue(
  options: UseMemoriaQueueOptions = {}
): UseMemoriaQueueReturn {
  const { autoLoad = true, date } = options;

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load due cards from API
   */
  const loadDueCards = useCallback(
    async (targetDate?: string) => {
      setLoading(true);
      setError(null);

      try {
        const reviewDate =
          targetDate || date || new Date().toISOString().split("T")[0];
        const response = await fetch(`/api/memoria/due?date=${reviewDate}`);

        if (!response.ok) {
          throw new Error("Failed to load due cards");
        }

        const data = await response.json();
        setCards(data.due || []);
        setCurrentIndex(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cards");
        setCards([]);
      } finally {
        setLoading(false);
      }
    },
    [date]
  );

  /**
   * Create a new memory card
   */
  const createCard = useCallback(
    async (input: {
      title: string;
      content: string;
      question?: string;
      answer?: string;
      source: string;
      sourceId?: string;
      sourceMetadata?: Record<string, unknown>;
      tags?: string[];
    }): Promise<MemoryCard> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/memoria/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create card");
        }

        const data = await response.json();

        // Reload due cards to include the new card if it's due
        await loadDueCards();

        return data.card;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create card";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadDueCards]
  );

  /**
   * Review a card with a quality rating
   */
  const reviewCard = useCallback(
    async (cardId: string, quality: ReviewQuality) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/memoria/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cardId, quality }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to review card");
        }

        const data = await response.json();

        // Update the card in the local state
        setCards((prevCards) =>
          prevCards.map((card) => (card.id === cardId ? data.card : card))
        );

        // Remove reviewed card from queue (or move to next)
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));

        // Adjust index if needed
        if (currentIndex >= cards.length - 1) {
          setCurrentIndex(Math.max(0, cards.length - 2));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to review card";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentIndex, cards.length]
  );

  /**
   * Move to next card
   */
  const nextCard = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, cards.length]);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadDueCards();
    }
  }, [autoLoad, loadDueCards]);

  const currentCard = cards[currentIndex] || null;
  const hasMore = currentIndex < cards.length - 1;

  return {
    cards,
    currentCard,
    loading,
    error,
    reviewCard,
    loadDueCards,
    createCard,
    nextCard,
    hasMore,
  };
}
