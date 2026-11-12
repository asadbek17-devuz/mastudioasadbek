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
      className="group inline-flex min-h-11 items-center gap-2 self-start rounded-pill border border-cream-50/15 bg-cream-50/5 px-4 py-2 text-sm font-medium text-cream-50 sm:self-auto transition-[background-color,border-color,scale] duration-300 ease-ios hover:border-cream-50/30 hover:bg-cream-50/10 focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none active:scale-[0.97]"
    >
      {t.footer.backToTop}
      <ArrowUp
        className="size-4 transition-transform duration-300 ease-ios group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </button>
  );
}

export default BackToTop;
