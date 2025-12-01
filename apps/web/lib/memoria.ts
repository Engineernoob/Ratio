/**
 * MEMORIA - Legacy compatibility layer
 *
 * This file maintains backward compatibility with the old MemoriaConcept interface
 * while the new system uses MemoryCard in lib/memoria/
 *
 * New code should import from "@/lib/memoria" instead
 */

import fs from "fs";
import path from "path";

// Legacy interface (deprecated - use MemoryCard from lib/memoria/types)
export interface MemoriaConcept {
  id: string;
  title: string;
  explanation: string;
  micro_question: string;
  micro_answer: string;
  date_added: string;
  next_review: string;
  interval_days: number;
  ease_factor: number;
  review_count: number;
  source: "lesson" | "manual" | "tiktok" | "book_summary" | "book" | "puzzle";
}

// Re-export new system from memoria/index
export * from "./memoria/index";

const DATA_DIR = path.join(process.cwd(), "data");
const MEMORIA_FILE = path.join(DATA_DIR, "memoria.json");

// SM-2 Light intervals: 1d → 3d → 7d → 14d → 30d
const INTERVALS = [1, 3, 7, 14, 30];

import { getTodayDate } from "@/lib/utils/date";

function getTodayDateString(): string {
  return getTodayDate();
}

function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function getConcepts(): MemoriaConcept[] {
  try {
    if (fs.existsSync(MEMORIA_FILE)) {
      const data = fs.readFileSync(MEMORIA_FILE, "utf-8");
      return JSON.parse(data).concepts || [];
    }
  } catch (error) {
    console.error("Error reading memoria:", error);
  }
  return [];
}

function saveConcepts(concepts: MemoriaConcept[]): void {
  try {
    fs.writeFileSync(
      MEMORIA_FILE,
      JSON.stringify({ concepts }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error saving memoria:", error);
  }
}

export function addToMemoria(
  concept: Omit<
    MemoriaConcept,
    | "id"
    | "date_added"
    | "next_review"
    | "interval_days"
    | "ease_factor"
    | "review_count"
  >
): MemoriaConcept {
  const concepts = getConcepts();
  const today = getTodayDateString();

  const newConcept: MemoriaConcept = {
    ...concept,
    id: `concept-${Date.now()}`,
    date_added: today,
    next_review: today, // Review immediately
    interval_days: 0,
    ease_factor: 1.0,
    review_count: 0,
  };

  concepts.push(newConcept);
  saveConcepts(concepts);

  return newConcept;
}

export function getDueReviews(): MemoriaConcept[] {
  const today = getTodayDateString();
  const concepts = getConcepts();

  return concepts.filter((c) => c.next_review <= today);
}

export function updateReview(
  conceptId: string,
  result: "correct" | "incorrect"
): MemoriaConcept | null {
  const concepts = getConcepts();
  const concept = concepts.find((c) => c.id === conceptId);

  if (!concept) {
    return null;
  }

  const today = getTodayDateString();

  if (result === "correct") {
    // Advance interval
    const currentIndex = INTERVALS.findIndex(
      (interval) => interval >= concept.interval_days
    );
    let nextIndex = currentIndex + 1;

    if (nextIndex >= INTERVALS.length) {
      nextIndex = INTERVALS.length - 1; // Stay at max interval
    }

    concept.interval_days = INTERVALS[nextIndex];
    concept.review_count += 1;
    concept.ease_factor = Math.min(concept.ease_factor + 0.1, 2.5);
  } else {
    // Reset interval
    concept.interval_days = INTERVALS[0];
    concept.ease_factor = Math.max(concept.ease_factor - 0.2, 1.0);
  }

  concept.next_review = addDays(today, concept.interval_days);

  saveConcepts(concepts);

  return concept;
}

export function getAllConcepts(): MemoriaConcept[] {
  return getConcepts();
}

export function getConceptById(id: string): MemoriaConcept | null {
  const concepts = getConcepts();
  return concepts.find((c) => c.id === id) || null;
}
