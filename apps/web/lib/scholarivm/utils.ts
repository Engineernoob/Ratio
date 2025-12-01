/**
 * Utility functions for SCHOLARIVM page
 * Computes statistics and metrics from various data sources
 */

import type { MemoryCard } from "@/lib/memoria/types";

export interface BookProgress {
  id: string;
  title: string;
  author: string;
  chaptersTotal: number;
  chaptersCompleted: number;
  progressPercent: number;
}

export interface MasteryData {
  level: number;
  xp: number;
  xpToNext: number;
  masteryPercent: number;
  growthSinceLastWeek: number;
}

export interface MemoriaStats {
  activeCards: number;
  hardestCards: Array<{ title: string; ease: number }>;
  strongestCards: Array<{ title: string; ease: number }>;
  upcomingReviews: number;
}

export interface ReasoningStats {
  fallacyAccuracy: number;
  logicPuzzleAccuracy: number;
  syllogismMastery: number;
}

export interface GraphDataPoint {
  date: string;
  value: number;
}

/**
 * Calculate mastery level from XP
 * Levels: Novice (0-100), Apprentice (100-300), Scholar (300-600), Master (600-1000), Archon (1000+)
 */
export function calculateMasteryLevel(xp: number): {
  level: number;
  levelName: string;
  xpToNext: number;
} {
  if (xp < 100) {
    return { level: 1, levelName: "Novice", xpToNext: 100 - xp };
  } else if (xp < 300) {
    return { level: 2, levelName: "Apprentice", xpToNext: 300 - xp };
  } else if (xp < 600) {
    return { level: 3, levelName: "Scholar", xpToNext: 600 - xp };
  } else if (xp < 1000) {
    return { level: 4, levelName: "Master", xpToNext: 1000 - xp };
  } else {
    return { level: 5, levelName: "Archon", xpToNext: 0 };
  }
}

/**
 * Calculate memory retention rate from memoria cards
 */
export function calculateMemoryRetention(cards: MemoryCard[]): number {
  if (cards.length === 0) return 0;

  const now = new Date();
  const recentReviews = cards.filter((card) => {
    if (!card.lastReviewed) return false;
    const reviewDate = new Date(card.lastReviewed);
    const daysSince =
      (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= card.interval * 1.2; // Within 20% of interval
  });

  return (recentReviews.length / cards.length) * 100;
}

/**
 * Calculate learning velocity (items/day)
 */
export function calculateLearningVelocity(
  cards: MemoryCard[],
  days: number = 30
): number {
  if (days === 0) return 0;

  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const recentCards = cards.filter((card) => {
    const createdDate = new Date(card.createdAt);
    return createdDate >= cutoffDate;
  });

  return recentCards.length / days;
}

/**
 * Calculate book progress from book manifests
 */
export function calculateBookProgress(
  books: Array<{ id: string; title: string; author: string; chapters: any[] }>,
  completedChapters: Record<string, Set<string>>
): BookProgress[] {
  return books.map((book) => {
    const completed = completedChapters[book.id] || new Set();
    const chaptersCompleted = completed.size;
    const chaptersTotal = book.chapters.length;
    const progressPercent =
      chaptersTotal > 0 ? (chaptersCompleted / chaptersTotal) * 100 : 0;

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      chaptersTotal,
      chaptersCompleted,
      progressPercent,
    };
  });
}

/**
 * Calculate mastery XP from various sources
 */
export function calculateMasteryXP(
  cards: MemoryCard[],
  books: BookProgress[],
  puzzleAccuracy: number
): {
  knowledge: number;
  memoria: number;
  ratio: number;
  ars: number;
} {
  // Knowledge: from books read
  const knowledgeXP =
    books.reduce((sum, book) => sum + book.chaptersCompleted * 10, 0) +
    books.length * 20;

  // Memoria: from card reviews
  const memoriaXP =
    cards.reduce((sum, card) => sum + card.totalReviews * 5, 0) +
    cards.filter((c) => c.stage === "mastered").length * 50;

  // Ratio: from reasoning accuracy
  const ratioXP = puzzleAccuracy * 100;

  // Ars: combination of all
  const arsXP = (knowledgeXP + memoriaXP + ratioXP) * 0.3;

  return {
    knowledge: Math.round(knowledgeXP),
    memoria: Math.round(memoriaXP),
    ratio: Math.round(ratioXP),
    ars: Math.round(arsXP),
  };
}

/**
 * Get memoria statistics
 */
export function getMemoriaStats(cards: MemoryCard[]): MemoriaStats {
  const activeCards = cards.filter((c) => c.stage !== "mastered").length;

  // Hardest cards (lowest ease)
  const hardestCards = [...cards]
    .sort((a, b) => a.ease - b.ease)
    .slice(0, 5)
    .map((c) => ({ title: c.title, ease: c.ease }));

  // Strongest cards (highest ease, mastered)
  const strongestCards = [...cards]
    .filter((c) => c.stage === "mastered")
    .sort((a, b) => b.ease - a.ease)
    .slice(0, 5)
    .map((c) => ({ title: c.title, ease: c.ease }));

  // Upcoming reviews (due today or soon)
  const now = new Date();
  const upcomingReviews = cards.filter((card) => {
    const dueDate = new Date(card.due);
    const daysUntil =
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntil <= 1 && daysUntil >= 0;
  }).length;

  return {
    activeCards,
    hardestCards,
    strongestCards,
    upcomingReviews,
  };
}

/**
 * Generate graph data for memory retention
 */
export function generateMemoryRetentionData(
  cards: MemoryCard[],
  days: number = 30
): GraphDataPoint[] {
  const data: GraphDataPoint[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    // Calculate retention for this day
    const cardsReviewed = cards.filter((card) => {
      if (!card.lastReviewed) return false;
      const reviewDate = new Date(card.lastReviewed);
      return reviewDate.toISOString().split("T")[0] === dateStr;
    });

    const retention =
      cards.length > 0 ? (cardsReviewed.length / cards.length) * 100 : 0;

    data.push({ date: dateStr, value: retention });
  }

  return data;
}

/**
 * Generate graph data for learning velocity
 */
export function generateLearningVelocityData(
  cards: MemoryCard[],
  days: number = 30
): GraphDataPoint[] {
  const data: GraphDataPoint[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    const cardsCreated = cards.filter((card) => {
      const createdDate = new Date(card.createdAt);
      return createdDate.toISOString().split("T")[0] === dateStr;
    }).length;

    data.push({ date: dateStr, value: cardsCreated });
  }

  return data;
}

/**
 * Calculate reasoning stats from puzzle results
 */
export function calculateReasoningStats(
  puzzleResults: Array<{ correct: boolean; type: string }>
): ReasoningStats {
  if (puzzleResults.length === 0) {
    return {
      fallacyAccuracy: 0,
      logicPuzzleAccuracy: 0,
      syllogismMastery: 0,
    };
  }

  const fallacyResults = puzzleResults.filter((r) => r.type === "fallacy");
  const logicResults = puzzleResults.filter((r) => r.type === "logic");
  const syllogismResults = puzzleResults.filter((r) => r.type === "syllogism");

  const fallacyAccuracy =
    fallacyResults.length > 0
      ? (fallacyResults.filter((r) => r.correct).length /
          fallacyResults.length) *
        100
      : 0;

  const logicPuzzleAccuracy =
    logicResults.length > 0
      ? (logicResults.filter((r) => r.correct).length / logicResults.length) *
        100
      : 0;

  const syllogismMastery =
    syllogismResults.length > 0
      ? (syllogismResults.filter((r) => r.correct).length /
          syllogismResults.length) *
        100
      : 0;

  return {
    fallacyAccuracy,
    logicPuzzleAccuracy,
    syllogismMastery,
  };
}

/**
 * Calculate streak count from daily activity
 */
export function calculateStreak(
  cards: MemoryCard[],
  assignments: Record<string, any>
): number {
  const now = new Date();
  let streak = 0;
  let currentDate = new Date(now);

  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];

    // Check if there was activity on this date
    const hasActivity =
      assignments[dateStr] ||
      cards.some((card) => {
        if (!card.lastReviewed) return false;
        return card.lastReviewed.startsWith(dateStr);
      });

    if (!hasActivity) break;

    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}
