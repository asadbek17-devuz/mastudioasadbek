import type { Metadata, Viewport } from "next";
import { Geist, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";

import { DotPattern } from "@/components/ui/dot-pattern";
import { isLocale, localeMeta, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSeo, languageAlternates, localeUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

/*
 * `subsets` only picks which files are preloaded; next/font emits every subset with a
 * unicode-range. Cyrillic is preloaded because Russian is one of the three site
 * languages. Uzbek (Latin) needs nothing extra: oʻ / gʻ use U+02BB, part of "latin".
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/** Display face for headings (`font-heading`). Body stays Geist (`font-sans`). */
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/** /uz, /ru and /en are prerendered; any other first segment is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const { meta, profile } = getDictionary(lang);
  const seo = getSeo(lang);
  const url = localeUrl(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: seo.keywords,
    applicationName: seo.siteName,
    authors: [{ name: profile.name, url }],
    creator: profile.name,
    publisher: profile.name,
    category: "technology",
    alternates: { canonical: url, languages: languageAlternates() },
    openGraph: {
      type: "profile",
      url,
      siteName: seo.siteName,
      title: meta.title,
      description: meta.description,
      locale: localeMeta[lang].ogLocale,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeMeta[l].ogLocale),
      firstName: profile.name,
      username: "asadbek",
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#F5F0E6",
  colorScheme: "light",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={localeMeta[lang].htmlLang}
      className={`${geistSans.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="relative isolate min-h-full bg-cream font-sans text-ink antialiased">
        {/* Site-wide dotted background: fixed behind everything (body is the stacking context). */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
          <DotPattern
            width={24}
            height={24}
            cx={1}
            cy={1}
            cr={1}
            className="fill-ink/20 md:fill-ink/20 [mask-image:radial-gradient(ellipse_120%_100%_at_50%_40%,black_55%,transparent_100%)]"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
