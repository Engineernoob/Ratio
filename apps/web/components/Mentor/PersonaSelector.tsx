"use client";

import { motion } from "framer-motion";
import type { MentorPersona } from "@/lib/mentor/types";
import { getPersonaDescription } from "@/lib/mentor/persona";

interface PersonaSelectorProps {
  selectedPersona: MentorPersona;
  onSelectPersona: (persona: MentorPersona) => void;
}

const personas: MentorPersona[] = [
  "classical_orator",
  "stoic_philosopher",
  "elite_tutor",
  "kind_mentor",
  "harsh_drillmaster",
  "socratic_questioner",
  "cognitive_scientist",
];

export function PersonaSelector({
  selectedPersona,
  onSelectPersona,
}: PersonaSelectorProps) {
  return (
    <div className="mb-6">
      <div
        className="font-mono text-xs uppercase mb-3"
        style={{ color: "rgba(215, 196, 158, 0.6)" }}
      >
        Choose Your Mentor
      </div>
      <div className="flex flex-wrap gap-2">
        {personas.map((persona) => {
          const desc = getPersonaDescription(persona);
          const isSelected = selectedPersona === persona;

          return (
            <motion.button
              key={persona}
              onClick={() => onSelectPersona(persona)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-sm border font-mono text-xs uppercase transition-all ${
                isSelected
                  ? "border-[#d7c49e]"
                  : "border-[rgba(215,196,158,0.2)]"
              }`}
              style={{
                background: isSelected
                  ? "rgba(215, 196, 158, 0.15)"
                  : "rgba(10, 10, 10, 0.6)",
                color: isSelected ? "#d7c49e" : "rgba(215, 196, 158, 0.6)",
                boxShadow: isSelected
                  ? "0 0 10px rgba(215, 196, 158, 0.2)"
                  : "none",
              }}
            >
              <span className="mr-2">{desc.icon}</span>
              {desc.name}
            </motion.button>
          );
        })}
      </div>
      {selectedPersona && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs mt-2 italic"
          style={{ color: "rgba(215, 196, 158, 0.5)" }}
        >
          {getPersonaDescription(selectedPersona).description}
        </motion.p>
      )}
    </div>
  );
}
