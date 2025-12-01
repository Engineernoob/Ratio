/**
 * MEMORIA - Spaced Repetition Engine
 * Data models and types for the memory card system
 */

export type MemoryStage = "new" | "learning" | "review" | "mastered";

export type MemorySource =
  | "bibliotheca"
  | "micro-lesson"
  | "oikos-feed"
  | "lesson"
  | "puzzle"
  | "manual";

export interface MemoryCard {
  id: string;

  // Content
  title: string;
  content: string;
  question?: string;
  answer?: string;

  // Source tracking
  source: MemorySource;
  sourceId?: string; // ID of the original item (book slug, lesson ID, etc.)
  sourceMetadata?: Record<string, unknown>; // Additional context

  // SM-2 Algorithm fields
  stage: MemoryStage;
  ease: number; // Ease factor (typically 1.3 - 2.5, starts at 2.5)
  interval: number; // Days until next review
  due: string; // ISO date string (YYYY-MM-DD)
  reps: number; // Number of successful reviews

  // Metadata
  createdAt: string; // ISO date string
  lastReviewed?: string; // ISO date string
  consecutiveCorrect: number; // Streak of correct answers
  totalReviews: number; // Total number of review attempts

  // Tags and organization
  tags?: string[];
}

export interface CreateMemoryCardInput {
  title: string;
  content: string;
  question?: string;
  answer?: string;
  source: MemorySource;
  sourceId?: string;
  sourceMetadata?: Record<string, unknown>;
  tags?: string[];
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout
// 1 = incorrect, but remembered after seeing answer
// 2 = incorrect, but with effort remembered
// 3 = correct, but with difficulty
// 4 = correct, after hesitation
// 5 = perfect recall

export interface ReviewResult {
  card: MemoryCard;
  newInterval: number;
  newDue: string;
  newEase: number;
  newStage: MemoryStage;
}
