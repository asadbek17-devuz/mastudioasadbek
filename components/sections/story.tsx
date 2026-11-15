"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { ReactNode } from "react";
import { pad } from "@/components/sections/projects-parts/browser-frame";
import {
  chapterCount,
  chapterIds,
  outroIndex,
  type ChapterId,
} from "@/components/sections/story-parts/chapters";
import { Controls } from "@/components/sections/story-parts/controls";
import { Outro } from "@/components/sections/story-parts/outro";
import { ProgressBars } from "@/components/sections/story-parts/progress-bars";
import { Scene, sceneVariants } from "@/components/sections/story-parts/scene";
import { useStoryPlayer } from "@/components/sections/story-parts/use-story-player";
import { NaviVisual, StartVisual, TodayVisual } from "@/components/sections/story-parts/visuals-code";
import { CommitsVisual, StudioVisual, TeachingVisual } from "@/components/sections/story-parts/visuals-draw";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { STUDIO_URL } from "@/lib/data";
import { format, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const studioAddress = STUDIO_URL.replace(/^https?:\/\//, "");

/**
 * "About me in a minute": a short film made of code. Six typographic chapters play
 * one after another on a dark screen, stories-style, and end on a closing frame.
 * All chapters stay in the DOM (stacked in one grid cell), so the text is
 * indexable and the screen never changes height.
 */
export function Story() {
  const t = useT();
  const reduce = useReducedMotion() ?? false;
  const { index, progress, started, userPaused, togglePause, step, replay, screenProps } = useStoryPlayer(reduce);

  const s = t.story;
  const ended = index === outroIndex;
  const current = Math.min(index, chapterCount - 1);
  const currentTitle = ended
    ? t.profile.name
    : `${s.chapters[chapterIds[current]].title} ${s.chapters[chapterIds[current]].accent}`;
  const valueText = format(s.progressText, { n: current + 1, total: chapterCount, title: currentTitle });

  const visual = (id: ChapterId, active: boolean): ReactNode => {
    switch (id) {
      case "start":
        return <StartVisual active={active} reduce={reduce} hello={s.visual.hello} />;
      case "marsIntern":
        return <CommitsVisual steps={s.visual.steps} />;
      case "navi":
        return <NaviVisual active={active} reduce={reduce} />;
      case "studio":
        return <StudioVisual name={t.nav.cta} address={studioAddress} />;
      case "teaching":
        return <TeachingVisual mentor={s.visual.mentor} student={s.visual.student} />;
      case "today":
        return <TodayVisual active={active} reduce={reduce} chips={s.visual.chips} />;
    }
  };

  const layer = (i: number) => {
    const active = started && i === index;
    return {
      active,
      props: {
        "aria-hidden": !active,
        inert: !active,
        custom: i < index ? -1 : 1,
        variants: sceneVariants,
        initial: false as const,
        animate: active ? "show" : "hidden",
        className: cn("col-start-1 row-start-1 min-h-0 min-w-0", !active && "pointer-events-none"),
      },
    };
  };
  const outro = layer(outroIndex);

  return (
    <section id="story" aria-labelledby="story-heading" className="overflow-x-clip py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading id="story-heading" {...s.heading} />

        <Reveal className="mt-10 sm:mt-16">
          <div
            {...screenProps}
            role="region"
            aria-label={s.playerAria}
            tabIndex={0}
            className={cn(
              "relative isolate flex aspect-[4/5] min-h-[31rem] w-full touch-pan-y flex-col overflow-hidden rounded-[1.75rem] border border-ink bg-ink p-5 text-cream-50 shadow-lift select-none sm:aspect-video sm:min-h-0 sm:p-8 lg:p-10",
              "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-cream focus-visible:outline-none"
            )}
          >
            {/* Backdrop: a green glow and the brand mark as a quiet watermark. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -right-1/4 -bottom-1/2 aspect-square w-[85%] rounded-full bg-[radial-gradient(closest-side,rgb(31_77_63/0.55),transparent)]" />
              <LogoMark className="absolute -right-8 -bottom-16 h-64 w-auto text-cream-50/[0.035] sm:h-96" />
            </div>

            <ProgressBars
              index={index}
              progress={progress}
              discrete={reduce}
              label={s.progressAria}
              valueText={valueText}
            />
            <div className="mt-3.5 flex items-center justify-between text-[12px] font-medium tracking-[0.16em] text-cream-50/60 uppercase sm:mt-4 sm:text-[13px]">
              <span className="inline-flex items-center gap-2">
                <LogoMark className="h-2.5 w-auto text-sage" />
                {t.profile.name}
              </span>
              <span className="tabular-nums">
                {pad(current)} / {pad(chapterCount - 1)}
              </span>
            </div>

            <div className="grid min-h-0 flex-1 py-5 sm:py-6">
              {chapterIds.map((id, i) => {
                const { active, props } = layer(i);
                return (
                  <motion.div key={id} {...props}>
                    <Scene {...s.chapters[id]} visual={visual(id, active)} />
                  </motion.div>
                );
              })}
              <motion.div {...outro.props}>
                <Outro
                  name={t.profile.name}
                  location={t.profile.location}
                  tagline={s.outro.tagline}
                  cta={s.outro.cta}
                  replay={s.controls.replay}
                  onReplay={replay}
                />
              </motion.div>
            </div>

            <Controls
              labels={s.controls}
              paused={userPaused}
              manual={reduce || ended}
              canPrevious={index > 0}
              canNext={!ended}
              onToggle={togglePause}
              onStep={step}
            />

            {/* Announces the chapter only when the visitor drives the player by hand. */}
            <p aria-live={userPaused || reduce ? "polite" : "off"} className="sr-only">
              {valueText}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Story;
