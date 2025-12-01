"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Argument, ArgumentMap, Fallacy } from "@/lib/logic/types";

interface AnalyzerPaneProps {
  argument: Argument | null;
  fallacies: Fallacy[];
  missingPremises: string[];
  logicalForm: string;
  validity: boolean | null;
  argumentMap: ArgumentMap | null;
}

export function AnalyzerPane({
  argument,
  fallacies,
  missingPremises,
  logicalForm,
  validity,
  argumentMap,
}: AnalyzerPaneProps) {
  return (
    <AnimatePresence>
      {argument && (
        <motion.div
          key="analyzer-pane"
          className="logic-output-pane"
          initial={{ opacity: 0, x: 120 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 120 }}
          transition={{ duration: 0.35 }}
        >
          <div className="logic-output-pane__fog" aria-hidden />
          <div className="logic-output-pane__header">
            <div className="logic-output-pane__pill">Analyzer Output</div>
            <div
              className={`logic-output-pane__badge ${
                validity === null ? "" : validity ? "is-valid" : "is-invalid"
              }`}
            >
              {validity === null
                ? "Awaiting analysis"
                : validity
                ? "Valid Pulse"
                : "Needs Reinforcement"}
            </div>
          </div>

          <div className="logic-output-pane__section">
            <p className="logic-label">Conclusion detected</p>
            <p className="logic-reading">{argument.conclusion.text}</p>
          </div>

          <div className="logic-output-pane__section">
            <p className="logic-label">Premise lattice</p>
            <ul className="logic-list">
              {argument.premises.map((premise, idx) => (
                <li key={premise.id}>
                  <span className="logic-list__index">P{idx + 1}</span>
                  <span>{premise.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="logic-output-pane__section">
            <p className="logic-label">Symbolic form</p>
            <p className="logic-reading">{logicalForm || "—"}</p>
          </div>

          <div className="logic-output-pane__split">
            <div className="logic-output-pane__section">
              <p className="logic-label">Missing links</p>
              {missingPremises.length ? (
                <ul className="logic-list subtle">
                  {missingPremises.map((premise, idx) => (
                    <li key={idx}>
                      <span className="logic-list__index ghost">?</span>
                      <span>{premise}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="logic-reading faint">No obvious gaps detected.</p>
              )}
            </div>
            <div className="logic-output-pane__section">
              <p className="logic-label">Fallacy scan</p>
              {fallacies.length ? (
                <ul className="logic-list subtle">
                  {fallacies.map((fallacy) => (
                    <li key={fallacy.id}>
                      <span className="logic-list__index">⚠︎</span>
                      <span>{fallacy.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="logic-reading faint">No surface fallacies.</p>
              )}
            </div>
          </div>

          {argumentMap && (
            <div className="logic-output-pane__section">
              <p className="logic-label">Map clarity</p>
              <div className="logic-reading">
                Score {argumentMap.clarityScore ?? "—"}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
