"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LedgerList } from "./LedgerList";

interface LogicLedgerProps {
  completedSyllogisms?: number;
  openDilemmas?: number;
  activeArguments?: number;
  className?: string;
  delay?: number;
}

export function LogicLedger({
  completedSyllogisms = 0,
  openDilemmas = 0,
  activeArguments = 0,
  className,
  delay = 0,
}: LogicLedgerProps) {
  const items = [
    {
      id: "syllogisms",
      label: "Completed Syllogisms",
      value: `${completedSyllogisms}`,
    },
    {
      id: "dilemmas",
      label: "Open Dilemmas",
      value: `${openDilemmas}`,
    },
    {
      id: "arguments",
      label: "Active Arguments",
      value: `${activeArguments}`,
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
          Logic Ledger
        </h3>
      </div>
      <LedgerList items={items} delay={delay + 0.1} />
    </motion.div>
  );
}
