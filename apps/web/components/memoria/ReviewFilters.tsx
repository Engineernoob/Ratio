"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MemoryItem } from "@/lib/memoriaData";
import { ReviewListItem } from "./ReviewListItem";

type FilterType = "BY SOURCE" | "BY DATE ADDED" | "BY MEMORY STRENGTH";

interface ReviewFiltersProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  memoryItems: MemoryItem[];
  onReviewItem: (item: MemoryItem) => void;
}

export function ReviewFilters({
  selectedFilter,
  onFilterChange,
  memoryItems,
  onReviewItem,
}: ReviewFiltersProps) {
  const filters: FilterType[] = [
    "BY SOURCE",
    "BY DATE ADDED",
    "BY MEMORY STRENGTH",
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-mono text-xs uppercase tracking-wider text-gold">
        YOUR KNOVVLEDGE LEDGER
      </h3>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        {filters.map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={cn(
                "px-4 py-2 rounded-full",
                "border font-mono text-xs uppercase tracking-wider",
                "transition-all duration-200",
                isSelected
                  ? "border-gold text-gold bg-[rgba(215,196,158,0.1)]"
                  : "border-[rgba(215,196,158,0.2)] text-gold/60 bg-[rgba(0,0,0,0.3)]"
              )}
              style={{
                boxShadow: isSelected
                  ? "0 0 15px rgba(215,196,158,0.3), inset 0 1px 2px rgba(255,255,255,0.05)"
                  : "inset 0 1px 2px rgba(255,255,255,0.03)",
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Memory Items List */}
      <div className="space-y-2">
        {memoryItems.map((item) => (
          <ReviewListItem
            key={item.id}
            item={item}
            onReview={() => onReviewItem(item)}
          />
        ))}
      </div>
    </div>
  );
}
