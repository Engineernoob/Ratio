"use client";

import { motion } from "framer-motion";
import type { Argument, Fallacy } from "@/lib/logic/types";

interface AnalyzerOutputProps {
  argument: Argument;
  fallacies: Fallacy[];
  missingPremises: string[];
  logicalForm: string;
}

export function AnalyzerOutput({
  argument,
  fallacies,
  missingPremises,
  logicalForm,
}: AnalyzerOutputProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Logical Form */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: "rgba(10, 10, 10, 0.7)",
          border: "1px solid rgba(200, 182, 141, 0.2)",
        }}
      >
        <h3 className="font-serif text-lg mb-4" style={{ color: "#C8B68D" }}>
          Logical Form
        </h3>
        <p
          className="font-mono text-sm leading-relaxed"
          style={{ color: "rgba(200, 182, 141, 0.8)" }}
        >
          {logicalForm}
        </p>
      </div>

      {/* Premises */}
      {argument.premises.length > 0 && (
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
          <div className="space-y-3">
            {argument.premises.map((premise, index) => (
              <div
                key={premise.id}
                className="flex items-start gap-3"
                style={{
                  borderTop:
                    index > 0 ? "1px solid rgba(200, 182, 141, 0.1)" : "none",
                  paddingTop: index > 0 ? "12px" : "0",
                }}
              >
                <span
                  className="font-mono text-xs shrink-0"
                  style={{ color: "rgba(200, 182, 141, 0.6)" }}
                >
                  P{index + 1}:
                </span>
                <p
                  className="font-mono text-sm flex-1"
                  style={{ color: "rgba(200, 182, 141, 0.8)" }}
                >
                  {premise.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conclusion */}
      {argument.conclusion.text && (
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
          <p
            className="font-mono text-sm leading-relaxed"
            style={{ color: "rgba(200, 182, 141, 0.9)" }}
          >
            {argument.conclusion.text}
          </p>
        </div>
      )}

      {/* Detected Fallacies */}
      {fallacies.length > 0 && (
        <div
          className="p-6 rounded-lg"
          style={{
            background: "rgba(200, 182, 141, 0.05)",
            border: "1px solid rgba(200, 182, 141, 0.3)",
          }}
        >
          <h3 className="font-serif text-lg mb-4" style={{ color: "#C8B68D" }}>
            Detected Fallacies
          </h3>
          <div className="space-y-4">
            {fallacies.map((fallacy) => (
              <div key={fallacy.id}>
                <h4
                  className="font-serif text-sm mb-2"
                  style={{ color: "#C8B68D" }}
                >
                  {fallacy.name}
                </h4>
                <p
                  className="font-mono text-xs leading-relaxed opacity-80"
                  style={{ color: "#C8B68D" }}
                >
                  {fallacy.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Premises */}
      {missingPremises.length > 0 && (
        <div
          className="p-6 rounded-lg"
          style={{
            background: "rgba(200, 182, 141, 0.05)",
            border: "1px solid rgba(200, 182, 141, 0.3)",
          }}
        >
          <h3 className="font-serif text-lg mb-4" style={{ color: "#C8B68D" }}>
            Missing Premises
          </h3>
          <ul className="space-y-2">
            {missingPremises.map((premise, index) => (
              <li
                key={index}
                className="font-mono text-sm"
                style={{ color: "rgba(200, 182, 141, 0.8)" }}
              >
                • {premise}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
