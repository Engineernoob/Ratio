"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Fallacy } from "@/lib/logic/types";

interface LogicCopilotProps {
  argumentText: string;
  missingPremises: string[];
  fallacies: Fallacy[];
}

export function LogicCopilot({
  argumentText,
  missingPremises,
  fallacies,
}: LogicCopilotProps) {
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    const vagueWords =
      argumentText.match(/\b(maybe|probably|perhaps|could|might)\b/gi) || [];
    const premises = argumentText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const rewrite = premises
      .map((line, idx) => `P${idx + 1}: ${line.replace(/\.$/, "")}.`)
      .join(" ");

    return {
      vagueness: vagueWords,
      rewrite,
      focusedPremises: premises.slice(0, 3),
    };
  }, [argumentText]);

  return (
    <>
      <motion.button
        className="logic-copilot-button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        Logic Copilot
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="logic-copilot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="logic-copilot__panel"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
            >
              <div className="logic-copilot__header">
                <div>
                  <div className="logic-label">Logic Copilot</div>
                  <p className="logic-subtle">
                    Refinements, clarifications, and formal rewrites.
                  </p>
                </div>
                <button
                  type="button"
                  className="logic-copilot__close"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="logic-copilot__body">
                <section>
                  <div className="logic-label">Tighten vagueness</div>
                  {suggestions.vagueness.length ? (
                    <p className="logic-reading">
                      Swap terms like{" "}
                      <span className="logic-chip">
                        {suggestions.vagueness.join(", ")}
                      </span>{" "}
                      for specific quantities.
                    </p>
                  ) : (
                    <p className="logic-reading faint">
                      No obvious hedging detected.
                    </p>
                  )}
                </section>

                <section>
                  <div className="logic-label">Missing premises</div>
                  {missingPremises.length ? (
                    <ul className="logic-list subtle">
                      {missingPremises.map((premise, idx) => (
                        <li key={idx}>
                          <span className="logic-list__index ghost">+</span>
                          <span>{premise}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="logic-reading faint">
                      Structure appears connected.
                    </p>
                  )}
                </section>

                <section>
                  <div className="logic-label">Fallacy flags</div>
                  {fallacies.length ? (
                    <ul className="logic-list subtle">
                      {fallacies.map((fallacy) => (
                        <li key={fallacy.id}>
                          <span className="logic-list__index">!</span>
                          <span>{fallacy.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="logic-reading faint">No flags raised.</p>
                  )}
                </section>

                <section>
                  <div className="logic-label">Formal rewrite</div>
                  <p className="logic-reading">{suggestions.rewrite || "—"}</p>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
