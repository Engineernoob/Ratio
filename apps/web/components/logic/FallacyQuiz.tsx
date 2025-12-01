"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Fallacy } from "@/lib/logic/types";

interface FallacyQuizProps {
  fallacies: Fallacy[];
}

export function FallacyQuiz({ fallacies }: FallacyQuizProps) {
  const [current, setCurrent] = useState<Fallacy | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (fallacies.length) {
      pickRandom();
    }
  }, [fallacies]);

  const pickRandom = () => {
    if (!fallacies.length) return;
    const random = fallacies[Math.floor(Math.random() * fallacies.length)];
    setCurrent(random);
    setUserAnswer("");
    setRevealed(false);
    setIsCorrect(false);
  };

  const submit = () => {
    if (!current) return;
    const answer = userAnswer.toLowerCase().trim();
    const correct = current.name.toLowerCase().trim();
    setIsCorrect(answer === correct);
    setRevealed(true);
  };

  if (!current) {
    return (
      <div className="fallacy-quiz__empty">
        Preparing prompts from the archive...
      </div>
    );
  }

  return (
    <div className="fallacy-quiz">
      <div className="fallacy-quiz__prompt">
        <p className="logic-label">Identify the fallacy</p>
        <p className="fallacy-quiz__example">{current.example}</p>
      </div>

      <div className="fallacy-quiz__input">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Name the fallacy..."
        />
        <motion.button
          onClick={submit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Submit
        </motion.button>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            className={`fallacy-quiz__reveal ${isCorrect ? "is-correct" : ""}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="fallacy-quiz__title">{current.name}</div>
            <p className="fallacy-quiz__description">{current.description}</p>
            <div className="fallacy-quiz__correction">
              <span className="logic-label">Correction</span>
              <p>{current.correction}</p>
            </div>
            <div className="fallacy-quiz__actions">
              <motion.button
                onClick={pickRandom}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next Prompt
              </motion.button>
              {!isCorrect && (
                <span className="fallacy-quiz__feedback">
                  Close the gap and try again.
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
