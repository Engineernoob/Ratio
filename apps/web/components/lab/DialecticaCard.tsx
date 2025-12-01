"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DialecticaCardProps {
  dailyQuestion: string;
  onCounterargument?: () => void;
  onClarityTest?: () => void;
}

export function DialecticaCard({
  dailyQuestion,
  onCounterargument,
  onClarityTest,
}: DialecticaCardProps) {
  const [response, setResponse] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lab-card p-6 rounded-sm"
    >
      <h3 className="font-serif text-xl mb-4 text-white">DIALECTICA</h3>
      <p className="font-mono text-sm text-[#b7b7b7] mb-4">Daily Question</p>

      <div className="mb-4">
        <p className="font-serif text-base text-white leading-relaxed mb-4">
          {dailyQuestion}
        </p>

        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your response here..."
          className="lab-textarea rounded-sm"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onCounterargument}
          className="lab-button font-mono text-xs"
        >
          GENERATE COUNTERARGUMENT
        </button>
        <button
          onClick={onClarityTest}
          className="lab-button font-mono text-xs"
        >
          TEST CLARITY
        </button>
      </div>
    </motion.div>
  );
}
