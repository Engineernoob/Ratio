"use client";

import { motion } from "framer-motion";
import { FogCard } from "@/components/core/FogCard";
import { cn } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  author: string;
  slug: string;
}

interface ScrollShelfProps {
  books: Book[];
  selectedBookId?: string;
  onSelectBook?: (bookId: string) => void;
  className?: string;
}

export function ScrollShelf({
  books,
  selectedBookId,
  onSelectBook,
  className,
}: ScrollShelfProps) {
  return (
    <FogCard className={cn("p-6", className)} delay={0.2}>
      {/* Header */}
      <div className="mb-6">
        <p className="font-mono text-xs text-[rgba(232,230,225,0.5)] mb-2">
          SCROLLVS ALEXANDRINVS
        </p>
        <h2
          className="font-serif text-2xl uppercase tracking-widest engraved-text mb-2"
          style={{
            textShadow:
              "1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.1)",
          }}
        >
          SCROLL SHELF — LIBRARY OF ALEXANDRIA
        </h2>
        <p className="font-mono text-xs text-[rgba(232,230,225,0.5)]">
          ELECTA VOLUMINA IN ROTA • PONE DIGITVM ET TRAHE
        </p>
      </div>

      {/* Filter/View Options */}
      <div className="mb-6 flex items-center justify-between font-mono text-xs text-[rgba(232,230,225,0.5)]">
        <div>LIBRI IN TVBVLIS • SELECTIONES</div>
        <div>SCROLLI: {books.length} • SCRIPTA CLASSICA</div>
      </div>

      {/* Book Items */}
      <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {books.map((book, index) => {
          const isSelected = selectedBookId === book.id;
          return (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectBook?.(book.id)}
              className={cn(
                "shrink-0 w-48 h-48 rounded-full",
                "flex flex-col items-center justify-center",
                "border-2 transition-all duration-300",
                "bg-linear-to-br from-[rgba(255,255,255,0.02)] to-transparent",
                isSelected
                  ? "border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  : "border-[rgba(255,255,255,0.1)] hover:border-[rgba(212,175,55,0.2)]"
              )}
              style={{
                boxShadow: isSelected
                  ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(212,175,55,0.3)"
                  : "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 15px rgba(0,0,0,0.3)",
              }}
            >
              {/* Grain overlay */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                }}
              />
              <div className="relative z-10 text-center px-4">
                <p
                  className={cn(
                    "font-serif text-sm uppercase tracking-wide mb-1",
                    isSelected
                      ? "text-[#d4af37]"
                      : "text-[rgba(232,230,225,0.8)]"
                  )}
                >
                  {book.title}
                </p>
                <p className="font-mono text-xs text-[rgba(232,230,225,0.5)]">
                  {book.author}
                </p>
              </div>
            </motion.button>
          );
        })}
        {/* Placeholder for new book */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="shrink-0 w-48 h-48 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] transition-colors bg-linear-to-br from-[rgba(255,255,255,0.01)] to-transparent"
        >
          <p className="font-serif text-sm uppercase tracking-wide text-[rgba(232,230,225,0.4)]">
            NOVVM VOLVMEN
          </p>
          <p className="font-mono text-xs text-[rgba(232,230,225,0.3)] mt-1">
            FVTVRVM
          </p>
        </motion.button>
      </div>

      {/* Scroll Indicators */}
      <div className="flex items-center justify-between font-mono text-xs text-[rgba(232,230,225,0.4)]">
        <div className="flex items-center gap-2">
          <span className="text-[#d4af37]">▲</span>
          <span>PERCVTE SCROLLVM VT EXPLICETVR</span>
        </div>
        <div className="flex items-center gap-2">
          <span>TRAHE AD LATERA VT ALIA VIDEAS</span>
          <span className="text-[#d4af37]">→</span>
        </div>
      </div>
    </FogCard>
  );
}
