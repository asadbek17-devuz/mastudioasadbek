import { About } from "@/components/sections/about";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Loader } from "@/components/sections/loader";
import { Process } from "@/components/sections/process";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import { Startups } from "@/components/sections/startups";
import { Story } from "@/components/sections/story";
import { SkipLink } from "@/components/ui/skip-link";
import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LanguageProvider } from "@/lib/i18n/provider";
import { buildJsonLd } from "@/lib/seo";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dictionary = getDictionary(lang);
  const jsonLd = buildJsonLd(lang, dictionary);

  return (
    // The server picks the locale from the URL and passes only that dictionary to the client.
    <LanguageProvider locale={lang} dictionary={dictionary}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SkipLink />
      <Loader />
      <Header />
      <main id="main" tabIndex={-1} className="relative outline-none">
        <Hero />
        <Story />
        <About />
        <Journey />
        <Projects />
        <Process />
        <Stack />
        <Startups />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
