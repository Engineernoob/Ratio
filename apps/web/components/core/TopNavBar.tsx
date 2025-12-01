"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import "./topnav.css";

const navItems = [
  { label: "RATIO", path: "/" },
  { label: "OIKOS", path: "/oikos" },
  { label: "BIBLIOTHECA", path: "/bibliotheca" },
  { label: "LABORATORIVM", path: "/laboratorivm" },
  { label: "MEMORIA", path: "/memoria" },
  { label: "ARCHIVVM", path: "/archivvm" },
  { label: "SCHOLARIVM", path: "/scholarivm" },
  { label: "ARS RATIONIS", path: "/ars-rationis" },
];

export function TopNavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="topnav">
        <div className="topnav__inner">
          <div className="flex items-center justify-between gap-6">
            <Link href="/oikos" className="topnav__logo">
              RATIO
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {navItems.slice(1).map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`topnav__link ${isActive ? "is-active" : ""}`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="topnav__underline"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <button
              className="topnav__mobile-btn md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-[#0e0e0e] border-l border-[rgba(255,255,255,0.05)] z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href="/oikos"
                    className="font-serif text-lg text-[#f4f3ef] tracking-[0.12em]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    RATIO
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#7d7d7d] hover:text-[#f4f3ef] transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {navItems.slice(1).map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block font-serif text-sm tracking-wide transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-[#7d7d7d] hover:text-[#f4f3ef]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
