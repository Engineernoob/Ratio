"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { GraphDataPoint } from "@/lib/scholarivm/utils";

interface StatsGraphProps {
  title: string;
  data: GraphDataPoint[];
  color?: string;
  delay?: number;
  maxValue?: number;
}

export function StatsGraph({
  title,
  data,
  color = "#d7c49e",
  delay = 0,
  maxValue,
}: StatsGraphProps) {
  const [animatedData, setAnimatedData] = useState<GraphDataPoint[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setAnimatedData([]);
      return;
    }

    // Animate data points
    const duration = 1500;
    const startTime = Date.now();
    const startData = data.map((d) => ({ ...d, value: 0 }));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedData(
        data.map((point, i) => ({
          ...point,
          value:
            startData[i].value + (point.value - startData[i].value) * easeOut,
        }))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedData(data);
      }
    };

    animate();
  }, [data]);

  const values = animatedData.length ? animatedData.map((d) => d.value) : [0];
  const max = maxValue || Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const width = 400;
  const height = 200;
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Generate path
  const basePoints =
    animatedData.length > 0
      ? animatedData
      : [{ date: "N/A", value: 0 }];

  const points = basePoints.map((point, i) => {
    const x = padding + (i / (animatedData.length - 1 || 1)) * graphWidth;
    const y =
      padding + graphHeight - ((point.value - min) / range) * graphHeight;
    return { x, y, value: point.value };
  });

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  // Create smooth path
  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const prevPoint = points[i - 1];
    const cp1x = prevPoint.x + (point.x - prevPoint.x) / 3;
    const cp1y = prevPoint.y;
    const cp2x = point.x - (point.x - prevPoint.x) / 3;
    const cp2y = point.y;

    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, "");

  // Area path (for gradient fill)
  const areaPath = `${pathD} L ${lastPoint.x} ${padding + graphHeight} L ${
    firstPoint.x
  } ${padding + graphHeight} Z`;

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
        <h3
          className="font-serif text-sm uppercase tracking-wider mb-4 engraved-text"
          style={{ color: "#d7c49e" }}
        >
          {title}
        </h3>

        <div className="relative">
          <svg
            width={width}
            height={height}
            style={{ overflow: "visible" }}
            className="w-full h-auto"
          >
            <defs>
              <linearGradient
                id={`gradient-${title}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding + graphHeight - graphHeight * ratio;
              return (
                <line
                  key={ratio}
                  x1={padding}
                  y1={y}
                  x2={padding + graphWidth}
                  y2={y}
                  stroke="rgba(215, 196, 158, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* Area fill */}
            <motion.path
              d={areaPath}
              fill={`url(#gradient-${title})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: delay + 0.3 }}
            />

            {/* Line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                delay: delay + 0.2,
                ease: "easeInOut",
              }}
            />

            {/* Data points */}
            {points.map((point, i) => (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: delay + 0.5 + i * 0.05,
                }}
                style={{
                  filter: `drop-shadow(0 0 4px ${color})`,
                }}
              />
            ))}
          </svg>

          {/* Y-axis labels */}
          <div
            className="absolute left-0 top-0 flex flex-col justify-between"
            style={{ width: padding, height: height }}
          >
            {[max, (max + min) / 2, min].map((value, i) => (
              <span
                key={i}
                className="font-mono text-xs"
                style={{
                  color: "rgba(215, 196, 158, 0.5)",
                  transform: "translateY(-50%)",
                }}
              >
                {value.toFixed(1)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
