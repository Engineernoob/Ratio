"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollCard({
  children,
  className,
  delay = 0,
}: ScrollCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      whileInView={{ opacity: 1, height: "auto" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={cn(
        "relative",
        "bg-linear-to-br from-parchment/10 via-parchment/5 to-transparent",
        "border border-[rgba(201,178,125,0.2)] rounded-sm",
        "backdrop-blur-sm",
        "overflow-hidden",
        className
      )}
      style={{
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Parchment texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "url('/images/textures/parchment-dither.png')",
          backgroundSize: "200px 200px",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Mask gradient for scroll effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      />

      <div className="relative z-10 p-6">{children}</div>
    </motion.div>
  );
}
