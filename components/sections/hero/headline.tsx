"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { HeadlineWord } from "@/lib/i18n";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

interface HeadlineProps {
  /** Words of the headline, from `t.hero.headline`. */
  words: HeadlineWord[];
  /** Starts the reveal once true (after the page loader finishes). */
  play: boolean;
  /**
   * Whose headline this is. Rendered inside the <h1> for screen readers and search
   * engines; sighted visitors read the name in the greeting right above.
   */
  name?: string;
  className?: string;
}

/**
 * Hero headline. Each word sits in an overflow-hidden mask and slides up with
 * GSAP, then the accent-mark highlight draws in under the accent words. Words
 * start hidden via CSS (no flash before hydration); reduced motion gets the
 * final state straight from CSS.
 *
 * The timeline targets the word nodes that exist when it is built, so render this
 * with `key={locale}`: a language change remounts it and replays the reveal.
 */
export function Headline({ words, play, name, className }: HeadlineProps) {
  const scope = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!play) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ delay: 0.25 })
          .fromTo(
            "[data-word]",
            // `y: 0` clears the px offset GSAP parses from the CSS translateY(110%) start state.
            { y: 0, yPercent: 110, rotate: 3 },
            { y: 0, yPercent: 0, rotate: 0, duration: 0.9, ease: "expo.out", stagger: 0.055 }
          )
          .fromTo(
            "[data-mark]",
            { backgroundSize: "0% 0.32em" },
            { backgroundSize: "100% 0.32em", duration: 0.55, ease: "power3.out", stagger: 0.1 },
            "-=0.4"
          );
      });
      return () => mm.revert();
    },
    { scope, dependencies: [play] }
  );

  return (
    <h1
      id="home-heading"
      ref={scope}
      className={cn(
        // Sized for the intro card (about 290px wide on a 360px phone, 650px on desktop).
        "font-heading text-[clamp(2rem,9.4vw,2.5rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-5xl sm:leading-[1.02] lg:text-[3.5rem]",
        className
      )}
    >
      {name ? <span className="sr-only">{name}: </span> : null}
      {words.map((word, i) => (
        <span key={`${word.text}-${i}`}>
          <span className="-mb-[0.12em] inline-block overflow-hidden pr-[0.04em] pb-[0.12em] align-bottom">
            <span
              data-word
              className="inline-block origin-bottom-left [transform:translateY(110%)] motion-reduce:[transform:none]"
            >
              {word.accent ? (
                <span data-mark className="accent-mark text-accent">
                  {word.text}
                </span>
              ) : (
                word.text
              )}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
