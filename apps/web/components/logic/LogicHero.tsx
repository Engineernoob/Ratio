"use client";

import { motion } from "framer-motion";

export function LogicHero() {
  return (
    <div className="logic-hero">
      <div className="logic-hero__layers">
        <div className="logic-hero__fog" />
        <div className="logic-hero__dust" />
        <div className="logic-hero__sigil" />
      </div>

      <motion.div
        className="logic-hero__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="logic-kicker">Monochrome Logic Forge</p>
        <h1 className="logic-engraved">ARS RATIONIS</h1>
        <p className="logic-subtitle">
          Tools, circuits, and glass to temper arguments into crystalline form.
        </p>
        <div className="logic-hero__bar" />
      </motion.div>
    </div>
  );
}
