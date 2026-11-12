import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Loader } from "@/components/sections/loader";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import { Startups } from "@/components/sections/startups";
import { LanguageProvider } from "@/lib/i18n/provider";

export default function Page() {
  return (
    // Client-side language context (en / uz / ru). The page itself stays a server component.
    <LanguageProvider>
      <Loader />
      <Header />
      <main className="relative">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Stack />
        <Startups />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
