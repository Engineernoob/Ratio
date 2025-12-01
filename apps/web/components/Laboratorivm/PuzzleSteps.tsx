"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MultiStepPuzzle } from "@/lib/puzzles/types";

interface PuzzleStepsProps {
  puzzle: MultiStepPuzzle;
  onStepComplete: (stepId: string, answer: string) => void;
  completedSteps: Set<string>;
}

export function PuzzleSteps({
  puzzle,
  onStepComplete,
  completedSteps,
}: PuzzleStepsProps) {
  const [stepAnswers, setStepAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (stepId: string, answer: string) => {
    setStepAnswers({ ...stepAnswers, [stepId]: answer });
    onStepComplete(stepId, answer);
  };

  return (
    <div className="space-y-6">
      {puzzle.steps.map((step, index) => {
        const isCompleted = completedSteps.has(step.id);
        return (
          <motion.div
            key={step.id}
            className="p-6 rounded-lg"
            style={{
              background: isCompleted
                ? "rgba(200, 182, 141, 0.1)"
                : "rgba(10, 10, 10, 0.6)",
              border: `1px solid ${
                isCompleted
                  ? "rgba(200, 182, 141, 0.4)"
                  : "rgba(200, 182, 141, 0.2)"
              }`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-8 h-8 flex items-center justify-center font-mono text-sm rounded shrink-0"
                style={{
                  background: isCompleted
                    ? "rgba(200, 182, 141, 0.3)"
                    : "rgba(200, 182, 141, 0.1)",
                  color: "#C8B68D",
                }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <h3
                  className="font-serif text-lg mb-2"
                  style={{ color: "#C8B68D" }}
                >
                  Step {index + 1}
                </h3>
                <p
                  className="font-mono text-sm mb-4"
                  style={{ color: "rgba(200, 182, 141, 0.8)" }}
                >
                  {step.prompt}
                </p>
                {!isCompleted ? (
                  <input
                    type="text"
                    value={stepAnswers[step.id] || ""}
                    onChange={(e) =>
                      setStepAnswers({
                        ...stepAnswers,
                        [step.id]: e.target.value,
                      })
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && stepAnswers[step.id]) {
                        handleAnswer(step.id, stepAnswers[step.id]);
                      }
                    }}
                    className="w-full px-4 py-2 bg-transparent border font-mono text-sm outline-none"
                    style={{
                      color: "#C8B68D",
                      borderColor: "rgba(200, 182, 141, 0.3)",
                    }}
                    placeholder="Enter your answer..."
                  />
                ) : (
                  <div
                    className="p-3 rounded"
                    style={{
                      background: "rgba(200, 182, 141, 0.1)",
                      border: "1px solid rgba(200, 182, 141, 0.3)",
                    }}
                  >
                    <p
                      className="font-mono text-sm"
                      style={{ color: "#C8B68D" }}
                    >
                      ✓ {stepAnswers[step.id]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
