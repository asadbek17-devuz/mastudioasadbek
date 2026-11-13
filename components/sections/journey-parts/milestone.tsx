"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cardSurface } from "@/components/sections/shared/hover";
import { snapItem } from "@/components/sections/shared/snap-carousel";
import type { JourneyMilestone } from "@/lib/data";
import { ease, fadeIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Shared row grid.
 * - < 640: stacked (node above the card): the row is a slide of the phone carousel.
 * - 640+: node rail (2.5rem) on the left, card on the right.
 * - lg+: card | node rail (3.5rem) | card, alternating sides.
 */
export const rowGrid =
  "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 max-sm:grid-cols-1 max-sm:grid-rows-[auto_1fr] max-sm:gap-y-3 sm:gap-x-5 lg:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] lg:gap-x-10";

/** Rail x-position: center of the 2.5rem column on mobile, page center on lg. */
export const railX = "left-5 -translate-x-1/2 lg:left-1/2";

/** Card reveal: a slow, soft fade that rises 20px and slides in from its side (custom = -1 | 1). */
const cardReveal: Variants = {
  hidden: (side: number) => ({ opacity: 0, y: 20, x: side * 20 }),
  show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.85, ease } },
};

/** Year pill (lg): the same move from the other side of the rail, a beat after the card. */
const yearReveal: Variants = {
  hidden: (side: number) => ({ opacity: 0, x: side * 12 }),
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease, delay: 0.12 } },
};

/**
 * Vertical inset only (a card reveals once it is 15% up the screen, so the move is seen on
 * tall desktops too), none sideways: in the phone carousel a card must reveal as soon as its
 * edge slides into the screen, otherwise the peeking next card stays invisible.
 */
const cardViewport = { once: true, margin: "-80px 0px -15% 0px" } as const;

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
      className="relative z-10 col-start-1 row-start-1 flex justify-center max-sm:justify-start lg:col-start-2"
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
  /** Last milestone: no rail piece after it in the phone carousel. */
  last?: boolean;
}

export function MilestoneRow({ milestone, index, last = false }: MilestoneRowProps) {
  const reduce = useReducedMotion();
  const left = index % 2 === 0;
  const side = left ? -1 : 1;
  const { year, title, description, tag, highlight } = milestone;
  const Icon = milestone.icon;

  return (
    <li className={cn("group/row relative", rowGrid, snapItem)}>
      {/* Phones: a horizontal piece of rail from this node to the next slide's node. The accent
          fill is scrubbed by the carousel's scroll position (see `Journey`); without JS or with
          reduced motion it simply stays fully drawn. */}
      {last ? null : (
        <span
          aria-hidden="true"
          className="absolute top-5 -right-3 left-10 h-0.5 -translate-y-1/2 overflow-hidden bg-line sm:hidden"
        >
          <span data-journey-seg className="absolute inset-0 origin-left bg-accent" />
        </span>
      )}

      <Node milestone={milestone} />

      {/* Year beside the node, on the side opposite the card (lg only). */}
      <motion.div
        custom={-side}
        variants={reduce ? fadeIn : yearReveal}
        initial="hidden"
        whileInView="show"
        viewport={cardViewport}
        className={cn(
          "row-start-1 hidden pt-3.5 lg:flex",
          left ? "lg:col-start-3 lg:justify-start" : "lg:col-start-1 lg:justify-end"
        )}
      >
        <YearBadge year={year} highlight={highlight} />
      </motion.div>

      <motion.div
        custom={side}
        variants={reduce ? fadeIn : cardReveal}
        initial="hidden"
        whileInView="show"
        viewport={cardViewport}
        className={cn(
          "col-start-2 row-start-1 flex min-w-0 max-sm:col-start-1 max-sm:row-start-2",
          left ? "lg:col-start-1 lg:justify-end" : "lg:col-start-3 lg:justify-start"
        )}
      >
        <article
          className={cn(
            "flex w-full min-w-0 flex-col gap-2.5 p-5 lg:max-w-md lg:p-6",
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

          {/* Phones: slides share the tallest card's height, so the icon fills the spare room
              as a quiet watermark instead of a hollow bottom. */}
          <Icon
            aria-hidden="true"
            className="mt-auto size-20 shrink-0 self-end text-ink/[0.07] sm:hidden"
            strokeWidth={1.25}
          />
        </article>
      </motion.div>
    </li>
  );
}
