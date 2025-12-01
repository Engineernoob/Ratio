"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FogPanel } from "@/components/core/FogPanel";
import { OrangeAction } from "@/components/core/OrangeAction";
import { Step } from "./Step";
import { cn } from "@/lib/utils";

interface MicroLessonPanelProps {
  className?: string;
  delay?: number;
}

export function MicroLessonPanel({
  className,
  delay = 0.2,
}: MicroLessonPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [response, setResponse] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      label: "CONCEPT",
      content:
        "Define 'signal' as information that would make you update a belief or action, and 'noise' as information that only confirms, decorates, or distracts.",
    },
    {
      label: "EXEMPLVM",
      content:
        "From today's reading list, identify one paragraph that forced you to change a planned decision. Contrast it with two passages that merely repeated what you already endorsed.",
    },
    {
      label: "RESPONSE",
      content:
        "Articulate, in your own words, how you will alter tomorrow's reading or research intake to increase the density of signal.",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  const handleAddToMemoria = () => {
    // TODO: Implement add to memoria logic
    console.log("Adding to memoria:", response);
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
            MODVLI — MICRO-LESSONS
          </h3>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.14em]">
            INTERACTIVA SCHOLARIA RATIO • IN ACTV
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-foreground mb-2">
              DISTINGUISHING SIGNAL FROM NOISE
            </h4>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.14em] mb-3">
              MODVLVSI • ATTENTION DISCIPLINED
            </p>
            <p className="font-mono text-xs text-foreground leading-relaxed mb-4">
              You are presented with a stream of notes, alerts, and ideas. The
              task of the mind is to separate what changes the state of your
              understanding from what merely agitates it.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <Step
                key={index}
                number={index + 1}
                label={step.label}
                content={step.content}
              />
            ))}
          </div>

          <div className="mt-4">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Draft your adjustment rule here: criteria, constraints, and what you will say no to."
              className="w-full h-24 px-3 py-2 bg-background border border-border font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-2 bg-background border border-border font-mono text-xs text-foreground uppercase tracking-[0.14em] hover:bg-accent/10 hover:border-accent/50 transition-colors"
              >
                ← BACK
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 bg-background border border-border font-mono text-xs text-foreground uppercase tracking-[0.14em] hover:bg-accent/10 hover:border-accent/50 transition-colors"
              >
                NEXT →
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 px-4 py-2 bg-background border border-border font-mono text-xs text-foreground uppercase tracking-[0.14em] hover:bg-accent/10 hover:border-accent/50 transition-colors"
              >
                LESSON COMPLETE
              </button>
            )}
          </div>

          {currentStep === steps.length - 1 && (
            <>
              <div className="flex gap-3">
                <OrangeAction
                  onClick={handleComplete}
                  className="flex-1 uppercase tracking-[0.14em]"
                >
                  COMPLETE EXERCITIVM
                </OrangeAction>
                <OrangeAction
                  onClick={handleAddToMemoria}
                  className="flex-1 uppercase tracking-[0.14em]"
                >
                  ADDE AD MEMORIAM
                </OrangeAction>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-border">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em] text-center">
              STATE STORED IN SESSION • READY FOR MEMORIA
            </p>
          </div>
        </div>
      </motion.div>
    </FogPanel>
  );
}
