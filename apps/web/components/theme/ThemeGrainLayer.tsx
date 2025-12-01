"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export function ThemeGrainLayer() {
  const { currentTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate grain pattern
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const grain = Math.random() * 255;
      data[i] = grain; // R
      data[i + 1] = grain; // G
      data[i + 2] = grain; // B
      data[i + 3] = 255; // A
    }

    ctx.putImageData(imageData, 0, 0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [currentTheme.id]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 3,
        opacity: `var(--grain)`,
        mixBlendMode: "overlay",
      }}
      key={currentTheme.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: parseFloat(currentTheme.grainOpacity.toString()) }}
      transition={{ duration: 0.2 }}
    />
  );
}
