import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { en } from "./en";
import { ru } from "./ru";
import { uz } from "./uz";

/** All three are bundled: together they are a few KB and switching must be instant. */
export const dictionaries: Record<Locale, Dictionary> = { en, uz, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
