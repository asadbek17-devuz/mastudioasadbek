/**
 * i18n entry point.
 *
 *   const { locale, setLocale } = useLocale();
 *   const t = useT();                       // typed dictionary
 *   const { projects, navItems } = useData(); // lib/data merged with the translations
 *   format(t.startups.visit, { name })      // "{name}" placeholders
 *
 * The hooks need a client component ("use client") under <LanguageProvider>.
 */
export {
  defaultLocale,
  isLocale,
  LOCALE_CHANGE_EVENT,
  LOCALE_STORAGE_KEY,
  localeMeta,
  locales,
  switcherOrder,
  type Locale,
  type LocaleMeta,
} from "./config";
export { dictionaries, getDictionary } from "./dictionaries";
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
