"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FogPanel } from "./core/FogPanel";

interface CircularRecallMeterProps {
  percentage: number;
  className?: string;
  size?: number;
  tickCount?: number;
}

export function CircularRecallMeter({
  percentage,
  className,
  size = 200,
  tickCount = 60,
}: CircularRecallMeterProps) {
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;
  const circumference = 2 * Math.PI * radius;
  const filledTicks = Math.round((percentage / 100) * tickCount);
  const showGlow = percentage > 70;

  return (
    <FogPanel
      className={cn(
        "relative flex items-center justify-center card-padding",
        showGlow && "halo-pulse",
        className
      )}
    >
      {/* Outer dither halo */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2"
          />

          {/* Ticks */}
          {Array.from({ length: tickCount }).map((_, index) => {
            const angle = (index / tickCount) * 360;
            const radian = (angle * Math.PI) / 180;
            const x1 = centerX + radius * Math.cos(radian);
            const y1 = centerY + radius * Math.sin(radian);
            const x2 = centerX + (radius + 8) * Math.cos(radian);
            const y2 = centerY + (radius + 8) * Math.sin(radian);

            const isFilled = index < filledTicks;

            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isFilled ? "#E4E4E4" : "rgba(255, 255, 255, 0.2)"}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Progress arc */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#C67A3A"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              filter: showGlow ? "drop-shadow(0 0 8px rgba(198, 122, 58, 0.6))" : "none",
            }}
          />
        </svg>

        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="font-serif text-4xl font-bold text-foreground">
              {percentage}%
            </div>
          </motion.div>
        </div>
      </div>
    </FogPanel>
  );
}

