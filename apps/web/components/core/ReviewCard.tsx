"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FogPanel } from "./FogPanel";
import { OrangeAction } from "./OrangeAction";
import { CircularRecallMeter } from "@/components/CircularRecallMeter";

interface ReviewCardProps {
  id: string;
  title: string;
  type: "scroll" | "puzzle" | "concept" | "lesson";
  memoryStrength: number; // 0-100
  onReview?: () => void;
  className?: string;
  delay?: number;
}

const typeLabels = {
  scroll: "SCROLL",
  puzzle: "PUZZLE",
  concept: "CONCEPT",
  lesson: "LESSON",
};

export function ReviewCard({
  title,
  type,
  memoryStrength,
  onReview,
  className,
  delay = 0,
}: ReviewCardProps) {
  return (
    <FogPanel className={cn("p-6", className)} delay={delay}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            {typeLabels[type]}
          </div>
          <h3 className="font-serif text-base uppercase tracking-widest engraved-text">
            {title}
          </h3>
        </div>
        <CircularRecallMeter percentage={memoryStrength} size={60} />
      </div>

      {onReview && (
        <div className="pt-4 border-t border-border">
          <OrangeAction onClick={onReview} className="w-full">
            Review
          </OrangeAction>
        </div>
      )}
    </FogPanel>
  );
}
