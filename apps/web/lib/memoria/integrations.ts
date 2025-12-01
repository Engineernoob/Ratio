/**
 * MEMORIA - Integration Helpers
 * Functions to create memory cards from various sources
 */

import { initializeCard } from "./review";
import { createCard } from "./storage";
import type { MemoryCard, CreateMemoryCardInput } from "./types";
import type { MicroLesson, BookChapter } from "../feed";

/**
 * Create a memory card from a Bibliotheca micro-lesson
 */
export function createFromMicroLesson(
  microLesson: MicroLesson,
  sourceId: string,
  sourceMetadata?: {
    bookTitle?: string;
    chapter?: number;
    chapterTitle?: string;
  }
): MemoryCard {
  const card = initializeCard({
    id: `bibliotheca-${sourceId}-${microLesson.id}`,
    title: microLesson.title,
    content: microLesson.core_idea,
    question: microLesson.micro_test_q,
    answer: microLesson.micro_test_a,
    source: "bibliotheca",
    sourceId,
    sourceMetadata: {
      ...sourceMetadata,
      microLessonId: microLesson.id,
    },
    tags: ["BIBLIOTHECA", "MICRO-LESSON"],
  });

  return createCard(card);
}

/**
 * Create a memory card from a Bibliotheca chapter summary
 */
export function createFromChapterSummary(
  chapter: BookChapter,
  bookSlug: string,
  bookTitle: string
): MemoryCard {
  const card = initializeCard({
    id: `bibliotheca-${bookSlug}-chapter-${chapter.chapter}`,
    title: `${bookTitle} - ${chapter.chapter_title}`,
    content: chapter.summary,
    question: `Summarize the key ideas from ${chapter.chapter_title}`,
    answer: chapter.summary,
    source: "bibliotheca",
    sourceId: bookSlug,
    sourceMetadata: {
      bookTitle,
      chapter: chapter.chapter,
      chapterTitle: chapter.chapter_title,
    },
    tags: ["BIBLIOTHECA", "CHAPTER-SUMMARY"],
  });

  return createCard(card);
}

/**
 * Create a memory card from an Oikos feed item
 */
export function createFromFeedItem(feedItem: {
  id: string;
  title: string;
  content: string;
  type: string;
  source?: string;
}): MemoryCard {
  const card = initializeCard({
    id: `oikos-feed-${feedItem.id}`,
    title: feedItem.title,
    content: feedItem.content,
    question: `Recall the key points from: ${feedItem.title}`,
    answer: feedItem.content,
    source: "oikos-feed",
    sourceId: feedItem.id,
    sourceMetadata: {
      feedType: feedItem.type,
      feedSource: feedItem.source,
    },
    tags: ["OIKOS", "FEED", feedItem.type.toUpperCase()],
  });

  return createCard(card);
}

/**
 * Create a memory card from a lesson
 */
export function createFromLesson(lesson: {
  id: string;
  title: string;
  explanation: string;
  micro_test_question: string;
  micro_test_answer: string;
  topic_id?: string;
}): MemoryCard {
  const card = initializeCard({
    id: `lesson-${lesson.id}`,
    title: lesson.title,
    content: lesson.explanation,
    question: lesson.micro_test_question,
    answer: lesson.micro_test_answer,
    source: "lesson",
    sourceId: lesson.id,
    sourceMetadata: {
      topicId: lesson.topic_id,
    },
    tags: ["LESSON", lesson.topic_id?.toUpperCase() || "GENERAL"],
  });

  return createCard(card);
}

/**
 * Create a memory card from a puzzle
 */
export function createFromPuzzle(puzzle: {
  id: string;
  title: string;
  question: string;
  answer?: string;
  explanation?: string;
}): MemoryCard {
  const card = initializeCard({
    id: `puzzle-${puzzle.id}`,
    title: puzzle.title,
    content: puzzle.explanation || puzzle.question,
    question: puzzle.question,
    answer: puzzle.answer,
    source: "puzzle",
    sourceId: puzzle.id,
    tags: ["PUZZLE", "LOGIC"],
  });

  return createCard(card);
}

/**
 * Batch create cards from multiple sources
 */
export function batchCreateCards(
  inputs: CreateMemoryCardInput[]
): MemoryCard[] {
  const cards: MemoryCard[] = [];

  for (const input of inputs) {
    try {
      const id = `memoria-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const card = initializeCard({
        id,
        ...input,
      });
      const created = createCard(card);
      cards.push(created);
    } catch (error) {
      console.error(`Error creating card for ${input.title}:`, error);
    }
  }

  return cards;
}
