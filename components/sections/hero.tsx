"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import { useLoaderDone } from "@/components/sections/header/loader-signal";
import { Headline } from "@/components/sections/hero/headline";
import { Actions, Greeting, HeroBackdrop, Location, Rise } from "@/components/sections/hero/parts";
import { useHeroScrollFx } from "@/components/sections/hero/scroll-fx";
import { useData, useLocale, useT } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

/**
 * Opening screen, not one more section: one viewport high, with a single centered
 * block in it.
 *
 *   (fixed header)
 *
 *              greeting                    logo chip and name
 *          GIANT HEADLINE                  the one focal element, in the display face (`font-display`)
 *           two actions
 *            location                      tiny tracked capitals
 *
 * No photo and no card surfaces: everything sits on the dotted page background.
 * Scale contrast does the work: the headline is a condensed poster face (Oswald)
 * at about three times a section heading, everything around it is small.
 *
 * Phones: the section is one screen high up to 36rem, so on tall phones the block
 * does not float in empty space; the bottom padding keeps it clear of the floating
 * tab bar.
 *
 * Motion: one moment on load, the headline words landing crooked and snapping
 * straight (GSAP, see `headline.tsx`); the rest just fades up around it (Framer,
 * top to bottom, gated on the loader). GSAP also scrubs a small parallax on the
 * `data-drift` wrappers (640px+).
 */
export function Hero() {
  const ready = useLoaderDone();
  const scope = useRef<HTMLElement>(null);
  const t = useT();
  const { locale } = useLocale();
  const { profile } = useData();

  useHeroScrollFx(scope);

  return (
    <section
      ref={scope}
      id="home"
      aria-labelledby="home-heading"
      className="relative flex min-h-[min(100svh,36rem)] flex-col overflow-x-clip pt-[4.5rem] pb-24 sm:min-h-svh sm:pt-24 md:pb-12"
    >
      <HeroBackdrop />

      {/* GSAP owns this wrapper and the `data-drift` ones (scroll); Framer owns the nodes inside them. */}
      <div data-hero-content className="relative flex w-full flex-1 flex-col px-4 sm:px-6 lg:px-10">
        <motion.div
          className="flex flex-1 flex-col text-center"
          variants={stagger(0.09, 0.05)}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
        >
          <div className="flex flex-1 flex-col items-center justify-center py-4 sm:py-6">
            <div data-drift={-26} className="w-full">
              <Rise>
                <Greeting />
              </Rise>
              <Rise className="mt-4 sm:mt-6 lg:mt-[clamp(1rem,3vh,2rem)]">
                <Headline key={locale} name={profile.name} words={t.hero.headline} play={ready} />
              </Rise>
            </div>

            <div data-drift={-12} className="mt-5 w-full sm:mt-8 lg:mt-[clamp(1.25rem,3.6vh,2.5rem)]">
              <Rise>
                <Actions />
              </Rise>
              <Rise className="mt-5 sm:mt-7 lg:mt-[clamp(1.25rem,3.4vh,2.25rem)]">
                <Location />
              </Rise>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
