"use client";

import { motion, type MotionValue } from "framer-motion";
import { chapterIds } from "@/components/sections/story-parts/chapters";

interface ProgressBarsProps {
  index: number;
  /** 0..1 share of the current chapter. */
  progress: MotionValue<number>;
  /** Reduced motion: the current segment is simply full. */
  discrete: boolean;
  label: string;
  valueText: string;
}

/** Stories-style segmented progress: past chapters are full, the current one fills in sync with the clock. */
export function ProgressBars({ index, progress, discrete, label, valueText }: ProgressBarsProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={chapterIds.length}
      aria-valuenow={Math.min(index + 1, chapterIds.length)}
      aria-valuetext={valueText}
      className="flex gap-1.5"
    >
      {chapterIds.map((id, i) => (
        <span key={id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-cream-50/15">
          <motion.span
            style={{ scaleX: i === index && !discrete ? progress : i <= index ? 1 : 0 }}
            className="block h-full origin-left rounded-full bg-cream-50"
          />
        </span>
      ))}
    </div>
  );
}

export default ProgressBars;
