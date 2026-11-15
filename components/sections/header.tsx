"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUpRight } from "lucide-react";

import { useLoaderDone } from "@/components/sections/header/loader-signal";
import { LanguageSwitcher } from "@/components/sections/header/language-switcher";
import { LogoMark } from "@/components/ui/logo";
import { navItems as baseNavItems, STUDIO_URL, type SectionId } from "@/lib/data";
import { LOCALE_CHANGE_EVENT, useData, useT } from "@/lib/i18n";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Fraction of the viewport height used as the "reading line" for the scrollspy. */
const SPY_LINE = 0.35;
/** Scroll offsets (px) where the desktop pill shrinks and where it grows back. */
const COMPACT_ON = 40;
const COMPACT_OFF = 24;
/** A click-initiated scroll counts as finished after this long without a scroll event. */
const SCROLL_IDLE_MS = 160;
/** Hard upper bound for the click lock, in case no scroll or scrollend event ever arrives. */
const CLICK_LOCK_MAX_MS = 4000;
/** Keys that mean the visitor took over scrolling. */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

/** Where `id` should sit: its top minus its CSS `scroll-margin-top` (the fixed header's clearance). */
function sectionTop(id: SectionId): number | null {
  const target = document.getElementById(id);
  if (!target) return null;
  if (id === sectionIds[0]) return 0;
  const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(target.getBoundingClientRect().top + window.scrollY - offset, max));
}

function scrollToTop(top: number, smooth: boolean): void {
  if (smooth && "scrollBehavior" in document.documentElement.style) {
    window.scrollTo({ top, behavior: "smooth" });
  } else {
    // "instant" also overrides the page-wide `scroll-behavior: smooth`.
    try {
      window.scrollTo({ top, behavior: "instant" });
    } catch {
      window.scrollTo(0, top);
    }
  }
}

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

/** Derived from `navItems`, so new sections (e.g. "journey") are tracked automatically. */
const sectionIds: SectionId[] = baseNavItems.map((item) => item.id);

/** Shared ink pill spring: quick to settle, no visible overshoot (iOS segmented-control feel). */
const pillSpring = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;
/** Entrance spring for the floating bars once the loader has wiped away. */
const enterSpring = { ...spring, stiffness: 300, damping: 30 };

/** Keep the last content clear of the mobile tab bar (the footer lives in another file). */
// 64px bar + 12px offset from the screen edge + 16px of air above the bar.
const bottomBarSpacer = `@media (max-width: 767px){body{padding-bottom:calc(92px + env(safe-area-inset-bottom))}}`;

/**
 * Writes the section into the address bar without adding a history entry. The first
 * section is the bare page address (no `#home`), so the top of the page has a clean URL.
 */
function syncHash(id: SectionId): void {
  const hash = id === sectionIds[0] ? "" : `#${id}`;
  if (window.location.hash === hash) return;
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, "", `${pathname}${search}${hash}`);
}

function useScrollSpy() {
  const [active, setActive] = useState<SectionId>(sectionIds[0] ?? "home");
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const lockRef = useRef<SectionId | null>(null);
  const lockTimer = useRef<number | undefined>(undefined);
  const idleTimer = useRef<number | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);

  const compute = useCallback(() => {
    frame.current = undefined;
    const y = window.scrollY;
    setScrolled(y > 20);
    // Shrink past ~40px, grow back near the top. The gap between the two thresholds
    // stops the pill from flickering when the page rests right at the edge.
    setCompact((was) => (y > COMPACT_ON ? true : y < COMPACT_OFF ? false : was));
    if (lockRef.current) return;

    const doc = document.documentElement;
    const atBottom = window.innerHeight + y >= doc.scrollHeight - 4;
    if (atBottom) {
      if (sectionIds.length) setActive(sectionIds[sectionIds.length - 1]);
      return;
    }

    const line = window.innerHeight * SPY_LINE;
    let current: SectionId = sectionIds[0] ?? "home";
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) current = id;
    }
    setActive(current);
  }, []);

  const schedule = useCallback(() => {
    if (frame.current === undefined) frame.current = requestAnimationFrame(compute);
  }, [compute]);

  /**
   * Ends the click lock. With `verify`, first checks that the page really arrived:
   * a native smooth scroll is cancelled by any other scroll call (for example
   * ScrollTrigger.refresh() restoring the position after fonts load or the language
   * changes), which would leave the page short of the section. In that case jump there.
   */
  const releaseLock = useCallback(
    (verify: boolean) => {
      const id = lockRef.current;
      lockRef.current = null;
      window.clearTimeout(lockTimer.current);
      window.clearTimeout(idleTimer.current);
      if (verify && id) {
        const top = sectionTop(id);
        if (top !== null && Math.abs(window.scrollY - top) > 2) scrollToTop(top, false);
      }
      schedule();
    },
    [schedule],
  );

  /** Scrolls to `id` and pins the pill to it until that scroll settles. */
  const goTo = useCallback(
    (id: SectionId, smooth: boolean): boolean => {
      const top = sectionTop(id);
      if (top === null) return false;

      lockRef.current = id;
      setActive(id);
      window.clearTimeout(lockTimer.current);
      window.clearTimeout(idleTimer.current);
      lockTimer.current = window.setTimeout(() => releaseLock(true), CLICK_LOCK_MAX_MS);
      // Also covers "already there": no scroll event will come, so the idle timer ends the lock.
      idleTimer.current = window.setTimeout(() => releaseLock(true), SCROLL_IDLE_MS * 2);

      scrollToTop(top, smooth);
      return true;
    },
    [releaseLock],
  );

  useEffect(() => {
    // IntersectionObserver catches sections crossing the reading line (and late-mounted
    // layout changes); the scroll listener handles the shared `scrolled` flag and the
    // bottom-of-page case where a short final section never reaches the line.
    const observer = new IntersectionObserver(schedule, {
      rootMargin: `0px 0px -${(1 - SPY_LINE) * 100}% 0px`,
      threshold: [0, 1],
    });
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    const onScroll = () => {
      schedule();
      if (!lockRef.current) return;
      // Still moving: push the "settled" check back.
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => releaseLock(true), SCROLL_IDLE_MS);
    };
    const onScrollEnd = () => {
      if (lockRef.current) releaseLock(true);
    };
    // The visitor scrolls on their own: hand control back at once, no correction.
    const onUserScroll = () => {
      if (lockRef.current) releaseLock(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) onUserScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    // Section heights change with the language, so re-check which one is on the line.
    window.addEventListener(LOCALE_CHANGE_EVENT, schedule);
    schedule();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(LOCALE_CHANGE_EVENT, schedule);
      // Reset the handle too: a cancelled frame left in the ref would make every later
      // schedule() a no-op (React re-runs effects in dev Strict Mode), freezing the spy.
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      frame.current = undefined;
      window.clearTimeout(lockTimer.current);
      window.clearTimeout(idleTimer.current);
    };
  }, [schedule, releaseLock]);

  return { active, scrolled, compact, goTo };
}

export function Header() {
  const reduce = useReducedMotion();
  const ready = useLoaderDone();
  const { active, scrolled, compact, goTo } = useScrollSpy();
  const t = useT();
  const { navItems, profile } = useData();

  const onNavigate = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
      // Let the browser handle new-tab / new-window clicks.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }
      // No such section: leave the plain #hash link to the browser.
      if (!goTo(id, !reduce)) return;

      event.preventDefault();
      syncHash(id);
    },
    [goTo, reduce],
  );

  // Deep link (/uz#stack). The browser's own jump is a smooth scroll (page-wide
  // `scroll-behavior`) that starts before hydration and is cancelled by the first
  // ScrollTrigger refresh, which strands the page near the top. So jump there directly,
  // and once more when the loader lifts, in case fonts or images moved the section since.
  useEffect(() => {
    const id = window.location.hash.slice(1) as SectionId;
    if (id !== sectionIds[0] && sectionIds.includes(id)) goTo(id, false);
  }, [goTo, ready]);

  // Keep the address in step with the section on screen, however the visitor got there
  // (wheel, keyboard, the footer's "back to top"). Only a change of section writes, so
  // mounting never wipes the hash of a deep link.
  const synced = useRef(active);
  useEffect(() => {
    if (synced.current === active) return;
    synced.current = active;
    syncHash(active);
  }, [active]);

  const pillTransition = reduce ? { duration: 0 } : pillSpring;
  // Reduced motion is only known after hydration, so the bars may have been rendered with
  // the offset start state: the fade then drops that offset at once instead of sliding.
  const fade = { duration: 0.3, y: { duration: 0 }, scale: { duration: 0 } };
  const enter = (from: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: from, scale: 0.98 },
    animate: ready
      ? { opacity: 1, y: 0, scale: 1 }
      : reduce
        ? { opacity: 0 }
        : { opacity: 0, y: from, scale: 0.98 },
  });

  return (
    <>
      <style>{bottomBarSpacer}</style>

      {/* Top: full pill on md+. On phones a wide bar: monogram + wordmark left, language + CTA right. */}
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
        <motion.div
          {...enter(-24)}
          transition={reduce ? fade : { ...enterSpring, delay: 0.15 }}
          data-compact={compact}
          className={cn(
            // Every item is `--item` tall. Phones: 44px (touch target), a 58px pill. From md at
            // rest: 42px items + 2×6px padding + 2×1px border = 56px. From lg the pill has a minimum width and the nav flexes to fill it, so
            // the items sit centred. `relative`: below md the language menu anchors to the
            // pill's right edge. Below md the pill spans the screen minus a 12px gutter each
            // side (capped at max-w-md) and never shrinks on scroll.
            "group/pill pointer-events-auto relative flex w-[calc(100vw-24px)] max-w-md items-center gap-1.5 rounded-pill border border-line bg-cream-50/80 p-1.5 backdrop-blur-md backdrop-saturate-150 [--item:44px] md:w-max md:[--item:42px] md:max-w-full lg:min-w-[760px]",
            // Scrolled (md+): 36px items + 2×5px + 2×1px = 48px, tighter gaps, narrower
            // minimum, more opaque. Real sizes are transitioned (no scale), so text stays
            // sharp and the active pill, which is `inset-0` of its item, follows along.
            "md:data-[compact=true]:gap-1 md:data-[compact=true]:bg-cream-50/92 md:data-[compact=true]:p-[5px] md:data-[compact=true]:[--item:36px] lg:data-[compact=true]:min-w-[700px]",
            "transition-[box-shadow,background-color,padding,gap,min-width] duration-300 ease-ios motion-reduce:transition-none",
            scrolled ? "shadow-lift" : "shadow-soft",
          )}
        >
          <a
            href="#home"
            onClick={(e) => onNavigate(e, "home")}
            aria-label={`${profile.name}, ${t.nav.homeAria}`}
            title={profile.name}
            className={cn(
              // `mr-auto` below md: the logo stays left, language + CTA are pushed to the right edge.
              "mr-auto flex h-(--item) min-w-0 shrink-0 items-center gap-2.5 rounded-pill pr-2 md:mr-0 md:pr-0 lg:pr-4 md:group-data-[compact=true]/pill:gap-2 lg:group-data-[compact=true]/pill:pr-3",
              "transition-[height,gap,padding,transform] duration-300 ease-ios active:scale-95 motion-reduce:transition-none",
              focusRing,
            )}
          >
            <span
              aria-hidden="true"
              className="grid size-(--item) place-items-center rounded-pill bg-ink text-cream-50 transition-[width,height] duration-300 ease-ios motion-reduce:transition-none"
            >
              <LogoMark className="h-[42%] w-auto" />
            </span>
            <span aria-hidden="true" className="text-[13px] font-semibold uppercase tracking-[0.22em] text-ink max-[339px]:hidden md:hidden lg:inline">
              {profile.name}
            </span>
          </a>

          <nav aria-label={t.nav.primaryAria} className="hidden items-center md:flex lg:flex-1">
            <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-line lg:mx-1.5" />
            <LayoutGroup id="primary-nav-top">
              <ul className="flex items-center gap-0.5 lg:flex-1 lg:justify-center lg:gap-1">
                {navItems.map(({ id, label, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <li key={id} className="shrink-0">
                      <a
                        href={`#${id}`}
                        onClick={(e) => onNavigate(e, id)}
                        aria-label={label}
                        aria-current={isActive ? "location" : undefined}
                        className={cn(
                          // Labels show from xl. Estimated pill width at 1280 with 12px item padding:
                          // en ~1090, ru ~1130, uz ~1175 of ~1240 available. 16px padding would put
                          // Uzbek at ~1230, so the roomier padding waits for 2xl.
                          "group/item relative isolate flex h-(--item) min-w-(--item) items-center justify-center rounded-pill px-3 text-sm font-medium 2xl:px-4",
                          // Invisible pad: the item stays a 44px touch target when the pill shrinks.
                          "after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
                          "md:group-data-[compact=true]/pill:px-2.5 2xl:group-data-[compact=true]/pill:px-3.5",
                          "transition-[color,background-color,transform,height,min-width,padding] duration-300 ease-ios active:scale-95 motion-reduce:transition-none",
                          isActive ? "text-cream-50" : "text-ink-soft hover:bg-cream-100 hover:text-ink",
                          focusRing,
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill-top"
                            aria-hidden="true"
                            className="absolute inset-0 z-0 rounded-pill bg-ink"
                            transition={pillTransition}
                          />
                        )}
                        {/* Content sits on its own layer above the pill, so the label is always visible. */}
                        <span className="relative z-10 flex items-center gap-1.5">
                          <Icon aria-hidden="true" className="size-[18px] shrink-0 xl:size-4" strokeWidth={1.75} />
                          <span aria-hidden="true" className="hidden xl:inline">
                            {label}
                          </span>
                        </span>
                        {/* Icon-only widths (md–lg): small ink tooltip under the item on hover / keyboard focus. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-full z-20 mt-2.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-cream-50 opacity-0 shadow-soft",
                            "transition-[opacity,transform] duration-200 ease-ios motion-reduce:translate-y-0 motion-reduce:transition-opacity",
                            "group-hover/item:translate-y-0 group-hover/item:opacity-100 group-hover/item:delay-300 group-focus-visible/item:translate-y-0 group-focus-visible/item:opacity-100 xl:hidden",
                          )}
                        >
                          {label}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>

          <span aria-hidden="true" className="mx-1 hidden h-5 w-px shrink-0 bg-line md:block lg:mx-1.5" />

          <LanguageSwitcher />

          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noopener"
            className={cn(
              "group flex h-(--item) shrink-0 items-center justify-center gap-1.5 rounded-pill bg-ink pl-3.5 pr-3 text-sm font-medium whitespace-nowrap text-cream-50 min-[380px]:gap-2 min-[380px]:pl-4 min-[380px]:pr-3.5 md:pl-5 md:pr-4",
              "md:group-data-[compact=true]/pill:pl-4 md:group-data-[compact=true]/pill:pr-3.5",
              "transition-[background-color,transform,box-shadow,height,padding] duration-300 ease-ios",
              "hover:scale-[1.03] hover:bg-accent hover:shadow-soft active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100",
              focusRing,
            )}
          >
            <span>{t.nav.cta}</span>
            {/* Arrow swap: the current arrow exits up-right while a fresh one enters from bottom-left. */}
            <span aria-hidden="true" className="relative size-4 shrink-0 overflow-hidden">
              <ArrowUpRight
                className="absolute inset-0 size-4 transition-transform duration-300 ease-ios group-hover:-translate-y-full group-hover:translate-x-full motion-reduce:transition-none"
                strokeWidth={2}
              />
              <ArrowUpRight
                className="absolute inset-0 size-4 -translate-x-full translate-y-full transition-transform duration-300 ease-ios group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:transition-none"
                strokeWidth={2}
              />
            </span>
          </a>
        </motion.div>
      </header>

      {/* Bottom: iOS-style floating tab bar on phones. */}
      <div
        className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-3 md:hidden"
        style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <motion.nav
          aria-label={t.nav.primaryAria}
          {...enter(32)}
          transition={reduce ? fade : { ...enterSpring, delay: 0.25 }}
          className="pointer-events-auto w-[calc(100vw-24px)] max-w-md rounded-pill border border-line bg-cream-50/85 p-1.5 shadow-lift backdrop-blur-md backdrop-saturate-150"
        >
          <LayoutGroup id="primary-nav-bottom">
            <ul className="flex items-center">
              {navItems.map(({ id, label, icon: Icon }) => {
                const isActive = active === id;
                return (
                  <li key={id} className="min-w-0 flex-1">
                    <a
                      href={`#${id}`}
                      onClick={(e) => onNavigate(e, id)}
                      aria-current={isActive ? "location" : undefined}
                      title={label}
                      className={cn(
                        // The bar is 64px tall (50px tabs + 2×6px padding + 2×1px border) and the six
                        // tabs share its width: 46px each at 360, 56px at 430. Never below 44px.
                        "group relative isolate grid h-[50px] w-full min-w-11 place-items-center rounded-pill",
                        "transition-colors duration-200 ease-ios motion-reduce:transition-none",
                        isActive ? "text-cream-50" : "text-ink-soft hover:text-ink",
                        focusRing,
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill-bottom"
                          aria-hidden="true"
                          className="absolute inset-0 z-0 rounded-pill bg-ink"
                          transition={pillTransition}
                        />
                      )}
                      <Icon
                        aria-hidden="true"
                        className="relative z-10 size-[22px] transition-transform duration-200 ease-ios group-active:scale-[0.92] motion-reduce:transition-none"
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      <span className="sr-only">{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </motion.nav>
      </div>
    </>
  );
}

export default Header;
