"use client";

import { cn } from "@/lib/utils";

interface TagPillProps {
  label: string;
  className?: string;
}

export function TagPill({ label, className }: TagPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full",
        "font-mono text-[10px] uppercase tracking-wider",
        "border border-[rgba(252,252,252,0.91)]",
        "text-[rgba(255,254,254,0.9)]",
        "bg-[rgba(215,196,158,0.05)]",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      {label}
    </span>
  );
}
