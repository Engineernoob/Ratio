"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface EngravedStatueProps {
  imageSrc: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  vignette?: boolean;
  ditherIntensity?: number;
  glow?: boolean;
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  sm: { width: 200, height: 300 },
  md: { width: 400, height: 600 },
  lg: { width: 800, height: 1200 },
};

export function EngravedStatue({
  imageSrc,
  alt,
  size = "md",
  vignette = true,
  ditherIntensity = 0.6,
  glow = false,
  className,
  priority = false,
}: EngravedStatueProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dimensions = sizeMap[size];

  useEffect(() => {
    // Use native browser Image constructor, not Next.js Image component
    const img = new window.Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-black",
          className
        )}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="font-mono text-xs text-muted-foreground">
          Image unavailable
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-black",
          className
        )}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="font-mono text-xs text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn(
        "relative bg-black overflow-hidden",
        glow && "halo-pulse",
        className
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Main Image with Engraving Filters */}
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full object-cover engraving-filter dither-reveal"
          priority={priority}
          style={{
            filter: `
              grayscale(100%) 
              contrast(1.8) 
              brightness(0.7)
              sepia(30%)
            `,
            imageRendering: "crisp-edges",
          }}
        />

        {/* Halftone/Dither Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.2) 1px, transparent 0),
              radial-gradient(circle at 3px 3px, rgba(255, 255, 255, 0.15) 1px, transparent 0)
            `,
            backgroundSize: "4px 4px, 6px 6px",
            mixBlendMode: "overlay",
            opacity: ditherIntensity,
          }}
        />

        {/* Vignette Shadow */}
        {vignette && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  ellipse at center,
                  transparent 0%,
                  transparent 50%,
                  rgba(0, 0, 0, 0.6) 100%
                )
              `,
            }}
          />
        )}

        {/* Soft Halo Glow */}
        {glow && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 60px rgba(255, 255, 255, 0.1)",
            }}
          />
        )}

        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="scanline-overlay w-full h-full" />
        </div>
      </div>
    </motion.div>
  );
}

