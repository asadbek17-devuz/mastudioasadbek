"use client";

import { ArrowUp } from "lucide-react";
import { useT } from "@/lib/i18n";

export function BackToTop() {
  const t = useT();
  const onClick = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group -mr-2 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-pill px-2 text-[13px] text-cream-50/70 hover:text-cream-50 transition-colors duration-200 ease-ios focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
    >
      {t.footer.backToTop}
      <ArrowUp
        className="size-3.5 transition-transform duration-300 ease-ios group-hover:-translate-y-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </button>
  );
}

export default BackToTop;
