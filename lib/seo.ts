import { profile, stack, STUDIO_COFOUNDER, STUDIO_URL } from "@/lib/data";
import { localeMeta, locales, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { SITE_URL } from "@/lib/site";

/**
 * Public profiles of Asadbek (GitHub, LinkedIn, Telegram …) for `sameAs` in the JSON-LD.
 * Search engines use them to tie this site to the same person. Add full URLs here.
 */
const PERSON_PROFILES: readonly string[] = [];

/** Public profiles of MA STUDIO, for the Organization's `sameAs`. */
const STUDIO_PROFILES: readonly string[] = [];

/** Server-only SEO copy that is not shown on the page (the visible text lives in the dictionaries). */
interface SeoCopy {
  keywords: string[];
  jobTitle: string;
  /** The name as it is written in the other script, for `alternateName`. */
  alternateNames: string[];
  city: string;
  country: string;
  knowsAbout: string[];
  /** Name of this site in search results. */
  siteName: string;
  studioDescription: string;
}

const seo: Record<Locale, SeoCopy> = {
  en: {
    keywords: [
      "Asadbek",
      "Asadbek MA STUDIO",
      "Asadbek mastudio",
      "Asadbek portfolio",
      "Asadbek full-stack developer",
      "full-stack developer portfolio",
      "full-stack developer Tashkent",
      "MA STUDIO co-founder",
      "web developer Uzbekistan",
    ],
    jobTitle: "Full-stack Developer, Co-founder of MA STUDIO",
    alternateNames: ["Асадбек"],
    city: "Tashkent",
    country: "Uzbekistan",
    knowsAbout: ["Full-stack web development", "Web applications", "Linux", "Teaching programming"],
    siteName: "Asadbek — Portfolio",
    studioDescription: "A software studio from Tashkent that designs and builds web apps, digital products and MVPs.",
  },
  uz: {
    keywords: [
      "Asadbek",
      "Asadbek MA STUDIO",
      "Asadbek mastudio",
      "Asadbek portfolio",
      "Asadbek dasturchi",
      "Asadbek dasturchi portfolio",
      "full-stack dasturchi",
      "full-stack dasturchi Toshkent",
      "MA STUDIO co-founder",
      "veb-dasturchi Oʻzbekiston",
    ],
    jobTitle: "Full-stack dasturchi, MA STUDIO co-founder",
    alternateNames: ["Асадбек"],
    city: "Toshkent",
    country: "Oʻzbekiston",
    knowsAbout: ["Full-stack veb-dasturlash", "Veb-ilovalar", "Linux", "Dasturlashdan dars berish"],
    siteName: "Asadbek — Portfolio",
    studioDescription: "Veb-ilovalar, raqamli mahsulotlar va MVP yaratadigan toshkentlik dasturiy studiya.",
  },
  ru: {
    keywords: [
      "Асадбек",
      "Асадбек MA STUDIO",
      "Асадбек mastudio",
      "Асадбек портфолио",
      "Асадбек разработчик",
      "Asadbek MA STUDIO",
      "full-stack разработчик портфолио",
      "full-stack разработчик Ташкент",
      "сооснователь MA STUDIO",
      "веб-разработчик Узбекистан",
    ],
    jobTitle: "Full-stack разработчик, сооснователь MA STUDIO",
    alternateNames: ["Asadbek"],
    city: "Ташкент",
    country: "Узбекистан",
    knowsAbout: ["Full-stack веб-разработка", "Веб-приложения", "Linux", "Преподавание программирования"],
    siteName: "Асадбек — Портфолио",
    studioDescription: "Студия разработки из Ташкента: веб-приложения, цифровые продукты и MVP.",
  },
};

export const getSeo = (locale: Locale): SeoCopy => seo[locale];

/** Absolute URL of a locale's page: one canonical URL per language. */
export const localeUrl = (locale: Locale): string => `${SITE_URL}/${locale}`;

/** hreflang map shared by the metadata and the sitemap. "/" negotiates the language, so it is x-default. */
export function languageAlternates(): Record<string, string> {
  const entries = locales.map((locale) => [localeMeta[locale].htmlLang, localeUrl(locale)] as const);
  return { ...Object.fromEntries(entries), "x-default": SITE_URL };
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const STUDIO_ID = `${STUDIO_URL}/#organization`;

/**
 * Structured data of one locale's page: the site, the profile page, the person it is
 * about and the studio he co-founded. The `@id`s are the same in every language, so
 * the three pages describe one person, one site and one organization.
 */
export function buildJsonLd(locale: Locale, t: Dictionary) {
  const copy = seo[locale];
  const url = localeUrl(locale);
  const inLanguage = localeMeta[locale].htmlLang;
  const image = `${url}/opengraph-image`;
  const tools = stack.flatMap((category) => category.items.map((item) => item.name));

  const studio = {
    "@type": "Organization",
    "@id": STUDIO_ID,
    name: "MA STUDIO",
    alternateName: "MASTUDIO",
    url: STUDIO_URL,
    description: copy.studioDescription,
    address: { "@type": "PostalAddress", addressLocality: copy.city, addressCountry: "UZ" },
    // schema.org has no "founderOf" on Person: the studio lists its founders instead.
    founder: [{ "@id": PERSON_ID }, { "@type": "Person", name: STUDIO_COFOUNDER }],
    ...(STUDIO_PROFILES.length ? { sameAs: [...STUDIO_PROFILES] } : {}),
  };

  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: t.profile.name,
    alternateName: [...new Set([profile.name, ...copy.alternateNames])].filter((name) => name !== t.profile.name),
    url,
    mainEntityOfPage: { "@id": `${url}#profilepage` },
    image,
    jobTitle: copy.jobTitle,
    description: t.meta.description,
    address: { "@type": "PostalAddress", addressLocality: copy.city, addressCountry: "UZ" },
    homeLocation: { "@type": "Place", name: `${copy.city}, ${copy.country}` },
    knowsLanguage: ["uz", "ru", "en"],
    knowsAbout: [...copy.knowsAbout, ...tools],
    alumniOf: { "@type": "EducationalOrganization", name: "Mars IT School" },
    worksFor: { "@id": STUDIO_ID },
    affiliation: { "@id": STUDIO_ID },
    ...(PERSON_PROFILES.length ? { sameAs: [...PERSON_PROFILES] } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: copy.siteName,
    alternateName: ["Asadbek MA STUDIO", "Asadbek portfolio"],
    description: t.meta.description,
    inLanguage: locales.map((l) => localeMeta[l].htmlLang),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    name: t.meta.title,
    description: t.meta.description,
    inLanguage,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
    mentions: { "@id": STUDIO_ID },
  };

  return { "@context": "https://schema.org", "@graph": [website, profilePage, person, studio] };
}
