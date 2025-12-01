"use client";

import type { ChapterContent as ChapterContentType } from "@/lib/books/types";

interface ChapterContentProps {
  chapter: ChapterContentType | null;
}

export function ChapterContent({ chapter }: ChapterContentProps) {
  if (!chapter) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ color: "rgba(200, 182, 141, 0.4)" }}
      >
        <p className="font-mono text-sm">Select a chapter to begin reading</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl mb-4" style={{ color: "#C8B68D" }}>
            {chapter.title}
          </h1>
        </div>

        {/* Summary */}
        <div
          className="p-6 rounded"
          style={{
            background: "rgba(49, 42, 29, 0.3)",
            border: "1px solid rgba(200, 182, 141, 0.1)",
          }}
        >
          <h2 className="font-serif text-lg mb-3" style={{ color: "#C8B68D" }}>
            Summary
          </h2>
          <p
            className="font-mono text-sm leading-relaxed opacity-80"
            style={{ color: "#C8B68D" }}
          >
            {chapter.summary}
          </p>
        </div>

        {/* Key Ideas */}
        {chapter.keyIdeas && chapter.keyIdeas.length > 0 && (
          <div>
            <h2
              className="font-serif text-lg mb-4"
              style={{ color: "#C8B68D" }}
            >
              Key Ideas
            </h2>
            <ul className="space-y-3">
              {chapter.keyIdeas.map((idea, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-4 rounded"
                  style={{
                    background: "rgba(49, 42, 29, 0.2)",
                    border: "1px solid rgba(200, 182, 141, 0.05)",
                  }}
                >
                  <span
                    className="font-mono text-xs mt-1 shrink-0"
                    style={{ color: "rgba(200, 182, 141, 0.5)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="font-mono text-sm leading-relaxed flex-1 opacity-80"
                    style={{ color: "#C8B68D" }}
                  >
                    {idea}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {chapter.examples && chapter.examples.length > 0 && (
          <div>
            <h2
              className="font-serif text-lg mb-4"
              style={{ color: "#C8B68D" }}
            >
              Examples
            </h2>
            <ul className="space-y-3">
              {chapter.examples.map((example, index) => (
                <li
                  key={index}
                  className="p-4 rounded"
                  style={{
                    background: "rgba(49, 42, 29, 0.2)",
                    border: "1px solid rgba(200, 182, 141, 0.05)",
                  }}
                >
                  <p
                    className="font-mono text-sm leading-relaxed opacity-80"
                    style={{ color: "#C8B68D" }}
                  >
                    {example}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exercises */}
        {chapter.exercises && chapter.exercises.length > 0 && (
          <div>
            <h2
              className="font-serif text-lg mb-4"
              style={{ color: "#C8B68D" }}
            >
              Exercises
            </h2>
            <ul className="space-y-3">
              {chapter.exercises.map((exercise, index) => (
                <li
                  key={index}
                  className="p-4 rounded"
                  style={{
                    background: "rgba(49, 42, 29, 0.2)",
                    border: "1px solid rgba(200, 182, 141, 0.05)",
                  }}
                >
                  <p
                    className="font-mono text-sm leading-relaxed opacity-80"
                    style={{ color: "#C8B68D" }}
                  >
                    {exercise}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reflections */}
        {chapter.reflections && chapter.reflections.length > 0 && (
          <div>
            <h2
              className="font-serif text-lg mb-4"
              style={{ color: "#C8B68D" }}
            >
              Reflections
            </h2>
            <ul className="space-y-3">
              {chapter.reflections.map((reflection, index) => (
                <li
                  key={index}
                  className="p-4 rounded italic"
                  style={{
                    background: "rgba(49, 42, 29, 0.2)",
                    border: "1px solid rgba(200, 182, 141, 0.05)",
                  }}
                >
                  <p
                    className="font-mono text-sm leading-relaxed opacity-80"
                    style={{ color: "#C8B68D" }}
                  >
                    {reflection}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
