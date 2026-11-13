"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

/** `custom` is the side an inactive scene waits on: -1 already played, 1 still ahead. */
export const sceneVariants: Variants = {
  hidden: (side: number) => ({
    opacity: 0,
    x: side * 28,
    scale: 0.98,
    transition: { duration: 0.35, ease },
  }),
  show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease } },
};

export const rise = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 12, transition: { duration: 0.2 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease, delay } },
});

const words: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.45em", transition: { duration: 0.2 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

interface SceneProps {
  eyebrow: string;
  title: string;
  /** Closing phrase of the headline, in sage. */
  accent: string;
  line: string;
  /** Code-drawn picture of the chapter; it inherits `hidden` / `show`. */
  visual: ReactNode;
}

/**
 * One chapter: eyebrow, a headline that comes in word by word, a supporting line
 * and the visual. Must sit inside a motion parent that switches `hidden` / `show`.
 */
export function Scene({ eyebrow, title, accent, line, visual }: SceneProps) {
  // Words are split on plain spaces only, so "MA STUDIO" stays one piece.
  const parts = [
    ...title.split(" ").map((text) => ({ text, accent: false })),
    ...accent.split(" ").map((text) => ({ text, accent: true })),
  ].filter((p) => p.text);

  return (
    <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-5 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:grid-rows-1 sm:items-center sm:gap-10 lg:gap-14">
      <div className="min-w-0">
        <motion.p
          variants={rise(0.05)}
          className="text-[12px] font-medium tracking-[0.18em] text-cream-50/60 uppercase sm:text-[13px]"
        >
          {eyebrow}
        </motion.p>
        <motion.h3
          variants={words}
          className="mt-3 font-heading text-[clamp(1.75rem,7.6vw,2.25rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-cream-50 sm:mt-4 sm:text-[clamp(2rem,4.4vw,3.75rem)] sm:leading-[1.04]"
        >
          {parts.map((p, i) => (
            <span key={i}>
              <motion.span variants={word} className={p.accent ? "inline-block text-sage" : "inline-block"}>
                {p.text}
              </motion.span>{" "}
            </span>
          ))}
        </motion.h3>
        <motion.p
          variants={rise(0.75)}
          className="mt-3 max-w-md text-[15px] leading-relaxed text-pretty text-cream-50/70 sm:mt-5 sm:text-lg"
        >
          {line}
        </motion.p>
      </div>
      <div aria-hidden="true" className="flex min-h-0 min-w-0 items-end sm:items-center sm:justify-end">
        {visual}
      </div>
    </div>
  );
}

export default Scene;
