"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface PageHeaderProps {
  chapterTitle: string;
  pageNumber: number;
  totalPages: number;
}

export function PageHeader({
  chapterTitle,
  pageNumber,
  totalPages,
}: PageHeaderProps) {
  const [scrollY, setScrollY] = useState(0);
  const opacity = useTransform(useScroll().scrollYProgress, [0, 0.1], [1, 0], {
    clamp: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-40 px-8 py-4 border-b"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        borderColor: "rgba(200, 182, 141, 0.1)",
        backdropFilter: "blur(10px)",
        opacity,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Roman Engraving Decoration */}
        <div className="flex items-center gap-4">
          <div
            className="font-serif text-xs opacity-40"
            style={{
              fontFamily: "serif",
              letterSpacing: "0.2em",
            }}
          >
            ║ ║ ║
          </div>
          <div className="font-serif text-lg" style={{ color: "#C8B68D" }}>
            {chapterTitle}
          </div>
          <div
            className="font-serif text-xs opacity-40"
            style={{
              fontFamily: "serif",
              letterSpacing: "0.2em",
            }}
          >
            ║ ║ ║
          </div>
        </div>

        {/* Page Number */}
        <div
          className="font-mono text-sm opacity-60"
          style={{ color: "#C8B68D" }}
        >
          {pageNumber} / {totalPages}
        </div>
      </div>
    </motion.div>
  );
}
