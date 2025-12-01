"use client";

import { useMemo, useState } from "react";
import { Reorder, motion } from "framer-motion";
import type { Premise } from "@/lib/logic/types";

interface SyllogismWorkbenchBoardProps {
  onValidityCheck: (premises: Premise[], conclusion: string) => void;
}

type RowKey = "major" | "minor" | "conclusion";
type Token = { id: string; text: string };

const palette = [
  "All",
  "No",
  "Some",
  "If",
  "then",
  "and",
  "or",
  "not",
  "philosophers",
  "machines",
  "mortals",
  "signals",
  "reason",
  "truth",
  "Socrates",
  "Ada",
  "are",
  "is",
];

const rowMeta: Record<RowKey, string> = {
  major: "Major Premise",
  minor: "Minor Premise",
  conclusion: "Conclusion",
};

export function SyllogismWorkbenchBoard({
  onValidityCheck,
}: SyllogismWorkbenchBoardProps) {
  const [rows, setRows] = useState<Record<RowKey, Token[]>>({
    major: [
      { id: "maj-1", text: "All" },
      { id: "maj-2", text: "philosophers" },
      { id: "maj-3", text: "are" },
      { id: "maj-4", text: "mortals" },
    ],
    minor: [
      { id: "min-1", text: "Socrates" },
      { id: "min-2", text: "is" },
      { id: "min-3", text: "a" },
      { id: "min-4", text: "philosopher" },
    ],
    conclusion: [
      { id: "con-1", text: "Socrates" },
      { id: "con-2", text: "is" },
      { id: "con-3", text: "mortal" },
    ],
  });

  const handleDrop = (row: RowKey, token: string) => {
    const tokenObj: Token = {
      id: `${row}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      text: token,
    };
    setRows((prev) => ({ ...prev, [row]: [...prev[row], tokenObj] }));
  };

  const handleReorder = (row: RowKey, tokens: Token[]) => {
    setRows((prev) => ({ ...prev, [row]: tokens }));
  };

  const handleRemove = (row: RowKey, index: number) => {
    setRows((prev) => ({
      ...prev,
      [row]: prev[row].filter((_, i) => i !== index),
    }));
  };

  const toText = (tokens: Token[]) =>
    tokens
      .map((token) => token.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim() || "—";

  const premises = useMemo(
    () => [
      { id: "p1", text: toText(rows.major) },
      { id: "p2", text: toText(rows.minor) },
    ],
    [rows]
  );

  const conclusion = useMemo(() => toText(rows.conclusion), [rows]);

  return (
    <div className="syllogism-board">
      <div className="syllogism-board__grid">
        {(Object.keys(rowMeta) as RowKey[]).map((rowKey) => (
          <DroppableRow
            key={rowKey}
            label={rowMeta[rowKey]}
            tokens={rows[rowKey]}
            onDropToken={(token) => handleDrop(rowKey, token)}
            onReorder={(tokens) => handleReorder(rowKey, tokens)}
            onRemoveToken={(index) => handleRemove(rowKey, index)}
          />
        ))}
      </div>

      <div className="syllogism-board__palette">
        <div className="logic-label">Term palette</div>
        <div className="syllogism-board__chips">
          {palette.map((token) => (
            <motion.span
              key={token}
              className="syllogism-chip"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", token);
              }}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              {token}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.button
        className="syllogism-board__cta"
        onClick={() => onValidityCheck(premises, conclusion)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Test validity
      </motion.button>
    </div>
  );
}

interface DroppableRowProps {
  label: string;
  tokens: Token[];
  onDropToken: (token: string) => void;
  onReorder: (tokens: Token[]) => void;
  onRemoveToken: (index: number) => void;
}

function DroppableRow({
  label,
  tokens,
  onDropToken,
  onReorder,
  onRemoveToken,
}: DroppableRowProps) {
  return (
    <div className="syllogism-row">
      <div className="syllogism-row__label">{label}</div>
      <div
        className="syllogism-row__dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const token = event.dataTransfer.getData("text/plain");
          if (token) onDropToken(token);
        }}
      >
        <Reorder.Group
          axis="x"
          values={tokens}
          onReorder={(newTokens) => onReorder(newTokens)}
          className="syllogism-row__tokens"
        >
          {tokens.map((token, idx) => (
            <Reorder.Item
              key={token.id}
              value={token}
              className="syllogism-token"
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.08 }}
            >
              <span>{token.text}</span>
              <button
                type="button"
                className="syllogism-token__remove"
                onClick={() => onRemoveToken(idx)}
              >
                ×
              </button>
            </Reorder.Item>
          ))}
          {!tokens.length && (
            <span className="syllogism-row__placeholder">Drop terms here</span>
          )}
        </Reorder.Group>
      </div>
    </div>
  );
}
