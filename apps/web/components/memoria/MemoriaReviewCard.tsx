"use client";

import { motion } from "framer-motion";
import type { MemoriaConcept } from "@/lib/memoria";
import { cn } from "@/lib/utils";

interface MemoriaReviewCardProps {
  concept: MemoriaConcept;
  confidence: number;
  lastReviewedLabel: string;
  dueLabel: string;
  variant?: "full" | "compact";
  onBegin?: (concept: MemoriaConcept) => void;
}

export function MemoriaReviewCard({
  concept,
  confidence,
  lastReviewedLabel,
  dueLabel,
  variant = "full",
  onBegin,
}: MemoriaReviewCardProps) {
  const isCompact = variant === "compact";

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "memoria-card",
        isCompact && "memoria-card-compact",
        "relative"
      )}
    >
      <div className="memoria-card-overlay" />
      <div className="memoria-card-inner">
        <div className="memoria-card-top">
          <span className="memoria-chip">{concept.source.toUpperCase()}</span>
          <span className="memoria-confidence">{confidence}% confident</span>
        </div>

        <h3 className="memoria-card-title">{concept.title}</h3>

        {!isCompact && (
          <p className="memoria-card-body">
            {concept.micro_question || concept.explanation}
          </p>
        )}

        <div className="memoria-card-meta">
          <span>Last reviewed {lastReviewedLabel}</span>
          <span className="memoria-dot" />
          <span>{dueLabel}</span>
        </div>

        {!isCompact && (
          <div className="memoria-card-footer">
            <button
              type="button"
              className="memoria-action"
              onClick={() => onBegin?.(concept)}
            >
              Begin Review
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
