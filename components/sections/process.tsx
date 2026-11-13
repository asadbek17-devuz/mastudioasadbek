"use client";

import dynamic from "next/dynamic";
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { useRef, useState } from "react";
import { lastStage, stageAddress, stageIds } from "@/components/sections/process-parts/stages";
import { BrowserFrame, pad } from "@/components/sections/projects-parts/browser-frame";
import { focusRing } from "@/components/sections/shared/hover";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useT } from "@/lib/i18n";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Below the fold: the morphing screen and its slider load as their own chunks (still prerendered). */
const Scene = dynamic(() => import("@/components/sections/process-parts/scene").then((m) => m.Scene));
const Scrubber = dynamic(() => import("@/components/sections/process-parts/scrubber").then((m) => m.Scrubber));

const clamp = (i: number) => Math.min(lastStage, Math.max(0, i));

/**
 * "From idea to product": one product screen in a browser frame that morphs
 * through four stages (sketch, wireframe, code, live) as the visitor drags the
 * slider, clicks a stage or presses the arrow keys. Everything is driven by a
 * single motion value, `progress` (0..3); React only re-renders when the
 * nearest stage changes.
 */
export function Process() {
  const t = useT();
  const reduce = useReducedMotion() ?? false;
  const progress = useMotionValue(0);
  const [active, setActive] = useState(0);
  const target = useRef(0);
  const tween = useRef<AnimationPlaybackControls | null>(null);

  useMotionValueEvent(progress, "change", (v) => setActive(clamp(Math.round(v))));

  const goTo = (index: number) => {
    const next = clamp(index);
    target.current = next;
    tween.current?.stop();
    if (reduce) progress.set(next);
    else tween.current = animate(progress, next, { duration: 0.8, ease });
  };

  const scrub = (value: number) => {
    tween.current?.stop();
    target.current = Math.round(value);
    progress.set(value);
  };

  const activeId = stageIds[active];

  return (
    <section id="process" aria-labelledby="process-heading" className="overflow-x-clip py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading id="process-heading" {...t.process.heading} />

        <Reveal className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <div role="img" aria-label={t.process.frameAria}>
              <BrowserFrame
                address={stageAddress[activeId]}
                className="shadow-lift"
                screenClassName="@container aspect-[4/3]"
              >
                <div aria-hidden="true" className="absolute inset-0">
                  <Scene progress={progress} text={t.process.mock} live={active === lastStage} reduce={reduce} />
                </div>
              </BrowserFrame>
            </div>
            <div className="mt-3 sm:mt-4">
              <Scrubber
                progress={progress}
                active={active}
                label={t.process.sliderAria}
                valueText={t.process.stages[activeId].title}
                discrete={reduce}
                onScrub={scrub}
                onCommit={() => goTo(target.current)}
                onStep={(delta) => goTo(target.current + delta)}
                onJump={goTo}
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:col-span-5 lg:gap-8">
            {/* All four captions share one grid cell, so the height never jumps. */}
            <div className="grid">
              {stageIds.map((id, i) => (
                <div
                  key={id}
                  aria-hidden={i !== active}
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,translate] duration-500 ease-ios",
                    i === active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                  )}
                >
                  <p className="text-[13px] font-medium tracking-[0.16em] text-muted uppercase tabular-nums">
                    {pad(i)} / {pad(lastStage)}
                  </p>
                  <h3 className="mt-3 font-heading text-[clamp(1.75rem,1.4rem+1.6vw,2.25rem)] leading-tight font-semibold tracking-tight text-ink">
                    {t.process.stages[id].title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-pretty text-ink-soft sm:text-lg">
                    {t.process.stages[id].text}
                  </p>
                </div>
              ))}
            </div>

            <div role="group" aria-label={t.process.stagesAria} className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {stageIds.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={i === active}
                  onClick={() => goTo(i)}
                  className={cn(
                    "flex min-h-11 min-w-0 items-center gap-2.5 rounded-pill border px-4 py-2.5 text-left text-sm font-medium transition-[background-color,border-color,color,scale] duration-300 ease-ios active:scale-[0.97]",
                    focusRing,
                    i === active
                      ? "border-accent bg-accent text-cream-50 shadow-soft"
                      : "border-line bg-cream-50 text-ink-soft hover:border-ink/15 hover:text-ink"
                  )}
                >
                  <span className={cn("text-[13px] tabular-nums", i === active ? "text-cream-50/70" : "text-muted")}>
                    {pad(i)}
                  </span>
                  <span className="truncate">{t.process.stages[id].title}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Process;
