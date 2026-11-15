"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";

import { gsap } from "@/components/sections/shared/scroll-fx";

/**
 * Scrubbed parallax for the hero (640px and up, motion allowed).
 *
 * - every `[data-drift="<px>"]` wrapper slides by that many px (negative = up)
 *   while the hero scrolls out, so the parts move a little against each other;
 * - `[data-hero-content]` fades and shrinks slightly over the last 45%.
 *
 * Everything starts from the resting layout (progress 0 at the top of the page),
 * and GSAP only touches these wrappers, never the Framer Motion nodes inside.
 */
export function useHeroScrollFx(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 640px) and (prefers-reduced-motion: no-preference)", () => {
        const section = scope.current;
        if (!section) return;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-drift]", section).forEach((el) => {
          const amount = Number(el.dataset.drift) || 0;
          if (amount) timeline.fromTo(el, { y: 0 }, { y: amount, duration: 1 }, 0);
        });

        timeline.fromTo(
          "[data-hero-content]",
          { opacity: 1, scale: 1 },
          { opacity: 0.55, scale: 0.975, duration: 0.45, transformOrigin: "50% 0%" },
          0.55
        );
      });
      return () => mm.revert();
    },
    { scope }
  );
}
