"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { calculateMasteryLevel } from "@/lib/scholarivm/utils";
import type { MasteryData } from "@/lib/scholarivm/utils";

interface MasterySlabProps {
  name: string;
  data: MasteryData;
  delay?: number;
}

export function MasterySlab({ name, data, delay = 0 }: MasterySlabProps) {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const { levelName, xpToNext } = calculateMasteryLevel(data.xp);
  const xpInCurrentLevel = data.xp - (data.xp % 100);

  useEffect(() => {
    // Animate XP
    const duration = 1500;
    const startTime = Date.now();
    const startXP = 0;
    const endXP = data.xp;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedXP(startXP + (endXP - startXP) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [data.xp]);

  useEffect(() => {
    // Animate percentage
    const duration = 1200;
    const startTime = Date.now();
    const startPercent = 0;
    const endPercent = data.masteryPercent;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(startPercent + (endPercent - startPercent) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [data.masteryPercent]);

  const growthColor =
    data.growthSinceLastWeek >= 0
      ? "rgba(215, 196, 158, 0.8)"
      : "rgba(200, 100, 100, 0.8)";
  const growthSign = data.growthSinceLastWeek >= 0 ? "+" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative p-6 border rounded-sm"
      style={{
        borderColor: "rgba(215, 196, 158, 0.2)",
        background: "rgba(10, 10, 10, 0.6)",
        boxShadow:
          "inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {/* Marble texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 rounded-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 0 0.9 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23marble)' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10">
        {/* Title */}
        <div className="mb-4">
          <h3
            className="font-serif text-lg uppercase tracking-wider mb-1 engraved-text"
            style={{ color: "#d7c49e" }}
          >
            {name}
          </h3>
          <div
            className="font-mono text-xs"
            style={{ color: "rgba(215, 196, 158, 0.6)" }}
          >
            {levelName} • Level {data.level}
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span
              className="font-mono text-xs"
              style={{ color: "rgba(215, 196, 158, 0.7)" }}
            >
              {Math.round(animatedXP)} XP
            </span>
            {xpToNext > 0 && (
              <span
                className="font-mono text-xs"
                style={{ color: "rgba(215, 196, 158, 0.5)" }}
              >
                {xpToNext} to next
              </span>
            )}
          </div>
          <div
            className="h-2 rounded-sm overflow-hidden"
            style={{
              background: "rgba(215, 196, 158, 0.1)",
              border: "1px solid rgba(215, 196, 158, 0.2)",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((xpInCurrentLevel % 100) / 100, 1) * 100}%`,
              }}
              transition={{
                duration: 1.5,
                delay: delay + 0.3,
                ease: "easeOut",
              }}
              className="h-full"
              style={{
                background:
                  "linear-gradient(to right, rgba(215, 196, 158, 0.6), rgba(215, 196, 158, 0.8))",
                boxShadow: "0 0 10px rgba(215, 196, 158, 0.3)",
              }}
            />
          </div>
        </div>

        {/* Mastery % */}
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <span
              className="font-mono text-xs"
              style={{ color: "rgba(215, 196, 158, 0.6)" }}
            >
              Mastery
            </span>
            <span
              className="font-serif text-lg font-bold"
              style={{ color: "#d7c49e" }}
            >
              {Math.round(animatedPercent)}%
            </span>
          </div>
        </div>

        {/* Growth */}
        <div
          className="pt-3 border-t"
          style={{ borderColor: "rgba(215, 196, 158, 0.1)" }}
        >
          <div className="flex justify-between items-center">
            <span
              className="font-mono text-xs"
              style={{ color: "rgba(215, 196, 158, 0.5)" }}
            >
              Since last week
            </span>
            <span className="font-mono text-sm" style={{ color: growthColor }}>
              {growthSign}
              {data.growthSinceLastWeek.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
