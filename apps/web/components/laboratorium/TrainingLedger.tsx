"use client";

import { motion } from "framer-motion";
import { FogPanel } from "@/components/core/FogPanel";
import { OrangeAction } from "@/components/core/OrangeAction";
import { cn } from "@/lib/utils";

interface TrainingLedgerProps {
  drillsCount?: number;
  completedCount?: number;
  timeSpent?: string;
  className?: string;
  delay?: number;
}

export function TrainingLedger({
  drillsCount = 3,
  completedCount = 1,
  timeSpent = "00:27",
  className,
  delay = 0.3,
}: TrainingLedgerProps) {
  const handleReviewInMemoria = () => {
    // TODO: Navigate to memoria page
    console.log("Review in memoria");
  };

  return (
    <FogPanel className={cn("p-6", className)} delay={delay} hover={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        <div className="mb-4">
          <h3 className="font-serif text-sm uppercase tracking-[0.14em] engraved-text mb-2">
            TRAINING LEDGER
          </h3>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.14em]">
            STATUS DISCIPLINAE • MONASTIC RECORD
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <div className="font-mono text-xs text-foreground">
            TODAY'S DRILLS: {drillsCount}
          </div>
          <div className="font-mono text-xs text-foreground">
            COMPLETA: {completedCount} / {drillsCount}
          </div>
          <div className="font-mono text-xs text-foreground">
            TEMPVS IMPENDITVM: {timeSpent}
          </div>
        </div>

        <OrangeAction
          onClick={handleReviewInMemoria}
          className="w-full uppercase tracking-[0.14em]"
        >
          REVIEW IN MEMORIA
        </OrangeAction>
      </motion.div>
    </FogPanel>
  );
}
