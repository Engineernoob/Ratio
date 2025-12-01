"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FogPanel } from "./FogPanel";
import { OrangeAction } from "./OrangeAction";

interface MicroLessonCardProps {
  title: string;
  concept: string;
  timeEstimate?: string;
  onBegin?: () => void;
  onContinue?: () => void;
  progress?: number;
  className?: string;
  delay?: number;
}

export function MicroLessonCard({
  title,
  concept,
  timeEstimate = "5 min",
  onBegin,
  onContinue,
  progress,
  className,
  delay = 0,
}: MicroLessonCardProps) {
  return (
    <FogPanel className={cn("p-6", className)} delay={delay}>
      <div className="mb-4">
        <h3 className="font-serif text-lg uppercase tracking-widest engraved-text mb-2">
          {title}
        </h3>
        <p className="font-mono text-xs text-muted-foreground mb-3">
          {timeEstimate}
        </p>
      </div>

      <p className="font-mono text-sm text-muted-foreground mb-4 leading-relaxed">
        {concept}
      </p>

      {progress !== undefined && progress > 0 && (
        <div className="mb-4">
          <div className="h-1 bg-fogwhite mb-2">
            <div
              className="h-full bg-bronze transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {progress}% complete
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {onContinue && progress && progress > 0 ? (
          <OrangeAction onClick={onContinue} className="flex-1">
            Continue
          </OrangeAction>
        ) : (
          onBegin && (
            <OrangeAction onClick={onBegin} className="flex-1">
              Begin
            </OrangeAction>
          )
        )}
      </div>
    </FogPanel>
  );
}

