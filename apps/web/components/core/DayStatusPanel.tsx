"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DayStatusPanelProps {
  lectioComplete?: number;
  lectioTotal?: number;
  ritualiaFacta?: number;
  ritualiaTotal?: number;
  memoriaRevisio?: number;
  memoriaTotal?: number;
  className?: string;
  delay?: number;
}

export function DayStatusPanel({
  lectioComplete = 2,
  lectioTotal = 3,
  ritualiaFacta = 1,
  ritualiaTotal = 2,
  memoriaRevisio = 3,
  memoriaTotal = 7,
  className,
  delay = 0,
}: DayStatusPanelProps) {
  const lectioPercent = (lectioComplete / lectioTotal) * 100;
  const ritualiaPercent = (ritualiaFacta / ritualiaTotal) * 100;
  const memoriaPercent = (memoriaRevisio / memoriaTotal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-[#0e0e0e] border border-[#1a1a1a] p-6",
        className
      )}
    >
      <h3 className="font-serif text-base font-semibold text-[#d4af37] mb-6">
        DIES HODIERVS • STATUS
      </h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-xs text-[#cccccc] uppercase tracking-wider">
              LECTIO COMPLETA
            </span>
            <span className="font-mono text-xs text-[#888888]">
              {lectioComplete}/{lectioTotal}
            </span>
          </div>
          <div className="h-1.5 bg-[#1a1a1a]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lectioPercent}%` }}
              transition={{ duration: 0.8, delay: delay + 0.2 }}
              className="h-full bg-white"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-xs text-[#cccccc] uppercase tracking-wider">
              RITVALIA FACTA
            </span>
            <span className="font-mono text-xs text-[#888888]">
              {ritualiaFacta}/{ritualiaTotal}
            </span>
          </div>
          <div className="h-1.5 bg-[#1a1a1a]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${ritualiaPercent}%` }}
              transition={{ duration: 0.8, delay: delay + 0.3 }}
              className="h-full bg-white"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-xs text-[#cccccc] uppercase tracking-wider">
              MEMORIA REVISIO
            </span>
            <span className="font-mono text-xs text-[#888888]">
              {memoriaRevisio}/{memoriaTotal}
            </span>
          </div>
          <div className="h-1.5 bg-[#1a1a1a]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${memoriaPercent}%` }}
              transition={{ duration: 0.8, delay: delay + 0.4 }}
              className="h-full bg-white"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

