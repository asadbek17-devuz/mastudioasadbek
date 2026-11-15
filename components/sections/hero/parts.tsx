"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { ArrowSwap, focusRing } from "@/components/sections/shared/hover";
import { LogoMark } from "@/components/ui/logo";
import { STUDIO_URL } from "@/lib/data";
import { useData, useT } from "@/lib/i18n";
import { fadeIn, fadeUp } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * One entrance step: fades in and rises 16px (plain fade with reduced motion).
 * Inherits `hidden` / `show` from the staggering container in `hero.tsx`.
 */
export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={reduce ? fadeIn : fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Backdrop                                                            */
/* ------------------------------------------------------------------ */

/**
 * Section-level decoration: one soft green glow centered behind the headline.
 * The gradient itself runs out to transparent, so it has no edge and the hero
 * reads as part of the dotted page. The "//" watermark is site-wide (root layout).
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-[46%] left-1/2 aspect-[16/11] w-[max(150vw,48rem)] max-w-[96rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,var(--color-accent-soft),transparent)] opacity-75" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Greeting: logo chip and name, a small eyebrow over the headline     */
/* ------------------------------------------------------------------ */

export function Greeting() {
  const t = useT();
  const { profile } = useData();

  return (
    <p className="flex items-center justify-center gap-2.5 text-[15px] font-medium text-ink-soft sm:text-base">
      <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-cream-50">
        <LogoMark className="h-[46%] w-auto" />
      </span>
      <span className="min-w-0">
        {t.hero.greetingBefore}
        <span className="font-semibold text-ink">{profile.name}</span>
        {t.hero.greetingAfter}
      </span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

/**
 * Two actions, neither a stock pill:
 *
 * - primary: an ink disc with an arrow, the label standing bare next to it. On
 *   hover the disc spills out into a full pill behind the label (clip-path, so
 *   nothing reflows), the label turns cream and the arrow swings to point ahead;
 * - secondary: an editorial text link. A hairline sits under the label and an
 *   accent line draws over it from the left while the arrow swaps.
 *
 * Both are 48px tall on phones and 56px from 640px. Reduced motion gets the end
 * states without the travel (the global rule in globals.css zeroes transition durations).
 */
export function Actions() {
  const t = useT();
  const label = "font-heading text-[15px] font-semibold tracking-[-0.015em] whitespace-nowrap min-[400px]:text-base sm:text-lg";

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 [--disc:3rem] sm:gap-x-8 sm:[--disc:3.5rem]">
      <a
        href="#projects"
        className={cn(
          "group/cta relative isolate inline-flex h-[var(--disc)] items-center gap-2.5 rounded-pill pr-4 text-ink sm:gap-4 sm:pr-7",
          "transition-[color,scale] duration-500 ease-ios hover:text-cream-50 active:scale-[0.97]",
          label,
          focusRing
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-pill bg-ink transition-[clip-path] duration-500 ease-ios [clip-path:inset(0_calc(100%-var(--disc))_0_0_round_9999px)] group-hover/cta:[clip-path:inset(0_0_0_0_round_9999px)]"
        />
        <span aria-hidden="true" className="grid size-[var(--disc)] shrink-0 place-items-center text-cream-50">
          <ArrowUpRight className="size-5 transition-transform duration-500 ease-ios group-hover/cta:rotate-45" />
        </span>
        {t.hero.viewProjects}
      </a>

      <a
        href={STUDIO_URL}
        target="_blank"
        rel="noopener"
        className={cn(
          "group inline-flex h-[var(--disc)] items-center gap-1.5 rounded-sm text-ink transition-colors duration-300 ease-ios hover:text-accent sm:gap-2.5",
          label,
          focusRing
        )}
      >
        <span className="relative py-1.5">
          {t.hero.studioSite}
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ink/25" />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-ios group-hover:scale-x-100"
          />
        </span>
        <ArrowSwap className="size-4 sm:size-[1.125rem]" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Location: one small line of meta under the actions                  */
/* ------------------------------------------------------------------ */

/** Tiny tracked capitals, the framing text of the hero against the huge headline. */
export function Location() {
  const { profile } = useData();
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-muted uppercase sm:text-xs">
      <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-accent" />
      {profile.location}
    </p>
  );
}
