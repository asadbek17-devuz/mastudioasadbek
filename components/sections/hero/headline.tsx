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
  /** Starts the entrance once true (after the page loader finishes). */
  play: boolean;
  /**
   * Whose headline this is. Rendered inside the <h1> for screen readers and search
   * engines; sighted visitors read the name in the greeting right above.
   */
  name?: string;
  className?: string;
}

/** Start angle of each word in degrees; the sign alternates, so neighbours lean opposite ways. */
const TILT = [11, 8, 14, 7, 12, 9, 13];
/** Start skew of each word in degrees, against its tilt. */
const SKEW = [14, 10, 18, 9, 16, 12, 15];
const lean = (i: number) => (i % 2 === 0 ? -1 : 1);

/**
 * Hero headline, in capitals, in the display face (`font-display`).
 *
 * Entrance, the one signature moment of the page: every word starts crooked
 * (tilted 7 to 14 degrees, about half that on phones, alternating sides, skewed the other way, dropped
 * below its line and transparent), then snaps straight with a small overshoot
 * (`back.out`), word after word. Only `transform` and `opacity` move, so the
 * layout never shifts, and the transforms are cleared at the end: the resting
 * state is exactly the static layout. Words start transparent via CSS (no flash
 * before hydration); reduced motion shows them straight away, straight, and the
 * wrapper's fade in `hero.tsx` is the whole entrance.
 *
 * Accent words are the brand ("MA studio"): they keep their own case, in accent
 * green, set like a wordmark, the first part bold and the rest (after the
 * no-break space) light. No highlight band.
 *
 * The timeline targets the word nodes that exist when it is built, so render this
 * with `key={locale}`: a language change remounts it and replays the entrance.
 */
export function Headline({ words, play, name, className }: HeadlineProps) {
  const scope = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!play) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nodes = gsap.utils.toArray<HTMLElement>("[data-word]");
        // On phones a word can be as wide as the screen: lean less, so it stays inside the gutters.
        const k = window.matchMedia("(max-width: 639px)").matches ? 0.55 : 1;
        gsap.set(nodes, { willChange: "transform, opacity" });
        gsap
          .timeline({
            delay: 0.2,
            // Back to the plain static layout: no leftover transform or will-change. The inline
            // `opacity: 1` stays, it is what overrides the transparent start state from CSS.
            onComplete: () => gsap.set(nodes, { clearProps: "transform,willChange" }),
          })
          .fromTo(
            nodes,
            {
              rotate: (i) => lean(i) * TILT[i % TILT.length] * k,
              skewX: (i) => -lean(i) * SKEW[i % SKEW.length] * k,
              yPercent: 55,
              scale: 0.86,
              transformOrigin: (i) => (lean(i) < 0 ? "0% 100%" : "100% 100%"),
            },
            { rotate: 0, skewX: 0, yPercent: 0, scale: 1, duration: 0.95, ease: "back.out(2.2)", stagger: 0.085 },
            0
          )
          .fromTo(nodes, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power1.out", stagger: 0.085 }, 0);
      });
      return () => mm.revert();
    },
    { scope, dependencies: [play] }
  );

  // The brand and the word after it form one group (see the `lg:` class below).
  const groups: { word: HeadlineWord; i: number }[][] = [];
  words.forEach((word, i) => {
    if (words[i - 1]?.accent) groups[groups.length - 1].push({ word, i });
    else groups.push([{ word, i }]);
  });

  return (
    <h1
      id="home-heading"
      ref={scope}
      className={cn(
        // Centered, all caps, condensed, as large as the screen allows. Sized for Oswald; another
        // face needs other numbers.
        //   below 1024px: four lines. The longest one ("SOFTWARE ENGINEER", 8.13em) sets the
        //     size: the width between the gutters (16px, 24px from 640px) divided by 8.4em, so it fills the line
        //     from 320px up without touching the edges. `13svh` caps it on short screens
        //     (phones held sideways, 1024x768). `max-w-[8.5em]` keeps "FULL-STACK SOFTWARE"
        //     (8.93em) from sharing a line.
        //   1024px+: three lines; the size follows the viewport width and height, so the
        //     headline and the rest of the hero share one screen.
        "mx-auto max-w-[8.5em] font-display text-[min(calc((100vw_-_2rem)/8.4),13svh)] sm:text-[min(calc((100vw_-_3rem)/8.4),13svh)] leading-[0.98] font-semibold tracking-[-0.01em] text-balance text-ink uppercase lg:max-w-[10.5em] lg:text-[clamp(4.5rem,min(8.8vw,17vh),11rem)]",
        className
      )}
    >
      {name ? <span className="sr-only">{name}: </span> : null}
      {groups.map((group, g) => (
        // From 1024px a word that follows the brand stays on the brand's line, so it is not orphaned.
        <span key={g} className={group.length > 1 ? "lg:whitespace-nowrap" : undefined}>
          {group.map(({ word, i }) => (
            <span key={`${word.text}-${i}`}>
              <span data-word className="inline-block opacity-0 motion-reduce:opacity-100">
                {word.accent ? <BrandWord text={word.text} /> : word.text}
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

/** "MA studio.": the first chunk is bold, what follows the no-break space is light and keeps its case. */
function BrandWord({ text }: { text: string }) {
  const [head, ...rest] = text.split(" ");
  return (
    <span className="font-bold text-accent normal-case">
      {head}
      {rest.length > 0 ? <span className="font-light">{" " + rest.join(" ")}</span> : null}
    </span>
  );
}
