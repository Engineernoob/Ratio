"use client";

import { motion } from "framer-motion";
import { calculateMasteryLevel, type MasteryData } from "@/lib/scholarivm/utils";

interface DisciplineCardProps {
  name: string;
  data: MasteryData;
  delay?: number;
  onOpen?: () => void;
}

export function DisciplineCard({
  name,
  data,
  delay = 0,
  onOpen,
}: DisciplineCardProps) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(data.masteryPercent, 100);
  const dashOffset =
    circumference - (progress / 100) * circumference || circumference;

  const trendPositive = data.growthSinceLastWeek >= 0;
  const { levelName } = calculateMasteryLevel(data.xp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 80px rgba(0,0,0,0.35)" }}
      className="discipline-card"
    >
      <div className="discipline-card-veil" aria-hidden />
      <div className="discipline-card-body">
        <div className="discipline-card-header">
          <div>
            <div className="discipline-label">{levelName}</div>
            <div className="discipline-title">{name}</div>
          </div>
          <div className={`trend ${trendPositive ? "up" : "down"}`}>
            {trendPositive ? "+" : ""}
            {data.growthSinceLastWeek.toFixed(1)}%
            <span className="trend-hint">weekly</span>
          </div>
        </div>

        <div className="discipline-ring">
          <svg
            className="ring"
            width="130"
            height="130"
            viewBox="0 0 130 130"
            aria-hidden
          >
            <circle
              className="ring-bg"
              cx="65"
              cy="65"
              r={radius}
              strokeWidth="10"
            />
            <motion.circle
              className="ring-progress"
              cx="65"
              cy="65"
              r={radius}
              strokeWidth="10"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
            />
          </svg>
          <div className="ring-center">
            <div className="ring-number">{Math.round(progress)}%</div>
            <div className="ring-caption">mastery</div>
          </div>
        </div>

        <div className="discipline-meta">
          <div>
            <div className="meta-label">Level</div>
            <div className="meta-value">{data.level}</div>
          </div>
          <div>
            <div className="meta-label">XP</div>
            <div className="meta-value">{Math.round(data.xp)}</div>
          </div>
          <div>
            <div className="meta-label">To next</div>
            <div className="meta-value">
              {data.xpToNext > 0 ? `${data.xpToNext} XP` : "Ascended"}
            </div>
          </div>
        </div>

        <motion.button
          className="open-track-btn"
          onClick={onOpen}
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        >
          Open Track →
        </motion.button>
      </div>
    </motion.div>
  );
}
