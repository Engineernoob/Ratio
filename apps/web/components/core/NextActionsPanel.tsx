"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NextAction {
  title: string;
  subtitle?: string;
}

interface NextActionsPanelProps {
  actions?: NextAction[];
  className?: string;
  delay?: number;
}

const defaultActions: NextAction[] = [
  { title: "ETHICA II • CAPVT 5", subtitle: "LECTIO • 18 MIN ESTIMATA" },
  { title: "PROBLEMA LOGICVM", subtitle: "ARS RATIONIS • SYLLOGISMVS" },
  { title: "ARBOR SCIENTIAE", subtitle: "MEMORIA • RAMVS LOGICVS" },
];

export function NextActionsPanel({
  actions = defaultActions,
  className,
  delay = 0,
}: NextActionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-[#0e0e0e] border border-[#1a1a1a] p-6 mt-6",
        className
      )}
    >
      <h3 className="font-serif text-base font-semibold text-[#d4af37] mb-6">
        PROXIMÆ ACTIONES
      </h3>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: delay + index * 0.1 }}
            className="font-mono text-xs text-[#cccccc]"
          >
            <p className="mb-1">{action.title}</p>
            {action.subtitle && (
              <p className="text-[#888888]">{action.subtitle}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

