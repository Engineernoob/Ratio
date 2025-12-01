"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LedgerList } from "./LedgerList";

interface MemoryStatsProps {
  itemsDue?: number;
  conceptsLearned?: number;
  reviewStreak?: number;
  className?: string;
  delay?: number;
}

export function MemoryStats({
  itemsDue = 0,
  conceptsLearned = 0,
  reviewStreak = 0,
  className,
  delay = 0,
}: MemoryStatsProps) {
  const items = [
    {
      id: "due",
      label: "Items Due",
      value: `${itemsDue}`,
    },
    {
      id: "learned",
      label: "Concepts Learned",
      value: `${conceptsLearned}`,
    },
    {
      id: "streak",
      label: "Review Streak",
      value: `${reviewStreak} days`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      <div className="mb-4">
        <h3 className="font-serif text-lg uppercase tracking-widest engraved-text mb-2">
          Memory Stats
        </h3>
      </div>
      <LedgerList items={items} delay={delay + 0.1} />
    </motion.div>
  );
}

