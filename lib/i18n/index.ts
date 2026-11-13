/**
 * i18n entry point.
 *
 *   const { locale, setLocale } = useLocale();
 *   const t = useT();                       // typed dictionary
 *   const { projects, navItems } = useData(); // lib/data merged with the translations
 *   format(t.startups.visit, { name })      // "{name}" placeholders
 *
 * The hooks need a client component ("use client") under <LanguageProvider>, which gets the
 * locale of the route and only that locale's dictionary from the server (`app/[lang]/page.tsx`).
 * Server code loads a dictionary with `getDictionary` from `@/lib/i18n/dictionaries`; it is not
 * re-exported here so the other two dictionaries stay out of the client bundle.
 */
export {
  defaultLocale,
  isLocale,
  LOCALE_CHANGE_EVENT,
  LOCALE_COOKIE,
  localeMeta,
  locales,
  switcherOrder,
  type Locale,
  type LocaleMeta,
} from "./config";
export { format } from "./format";
export { LanguageProvider, useLocale, useT } from "./provider";
export type { Dictionary, HeadingText, HeadlineWord } from "./types";
export {
  getData,
  useData,
  type LocalizedData,
  type LocalizedMilestone,
  type LocalizedNavItem,
  type LocalizedProfile,
  type LocalizedProject,
  type LocalizedStackCategory,
  type LocalizedStartup,
  type LocalizedStat,
} from "./use-data";
