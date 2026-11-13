import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n/config";
import { languageAlternates, localeUrl } from "@/lib/seo";

/** One URL per language, each listing all of them (and x-default) as hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates();
  return locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
