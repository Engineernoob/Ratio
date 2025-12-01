"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LedgerList } from "./LedgerList";
import { OrangeAction } from "./OrangeAction";

interface LibraryLedgerProps {
  scrollsCount?: number;
  lastOpened?: string;
  studyStreak?: number;
  onContinueLectio?: () => void;
  className?: string;
  delay?: number;
}

export function LibraryLedger({
  scrollsCount = 0,
  lastOpened,
  studyStreak = 0,
  onContinueLectio,
  className,
  delay = 0,
}: LibraryLedgerProps) {
  const items = [
    {
      id: "scrolls",
      label: "Scrolls",
      value: `${scrollsCount}`,
    },
    {
      id: "last-opened",
      label: "Last Opened",
      value: lastOpened || "Never",
    },
    {
      id: "streak",
      label: "Study Streak",
      value: `${studyStreak} days`,
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
          Library Ledger
        </h3>
      </div>
      <LedgerList items={items} delay={delay + 0.1} />
      {onContinueLectio && (
        <div className="mt-4">
          <OrangeAction onClick={onContinueLectio} className="w-full">
            Continue Lectio
          </OrangeAction>
        </div>
      )}
    </motion.div>
  );
}
