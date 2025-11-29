"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export function MobileNavBar() {
  const pathname = usePathname();
  const { currentTheme } = useTheme();

  const navItems = [
    { label: "OIKOS", path: "/oikos", icon: "🏛️" },
    { label: "BIBLIOTHECA", path: "/bibliotheca", icon: "📚" },
    { label: "MEMORIA", path: "/memoria", icon: "🧠" },
    { label: "MENTOR", path: "/mentor", icon: "👤" },
    { label: "SCHOLARIUM", path: "/scholarivm", icon: "🎓" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm"
      style={{
        background: `rgba(${
          currentTheme.background === "#000000" ? "0,0,0" : "10,10,10"
        }, 0.9)`,
        borderColor: `${currentTheme.accent}33`,
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/oikos" className="flex items-center gap-2">
            <span
              className="font-serif text-lg"
              style={{ color: currentTheme.accent }}
            >
              RATIO
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {navItems.slice(0, 3).map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path === "/oikos" && pathname === "/");
              return (
                <Link
                  key={item.path}
                  href={item.path === "/oikos" ? "/oikos" : item.path}
                  className={cn(
                    "px-2 py-1 text-xs transition-colors",
                    isActive ? "opacity-100" : "opacity-60"
                  )}
                  style={{
                    color: isActive
                      ? currentTheme.accent
                      : `${currentTheme.accent}99`,
                  }}
                >
                  {item.icon}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
