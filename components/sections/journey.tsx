"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { MilestoneRow, railX } from "@/components/sections/journey-parts/milestone";
import { SnapCarousel } from "@/components/sections/shared/snap-carousel";
import { NextStep } from "@/components/sections/journey-parts/next-step";
import { useData, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/** Viewport line where the drawing tip sits and nodes light up. */
const TIP = "60%";

/** Node accent fill: hidden state, pop in, fade out. */
const LIT_OFF = { autoAlpha: 0, scale: 0.4 };
const LIT_IN = { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.4)", overwrite: true };
const LIT_OUT = { autoAlpha: 0, scale: 0.4, duration: 0.3, ease: "power2.out", overwrite: true };

/**
 * Achievements roadmap.
 * - A rail runs down the center (lg) or the left edge (< lg).
 * - GSAP scrubs the accent fill along the rail as you scroll; each node fills
 *   with accent and pops when the tip passes it.
 * - Phones: the milestones are a horizontal carousel and the same drawing is
 *   driven by its scroll position instead of the page scroll.
 * - Reduced motion / no JS: the rail is fully drawn and every node is lit.
 */
export function Journey() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const { journey } = useData();
  const done = journey.filter((m) => !m.upcoming);
  const next = journey.find((m) => m.upcoming);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 640+: the vertical road, drawn by the page scroll.
      mm.add("(min-width: 640px) and (prefers-reduced-motion: no-preference)", () => {
        const fill = root.current?.querySelector<HTMLElement>("[data-journey-fill]");
        if (fill) {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                // The track, not the fill: the fill is squashed to zero height by this very
                // tween, so measuring it gives start == end and the rail jumps to fully drawn.
                trigger: fill.parentElement,
                start: `top ${TIP}`,
                end: `bottom ${TIP}`,
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        gsap.utils.toArray<HTMLElement>("[data-journey-node]").forEach((node) => {
          const lit = node.querySelector<HTMLElement>("[data-journey-lit]");
          if (!lit) return;
          gsap.set(lit, { ...LIT_OFF });
          ScrollTrigger.create({
            trigger: node,
            start: `center ${TIP}`,
            invalidateOnRefresh: true,
            onEnter: () => gsap.to(lit, { ...LIT_IN }),
            onLeaveBack: () => gsap.to(lit, { ...LIT_OUT }),
          });
        });
      });

      // Phones: the same drawing, driven by the carousel's horizontal scroll. Each slide owns
      // the rail piece to the next node; a piece fills while you swipe towards that node and the
      // node lights up when its slide arrives.
      mm.add("(max-width: 639.98px) and (prefers-reduced-motion: no-preference)", () => {
        const scroller = root.current?.querySelector<HTMLElement>("[data-carousel]");
        if (!scroller) return;
        const slides = Array.from(scroller.children) as HTMLElement[];
        const segs = slides.map((s) => s.querySelector<HTMLElement>("[data-journey-seg]"));
        const lits = slides.map((s) => s.querySelector<HTMLElement>("[data-journey-lit]"));
        const state: (boolean | undefined)[] = [];
        let frame = 0;

        /** Scroll position as a fractional slide index (the last slides stop at the scroll end). */
        const progress = () => {
          const max = scroller.scrollWidth - scroller.clientWidth;
          if (max <= 0) return slides.length - 1;
          const x = Math.min(Math.max(scroller.scrollLeft, 0), max);
          const origin = slides[0].offsetLeft;
          const stops = slides.map((s) => Math.min(s.offsetLeft - origin, max));
          for (let i = stops.length - 2; i >= 0; i--) {
            if (x >= stops[i]) {
              const span = stops[i + 1] - stops[i];
              return span > 0 ? i + (x - stops[i]) / span : i + 1;
            }
          }
          return 0;
        };

        const update = (instant = false) => {
          frame = 0;
          const p = progress();
          segs.forEach((seg, i) => {
            if (seg) gsap.set(seg, { scaleX: Math.min(Math.max(p - i, 0), 1) });
          });
          lits.forEach((lit, i) => {
            const on = p >= i - 0.03;
            if (!lit || state[i] === on) return;
            state[i] = on;
            if (instant) gsap.set(lit, on ? { autoAlpha: 1, scale: 1 } : { ...LIT_OFF });
            else gsap.to(lit, on ? { ...LIT_IN } : { ...LIT_OUT });
          });
        };
        const onScroll = () => {
          if (!frame) frame = requestAnimationFrame(() => update());
        };

        update(true);
        scroller.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
          scroller.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          if (frame) cancelAnimationFrame(frame);
          // Back to the static, fully drawn state (what 640+ and reduced motion start from).
          const touched = [...segs, ...lits].filter((el): el is HTMLElement => Boolean(el));
          gsap.killTweensOf(touched);
          gsap.set(touched, { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="journey" aria-labelledby="journey-heading" ref={root} className="overflow-x-clip py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="journey-heading"
          {...t.journey.heading}
        />

        <div className="mt-8 sm:mt-16">
          {/* Phones: a horizontal snap carousel of milestones (each slide draws its own piece of
              the rail). From 640px: the vertical road with the scroll-drawn rail. */}
          <div className="relative sm:flex sm:flex-col sm:gap-6 lg:gap-4">
            {/* Rail: track + scroll-drawn fill, from the first node's center to the end of the list. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-5 bottom-0 w-0.5 overflow-hidden rounded-full bg-line max-sm:hidden lg:top-7",
                railX
              )}
            >
              <span
                data-journey-fill
                className="absolute inset-0 origin-top rounded-full bg-accent"
              />
            </span>

            <SnapCarousel as="ol">
              {done.map((m, i) => (
                // Keyed by id, not text: GSAP holds these nodes, so a language change must not remount them.
                <MilestoneRow key={m.id} milestone={m} index={i} last={i === done.length - 1} />
              ))}
            </SnapCarousel>
          </div>

          {next ? <NextStep milestone={next} index={done.length} /> : null}
        </div>
      </div>
    </section>
  );
}

export default Journey;
