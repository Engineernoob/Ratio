"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface Filter {
  id: string;
  label: string;
  type: "author" | "theme" | "era" | "difficulty" | "status" | "philosophy";
}

interface FilterBarProps {
  filters: Filter[];
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  onClearAll: () => void;
}

const filterOptions: Record<string, Filter[]> = {
  author: [],
  theme: [
    { id: "stoicism", label: "Stoicism", type: "theme" },
    { id: "epistemology", label: "Epistemology", type: "theme" },
    { id: "ethics", label: "Ethics", type: "theme" },
    { id: "logic", label: "Logic", type: "theme" },
  ],
  era: [
    { id: "ancient", label: "Ancient", type: "era" },
    { id: "medieval", label: "Medieval", type: "era" },
    { id: "modern", label: "Modern", type: "era" },
    { id: "contemporary", label: "Contemporary", type: "era" },
  ],
  difficulty: [
    { id: "beginner", label: "Beginner", type: "difficulty" },
    { id: "intermediate", label: "Intermediate", type: "difficulty" },
    { id: "advanced", label: "Advanced", type: "difficulty" },
  ],
  status: [
    { id: "to-read", label: "To Read", type: "status" },
    { id: "in-progress", label: "In Progress", type: "status" },
    { id: "finished", label: "Finished", type: "status" },
  ],
  philosophy: [
    { id: "stoic", label: "Stoic", type: "philosophy" },
    { id: "epicurean", label: "Epicurean", type: "philosophy" },
    { id: "aristotelian", label: "Aristotelian", type: "philosophy" },
    { id: "platonist", label: "Platonist", type: "philosophy" },
  ],
};

export function FilterBar({
  selectedFilters,
  onFilterChange,
  onClearAll,
}: FilterBarProps) {
  const allFilters = Object.values(filterOptions).flat();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-sm text-[#888888] uppercase tracking-wide">
          Filters
        </h3>
        {selectedFilters.length > 0 && (
          <button
            onClick={onClearAll}
            className="font-mono text-xs text-[#888888] hover:text-[#c8b68d] transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear All
          </button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {allFilters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                px-4 py-2 rounded-full font-mono text-xs whitespace-nowrap transition-all
                ${
                  isSelected
                    ? "bg-[#c8b68d] text-[#0a0a0a] font-medium"
                    : "bg-[rgba(255,255,255,0.05)] text-[#888888] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(200,182,141,0.1)]"
                }
              `}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
