/** Locale list, default locale and the names shown in the language switcher. */
export const locales = ["en", "uz", "ru"] as const;

export type Locale = (typeof locales)[number];

/** Where "/" goes when neither the cookie nor Accept-Language picks a locale (see `proxy.ts`). */
export const defaultLocale: Locale = "uz";

/** Cookie that holds the visitor's explicit choice; `proxy.ts` reads it when "/" is requested. */
export const LOCALE_COOKIE = "lang";

/**
 * Fired on `window` after the locale changed and React has committed the new text.
 * `event.detail.locale` is the new locale. The provider already refreshes GSAP
 * ScrollTrigger after it; listen only if you cache your own measurements.
 */
export const LOCALE_CHANGE_EVENT = "locale:change";

export interface LocaleMeta {
  /** Short code shown on the trigger, e.g. "EN". */
  code: string;
  /** Name of the language in that language. */
  nativeName: string;
  /** BCP 47 tag for `<html lang>` and `Intl`. */
  htmlLang: string;
  /** Open Graph locale, e.g. "ru_RU". */
  ogLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  uz: { code: "UZ", nativeName: "Oʻzbekcha", htmlLang: "uz", ogLocale: "uz_UZ" },
  ru: { code: "RU", nativeName: "Русский", htmlLang: "ru", ogLocale: "ru_RU" },
  en: { code: "EN", nativeName: "English", htmlLang: "en", ogLocale: "en_US" },
};

/** Order of the options in the switcher menu. */
export const switcherOrder: readonly Locale[] = ["uz", "ru", "en"];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
