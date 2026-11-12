"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const PARTS = /^(\D*)(\d+)(.*)$/;

/**
 * Renders a metric like "500+" or "70%". The final value is in the server
 * HTML, so no-JS and reduced-motion users always see it. With JS, the number
 * is reset to 0 on mount (it sits inside a hidden reveal at that point) and
 * counts up in ~1s with an ease-out once it scrolls into view. Writes go to
 * the DOM directly, so React state never changes.
 */
export function CountValue({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const match = PARTS.exec(value);
  const animatable = Boolean(match) && !reduce;

  // Before it is seen: show "0" + suffix so the count starts from zero.
  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (!animatable) {
      el.textContent = value;
      return;
    }
    if (!inView) el.textContent = `${match[1]}0${match[3]}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatable, value]);

  useEffect(() => {
    const el = ref.current;
    if (!inView || !animatable || !el || !match) return;
    const [, prefix, digits, suffix] = match;
    const controls = animate(0, Number(digits), {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
      onComplete: () => {
        el.textContent = value;
      },
    });
    return () => {
      controls.stop();
      el.textContent = value;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, animatable, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

export default CountValue;
