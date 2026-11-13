import type { Locale } from "@/lib/i18n";

/**
 * Hero-only strings that have no key in `lib/i18n/dictionaries`.
 * Everything else in the hero comes from `useT()` / `useData()`.
 */
export interface HeroCopy {
  /** Meta label on the startup card. */
  nowBuilding: string;
  /** One-line description of the studio (the dictionary one is longer). */
  studioLine: string;
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
  /** Eyebrow of the featured (green) stat card. */
  experience: string;
  /** Short lines under that eyebrow: what the experience is in. Desktop only. */
  focus: string[];
}

export const heroCopy: Record<Locale, HeroCopy> = {
  en: {
    nowBuilding: "Now building",
    studioLine: "A studio building web apps, products and MVPs.",
    openStartup: "{name}: see my startup",
    stackTitle: "Everyday stack",
    stackNote: "What I ship with",
    openStack: "See the full stack",
    statsAria: "In numbers",
    experience: "Experience",
    focus: ["Full-stack web development", "Linux", "Teaching"],
  },
  uz: {
    nowBuilding: "Hozir qurayapman",
    studioLine: "Veb-ilovalar, mahsulotlar va MVP yaratadigan studiya.",
    openStartup: "{name}: startapimni koʻrish",
    stackTitle: "Kundalik stek",
    stackNote: "Har kuni ishlatadiganlarim",
    openStack: "Toʻliq stekni koʻrish",
    statsAria: "Raqamlarda",
    experience: "Tajriba",
    focus: ["Full-stack veb-dasturlash", "Linux", "Dars berish"],
  },
  ru: {
    nowBuilding: "Сейчас строю",
    studioLine: "Студия, которая делает веб-приложения, продукты и MVP.",
    openStartup: "{name}: смотреть мой стартап",
    stackTitle: "Стек на каждый день",
    stackNote: "С чем работаю постоянно",
    openStack: "Смотреть весь стек",
    statsAria: "В цифрах",
    experience: "Опыт",
    focus: ["Full-stack веб-разработка", "Linux", "Преподавание"],
  },
};
