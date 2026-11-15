"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  Building2,
  Code2,
  Compass,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Lift, LiftGroup } from "@/components/sections/shared/scroll-fx";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HighlightId } from "@/lib/data";
import { format, useData, useT } from "@/lib/i18n";
import { ease, reveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Text for each row comes from `t.about.currently[id]`. */
const currentlyRows = [
  { id: "studio", icon: Building2 },
  { id: "fullstack", icon: Code2 },
  { id: "linux", icon: Terminal },
] as const;

interface CardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Desktop scroll drift in px (see `LiftGroup`). 0 keeps the card still. */
  lift?: number;
}

/**
 * Bento card: staggered reveal from the grid (Framer, outer element), a few px
 * of scrubbed scroll drift on desktop (GSAP, middle element). The card itself is
 * static content, so it has no hover or press feedback.
 */
function Card({ children, className, innerClassName, lift = 0 }: CardProps) {
  return (
    <Reveal inherit className={cn("min-w-0", className)}>
      <Lift amount={lift} className="h-full">
        <article
          className={cn(
            "relative h-full overflow-hidden rounded-card border border-line bg-cream-50 p-5 shadow-soft sm:p-7",
            innerClassName
          )}
        >
          {children}
        </article>
      </Lift>
    </Reveal>
  );
}

function CardLabel({ icon: Icon, children, className }: { icon?: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.12em] text-muted uppercase sm:tracking-[0.16em]",
        className
      )}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
      {children}
    </p>
  );
}

interface Highlight {
  id: HighlightId;
  title: string;
  description: string;
}

/**
 * Phone layout of "what I bring": four compact title tiles in a 2x2,
 * and the description of the picked one below at full width, so no paragraph is ever
 * squeezed into half a screen. Below 640px only.
 */
function HighlightTiles({ highlights, className }: { highlights: Highlight[]; className?: string }) {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<HighlightId | null>(null);
  const current = highlights.find((h) => h.id === picked) ?? highlights[0];
  if (!current) return null;

  return (
    <div className={className}>
      <ul className="grid grid-cols-2 gap-2.5">
        {highlights.map((h) => {
          const active = h.id === current.id;
          return (
            <li key={h.id} className="min-w-0">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setPicked(h.id)}
                className={cn(
                  "flex h-full min-h-16 w-full items-start rounded-2xl border p-3 text-left",
                  "transition-[background-color,border-color,scale] duration-300 ease-ios active:scale-[0.97] motion-reduce:transition-none",
                  "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50",
                  active ? "border-accent/30 bg-accent-soft" : "border-line bg-cream"
                )}
              >
                <span className="text-sm leading-snug font-semibold text-ink">{h.title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="mt-2.5 rounded-2xl bg-cream p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.25, ease }}
            className="text-[15px] leading-relaxed text-pretty text-ink-soft"
          >
            {current.description}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/*
 * Grid: 2 columns from mobile up (mixed-span bento), 12 on desktop.
 * Phones (DOM order): story | highlights (2x2 tiles + one description) | values | currently,
 *   each full width: every card holds sentences, only the highlight tiles pair up.
 * 640+: values and currently sit side by side.
 * Desktop (`lg:order-*`): story 7x2 | currently 5 over values 5 | highlights 12.
 */
export function About() {
  const t = useT();
  const { about, profile, startups } = useData();
  const [lead, ...rest] = about.paragraphs;
  const studioName = startups[0]?.name ?? "";

  return (
    <section id="about" aria-labelledby="about-heading" className="relative py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="about-heading"
          {...t.about.heading}
        />

        {/* Desktop drift: the story stays put (the wide bottom card barely moves
            the other way), the right column slides up to 12px against it. */}
        <LiftGroup className="mt-8 sm:mt-16">
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12"
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={reveal}
          >
            {/* Story */}
            <Card
              className="col-span-2 lg:order-1 lg:col-span-7 lg:row-span-2"
              innerClassName="flex flex-col sm:p-9"
            >
              <CardLabel icon={Compass}>{t.about.labels.story}</CardLabel>
              <div className="mt-5 max-w-[65ch] space-y-4 sm:mt-6">
                {lead ? (
                  <p className="font-heading text-[clamp(1.25rem,1.05rem+0.9vw,1.5rem)] leading-snug font-medium tracking-[-0.01em] text-pretty text-ink">
                    {lead}
                  </p>
                ) : null}
                {rest.map((p, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-pretty text-ink-soft sm:text-base">
                    {p}
                  </p>
                ))}
              </div>
              <p className="mt-auto inline-flex items-center gap-3 pt-8 text-sm font-medium text-ink">
                <LogoMark className="h-3.5 w-auto shrink-0 text-accent" />
                <span>
                  {profile.name}
                  <span className="font-normal text-muted"> · {profile.role}</span>
                </span>
              </p>
            </Card>

            {/* Highlights: tap-to-read 2x2 tiles on phones, the full list with descriptions from 640px */}
            <Card lift={-6} className="col-span-2 lg:order-4 lg:col-span-12">
              <CardLabel>{t.about.labels.whatIBring}</CardLabel>
              <HighlightTiles highlights={about.highlights} className="mt-4 sm:hidden" />
              <ul className="mt-6 hidden grid-cols-2 gap-x-8 gap-y-6 sm:grid lg:grid-cols-4 lg:gap-x-6">
                {about.highlights.map((h) => (
                  <li key={h.id} className="min-w-0">
                    <span className="block text-[15px] font-semibold text-ink sm:text-base">{h.title}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft sm:text-sm">
                      {h.description}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            {/* Values: full width on phones, pairs with "currently" from 640px, sits under it on desktop */}
            <Card
              lift={12}
              className="col-span-2 sm:col-span-1 lg:order-3 lg:col-span-5"
              innerClassName="isolate border-ink bg-ink text-cream-50"
            >
              {/* Brand mark as a quiet watermark, cropped by the card's corner. */}
              <div aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-12 -z-10">
                <LogoMark className="h-44 w-auto text-cream-50/[0.06] sm:h-52" />
              </div>
              <p className="text-[13px] font-medium tracking-[0.12em] text-cream-50/60 uppercase sm:tracking-[0.16em]">
                {t.about.labels.howIWork}
              </p>
              <ol className="mt-5 space-y-4">
                {t.about.values.map((value, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-heading text-base leading-6 font-semibold text-sage tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base leading-6 font-medium text-cream-50">
                        {value.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-pretty text-cream-50/65 sm:mt-0">{value.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Currently */}
            <Card lift={12} className="col-span-2 sm:col-span-1 lg:order-2 lg:col-span-5">
              <CardLabel icon={Sparkles}>{t.about.labels.currently}</CardLabel>
              <ul className="mt-5 space-y-4">
                {currentlyRows.map(({ id, icon: Icon }) => (
                  <li key={id} className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base leading-6 font-semibold text-pretty text-ink">
                        {format(t.about.currently[id].label, { name: studioName })}
                      </span>
                      <span className="mt-0.5 block text-sm text-pretty text-muted sm:mt-0">{t.about.currently[id].detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

          </motion.div>
        </LiftGroup>
      </div>
    </section>
  );
}

export default About;
