/** Locale list, default locale and the names shown in the language switcher. */
export const locales = ["en", "uz", "ru"] as const;

export type Locale = (typeof locales)[number];

/** The locale the server renders. Change it here only. */
export const defaultLocale: Locale = "en";

/** localStorage key that holds the visitor's explicit choice. */
export const LOCALE_STORAGE_KEY = "lang";

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
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  uz: { code: "UZ", nativeName: "Oʻzbekcha", htmlLang: "uz" },
  ru: { code: "RU", nativeName: "Русский", htmlLang: "ru" },
  en: { code: "EN", nativeName: "English", htmlLang: "en" },
};

/** Order of the options in the switcher menu. */
export const switcherOrder: readonly Locale[] = ["uz", "ru", "en"];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
