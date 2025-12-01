"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
export interface Scroll {
  id: string;
  title: string;
  author?: string;
  summary: string;
  type: "book" | "puzzle" | "dialectic";
  tags: string[];
  chapters?: { title: string; strength?: "novus" | "medius" | "fragilis" }[];
  strength?: "novus" | "medius" | "fragilis";
  icon?: string;
}

interface ScrollCardProps {
  scroll: Scroll;
  onOpenScroll?: (scroll: Scroll) => void;
  delay?: number;
  className?: string;
}

const iconMap: Record<string, string> = {
  systems: "📊",
  notes: "📝",
  thinking: "🧠",
  infinity: "∞",
  shield: "🛡",
  info: "ℹ",
  default: "📜",
};

export function ScrollCard({
  scroll,
  onOpenScroll,
  delay = 0,
  className,
}: ScrollCardProps) {
  const icon = scroll.icon || iconMap[scroll.type] || iconMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={() => onOpenScroll?.(scroll)}
      className={cn(
        "relative p-4 cursor-pointer",
        "bg-[rgba(0,0,0,0.4)]",
        "border border-[rgba(0,0,0,0.3)]",
        "backdrop-blur-sm",
        "hover:border-[rgba(255,255,255,0.5)]",
        "transition-all duration-200",
        className
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Dither overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 flex items-start gap-4">
        <div className="grow">
          <h3 className="font-serif text-base uppercase tracking-[0.08em] mb-1">
            {scroll.title}
          </h3>
          {scroll.author && (
            <p className="font-mono text-s text-[rgba(238,237,236,0.7)] mb-2">
              AVCTOR: {scroll.author}
            </p>
          )}
          <p className="font-mono text-[10px] text-muted-foreground mb-2">
            SVMMARY + CHAPTERS
          </p>
        </div>

        {/* Icon circle */}
        <div
          className="shrink-0 w-12 h-12 rounded-full border border-[rgba(236,236,235,0.92)] flex items-center justify-center text-xl"
          style={{
            boxShadow:
              "inset 0 1px 2px rgba(255,255,255,0.05), 0 1px 4px rgba(0,0,0,0.2)",
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
