"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExpandableNoteProps {
  text: string;
  icon?: string;
  className?: string;
}

export function ExpandableNote({
  text,
  icon = "□",
  className,
}: ExpandableNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-3 mb-3",
        "bg-[rgba(0,0,0,0.4)]",
        "border border-[rgb(255,254,254)]",
        "backdrop-blur-sm",
        className
      )}
      style={{
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.03), 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Icon circle */}
      <div
        className="shrink-0 w-10 h-10 rounded-full border border-[rgba(253,253,253,0.96)] flex items-center justify-center text-lg"
        style={{
          boxShadow:
            "inset 0 1px 2px rgba(255,255,255,0.05), 0 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="grow">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-mono text-xs text-muted-foreground mb-3 leading-relaxed">
                {text}
              </p>
              <button onClick={() => setIsExpanded(false)}>COLLAPSE</button>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between"
            >
              <p className="font-mono text-xs text-muted-foreground flex-1">
                {text.length > 60 ? `${text.substring(0, 60)}...` : text}
              </p>
              <button onClick={() => setIsExpanded(true)}>EXPAND</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
