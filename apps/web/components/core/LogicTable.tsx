"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogicTableRow {
  module: string;
  pattern: string;
  axiomata: string;
  status: string;
  statusType?: "ok" | "warn" | "note";
}

interface LogicTableProps {
  rows: LogicTableRow[];
  className?: string;
  delay?: number;
}

export function LogicTable({ rows, className, delay = 0 }: LogicTableProps) {
  const getStatusColor = (type?: string) => {
    switch (type) {
      case "ok":
        return "text-[rgba(255,255,255,0.7)]";
      case "warn":
        return "text-[#b29b68]";
      case "note":
        return "text-[rgba(255,255,255,0.5)]";
      default:
        return "text-[rgba(255,255,255,0.6)]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn("overflow-x-auto", className)}
    >
      <table className="w-full font-mono text-xs">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.05)]">
            <th className="text-left py-3 px-4 text-[rgba(255,255,255,0.5)] font-normal tracking-wider uppercase">
              MODVLE
            </th>
            <th className="text-left py-3 px-4 text-[rgba(255,255,255,0.5)] font-normal tracking-wider uppercase">
              PATTERN DETECTVM
            </th>
            <th className="text-left py-3 px-4 text-[rgba(255,255,255,0.5)] font-normal tracking-wider uppercase">
              AXIOMATA
            </th>
            <th className="text-left py-3 px-4 text-[rgba(255,255,255,0.5)] font-normal tracking-wider uppercase">
              LOG STATUS
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
            >
              <td className="py-3 px-4 text-[rgba(255,255,255,0.7)]">
                {row.module}
              </td>
              <td className="py-3 px-4 text-[rgba(255,255,255,0.7)]">
                {row.pattern}
              </td>
              <td className="py-3 px-4 text-[rgba(255,255,255,0.6)]">
                {row.axiomata}
              </td>
              <td className={cn("py-3 px-4", getStatusColor(row.statusType))}>
                {row.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
