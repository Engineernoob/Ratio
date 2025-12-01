/**
 * MEMORIA - SM-2 Spaced Repetition Algorithm
 *
 * Based on SuperMemo 2 algorithm with adaptations for the Ratio OS context.
 *
 * Algorithm overview:
 * - New cards start with ease=2.5, interval=0, stage="new"
 * - Quality 0-2: Reset to learning stage, decrease ease
 * - Quality 3-5: Advance interval, increase ease (within bounds)
 * - Interval calculation: interval * ease_factor
 */

import type {
  MemoryCard,
  ReviewQuality,
  ReviewResult,
  MemoryStage,
} from "./types";
import { getTodayDate } from "@/lib/utils/date";

/**
 * Calculate new card state after a review
 */
export function calculateReview(
  card: MemoryCard,
  quality: ReviewQuality
): ReviewResult {
  const today = getTodayDate();

  let newEase = card.ease;
  let newInterval = card.interval;
  let newStage: MemoryStage = card.stage;
  let newReps = card.reps;
  let newConsecutiveCorrect = card.consecutiveCorrect;

  // Update review statistics
  const newTotalReviews = card.totalReviews + 1;

  if (quality >= 3) {
    // Correct answer
    newConsecutiveCorrect += 1;
    newReps += 1;

    // Adjust ease factor (SM-2 formula)
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const easeChange = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    newEase = Math.max(1.3, Math.min(2.5, card.ease + easeChange));

    // Calculate new interval
    if (card.stage === "new") {
      // First successful review: 1 day
      newInterval = 1;
      newStage = "learning";
    } else if (card.stage === "learning") {
      // Second successful review: 6 days
      if (card.reps === 0) {
        newInterval = 6;
      } else {
        // Use ease factor for subsequent intervals
        newInterval = Math.round(card.interval * newEase);
        if (newInterval >= 30) {
          newStage = "review";
        }
      }
    } else if (card.stage === "review") {
      // Mature cards: multiply interval by ease
      newInterval = Math.round(card.interval * newEase);
      if (newInterval >= 365) {
        newStage = "mastered";
      }
    } else {
      // Mastered cards: maintain long intervals
      newInterval = Math.round(card.interval * newEase);
    }
  } else {
    // Incorrect answer (quality 0-2)
    newConsecutiveCorrect = 0;

    // Decrease ease factor
    newEase = Math.max(1.3, card.ease - 0.15);

    // Reset interval based on quality
    if (quality === 0) {
      // Complete blackout: reset to new
      newInterval = 0;
      newStage = "new";
      newReps = 0;
    } else if (quality === 1) {
      // Remembered after seeing answer: 1 day
      newInterval = 1;
      newStage = "learning";
    } else {
      // Remembered with effort: 3 days
      newInterval = 3;
      newStage = "learning";
    }
  }

  // Calculate new due date
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + newInterval);
  const newDue = dueDate.toISOString().split("T")[0];

  // Update card
  const updatedCard: MemoryCard = {
    ...card,
    ease: newEase,
    interval: newInterval,
    due: newDue,
    reps: newReps,
    stage: newStage,
    lastReviewed: today,
    consecutiveCorrect: newConsecutiveCorrect,
    totalReviews: newTotalReviews,
  };

  return {
    card: updatedCard,
    newInterval,
    newDue,
    newEase,
    newStage,
  };
}

/**
 * Initialize a new memory card
 */
export function initializeCard(input: {
  id: string;
  title: string;
  content: string;
  question?: string;
  answer?: string;
  source: string;
  sourceId?: string;
  sourceMetadata?: Record<string, unknown>;
  tags?: string[];
}): MemoryCard {
  const today = getTodayDate();

  return {
    id: input.id,
    title: input.title,
    content: input.content,
    question: input.question,
    answer: input.answer,
    source: input.source as any,
    sourceId: input.sourceId,
    sourceMetadata: input.sourceMetadata,
    tags: input.tags || [],
    stage: "new",
    ease: 2.5, // Starting ease factor
    interval: 0, // Will be set on first review
    due: today, // Due immediately for first review
    reps: 0,
    createdAt: today,
    consecutiveCorrect: 0,
    totalReviews: 0,
  };
}

/**
 * Get cards due for review on a given date
 */
export function getDueCards(cards: MemoryCard[], date: string): MemoryCard[] {
  return cards
    .filter((card) => card.due <= date)
    .sort((a, b) => {
      // Sort by priority:
      // 1. Overdue cards first
      // 2. Then by stage (new > learning > review > mastered)
      // 3. Then by due date

      const aOverdue = a.due < date;
      const bOverdue = b.due < date;

      if (aOverdue !== bOverdue) {
        return aOverdue ? -1 : 1;
      }

      const stagePriority: Record<MemoryStage, number> = {
        new: 4,
        learning: 3,
        review: 2,
        mastered: 1,
      };

      const aPriority = stagePriority[a.stage];
      const bPriority = stagePriority[b.stage];

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return a.due.localeCompare(b.due);
    });
}
