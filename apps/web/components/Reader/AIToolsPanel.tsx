"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles, BookOpen, Lightbulb, FileText } from "lucide-react";
import type { Theme } from "@/lib/theme";

interface AIToolsPanelProps {
  selectedText: string;
  bookId: string;
  chapterId?: string;
  onClose: () => void;
}

type AIToolAction = "explain" | "summarize" | "expand" | "memoria";

export function AIToolsPanel({
  selectedText,
  bookId,
  chapterId,
  onClose,
}: AIToolsPanelProps) {
  const [selectedAction, setSelectedAction] = useState<AIToolAction | null>(
    null
  );
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAIAction = async (action: AIToolAction) => {
    setSelectedAction(action);
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/mentor/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          text: selectedText,
          bookId,
          chapterId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.response || data.message);
      } else {
        setResponse("Error: Failed to get AI response");
      }
    } catch (error) {
      console.error("Error calling Mentor API:", error);
      setResponse("Error: Failed to connect to AI service");
    } finally {
      setLoading(false);
    }
  };

  const actions: { id: AIToolAction; label: string; icon: React.ReactNode }[] =
    [
      {
        id: "explain",
        label: "Explain this paragraph",
        icon: <Lightbulb size={18} />,
      },
      {
        id: "summarize",
        label: "Summarize this chapter",
        icon: <BookOpen size={18} />,
      },
      { id: "expand", label: "Expand this idea", icon: <FileText size={18} /> },
      {
        id: "memoria",
        label: "Generate Memoria card",
        icon: <Sparkles size={18} />,
      },
    ];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-96 h-full border-l overflow-y-auto"
      style={{
        background: "rgba(10, 10, 10, 0.95)",
        borderColor: "rgba(200, 182, 141, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl" style={{ color: "#C8B68D" }}>
            AI Tools
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded transition-colors"
            style={{
              color: "#C8B68D",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(200, 182, 141, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Text Preview */}
        <div
          className="p-4 mb-6 rounded border"
          style={{
            background: "rgba(200, 182, 141, 0.05)",
            borderColor: "rgba(200, 182, 141, 0.1)",
          }}
        >
          <div
            className="font-mono text-xs mb-2 opacity-60"
            style={{ color: "#C8B68D" }}
          >
            Selected Text:
          </div>
          <div className="font-mono text-sm" style={{ color: "#C8B68D" }}>
            {selectedText.substring(0, 200)}
            {selectedText.length > 200 && "..."}
          </div>
        </div>

        {/* AI Actions */}
        <div className="space-y-3 mb-6">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAIAction(action.id)}
              disabled={loading}
              className="w-full flex items-center gap-3 p-4 rounded transition-all text-left"
              style={{
                background:
                  selectedAction === action.id
                    ? "rgba(200, 182, 141, 0.15)"
                    : "transparent",
                border: `1px solid ${
                  selectedAction === action.id
                    ? "rgba(200, 182, 141, 0.3)"
                    : "rgba(200, 182, 141, 0.1)"
                }`,
                color: "#C8B68D",
                opacity: loading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading && selectedAction !== action.id) {
                  e.currentTarget.style.background =
                    "rgba(200, 182, 141, 0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && selectedAction !== action.id) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {action.icon}
              <span className="font-mono text-sm">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Response Area */}
        {(loading || response) && (
          <div
            className="p-4 rounded border min-h-[200px]"
            style={{
              background: "rgba(200, 182, 141, 0.02)",
              borderColor: "rgba(200, 182, 141, 0.1)",
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div
                  className="font-mono text-sm opacity-60"
                  style={{ color: "#C8B68D" }}
                >
                  Thinking...
                </div>
              </div>
            ) : (
              <div
                className="font-mono text-sm whitespace-pre-wrap"
                style={{ color: "#C8B68D" }}
              >
                {response}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
