"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Highlight } from "@/lib/notes/types";
import type { Theme } from "@/lib/theme";

interface HighlightSystemProps {
  bookId: string;
  chapterId?: string;
  highlights: Highlight[];
  theme: Theme;
  onHighlightCreated: (highlight: {
    pageNumber: number;
    text: string;
    bounds: DOMRect;
    chapterId?: string;
  }) => void;
}

export function HighlightSystem({
  bookId,
  chapterId,
  highlights,
  theme,
  onHighlightCreated,
}: HighlightSystemProps) {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionBounds, setSelectionBounds] = useState<DOMRect | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [highlightColor, setHighlightColor] = useState<string>(
    getThemeHighlightColor(theme.id)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  function getThemeHighlightColor(themeId: string): string {
    switch (themeId) {
      case "AETHER":
        return "rgba(139, 164, 184, 0.3)";
      case "NOX":
        return "rgba(107, 107, 107, 0.3)";
      case "FLAMMA":
        return "rgba(212, 165, 116, 0.3)";
      case "UMBRA":
        return "rgba(154, 154, 154, 0.3)";
      case "GLACIES":
        return "rgba(184, 212, 227, 0.3)";
      case "SYNAPSE":
        return "rgba(0, 255, 136, 0.3)";
      case "FERRO":
        return "rgba(139, 139, 139, 0.3)";
      default: // AUREA
        return "rgba(200, 182, 141, 0.3)";
    }
  }

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(selection.toString().trim());
        setSelectionBounds(rect);
        setShowColorPicker(true);
      } else {
        setSelectedText(null);
        setSelectionBounds(null);
        setShowColorPicker(false);
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    return () =>
      document.removeEventListener("selectionchange", handleSelection);
  }, []);

  const handleHighlight = async () => {
    if (!selectedText || !selectionBounds) return;

    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      onHighlightCreated({
        pageNumber: 1, // TODO: Calculate actual page number
        text: selectedText,
        bounds: rect,
        chapterId,
      });

      selection.removeAllRanges();
      setSelectedText(null);
      setSelectionBounds(null);
      setShowColorPicker(false);
    }
  };

  const highlightColors = [
    getThemeHighlightColor(theme.id),
    "rgba(255, 235, 59, 0.3)", // Yellow
    "rgba(76, 175, 80, 0.3)", // Green
    "rgba(33, 150, 243, 0.3)", // Blue
    "rgba(156, 39, 176, 0.3)", // Purple
  ];

  return (
    <>
      <AnimatePresence>
        {showColorPicker && selectedText && selectionBounds && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed z-50 flex items-center gap-2 p-2 rounded-lg"
            style={{
              left: `${
                selectionBounds.left + selectionBounds.width / 2 - 100
              }px`,
              top: `${selectionBounds.top - 50}px`,
              background: theme.background + "F0",
              border: `1px solid ${theme.accent}40`,
              backdropFilter: "blur(10px)",
            }}
          >
            {highlightColors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setHighlightColor(color);
                  handleHighlight();
                }}
                className="w-8 h-8 rounded border-2 transition-transform"
                style={{
                  background: color,
                  borderColor:
                    highlightColor === color ? theme.accent : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render existing highlights */}
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="absolute pointer-events-none"
          style={{
            left: `${highlight.bounds.x}px`,
            top: `${highlight.bounds.y}px`,
            width: `${highlight.bounds.width}px`,
            height: `${highlight.bounds.height}px`,
            background: highlightColor,
            borderRadius: "2px",
          }}
        />
      ))}
    </>
  );
}
