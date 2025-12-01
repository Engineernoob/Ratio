"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BrutalistCard } from "../BrutalistCard";

interface MemoryCell {
  id: string;
  title: string;
  retention: number; // 0-100
  lastReview?: Date;
}

interface MemoryGridProps {
  cells: MemoryCell[];
  onCellClick?: (cell: MemoryCell) => void;
}

export function MemoryGrid({ cells, onCellClick }: MemoryGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (cell: MemoryCell) => {
    setSelectedId(cell.id);
    onCellClick?.(cell);
  };

  const getRetentionColor = (retention: number) => {
    if (retention >= 80) return "bg-foreground";
    if (retention >= 60) return "bg-muted-foreground";
    if (retention >= 40) return "bg-muted";
    return "bg-muted/50";
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map((cell) => (
        <div
          key={cell.id}
          onClick={() => handleClick(cell)}
          className={cn(
            "aspect-square p-3 cursor-pointer transition-colors",
            selectedId === cell.id && "border-accent bg-accent/10"
          )}
        >
          <BrutalistCard
            className="h-full"
          >
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div
                className={cn(
                  "w-full h-full border border-border",
                  getRetentionColor(cell.retention)
                )}
              />
            </div>
            <div className="mt-2 text-xs font-mono text-center">
              {cell.title}
            </div>
            <div className="text-[10px] text-muted-foreground text-center mt-1">
              {cell.retention}%
            </div>
          </div>
          </BrutalistCard>
        </div>
      ))}
    </div>
  );
}

