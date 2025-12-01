"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export interface Challenge {
  id: string;
  label: string;
  xp: number;
}

export interface ChallengeSection {
  id: string;
  title: string;
  items: Challenge[];
}

interface ScholarChallengesProps {
  sections: ChallengeSection[];
}

interface Particle {
  id: string;
  text: string;
  x: number;
  y: number;
}

export function ScholarChallenges({ sections }: ScholarChallengesProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [particles, setParticles] = useState<Particle[]>([]);

  const toggleChallenge = (id: string, xp: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        spawnParticles(xp);
      }
      return next;
    });
  };

  const spawnParticles = (xp: number) => {
    const now = Date.now();
    const burst: Particle[] = Array.from({ length: 5 }, (_, i) => ({
      id: `${now}-${i}`,
      text: `+${xp} XP`,
      x: Math.random() * 60 - 30,
      y: Math.random() * 20,
    }));

    setParticles((prev) => [...prev, ...burst]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !burst.includes(p)));
    }, 1200);
  };

  const sortedSections = useMemo(
    () => sections.slice().sort((a, b) => a.title.localeCompare(b.title)),
    [sections]
  );

  return (
    <section className="scholar-challenges">
      <div className="section-heading">
        <div className="section-title">Scholar Challenges</div>
        <div className="section-sub">
          Cross off daily rites and weekly trials. Watch the XP rise.
        </div>
      </div>

      <div className="challenge-sections">
        {sortedSections.map((section) => (
          <div key={section.id} className="challenge-section">
            <div className="challenge-title">{section.title}</div>
            <div className="challenge-list">
              {section.items.map((challenge, index) => {
                const isDone = completed.has(challenge.id);
                return (
                  <motion.button
                    key={challenge.id}
                    className={`challenge-pill ${isDone ? "completed" : ""}`}
                    onClick={() => toggleChallenge(challenge.id, challenge.xp)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <span className={`checkbox ${isDone ? "checked" : ""}`}>
                      <span className="checkbox-fill" />
                    </span>
                    <span className="challenge-label">{challenge.label}</span>
                    <span className="challenge-xp">+{challenge.xp} XP</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="xp-particles" aria-hidden>
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0.9, y: 0, scale: 0.9 }}
              animate={{
                opacity: 0,
                y: -40 - particle.y,
                x: particle.x,
                scale: 1.2,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="xp-particle"
            >
              {particle.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
