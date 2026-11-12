import type { Locale } from "@/lib/i18n";

/**
 * Hero-only strings that have no key in `lib/i18n/dictionaries`.
 * Everything else in the hero comes from `useT()` / `useData()`.
 */
export interface HeroCopy {
  /** Meta label on the startup card. */
  nowBuilding: string;
  /** One-line description of the academy (the dictionary one is three lines long). */
  academyLine: string;
  /** Accessible name of the startup card link. Placeholder: {name}. */
  openStartup: string;
  /** Title of the tech chips card. */
  stackTitle: string;
  /** Meta line under the stack title. */
  stackNote: string;
  /** Accessible name of the stack card link. */
  openStack: string;
  /** Accessible name of the stats group. */
  statsAria: string;
}

export const heroCopy: Record<Locale, HeroCopy> = {
  en: {
    nowBuilding: "Now building",
    academyLine: "An IT academy that teaches web development from scratch.",
    openStartup: "{name}: see my startups",
    stackTitle: "Everyday stack",
    stackNote: "What I ship with",
    openStack: "See the full stack",
    statsAria: "In numbers",
  },
  uz: {
    nowBuilding: "Hozir qurayapman",
    academyLine: "Veb-dasturlashni noldan oʻrgatadigan IT akademiya.",
    openStartup: "{name}: startaplarimni koʻrish",
    stackTitle: "Kundalik stek",
    stackNote: "Har kuni ishlatadiganlarim",
    openStack: "Toʻliq stekni koʻrish",
    statsAria: "Raqamlarda",
  },
  ru: {
    nowBuilding: "Сейчас строю",
    academyLine: "IT-академия, где учат веб-разработке с нуля.",
    openStartup: "{name}: смотреть мои стартапы",
    stackTitle: "Стек на каждый день",
    stackNote: "С чем работаю постоянно",
    openStack: "Смотреть весь стек",
    statsAria: "В цифрах",
  },
};
