import fs from "fs";
import path from "path";
import type { Puzzle, PuzzleIndex } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const PUZZLES_DIR = path.join(DATA_DIR, "puzzles");
const PUZZLES_INDEX = path.join(DATA_DIR, "puzzles.json");

/**
 * Load puzzle index
 */
export function loadPuzzleIndex(): PuzzleIndex {
  try {
    if (fs.existsSync(PUZZLES_INDEX)) {
      const data = fs.readFileSync(PUZZLES_INDEX, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading puzzle index:", error);
  }
  return { puzzles: [] };
}

/**
 * Load a specific puzzle by ID
 */
export function loadPuzzle(puzzleId: string): Puzzle | null {
  try {
    // Try to find puzzle in category files
    const categoryFiles = fs
      .readdirSync(PUZZLES_DIR)
      .filter((f) => f.endsWith(".json"));

    for (const file of categoryFiles) {
      const filePath = path.join(PUZZLES_DIR, file);
      const puzzles: Puzzle[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const puzzle = puzzles.find((p) => p.id === puzzleId);
      if (puzzle) {
        return puzzle;
      }
    }

    // Also check main puzzles.json
    if (fs.existsSync(PUZZLES_INDEX)) {
      const index: PuzzleIndex = JSON.parse(
        fs.readFileSync(PUZZLES_INDEX, "utf-8")
      );
      const puzzleRef = index.puzzles.find((p) => p.id === puzzleId);
      if (puzzleRef) {
        // Try to load from category files again with more context
        for (const file of categoryFiles) {
          const filePath = path.join(PUZZLES_DIR, file);
          const puzzles: Puzzle[] = JSON.parse(
            fs.readFileSync(filePath, "utf-8")
          );
          const puzzle = puzzles.find((p) => p.id === puzzleId);
          if (puzzle) {
            return puzzle;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error loading puzzle ${puzzleId}:`, error);
  }

  return null;
}

/**
 * Get all puzzles
 */
export function getAllPuzzles(): Puzzle[] {
  const puzzles: Puzzle[] = [];

  try {
    const categoryFiles = fs
      .readdirSync(PUZZLES_DIR)
      .filter((f) => f.endsWith(".json"));

    for (const file of categoryFiles) {
      const filePath = path.join(PUZZLES_DIR, file);
      const filePuzzles: Puzzle[] = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
      );
      puzzles.push(...filePuzzles);
    }
  } catch (error) {
    console.error("Error loading all puzzles:", error);
  }

  return puzzles;
}

/**
 * Get daily challenge puzzle ID (based on date)
 */
export function getDailyChallengeId(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const allPuzzles = getAllPuzzles();
  if (allPuzzles.length === 0) return "";

  const index = dayOfYear % allPuzzles.length;
  return allPuzzles[index].id;
}
