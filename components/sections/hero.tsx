"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import { useLoaderDone } from "@/components/sections/header/loader-signal";
import {
  FeaturedStatCard,
  IntroCard,
  NowBuildingCard,
  StackCard,
  StatCard,
} from "@/components/sections/hero/cards";
import { heroCopy } from "@/components/sections/hero/copy";
import { useHeroScrollFx } from "@/components/sections/hero/scroll-fx";
import { useData, useLocale } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

/**
 * Bento hero, no photo. Five kinds of opaque cards on the dotted page background:
 *
 *   <640   2 cols:  intro 2 | years 2 | internships 1 + startup 1 | now building 2 | stack 2
 *   640+   6 cols:  intro 6 | years 2 + internships 2 + startup 2 | now building 6 | stack 6
 *   1024+  12 cols: intro 8 (two rows) next to years 4 over internships 2 + startup 2,
 *                   then now building 5 + stack 7. Row 1 is `1fr`, so the years card
 *                   takes the spare height and the two small stats stay content-high.
 *
 * The two small stats share one drift value, so they stay level while scrolling.
 *
 * Motion: Framer staggers the cards in once the loader is done, GSAP reveals the
 * headline word by word and scrubs a small parallax on the card wrappers (640px+).
 */
export function Hero() {
  const ready = useLoaderDone();
  const scope = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const { stats } = useData();
  const [years, internships, startup] = stats;

  useHeroScrollFx(scope);

  return (
    <section ref={scope} id="home" aria-labelledby="home-heading" className="relative pt-24 pb-14 sm:pt-32 sm:pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* GSAP owns this wrapper (fade and scale on scroll); Framer owns the grid inside. */}
        <div data-hero-grid>
          <motion.div
            className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto]"
            variants={stagger(0.08, 0.05)}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
          >
            <IntroCard ready={ready} drift={-10} className="col-span-2 sm:col-span-6 lg:col-span-8 lg:row-span-2" />

            <div
              role="group"
              aria-label={heroCopy[locale].statsAria}
              className="col-span-2 grid grid-cols-subgrid gap-y-3 sm:col-span-6 sm:gap-y-4 lg:col-span-4 lg:row-span-2 lg:grid-rows-subgrid"
            >
              {years ? (
                <FeaturedStatCard stat={years} ready={ready} drift={-24} className="col-span-2 lg:col-span-4" />
              ) : null}
              {internships ? <StatCard stat={internships} ready={ready} drift={-18} className="sm:col-span-2" /> : null}
              {startup ? <StatCard stat={startup} ready={ready} drift={-18} className="sm:col-span-2" /> : null}
            </div>

            <NowBuildingCard drift={14} className="col-span-2 sm:col-span-6 lg:col-span-5" />
            <StackCard drift={24} className="col-span-2 sm:col-span-6 lg:col-span-7" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
