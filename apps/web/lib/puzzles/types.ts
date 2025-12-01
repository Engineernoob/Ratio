export type PuzzleType =
  | "insight"
  | "multi_step"
  | "visual"
  | "draggable-order"
  | "simulation"
  | "rhetoric"
  | "mcq"
  | "pattern";

export type PuzzleCategory =
  | "Logic"
  | "Math"
  | "Patterns"
  | "Rhetoric"
  | "Memory"
  | "Philosophy";

export interface BasePuzzle {
  id: string;
  type: PuzzleType;
  category?: PuzzleCategory;
  prompt: string;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  hints?: string[];
  tags?: string[];
}

export interface MCQPuzzle extends BasePuzzle {
  type: "mcq";
  choices: string[];
  answer: number;
}

export interface PatternPuzzle extends BasePuzzle {
  type: "pattern";
  answer: string;
}

export interface InsightPuzzle extends BasePuzzle {
  type: "insight";
  answer: string;
  steps?: string[];
}

export interface MultiStepPuzzle extends BasePuzzle {
  type: "multi_step";
  steps: Array<{
    id: string;
    prompt: string;
    answer: string;
    explanation?: string;
  }>;
}

export interface VisualPuzzle extends BasePuzzle {
  type: "visual";
  answer: string | number[];
  visualData?: {
    width: number;
    height: number;
    elements: Array<{
      type: string;
      x: number;
      y: number;
      properties?: Record<string, unknown>;
    }>;
  };
}

export interface DraggableOrderPuzzle extends BasePuzzle {
  type: "draggable-order";
  items: string[];
  correctOrder: number[];
}

export interface SimulationPuzzle extends BasePuzzle {
  type: "simulation";
  answer: string;
  simulationConfig?: Record<string, unknown>;
}

export interface RhetoricPuzzle extends BasePuzzle {
  type: "rhetoric";
  answer: string | number;
  choices?: string[];
}

export type Puzzle =
  | MCQPuzzle
  | PatternPuzzle
  | InsightPuzzle
  | MultiStepPuzzle
  | VisualPuzzle
  | DraggableOrderPuzzle
  | SimulationPuzzle
  | RhetoricPuzzle;

export interface PuzzleIndex {
  puzzles: Array<{
    id: string;
    category?: PuzzleCategory;
    difficulty?: "easy" | "medium" | "hard";
    title?: string;
  }>;
}
