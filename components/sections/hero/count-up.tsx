"use client";

import { useEffect, useRef } from "react";

export interface CountUpProps {
  /** Target number. */
  value: number;
  /** Text after the number, e.g. "+" or "%". */
  suffix?: string;
  /** Count duration in seconds. Default 1.1. */
  duration?: number;
  /** Optional gate: holds the count at 0 until true (e.g. until the loader is done). */
  start?: boolean;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 to `value` (ease-out, ~1s) the first time it is at least 30%
 * visible. Writes straight to the DOM with requestAnimationFrame, so it never
 * re-renders React. Screen readers get the final value; reduced motion shows
 * the final value immediately.
 *
 * Usage: <CountUp value={500} suffix="+" className="text-4xl font-semibold" />
 */
export function CountUp({ value, suffix = "", duration = 1.1, start = true, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !start) return;

    const final = `${value}${suffix}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = final;
      return;
    }

    let frame = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / (duration * 1000), 1);
        node.textContent = `${Math.round(easeOutCubic(p) * value)}${suffix}`;
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, suffix, duration, start]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        0{suffix}
      </span>
      <span className="sr-only">{`${value}${suffix}`}</span>
    </span>
  );
}

export default CountUp;
