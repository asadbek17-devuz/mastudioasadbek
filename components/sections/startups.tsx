"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowButton, ArrowSwap, cardSurface, focusRing } from "@/components/sections/shared/hover";
import { Parallax, ScrubScale } from "@/components/sections/shared/scroll-fx";
import { linkTarget } from "@/components/sections/shared/social-icons";
import { Stagger } from "@/components/sections/shared/stagger";
import { CountValue } from "@/components/sections/startups-parts/count-value";
import { StatusBadge } from "@/components/sections/startups-parts/status-badge";
import { format, useData, useT, type LocalizedStartup } from "@/lib/i18n";
import { cardHover, cardTap, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

function HeroStartup({ startup }: { startup: LocalizedStartup }) {
  const t = useT();
  return (
    <Reveal inherit className="flex min-w-0 sm:col-span-2 lg:col-span-7 lg:row-span-2">
      {/* GSAP: the card scales 0.96 -> 1 as it enters, the dots drift behind the copy. */}
      <ScrubScale from={0.96} className="flex w-full min-w-0">
        <article className="relative isolate flex w-full flex-col overflow-hidden rounded-card bg-accent p-5 text-cream-50 shadow-lift sm:p-8">
          <Parallax amount={0.14} className="pointer-events-none -z-10">
            <DotPattern
              width={18}
              height={18}
              cr={0.9}
              className="fill-cream-50/15 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)] md:fill-cream-50/15"
            />
          </Parallax>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={startup.status} label={startup.statusLabel} />
            <span className="text-sm text-cream-50/70">{startup.period}</span>
          </div>

          <h3 className="mt-5 font-heading text-[clamp(1.75rem,1.4rem+1.6vw,2.25rem)] leading-tight font-semibold tracking-tight sm:mt-6">
            {startup.name}
          </h3>
          <p className="mt-1.5 text-base font-medium tracking-tight text-sage sm:text-lg">
            {startup.role}
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-pretty text-cream-50/85">
            {startup.description}
          </p>

          {/* Phones: two short stats side by side, an odd last one (the long
              "hired after graduation" label) gets a full-width row of its own. */}
          <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-3 lg:mt-auto lg:pt-10">
            {startup.metrics.map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  "flex min-w-0 flex-col-reverse justify-end gap-1.5 rounded-2xl border border-cream-50/15 bg-cream-50/5 p-4",
                  i === startup.metrics.length - 1 &&
                    i % 2 === 0 &&
                    "max-sm:col-span-2 max-sm:flex-row-reverse max-sm:items-center max-sm:justify-between max-sm:gap-4"
                )}
              >
                <dt className="text-[13px] leading-snug break-words text-cream-50/70 sm:text-sm">{m.label}</dt>
                <dd className="font-heading text-[clamp(1.875rem,0.9rem+2.8vw,3rem)] leading-none font-bold tracking-tight tabular-nums">
                  <CountValue value={m.value} />
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={startup.href}
            {...linkTarget(startup.href)}
            className={cn(
              "group mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-pill bg-cream-50 px-5 py-2.5 text-sm font-medium text-accent shadow-soft transition-[background-color,box-shadow,scale] duration-300 ease-ios hover:bg-cream hover:shadow-lift active:scale-[0.97]",
              focusRing,
              "focus-visible:ring-cream-50 focus-visible:ring-offset-accent"
            )}
          >
            {format(t.startups.visit, { name: startup.name })}
            <ArrowSwap />
          </a>
        </article>
      </ScrubScale>
    </Reveal>
  );
}

function StartupCard({ startup }: { startup: LocalizedStartup }) {
  const reduce = useReducedMotion();
  return (
    <Reveal inherit className="flex min-w-0 lg:col-span-5">
      <motion.a
        href={startup.href}
        {...linkTarget(startup.href)}
        whileHover={reduce ? undefined : cardHover}
        whileTap={reduce ? undefined : cardTap}
        transition={spring}
        className={cn("flex w-full min-w-0 flex-col gap-3.5 p-5 sm:gap-4 sm:p-6", cardSurface, focusRing)}
      >
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <StatusBadge status={startup.status} label={startup.statusLabel} />
          <ArrowButton />
        </div>

        <div className="min-w-0">
          <h3 className="font-heading text-xl font-semibold tracking-tight text-ink">
            {startup.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            {startup.role} · {startup.period}
          </p>
        </div>

        <p className="text-[15px] leading-relaxed text-pretty text-ink-soft sm:text-sm">
          {startup.description}
        </p>

        <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-line pt-4 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
          {startup.metrics.map((m) => (
            <div key={m.id} className="flex min-w-0 flex-col-reverse gap-1">
              <dt className="text-[13px] leading-snug text-muted">{m.label}</dt>
              <dd className="font-heading text-2xl leading-none font-bold tracking-tight text-ink tabular-nums">
                <CountValue value={m.value} />
              </dd>
            </div>
          ))}
        </dl>
      </motion.a>
    </Reveal>
  );
}

export function Startups() {
  const t = useT();
  const { startups } = useData();
  const [lead, ...others] = startups;

  return (
    <section id="startups" className="py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          {...t.startups.heading}
        />

        <Stagger className="mt-10 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12">
          {lead ? <HeroStartup startup={lead} /> : null}
          {others.map((s) => (
            <StartupCard key={s.slug} startup={s} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export default Startups;
