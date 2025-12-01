"use client";

import { motion } from "framer-motion";
import { DustParticles } from "./DustParticles";
import { FloatingLight } from "./FloatingLight";
import { BookHotspot } from "./BookHotspot";

interface BookHotspotData {
  bookId: string;
  label?: string;
  area: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface BibliothecaShelfProps {
  hotspots: BookHotspotData[];
}

export function BibliothecaShelf({ hotspots }: BibliothecaShelfProps) {
  return (
    <div className="relative w-full min-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/alexandria-shelf.jpg')",
        }}
      />

      {/* Dark Vignette Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%),
            linear-gradient(to left, rgba(0,0,0,0.3) 0%, transparent 30%),
            linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 30%)
          `,
        }}
      />

      {/* Grain/Dither Texture Overlay - Heavy grain for ancient feel */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: "url('/images/textures/texture_bayer.png')",
          backgroundSize: "128px 128px",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Dust Particles */}
      <DustParticles />

      {/* Floating Light (Candle Glow) */}
      <FloatingLight />

      {/* Three Brass Category Plaques */}
      <div className="absolute inset-0 pointer-events-none">
        {/* PHILOSOPHIA • CLASSICA */}
        <motion.div
          className="absolute"
          style={{
            left: "15%",
            top: "8%",
            transform: "translateX(-50%)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            className="relative px-6 py-3 font-serif text-sm tracking-wider text-[#b29b68] uppercase"
            style={{
              textShadow: `
                0 1px 0 rgba(0,0,0,0.8),
                0 -1px 0 rgba(255,255,255,0.1),
                0 0 10px rgba(178, 155, 104, 0.3),
                inset 0 1px 2px rgba(0,0,0,0.5),
                inset 0 -1px 1px rgba(255,255,255,0.1)
              `,
              letterSpacing: "0.15em",
            }}
            whileHover={{
              color: "#d4af37",
              textShadow: `
                0 1px 0 rgba(0,0,0,0.8),
                0 -1px 0 rgba(255,255,255,0.15),
                0 0 15px rgba(212, 175, 55, 0.5),
                inset 0 1px 2px rgba(0,0,0,0.5),
                inset 0 -1px 1px rgba(255,255,255,0.15)
              `,
            }}
          >
            PHILOSOPHIA • CLASSICA
            <motion.div
              className="absolute inset-0 rounded-sm pointer-events-auto cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(178, 155, 104, 0.15) 0%, rgba(178, 155, 104, 0.05) 50%, rgba(178, 155, 104, 0.1) 100%)",
                border: "1px solid rgba(178, 155, 104, 0.2)",
                boxShadow: `
                  inset 0 2px 4px rgba(0,0,0,0.4),
                  inset 0 -1px 2px rgba(255,255,255,0.1),
                  0 2px 8px rgba(0,0,0,0.3)
                `,
                borderRadius: "2px",
              }}
              whileHover={{
                background:
                  "linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 50%, rgba(212, 175, 55, 0.15) 100%)",
                borderColor: "rgba(212, 175, 55, 0.4)",
                boxShadow: `
                  inset 0 2px 4px rgba(0,0,0,0.4),
                  inset 0 -1px 2px rgba(255,255,255,0.2),
                  0 2px 12px rgba(212, 175, 55, 0.4),
                  0 0 20px rgba(212, 175, 55, 0.2)
                `,
              }}
            />
          </motion.div>
        </motion.div>

        {/* RHETORICA */}
        <motion.div
          className="absolute"
          style={{
            left: "50%",
            top: "8%",
            transform: "translateX(-50%)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            className="relative px-6 py-3 font-serif text-sm tracking-wider text-[#b29b68] uppercase"
            style={{
              textShadow: `
                0 1px 0 rgba(0,0,0,0.8),
                0 -1px 0 rgba(255,255,255,0.1),
                0 0 10px rgba(178, 155, 104, 0.3),
                inset 0 1px 2px rgba(0,0,0,0.5),
                inset 0 -1px 1px rgba(255,255,255,0.1)
              `,
              letterSpacing: "0.15em",
            }}
            whileHover={{
              color: "#d4af37",
              textShadow: `
                0 1px 0 rgba(0,0,0,0.8),
                0 -1px 0 rgba(255,255,255,0.15),
                0 0 15px rgba(212, 175, 55, 0.5),
                inset 0 1px 2px rgba(0,0,0,0.5),
                inset 0 -1px 1px rgba(255,255,255,0.15)
              `,
            }}
          >
            RHETORICA
            <motion.div
              className="absolute inset-0 rounded-sm pointer-events-auto cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(178, 155, 104, 0.15) 0%, rgba(178, 155, 104, 0.05) 50%, rgba(178, 155, 104, 0.1) 100%)",
                border: "1px solid rgba(178, 155, 104, 0.2)",
                boxShadow: `
                  inset 0 2px 4px rgba(0,0,0,0.4),
                  inset 0 -1px 2px rgba(255,255,255,0.1),
                  0 2px 8px rgba(0,0,0,0.3)
                `,
                borderRadius: "2px",
              }}
              whileHover={{
                background:
                  "linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 50%, rgba(212, 175, 55, 0.15) 100%)",
                borderColor: "rgba(212, 175, 55, 0.4)",
                boxShadow: `
                  inset 0 2px 4px rgba(0,0,0,0.4),
                  inset 0 -1px 2px rgba(255,255,255,0.2),
                  0 2px 12px rgba(212, 175, 55, 0.4),
                  0 0 20px rgba(212, 175, 55, 0.2)
                `,
              }}
            />
          </motion.div>
        </motion.div>

        {/* HISTORIA */}
        <motion.div
          className="absolute"
          style={{
            left: "85%",
            top: "8%",
            transform: "translateX(-50%)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            className="relative px-6 py-3 font-serif text-sm tracking-wider text-[#b29b68] uppercase"
            style={{
              textShadow: `
                0 1px 0 rgba(0,0,0,0.8),
                0 -1px 0 rgba(255,255,255,0.1),
                0 0 10px rgba(178, 155, 104, 0.3),
                inset 0 1px 2px rgba(0,0,0,0.5),
                inset 0 -1px 1px rgba(255,255,255,0.1)
              `,
              letterSpacing: "0.15em",
            }}
            whileHover={{
              color: "#d4af37",
              textShadow: `
                0 1px 0 rgba(0,0,0,0.8),
                0 -1px 0 rgba(255,255,255,0.15),
                0 0 15px rgba(212, 175, 55, 0.5),
                inset 0 1px 2px rgba(0,0,0,0.5),
                inset 0 -1px 1px rgba(255,255,255,0.15)
              `,
            }}
          >
            HISTORIA
            <motion.div
              className="absolute inset-0 rounded-sm pointer-events-auto cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(178, 155, 104, 0.15) 0%, rgba(178, 155, 104, 0.05) 50%, rgba(178, 155, 104, 0.1) 100%)",
                border: "1px solid rgba(178, 155, 104, 0.2)",
                boxShadow: `
                  inset 0 2px 4px rgba(0,0,0,0.4),
                  inset 0 -1px 2px rgba(255,255,255,0.1),
                  0 2px 8px rgba(0,0,0,0.3)
                `,
                borderRadius: "2px",
              }}
              whileHover={{
                background:
                  "linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 50%, rgba(212, 175, 55, 0.15) 100%)",
                borderColor: "rgba(212, 175, 55, 0.4)",
                boxShadow: `
                  inset 0 2px 4px rgba(0,0,0,0.4),
                  inset 0 -1px 2px rgba(255,255,255,0.2),
                  0 2px 12px rgba(212, 175, 55, 0.4),
                  0 0 20px rgba(212, 175, 55, 0.2)
                `,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Book Hotspots */}
      <div className="absolute inset-0">
        {hotspots.map((hotspot, index) => (
          <BookHotspot
            key={`${hotspot.bookId}-${index}`}
            bookId={hotspot.bookId}
            label={hotspot.label}
            area={hotspot.area}
          />
        ))}
      </div>

      {/* Additional atmospheric overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)",
        }}
      />
    </div>
  );
}
