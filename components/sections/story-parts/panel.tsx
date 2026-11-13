import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small dark window (editor or terminal) the chapter visuals are drawn in. */
export function Panel({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-xl border border-cream-50/10 bg-cream-50/[0.05] font-mono text-[12px] leading-relaxed text-cream-50/85 sm:text-[13px]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-cream-50/10 px-3 py-2">
        <span className="size-2 rounded-full bg-cream-50/20" />
        <span className="size-2 rounded-full bg-cream-50/20" />
        <span className="size-2 rounded-full bg-cream-50/20" />
        <span className="ml-2 truncate text-[11px] text-cream-50/45">{title}</span>
      </div>
      <div className="px-3.5 py-3 sm:px-4 sm:py-3.5">{children}</div>
    </div>
  );
}

export default Panel;
