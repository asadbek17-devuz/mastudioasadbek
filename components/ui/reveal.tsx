"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeIn, fadeUp, reveal } from "@/lib/motion";

type RevealTag = "div" | "section" | "li" | "ul" | "article" | "span" | "p" | "h2";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Variants with `hidden` and `show` keys. Defaults to `fadeUp`. */
  variants?: Variants;
  /** Delay in seconds before the reveal starts. */
  delay?: number;
  /** Element to render. Defaults to `div`. */
  as?: RevealTag;
  /**
   * Set when this Reveal is a child of a staggered parent: it then inherits
   * `hidden`/`show` from the parent instead of observing the viewport itself.
   */
  inherit?: boolean;
}

/**
 * Reveals its children when they scroll into view, using the shared
 * presets from `lib/motion`. Falls back to a plain fade when the user
 * prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
  inherit = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const v = reduce ? fadeIn : variants;

  if (inherit) {
    return (
      <Component className={className} variants={v}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={reveal}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  );
}

export default Reveal;
