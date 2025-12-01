import fs from "fs";
import path from "path";

export interface Puzzle {
  id: string;
  type: "mcq" | "pattern" | "ratio";
  prompt: string;
  choices?: string[];
  answer: number | string;
  explanation: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PUZZLES_DIR = path.join(DATA_DIR, "puzzles");
const PUZZLE_ASSIGNMENTS_FILE = path.join(DATA_DIR, "puzzle-assignments.json");

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getPuzzles(): Puzzle[] {
  try {
    if (!fs.existsSync(PUZZLES_DIR)) return [];
    
    const puzzles: Puzzle[] = [];
    const files = fs.readdirSync(PUZZLES_DIR).filter(f => f.endsWith(".json"));
    
    for (const file of files) {
      try {
        const data = fs.readFileSync(path.join(PUZZLES_DIR, file), "utf-8");
        const filePuzzles: Puzzle[] = JSON.parse(data);
        puzzles.push(...filePuzzles);
      } catch (error) {
        console.error(`Error reading puzzle file ${file}:`, error);
      }
    }
    
    return puzzles;
  } catch (error) {
    console.error("Error reading puzzles:", error);
    return [];
  }
}

function getPuzzleAssignments(): Record<string, string> {
  try {
    if (fs.existsSync(PUZZLE_ASSIGNMENTS_FILE)) {
      const data = fs.readFileSync(PUZZLE_ASSIGNMENTS_FILE, "utf-8");
      return JSON.parse(data).assignments || {};
    }
  } catch (error) {
    console.error("Error reading puzzle assignments:", error);
  }
  return {};
}

function savePuzzleAssignments(assignments: Record<string, string>): void {
  try {
    fs.writeFileSync(
      PUZZLE_ASSIGNMENTS_FILE,
      JSON.stringify({ assignments }, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error saving puzzle assignments:", error);
  }
}

export function getDailyPuzzle(): Puzzle | null {
  const today = getTodayDateString();
  const puzzles = getPuzzles();
  const assignments = getPuzzleAssignments();

  if (puzzles.length === 0) {
    return null;
  }

  // Check if puzzle already assigned for today
  const assignedPuzzleId = assignments[today];
  if (assignedPuzzleId) {
    const puzzle = puzzles.find(p => p.id === assignedPuzzleId);
    if (puzzle) {
      return puzzle;
    }
  }

  // Assign a random puzzle for today
  const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  assignments[today] = randomPuzzle.id;
  savePuzzleAssignments(assignments);

  return randomPuzzle;
}

export function getPuzzleById(id: string): Puzzle | null {
  const puzzles = getPuzzles();
  return puzzles.find(p => p.id === id) || null;
}

export function getAllPuzzles(): Puzzle[] {
  return getPuzzles();
}

