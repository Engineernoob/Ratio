"use client";

interface LogicHeatMapProps {
  active?: boolean;
}

export function LogicHeatMap({ active }: LogicHeatMapProps) {
  return (
    <div
      className={`logic-heatmap ${active ? "is-active" : ""}`}
      aria-hidden
    />
  );
}
