"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { darkFocusRing } from "@/components/sections/story-parts/chapters";
import { rise } from "@/components/sections/story-parts/scene";
import { ArrowSwap } from "@/components/sections/shared/hover";
import { LogoMark } from "@/components/ui/logo";
import { STUDIO_URL } from "@/lib/data";
import { cn } from "@/lib/utils";

interface OutroProps {
  name: string;
  location: string;
  tagline: string;
  cta: string;
  replay: string;
  onReplay: () => void;
}

/** Closing frame: the name, what he does in three words, and the way to the studio. */
export function Outro({ name, location, tagline, cta, replay, onReplay }: OutroProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.div variants={rise(0.1)}>
        <LogoMark className="h-7 w-auto text-sage sm:h-9" />
      </motion.div>
      <motion.p
        variants={rise(0.2)}
        className="mt-5 text-[12px] font-medium tracking-[0.18em] text-cream-50/60 uppercase sm:text-[13px]"
      >
        {location}
      </motion.p>
      <motion.h3
        variants={rise(0.3)}
        className="mt-2 font-heading text-[clamp(3rem,15vw,4rem)] leading-none font-semibold tracking-[-0.04em] text-cream-50 sm:text-[clamp(4rem,9vw,7rem)]"
      >
        {name}
      </motion.h3>
      <motion.p variants={rise(0.5)} className="mt-4 text-base font-medium text-sage sm:mt-5 sm:text-xl">
        {tagline}
      </motion.p>
      <motion.div variants={rise(0.7)} className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:mt-9">
        <a
          href={STUDIO_URL}
          target="_blank"
          rel="noopener"
          className={cn(
            "group inline-flex h-11 items-center gap-2 rounded-full bg-cream-50 pr-4 pl-5 text-sm font-medium text-ink transition-[background-color,scale] duration-300 ease-ios hover:bg-white active:scale-[0.98] sm:h-12 sm:text-base",
            darkFocusRing
          )}
        >
          {cta}
          <ArrowSwap />
        </a>
        <button
          type="button"
          onClick={onReplay}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-full border border-cream-50/20 px-5 text-sm font-medium text-cream-50 transition-[background-color,border-color,scale] duration-300 ease-ios hover:border-cream-50/40 hover:bg-cream-50/10 active:scale-[0.98] sm:h-12 sm:text-base",
            darkFocusRing
          )}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {replay}
        </button>
      </motion.div>
    </div>
  );
}

export default Outro;
