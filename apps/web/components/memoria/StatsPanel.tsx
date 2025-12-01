"use client";

import { motion } from "framer-motion";

interface StatsPanelProps {
  stats: {
    totalCards: number;
    dueToday: number;
    newCards: number;
    learningCards: number;
    reviewCards: number;
    masteredCards: number;
    currentStreak: number;
    accuracy: number;
    difficultyDistribution: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const statItems = [
    { label: "Due Today", value: stats.dueToday, color: "#C8B68D" },
    {
      label: "Total Cards",
      value: stats.totalCards,
      color: "rgba(200, 182, 141, 0.7)",
    },
    {
      label: "Current Streak",
      value: stats.currentStreak,
      color: "rgba(200, 182, 141, 0.8)",
    },
    {
      label: "Accuracy",
      value: `${stats.accuracy}%`,
      color: "rgba(200, 182, 141, 0.6)",
    },
  ];

  return (
    <motion.div
      className="p-6 rounded-lg"
      style={{
        border: "1px solid rgba(200, 182, 141, 0.2)",
        background: "rgba(10, 10, 10, 0.6)",
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-serif text-lg mb-4" style={{ color: "#C8B68D" }}>
        Statistics
      </h3>

      <div className="space-y-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <span
              className="font-mono text-xs opacity-60"
              style={{ color: "#C8B68D" }}
            >
              {item.label}
            </span>
            <span
              className="font-mono text-sm font-semibold"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </motion.div>
        ))}

        {/* Stage Breakdown */}
        <div
          className="pt-4 mt-4 border-t"
          style={{ borderColor: "rgba(200, 182, 141, 0.1)" }}
        >
          <h4 className="font-serif text-sm mb-3" style={{ color: "#C8B68D" }}>
            By Stage
          </h4>
          <div className="space-y-2">
            {[
              { label: "New", value: stats.newCards },
              { label: "Learning", value: stats.learningCards },
              { label: "Review", value: stats.reviewCards },
              { label: "Mastered", value: stats.masteredCards },
            ].map((stage) => (
              <div
                key={stage.label}
                className="flex items-center justify-between"
              >
                <span
                  className="font-mono text-xs opacity-50"
                  style={{ color: "#C8B68D" }}
                >
                  {stage.label}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "rgba(200, 182, 141, 0.7)" }}
                >
                  {stage.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
