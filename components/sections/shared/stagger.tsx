"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { reveal, stagger } from "@/lib/motion";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Delay between children in seconds. */
  gap?: number;
  /** Delay before the first child in seconds. */
  delay?: number;
  as?: "div" | "ul";
}

/**
 * Viewport-triggered container. Children should be `<Reveal inherit>` so they
 * pick up `hidden` / `show` from here and animate one after another.
 *
 * The entered state is kept in React and passed as `animate`, not `whileInView`:
 * `whileInView` is not handed down through context, so a child that mounts after
 * the container has already revealed (a remount, a late branch) would stay at
 * `hidden` (opacity 0) forever. With `animate` it mounts hidden and animates in.
 */
export function Stagger({ children, className, gap = 0.06, delay = 0, as = "div" }: StaggerProps) {
  const Component = motion[as];
  const [shown, setShown] = useState(false);
  return (
    <Component
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      onViewportEnter={() => setShown(true)}
      viewport={reveal}
    >
      {children}
    </Component>
  );
}

export default Stagger;
