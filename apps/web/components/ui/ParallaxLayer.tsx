"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface ParallaxLayerProps {
  children: ReactNode;
  depth?: number; // 0-1, where 0 is background, 1 is foreground
  className?: string;
}

export function ParallaxLayer({
  children,
  depth = 0.5,
  className = "",
}: ParallaxLayerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      // Calculate parallax offset based on depth
      // Background (depth 0) moves 2-4px, foreground (depth 1) moves less
      // Use max 4px for background, scaling down for foreground
      const maxOffset = 4;
      const offsetX = deltaX * maxOffset * (1 - depth * 0.5);
      const offsetY = deltaY * maxOffset * (1 - depth * 0.5);

      setMousePosition({ x: offsetX, y: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [depth]);

  return (
    <motion.div
      className={className}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}
