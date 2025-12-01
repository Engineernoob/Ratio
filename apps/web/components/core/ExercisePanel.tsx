"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FogPanel } from "./FogPanel";
import { OrangeAction } from "./OrangeAction";
import { EngravedHeader } from "./EngravedHeader";

interface ExerciseStep {
  label: string;
  content: ReactNode;
}

interface ExercisePanelProps {
  steps: ExerciseStep[];
  currentStep: number;
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
  onAddToMemoria?: () => void;
  className?: string;
  delay?: number;
}

export function ExercisePanel({
  steps,
  currentStep,
  onNext,
  onBack,
  onComplete,
  onAddToMemoria,
  className,
  delay = 0,
}: ExercisePanelProps) {
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <FogPanel className={cn("p-8", className)} delay={delay}>
      <div className="mb-6">
        <EngravedHeader
          level={4}
          title={`STEP ${String.fromCharCode(73 + currentStep)}: ${step.label}`}
        />
      </div>

      <div className="mb-8 font-mono text-sm leading-relaxed text-muted-foreground">
        {step.content}
      </div>

      <div className="flex gap-3 pt-6 border-t border-[rgba(255,255,255,0.08)]">
        {onBack && currentStep > 0 && (
          <OrangeAction onClick={onBack} className="flex-1">
            Back
          </OrangeAction>
        )}
        {onNext && !isLastStep && (
          <OrangeAction onClick={onNext} className="flex-1">
            Next
          </OrangeAction>
        )}
        {onComplete && isLastStep && (
          <>
            <OrangeAction onClick={onComplete} className="flex-1">
              Complete
            </OrangeAction>
            {onAddToMemoria && (
              <OrangeAction onClick={onAddToMemoria} className="flex-1">
                Add to MEMORIA
              </OrangeAction>
            )}
          </>
        )}
      </div>
    </FogPanel>
  );
}

