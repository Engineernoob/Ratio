"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";
import { PageCanvas } from "./PageCanvas";
import { PageTurnWrapper } from "./PageTurnWrapper";
import { CodexChrome } from "./CodexChrome";
import { HighlightLayer } from "./HighlightLayer";
import type { BookManifest, BookChapterRef } from "@/lib/books/types";
import type { HTMLFlipBook as HTMLFlipBookType } from "react-pageflip";
import type { Highlight } from "@/lib/notes/types";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface CodexReaderProps {
  bookId: string;
  manifest: BookManifest;
  pdfPath?: string;
  selectedChapter?: BookChapterRef | null;
  onPageChange?: (page: number) => void;
  onHighlightCreated?: (highlight: {
    id: string;
    pageNumber: number;
    text: string;
    bounds: DOMRect;
  }) => void;
  onNoteCreated?: (note: { page: number; text: string }) => void;
  onMemoriaAdded?: (item: { text: string; pageNumber: number }) => void;
  ritualMode?: boolean;
}

export function CodexReader({
  bookId,
  manifest,
  pdfPath,
  selectedChapter,
  onPageChange,
  onHighlightCreated,
  onNoteCreated,
  onMemoriaAdded,
  ritualMode = false,
}: CodexReaderProps) {
  const [pdfDocument, setPdfDocument] =
    useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [pageData, setPageData] = useState<
    Map<
      number,
      {
        page: pdfjsLib.PDFPageProxy;
        viewport: pdfjsLib.PageViewport;
        canvas: HTMLCanvasElement;
      }
    >
  >(new Map());
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [pulsingHighlightId, setPulsingHighlightId] = useState<string | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<HTMLFlipBookType>(null);

  // Calculate page range for selected chapter
  const pageRange = useMemo(() => {
    if (!selectedChapter) return { start: 1, end: totalPages };

    const start = selectedChapter.pageStart ?? 1;
    const end = selectedChapter.pageEnd ?? totalPages;

    return { start, end };
  }, [selectedChapter, totalPages]);

  // Load PDF document
  useEffect(() => {
    if (!pdfPath) {
      setError("No PDF path provided");
      setLoading(false);
      return;
    }

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;

        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);

        // Play parchment crinkle sound on load
        setTimeout(() => {
          const audio = new Audio("/sounds/parchment-crinkle.mp3");
          audio.volume = 0.2;
          audio.play().catch(() => {
            // Silent fallback if file doesn't exist
          });
        }, 500);

        // Trigger book open animation
        setTimeout(() => setIsBookOpen(true), 100);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError(err instanceof Error ? err.message : "Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfPath]);

  // Load highlights
  useEffect(() => {
    if (!bookId) return;

    const loadHighlights = async () => {
      try {
        const response = await fetch(`/api/notes/${bookId}`);
        if (response.ok) {
          const data = await response.json();
          setHighlights(data.highlights || []);
        }
      } catch (err) {
        console.error("Error loading highlights:", err);
      }
    };

    loadHighlights();
  }, [bookId]);

  // Clear selection on page change
  useEffect(() => {
    window.getSelection()?.removeAllRanges();
  }, [currentPage]);

  // Listen for jumpToPage events
  useEffect(() => {
    const handleJumpToPage = (event: CustomEvent) => {
      const { page, highlightId } = event.detail;
      if (page && pdfDocument && totalPages > 0) {
        const clampedPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(clampedPage);

        // Use react-pageflip API to animate to the page
        if (flipBookRef.current) {
          const pageFlip = flipBookRef.current.pageFlip();
          if (pageFlip) {
            const targetSpreadIndex = Math.floor((clampedPage - 1) / 2);
            pageFlip.flip(targetSpreadIndex);
          }
        }

        // Temporarily highlight the note (flash effect)
        if (highlightId) {
          // Find the highlight and flash it
          const highlight = highlights.find((h) => h.id === highlightId);
          if (highlight) {
            // Add a temporary flash class or animation
            // This could be handled by HighlightLayer
          }
        }
      }
    };

    window.addEventListener("jumpToPage", handleJumpToPage as EventListener);
    return () => {
      window.removeEventListener(
        "jumpToPage",
        handleJumpToPage as EventListener
      );
    };
  }, [pdfDocument, totalPages, highlights]);

  // Jump to chapter's starting page when selectedChapter changes
  useEffect(() => {
    if (selectedChapter && pdfDocument && totalPages > 0) {
      const targetPage = selectedChapter.pageStart ?? 1;
      const clampedPage = Math.max(1, Math.min(targetPage, totalPages));

      setCurrentPage(clampedPage);

      // Play parchment crinkle sound on chapter change
      const audio = new Audio("/sounds/parchment-crinkle.mp3");
      audio.volume = 0.2;
      audio.play().catch(() => {
        // Silent fallback if file doesn't exist
      });

      // Use react-pageflip API to animate to the page
      if (flipBookRef.current) {
        const pageFlip = flipBookRef.current.pageFlip();
        if (pageFlip) {
          // Calculate which spread contains the target page
          const targetSpreadIndex = Math.floor((clampedPage - 1) / 2);
          // Animate to the spread
          pageFlip.flip(targetSpreadIndex);
        }
      }
    }
  }, [selectedChapter, pdfDocument, totalPages]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    // Clamp to chapter range if chapter is selected
    const clampedPage = Math.max(
      pageRange.start,
      Math.min(page, pageRange.end)
    );

    setCurrentPage(clampedPage);
    onPageChange?.(clampedPage);
  };

  const handlePrevious = () => {
    if (currentPage > pageRange.start) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageRange.end) {
      handlePageChange(currentPage + 1);
    }
  };

  // Handle highlight creation
  const handleHighlightCreated = async (highlight: {
    pageNumber: number;
    text: string;
    bounds: DOMRect;
  }) => {
    try {
      const response = await fetch(`/api/notes/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          chapterId: selectedChapter?.id,
          pageNumber: highlight.pageNumber,
          text: highlight.text,
          bounds: {
            x: highlight.bounds.x,
            y: highlight.bounds.y,
            width: highlight.bounds.width,
            height: highlight.bounds.height,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHighlights((prev) => [...prev, data.highlight]);

        // Pulse animation on highlight
        setPulsingHighlightId(data.highlight.id);
        setTimeout(() => setPulsingHighlightId(null), 1000);

        onHighlightCreated?.({
          id: data.highlight.id,
          pageNumber: highlight.pageNumber,
          text: highlight.text,
          bounds: highlight.bounds,
        });
      }
    } catch (err) {
      console.error("Error saving highlight:", err);
    }
  };

  // Handle note creation
  const handleNoteCreated = (note: { pageNumber: number; text: string }) => {
    onNoteCreated?.(note);
  };

  // Handle memoria addition
  const handleMemoriaAdded = (item: { text: string; pageNumber: number }) => {
    onMemoriaAdded?.(item);
  };

  // Store page data when page is ready
  const handlePageReady = (
    pageNumber: number,
    page: pdfjsLib.PDFPageProxy,
    viewport: pdfjsLib.PageViewport,
    canvas: HTMLCanvasElement
  ) => {
    setPageData((prev) => {
      const newMap = new Map(prev);
      newMap.set(pageNumber, { page, viewport, canvas });
      return newMap;
    });
  };

  // Generate page canvases for two-page spread
  // react-pageflip works with individual pages, so we create spreads as single pages
  const pageElements = useMemo(() => {
    if (!pdfDocument || totalPages === 0) return [];

    const elements: React.ReactNode[] = [];

    // Create two-page spreads
    for (let i = 1; i <= totalPages; i += 2) {
      const leftPage = i;
      const rightPage = i + 1 <= totalPages ? i + 1 : null;

      elements.push(
        <div
          key={`spread-${i}`}
          className="w-full h-full flex relative"
          style={{ gap: "4px" }}
        >
          {/* Left page */}
          <div className="flex-1 h-full relative rounded-sm overflow-hidden">
            <PageCanvas
              pageNumber={leftPage}
              pdfDocument={pdfDocument}
              scale={1.5}
              onPageReady={(page, viewport) => {
                // Find canvas by data attribute
                const canvas = document.querySelector(
                  `canvas[data-page="${leftPage}"]`
                ) as HTMLCanvasElement;
                if (canvas) {
                  handlePageReady(leftPage, page, viewport, canvas);
                }
              }}
            />
            {pageData.has(leftPage) && (
              <HighlightLayer
                pageNumber={leftPage}
                pdfDocument={pdfDocument}
                pdfPage={pageData.get(leftPage)?.page || null}
                viewport={pageData.get(leftPage)?.viewport || null}
                canvasElement={pageData.get(leftPage)?.canvas || null}
                highlights={highlights}
                pulsingHighlightId={pulsingHighlightId}
                onHighlightCreated={handleHighlightCreated}
                onNoteCreated={handleNoteCreated}
                onMemoriaAdded={handleMemoriaAdded}
                bookId={bookId}
                chapterId={selectedChapter?.id}
              />
            )}
          </div>

          {/* Right page or blank */}
          <div className="flex-1 h-full relative rounded-sm overflow-hidden">
            {rightPage ? (
              <>
                <PageCanvas
                  pageNumber={rightPage}
                  pdfDocument={pdfDocument}
                  scale={1.5}
                  onPageReady={(page, viewport) => {
                    const canvas = document.querySelector(
                      `canvas[data-page="${rightPage}"]`
                    ) as HTMLCanvasElement;
                    if (canvas) {
                      handlePageReady(rightPage, page, viewport, canvas);
                    }
                  }}
                />
                {pageData.has(rightPage) && (
                  <HighlightLayer
                    pageNumber={rightPage}
                    pdfDocument={pdfDocument}
                    pdfPage={pageData.get(rightPage)?.page || null}
                    viewport={pageData.get(rightPage)?.viewport || null}
                    canvasElement={pageData.get(rightPage)?.canvas || null}
                    highlights={highlights}
                    pulsingHighlightId={pulsingHighlightId}
                    onHighlightCreated={handleHighlightCreated}
                    onNoteCreated={handleNoteCreated}
                    onMemoriaAdded={handleMemoriaAdded}
                    bookId={bookId}
                    chapterId={selectedChapter?.id}
                  />
                )}
              </>
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: "#F5F1E8",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              />
            )}
          </div>
        </div>
      );
    }

    return elements;
  }, [pdfDocument, totalPages]);

  if (!pdfPath) {
    return (
      <div
        className="h-full w-full flex items-center justify-center"
        style={{ color: "rgba(200, 182, 141, 0.4)" }}
      >
        <p className="font-mono text-sm">No PDF available for this book</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="h-full w-full flex items-center justify-center"
        style={{ background: "#0A0A0A", color: "#C8B68D" }}
      >
        <div className="text-center">
          <div className="font-serif text-lg mb-2">Loading Codex...</div>
          <div className="font-mono text-xs opacity-60">
            Unfolding the ancient pages...
          </div>
        </div>
      </div>
    );
  }

  if (error || !pdfDocument) {
    return (
      <div
        className="h-full w-full flex items-center justify-center"
        style={{ background: "#0A0A0A", color: "#C8B68D" }}
      >
        <div className="text-center">
          <div className="font-serif text-lg mb-2">Error</div>
          <div className="font-mono text-xs opacity-60">
            {error || "Failed to load PDF"}
          </div>
        </div>
      </div>
    );
  }

  // Calculate which spread contains the current page (0-indexed for react-pageflip)
  const currentSpreadIndex = Math.floor((currentPage - 1) / 2);

  return (
    <div
      ref={containerRef}
      className="h-full w-full flex items-center justify-center relative"
      style={{ background: "#0A0A0A" }}
    >
      {/* Main book container with animations */}
      <motion.div
        className="relative"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{
          scale: isBookOpen ? 1 : 0.96,
          opacity: isBookOpen ? 1 : 0,
        }}
        transition={{
          scale: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.8,
          },
          opacity: { duration: 0.5 },
        }}
      >
        <PageTurnWrapper
          pages={pageElements}
          currentPage={currentSpreadIndex + 1}
          flipBookRef={flipBookRef}
          onPageChange={(spreadIndex) => {
            // Convert spread index (1-based) back to page number (1-based)
            // spreadIndex 1 = pages 1-2, spreadIndex 2 = pages 3-4, etc.
            const newPage = (spreadIndex - 1) * 2 + 1;
            handlePageChange(newPage);
          }}
          width={800}
          height={1000}
        />

        {/* UI Chrome overlay */}
        <CodexChrome
          currentPage={currentPage}
          totalPages={totalPages}
          chapterTitle={selectedChapter?.title}
          pageRange={pageRange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={currentPage > pageRange.start}
          canGoNext={currentPage < pageRange.end}
          ritualMode={ritualMode}
        />
      </motion.div>
    </div>
  );
}
