"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { HighlightActionBubble } from "./HighlightActionBubble";
import { motion, AnimatePresence } from "framer-motion";

interface TextSelection {
  text: string;
  bounds: DOMRect;
  pageNumber: number;
}

interface Highlight {
  id: string;
  pageNumber: number;
  bounds: { x: number; y: number; width: number; height: number };
  text: string;
}

interface HighlightLayerProps {
  pageNumber: number;
  pdfDocument: pdfjsLib.PDFDocumentProxy | null;
  pdfPage: pdfjsLib.PDFPageProxy | null;
  viewport: pdfjsLib.PageViewport | null;
  canvasElement: HTMLCanvasElement | null;
  highlights: Highlight[];
  pulsingHighlightId?: string | null;
  onHighlightCreated?: (highlight: {
    pageNumber: number;
    text: string;
    bounds: DOMRect;
  }) => void;
  onNoteCreated?: (note: { pageNumber: number; text: string }) => void;
  onMemoriaAdded?: (item: { text: string; pageNumber: number }) => void;
  bookId: string;
  chapterId?: string;
}

export function HighlightLayer({
  pageNumber,
  pdfDocument,
  pdfPage,
  viewport,
  canvasElement,
  highlights,
  pulsingHighlightId,
  onHighlightCreated,
  onNoteCreated,
  onMemoriaAdded,
  bookId,
  chapterId,
}: HighlightLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [bubblePosition, setBubblePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Load and render text layer for text selection
  useEffect(() => {
    if (!pdfPage || !viewport || !textLayerRef.current) return;

    const loadTextLayer = async () => {
      try {
        const textContent = await pdfPage.getTextContent();
        const textLayerDiv = textLayerRef.current;
        if (!textLayerDiv) return;

        // Clear existing content
        textLayerDiv.innerHTML = "";

        // Manually create text divs from text content for selection
        // Using viewport to convert PDF coordinates to CSS pixels
        const textDivs: HTMLSpanElement[] = [];

        for (const item of textContent.items) {
          if ("str" in item && item.str.trim()) {
            // Get the transform matrix from the text item
            // item.transform is [a, b, c, d, e, f] where e,f are x,y translation
            const tx = item.transform[4];
            const ty = item.transform[5];

            // Apply viewport transform to convert PDF coordinates to CSS pixels
            const transform = viewport.transform;
            const x = transform[0] * tx + transform[2] * ty + transform[4];
            const y = transform[1] * tx + transform[3] * ty + transform[5];

            // Calculate font size from transform matrix (scale factor)
            const fontHeight =
              Math.sqrt(
                Math.pow(item.transform[2], 2) + Math.pow(item.transform[3], 2)
              ) * viewport.scale;

            // Calculate rotation angle from transform matrix
            const angle = Math.atan2(item.transform[1], item.transform[0]);

            const span = document.createElement("span");
            span.textContent = item.str;
            span.style.position = "absolute";
            span.style.left = `${x}px`;
            span.style.top = `${y}px`;
            span.style.fontSize = `${fontHeight}px`;
            span.style.fontFamily = item.fontName || "sans-serif";
            if (Math.abs(angle) > 0.01) {
              span.style.transform = `rotate(${angle}rad)`;
              span.style.transformOrigin = "0% 0%";
            }
            span.style.whiteSpace = "pre";
            span.style.cursor = "text";
            span.style.color = "transparent";
            span.style.userSelect = "text";

            textLayerDiv.appendChild(span);
            textDivs.push(span);
          }
        }
      } catch (error) {
        console.error("Error loading text layer:", error);
      }
    };

    loadTextLayer();
  }, [pdfPage, viewport]);

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setSelection(null);
      setBubblePosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();

    if (!selectedText || selectedText.length === 0) {
      setSelection(null);
      setBubblePosition(null);
      return;
    }

    // Get bounding rect relative to the canvas
    const rect = range.getBoundingClientRect();
    const canvasRect = canvasElement?.getBoundingClientRect();

    if (!canvasRect) return;

    // Calculate position relative to canvas
    const bounds = new DOMRect(
      rect.left - canvasRect.left,
      rect.top - canvasRect.top,
      rect.width,
      rect.height
    );

    setSelection({
      text: selectedText,
      bounds: bounds,
      pageNumber: pageNumber,
    });

    // Position bubble above selection
    setBubblePosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top,
    });
  }, [canvasElement, pageNumber]);

  // Clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (layerRef.current && !layerRef.current.contains(e.target as Node)) {
        setSelection(null);
        setBubblePosition(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Action handlers
  const handleHighlight = useCallback(() => {
    if (!selection) return;

    const highlight: Highlight = {
      id: `${bookId}-${pageNumber}-${Date.now()}`,
      pageNumber: selection.pageNumber,
      bounds: {
        x: selection.bounds.x,
        y: selection.bounds.y,
        width: selection.bounds.width,
        height: selection.bounds.height,
      },
      text: selection.text,
    };

    onHighlightCreated?.({
      pageNumber: selection.pageNumber,
      text: selection.text,
      bounds: selection.bounds,
    });

    setSelection(null);
    setBubblePosition(null);
    window.getSelection()?.removeAllRanges();
  }, [selection, bookId, pageNumber, onHighlightCreated]);

  const handleAddNote = useCallback(() => {
    if (!selection) return;

    onNoteCreated?.({
      pageNumber: selection.pageNumber,
      text: selection.text,
    });

    setSelection(null);
    setBubblePosition(null);
    window.getSelection()?.removeAllRanges();
  }, [selection, onNoteCreated]);

  const handleAddToMemoria = useCallback(async () => {
    if (!selection) return;

    try {
      // Call sync API to create memory card
      const response = await fetch("/api/memoria/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          chapterId,
          page: selection.pageNumber,
          text: selection.text,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Notify parent component
        onMemoriaAdded?.({
          text: selection.text,
          pageNumber: selection.pageNumber,
        });

        // Show success toast
        const event = new CustomEvent("showToast", {
          detail: {
            message: "Added to Memoria",
            type: "success",
          },
        });
        window.dispatchEvent(event);
      } else {
        console.error("Failed to sync to memoria");
        const event = new CustomEvent("showToast", {
          detail: {
            message: "Failed to add to Memoria",
            type: "error",
          },
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Error syncing to memoria:", error);
      const event = new CustomEvent("showToast", {
        detail: {
          message: "Failed to add to Memoria",
          type: "error",
        },
      });
      window.dispatchEvent(event);
    }

    setSelection(null);
    setBubblePosition(null);
    window.getSelection()?.removeAllRanges();
  }, [selection, bookId, chapterId, onMemoriaAdded]);

  const handleSummarize = useCallback(() => {
    if (!selection) return;
    // TODO: Implement AI summarization
    console.log("Summarize:", selection.text);
    setSelection(null);
    setBubblePosition(null);
    window.getSelection()?.removeAllRanges();
  }, [selection]);

  const handleCopy = useCallback(() => {
    if (!selection) return;
    navigator.clipboard.writeText(selection.text);
    setSelection(null);
    setBubblePosition(null);
    window.getSelection()?.removeAllRanges();
  }, [selection]);

  const handleClose = useCallback(() => {
    setSelection(null);
    setBubblePosition(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 pointer-events-auto"
      onMouseUp={handleMouseUp}
    >
      {/* Text layer for selection */}
      <div
        ref={textLayerRef}
        className="absolute inset-0"
        style={{
          opacity: 0,
          userSelect: "text",
          pointerEvents: "auto",
        }}
      />

      {/* Highlight overlays */}
      <AnimatePresence>
        {highlights
          .filter((h) => h.pageNumber === pageNumber)
          .map((highlight) => {
            const isPulsing = pulsingHighlightId === highlight.id;
            return (
              <motion.div
                key={highlight.id}
                className="absolute rounded-sm"
                style={{
                  left: `${highlight.bounds.x}px`,
                  top: `${highlight.bounds.y}px`,
                  width: `${highlight.bounds.width}px`,
                  height: `${highlight.bounds.height}px`,
                  background: "rgba(200, 182, 141, 0.3)",
                  pointerEvents: "none",
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  scale: isPulsing ? [1, 1.05, 1] : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: isPulsing ? 0.6 : 0.3,
                  scale: {
                    duration: 0.6,
                    repeat: isPulsing ? 2 : 0,
                    ease: "easeInOut",
                  },
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Action bubble */}
      {selection && bubblePosition && (
        <HighlightActionBubble
          x={bubblePosition.x}
          y={bubblePosition.y}
          selectedText={selection.text}
          onHighlight={handleHighlight}
          onAddNote={handleAddNote}
          onAddToMemoria={handleAddToMemoria}
          onSummarize={handleSummarize}
          onCopy={handleCopy}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
