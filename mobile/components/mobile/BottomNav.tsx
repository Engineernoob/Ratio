"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import {
  Home,
  BookOpen,
  Brain,
  MessageCircle,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { label: "Oikos", path: "/oikos", icon: Home },
  { label: "Bibliotheca", path: "/bibliotheca", icon: BookOpen },
  { label: "Memoria", path: "/memoria", icon: Brain },
  { label: "Mentor", path: "/mentor", icon: MessageCircle },
  { label: "Scholarivm", path: "/scholarivm", icon: GraduationCap },
];

export function BottomNav() {
  const pathname = usePathname();
  const { currentTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md"
      style={{
        background: `rgba(${
          currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
        }, 0.95)`,
        borderColor: `${currentTheme.accent}33`,
        boxShadow: `0 -2px 20px ${currentTheme.accent}15`,
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path === "/oikos" && pathname === "/") ||
            pathname?.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path === "/oikos" ? "/oikos" : item.path}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] relative"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive
                    ? currentTheme.accent
                    : `${currentTheme.accent}99`,
                }}
                transition={{ duration: 0.2 }}
              >
                <item.icon size={22} />
              </motion.div>
              <motion.span
                className="text-[10px] font-mono uppercase tracking-wider"
                animate={{
                  opacity: isActive ? 1 : 0.6,
                  color: isActive
                    ? currentTheme.accent
                    : `${currentTheme.accent}99`,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: currentTheme.accent }}
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
