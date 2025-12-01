"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepProps {
  number: number;
  label: string;
  content: ReactNode;
  className?: string;
}

export function Step({ number, label, content, className }: StepProps) {
  const romanNumeral =
    ["I", "II", "III", "IV", "V"][number - 1] || String(number);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start gap-4">
        <div className="font-mono text-xs text-muted-foreground uppercase tracking-[0.14em] shrink-0">
          STEP {romanNumeral} — {label}
        </div>
        <div className="font-mono text-xs text-foreground leading-relaxed flex-1">
          {content}
        </div>
      </div>
    </div>
  );
}
