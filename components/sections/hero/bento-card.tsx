"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cardSurface, focusRing } from "@/components/sections/shared/hover";
import { cardHover, cardTap, ease, fadeIn, softSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Card entrance: fade, rise 16px and settle from 98% on a soft spring. */
const cardEnter: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...softSpring,
      opacity: { duration: 0.5, ease },
    },
  },
};

const hoverSpring = { type: "spring", stiffness: 320, damping: 24 } as const;

/**
 * The lift is a variant so the stationary entrance node can trigger it: if the
 * surface listened for its own hover, lifting 3px would pull its bottom edge
 * from under the pointer and the card would flicker up and down.
 */
const surfaceHover: Variants = { hover: cardHover };

interface BentoCardProps {
  children: ReactNode;
  /** Grid placement (col/row spans) of the outer wrapper. */
  className?: string;
  /** Classes of the visible card surface (padding, colors, layout). */
  surfaceClassName?: string;
  /** Scroll drift in px, read by `useHeroScrollFx` (negative moves up). */
  drift?: number;
  /** Turns the whole card into a link with hover lift and press feedback. */
  href?: string;
  /** False for a card that only holds other controls: no lift, no hover shadow. */
  interactive?: boolean;
  "aria-label"?: string;
}

/**
 * One bento cell. Three nested nodes so nobody fights over `transform`:
 *   wrapper (grid cell, GSAP scroll drift) > entrance (Framer variants) > surface (Framer hover/tap).
 * The entrance inherits `hidden` / `show` from the staggering grid above it.
 */
export function BentoCard({
  children,
  className,
  surfaceClassName,
  drift = 0,
  href,
  interactive = true,
  "aria-label": ariaLabel,
}: BentoCardProps) {
  const reduce = useReducedMotion();
  const lift = interactive && !reduce;
  const surface = cn(
    cardSurface,
    "relative block h-full overflow-hidden",
    !interactive && "hover:border-line hover:shadow-soft",
    surfaceClassName
  );

  return (
    <div data-drift={drift || undefined} className={cn("min-w-0", className)}>
      <motion.div
        variants={reduce ? fadeIn : cardEnter}
        whileHover={lift ? "hover" : undefined}
        className="h-full"
      >
        {href ? (
          <motion.a
            href={href}
            aria-label={ariaLabel}
            className={cn(surface, focusRing)}
            variants={surfaceHover}
            whileTap={lift ? cardTap : undefined}
            transition={hoverSpring}
          >
            {children}
          </motion.a>
        ) : (
          <motion.div
            className={surface}
            variants={surfaceHover}
            transition={hoverSpring}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
