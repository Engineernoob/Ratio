"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LedgerList } from "./LedgerList";

interface ArchiveStatsProps {
  totalScrolls?: number;
  microLessonsIndexed?: number;
  strongestConcepts?: string[];
  weakestConcepts?: string[];
  className?: string;
  delay?: number;
}

export function ArchiveStats({
  totalScrolls = 0,
  microLessonsIndexed = 0,
  strongestConcepts = [],
  weakestConcepts = [],
  className,
  delay = 0,
}: ArchiveStatsProps) {
  const items = [
    {
      id: "scrolls",
      label: "Total Scrolls",
      value: `${totalScrolls}`,
    },
    {
      id: "lessons",
      label: "Micro-Lessons",
      value: `${microLessonsIndexed}`,
    },
    {
      id: "strongest",
      label: "Strongest",
      value: strongestConcepts.length > 0 ? strongestConcepts[0] : "None",
      sublabel:
        strongestConcepts.length > 1
          ? `+${strongestConcepts.length - 1} more`
          : undefined,
    },
    {
      id: "weakest",
      label: "Weakest",
      value: weakestConcepts.length > 0 ? weakestConcepts[0] : "None",
      sublabel:
        weakestConcepts.length > 1
          ? `+${weakestConcepts.length - 1} more`
          : undefined,
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
          Archive Stats
        </h3>
      </div>
      <LedgerList items={items} delay={delay + 0.1} />
    </motion.div>
  );
}

