import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: WrapperProps) {
  return (
    <div
      className={cn(
        "relative max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col gap-(--space-xl)",
        className
      )}
      style={{
        paddingTop: "var(--space-xxl)",
        paddingBottom: "var(--space-xxl)",
      }}
    >
      {children}
    </div>
  );
}

export function SectionWrapper({ children, className }: WrapperProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-6 border-b border-white/5 last:border-b-0",
        className
      )}
      style={{
        paddingTop: "var(--space-xl)",
        paddingBottom: "var(--space-xl)",
      }}
    >
      {children}
    </section>
  );
}

export function RightSidebarWrapper({ children, className }: WrapperProps) {
  return (
    <aside
      className={cn(
        "w-full flex justify-end",
        "md:sticky md:top-(--space-lg) md:self-end",
        className
      )}
      style={{ gap: "var(--space-md)" }}
    >
      <div className="w-full md:max-w-xs">{children}</div>
    </aside>
  );
}
