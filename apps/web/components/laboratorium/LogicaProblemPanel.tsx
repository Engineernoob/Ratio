"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FogPanel } from "@/components/core/FogPanel";
import { cn } from "@/lib/utils";

interface LogicaProblemPanelProps {
  className?: string;
  delay?: number;
}

export function LogicaProblemPanel({
  className,
  delay = 0.1,
}: LogicaProblemPanelProps) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <FogPanel className={cn("p-6", className)} delay={delay} hover={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        <div className="mb-4">
          <h3 className="font-serif text-sm uppercase tracking-[0.14em] engraved-text mb-2">
            LOGICA — PROBLEMATΑ
          </h3>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.14em]">
            HODIERNVM AENIGMA • REASONING TEST
          </p>
        </div>

        <div className="mb-4 space-y-3">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.14em]">
            IC PUZZLE
          </p>
          <p className="font-mono text-xs text-foreground leading-relaxed">
            Five scholars sit in a circle, each wearing a black or white band.
            They can see the others but not their own. They must deduce their
            own band color. If any saw a configuration that forced a quick
            conclusion, they would speak. From this prolonged non-action, the
            last scholar deduces that all bands must be black.
          </p>
        </div>

        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full px-4 py-2 bg-background border border-border font-mono text-xs text-foreground uppercase tracking-[0.14em] hover:bg-accent/10 hover:border-accent/50 transition-colors"
        >
          {showSolution ? "HIDE SOLUTION" : "REVEAL SOLUTION"}
        </button>

        {showSolution && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              The solution involves inductive reasoning: if there were any white
              bands, the scholars would have been able to deduce their own color
              through elimination. The silence indicates all bands are black.
            </p>
          </motion.div>
        )}
      </motion.div>
    </FogPanel>
  );
}
