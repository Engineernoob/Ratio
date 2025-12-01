"use client";

import { motion } from "framer-motion";

export type FilterType =
  | "category"
  | "tag"
  | "era"
  | "difficulty"
  | "status"
  | "philosophy";

interface FilterOption {
  id: string;
  label: string;
  type: FilterType;
}

interface BookFiltersProps {
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  onClearAll: () => void;
  availableFilters?: FilterOption[];
}

const defaultFilters: FilterOption[] = [
  { id: "stoicism", label: "Stoicism", type: "tag" },
  { id: "epistemology", label: "Epistemology", type: "tag" },
  { id: "ethics", label: "Ethics", type: "tag" },
  { id: "logic", label: "Logic", type: "tag" },
  { id: "ancient", label: "Ancient", type: "era" },
  { id: "modern", label: "Modern", type: "era" },
  { id: "beginner", label: "Beginner", type: "difficulty" },
  { id: "intermediate", label: "Intermediate", type: "difficulty" },
  { id: "advanced", label: "Advanced", type: "difficulty" },
];

export function BookFilters({
  selectedFilters,
  onFilterChange,
  onClearAll,
  availableFilters = defaultFilters,
}: BookFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-8"
    >
      <div className="filters-container">
        {availableFilters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2 font-mono text-xs border transition-all ${
                isSelected
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/20 hover:border-white/40"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
        {selectedFilters.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-4 py-2 font-mono text-xs text-[#b7b7b7] border border-white/20 hover:border-white/40 transition-all"
          >
            Clear All
          </button>
        )}
      </div>
    </motion.div>
  );
}
