"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FogPanel } from "./FogPanel";
import { OrangeAction } from "./OrangeAction";
import Link from "next/link";

interface ScrollPreviewCardProps {
  title: string;
  author?: string;
  source?: string;
  summary: string;
  href?: string;
  categoryTags?: string[];
  className?: string;
  delay?: number;
}

export function ScrollPreviewCard({
  title,
  author,
  source,
  summary,
  href,
  categoryTags = [],
  className,
  delay = 0,
}: ScrollPreviewCardProps) {
  const Content = (
    <FogPanel className={cn("p-6", className)} delay={delay}>
      <div className="mb-4">
        <h3 className="font-serif text-lg uppercase tracking-widest engraved-text mb-2">
          {title}
        </h3>
        {(author || source) && (
          <p className="font-mono text-xs text-muted-foreground mb-3">
            {author && `${author}`}
            {author && source && " · "}
            {source && source}
          </p>
        )}
      </div>

      <p className="font-mono text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
        {summary}
      </p>

      {categoryTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryTags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-wider border border-border px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-border">
        <OrangeAction as="div" className="w-full text-center">
          {href ? "Open Scroll" : "View Details"}
        </OrangeAction>
      </div>
    </FogPanel>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {Content}
      </Link>
    );
  }

  return Content;
}
