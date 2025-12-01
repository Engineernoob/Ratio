"use client";

import { motion } from "framer-motion";

interface TempleHeroProps {
  streak: number;
  memoryRetention: number;
  learningVelocity: number;
  chaptersCompleted: number;
}

function HeroStat({
  label,
  value,
  hint,
  delay = 0,
}: {
  label: string;
  value: string;
  hint?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="hero-stat"
    >
      <div className="hero-stat-label">{label}</div>
      <div className="hero-stat-value">{value}</div>
      {hint && <div className="hero-stat-hint">{hint}</div>}
    </motion.div>
  );
}

export function TempleHero({
  streak,
  memoryRetention,
  learningVelocity,
  chaptersCompleted,
}: TempleHeroProps) {
  return (
    <section className="temple-hero">
      <div className="hero-vignette" aria-hidden />
      <motion.div
        className="hero-sigil"
        initial={{ opacity: 0.4, scale: 0.95 }}
        animate={{
          opacity: [0.45, 0.32, 0.5, 0.4],
          scale: [0.96, 1.01, 0.98, 1],
          rotate: [0, 1.2, -1.2, 0],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        aria-hidden
      />

      <div className="hero-fog" aria-hidden />
      <div className="hero-lines" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hero-copy"
      >
        <div className="hero-overline">The Scholar&apos;s Temple</div>
        <h1 className="hero-title engraved-glow">SCHOLARIVM</h1>
        <p className="hero-subtitle">Docendo discimus.</p>

        <div className="hero-stats-row">
          <HeroStat
            label="Retention"
            value={`${memoryRetention.toFixed(1)}%`}
            hint="memory lattice intact"
            delay={0.2}
          />
          <HeroStat
            label="Velocity"
            value={`${learningVelocity.toFixed(1)} / day`}
            hint="cadence maintained"
            delay={0.3}
          />
          <HeroStat
            label="Streak"
            value={`${streak} days`}
            hint="unbroken flame"
            delay={0.4}
          />
          <HeroStat
            label="Chapters"
            value={`${chaptersCompleted}`}
            hint="illumined"
            delay={0.5}
          />
        </div>
      </motion.div>
    </section>
  );
}
