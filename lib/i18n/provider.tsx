"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

import { defaultLocale, isLocale, LOCALE_CHANGE_EVENT, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

/*
 * Locale context.
 *
 * The locale is part of the URL (/uz, /ru, /en). The server renders each page in its
 * own language and hands this provider the locale and only that locale's dictionary,
 * so the first paint is already correct: no client-side swap, and the other two
 * dictionaries never reach the browser.
 *
 * Switching language is a client navigation to the same hash on the other locale's
 * URL with the scroll position kept. The choice is stored in a cookie that `proxy.ts`
 * reads when "/" is requested.
 */

const ONE_YEAR = 60 * 60 * 24 * 365;

function rememberLocale(locale: Locale): void {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  } catch {
    // Cookies blocked: the URL still carries the locale.
  }
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

const DictionaryContext = createContext<Dictionary | null>(null);

interface LanguageProviderProps {
  /** Locale of the route, from the `[lang]` segment. */
  locale: Locale;
  /** Dictionary of that locale, loaded on the server. */
  dictionary: Dictionary;
  children: ReactNode;
}

export function LanguageProvider({ locale, dictionary, children }: LanguageProviderProps) {
  const router = useRouter();
  /** The locale the DOM was last laid out for. Starts as what the server rendered. */
  const painted = useRef<Locale>(locale);

  const setLocale = useCallback(
    (next: Locale) => {
      if (!isLocale(next) || next === locale) return;
      rememberLocale(next);
      router.push(`/${next}${window.location.hash}`, { scroll: false });
    },
    [locale, router],
  );

  // Only runs its body when the provider survives a locale navigation; a remount
  // rebuilds every measurement on its own.
  useEffect(() => {
    if (painted.current === locale) return;
    painted.current = locale;
    return afterLocalePaint(locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>
      <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>
    </LocaleContext.Provider>
  );
}

/** Current locale and its setter (navigates to the same place in the other language). */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

/** Typed dictionary for the current locale: `const t = useT(); t.nav.cta`. */
export function useT(): Dictionary {
  const dictionary = useContext(DictionaryContext);
  if (!dictionary) throw new Error("useT() must be used inside <LanguageProvider>.");
  return dictionary;
}
