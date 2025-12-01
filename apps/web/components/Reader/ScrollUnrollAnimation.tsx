"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollUnrollAnimationProps {
  bookTitle: string;
  onComplete: () => void;
}

export function ScrollUnrollAnimation({
  bookTitle,
  onComplete,
}: ScrollUnrollAnimationProps) {
  const [phase, setPhase] = useState<"scroll" | "reveal" | "complete">(
    "scroll"
  );

  useEffect(() => {
    // Phase 1: Scroll unrolls
    const timer1 = setTimeout(() => {
      setPhase("reveal");
    }, 1500);

    // Phase 2: Page reveals
    const timer2 = setTimeout(() => {
      setPhase("complete");
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "#0A0A0A" }}
    >
      <AnimatePresence>
        {phase === "scroll" && (
          <motion.div
            key="scroll"
            initial={{ scaleY: 1, opacity: 1 }}
            animate={{ scaleY: 0, opacity: 0.8 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
            style={{
              width: "400px",
              height: "600px",
              background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
              border: "2px solid rgba(200, 182, 141, 0.3)",
              borderRadius: "8px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Scroll texture */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url('/images/textures/parchment-dither.png')",
                backgroundSize: "cover",
              }}
            />

            {/* Scroll edges */}
            <div
              className="absolute top-0 left-0 right-0 h-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(200, 182, 141, 0.2) 0%, transparent 100%)",
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-8"
              style={{
                background:
                  "linear-gradient(0deg, rgba(200, 182, 141, 0.2) 0%, transparent 100%)",
                borderBottomLeftRadius: "6px",
                borderBottomRightRadius: "6px",
              }}
            />

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center px-8">
                <div
                  className="font-serif text-2xl mb-2"
                  style={{ color: "#C8B68D" }}
                >
                  {bookTitle}
                </div>
                <div
                  className="font-mono text-xs opacity-60"
                  style={{ color: "#C8B68D" }}
                >
                  Unrolling scroll...
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <div
              className="font-serif text-xl mb-2"
              style={{ color: "#C8B68D" }}
            >
              {bookTitle}
            </div>
            <div
              className="font-mono text-xs opacity-60"
              style={{ color: "#C8B68D" }}
            >
              Opening codex...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
