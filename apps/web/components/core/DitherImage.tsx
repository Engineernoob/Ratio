"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DitherImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function DitherImage({ 
  src, 
  alt, 
  width = 800, 
  height = 600,
  className,
  priority = false
}: DitherImageProps) {
  return (
    <div className={cn("relative dither grain engraving-image scanline overflow-hidden border border-border", className)}>
      <motion.div
        initial={{ opacity: 0, filter: "contrast(0) brightness(0)" }}
        animate={{ opacity: 1, filter: "contrast(1.4) brightness(0.85)" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="dither-reveal relative"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto engraving-filter"
          priority={priority}
        />
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="scanline-overlay w-full h-full" />
        </div>
      </motion.div>
    </div>
  );
}
