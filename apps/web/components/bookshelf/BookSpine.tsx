"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface BookMeta {
  id: string;
  title: string;
  author: string;
  category?: string;
  tags?: string[];
  spine: string;
  cover?: string;
  spineWidth?: "skinny" | "normal" | "thick";
  chapters: Array<{
    id: string;
    title: string;
    file: string;
  }>;
}

interface BookSpineProps {
  book: BookMeta;
  onClick: () => void;
  index: number;
}

export function BookSpine({ book, onClick, index }: BookSpineProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get width based on spineWidth from meta.json, default to "normal"
  const spineWidth = book.spineWidth || "normal";
  const widthMap = {
    skinny: "40px",
    normal: "55px",
    thick: "70px",
  };
  const width = widthMap[spineWidth];

  // Check if we should show image or text
  const showImage = book.spine && !imageError;
  const showText = !book.spine || imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: "spring",
        stiffness: 160,
      }}
      whileHover={{ y: -6, scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      className="book-spine cursor-pointer focus:outline-none"
      style={{ width }}
      onClick={onClick}
    >
      <div className="relative w-full h-[240px] overflow-hidden bg-[#111] border border-white/10 flex items-center justify-center">
        {showImage && (
          <>
            <img
              src={book.spine}
              alt=""
              className={`w-full h-[240px] object-cover object-center transition-opacity duration-200 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                filter: "grayscale(100%)",
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
              </div>
            )}
          </>
        )}

        {showText && (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
            <p
              className="font-serif text-xs text-white leading-tight"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
              }}
            >
              {book.title}
            </p>
            {book.author && (
              <p
                className="font-mono text-[10px] text-white/60 mt-2"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                {book.author}
              </p>
            )}
          </div>
        )}

        {/* Dithered overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: "url('/images/textures/texture_bayer.png')",
            backgroundSize: "256px 256px",
            backgroundRepeat: "repeat",
          }}
        />
      </div>
    </motion.div>
  );
}
