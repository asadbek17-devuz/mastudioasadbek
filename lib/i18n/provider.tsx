"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  defaultLocale,
  isLocale,
  LOCALE_CHANGE_EVENT,
  LOCALE_STORAGE_KEY,
  localeMeta,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Dictionary } from "@/lib/i18n/types";

/*
 * Locale store.
 *
 * The page is static, so the server always renders `defaultLocale`. On the client
 * `useSyncExternalStore` hydrates with the same default (getServerSnapshot) and then
 * re-renders with the stored / detected locale, so there is no hydration mismatch.
 * The intro loader covers the page while that swap happens.
 */

let current: Locale | null = null;
const listeners = new Set<() => void>();

function readStored(): Locale | null {
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    // Storage blocked (private mode, sandboxed iframe).
    return null;
  }
}

/** First visit: uz* -> uz, ru* -> ru, anything else -> default. */
function detect(): Locale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const language of languages) {
    const base = language?.toLowerCase().split("-")[0];
    if (base === "uz" || base === "ru") return base;
    if (base === defaultLocale) return defaultLocale;
  }
  return defaultLocale;
}

function getSnapshot(): Locale {
  if (current === null) current = readStored() ?? detect();
  return current;
}

const getServerSnapshot = (): Locale => defaultLocale;

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  // Keep other open tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== LOCALE_STORAGE_KEY || !isLocale(event.newValue)) return;
    if (event.newValue === current) return;
    current = event.newValue;
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

function setLocale(locale: Locale): void {
  if (!isLocale(locale) || locale === current) return;
  current = locale;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // The choice still applies for this visit.
  }
  listeners.forEach((notify) => notify());
}

/**
 * Text heights change with the language, so every scroll position GSAP cached is
 * stale. Runs after the new text has painted, and again once any newly needed font
 * files (Cyrillic) have loaded.
 */
function afterLocalePaint(locale: Locale): () => void {
  let cancelled = false;

  const refresh = async () => {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    if (!cancelled) ScrollTrigger.refresh();
  };

  let inner = 0;
  const outer = requestAnimationFrame(() => {
    inner = requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: { locale } }));
      void refresh();
      void document.fonts?.ready.then(() => {
        if (!cancelled) void refresh();
      });
    });
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(outer);
    cancelAnimationFrame(inner);
  };
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  /** The locale the DOM was last laid out for. Starts as what the server rendered. */
  const painted = useRef<Locale>(defaultLocale);

  useEffect(() => {
    document.documentElement.lang = localeMeta[locale].htmlLang;
    if (painted.current === locale) return;
    painted.current = locale;
    return afterLocalePaint(locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Current locale and its setter. Must be used inside a client component. */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

/** Typed dictionary for the current locale: `const t = useT(); t.nav.cta`. */
export function useT(): Dictionary {
  return getDictionary(useContext(LocaleContext).locale);
}
