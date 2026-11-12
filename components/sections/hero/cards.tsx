"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  FolderKanban,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Rocket,
  type LucideIcon,
} from "lucide-react";

import { BentoCard, IconTile } from "@/components/sections/hero/bento-card";
import { heroCopy } from "@/components/sections/hero/copy";
import { CountUp } from "@/components/sections/hero/count-up";
import { Headline } from "@/components/sections/hero/headline";
import { ArrowButton, focusRing } from "@/components/sections/shared/hover";
import { socialIcons } from "@/components/sections/shared/social-icons";
import { format, useData, useLocale, useT, type LocalizedStat } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CardProps {
  /** Grid placement of the cell. */
  className?: string;
  /** Scroll drift in px (see `useHeroScrollFx`). */
  drift?: number;
}

/** Faint dot texture, used as a masked corner detail. Dots take `currentColor`. */
const dots = "bg-[radial-gradient(currentColor_1px,transparent_1.5px)] [background-size:14px_14px]";

/* ------------------------------------------------------------------ */
/* (a) Intro                                                           */
/* ------------------------------------------------------------------ */

export function IntroCard({ ready, className, drift }: CardProps & { ready: boolean }) {
  const reduce = useReducedMotion();
  const t = useT();
  const { locale } = useLocale();
  const { profile } = useData();

  return (
    <BentoCard
      interactive={false}
      drift={drift}
      className={className}
      surfaceClassName="flex flex-col p-5 sm:p-8 lg:p-10"
    >
      {/* Decoration: soft green glow and a dot field fading out from the top-right corner. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -right-24 size-72 rounded-full bg-accent-soft opacity-80 blur-3xl sm:size-96" />
        <div
          className={cn(
            dots,
            "absolute inset-y-0 right-0 w-2/3 text-accent/25 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_62%)]"
          )}
        />
      </div>

      <div className="relative flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2.5 text-[15px] font-medium text-ink-soft sm:text-base">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-accent font-heading text-[15px] font-semibold text-cream shadow-soft"
          >
            {profile.name.charAt(0)}
          </span>
          <span className="min-w-0">
            {t.hero.greetingBefore}
            <span className="font-semibold text-ink">{profile.name}</span>
            {t.hero.greetingAfter}
          </span>
          <motion.span
            aria-hidden="true"
            className="inline-block origin-[70%_70%]"
            animate={ready && !reduce ? { rotate: [0, 16, -8, 14, -4, 10, 0] } : undefined}
            transition={{ duration: 1.4, delay: 0.9, ease: "easeInOut" }}
          >
            👋
          </motion.span>
        </p>

        <p className="hidden shrink-0 items-center gap-1.5 rounded-pill border border-line bg-cream-50/80 px-3 py-1.5 text-[13px] font-medium text-ink-soft sm:inline-flex">
          <MapPin aria-hidden="true" className="size-3.5 text-accent" />
          {profile.location}
        </p>
      </div>

      <Headline key={locale} words={t.hero.headline} play={ready} className="relative mt-5 sm:mt-8 lg:mt-10" />

      <p className="relative mt-4 max-w-[46ch] text-[15px] leading-relaxed text-pretty text-ink-soft sm:mt-5 sm:text-lg">
        {profile.tagline}
      </p>

      <div className="relative mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mt-8 lg:mt-auto lg:pt-10">
        <div className="flex w-full items-center gap-2 min-[380px]:gap-2.5 sm:w-auto sm:gap-3">
          <a
            href="#projects"
            className={cn(
              "group/cta inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-pill bg-ink px-3 min-[380px]:px-4 text-[15px] font-medium whitespace-nowrap text-cream-50 shadow-soft sm:flex-none sm:px-6",
              "transition-[background-color,box-shadow,scale] duration-300 ease-ios hover:bg-accent hover:shadow-lift active:scale-[0.97]",
              focusRing,
              "focus-visible:ring-offset-cream-50"
            )}
          >
            {t.hero.viewProjects}
            <CtaArrow />
          </a>
          <a
            href="#contact"
            className={cn(
              "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-pill border border-ink/15 bg-cream-50 px-3 min-[380px]:px-4 text-[15px] font-medium whitespace-nowrap text-ink sm:flex-none sm:px-6",
              "transition-[background-color,border-color,color,scale] duration-300 ease-ios hover:border-accent/40 hover:bg-accent-soft hover:text-accent active:scale-[0.97]",
              focusRing,
              "focus-visible:ring-offset-cream-50"
            )}
          >
            <Mail aria-hidden="true" className="size-4" />
            {t.hero.contactMe}
          </a>
        </div>

        <ul className="-ml-2.5 flex items-center sm:ml-auto sm:-mr-2.5" aria-label={t.hero.socialsAria}>
          {profile.socials.map((social) => {
            const Icon = socialIcons[social.key];
            return (
              <li key={social.key}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (${social.handle})`}
                  title={social.label}
                  className={cn(
                    "grid size-11 place-items-center rounded-full text-muted",
                    "transition-[color,background-color,scale] duration-300 ease-ios hover:bg-accent-soft hover:text-accent active:scale-[0.94]",
                    focusRing,
                    "focus-visible:ring-offset-cream-50"
                  )}
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </BentoCard>
  );
}

/**
 * Same two-arrow swap as `ArrowSwap`, but tied to the button (`group/cta`): the
 * shared one reacts to the nearest `group`, which here is the whole card.
 */
function CtaArrow() {
  const move = "size-full transition-transform duration-[450ms] ease-ios motion-reduce:transition-none";
  return (
    <span aria-hidden="true" className="relative inline-flex size-3.5 shrink-0 overflow-hidden">
      <ArrowUpRight className={cn(move, "group-hover/cta:translate-x-full group-hover/cta:-translate-y-full")} />
      <ArrowUpRight
        className={cn(
          move,
          "absolute inset-0 -translate-x-full translate-y-full group-hover/cta:translate-x-0 group-hover/cta:translate-y-0"
        )}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* (b) Featured stat, dark                                             */
/* ------------------------------------------------------------------ */

export function FeaturedStatCard({ stat, ready, className, drift }: CardProps & { stat: LocalizedStat; ready: boolean }) {
  return (
    <BentoCard
      drift={drift}
      className={className}
      surfaceClassName="flex min-h-28 items-center justify-between gap-4 border-accent bg-accent p-5 text-cream hover:border-accent sm:min-h-40 sm:flex-col sm:items-start sm:p-6 lg:min-h-0"
    >
      {/* Decoration: soft highlight from the top-left, rings and dots in the far corner. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_0%,rgb(245_240_230/0.2),transparent_60%)]" />
        <div
          className={cn(
            dots,
            "absolute inset-0 text-cream/15 [mask-image:linear-gradient(to_top_left,black,transparent_55%)]"
          )}
        />
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="absolute -right-16 -bottom-20 size-56 text-cream/12 sm:-right-14 sm:-bottom-16 sm:size-60"
        >
          <circle cx="100" cy="100" r="38" stroke="currentColor" />
          <circle cx="100" cy="100" r="62" stroke="currentColor" />
          <circle cx="100" cy="100" r="86" stroke="currentColor" />
          <circle cx="100" cy="100" r="99" stroke="currentColor" strokeDasharray="2 6" />
        </svg>
      </div>

      <IconTile tone="dark" className="relative order-last sm:order-none">
        <Code2 />
      </IconTile>

      <div className="relative min-w-0">
        <CountUp
          value={stat.value}
          suffix={stat.suffix}
          start={ready}
          className="block font-heading text-5xl leading-none font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl"
        />
        <p className="mt-2 text-[15px] leading-snug text-cream/80">{stat.label}</p>
      </div>
    </BentoCard>
  );
}

/* ------------------------------------------------------------------ */
/* (c) Small stat                                                      */
/* ------------------------------------------------------------------ */

const statIcons: Partial<Record<LocalizedStat["id"], LucideIcon>> = {
  projects: FolderKanban,
  students: GraduationCap,
};

export function StatCard({ stat, ready, className, drift }: CardProps & { stat: LocalizedStat; ready: boolean }) {
  const Icon = statIcons[stat.id] ?? Code2;

  return (
    <BentoCard
      drift={drift}
      className={className}
      surfaceClassName="flex flex-col justify-between gap-5 p-4 sm:p-5"
    >
      <IconTile>
        <Icon />
      </IconTile>
      <div className="min-w-0">
        <CountUp
          value={stat.value}
          suffix={stat.suffix}
          start={ready}
          className="block font-heading text-[2rem] leading-none font-semibold tracking-[-0.03em] text-ink sm:text-4xl"
        />
        <p className="mt-1.5 text-[13px] leading-snug text-muted sm:text-sm">{stat.label}</p>
      </div>
    </BentoCard>
  );
}

/* ------------------------------------------------------------------ */
/* (d) Now building                                                    */
/* ------------------------------------------------------------------ */

export function NowBuildingCard({ className, drift }: CardProps) {
  const { locale } = useLocale();
  const { startups } = useData();
  const copy = heroCopy[locale];
  const startup = startups[0];
  if (!startup) return null;

  return (
    <BentoCard
      href="#startups"
      aria-label={format(copy.openStartup, { name: startup.name })}
      drift={drift}
      className={className}
      surfaceClassName="flex flex-col gap-5 p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <IconTile>
          <Rocket />
        </IconTile>
        <p className="min-w-0 flex-1 text-[13px] font-medium text-muted sm:text-sm">{copy.nowBuilding}</p>
        <p className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-accent-soft px-2.5 py-1 text-[13px] font-medium text-accent">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/50 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          {startup.statusLabel}
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-heading text-xl leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
            {startup.name}
          </h2>
          <p className="mt-1.5 text-[15px] leading-snug text-pretty text-ink-soft">{copy.academyLine}</p>
        </div>
        <ArrowButton />
      </div>
    </BentoCard>
  );
}

/* ------------------------------------------------------------------ */
/* (e) Stack                                                           */
/* ------------------------------------------------------------------ */

const dotTones = ["bg-accent", "bg-accent-2", "bg-sage"] as const;

/** Brand names, so they are the same in every language. */
const heroStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Prisma",
  "Framer Motion",
] as const;

export function StackCard({ className, drift }: CardProps) {
  const { locale } = useLocale();
  const copy = heroCopy[locale];

  return (
    <BentoCard
      href="#stack"
      aria-label={copy.openStack}
      drift={drift}
      className={className}
      surfaceClassName="flex flex-col gap-5 p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <IconTile>
          <Layers />
        </IconTile>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-base leading-tight font-semibold tracking-[-0.01em] text-ink sm:text-lg">
            {copy.stackTitle}
          </h2>
          <p className="mt-0.5 text-[13px] leading-snug text-muted">{copy.stackNote}</p>
        </div>
        <ArrowButton />
      </div>

      <ul className="mt-auto flex flex-wrap gap-2">
        {heroStack.map((name, i) => (
          <li
            key={name}
            className="inline-flex items-center gap-2 rounded-pill border border-line bg-cream px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-ink-soft transition-colors duration-300 ease-ios group-hover:border-ink/10 sm:text-sm"
          >
            <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotTones[i % dotTones.length])} />
            {name}
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
