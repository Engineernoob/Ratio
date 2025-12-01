"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrangeAction } from "./OrangeAction";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function ExpandableText({
  text,
  maxLength = 100,
  className,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? text : `${text.substring(0, maxLength)}...`;

  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={isExpanded ? "expanded" : "collapsed"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {displayText}
        </motion.span>
      </AnimatePresence>
      <OrangeAction
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs"
        active={false}
      >
        {isExpanded ? "Show Less" : "Read More"}
      </OrangeAction>
    </div>
  );
}

