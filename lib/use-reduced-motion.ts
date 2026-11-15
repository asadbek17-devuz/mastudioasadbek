"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(notify: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Hydration-safe replacement for Framer Motion's `useReducedMotion`.
 *
 * Framer's hook reads the media query during the very first client render, so with
 * reduced motion on, the hydration render differs from the server HTML (which can only
 * assume "no preference") wherever markup or inline styles depend on it, and React
 * throws the server-rendered tree away. This one is `false` on the server and while
 * hydrating, then switches to the real value right after, and follows later changes.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
