"use client";

import { motion } from "framer-motion";
import { FogCard } from "@/components/core/FogCard";
import { cn } from "@/lib/utils";

interface RecentlyOpened {
  id: string;
  title: string;
  chapter: string;
}

interface LibraryLedgerProps {
  bookCount?: number;
  scrollsExplored?: number;
  recentlyOpened?: RecentlyOpened[];
  onContinueLectio?: () => void;
  className?: string;
}

export function LibraryLedger({
  bookCount = 0,
  scrollsExplored = 0,
  recentlyOpened = [],
  onContinueLectio,
  className,
}: LibraryLedgerProps) {
  return (
    <FogCard className={cn("p-6", className)} delay={0.3}>
      {/* Header */}
      <div className="mb-6">
        <h2
          className="font-serif text-2xl uppercase tracking-widest engraved-text mb-2"
          style={{
            textShadow:
              "1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.1)",
          }}
        >
          LIBRARY LEDGER
        </h2>
        <p className="font-mono text-xs text-[rgba(232,230,225,0.5)]">
          STATUS TABVLARII • MONOSPACED RECORD
        </p>
      </div>

      {/* Key Metrics */}
      <div className="mb-6 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[rgba(232,230,225,0.6)]"># LIBRI:</span>
          <span className="text-[rgba(232,230,225,0.9)]">{bookCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[rgba(232,230,225,0.6)]">
            # SCROLLI EXPLICATI:
          </span>
          <span className="text-[rgba(232,230,225,0.9)]">
            {scrollsExplored}
          </span>
        </div>
      </div>

      {/* Recently Opened */}
      {recentlyOpened.length > 0 && (
        <div className="mb-6">
          <h3 className="font-mono text-xs text-[rgba(232,230,225,0.6)] mb-3 uppercase tracking-wide">
            RECENTLY OPENED
          </h3>
          <div className="space-y-2">
            {recentlyOpened.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="font-mono text-xs text-[rgba(232,230,225,0.7)] py-2 border-b border-[rgba(255,255,255,0.05)] hover:text-[rgba(232,230,225,0.9)] transition-colors cursor-pointer"
              >
                {item.title} / {item.chapter}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Reading Button */}
      {onContinueLectio && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinueLectio}
          className="w-full py-3 px-4 border border-[#d4af37] bg-linear-to-br from-[rgba(212,175,55,0.1)] to-transparent hover:from-[rgba(212,175,55,0.15)] transition-all duration-300 font-mono text-xs uppercase tracking-wide text-[#d4af37]"
          style={{
            boxShadow:
              "0 0 15px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          CONTINVARE LECTIO
        </motion.button>
      )}

      {/* Status Indicators */}
      <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)]">
        <p className="font-mono text-xs text-[rgba(232,230,225,0.4)]">
          FOG INDEX: STABLE • MEMORY LINKS ACTIVE
        </p>
      </div>
    </FogCard>
  );
}
