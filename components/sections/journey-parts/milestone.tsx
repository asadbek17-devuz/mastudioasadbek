"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cardSurface } from "@/components/sections/shared/hover";
import type { JourneyMilestone } from "@/lib/data";
import { cardHover, cardTap, ease, fadeIn, reveal, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Shared row grid.
 * - < lg: node rail (2.5rem) on the left, card on the right.
 * - lg+: card | node rail (3.5rem) | card, alternating sides.
 */
export const rowGrid =
  "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 sm:gap-x-5 lg:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] lg:gap-x-10";

/** Rail x-position: center of the 2.5rem column on mobile, page center on lg. */
export const railX = "left-5 -translate-x-1/2 lg:left-1/2";

/** Card reveal: fade, rise 16px, un-blur, and slide in from its side (custom = -1 | 1). */
const cardReveal: Variants = {
  hidden: (side: number) => ({ opacity: 0, y: 16, x: side * 16, filter: "blur(6px)" }),
  show: { opacity: 1, y: 0, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

/** Year pill used beside the node (lg) and inside the card (< lg). */
export function YearBadge({
  year,
  highlight,
  className,
}: {
  year: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-pill border px-3 font-heading text-[13px] font-semibold tracking-tight tabular-nums",
        highlight
          ? "border-accent bg-accent text-cream-50"
          : "border-line bg-cream-50 text-ink shadow-soft",
        className
      )}
    >
      {year}
    </span>
  );
}

/**
 * Node on the rail. The base ring is always rendered; `data-journey-lit` is
 * the accent fill that GSAP fades/pops in as the line reaches it. Without JS
 * or with reduced motion the fill simply stays visible.
 */
function Node({ milestone }: { milestone: JourneyMilestone }) {
  const Icon = milestone.icon;
  return (
    <div
      data-journey-node
      className="relative z-10 col-start-1 row-start-1 flex justify-center lg:col-start-2"
    >
      <div
        className={cn(
          "relative grid size-10 place-items-center rounded-full border border-line bg-cream-50 text-muted shadow-soft transition-[scale] duration-300 ease-ios group-hover/row:scale-110 motion-reduce:transition-none lg:size-14",
          milestone.highlight && "ring-4 ring-accent-soft lg:ring-[6px]"
        )}
      >
        <Icon aria-hidden="true" className="size-4 lg:size-5" strokeWidth={1.75} />
        <span
          data-journey-lit
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center rounded-full bg-accent text-cream-50"
        >
          <Icon className="size-4 lg:size-5" strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}

interface MilestoneRowProps {
  milestone: JourneyMilestone;
  index: number;
}

export function MilestoneRow({ milestone, index }: MilestoneRowProps) {
  const reduce = useReducedMotion();
  const left = index % 2 === 0;
  const side = left ? -1 : 1;
  const { year, title, description, tag, highlight, metric } = milestone;

  return (
    <li className={cn("group/row relative", rowGrid)}>
      <Node milestone={milestone} />

      {/* Year beside the node, on the side opposite the card (lg only). */}
      <div
        className={cn(
          "row-start-1 hidden pt-3.5 lg:flex",
          left ? "lg:col-start-3 lg:justify-start" : "lg:col-start-1 lg:justify-end"
        )}
      >
        <YearBadge year={year} highlight={highlight} />
      </div>

      <motion.div
        custom={side}
        variants={reduce ? fadeIn : cardReveal}
        initial="hidden"
        whileInView="show"
        viewport={reveal}
        className={cn(
          "col-start-2 row-start-1 flex min-w-0",
          left ? "lg:col-start-1 lg:justify-end" : "lg:col-start-3 lg:justify-start"
        )}
      >
        <motion.article
          whileHover={reduce ? undefined : cardHover}
          whileTap={reduce ? undefined : cardTap}
          transition={spring}
          className={cn(
            "flex w-full min-w-0 flex-col gap-2.5 p-4 min-[390px]:p-5 lg:max-w-md lg:p-6",
            cardSurface,
            highlight && "border-accent/25 hover:border-accent/40"
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <YearBadge year={year} highlight={highlight} className="lg:hidden" />
            {tag ? (
              <span
                className={cn(
                  "inline-flex h-7 items-center rounded-pill px-3 text-[13px] font-medium",
                  highlight ? "bg-accent-soft text-accent" : "bg-cream-100 text-muted"
                )}
              >
                {tag}
              </span>
            ) : null}
          </div>

          <h3 className="font-heading text-lg leading-snug font-semibold tracking-tight text-balance text-ink lg:text-xl">
            {title}
          </h3>
          <p className="text-[15px] leading-relaxed text-pretty text-ink-soft">{description}</p>

          {metric ? (
            <dl className="mt-1.5 flex min-w-0 flex-row-reverse items-baseline justify-end gap-2.5 border-t border-line pt-3">
              <dt className="min-w-0 text-[13px] leading-snug text-muted">{metric.label}</dt>
              <dd
                className={cn(
                  "shrink-0 font-heading text-2xl leading-none font-bold tracking-tight tabular-nums",
                  highlight ? "text-accent" : "text-ink"
                )}
              >
                {metric.value}
              </dd>
            </dl>
          ) : null}
        </motion.article>
      </motion.div>
    </li>
  );
}
