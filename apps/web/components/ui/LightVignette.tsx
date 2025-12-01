"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LightVignetteProps {
  intensity?: number;
  className?: string;
}

export function LightVignette({
  intensity = 0.2,
  className = "",
}: LightVignetteProps) {
  const [vignetteStrength, setVignetteStrength] = useState(intensity);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get CSS variable value if available, otherwise use prop
    const cssValue = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--texture-vignette");
    if (cssValue) {
      const parsed = parseFloat(cssValue);
      if (!isNaN(parsed)) {
        setVignetteStrength(parsed);
      }
    }
  }, []);

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, 
          color-mix(in srgb, var(--accent) calc(${vignetteStrength} * 100%), transparent) 0%, 
          color-mix(in srgb, var(--accent) calc(${vignetteStrength} * 50%), transparent) 30%, 
          transparent 70%)`,
        zIndex: 1,
        opacity: mounted ? 1 : 0,
      }}
      initial={false}
      animate={{ opacity: mounted ? 1 : 0 }}
      transition={{ duration: 1 }}
    />
  );
}
