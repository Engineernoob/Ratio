"use client";

import { cn } from "@/lib/utils";

interface ArchivistNotesProps {
  stats?: {
    totalScrolls?: number;
    totalMicroLessons?: number;
    totalConcepts?: number;
    lastEdited?: string;
  };
  ledgerState?: {
    strong: number;
    medium: number;
    fragile: number;
  };
  onExport?: () => void;
  className?: string;
}

export function ArchivistNotes({
  stats = {},
  ledgerState,
  onExport,
  className,
}: ArchivistNotesProps) {
  const {
    totalScrolls = 432,
    totalMicroLessons = 189,
    totalConcepts = 1274,
    lastEdited = "HODIE ‣ HORA IX",
  } = stats;

  const state = ledgerState || { strong: 68, medium: 22, fragile: 10 };

  return (
    <div
      className={cn(
        "sticky top-8 h-fit",
        "bg-[rgba(0,0,0,0.4)]",
        "border border-[rgba(252,252,252,0.93)]",
        "p-6",
        "backdrop-blur-sm",
        className
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Dither overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10">
        {/* Title */}
        <h2 className="font-serif text-xl uppercase tracking-widest text-center mb-4">
          ARCHIVIST&apos;S NOTES
        </h2>

        {/* Divider */}
        <div className="h-px bg-[rgba(59,57,57,0.98)] mb-6" />

        {/* Stats list */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs text-muted-foreground">
                TOTAL NOTES
              </span>
            </div>
            <div className="font-mono text-sm text-[rgba(255,255,255,0.9)]">
              {totalScrolls} TABVLÆ INSCRIBED
            </div>
            <div className="h-px bg-[rgba(215,196,158,0.2)] mt-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs text-muted-foreground">
                TOTAL MICRO-LESSONS
              </span>
            </div>
            <div className="font-mono text-sm text-[rgba(246,246,245,0.94)]">
              {totalMicroLessons} MINUTA DOCTRINA
            </div>
            <div className="h-px bg-[rgba(215,196,158,0.2)] mt-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs text-muted-foreground">
                TOTAL STORED CONCEPTS
              </span>
            </div>
            <div className="font-mono text-sm text-[rgba(250,249,248,0.99)]">
              {totalConcepts} DISTINCT IDEA-NODES
            </div>
            <div className="h-px bg-[rgba(215,196,158,0.2)] mt-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs text-muted-foreground">
                LAST EDITED
              </span>
            </div>
            <div className="font-mono text-sm text-[rgba(248,248,248,0.9)]">
              {lastEdited}
            </div>
          </div>
        </div>

        {/* Ledger State */}
        {ledgerState && (
          <div className="mb-6">
            <div className="font-mono text-xs text-muted-foreground mb-2">
              LEDGER STATE
            </div>
            <div className="flex gap-1 mb-2">
              <div
                className="h-2 flex-1 bg-[rgba(253,253,253,0.98)]"
                style={{ width: `${state.strong}%` }}
              />
              <div
                className="h-2 flex-1 bg-[rgba(249,248,246,0.92)]"
                style={{ width: `${state.medium}%` }}
              />
              <div
                className="h-2 flex-1 bg-[rgba(255,255,254,0.76)]"
                style={{ width: `${state.fragile}%` }}
              />
            </div>
            <div className="font-mono text-[10px] text-[rgba(249,248,246,0.94)]">
              {state.strong}% STRONG ‣ {state.medium}% MEDIVM ‣ {state.fragile}%
              FRAGILE
            </div>
          </div>
        )}

        {/* Export button */}
        {onExport && (
          <div className="mt-6">
            <button onClick={onExport} className="w-full">
              EXPORT EVERYTHING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
