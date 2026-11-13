"use client";

import type { PointerEvent } from "react";
import { BackdropMark } from "@/components/sections/footer-parts/backdrop-mark";
import { BackToTop } from "@/components/sections/footer-parts/back-to-top";
import { ArrowSwap } from "@/components/sections/shared/hover";
import { LogoMark } from "@/components/ui/logo";
import { STUDIO_URL } from "@/lib/data";
import { useData, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const focusDark =
  "focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none";

/** Feeds the cursor position (-1..1) to the backdrop mark; mouse only, never with reduced motion. */
function trackPointer(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== "mouse") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty(
    "--mx",
    (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3),
  );
  el.style.setProperty(
    "--my",
    (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3),
  );
}

function resetPointer(e: PointerEvent<HTMLDivElement>) {
  e.currentTarget.style.setProperty("--mx", "0");
  e.currentTarget.style.setProperty("--my", "0");
}

export function Footer() {
  const year = new Date().getFullYear();
  const t = useT().footer;
  const { navItems, profile } = useData();

  // Clearing the fixed bottom tab bar on phones is the header's job (body
  // padding-bottom below 768px), so the footer only keeps its own small gap.
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6 sm:pb-6">
      <div
        onPointerMove={trackPointer}
        onPointerLeave={resetPointer}
        className="relative isolate overflow-hidden rounded-card border border-ink bg-ink text-cream-50 shadow-soft"
      >
        <BackdropMark />

        {/* Brand + CTA */}
        <div className="flex flex-col gap-6 p-5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-8 sm:pb-5 lg:p-10 lg:pb-6">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2.5">
              <LogoMark className="h-5 w-auto shrink-0 text-sage" />
              <span className="text-[13px] font-semibold tracking-[0.22em] text-cream-50 uppercase">
                {profile.name}
              </span>
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {t.facts.map((fact) => (
                <li
                  key={fact}
                  className="rounded-pill border border-cream-50/15 px-3 py-1 text-[13px] leading-5 whitespace-nowrap text-cream-50/75"
                >
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener"
            className={cn(
              "group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-pill bg-cream-50 px-5 py-2.5 text-sm font-medium text-ink transition-[background-color,scale] duration-300 ease-ios hover:bg-sage active:scale-[0.97] motion-reduce:transition-none sm:self-auto",
              focusDark,
            )}
          >
            {t.ctaLink}
            <ArrowSwap />
          </a>
        </div>

        <div className="px-5 pb-5 sm:px-8 sm:pb-8 lg:px-10">
          {/* In-page nav */}
          <nav aria-label={t.navAria}>
            {/* Phones: an even 3-column grid (two tidy rows) instead of a ragged wrap. */}
            <ul className="-mx-2 grid grid-cols-[repeat(3,auto)] justify-between gap-x-1 sm:flex sm:flex-wrap sm:justify-start">
              {navItems.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={cn(
                        "flex min-h-11 items-center rounded-pill px-2 text-sm whitespace-nowrap text-cream-50/70 transition-colors duration-200 ease-ios hover:text-cream-50 sm:px-3 lg:min-h-9",
                        focusDark,
                      )}
                    >
                      {label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Meta row */}
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-cream-50/10 pt-5 text-[13px] text-cream-50/50">
            <p>
              © {year} {profile.name}
            </p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
