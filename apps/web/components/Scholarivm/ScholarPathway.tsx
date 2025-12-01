"use client";

import { motion } from "framer-motion";

export type PathwayStatus = "complete" | "current" | "locked";

export interface PathwayStep {
  title: string;
  status: PathwayStatus;
  description: string;
}

interface ScholarPathwayProps {
  steps: PathwayStep[];
}

export function ScholarPathway({ steps }: ScholarPathwayProps) {
  return (
    <section className="scholar-pathway">
      <div className="section-heading">
        <div className="section-title">Scholar Pathway</div>
        <div className="section-sub">Engraved steps toward the dialectic.</div>
      </div>

      <div className="pathway-line" aria-hidden />

      <div className="pathway-grid">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className={`pathway-step ${step.status}`}
          >
            <div className="pathway-node" />
            <div className="pathway-body">
              <div className="pathway-step-title">{step.title}</div>
              <div className="pathway-step-desc">{step.description}</div>
              <div className="pathway-status">{step.status}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
