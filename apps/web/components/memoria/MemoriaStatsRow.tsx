"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatBlockProps {
  title: string;
  value: number;
  label: string;
  delay?: number;
}

function StatBlock({ title, value, label, delay = 0 }: StatBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "flex-1 rounded-lg p-6",
        "bg-[rgba(0,0,0,0.6)]",
        "border border-[rgba(42,42,42,0.15)]",
        "backdrop-blur-sm"
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      <div className="space-y-3">
        <p className="font-sans text-xs uppercase tracking-wider text-gold font-light">
          {title}
        </p>
        <div
          className="font-serif text-5xl font-bold text-gold"
          style={{
            textShadow: "0 0 20px rgba(215,196,158,0.5)",
          }}
        >
          {value}
        </div>
        <p className="font-mono text-xs text-gold leading-relaxed">{label}</p>
      </div>
    </motion.div>
  );
}

interface MemoriaStatsRowProps {
  itemsDueToday: number;
  itemsDueLabel: string;
  newConceptsLearned: number;
  newConceptsLabel: string;
  currentReviewStreak: number;
  reviewStreakLabel: string;
}

export function MemoriaStatsRow({
  itemsDueToday,
  itemsDueLabel,
  newConceptsLearned,
  newConceptsLabel,
  currentReviewStreak,
  reviewStreakLabel,
}: MemoriaStatsRowProps) {
  return (
    <div className="flex gap-6 mb-12">
      <StatBlock
        title="ITEMS DUE TODAY"
        value={itemsDueToday}
        label={itemsDueLabel}
        delay={0.1}
      />
      <StatBlock
        title="NEW CONCEPTS LEARNED"
        value={newConceptsLearned}
        label={newConceptsLabel}
        delay={0.2}
      />
      <StatBlock
        title="CURRENT REVIEW STREAK"
        value={currentReviewStreak}
        label={reviewStreakLabel}
        delay={0.3}
      />
    </div>
  );
}
