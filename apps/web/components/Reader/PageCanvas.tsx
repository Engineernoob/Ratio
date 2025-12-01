"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PageCanvasProps {
  pageNumber: number;
  pdfDocument: pdfjsLib.PDFDocumentProxy | null;
  scale?: number;
  onLoad?: () => void;
  onPageReady?: (
    page: pdfjsLib.PDFPageProxy,
    viewport: pdfjsLib.PageViewport
  ) => void;
}

export function PageCanvas({
  pageNumber,
  pdfDocument,
  scale = 1.5,
  onLoad,
  onPageReady,
}: PageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageRef = useRef<pdfjsLib.PDFPageProxy | null>(null);
  const viewportRef = useRef<pdfjsLib.PageViewport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        pageRef.current = page;
        viewportRef.current = viewport;

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const context = canvas.getContext("2d");
        if (!context) return;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        setLoading(false);
        onLoad?.();
        if (pageRef.current && viewportRef.current && canvasRef.current) {
          onPageReady?.(pageRef.current, viewportRef.current);
        }
      } catch (err) {
        console.error(`Error rendering page ${pageNumber}:`, err);
        setError(err instanceof Error ? err.message : "Failed to render page");
        setLoading(false);
      }
    };

    renderPage();
  }, [pageNumber, pdfDocument, scale, onLoad]);

  if (error) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ color: "rgba(200, 182, 141, 0.4)" }}
      >
        <p className="font-mono text-xs">Error loading page</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(10, 10, 10, 0.5)" }}
        >
          <p
            className="font-mono text-xs opacity-40"
            style={{ color: "#C8B68D" }}
          >
            Loading...
          </p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        data-page={pageNumber}
        className="w-full h-full"
        style={{
          display: loading ? "none" : "block",
        }}
      />
      {/* Parchment texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "url('/images/textures/parchment-dither.png')",
          backgroundSize: "512px 512px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
