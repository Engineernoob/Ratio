/**
 * Ratio AI Mentor - State Management
 * Tracks user weaknesses, errors, and progress for adaptive mentoring
 */

import type { UserState, MentorMessage } from "./types";

const STATE_FILE = "mentor-state.json";

// In-memory state (in production, this would be persisted)
let userState: UserState | null = null;

/**
 * Initialize or load user state
 */
export function loadUserState(): UserState {
  if (userState) return userState;

  // Default state
  userState = {
    weakTopics: [],
    toughMemoriaItems: [],
    failedPuzzles: [],
    fallacyErrors: [],
    booksInProgress: [],
    logicMapErrors: [],
    metrics: {
      memoriaAccuracy: 0,
      reasoningAccuracy: 0,
      bookProgress: 0,
      dailyStreak: 0,
      learningVelocity: 0,
    },
  };

  return userState;
}

/**
 * Update user state from various data sources
 */
export async function updateUserState(): Promise<UserState> {
  const state = loadUserState();

  try {
    // Load memoria cards to find weak items
    const memoriaRes = await fetch("/api/memoria/cards");
    if (memoriaRes.ok) {
      const { cards } = await memoriaRes.json();
      if (cards && Array.isArray(cards)) {
        // Find cards with low ease (struggling)
        state.toughMemoriaItems = cards
          .filter((card: any) => card.ease < 2.0)
          .map((card: any) => ({
            id: card.id,
            title: card.title,
            ease: card.ease,
            errorCount: card.totalReviews - card.consecutiveCorrect || 0,
          }))
          .sort((a, b) => a.ease - b.ease)
          .slice(0, 10);
      }
    }

    // Load books to track progress
    const bookIds = ["meditations", "AtomicHabits"];
    const booksInProgress = [];
    for (const bookId of bookIds) {
      try {
        const res = await fetch(`/api/books/${bookId}?action=manifest`);
        if (res.ok) {
          const book = await res.json();
          // Simulate progress (in real app, this would come from user data)
          const progress = Math.random() * 0.8;
          booksInProgress.push({
            id: book.id,
            title: book.title,
            progress,
            lastChapter:
              book.chapters?.[Math.floor(progress * book.chapters.length)]
                ?.id || "",
          });
        }
      } catch (error) {
        console.error(`Error loading book ${bookId}:`, error);
      }
    }
    state.booksInProgress = booksInProgress;

    // Calculate metrics (simplified - in real app, compute from actual data)
    state.metrics = {
      memoriaAccuracy: calculateMemoriaAccuracy(state.toughMemoriaItems),
      reasoningAccuracy: 75, // Would come from puzzle results
      bookProgress:
        booksInProgress.reduce((sum, b) => sum + b.progress, 0) /
          booksInProgress.length || 0,
      dailyStreak: 7, // Would come from feed assignments
      learningVelocity: state.toughMemoriaItems.length * 0.5, // Simplified
    };

    // Extract weak topics from memoria items
    state.weakTopics = extractWeakTopics(state.toughMemoriaItems);
  } catch (error) {
    console.error("Error updating user state:", error);
  }

  userState = state;
  return state;
}

/**
 * Record a failed puzzle attempt
 */
export function recordFailedPuzzle(
  puzzleId: string,
  type: string,
  error: string
) {
  const state = loadUserState();
  const existing = state.failedPuzzles.find((p) => p.id === puzzleId);
  if (existing) {
    existing.attempts++;
  } else {
    state.failedPuzzles.push({
      id: puzzleId,
      type,
      error,
      attempts: 1,
    });
  }
}

/**
 * Record a fallacy error
 */
export function recordFallacyError(type: string, context: string) {
  const state = loadUserState();
  const existing = state.fallacyErrors.find((f) => f.type === type);
  if (existing) {
    existing.count++;
  } else {
    state.fallacyErrors.push({
      type,
      context,
      count: 1,
    });
  }
}

/**
 * Record a logic map error
 */
export function recordLogicMapError(type: string, description: string) {
  const state = loadUserState();
  const existing = state.logicMapErrors.find((e) => e.type === type);
  if (existing) {
    existing.count++;
  } else {
    state.logicMapErrors.push({
      type,
      description,
      count: 1,
    });
  }
}

/**
 * Get conversation history (in production, persist to storage)
 */
let conversationHistory: MentorMessage[] = [];

export function getConversationHistory(): MentorMessage[] {
  return conversationHistory;
}

export function addToConversationHistory(message: MentorMessage) {
  conversationHistory.push(message);
  // Keep last 20 messages
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }
}

export function clearConversationHistory() {
  conversationHistory = [];
}

// Helper functions

function calculateMemoriaAccuracy(
  items: UserState["toughMemoriaItems"]
): number {
  if (items.length === 0) return 100;
  const avgEase =
    items.reduce((sum, item) => sum + item.ease, 0) / items.length;
  // Convert ease (typically 1.3-2.5) to percentage
  return Math.max(0, Math.min(100, ((avgEase - 1.3) / (2.5 - 1.3)) * 100));
}

function extractWeakTopics(items: UserState["toughMemoriaItems"]): string[] {
  // Extract topics from card titles (simplified)
  const topics = new Set<string>();
  items.forEach((item) => {
    // Simple keyword extraction
    const words = item.title.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      if (
        word.length > 4 &&
        !["the", "this", "that", "from", "with"].includes(word)
      ) {
        topics.add(word);
      }
    });
  });
  return Array.from(topics).slice(0, 5);
}
