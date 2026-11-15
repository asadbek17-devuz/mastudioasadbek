"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { lastStage, stageIds } from "@/components/sections/process-parts/stages";
import { pad } from "@/components/sections/projects-parts/browser-frame";
import { gsap, useScrollFx } from "@/components/sections/shared/scroll-fx";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Below the fold: the morphing screens load as their own chunks (still prerendered). */
const StageFrame = dynamic(() => import("@/components/sections/process-parts/stage-frame").then((m) => m.StageFrame));
const StepVisual = dynamic(() => import("@/components/sections/process-parts/step-visual").then((m) => m.StepVisual));

/** Fraction of the scroll track spent morphing; the rest holds on the finished product. */
const MORPH = 0.88;
/** Distance from the top of the viewport where the stage sticks (clears the fixed header). */
const STICK_TOP = 96;

const clamp = (i: number) => Math.min(lastStage, Math.max(0, i));

/**
 * "From idea to product": one product screen that turns from a paper sketch into a
 * launched product in four steps (sketch, design, code, launch).
 *
 * - lg+ with motion allowed: the steps and one shared screen stick while a tall track
 *   scrolls by, and the scroll position drives a single motion value, `progress` (0..3).
 *   The class pair `lg:motion-safe:*` and `useScrollFx` switch on the same two conditions.
 *   On a short screen the four steps are taller than the room under the header, so the
 *   column is capped to that room and the list slides up a notch with every step: the
 *   active step is always fully on screen.
 * - Phones, tablets and reduced motion: nothing sticks. Every step carries its own screen,
 *   which plays its change once when it enters the viewport (or just rests at its stage).
 *
 * The markup is an ordered list of steps either way, so it reads the same without motion.
 */
export function Process() {
  const t = useT();
  const reduce = useReducedMotion() ?? false;
  const track = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const fill = useTransform(progress, (v) => (v + 1) / stageIds.length);
  const [active, setActive] = useState(0);

  // How much taller the step list is than its (height-capped) column while stuck; 0 when it fits
  // or when nothing sticks.
  const column = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [spare, setSpare] = useState(0);

  useEffect(() => {
    const box = column.current;
    const inner = list.current;
    if (!box || !inner) return;
    const measure = () => setSpare(Math.max(0, inner.offsetHeight - box.clientHeight));
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(progress, "change", (v) => setActive(clamp(Math.round(v))));

  useScrollFx(track, ({ isDesktop }) => {
    const el = track.current;
    const pin = sticky.current;
    if (!isDesktop || !el || !pin) return;

    const state = { v: 0 };
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: `top ${STICK_TOP}px`,
          end: () => `+=${Math.max(1, el.offsetHeight - pin.offsetHeight)}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      .to(state, { v: lastStage, duration: MORPH, onUpdate: () => progress.set(state.v) })
      .to({}, { duration: 1 - MORPH });

    return () => progress.set(0);
  });

  return (
    <section id="process" aria-labelledby="process-heading" className="overflow-x-clip py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading id="process-heading" {...t.process.heading} />

        <div ref={track} className="mt-10 sm:mt-16 lg:motion-safe:h-[480vh]">
          <div
            ref={sticky}
            className="lg:motion-safe:sticky lg:motion-safe:top-24 lg:motion-safe:grid lg:motion-safe:grid-cols-12 lg:motion-safe:items-center lg:motion-safe:gap-12"
          >
            {/* 7.5rem: the 96px the stage sticks at plus 24px of air above the bottom edge. */}
            <div
              ref={column}
              className="min-w-0 lg:motion-safe:col-span-5 lg:motion-safe:max-h-[calc(100svh-7.5rem)] lg:motion-safe:overflow-hidden"
            >
              <div
                ref={list}
                style={spare ? { transform: `translateY(${-(active / lastStage) * spare}px)` } : undefined}
                className="relative transition-transform duration-500 ease-ios"
              >
                {/* Progress line: a hairline that fills with accent green down to the active step. */}
                <span aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-px bg-line lg:motion-safe:block">
                  <motion.span style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-accent" />
                </span>

                <ol className="grid gap-12 sm:grid-cols-2 sm:gap-x-8 lg:motion-safe:grid-cols-1 lg:motion-safe:grid-rows-4 lg:motion-safe:gap-0">
                  {stageIds.map((id, i) => (
                    <li
                      key={id}
                      aria-current={i === active ? "step" : undefined}
                      className={cn(
                        "min-w-0 transition-opacity duration-500 ease-ios lg:motion-safe:py-4 lg:motion-safe:pl-7",
                        i !== active && "lg:motion-safe:opacity-45"
                      )}
                    >
                      <p
                        className={cn(
                          "text-[13px] font-medium tracking-[0.16em] text-muted uppercase tabular-nums transition-colors duration-500 ease-ios",
                          i === active && "lg:motion-safe:text-accent"
                        )}
                      >
                        {pad(i)} / {pad(lastStage)}
                      </p>
                      <h3 className="mt-2 font-heading text-2xl leading-tight font-semibold tracking-tight text-ink">
                        {t.process.stages[id].title}
                      </h3>
                      <p className="mt-2 max-w-md leading-relaxed text-pretty text-ink-soft">{t.process.stages[id].text}</p>

                      <Reveal className="mt-5 lg:motion-safe:hidden">
                        <StepVisual index={i} text={t.process.mock} reduce={reduce} />
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* The shared screen. Its width also follows the viewport height, so it always fits while stuck. */}
            <div className="mx-auto hidden w-full max-w-[calc((100svh-11rem)*1.3)] min-w-0 lg:motion-safe:col-span-7 lg:motion-safe:block">
              <StageFrame progress={progress} stage={active} live={active === lastStage} text={t.process.mock} reduce={reduce} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;
