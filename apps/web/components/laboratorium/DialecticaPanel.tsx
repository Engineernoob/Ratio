"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FogPanel } from "@/components/core/FogPanel";
import { OrangeAction } from "@/components/core/OrangeAction";
import { cn } from "@/lib/utils";

interface DialecticaPanelProps {
  className?: string;
  delay?: number;
}

export function DialecticaPanel({
  className,
  delay = 0,
}: DialecticaPanelProps) {
  const [response, setResponse] = useState("");

  const handleSubmit = () => {
    // TODO: Implement submission logic
    console.log("Dialectical response:", response);
  };

  return (
    <FogPanel className={cn("p-6", className)} delay={delay} hover={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        <div className="mb-4">
          <h3 className="font-serif text-sm uppercase tracking-[0.14em] engraved-text mb-2">
            DIALECTICA — SOCRATIC PRACTICE
          </h3>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.14em]">
            DAILY QVAESTIO • INTERIOR DIALOGVS
          </p>
        </div>

        <div className="mb-4 space-y-3">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.14em]">
            HODIERNVM INTERROGATVM
          </p>
          <p className="font-mono text-xs text-foreground leading-relaxed">
            What belief did you not test today, and what would it cost you if it
            remains unexamined?
          </p>
        </div>

        <div className="mb-4">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your counter-arguments, objections, and steelman here. No formatting, only clarity."
            className="w-full h-32 px-3 py-2 bg-background border border-border font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors resize-none"
          />
        </div>

        <OrangeAction
          onClick={handleSubmit}
          className="w-full uppercase tracking-[0.14em]"
        >
          SVBMETTE DIALECTICVM
        </OrangeAction>
      </motion.div>
    </FogPanel>
  );
}
