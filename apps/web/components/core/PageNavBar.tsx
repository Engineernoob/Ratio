"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PageNavBar() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-[rgba(255,255,255,0.08)] pb-3 mb-8">
      <div className="flex items-center justify-between font-mono text-xs text-[rgba(232,230,225,0.6)]">
        <div className="flex items-center gap-2">
          <Link
            href="/oikos"
            className="hover:text-[rgba(232,230,225,0.9)] transition-colors"
          >
            RATIO @ OIKOS
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/oikos"
            className={cn(
              "transition-colors",
              pathname === "/oikos" && "text-[#b29b68]"
            )}
          >
            OIKOS
          </Link>
          <Link
            href="/bibliotheca"
            className={cn(
              "transition-colors",
              pathname?.startsWith("/bibliotheca") && "text-[#b29b68]"
            )}
          >
            BIBLIOTHECA
          </Link>
          <Link
            href="/laboratorivm"
            className={cn(
              "transition-colors",
              pathname === "/laboratorivm" && "text-[#b29b68]"
            )}
          >
            LABORATORIVM
          </Link>
          <Link
            href="/memoria"
            className={cn(
              "transition-colors",
              pathname === "/memoria" && "text-[#b29b68]"
            )}
          >
            MEMORIA
          </Link>
          <Link
            href="/archivvm"
            className={cn(
              "transition-colors",
              pathname === "/archivvm" && "text-[#b29b68]"
            )}
          >
            ARCHIVVM
          </Link>
          <Link
            href="/scholarivm"
            className={cn(
              "transition-colors",
              pathname === "/scholarivm" && "text-[#b29b68]"
            )}
          >
            SCHOLARIUM
          </Link>
          <Link
            href="/ars-rationis"
            className={cn(
              "transition-colors",
              pathname === "/ars-rationis" && "text-[#b29b68]"
            )}
          >
            ARS RATIONIS
          </Link>
        </div>
      </div>
    </div>
  );
}
