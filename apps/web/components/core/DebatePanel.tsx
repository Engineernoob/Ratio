"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Horn {
  id: string;
  title: string;
  label: string;
}

interface DebatePanelProps {
  dilemma: string;
  horns: Horn[];
  status?: string;
  onResolve?: () => void;
  onDebate?: () => void;
  onInvert?: () => void;
  className?: string;
  delay?: number;
}

export function DebatePanel({
  dilemma,
  horns,
  status,
  onResolve,
  onDebate,
  onInvert,
  className,
  delay = 0,
}: DebatePanelProps) {
  const [glowResolve, setGlowResolve] = useState(false);
  const [glowDebate, setGlowDebate] = useState(false);

  const handleResolve = () => {
    setGlowResolve(true);
    setTimeout(() => setGlowResolve(false), 500);
    onResolve?.();
  };

  const handleDebate = () => {
    setGlowDebate(true);
    setTimeout(() => setGlowDebate(false), 500);
    onDebate?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn("relative border text-card-foreground", className)}
      style={{
        background: "rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(1px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div className="relative z-10 p-6">
        <div className="mb-4">
          <h3 className="font-serif text-xl uppercase tracking-[0.12em] engraved-text mb-1">
            DILEMMATA
          </h3>
          <p className="font-serif text-xs uppercase tracking-widest text-muted-foreground">
            DIALECTIC ARENA
          </p>
        </div>

        <div className="mb-4">
          <div className="font-serif text-xs uppercase tracking-widest text-muted-foreground mb-2">
            DILEMMA PRAESENS
          </div>
          <p className="font-mono text-sm leading-relaxed">{dilemma}</p>
        </div>

        <div className="space-y-3 mb-4">
          {horns.map((horn, index) => (
            <div key={horn.id} className="border border-border p-3 relative">
              <div className="flex items-start justify-between mb-2">
                <div className="font-serif text-xs uppercase tracking-widest">
                  HORNVS {index === 0 ? "I" : "II"}
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="font-mono text-sm">×</span>
                </button>
              </div>
              <p className="font-mono text-xs leading-relaxed">{horn.label}</p>
            </div>
          ))}
        </div>

        {status && (
          <div className="mb-4">
            <span className="font-mono text-xs text-muted-foreground">
              STATUS: {status}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={handleResolve}
            className={cn(
              "border border-border bg-transparent px-4 py-2",
              "font-mono text-xs uppercase tracking-wider",
              "transition-all duration-300",
              "hover:border-[#b29b68] hover:text-[#b29b68]",
              glowResolve &&
                "border-[#b29b68] text-[#b29b68] shadow-[0_0_12px_rgba(178,155,104,0.4)]"
            )}
          >
            RESOLVE
          </button>
          <button
            onClick={handleDebate}
            className={cn(
              "border border-border bg-transparent px-4 py-2",
              "font-mono text-xs uppercase tracking-wider",
              "transition-all duration-300",
              "hover:border-[#b29b68] hover:text-[#b29b68]",
              glowDebate &&
                "border-[#b29b68] text-[#b29b68] shadow-[0_0_12px_rgba(178,155,104,0.4)]"
            )}
          >
            DEBATE
          </button>
          {onInvert && (
            <button
              onClick={onInvert}
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors text-left mt-1"
            >
              INVERT PREMISSAS
            </button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="font-mono text-xs text-muted-foreground">
            DVD COLVMNE OPPOSITE • ARENA DIALECTICA • DEBATE / RESOLVE
            MECHANISM.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
