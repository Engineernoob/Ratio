"use client";

import { motion } from "framer-motion";
import { FogPanel } from "@/components/core/FogPanel";
import { cn } from "@/lib/utils";

interface ScholarumContinuumProps {
  className?: string;
  delay?: number;
}

export function ScholarumContinuum({
  className,
  delay = 0.4,
}: ScholarumContinuumProps) {
  const upcomingLessons = [
    "Applying the principle of charity to opposing schools.",
    "Constructing minimal models for complex systems.",
    "Detecting category errors in daily notes.",
  ];

  const unlockedProblemata = [
    "Temporal paradox in citation chains.",
    "Dependency graph of inconsistent axioms.",
    "Map/territory inversion riddle.",
  ];

  const lastSessionRecap = [
    "Completed: 2 dialectic entries, 1 logic proof sketch.",
    "Weakest link: vague premises in research questions.",
    "Next: refine definitions before drafting arguments.",
  ];

  return (
    <FogPanel className={cn("p-6", className)} delay={delay} hover={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Upcoming Lessons */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
              VPCOMING LESSONES
            </h4>
            <h5 className="font-mono text-xs uppercase tracking-[0.14em] text-foreground mb-4">
              UPCOMING LESSONS
            </h5>
            <ul className="space-y-2">
              {upcomingLessons.map((lesson, index) => (
                <li
                  key={index}
                  className="font-mono text-xs text-muted-foreground"
                >
                  • {lesson}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Unlocked Problemata */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
              VNLOCKED PROBLEMATA
            </h4>
            <h5 className="font-mono text-xs uppercase tracking-[0.14em] text-foreground mb-4">
              UNLOCKED PUZZLES
            </h5>
            <ul className="space-y-2">
              {unlockedProblemata.map((puzzle, index) => (
                <li
                  key={index}
                  className="font-mono text-xs text-muted-foreground"
                >
                  • {puzzle}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Last Session Recap */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
              RECAPITVLATIO VLTIMAE SESSIONIS
            </h4>
            <h5 className="font-mono text-xs uppercase tracking-[0.14em] text-foreground mb-4">
              LAST SESSION RECAP
            </h5>
            <ul className="space-y-2">
              {lastSessionRecap.map((item, index) => (
                <li
                  key={index}
                  className="font-mono text-xs text-muted-foreground"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </FogPanel>
  );
}
