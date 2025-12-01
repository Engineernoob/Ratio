"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LogicaCardProps {
  puzzle: {
    id: string;
    prompt: string;
    solution?: string;
    explanation?: string[];
    category?: string;
    difficulty?: string;
  };
  onRevealSolution?: () => void;
  onExplain?: () => void;
  onGenerateVariant?: () => void;
}

export function LogicaCard({
  puzzle,
  onRevealSolution,
  onExplain,
  onGenerateVariant,
}: LogicaCardProps) {
  const [showSolution, setShowSolution] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset when puzzle changes
  useEffect(() => {
    setShowSolution(false);
    setShowExplanation(false);
  }, [puzzle.id]);

  const handleReveal = () => {
    setShowSolution(true);
    onRevealSolution?.();
  };

  const handleExplain = () => {
    setShowExplanation(true);
    onExplain?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="lab-card p-6 rounded-sm"
    >
      <h3 className="font-serif text-xl mb-4 text-white">LOGICA PROBLEMATA</h3>

      {puzzle.category && (
        <div className="mb-3">
          <span className="font-mono text-xs text-[#b7b7b7]">
            {puzzle.category}
            {puzzle.difficulty && ` • ${puzzle.difficulty}`}
          </span>
        </div>
      )}

      <div className="mb-4">
        <p className="font-serif text-base text-white leading-relaxed">
          {puzzle.prompt}
        </p>
      </div>

      <AnimatePresence>
        {showSolution && puzzle.solution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-white/5 border border-white/10 rounded-sm"
          >
            <p className="font-mono text-sm text-white mb-2">SOLUTION:</p>
            <p className="font-serif text-sm text-[#b7b7b7] leading-relaxed">
              {puzzle.solution}
            </p>
          </motion.div>
        )}

        {showExplanation && puzzle.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-white/5 border border-white/10 rounded-sm"
          >
            <p className="font-mono text-sm text-white mb-2">STEP-BY-STEP:</p>
            <ol className="list-decimal list-inside space-y-2">
              {puzzle.explanation.map((step, idx) => (
                <li
                  key={idx}
                  className="font-serif text-sm text-[#b7b7b7] leading-relaxed"
                >
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 flex-wrap">
        {!showSolution && (
          <button
            onClick={handleReveal}
            className="lab-button font-mono text-xs"
          >
            REVEAL SOLUTION
          </button>
        )}
        {!showExplanation && (
          <button
            onClick={handleExplain}
            className="lab-button font-mono text-xs"
          >
            EXPLAIN STEP-BY-STEP
          </button>
        )}
        <button
          onClick={onGenerateVariant}
          className="lab-button font-mono text-xs"
        >
          GENERATE VARIANT PROBLEM
        </button>
      </div>
    </motion.div>
  );
}
