"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

/*
 * Shared GSAP ScrollTrigger effects for the sections.
 *
 * Rules every effect here follows:
 * - Transform / opacity only, always scrubbed (0.6 to 1s catch-up), never pinned.
 * - Runs inside `gsap.matchMedia()`: reduced motion gets no scroll effects at
 *   all, phones and tablets get lighter values or nothing.
 * - Start states are set by GSAP at runtime (`fromTo`), never in CSS, so the
 *   content is fully visible without JS or with reduced motion.
 * - GSAP owns its own wrapper element. Framer Motion reveals and hovers live
 *   on other elements, so the two never write the same property on one node.
 */

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  // iOS: the address bar showing/hiding must not re-measure and jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

const NO_PREFERENCE = "(prefers-reduced-motion: no-preference)";
const DESKTOP = "(min-width: 1024px)";

let refreshQueued = false;

/**
 * Re-measures every trigger once fonts and images have settled, then again
 * only if the page height changes later (lazy content, the loader leaving).
 * Module-level, so it is set up a single time for the whole page.
 */
function queueRefresh() {
  if (refreshQueued || typeof window === "undefined") return;
  refreshQueued = true;

  const loaded = new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
  const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

  Promise.all([loaded, fonts])
    .catch(() => undefined)
    .then(() => {
      ScrollTrigger.refresh();
      if (typeof ResizeObserver === "undefined") return;

      let height = document.documentElement.scrollHeight;
      const check = gsap
        .delayedCall(0.25, () => {
          const next = document.documentElement.scrollHeight;
          if (next === height) return;
          height = next;
          ScrollTrigger.refresh();
        })
        .pause();
      new ResizeObserver(() => check.restart(true)).observe(document.body);
    });
}

export interface ScrollFxContext {
  /** True from 1024px up. Use it to lighten or skip an effect on small screens. */
  isDesktop: boolean;
}

/**
 * Base hook: runs `setup` in a GSAP context scoped to `scope`, only when the
 * user allows motion, and again when the 1024px breakpoint is crossed.
 * Everything created in `setup` is reverted automatically (tweens, triggers,
 * inline styles). Return a function for any extra cleanup.
 */
export function useScrollFx(
  scope: RefObject<HTMLElement | null>,
  setup: (context: ScrollFxContext) => void | (() => void)
) {
  useGSAP(
    () => {
      queueRefresh();
      const mm = gsap.matchMedia();
      mm.add({ motion: NO_PREFERENCE, isDesktop: DESKTOP }, (context) => {
        const { motion, isDesktop } = context.conditions as { motion: boolean; isDesktop: boolean };
        if (!motion) return;
        return setup({ isDesktop });
      });
      return () => mm.revert();
    },
    { scope }
  );
}

interface FxProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Parallax layer for an `overflow-hidden`, positioned frame. Renders an
 * absolutely positioned layer that is taller than the frame by `amount` on
 * each side and scrubs it through that slack while the frame crosses the
 * viewport, so no edge is ever exposed. Phones use 60% of the travel.
 */
export function Parallax({ children, className, amount = 0.08 }: FxProps & { amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollFx(ref, ({ isDesktop }) => {
    const el = ref.current;
    const frame = el?.parentElement;
    if (!el || !frame) return;
    const travel = () => ((el.offsetHeight - frame.offsetHeight) / 2) * (isDesktop ? 1 : 0.6);

    gsap.fromTo(
      el,
      { y: () => -travel() },
      {
        y: () => travel(),
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  return (
    <div
      ref={ref}
      className={cn("absolute inset-x-0", className)}
      style={{ top: `${-amount * 100}%`, height: `${(1 + amount * 2) * 100}%` }}
    >
      {children}
    </div>
  );
}

/**
 * Desktop-only staggered drift. Every `<Lift amount>` inside moves from
 * `+amount` to `-amount` px while the whole group crosses the viewport, so
 * cards with different amounts slide a few pixels against each other. One
 * shared trigger keeps cards with the same amount perfectly aligned.
 */
export function LiftGroup({ children, className }: FxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollFx(ref, ({ isDesktop }) => {
    const group = ref.current;
    if (!isDesktop || !group) return;

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: group,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
    gsap.utils.toArray<HTMLElement>("[data-lift]", group).forEach((el) => {
      const amount = Number(el.dataset.lift) || 0;
      if (amount) timeline.fromTo(el, { y: amount }, { y: -amount }, 0);
    });
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** A member of a `LiftGroup`. `amount` is the drift in px (negative reverses it). */
export function Lift({ children, className, amount }: FxProps & { amount: number }) {
  return (
    <div data-lift={amount} className={className}>
      {children}
    </div>
  );
}

/**
 * Scales its content from `from` up to 1 while it enters the viewport
 * (scrubbed between "top hits the bottom edge" and "top at 60%"). Phones use
 * half of the scale difference.
 */
export function ScrubScale({ children, className, from = 0.96 }: FxProps & { from?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollFx(ref, ({ isDesktop }) => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { scale: isDesktop ? from : 1 - (1 - from) / 2 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "clamp(top 60%)",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
