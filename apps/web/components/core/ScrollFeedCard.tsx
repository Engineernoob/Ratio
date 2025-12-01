"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollFeedCardProps {
  type: "LECTIO" | "RITVAL" | "MEMORIA";
  title: string;
  description: string;
  source: string;
  time: string;
  actionLabel: string;
  onAction?: () => void;
  className?: string;
  delay?: number;
}

export function ScrollFeedCard({
  type,
  title,
  description,
  source,
  time,
  actionLabel,
  onAction,
  className,
  delay = 0,
}: ScrollFeedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("bg-[#0e0e0e] border border-[#1a1a1a] p-6", className)}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">
              {type}
            </span>
            <span className="text-[#888888]">—</span>
          </div>
          <h4 className="font-serif text-base font-semibold text-[#d4af37] mb-3 leading-tight">
            {title}
          </h4>
          <p className="font-sans text-sm text-[#cccccc] leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-[#888888] uppercase tracking-wider">
            <span>{source}</span>
            <span>•</span>
            <span>{time}</span>
          </div>
        </div>

        <motion.button
          onClick={onAction}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="shrink-0 w-12 h-12 rounded-full border border-[#1a1a1a] bg-[#0e0e0e] flex items-center justify-center hover:border-white transition-colors group"
        >
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center"
          >
            <span className="text-white text-xs">•</span>
          </motion.div>
        </motion.button>
      </div>

      <button
        onClick={onAction}
        className="font-mono text-xs text-[#cccccc] hover:text-white transition-colors uppercase tracking-wider"
      >
        {actionLabel}
      </button>
    </motion.div>
  );
}
