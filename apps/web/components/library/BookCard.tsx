"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, BookOpen, Info, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    category?: string;
    tags?: string[];
    spineTexture?: string;
    readingProgress?: number;
    pdfPath?: string;
  };
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleOpen = () => {
    router.push(`/bibliotheca/${book.id}/reader`);
  };

  const handleAddToMemoria = () => {
    // TODO: Implement add to memoria
    console.log("Add to memoria:", book.id);
  };

  const handleInfo = () => {
    router.push(`/bibliotheca/${book.id}`);
  };

  const progress = book.readingProgress || 0;
  const spineTexture =
    book.spineTexture || "/images/textures/parchment-dither.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/bibliotheca/${book.id}/reader`}>
        <motion.div
          className="relative h-80 w-20 cursor-pointer"
          whileHover={{
            rotateX: 6,
            y: -4,
            transition: { duration: 0.3 },
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Book Spine */}
          <div
            className="absolute inset-0 rounded-sm overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(200, 182, 141, 0.15) 0%, rgba(200, 182, 141, 0.08) 50%, rgba(200, 182, 141, 0.05) 100%), url(${spineTexture})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
              boxShadow: isHovered
                ? "0 12px 24px rgba(0,0,0,0.35), 0 0 40px rgba(200, 182, 141, 0.2), inset 0 0 20px rgba(200, 182, 141, 0.1)"
                : "0 4px 12px rgba(0,0,0,0.2), inset 0 0 10px rgba(0,0,0,0.1)",
              border: "1px solid rgba(200, 182, 141, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Light Sweep Effect */}
            {isHovered && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                }}
              />
            )}

            {/* Title - Vertical Text */}
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <div
                className="font-serif text-sm font-semibold text-center leading-tight"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  color: "#e8e6e1",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  background:
                    "linear-gradient(180deg, #d7c49e 0%, #c8b68d 50%, #b8a67d 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {book.title}
              </div>
            </div>

            {/* Author - Bottom */}
            <div className="absolute bottom-2 left-0 right-0 text-center px-1">
              <div
                className="font-mono text-[8px] opacity-70"
                style={{ color: "#c8b68d" }}
              >
                {book.author}
              </div>
            </div>

            {/* Progress Indicator */}
            {progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.1)]">
                <div
                  className="h-full bg-[#c8b68d]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Hover Controls */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -10,
            }}
            transition={{ duration: 0.2 }}
            className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className="p-2 rounded-full bg-[rgba(14,14,14,0.9)] border border-[rgba(200,182,141,0.2)] hover:border-[#c8b68d] transition-colors"
            >
              <Heart
                className="h-4 w-4"
                fill={isFavorite ? "#c8b68d" : "none"}
                style={{ color: "#c8b68d" }}
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpen();
              }}
              className="p-2 rounded-full bg-[rgba(14,14,14,0.9)] border border-[rgba(200,182,141,0.2)] hover:border-[#c8b68d] transition-colors"
            >
              <BookOpen className="h-4 w-4" style={{ color: "#c8b68d" }} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInfo();
              }}
              className="p-2 rounded-full bg-[rgba(14,14,14,0.9)] border border-[rgba(200,182,141,0.2)] hover:border-[#c8b68d] transition-colors"
            >
              <Info className="h-4 w-4" style={{ color: "#c8b68d" }} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToMemoria();
              }}
              className="p-2 rounded-full bg-[rgba(14,14,14,0.9)] border border-[rgba(200,182,141,0.2)] hover:border-[#c8b68d] transition-colors"
            >
              <Plus className="h-4 w-4" style={{ color: "#c8b68d" }} />
            </button>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
