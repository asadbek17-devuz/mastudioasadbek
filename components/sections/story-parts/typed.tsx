"use client";

import { useEffect, useState } from "react";

interface Segment {
  text: string;
  className?: string;
}

interface TypedProps {
  segments: Segment[];
  /** Types while true. Remount (change `key`) to start over. */
  run: boolean;
  /** Show everything at once (reduced motion). */
  instant: boolean;
  delayMs?: number;
  stepMs?: number;
}

/** Types coloured segments character by character, with a block cursor that blinks once done. */
export function Typed({ segments, run, instant, delayMs = 500, stepMs = 75 }: TypedProps) {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!run || instant) return;
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => setCount((c) => (c < total ? c + 1 : c)), stepMs);
    }, delayMs);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [run, instant, total, delayMs, stepMs]);

  const shown = instant ? total : count;
  const starts = segments.map((_, i) => segments.slice(0, i).reduce((n, s) => n + s.text.length, 0));
  return (
    <span className="whitespace-pre">
      {segments.map((s, i) => (
        <span key={i} className={s.className}>
          {s.text.slice(0, Math.max(0, shown - starts[i]))}
        </span>
      ))}
      <span
        className={
          run && !instant && shown >= total
            ? "ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-sage"
            : "ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-sage"
        }
      />
    </span>
  );
}

export default Typed;
