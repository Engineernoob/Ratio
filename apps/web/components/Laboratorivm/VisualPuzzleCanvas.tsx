"use client";

import { useEffect, useRef } from "react";
import type { VisualPuzzle } from "@/lib/puzzles/types";

interface VisualPuzzleCanvasProps {
  puzzle: VisualPuzzle;
  onAnswer: (answer: string | number[]) => void;
}

export function VisualPuzzleCanvas({
  puzzle,
  onAnswer,
}: VisualPuzzleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !puzzle.visualData) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, elements } = puzzle.visualData;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, width, height);

    // Draw elements
    elements.forEach((element) => {
      ctx.fillStyle = "rgba(200, 182, 141, 0.8)";
      ctx.strokeStyle = "rgba(200, 182, 141, 0.5)";
      ctx.lineWidth = 2;

      switch (element.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(
            element.x,
            element.y,
            (element.properties?.radius as number) || 20,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.stroke();
          break;
        case "rectangle":
          ctx.fillRect(
            element.x,
            element.y,
            (element.properties?.width as number) || 40,
            (element.properties?.height as number) || 40
          );
          ctx.strokeRect(
            element.x,
            element.y,
            (element.properties?.width as number) || 40,
            (element.properties?.height as number) || 40
          );
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(
            (element.properties?.x2 as number) || element.x + 50,
            (element.properties?.y2 as number) || element.y + 50
          );
          ctx.stroke();
          break;
      }
    });
  }, [puzzle]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simple click-based answer (can be extended)
    onAnswer(`${x},${y}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="border rounded-lg cursor-crosshair"
        style={{
          borderColor: "rgba(200, 182, 141, 0.3)",
          background: "rgba(10, 10, 10, 0.8)",
        }}
      />
      <p className="font-mono text-xs opacity-60" style={{ color: "#C8B68D" }}>
        Click on the canvas to interact
      </p>
    </div>
  );
}
