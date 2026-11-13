"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";

import { localeMeta, switcherOrder, useLocale, useT, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

/** iOS-like pop: fast, settles without visible overshoot. */
const menuSpring = { type: "spring", stiffness: 520, damping: 34, mass: 0.7 } as const;

/**
 * Language dropdown for the header pill (Uzbek / Russian / English).
 *
 * Positioning: from md up the menu hangs 10px under the trigger's right edge. Below md
 * the wrapper is not positioned, so the menu anchors to the right edge of the nearest
 * positioned ancestor (the header pill, which must be `relative` and must not clip
 * overflow). The pill never leaves the viewport, so neither does the menu at 360px.
 *
 * The options are real links to /uz, /ru and /en (open in a new tab, copy the address).
 * A plain click becomes a client navigation that keeps the hash and the
 * scroll position (see `setLocale` in the provider); modified clicks open the link as usual.
 *
 * Keyboard: Enter / Space / ArrowDown open (ArrowUp opens on the last option),
 * arrows / Home / End move, Enter / Space select, Escape closes and returns focus
 * to the trigger, Tab closes and moves on.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const reduce = useReducedMotion();
  const menuId = useId();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);

  const selectedIndex = Math.max(0, switcherOrder.indexOf(locale));
  const last = switcherOrder.length - 1;

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
    setOpen(true);
  }, []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  }, []);

  // Move focus into the menu when it opens and whenever the active option changes.
  useEffect(() => {
    if (open) items.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  // Click / tap outside closes. Focus stays wherever the click put it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Enter and Space arrive as a click, which toggles the menu.
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAt(selectedIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openAt(last);
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => (i >= last ? 0 : i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => (i <= 0 ? last : i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(last);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close(true);
        break;
      case " ":
        // Links only activate on Enter; a menu item must also take Space.
        event.preventDefault();
        items.current[activeIndex]?.click();
        break;
      case "Tab":
        // No preventDefault: focus moves on to the next control as usual.
        close(false);
        break;
    }
  };

  const choose = (event: MouseEvent<HTMLAnchorElement>, next: Locale) => {
    // Ctrl / Cmd / Shift / middle click: let the browser open the link itself.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setLocale(next);
    close(true);
  };

  const current = localeMeta[locale];

  return (
    <div ref={root} className={cn("shrink-0 md:relative", className)}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${t.language.label}: ${current.nativeName}`}
        onClick={() => (open ? close(false) : openAt(selectedIndex))}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          // As tall as the other pill items (`--item`, 42px at rest); the ::after pad makes the
          // touch target 44px on phones, where the pill never shrinks.
          "relative flex h-[var(--item,42px)] min-w-11 items-center justify-center gap-1.5 rounded-pill px-2.5 text-ink-soft md:pl-3 md:pr-2.5",
          "after:absolute after:inset-x-0 after:-inset-y-px after:content-['']",
          "transition-[color,background-color,transform,height] duration-300 ease-ios hover:bg-cream-100 hover:text-ink active:scale-95 motion-reduce:transition-none",
          open && "bg-cream-100 text-ink",
          focusRing,
        )}
      >
        {/* Below 380px the code and chevron are enough; the globe gives its room to the CTA label. */}
        <Globe aria-hidden="true" className="size-[18px] shrink-0 max-[379px]:hidden md:size-4" strokeWidth={1.75} />
        <span aria-hidden="true" className="text-[13px] font-semibold leading-none tracking-wide">
          {current.code}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-300 ease-ios motion-reduce:transition-none",
            open && "rotate-180",
          )}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="language-menu"
            id={menuId}
            role="menu"
            aria-label={t.language.label}
            aria-orientation="vertical"
            onKeyDown={onMenuKeyDown}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.1 } }
                : { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.14, ease: "easeOut" } }
            }
            transition={reduce ? { duration: 0.15 } : menuSpring}
            className="absolute right-0 top-[calc(100%+10px)] z-[60] md:top-[calc(100%+17px)] flex w-max min-w-[200px] max-w-[calc(100vw-1.5rem)] origin-top-right flex-col gap-0.5 rounded-2xl border border-line bg-cream-50 p-1.5 shadow-lift"
          >
            {switcherOrder.map((code, index) => {
              const meta = localeMeta[code];
              const selected = code === locale;
              return (
                <a
                  key={code}
                  href={`/${code}`}
                  hrefLang={meta.htmlLang}
                  ref={(el) => {
                    items.current[index] = el;
                  }}
                  role="menuitemradio"
                  aria-checked={selected}
                  lang={meta.htmlLang}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={(event) => choose(event, code)}
                  className={cn(
                    "flex h-11 w-full shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm font-medium whitespace-nowrap",
                    "transition-[color,background-color,transform] duration-200 ease-ios active:scale-[0.98] motion-reduce:transition-none",
                    "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                    selected ? "bg-accent-soft text-accent" : "text-ink hover:bg-cream-100",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-lg text-[11px] font-semibold leading-none",
                      selected ? "bg-cream-50 text-accent" : "bg-cream-100 text-ink-soft",
                    )}
                  >
                    {meta.code}
                  </span>
                  <span className="flex-1">{meta.nativeName}</span>
                  <Check
                    aria-hidden="true"
                    className={cn("size-4 shrink-0", selected ? "opacity-100" : "opacity-0")}
                    strokeWidth={2.25}
                  />
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSwitcher;
