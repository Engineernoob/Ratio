"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SyllogismEntry {
  id: string;
  title: string;
  details: string;
  archiveId?: string;
  status?: "valid" | "flagged";
  tag?: string;
}

interface ArgumentEntry {
  title: string;
  strength: string;
}

interface DilemmaEntry {
  title: string;
  status: string;
}

interface LedgerPanelProps {
  syllogisms?: SyllogismEntry[];
  arguments?: ArgumentEntry[];
  dilemmas?: DilemmaEntry[];
  onStartNew?: () => void;
  onOpenPast?: () => void;
  className?: string;
  delay?: number;
}

export function LedgerPanel({
  syllogisms = [],
  arguments: argumentEntries = [],
  dilemmas = [],
  onStartNew,
  onOpenPast,
  className,
  delay = 0,
}: LedgerPanelProps) {
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
            LOGICA LEDGER
          </h3>
          <p className="font-serif text-xs uppercase tracking-widest text-muted-foreground">
            SYLLOGISMI COMPLETI
          </p>
        </div>

        {syllogisms.length > 0 && (
          <div className="mb-6 space-y-3">
            {syllogisms.map((syllogism) => (
              <div key={syllogism.id} className="border border-border p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-mono text-xs font-semibold">
                    {syllogism.title}
                  </div>
                  {syllogism.status === "flagged" && syllogism.tag && (
                    <span className="font-mono text-xs px-2 py-0.5 border border-[#b29b68] text-[#b29b68]">
                      {syllogism.tag}
                    </span>
                  )}
                  {syllogism.status === "valid" && (
                    <span className="font-mono text-xs text-[#b29b68]">
                      VALIDVM
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-muted-foreground mb-1">
                  {syllogism.details}
                </p>
                {syllogism.archiveId && (
                  <p className="font-mono text-xs text-muted-foreground">
                    ARCHIVVM ID #{syllogism.archiveId}
                  </p>
                )}
                {syllogism.status === "flagged" && (
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    FLAGGED FOR REPAIR
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {argumentEntries.length > 0 && (
          <div className="mb-6">
            <div className="font-serif text-xs uppercase tracking-widest text-muted-foreground mb-3">
              ARGUMENTA ARCHIVATA
            </div>
            <div className="space-y-2">
              {argumentEntries.map((arg, index) => (
                <div key={index} className="border border-border p-2">
                  <div className="font-mono text-xs mb-1">{arg.title}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    STRENGTH: {arg.strength}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dilemmas.length > 0 && (
          <div className="mb-6">
            <div className="font-serif text-xs uppercase tracking-widest text-muted-foreground mb-3">
              EXITYS DILEMMATORVM
            </div>
            <div className="space-y-2">
              {dilemmas.map((dilemma, index) => (
                <div key={index} className="border border-border p-2">
                  <div className="font-mono text-xs mb-1">{dilemma.title}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    STATUS: {dilemma.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-6">
          {onStartNew && (
            <button
              onClick={onStartNew}
              className="border border-border bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-[#b29b68] hover:text-[#b29b68]"
            >
              START NEW SYLLOGISMVS
            </button>
          )}
          {onOpenPast && (
            <button
              onClick={onOpenPast}
              className="border border-border bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-[#b29b68] hover:text-[#b29b68]"
            >
              OPEN PAST CASE
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
