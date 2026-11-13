import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { en } from "./en";
import { ru } from "./ru";
import { uz } from "./uz";

/** Server-side lookup. Client components read the active dictionary with `useT()` instead. */
export const dictionaries: Record<Locale, Dictionary> = { en, uz, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
