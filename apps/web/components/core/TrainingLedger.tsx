"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LedgerList } from "./LedgerList";

interface TrainingLedgerProps {
  drillsCount?: number;
  completedCount?: number;
  pendingCount?: number;
  timeSpent?: string;
  memoryLinksActive?: number;
  className?: string;
  delay?: number;
}

export function TrainingLedger({
  drillsCount = 0,
  completedCount = 0,
  pendingCount = 0,
  timeSpent = "0 min",
  memoryLinksActive = 0,
  className,
  delay = 0,
}: TrainingLedgerProps) {
  const items = [
    {
      id: "drills",
      label: "Drills",
      value: `${drillsCount}`,
    },
    {
      id: "completed",
      label: "Completed",
      value: `${completedCount}`,
    },
    {
      id: "pending",
      label: "Pending",
      value: `${pendingCount}`,
    },
    {
      id: "time",
      label: "Time Spent",
      value: timeSpent,
    },
    {
      id: "links",
      label: "Memory Links",
      value: `${memoryLinksActive} active`,
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
          Training Ledger
        </h3>
      </div>
      <LedgerList items={items} delay={delay + 0.1} />
    </motion.div>
  );
}
