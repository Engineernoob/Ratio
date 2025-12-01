import type { MemoryCard, ReviewQuality } from "./types";
import { calculateReview } from "./review";
import { getTodayDate } from "@/lib/utils/date";

/**
 * Map quality rating to ReviewQuality
 */
export function mapQualityToReviewQuality(
  quality: "easy" | "good" | "hard" | "forgot"
): ReviewQuality {
  switch (quality) {
    case "easy":
      return 5;
    case "good":
      return 4;
    case "hard":
      return 3;
    case "forgot":
      return 0;
    default:
      return 3;
  }
}

/**
 * Review a card and calculate the result
 * Note: Saving should be done via API route (/api/memoria/review)
 */
export function calculateCardReview(
  card: MemoryCard,
  quality: "easy" | "good" | "hard" | "forgot"
): MemoryCard {
  const reviewQuality = mapQualityToReviewQuality(quality);
  const result = calculateReview(card, reviewQuality);
  return result.card;
}

/**
 * Review a card and save via API
 * This is the client-safe version that calls the API route
 */
export async function reviewCard(
  card: MemoryCard,
  quality: "easy" | "good" | "hard" | "forgot"
): Promise<MemoryCard> {
  const updatedCard = calculateCardReview(card, quality);

  // Save via API route (server-side)
  const response = await fetch("/api/memoria/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cardId: card.id,
      quality,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save card review");
  }

  const data = await response.json();
  return data.card || updatedCard;
}

/**
 * Get cards due for review today
 */
export function getDueCardsToday(cards: MemoryCard[]): MemoryCard[] {
  const today = getTodayDate();
  return cards.filter((card) => card.due <= today);
}

/**
 * Calculate statistics from cards
 */
export function calculateStats(cards: MemoryCard[]) {
  const dueToday = getDueCardsToday(cards);

  const totalCards = cards.length;
  const newCards = cards.filter((c) => c.stage === "new").length;
  const learningCards = cards.filter((c) => c.stage === "learning").length;
  const reviewCards = cards.filter((c) => c.stage === "review").length;
  const masteredCards = cards.filter((c) => c.stage === "mastered").length;

  const totalReviews = cards.reduce((sum, c) => sum + c.totalReviews, 0);
  const averageEase =
    cards.length > 0
      ? cards.reduce((sum, c) => sum + c.ease, 0) / cards.length
      : 0;

  const currentStreak = Math.max(...cards.map((c) => c.consecutiveCorrect), 0);

  // Calculate accuracy (simplified: based on consecutive correct vs total reviews)
  const accuracy =
    totalReviews > 0
      ? (cards.reduce((sum, c) => sum + c.consecutiveCorrect, 0) /
          totalReviews) *
        100
      : 0;

  // Difficulty distribution
  const difficultyDistribution = {
    easy: cards.filter((c) => c.ease >= 2.2).length,
    medium: cards.filter((c) => c.ease >= 1.7 && c.ease < 2.2).length,
    hard: cards.filter((c) => c.ease < 1.7).length,
  };

  return {
    totalCards,
    dueToday: dueToday.length,
    newCards,
    learningCards,
    reviewCards,
    masteredCards,
    totalReviews,
    averageEase: Math.round(averageEase * 100) / 100,
    currentStreak,
    accuracy: Math.round(accuracy * 10) / 10,
    difficultyDistribution,
  };
}
