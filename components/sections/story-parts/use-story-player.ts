"use client";

import { useAnimationFrame, useInView, useMotionValue } from "framer-motion";
import { useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { CHAPTER_MS, outroIndex } from "@/components/sections/story-parts/chapters";

const HOLD_MS = 300;
const SWIPE_PX = 48;
const isControl = (target: EventTarget) => target instanceof Element && target.closest("button, a") !== null;

/**
 * State machine of the story player. `index` runs from 0 to `outroIndex`; `progress`
 * (0..1) is the elapsed share of the current chapter and is driven by one rAF loop,
 * so the progress bar never re-renders React.
 *
 * The clock only runs while the screen is in view, the tab is visible, and the visitor
 * is not hovering, holding, keyboard-focusing or has not paused it. With reduced motion
 * it never runs: chapters change only by hand.
 */
export function useStoryPlayer(reduce: boolean) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsed = useRef(0);

  const inView = useInView(screenRef, { amount: 0.5 });
  /** The first chapter waits for the screen to be seen once, so its entrance is not missed. */
  const started = useInView(screenRef, { amount: 0.35, once: true });

  const hover = useRef(false);
  const focus = useRef(false);
  const hold = useRef(false);
  const press = useRef({ x: 0, y: 0, at: 0 });
  const swallowClick = useRef(false);

  const goTo = (next: number) => {
    const clamped = Math.min(outroIndex, Math.max(0, next));
    elapsed.current = 0;
    progress.set(0);
    setIndex(clamped);
  };
  const step = (delta: number) => goTo(index + delta);
  const replay = () => {
    setUserPaused(false);
    goTo(0);
  };

  useAnimationFrame((_, delta) => {
    if (reduce || userPaused || !inView || index >= outroIndex) return;
    if (hover.current || focus.current || hold.current || document.hidden) return;
    // A long frame (tab switch, breakpoint) must not skip a chapter.
    elapsed.current += Math.min(delta, 100);
    if (elapsed.current >= CHAPTER_MS) goTo(index + 1);
    else progress.set(elapsed.current / CHAPTER_MS);
  });

  const screenProps = {
    ref: screenRef,
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") hover.current = true;
    },
    onPointerLeave: () => {
      hover.current = false;
      hold.current = false;
    },
    onPointerDown: (e: PointerEvent) => {
      swallowClick.current = false;
      if (isControl(e.target)) return;
      hold.current = true;
      press.current = { x: e.clientX, y: e.clientY, at: e.timeStamp };
    },
    onPointerUp: (e: PointerEvent) => {
      if (!hold.current) return;
      hold.current = false;
      const dx = e.clientX - press.current.x;
      const dy = e.clientY - press.current.y;
      if (e.pointerType !== "mouse" && Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
        swallowClick.current = true;
        step(dx < 0 ? 1 : -1);
      } else if (e.timeStamp - press.current.at > HOLD_MS) {
        // It was a press-and-hold to pause, not a tap.
        swallowClick.current = true;
      }
    },
    onPointerCancel: () => {
      hold.current = false;
    },
    /** Tap or click on the left / right half of the screen. */
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (swallowClick.current) {
        swallowClick.current = false;
        return;
      }
      if (isControl(e.target)) return;
      const box = e.currentTarget.getBoundingClientRect();
      step(e.clientX < box.left + box.width / 2 ? -1 : 1);
    },
    onFocus: (e: React.FocusEvent) => {
      focus.current = e.target.matches(":focus-visible");
    },
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget)) focus.current = false;
    },
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === " " && e.target === e.currentTarget && !reduce) setUserPaused((p) => !p);
      else return;
      e.preventDefault();
    },
  };

  return {
    index,
    progress,
    started: started || reduce,
    userPaused,
    togglePause: () => setUserPaused((p) => !p),
    step,
    replay,
    screenProps,
  };
}
