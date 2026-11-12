"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

import UniqueLoading from "@/components/ui/morph-loading";
import { markLoaderDone } from "@/components/sections/header/loader-signal";
import { ease } from "@/lib/motion";
import { useT } from "@/lib/i18n";

/** Timings (ms). Total on a fast connection: ~1.3s hold + 0.25s settle + 0.8s wipe. */
const MIN_MS = 1300;
const MIN_MS_REDUCED = 400;
const MAX_MS = 3000;
const FILL_MS = 250;

/** In-out curve for the wipe so it doesn't snap at either end. */
const wipeEase = [0.76, 0, 0.24, 1] as const;

const overlayVariants: Variants = {
  show: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.8, ease: wipeEase },
  },
};

const overlayVariantsReduced: Variants = {
  show: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.3, ease } },
};

const contentVariants: Variants = {
  show: { opacity: 1, y: 0, scale: 1 },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.97,
    transition: { duration: 0.35, ease },
  },
};

const contentVariantsReduced: Variants = {
  show: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function Loader() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();
  const t = useT();

  useEffect(() => {
    const root = document.documentElement;
    const timers: number[] = [];
    let done = false;

    // Remount after the intro already played (e.g. fast refresh): get out of the way.
    if (root.dataset.loaded === "true") {
      timers.push(window.setTimeout(() => setVisible(false), 0));
      return () => timers.forEach(clearTimeout);
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = prefersReduced ? MIN_MS_REDUCED : MIN_MS;
    const start = performance.now();
    let pageLoaded = document.readyState === "complete";

    const finish = () => {
      if (done) return;
      done = true;
      timers.push(
        window.setTimeout(() => {
          setVisible(false);
          markLoaderDone();
        }, FILL_MS),
      );
    };

    const maybeFinish = () => {
      if (pageLoaded && performance.now() - start >= minMs) finish();
    };

    const onLoad = () => {
      pageLoaded = true;
      maybeFinish();
    };

    if (!pageLoaded) window.addEventListener("load", onLoad, { once: true });
    timers.push(window.setTimeout(maybeFinish, minMs));
    timers.push(window.setTimeout(finish, MAX_MS));

    return () => {
      window.removeEventListener("load", onLoad);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      {visible && (
        <>
          {/* Scroll lock, rendered on the server too so there is no scrollable flash.
              scrollbar-gutter keeps the layout from shifting when the lock is removed. */}
          <style>{"html{overflow:hidden;scrollbar-gutter:stable}"}</style>
          <noscript>
            <style>{"#site-loader{display:none!important}html{overflow:auto!important}"}</style>
          </noscript>
        </>
      )}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="site-loader"
            id="site-loader"
            role="status"
            aria-live="polite"
            aria-label={t.loader.label}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-cream will-change-[clip-path]"
            variants={reduce ? overlayVariantsReduced : overlayVariants}
            initial={false}
            animate="show"
            exit="exit"
          >
            <motion.div
              className="flex items-center justify-center"
              variants={reduce ? contentVariantsReduced : contentVariants}
            >
              <UniqueLoading variant="morph" size="md" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Loader;
