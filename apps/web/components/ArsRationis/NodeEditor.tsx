"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ArgumentNode } from "@/lib/logic/types";

interface NodeEditorProps {
  node: ArgumentNode;
  onClose: () => void;
  onSave: (node: ArgumentNode) => void;
}

export function NodeEditor({ node, onSave, onClose }: NodeEditorProps) {
  const [text, setText] = useState(node.text);
  const [type, setType] = useState(node.type);

  const handleSave = () => {
    onSave({
      ...node,
      text,
      type,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md pointer-events-auto p-6 rounded-lg"
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(200, 182, 141, 0.3)",
          }}
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg" style={{ color: "#C8B68D" }}>
              Edit Node
            </h3>
            <motion.button
              onClick={onClose}
              style={{ color: "#C8B68D" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block font-mono text-xs mb-2 opacity-60"
                style={{ color: "#C8B68D" }}
              >
                Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border font-mono text-sm outline-none resize-none"
                style={{
                  color: "#C8B68D",
                  borderColor: "rgba(200, 182, 141, 0.3)",
                  background: "rgba(10, 10, 10, 0.5)",
                }}
                rows={3}
              />
            </div>

            <div>
              <label
                className="block font-mono text-xs mb-2 opacity-60"
                style={{ color: "#C8B68D" }}
              >
                Type
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as ArgumentNode["type"])
                }
                className="w-full px-3 py-2 bg-transparent border font-mono text-sm outline-none"
                style={{
                  color: "#C8B68D",
                  borderColor: "rgba(200, 182, 141, 0.3)",
                  background: "rgba(10, 10, 10, 0.5)",
                }}
              >
                <option value="premise">Premise</option>
                <option value="conclusion">Conclusion</option>
                <option value="objection">Objection</option>
                <option value="support">Support</option>
              </select>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={handleSave}
                className="flex-1 py-2 font-mono text-sm"
                style={{
                  color: "#C8B68D",
                  border: "1px solid rgba(200, 182, 141, 0.3)",
                  background: "rgba(200, 182, 141, 0.1)",
                  borderRadius: "4px",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
              <motion.button
                onClick={onClose}
                className="flex-1 py-2 font-mono text-sm"
                style={{
                  color: "#C8B68D",
                  border: "1px solid rgba(200, 182, 141, 0.3)",
                  background: "rgba(10, 10, 10, 0.6)",
                  borderRadius: "4px",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
