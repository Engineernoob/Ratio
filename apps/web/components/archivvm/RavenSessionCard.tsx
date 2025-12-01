"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RavenSessionCardProps {
  question: string;
  answer: string;
  sessionNumber: number;
  addedDaysAgo: number;
  onRerun?: () => void;
  delay?: number;
  className?: string;
}

export function RavenSessionCard({
  question,
  answer,
  sessionNumber,
  addedDaysAgo,
  onRerun,
  delay = 0,
  className,
}: RavenSessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "flex items-start gap-4 p-4 mb-4",
        "bg-[rgba(0,0,0,0.4)]",
        "border border-[rgba(215,196,158,0.3)]",
        "backdrop-blur-sm",
        className
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Icon circle */}
      <div
        className="shrink-0 w-10 h-10 rounded-full border border-[rgba(215,196,158,0.4)] flex items-center justify-center text-lg font-serif"
        style={{
          boxShadow:
            "inset 0 1px 2px rgba(255,255,255,0.05), 0 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        Q
      </div>

      {/* Content */}
      <div className="grow">
        <p className="font-mono text-xs text-[rgba(215,196,158,0.9)] mb-2">
          Q: {question}
        </p>
        <p className="font-mono text-xs text-muted-foreground mb-3 leading-relaxed">
          {answer}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] text-[rgba(215,196,158,0.6)]">
            SESSION: {String(sessionNumber).padStart(3, "0")} ADDED:{" "}
            {addedDaysAgo} DIES ANTE
          </p>
          {onRerun && (
            <button
              className="font-mono text-[10px] text-[rgba(215,196,158,0.8)] hover:text-[rgba(215,196,158,1)] transition-colors"
              onClick={onRerun}
            >
              RE-RVN SESSION
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
