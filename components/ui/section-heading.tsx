"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  /** Small uppercase label above the title, e.g. "Selected work". */
  eyebrow?: string;
  /** Main title text. */
  title: string;
  /**
   * Optional accent word/phrase rendered after the title: same sans face,
   * semibold, accent green, with a soft highlight that draws in on reveal.
   */
  accent?: string;
  /** Optional supporting paragraph. */
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Inherits `hidden`/`show` from the parent Reveal, so it draws in right after the title. */
const mark: Variants = {
  hidden: { backgroundSize: "0% 0.32em" },
  show: {
    backgroundSize: "100% 0.32em",
    transition: { duration: 0.8, ease, delay: 0.35 },
  },
};

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const reduce = useReducedMotion();
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "flex max-w-2xl flex-col gap-3 sm:gap-4",
        centered && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.16em] text-muted uppercase sm:text-xs sm:tracking-[0.18em]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-heading text-[clamp(1.75rem,8vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-ink sm:text-4xl sm:leading-[calc(2.5/2.25)] md:text-5xl md:leading-[1.05]">
        {title}
        {accent ? (
          <>
            {" "}
            <motion.span
              variants={reduce ? undefined : mark}
              className="accent-mark font-semibold text-accent"
            >
              {accent}
            </motion.span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-pretty text-ink-soft sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

export default SectionHeading;
