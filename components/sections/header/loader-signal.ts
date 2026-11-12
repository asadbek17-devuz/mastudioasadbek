"use client";

import { useSyncExternalStore } from "react";

/**
 * Contract between the intro Loader and everything that animates in after it.
 *
 * - When the loader starts its exit, it sets `document.documentElement.dataset.loaded = "true"`
 *   and dispatches `window.dispatchEvent(new Event("loader:done"))`.
 * - Late subscribers should check `isLoaderDone()` first (the event may already have fired).
 * - `useLoaderDone()` wraps both and is hydration-safe (false on the server and during hydration).
 */
export const LOADER_DONE_EVENT = "loader:done";

/** Upper bound after which UI should show even if the loader never signalled. */
const FALLBACK_MS = 3500;

let forced = false;

export function isLoaderDone(): boolean {
  if (typeof document === "undefined") return false;
  return forced || document.documentElement.dataset.loaded === "true";
}

export function markLoaderDone(): void {
  if (typeof document === "undefined") return;
  if (document.documentElement.dataset.loaded === "true") return;
  document.documentElement.dataset.loaded = "true";
  window.dispatchEvent(new Event(LOADER_DONE_EVENT));
}

/** Runs `callback` once the loader is done (immediately if it already is). Returns a cleanup. */
export function onLoaderDone(callback: () => void): () => void {
  if (isLoaderDone()) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(LOADER_DONE_EVENT, handler, { once: true });
  return () => window.removeEventListener(LOADER_DONE_EVENT, handler);
}

function subscribe(notify: () => void): () => void {
  window.addEventListener(LOADER_DONE_EVENT, notify);
  const timer = window.setTimeout(() => {
    forced = true;
    notify();
  }, FALLBACK_MS);
  return () => {
    window.removeEventListener(LOADER_DONE_EVENT, notify);
    window.clearTimeout(timer);
  };
}

const getServerSnapshot = () => false;

/** True once the intro loader has finished (or the fallback elapsed). */
export function useLoaderDone(): boolean {
  return useSyncExternalStore(subscribe, isLoaderDone, getServerSnapshot);
}
