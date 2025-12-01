"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArcanaMemoriaPanelProps {
  reviewPath: string;
  timeEstimate: string;
  includedItemTypes: string[];
  onReview: () => void;
}

export function ArcanaMemoriaPanel({
  reviewPath,
  timeEstimate,
  includedItemTypes,
  onReview,
}: ArcanaMemoriaPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={cn(
        "rounded-lg p-6",
        "bg-[rgba(0,0,0,0.6)]",
        "border border-gold",
        "backdrop-blur-sm"
      )}
      style={{
        boxShadow:
          "0 0 30px rgba(215,196,158,0.3), inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03)",
      }}
    >
      <div className="space-y-6">
        <h2 className="font-serif text-xl font-bold text-gold">
          ARCANA MEMORIC6
        </h2>

        <div className="space-y-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-gold mb-2">
              TODAY'S REVIEW PATH
            </p>
            <p className="font-mono text-xs text-gold leading-relaxed">
              {reviewPath}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-gold mb-2">
              TIME ESTIMATE
            </p>
            <p className="font-mono text-xs text-gold leading-relaxed">
              {timeEstimate}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-gold mb-2">
              INCLVDED ITEM TYPES
            </p>
            <div className="space-y-1">
              {includedItemTypes.map((type, index) => (
                <p key={index} className="font-mono text-xs text-gold">
                  {type}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[rgba(215,196,158,0.2)]">
          <button
            onClick={onReview}
            className={cn(
              "w-full px-4 py-2 rounded",
              "border border-gold",
              "text-gold font-mono text-xs uppercase tracking-wider",
              "bg-[rgba(0,0,0,0.3)]",
              "hover:bg-[rgba(215,196,158,0.1)]",
              "transition-all duration-200"
            )}
            style={{
              boxShadow: "0 0 10px rgba(215,196,158,0.2)",
            }}
          >
            REVIEW
          </button>
        </div>
      </div>
    </motion.div>
  );
}
