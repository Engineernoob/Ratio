"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Filter } from "lucide-react";
import { FilterBar } from "./FilterBar";
import { SortControl } from "./SortControl";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  onClearFilters: () => void;
  sortOption: string;
  onSortChange: (value: string) => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  sortOption,
  onSortChange,
}: MobileFilterDrawerProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[#0e0e0e] border-t border-[rgba(255,255,255,0.05)] z-50 md:hidden rounded-t-2xl overflow-y-auto max-h-[80vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-[#c8b68d]" />
                    <h2 className="font-serif text-lg text-[#e8e6e1]">
                      Filter & Sort
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#888888] hover:text-[#e8e6e1] transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-mono text-xs text-[#888888] mb-3 uppercase tracking-wide">
                      Sort
                    </h3>
                    <SortControl
                      value={sortOption as any}
                      onChange={onSortChange as any}
                    />
                  </div>

                  <FilterBar
                    filters={[]}
                    selectedFilters={selectedFilters}
                    onFilterChange={onFilterChange}
                    onClearAll={onClearFilters}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
