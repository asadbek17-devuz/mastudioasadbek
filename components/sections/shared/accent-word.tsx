"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * Accent word in a heading: sans, accent green, with the soft `accent-mark`
 * highlight drawn in left-to-right when it scrolls into view. With reduced
 * motion the highlight is simply shown.
 */
export function AccentWord({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="accent-mark text-accent"
      initial={reduce ? false : { backgroundSize: "0% 0.32em" }}
      whileInView={{ backgroundSize: "100% 0.32em" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease, delay: 0.2 }}
    >
      {children}
    </motion.span>
  );
}

export default AccentWord;
