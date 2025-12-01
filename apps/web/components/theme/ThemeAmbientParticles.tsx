"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { DustLayer } from "@/components/ui/DustLayer";

export function ThemeAmbientParticles() {
  const { currentTheme } = useTheme();

  // Render appropriate particle type based on theme
  const renderParticles = () => {
    switch (currentTheme.ambientParticleType) {
      case "dust":
        return <DustLayer particleCount={25} />;
      case "embers":
        return <EmberLayer particleCount={20} />;
      case "sparks":
        return <SparkLayer particleCount={15} />;
      case "mist":
        return <MistLayer />;
      case "void":
        return null; // No particles for void theme
      case "grid":
        return <GridLayer />;
      case "pixels":
        return <PixelLayer />;
      case "lines":
        return <LineLayer />;
      default:
        return <DustLayer particleCount={25} />;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      key={currentTheme.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {renderParticles()}
    </motion.div>
  );
}

// Ember particles
function EmberLayer({ particleCount = 20 }: { particleCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const accentRgb =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-rgb")
            .trim() || "212, 165, 116";
        ctx.fillStyle = `rgba(${accentRgb}, ${particle.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
  );
}

// Spark particles
function SparkLayer({ particleCount = 15 }: { particleCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      life: Math.random(),
    }));

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 0.01;

        if (particle.life > 1) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = 0;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        const accentRgb =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-rgb")
            .trim() || "139, 164, 184";
        ctx.fillStyle = `rgba(${accentRgb}, ${
          particle.opacity * (1 - particle.life)
        })`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
  );
}

// Mist layer
function MistLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const mistPatches = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 200 + 100,
      opacity: Math.random() * 0.1 + 0.05,
    }));

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      mistPatches.forEach((patch) => {
        patch.x += patch.vx;
        patch.y += patch.vy;

        if (patch.x < -patch.size) patch.x = canvas.width + patch.size;
        if (patch.x > canvas.width + patch.size) patch.x = -patch.size;
        if (patch.y < -patch.size) patch.y = canvas.height + patch.size;
        if (patch.y > canvas.height + patch.size) patch.y = -patch.size;

        const gradient = ctx.createRadialGradient(
          patch.x,
          patch.y,
          0,
          patch.x,
          patch.y,
          patch.size
        );
        const accentRgb =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-rgb")
            .trim() || "154, 154, 154";
        gradient.addColorStop(0, `rgba(${accentRgb}, ${patch.opacity})`);
        gradient.addColorStop(1, `rgba(${accentRgb}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(patch.x, patch.y, patch.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
  );
}
