"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Puzzle } from "@/lib/puzzles/types";
import { PuzzleInstructions } from "./PuzzleInstructions";
import { PuzzleHints } from "./PuzzleHints";
import { PuzzleExplain } from "./PuzzleExplain";
import { DraggableArea } from "./DraggableArea";
import { VisualPuzzleCanvas } from "./VisualPuzzleCanvas";
import { PuzzleSteps } from "./PuzzleSteps";

interface PuzzleCardProps {
  puzzle: Puzzle;
  onAnswer: (answer: string | number | number[]) => void;
  feedback?: "correct" | "incorrect" | null;
}

export function PuzzleCard({ puzzle, onAnswer, feedback }: PuzzleCardProps) {
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [draggableOrder, setDraggableOrder] = useState<number[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleSubmit = () => {
    if (puzzle.type === "draggable-order") {
      onAnswer(draggableOrder);
    } else {
      onAnswer(userAnswer);
    }
  };

  const handleStepComplete = (stepId: string, answer: string) => {
    setCompletedSteps(new Set([...completedSteps, stepId]));
  };

  const renderPuzzleInput = () => {
    switch (puzzle.type) {
      case "mcq":
        const mcqPuzzle = puzzle as any;
        return (
          <div className="space-y-3">
            {mcqPuzzle.choices.map((choice: string, index: number) => (
              <motion.button
                key={index}
                onClick={() => {
                  setUserAnswer(index.toString());
                  onAnswer(index);
                }}
                className="w-full text-left p-4 rounded-lg font-mono text-sm"
                style={{
                  background:
                    feedback === "correct" && userAnswer === index.toString()
                      ? "rgba(200, 182, 141, 0.2)"
                      : userAnswer === index.toString()
                      ? "rgba(200, 182, 141, 0.1)"
                      : "rgba(10, 10, 10, 0.6)",
                  border: `1px solid ${
                    feedback === "correct" && userAnswer === index.toString()
                      ? "rgba(200, 182, 141, 0.4)"
                      : userAnswer === index.toString()
                      ? "rgba(200, 182, 141, 0.3)"
                      : "rgba(200, 182, 141, 0.2)"
                  }`,
                  color: "#C8B68D",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {String.fromCharCode(65 + index)}. {choice}
              </motion.button>
            ))}
          </div>
        );

      case "pattern":
      case "insight":
      case "rhetoric":
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              className="w-full px-4 py-3 bg-transparent border font-mono text-sm outline-none"
              style={{
                color: "#C8B68D",
                borderColor: "rgba(200, 182, 141, 0.3)",
                background: "rgba(10, 10, 10, 0.5)",
                borderRadius: "4px",
              }}
              placeholder="Enter your answer..."
            />
            <motion.button
              onClick={handleSubmit}
              className="w-full py-3 font-mono text-sm"
              style={{
                color: "#C8B68D",
                border: "1px solid rgba(200, 182, 141, 0.3)",
                background: "rgba(200, 182, 141, 0.1)",
                borderRadius: "4px",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Answer
            </motion.button>
          </div>
        );

      case "draggable-order":
        return (
          <div className="space-y-4">
            <DraggableArea
              puzzle={puzzle as any}
              onOrderChange={setDraggableOrder}
              currentOrder={draggableOrder}
            />
            <motion.button
              onClick={handleSubmit}
              className="w-full py-3 font-mono text-sm"
              style={{
                color: "#C8B68D",
                border: "1px solid rgba(200, 182, 141, 0.3)",
                background: "rgba(200, 182, 141, 0.1)",
                borderRadius: "4px",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Order
            </motion.button>
          </div>
        );

      case "visual":
        return (
          <VisualPuzzleCanvas
            puzzle={puzzle as any}
            onAnswer={(answer) => onAnswer(answer)}
          />
        );

      case "multi_step":
        return (
          <PuzzleSteps
            puzzle={puzzle as any}
            onStepComplete={handleStepComplete}
            completedSteps={completedSteps}
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 rounded-lg"
      style={{
        background: "rgba(10, 10, 10, 0.8)",
        border: "1px solid rgba(200, 182, 141, 0.2)",
        boxShadow:
          feedback === "correct" ? "0 0 40px rgba(200, 182, 141, 0.2)" : "none",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PuzzleInstructions puzzle={puzzle} />
      {renderPuzzleInput()}
      <PuzzleHints hints={puzzle.hints} />
      <PuzzleExplain explanation={puzzle.explanation} />
    </motion.div>
  );
}
