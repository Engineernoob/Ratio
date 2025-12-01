"use client";

import { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import type { HTMLFlipBook as HTMLFlipBookType } from "react-pageflip";

interface PageTurnWrapperProps {
  pages: React.ReactNode[];
  currentPage: number;
  onPageChange?: (page: number) => void;
  width?: number;
  height?: number;
  flipBookRef?: React.RefObject<HTMLFlipBookType>;
}

export function PageTurnWrapper({
  pages,
  currentPage,
  onPageChange,
  width = 800,
  height = 1000,
  flipBookRef: externalFlipBookRef,
}: PageTurnWrapperProps) {
  const internalFlipBookRef = useRef<HTMLFlipBookType>(null);
  const flipBookRef = externalFlipBookRef || internalFlipBookRef;
  const [isFlipping, setIsFlipping] = useState(false);

  // Sync external page changes
  useEffect(() => {
    if (flipBookRef.current && !isFlipping) {
      const targetPage = currentPage - 1; // react-pageflip uses 0-based indexing
      const pageFlip = flipBookRef.current.pageFlip();

      if (pageFlip) {
        const currentFlipPage = pageFlip.getCurrentPageIndex();

        if (
          targetPage !== currentFlipPage &&
          targetPage >= 0 &&
          targetPage < pages.length
        ) {
          pageFlip.flip(targetPage);
        }
      }
    }
  }, [currentPage, isFlipping, pages.length]);

  const handleFlip = (e: { data: number }) => {
    setIsFlipping(true);
    const newPage = e.data + 1; // Convert to 1-based
    onPageChange?.(newPage);

    // Play page-turn sound
    const soundFiles = ["/sounds/page-flip-1.mp3", "/sounds/page-flip-2.mp3"];
    const randomSound =
      soundFiles[Math.floor(Math.random() * soundFiles.length)];
    const audio = new Audio(randomSound);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback: generate simple page flip sound
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 200;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (err) {
        // Silent fallback
      }
    });

    setTimeout(() => setIsFlipping(false), 300);
  };

  return (
    <div className="relative">
      {/* Volumetric glow behind book */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200, 182, 141, 0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Dust particles animation */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: "rgba(200, 182, 141, 0.1)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <HTMLFlipBook
          ref={flipBookRef}
          width={width}
          height={height}
          minWidth={400}
          maxWidth={1200}
          minHeight={600}
          maxHeight={1400}
          maxShadowOpacity={0.5}
          showCover={false}
          flippingTime={600}
          usePortrait={true}
          startPage={currentPage - 1}
          onFlip={handleFlip}
          className="codex-flipbook"
        >
          {pages.map((page, index) => (
            <div
              key={index}
              className="codex-page"
              style={{
                background: "#F5F1E8",
                padding: "40px",
                boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
              }}
            >
              {page}
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <style jsx global>{`
        .codex-flipbook {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(200, 182, 141, 0.1);
        }

        .codex-page {
          background: #f5f1e8 !important;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .codex-page .stf__block {
          background: transparent !important;
        }

        /* Inner spine shading */
        .codex-page::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.15) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* Page hover effect */
        .codex-page:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}
