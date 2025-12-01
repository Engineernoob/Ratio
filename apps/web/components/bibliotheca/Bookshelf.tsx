"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookHotspot } from "./BookHotspot";

export interface BookData {
  id: string;
  title?: string;
  pdf?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BookManifest {
  id: string;
  title: string;
  author: string;
  bookSpine: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface BookshelfProps {
  books: BookData[];
  shelfImagePath: string;
  onBookClick?: (bookId: string) => void;
}

export function Bookshelf({
  books,
  shelfImagePath,
  onBookClick,
}: BookshelfProps) {
  const [zoomedBookId, setZoomedBookId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [zoomedBookSpine, setZoomedBookSpine] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleBookClick = async (bookId: string) => {
    try {
      // Fetch book manifest
      const response = await fetch(`/api/books/${bookId}?action=manifest`);
      if (!response.ok) {
        console.error("Failed to load book manifest");
        return;
      }

      const data = await response.json();
      const manifest: BookManifest = data.manifest;

      // Set zoom animation using bookSpine coordinates
      setZoomedBookSpine(manifest.bookSpine);
      setZoomedBookId(bookId);
      setIsTransitioning(true);

      // Trigger navigation after animation
      setTimeout(() => {
        if (onBookClick) {
          onBookClick(bookId);
        }
      }, 600);
    } catch (error) {
      console.error("Error loading book manifest:", error);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Bookshelf Image Container */}
      <motion.div
        className="relative w-full h-screen"
        style={{ position: "relative" }}
        animate={{
          scale: zoomedBookId ? 1.12 : 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${shelfImagePath}')`,
          }}
        />

        {/* Dark Vignette Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%),
              linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.5) 100%)
            `,
          }}
        />

        {/* Dither Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: "url('/images/textures/texture_bayer.png')",
            backgroundSize: "128px 128px",
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }}
        />

        {/* Book Hotspots */}
        <div className="absolute inset-0">
          {books.map((book) => (
            <BookHotspot
              key={book.id}
              book={book}
              isZoomed={zoomedBookId === book.id}
              onClick={() => handleBookClick(book.id)}
            />
          ))}
        </div>

        {/* Highlight zoomed book spine */}
        {zoomedBookId && zoomedBookSpine && (
          <motion.div
            className="absolute"
            style={{
              left: `${zoomedBookSpine.x}px`,
              top: `${zoomedBookSpine.y}px`,
              width: `${zoomedBookSpine.width}px`,
              height: `${zoomedBookSpine.height}px`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 rounded-sm"
              style={{
                background:
                  "linear-gradient(to right, rgba(200, 182, 141, 0.3) 0%, rgba(200, 182, 141, 0.15) 100%)",
                boxShadow:
                  "inset 0 0 40px rgba(200, 182, 141, 0.4), 0 0 30px rgba(200, 182, 141, 0.3)",
                border: "2px solid rgba(200, 182, 141, 0.5)",
              }}
            />
          </motion.div>
        )}

        {/* Transition Overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="absolute inset-0 bg-[#0A0A0A] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
