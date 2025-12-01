"use client";

import { motion, useAnimation } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface CandleFlickerProps {
  children: ReactNode;
  intensity?: number;
  minInterval?: number;
  maxInterval?: number;
}

export function CandleFlicker({
  children,
  intensity = 0.06,
  minInterval = 3,
  maxInterval = 8,
}: CandleFlickerProps) {
  const controls = useAnimation();

  useEffect(() => {
    const flicker = async () => {
      while (true) {
        const duration =
          Math.random() * (maxInterval - minInterval) + minInterval;
        const brightness1 = 1.0 + intensity * (Math.random() - 0.5);
        const brightness2 = 0.98 + intensity * 0.2 * (Math.random() - 0.5);

        await controls.start({
          filter: [
            `brightness(1.0)`,
            `brightness(${brightness1})`,
            `brightness(${brightness2})`,
            `brightness(1.0)`,
          ],
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
