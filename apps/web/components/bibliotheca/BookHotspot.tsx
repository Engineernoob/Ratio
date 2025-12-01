"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BookData } from "./Bookshelf";

interface BookHotspotProps {
  book: BookData;
  isZoomed: boolean;
  onClick: () => void;
}

export function BookHotspot({ book, isZoomed, onClick }: BookHotspotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      onClick();
    }, 400); // Navigate after animation
  };

  // Random rotation direction
  const rotationDirection = book.id.charCodeAt(0) % 2 === 0 ? 2 : -2;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${book.x}px`,
        top: `${book.y}px`,
        width: `${book.width}px`,
        height: `${book.height}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsClicked(false);
      }}
      onClick={handleClick}
      animate={{
        x: isZoomed ? 12 : 0,
        scale: isClicked ? 1.05 : isHovered ? 1.02 : 1,
        y: isClicked ? -5 : 0,
        rotate: isClicked ? rotationDirection : 0,
        filter: isClicked
          ? "drop-shadow(0 10px 20px rgba(200, 182, 141, 0.4))"
          : isHovered
          ? "drop-shadow(0 5px 10px rgba(200, 182, 141, 0.2))"
          : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
      }}
      transition={{
        type: "spring",
        stiffness: isClicked ? 200 : 300,
        damping: isClicked ? 15 : 25,
      }}
    >
      {/* Hover Glow - Amber highlight */}
      <motion.div
        className="absolute inset-0 rounded-sm"
        style={{
          background:
            isHovered || isClicked
              ? "linear-gradient(to right, rgba(200, 182, 141, 0.2) 0%, rgba(200, 182, 141, 0.1) 100%)"
              : "transparent",
          boxShadow:
            isHovered || isClicked
              ? "inset 0 0 20px rgba(200, 182, 141, 0.2), 0 0 20px rgba(200, 182, 141, 0.15)"
              : "none",
          border:
            isHovered || isClicked
              ? "1px solid rgba(200, 182, 141, 0.3)"
              : "1px solid transparent",
        }}
        animate={{
          opacity: isHovered || isClicked ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Pull-out animation overlay */}
      {isZoomed && (
        <motion.div
          className="absolute inset-0 rounded-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background:
              "linear-gradient(to right, rgba(200, 182, 141, 0.3) 0%, rgba(200, 182, 141, 0.15) 100%)",
            boxShadow:
              "inset 0 0 40px rgba(200, 182, 141, 0.4), 0 0 30px rgba(200, 182, 141, 0.3)",
            border: "2px solid rgba(200, 182, 141, 0.5)",
          }}
        />
      )}
    </motion.div>
  );
}
