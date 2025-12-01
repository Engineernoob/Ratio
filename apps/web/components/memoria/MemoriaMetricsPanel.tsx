"use client";

import { motion } from "framer-motion";
import type { MemoriaConcept } from "@/lib/memoria";

interface MemoriaMetricsPanelProps {
  streak: number;
  masteredCount: number;
  weakest: MemoriaConcept[];
  strongest: MemoriaConcept[];
}

export function MemoriaMetricsPanel({
  streak,
  masteredCount,
  weakest,
  strongest,
}: MemoriaMetricsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="memoria-metrics"
    >
      <div className="memoria-metrics-grid">
        <div className="memoria-metric-block">
          <div className="memoria-metric-label">Review streak</div>
          <div className="memoria-metric-value">{streak} days</div>
          <div className="memoria-metric-caption">
            Return daily to keep the mind in motion.
          </div>
        </div>

        <div className="memoria-divider" />

        <div className="memoria-metric-block">
          <div className="memoria-metric-label">Mastered</div>
          <div className="memoria-metric-value">{masteredCount}</div>
          <div className="memoria-metric-caption">
            Concepts resting in long-term recall.
          </div>
        </div>

        <div className="memoria-divider" />

        <div className="memoria-metric-stack">
          <div className="memoria-metric-label">Weakest concepts</div>
          <div className="memoria-metric-list">
            {weakest.length === 0 ? (
              <div className="memoria-metric-row muted">
                <span>No weak spots detected.</span>
              </div>
            ) : (
              weakest.map((concept) => (
                <div key={concept.id} className="memoria-metric-row">
                  <span>{concept.title}</span>
                  <span className="memoria-chip subtle">
                    Ease {concept.ease_factor.toFixed(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="memoria-divider" />

        <div className="memoria-metric-stack">
          <div className="memoria-metric-label">Strongest concepts</div>
          <div className="memoria-metric-list">
            {strongest.length === 0 ? (
              <div className="memoria-metric-row muted">
                <span>Keep adding knowledge to build strength.</span>
              </div>
            ) : (
              strongest.map((concept) => (
                <div key={concept.id} className="memoria-metric-row">
                  <span>{concept.title}</span>
                  <span className="memoria-chip subtle">
                    {concept.review_count} reviews
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
