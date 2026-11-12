"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { MilestoneRow, railX } from "@/components/sections/journey-parts/milestone";
import { NextStep } from "@/components/sections/journey-parts/next-step";
import { useData, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/** Viewport line where the drawing tip sits and nodes light up. */
const TIP = "60%";

/**
 * Achievements roadmap.
 * - A rail runs down the center (lg) or the left edge (< lg).
 * - GSAP scrubs the accent fill along the rail as you scroll; each node fills
 *   with accent and pops when the tip passes it.
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

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fill = root.current?.querySelector<HTMLElement>("[data-journey-fill]");
        if (fill) {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: fill,
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
          gsap.set(lit, { autoAlpha: 0, scale: 0.4 });
          ScrollTrigger.create({
            trigger: node,
            start: `center ${TIP}`,
            invalidateOnRefresh: true,
            onEnter: () =>
              gsap.to(lit, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(2.4)",
                overwrite: true,
              }),
            onLeaveBack: () =>
              gsap.to(lit, {
                autoAlpha: 0,
                scale: 0.4,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true,
              }),
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="journey" ref={root} className="overflow-x-clip py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          {...t.journey.heading}
        />

        <div className="mt-8 sm:mt-16">
          <ol className="relative flex flex-col gap-4 sm:gap-6 lg:gap-4">
            {/* Rail: track + scroll-drawn fill, from the first node's center to the end of the list. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-5 bottom-0 w-0.5 overflow-hidden rounded-full bg-line lg:top-7",
                railX
              )}
            >
              <span
                data-journey-fill
                className="absolute inset-0 origin-top rounded-full bg-accent"
              />
            </span>

            {done.map((m, i) => (
              // Keyed by id, not text: GSAP holds these nodes, so a language change must not remount them.
              <MilestoneRow key={m.id} milestone={m} index={i} />
            ))}
          </ol>

          {next ? <NextStep milestone={next} index={done.length} /> : null}
        </div>
      </div>
    </section>
  );
}

export default Journey;
