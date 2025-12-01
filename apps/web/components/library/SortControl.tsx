"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SortOption =
  | "recently-opened"
  | "a-z"
  | "z-a"
  | "progress"
  | "ancient-modern"
  | "modern-ancient";

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recently-opened", label: "Recently Opened" },
  { value: "a-z", label: "A–Z" },
  { value: "z-a", label: "Z–A" },
  { value: "progress", label: "Progress" },
  { value: "ancient-modern", label: "Ancient → Modern" },
  { value: "modern-ancient", label: "Modern → Ancient" },
];

export function SortControl({ value, onChange }: SortControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    sortOptions.find((opt) => opt.value === value)?.label || "Sort";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(200,182,141,0.1)] font-mono text-sm text-[#e8e6e1] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 z-20 min-w-[200px] rounded-lg bg-[#0e0e0e] border border-[rgba(200,182,141,0.2)] shadow-lg overflow-hidden"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2 text-left font-mono text-sm transition-colors
                    ${
                      value === option.value
                        ? "bg-[rgba(200,182,141,0.1)] text-[#c8b68d]"
                        : "text-[#888888] hover:text-[#e8e6e1] hover:bg-[rgba(255,255,255,0.05)]"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
