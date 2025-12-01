"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StreakFlameProps {
  streak: number;
}

export function StreakFlame({ streak }: StreakFlameProps) {
  const [flicker, setFlicker] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(0.95 + Math.random() * 0.1);
    }, 200 + Math.random() * 300);

    return () => clearInterval(interval);
  }, []);

  const intensity = Math.min(streak / 30, 1); // Max intensity at 30 days

  return (
    <motion.div
      className="relative"
      animate={{
        filter: `brightness(${flicker})`,
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      {/* Flame SVG */}
      <svg
        width="40"
        height="50"
        viewBox="0 0 40 50"
        style={{
          filter: `drop-shadow(0 0 ${8 * intensity}px rgba(215, 196, 158, ${
            0.6 * intensity
          }))`,
        }}
      >
        <defs>
          <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={`rgba(255, 200, 100, ${0.9 * intensity})`}
            />
            <stop
              offset="50%"
              stopColor={`rgba(215, 196, 158, ${0.7 * intensity})`}
            />
            <stop
              offset="100%"
              stopColor={`rgba(178, 155, 104, ${0.5 * intensity})`}
            />
          </linearGradient>
        </defs>

        {/* Main flame */}
        <motion.path
          d="M20 5 Q15 15, 12 25 Q10 35, 15 45 Q18 48, 20 50 Q22 48, 25 45 Q30 35, 28 25 Q25 15, 20 5 Z"
          fill="url(#flameGradient)"
          animate={{
            d: [
              "M20 5 Q15 15, 12 25 Q10 35, 15 45 Q18 48, 20 50 Q22 48, 25 45 Q30 35, 28 25 Q25 15, 20 5 Z",
              "M20 5 Q16 15, 13 25 Q11 35, 16 45 Q19 48, 20 50 Q21 48, 24 45 Q29 35, 27 25 Q24 15, 20 5 Z",
              "M20 5 Q14 15, 11 25 Q9 35, 14 45 Q17 48, 20 50 Q23 48, 26 45 Q31 35, 29 25 Q26 15, 20 5 Z",
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Inner flame */}
        <motion.path
          d="M20 10 Q17 18, 15 28 Q14 38, 18 42 Q19 44, 20 45 Q21 44, 22 42 Q26 38, 25 28 Q23 18, 20 10 Z"
          fill={`rgba(255, 220, 140, ${0.6 * intensity})`}
          animate={{
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
}
