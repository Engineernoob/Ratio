"use client";

import { cn } from "@/lib/utils";

interface DividerLabelProps {
  label: string;
  className?: string;
}

export function DividerLabel({ label, className }: DividerLabelProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
      <div className="flex-1 h-px bg-[rgba(215,196,158,0.2)]" />
      <span className="font-mono text-xs uppercase tracking-wider text-[rgba(215,196,158,0.8)]">
        {label}
      </span>
      <div className="flex-1 h-px bg-[rgba(215,196,158,0.2)]" />
    </div>
  );
}
