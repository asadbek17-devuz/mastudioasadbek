"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
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
 */
export function Stagger({ children, className, gap = 0.06, delay = 0, as = "div" }: StaggerProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={reveal}
    >
      {children}
    </Component>
  );
}

export default Stagger;
