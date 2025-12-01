"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LedgerList } from "./LedgerList";

interface DailyLedgerProps {
  textsCount?: number;
  ritualsCount?: number;
  reviewsCount?: number;
  status?: string;
  className?: string;
  delay?: number;
}

export function DailyLedger({
  textsCount = 0,
  ritualsCount = 0,
  reviewsCount = 0,
  status = "Active",
  className,
  delay = 0,
}: DailyLedgerProps) {
  const items = [
    {
      id: "texts",
      label: "Texts",
      value: `${textsCount}`,
    },
    {
      id: "rituals",
      label: "Rituals",
      value: `${ritualsCount}`,
    },
    {
      id: "reviews",
      label: "Reviews",
      value: `${reviewsCount}`,
    },
    {
      id: "status",
      label: "Status",
      value: status,
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
          Daily Ledger
        </h3>
      </div>
      <LedgerList items={items} delay={delay + 0.1} />
    </motion.div>
  );
}

