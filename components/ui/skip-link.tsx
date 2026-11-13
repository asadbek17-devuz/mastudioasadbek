"use client";

import { useT } from "@/lib/i18n";

/** First focusable element of the page: hidden until focused, jumps past the header. */
export function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main"
      className="sr-only rounded-pill bg-ink px-5 py-3 text-sm font-medium text-cream shadow-lift focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[110] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none"
    >
      {t.nav.skip}
    </a>
  );
}
