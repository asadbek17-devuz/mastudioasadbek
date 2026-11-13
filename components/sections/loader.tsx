"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

import { LogoMark } from "@/components/ui/logo";
import { isLoaderDone, markLoaderDone } from "@/components/sections/header/loader-signal";
import { ease } from "@/lib/motion";
import { useT } from "@/lib/i18n";

/** Timings (ms). Total on a fast connection: ~0.45s hold + 0.25s settle + 0.8s wipe. */
const MIN_MS = 450;
const MIN_MS_REDUCED = 400;
const MAX_MS = 3000;
const FILL_MS = 250;

/**
 * Without JS nothing ever animates in, so force the server-rendered start states
 * (the inline `opacity:0;transform:translate…` of Framer Motion reveals, the heading
 * marker, the hero headline mask) visible. Elements that are hidden on purpose render
 * a bare `opacity:0` and are left alone.
 */
const NOSCRIPT_CSS =
  "#site-loader{display:none!important}" +
  "html{overflow:auto!important;animation:none!important}" +
  '[style*="opacity:0;transform:translate"]{opacity:1!important;transform:none!important}' +
  '[style*="background-size:0%"]{background-size:100% 0.32em!important}' +
  '[class*="translateY(110%)"]{transform:none!important}';

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
  // True on the server and on first load. After a client-side language switch the intro
  // has already played, so a remount starts hidden instead of flashing the overlay.
  const [visible, setVisible] = useState(
    () => !isLoaderDone(),
  );
  const reduce = useReducedMotion();
  const t = useT();

  useEffect(() => {
    const timers: number[] = [];
    let done = false;

    // Remount after the intro already played (e.g. fast refresh): get out of the way.
    if (isLoaderDone()) {
      markLoaderDone(); // restores the attribute if the re-render dropped it
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
              scrollbar-gutter keeps the layout from shifting when the lock is removed.
              The delayed animation (keyframes in globals.css) releases the lock on its own
              if this component never hydrates, together with `#site-loader` hiding itself. */}
          <style>
            {"html{overflow:hidden;scrollbar-gutter:stable;animation:loader-failsafe-unlock 0s linear 5s forwards}"}
          </style>
          {/* No JS: drop the loader and show everything the reveal animations render hidden. */}
          <noscript>
            <style>{NOSCRIPT_CSS}</style>
          </noscript>
        </>
      )}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="site-loader"
            id="site-loader"
            role="status"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-cream will-change-[clip-path]"
            variants={reduce ? overlayVariantsReduced : overlayVariants}
            initial={false}
            animate="show"
            exit="exit"
          >
            <span className="sr-only">{t.loader.label}</span>
            <motion.div
              className="flex items-center justify-center"
              variants={reduce ? contentVariantsReduced : contentVariants}
            >
              {/* The brand mark breathes while the page loads; still with reduced motion. */}
              <motion.div
                animate={reduce ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.96, 1, 0.96] }}
                transition={{ duration: 1.3, ease: "easeInOut", repeat: Infinity }}
              >
                <LogoMark className="h-14 w-auto text-accent sm:h-16" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Loader;
