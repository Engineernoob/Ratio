"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BookChapterRef, ChapterContent } from "@/lib/books/types";
import type { Highlight } from "@/lib/notes/types";
import type { Theme } from "@/lib/theme";

interface PageTransitionProps {
  mode: "page-curl" | "smooth-scroll" | "two-column";
  currentChapter: ChapterContent | null;
  selectedChapter: BookChapterRef | null;
  theme: Theme;
  onTextSelect: (text: string | null) => void;
  highlights: Highlight[];
  onHighlightCreated: (highlight: {
    pageNumber: number;
    text: string;
    bounds: DOMRect;
    chapterId?: string;
  }) => void;
}

export function PageTransition({
  mode,
  currentChapter,
  selectedChapter,
  theme,
  onTextSelect,
  highlights,
  onHighlightCreated,
}: PageTransitionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        onTextSelect(selection.toString().trim());
      } else {
        onTextSelect(null);
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    return () =>
      document.removeEventListener("selectionchange", handleSelection);
  }, [onTextSelect]);

  // Get theme-specific page styles
  const getPageStyles = () => {
    const themeId = theme.id;

    switch (themeId) {
      case "AETHER":
        return {
          background: "rgba(139, 164, 184, 0.02)",
          border: "1px solid rgba(139, 164, 184, 0.1)",
          boxShadow: "0 4px 20px rgba(139, 164, 184, 0.1)",
        };
      case "NOX":
        return {
          background: "rgba(107, 107, 107, 0.02)",
          border: "1px solid rgba(107, 107, 107, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        };
      case "FLAMMA":
        return {
          background: "rgba(212, 165, 116, 0.02)",
          border: "1px solid rgba(212, 165, 116, 0.1)",
          boxShadow: "0 4px 20px rgba(212, 165, 116, 0.1)",
        };
      case "UMBRA":
        return {
          background: "rgba(154, 154, 154, 0.02)",
          border: "1px solid rgba(154, 154, 154, 0.1)",
          boxShadow: "0 4px 20px rgba(154, 154, 154, 0.1)",
        };
      case "GLACIES":
        return {
          background: "rgba(184, 212, 227, 0.05)",
          border: "1px solid rgba(184, 212, 227, 0.2)",
          boxShadow: "0 4px 20px rgba(184, 212, 227, 0.15)",
          backdropFilter: "blur(10px)",
        };
      case "SYNAPSE":
        return {
          background: "rgba(0, 255, 136, 0.02)",
          border: "2px solid rgba(0, 255, 136, 0.3)",
          boxShadow: "0 4px 20px rgba(0, 255, 136, 0.2)",
        };
      case "FERRO":
        return {
          background: "rgba(139, 139, 139, 0.02)",
          border: "4px solid rgba(139, 139, 139, 0.4)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
        };
      default: // AUREA
        return {
          background: "rgba(200, 182, 141, 0.02)",
          border: "1px solid rgba(200, 182, 141, 0.1)",
          boxShadow: "0 4px 20px rgba(200, 182, 141, 0.1)",
        };
    }
  };

  const pageStyles = getPageStyles();

  // Render based on mode
  if (mode === "smooth-scroll") {
    return (
      <div
        ref={contentRef}
        className="h-full overflow-y-auto"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        <div
          className="max-w-4xl mx-auto p-12"
          style={{
            fontFamily: "var(--reading-font-family, serif)",
            fontSize: "var(--reading-font-size, 16px)",
            lineHeight: "var(--reading-line-height, 1.6)",
            color: theme.accent,
          }}
        >
          {currentChapter && (
            <>
              <h1 className="font-serif text-3xl mb-6">
                {currentChapter.title}
              </h1>
              <div className="prose prose-invert max-w-none">
                <p className="mb-4">{currentChapter.summary}</p>
                {currentChapter.keyIdeas && (
                  <div className="mb-6">
                    <h2 className="font-serif text-xl mb-3">Key Ideas</h2>
                    <ul className="list-disc list-inside space-y-2">
                      {currentChapter.keyIdeas.map((idea, idx) => (
                        <li key={idx}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (mode === "two-column") {
    return (
      <div className="h-full overflow-y-auto">
        <div
          className="max-w-7xl mx-auto p-12 columns-2 gap-8"
          style={{
            fontFamily: "var(--reading-font-family, serif)",
            fontSize: "var(--reading-font-size, 16px)",
            lineHeight: "var(--reading-line-height, 1.6)",
            color: theme.accent,
          }}
        >
          {currentChapter && (
            <>
              <h1 className="font-serif text-3xl mb-6 column-span-2">
                {currentChapter.title}
              </h1>
              <div className="prose prose-invert max-w-none">
                <p className="mb-4">{currentChapter.summary}</p>
                {currentChapter.keyIdeas && (
                  <div className="mb-6">
                    <h2 className="font-serif text-xl mb-3">Key Ideas</h2>
                    <ul className="list-disc list-inside space-y-2">
                      {currentChapter.keyIdeas.map((idea, idx) => (
                        <li key={idx}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Page curl mode (default)
  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        className="relative"
        style={{
          width: "var(--reading-page-width, 800px)",
          maxWidth: "90vw",
        }}
        animate={{
          rotateY: isFlipping ? -180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <div
          className="p-12 rounded-lg"
          style={{
            ...pageStyles,
            minHeight: "600px",
            fontFamily: "var(--reading-font-family, serif)",
            fontSize: "var(--reading-font-size, 16px)",
            lineHeight: "var(--reading-line-height, 1.6)",
            color: theme.accent,
          }}
        >
          {currentChapter && (
            <>
              <h1 className="font-serif text-3xl mb-6">
                {currentChapter.title}
              </h1>
              <div className="prose prose-invert max-w-none">
                <p className="mb-4">{currentChapter.summary}</p>
                {currentChapter.keyIdeas && (
                  <div className="mb-6">
                    <h2 className="font-serif text-xl mb-3">Key Ideas</h2>
                    <ul className="list-disc list-inside space-y-2">
                      {currentChapter.keyIdeas.map((idea, idx) => (
                        <li key={idx}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Page turn controls */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
          onClick={() => {
            if (currentPage > 1) {
              setIsFlipping(true);
              setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsFlipping(false);
              }, 300);
            }
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
          onClick={() => {
            setIsFlipping(true);
            setTimeout(() => {
              setCurrentPage(currentPage + 1);
              setIsFlipping(false);
            }, 300);
          }}
        />
      </motion.div>
    </div>
  );
}
