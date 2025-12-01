"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MicroLesson } from "./MicroLessonCard";

interface WorkspaceProps {
  lesson: MicroLesson | null;
  onClose: () => void;
  onComplete: () => void;
  onAddToMemoria: () => void;
}

export function Workspace({
  lesson,
  onClose,
  onComplete,
  onAddToMemoria,
}: WorkspaceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});

  if (!lesson) return null;

  const steps = lesson.steps;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

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

  const handleResponseChange = (value: string) => {
    setResponses({ ...responses, [currentStep]: value });
  };

  const stepLabels = ["I", "II", "III", "IV", "V"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="lab-workspace w-[95%] md:w-[80%] max-w-4xl p-6 md:p-8 lg:p-12 rounded-sm relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dithered texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-sm"
            style={{
              backgroundImage: "url('/images/textures/texture_bayer.png')",
              backgroundSize: "256px 256px",
              backgroundRepeat: "repeat",
              opacity: 0.02,
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className="font-serif text-3xl mb-2 text-white">
                {lesson.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#b7b7b7]">
                  {lesson.estTime}
                </span>
                <span className="font-mono text-xs text-[#b7b7b7]">·</span>
                <span className="font-mono text-xs text-[#b7b7b7]">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="mb-6">
              <p className="lab-step-indicator">
                STEP {stepLabels[currentStep] || String(currentStep + 1)} —{" "}
                {steps[currentStep].label}
              </p>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <p className="font-serif text-lg text-white leading-relaxed mb-6">
                  {steps[currentStep].prompt}
                </p>

                {steps[currentStep].label === "RESPONSE" && (
                  <textarea
                    value={responses[currentStep] || ""}
                    onChange={(e) => handleResponseChange(e.target.value)}
                    placeholder="Write your response here..."
                    className="lab-textarea rounded-sm min-h-[200px]"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="flex gap-3">
                <button
                  onClick={isFirstStep ? onClose : handleBack}
                  className="lab-button font-mono text-xs"
                >
                  {isFirstStep ? "CLOSE" : "< BACK"}
                </button>
              </div>

              <div className="flex gap-3">
                {!isLastStep ? (
                  <button
                    onClick={handleNext}
                    className="lab-button font-mono text-xs"
                  >
                    NEXT &gt;
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onAddToMemoria}
                      className="lab-button font-mono text-xs"
                    >
                      ADD TO MEMORIA
                    </button>
                    <button
                      onClick={onComplete}
                      className="lab-button font-mono text-xs bg-white/10"
                    >
                      COMPLETE LESSON
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
