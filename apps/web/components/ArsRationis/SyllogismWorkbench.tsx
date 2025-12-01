"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import type { Premise } from "@/lib/logic/types";

interface SyllogismWorkbenchProps {
  onValidityCheck: (premises: Premise[], conclusion: string) => void;
}

export function SyllogismWorkbench({
  onValidityCheck,
}: SyllogismWorkbenchProps) {
  const [premises, setPremises] = useState<Premise[]>([
    { id: "p1", text: "All philosophers are seekers of truth" },
    { id: "p2", text: "Socrates is a philosopher" },
  ]);
  const [conclusion, setConclusion] = useState("Socrates seeks truth");
  const [newPremise, setNewPremise] = useState("");

  const addPremise = () => {
    if (newPremise.trim()) {
      setPremises([
        ...premises,
        {
          id: `p${premises.length + 1}`,
          text: newPremise.trim(),
        },
      ]);
      setNewPremise("");
    }
  };

  const removePremise = (id: string) => {
    setPremises(premises.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Premises */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: "rgba(10, 10, 10, 0.7)",
          border: "1px solid rgba(200, 182, 141, 0.2)",
        }}
      >
        <h3 className="font-serif text-lg mb-4" style={{ color: "#C8B68D" }}>
          Premises
        </h3>
        <Reorder.Group
          axis="y"
          values={premises}
          onReorder={setPremises}
          className="space-y-3"
        >
          {premises.map((premise, index) => (
            <Reorder.Item
              key={premise.id}
              value={premise}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.div
                className="flex items-center gap-3 p-4 rounded-lg"
                style={{
                  background: "rgba(200, 182, 141, 0.1)",
                  border: "1px solid rgba(200, 182, 141, 0.3)",
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center font-mono text-xs rounded shrink-0"
                  style={{
                    background: "rgba(200, 182, 141, 0.2)",
                    color: "#C8B68D",
                  }}
                >
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={premise.text}
                  onChange={(e) => {
                    setPremises(
                      premises.map((p) =>
                        p.id === premise.id ? { ...p, text: e.target.value } : p
                      )
                    );
                  }}
                  className="flex-1 px-3 py-2 bg-transparent border font-mono text-sm outline-none"
                  style={{
                    color: "#C8B68D",
                    borderColor: "rgba(200, 182, 141, 0.3)",
                  }}
                />
                <motion.button
                  onClick={() => removePremise(premise.id)}
                  className="px-3 py-1 font-mono text-xs"
                  style={{
                    color: "rgba(200, 182, 141, 0.7)",
                    border: "1px solid rgba(200, 182, 141, 0.2)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Add Premise */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={newPremise}
            onChange={(e) => setNewPremise(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addPremise();
              }
            }}
            className="flex-1 px-3 py-2 bg-transparent border font-mono text-sm outline-none"
            style={{
              color: "#C8B68D",
              borderColor: "rgba(200, 182, 141, 0.3)",
            }}
            placeholder="Add new premise..."
          />
          <motion.button
            onClick={addPremise}
            className="px-4 py-2 font-mono text-sm"
            style={{
              color: "#C8B68D",
              border: "1px solid rgba(200, 182, 141, 0.3)",
              background: "rgba(200, 182, 141, 0.1)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add
          </motion.button>
        </div>
      </div>

      {/* Conclusion */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: "rgba(200, 182, 141, 0.05)",
          border: "1px solid rgba(200, 182, 141, 0.3)",
        }}
      >
        <h3 className="font-serif text-lg mb-4" style={{ color: "#C8B68D" }}>
          Conclusion
        </h3>
        <input
          type="text"
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
          className="w-full px-4 py-3 bg-transparent border font-mono text-sm outline-none"
          style={{
            color: "#C8B68D",
            borderColor: "rgba(200, 182, 141, 0.3)",
          }}
          placeholder="Enter conclusion..."
        />
      </div>

      {/* Check Validity */}
      <motion.button
        onClick={() => onValidityCheck(premises, conclusion)}
        className="w-full py-4 font-mono text-sm"
        style={{
          color: "#C8B68D",
          border: "1px solid rgba(200, 182, 141, 0.3)",
          background: "rgba(200, 182, 141, 0.1)",
          borderRadius: "4px",
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Check Validity
      </motion.button>
    </div>
  );
}
