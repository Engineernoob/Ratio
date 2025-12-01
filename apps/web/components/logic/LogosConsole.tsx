"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { LogicHeatMap } from "./LogicHeatMap";

type ConsoleStatus = "idle" | "running" | "valid" | "invalid";

interface LogosConsoleProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  modeLabel: string;
  hint?: string;
  size?: "compact" | "expanded";
  status?: ConsoleStatus;
}

const escapeHtml = (unsafe: string) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const highlightLogic = (text: string) => {
  const safe = escapeHtml(text || "");
  return safe
    .replace(
      /(therefore|thus|hence|so|consequently|conclusion)/gi,
      '<span class="token-conclusion">$1</span>'
    )
    .replace(
      /\b(premise\s*\d+|premise|p\d+)\b/gi,
      '<span class="token-premise">$1</span>'
    )
    .replace(
      /\b(if|then|and|or|not|¬|∧|∨|→|⇒)\b/gi,
      '<span class="token-operator">$1</span>'
    )
    .replace(/\n/g, "<br />");
};

export function LogosConsole({
  value,
  onChange,
  onAnalyze,
  modeLabel,
  hint = "Press Cmd+Enter to Analyze",
  size = "expanded",
  status = "idle",
}: LogosConsoleProps) {
  const highlighted = useMemo(() => highlightLogic(value), [value]);
  const lines = Math.max(value.split("\n").length, 3);

  const height = size === "expanded" ? 360 : 260;

  return (
    <div className={`logos-console status-${status}`}>
      <LogicHeatMap active={status === "running"} />
      <div className="logos-console__frame" style={{ height }}>
        <div className="logos-console__header">
          <div className="logos-console__pill">{modeLabel}</div>
          <div className="logos-console__hint">{hint}</div>
        </div>

        <div className="logos-console__body">
          <div className="logos-console__lines" aria-hidden>
            {Array.from({ length: lines }).map((_, idx) => (
              <span key={idx}>{idx + 1}</span>
            ))}
          </div>

          <div className="logos-console__editor">
            <pre
              className="logos-console__highlight"
              aria-hidden
              dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }}
            />
            <textarea
              className="logos-console__textarea"
              value={value}
              placeholder="Sketch your premises here, then forge them..."
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  onAnalyze();
                }
              }}
            />
            <div className="logos-console__cursor" aria-hidden />
          </div>
        </div>

        <div className="logos-console__footer">
          <div className="logos-console__status-dot" data-state={status} />
          <div className="logos-console__status-text">
            {status === "running"
              ? "Analyzing..."
              : status === "valid"
              ? "Form detected"
              : status === "invalid"
              ? "Inconsistency found"
              : "Awaiting input"}
          </div>
          <motion.button
            className="logos-console__button"
            onClick={onAnalyze}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Analyze
          </motion.button>
        </div>
      </div>
    </div>
  );
}
