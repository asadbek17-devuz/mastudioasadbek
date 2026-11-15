"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowButton, focusRing } from "@/components/sections/shared/hover";
import { railX, rowGrid, YearBadge } from "@/components/sections/journey-parts/milestone";
import { STUDIO_URL, type JourneyMilestone } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { cardHover, cardTap, fadeIn, fadeUp, reveal, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Final open-ended step: dashed rail segment, outlined dashed node and a
 * "What's next" card that links out to the MA STUDIO site. Always centered-left on lg so it
 * reads as the road continuing.
 */
export function NextStep({ milestone, index }: { milestone: JourneyMilestone; index: number }) {
  const reduce = useReducedMotion();
  const t = useT();
  const Icon = milestone.icon;
  const left = index % 2 === 0;

  return (
    // Phones: the milestones above are a carousel with no vertical rail, so the dashed
    // segment and the node are dropped and the card spans the full width.
    <div className="relative pt-6 sm:pt-8 lg:pt-12">
      {/* Dashed segment from the end of the solid line down to this node's center. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 h-[calc(2rem+1.25rem)] border-l-2 border-dashed border-accent/40 max-sm:hidden lg:h-[calc(3rem+1.75rem)]",
          railX
        )}
      />

      <div className={cn("group/row relative", rowGrid, "max-sm:grid-rows-1 max-sm:gap-y-0")}>
        <div className="relative z-10 col-start-1 row-start-1 flex justify-center max-sm:hidden lg:col-start-2">
          <div className="grid size-10 place-items-center rounded-full border-2 border-dashed border-accent bg-cream-50 text-accent transition-[scale] duration-300 ease-ios group-hover/row:scale-110 motion-reduce:transition-none lg:size-14">
            <Icon aria-hidden="true" className="size-4 lg:size-5" strokeWidth={1.75} />
          </div>
        </div>

        <div
          className={cn(
            "row-start-1 hidden pt-3.5 lg:flex",
            left ? "lg:col-start-3 lg:justify-start" : "lg:col-start-1 lg:justify-end"
          )}
        >
          <YearBadge
            year={milestone.year}
            className="border-dashed border-accent/50 bg-transparent text-accent shadow-none"
          />
        </div>

        <motion.div
          variants={reduce ? fadeIn : fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={reveal}
          className={cn(
            "col-start-2 row-start-1 flex min-w-0 max-sm:col-start-1",
            left ? "lg:col-start-1 lg:justify-end" : "lg:col-start-3 lg:justify-start"
          )}
        >
          <motion.a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener"
            whileHover={reduce ? undefined : cardHover}
            whileTap={reduce ? undefined : cardTap}
            transition={spring}
            className={cn(
              "group flex w-full min-w-0 flex-col gap-2.5 rounded-card border border-dashed border-accent/40 bg-cream-50/70 p-5 transition-[box-shadow,border-color,background-color] duration-300 ease-ios hover:border-accent/70 hover:bg-cream-50 hover:shadow-lift lg:max-w-md lg:p-6",
              focusRing
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex h-7 items-center rounded-pill bg-accent-soft px-3 text-[13px] font-medium text-accent">
                {milestone.tag}
              </span>
              <ArrowButton className="size-11 sm:size-11" />
            </div>
            <h3 className="font-heading text-lg leading-snug font-semibold tracking-tight text-balance text-ink lg:text-xl">
              {milestone.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-pretty text-ink-soft">
              {milestone.description}
            </p>
            <span className="mt-1 text-[15px] font-medium text-accent">
              {t.journey.nextCta}
            </span>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
