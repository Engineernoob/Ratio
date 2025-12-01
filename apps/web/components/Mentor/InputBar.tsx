"use client";

import { useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";

interface InputBarProps {
  onSend: (message: string) => void;
  suggestions?: string[];
  disabled?: boolean;
}

const defaultSuggestions = [
  "Explain this",
  "Test me",
  "Strengthen my reasoning",
  "Quiz me on today's readings",
  "Give me a micro-lesson",
  "Ask Socratic questions",
];

export function InputBar({
  onSend,
  suggestions = defaultSuggestions,
  disabled = false,
}: InputBarProps) {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full mb-2 w-full"
        >
          <div
            className="p-3 rounded-sm border space-y-1"
            style={{
              borderColor: "rgba(215, 196, 158, 0.2)",
              background: "rgba(10, 10, 10, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            {suggestions.slice(0, 4).map((suggestion, i) => (
              <motion.button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                whileHover={{ x: 5 }}
                className="w-full text-left font-mono text-xs py-1 px-2 hover:bg-[rgba(215,196,158,0.1)] rounded-sm transition-colors"
                style={{ color: "rgba(215, 196, 158, 0.7)" }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input area */}
      <div
        className="flex items-end gap-2 p-4 border rounded-sm"
        style={{
          borderColor: "rgba(215, 196, 158, 0.2)",
          background: "rgba(10, 10, 10, 0.6)",
        }}
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Ask your mentor..."
          disabled={disabled}
          className="flex-1 font-mono text-sm bg-transparent resize-none outline-none"
          style={{
            color: "rgba(232, 230, 225, 0.9)",
            minHeight: "60px",
            maxHeight: "120px",
          }}
        />
        <motion.button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 font-mono text-xs uppercase border rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            borderColor: "rgba(215, 196, 158, 0.4)",
            background:
              message.trim() && !disabled
                ? "rgba(215, 196, 158, 0.1)"
                : "transparent",
            color: "#d7c49e",
          }}
        >
          Send
        </motion.button>
      </div>
    </div>
  );
}
