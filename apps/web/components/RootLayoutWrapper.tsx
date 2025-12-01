"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { ThemeTextureLayer } from "@/components/theme/ThemeTextureLayer";
import { ThemeFogLayer } from "@/components/theme/ThemeFogLayer";
import { ThemeGrainLayer } from "@/components/theme/ThemeGrainLayer";
import { ThemeAmbientParticles } from "@/components/theme/ThemeAmbientParticles";

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentTheme } = useTheme();
  const isOikosPage = pathname === "/oikos";
  const isMemoriaPage = pathname === "/memoria";
  const isModern = currentTheme.isModern || false;
  const useSimpleLayout = isOikosPage || isMemoriaPage;

  return (
    <>
      {/* Theme Layers - Disabled to remove overlays */}
      {/* <ThemeTextureLayer /> */}
      {/* <ThemeFogLayer /> */}
      {/* <ThemeGrainLayer /> */}
      {/* <ThemeAmbientParticles /> */}
      {/* Modern theme overlays */}
      {/* {isModern && <ModernThemeOverlays theme={currentTheme} />} */}

      {/* Conditional layout structure */}
      {useSimpleLayout ? (
        children
      ) : (
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 flex min-w-0 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: currentTheme.transitions.page.duration,
                  ease: currentTheme.transitions.page.ease,
                }}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}

// Modern theme specific overlays
function ModernThemeOverlays({ theme }: { theme: any }) {
  if (theme.id === "SYNAPSE") {
    return (
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </motion.div>
    );
  }

  if (theme.id === "FERRO") {
    return (
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${theme.accent}08 2px,
              ${theme.accent}08 4px
            )`,
          }}
        />
      </motion.div>
    );
  }

  if (theme.id === "CHROMA") {
    return (
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.02) 1px,
              rgba(255, 255, 255, 0.02) 2px
            )`,
          }}
        />
      </motion.div>
    );
  }

  return null;
}
