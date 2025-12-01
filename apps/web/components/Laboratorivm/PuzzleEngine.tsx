"use client";

import { useState, useEffect } from "react";
import type { Puzzle } from "@/lib/puzzles/types";
import { PuzzleCard } from "./PuzzleCard";
import { FeedbackPanel } from "./FeedbackPanel";
import { ResultModal } from "./ResultModal";

interface PuzzleEngineProps {
  puzzleId: string;
  onComplete?: () => void;
}

export function PuzzleEngine({ puzzleId, onComplete }: PuzzleEngineProps) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const response = await fetch(`/api/puzzles/${puzzleId}`);
        if (response.ok) {
          const data = await response.json();
          setPuzzle(data.puzzle);
        }
      } catch (error) {
        console.error("Error loading puzzle:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [puzzleId]);

  const checkAnswer = (userAnswer: string | number | number[]): boolean => {
    if (!puzzle) return false;

    switch (puzzle.type) {
      case "mcq":
        return (puzzle as any).answer === userAnswer;
      case "pattern":
      case "insight":
      case "rhetoric":
        const answer = (puzzle as any).answer;
        return (
          answer.toString().toLowerCase().trim() ===
          userAnswer.toString().toLowerCase().trim()
        );
      case "draggable-order":
        const correctOrder = (puzzle as any).correctOrder;
        const userOrder = userAnswer as number[];
        return (
          correctOrder.length === userOrder.length &&
          correctOrder.every((val, idx) => val === userOrder[idx])
        );
      case "visual":
        // Visual puzzles may have different answer formats
        return true; // Simplified
      case "multi_step":
        // Multi-step puzzles are handled differently
        return true; // Simplified
      default:
        return false;
    }
  };

  const handleAnswer = (answer: string | number | number[]) => {
    const correct = checkAnswer(answer);
    setIsCorrect(correct);
    setFeedback(correct ? "correct" : "incorrect");

    setTimeout(() => {
      setShowResult(true);
      if (correct && onComplete) {
        onComplete();
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="font-serif text-xl mb-4" style={{ color: "#C8B68D" }}>
          Loading puzzle...
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="text-center py-20">
        <div className="font-serif text-xl mb-4" style={{ color: "#C8B68D" }}>
          Puzzle not found
        </div>
      </div>
    );
  }

  return (
    <>
      <PuzzleCard puzzle={puzzle} onAnswer={handleAnswer} feedback={feedback} />
      <FeedbackPanel feedback={feedback} />
      <ResultModal
        isOpen={showResult}
        isCorrect={isCorrect}
        explanation={puzzle.explanation}
        onClose={() => {
          setShowResult(false);
          setFeedback(null);
        }}
      />
    </>
  );
}
