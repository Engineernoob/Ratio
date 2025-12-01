"use client";

import { motion, useAnimation } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface LightFlickerProps {
  children: ReactNode;
  intensity?: number;
  minInterval?: number;
  maxInterval?: number;
}

export function LightFlicker({
  children,
  intensity = 0.03,
  minInterval = 4,
  maxInterval = 10,
}: LightFlickerProps) {
  const controls = useAnimation();

  useEffect(() => {
    const flicker = async () => {
      while (true) {
        const duration =
          Math.random() * (maxInterval - minInterval) + minInterval;
        const brightness = 1.0 + (Math.random() - 0.5) * intensity;

        await controls.start({
          filter: `brightness(${brightness})`,
          transition: {
            duration: duration,
            ease: "easeInOut",
          },
        });
      }
    };

    flicker();
  }, [controls, intensity, minInterval, maxInterval]);

  return (
    <motion.div animate={controls} style={{ willChange: "filter" }}>
      {children}
    </motion.div>
  );
}
