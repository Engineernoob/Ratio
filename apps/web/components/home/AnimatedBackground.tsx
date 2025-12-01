"use client";

import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  imageUrl?: string;
}

export function AnimatedBackground({
  imageUrl = "/images/backgrounds/acropolis-dithered.png",
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrolled = window.scrollY;
        const parallax = scrolled * 0.2; // Subtle parallax
        containerRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        opacity: 0.05,
        filter: "grayscale(100%) contrast(120%) blur(0.5px)",
        animation: "ken-burns 120s ease-in-out infinite",
        willChange: "background-position, background-size, transform",
      }}
    />
  );
}
