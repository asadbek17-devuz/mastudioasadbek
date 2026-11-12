"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { ArrowButton, cardSurface, focusRing } from "@/components/sections/shared/hover";
import { Parallax } from "@/components/sections/shared/scroll-fx";
import { linkTarget } from "@/components/sections/shared/social-icons";
import { snapItem } from "@/components/sections/shared/snap-carousel";
import { useT, type LocalizedProject } from "@/lib/i18n";
import { cardHover, cardTap, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { addressOf, BrowserFrame, pad } from "./browser-frame";

interface ProjectCardProps {
  project: LocalizedProject;
  /** Position in the whole list (0-based). Shown as "01", "02"... */
  index: number;
  /** The first card: full width on phones, two columns wide and horizontal on tablets. */
  lead?: boolean;
}

/**
 * Phone and tablet card (below 1024px). Same language as the desktop showcase:
 * the screenshot sits in a browser window that rises out of a tinted stage,
 * with the index number and year under it. The whole card is one link.
 */
export function ProjectCard({ project, index, lead = false }: ProjectCardProps) {
  const reduce = useReducedMotion();
  const t = useT();

  return (
    <Reveal inherit className={cn("flex min-w-0", lead ? "sm:col-span-2" : snapItem)}>
      <motion.a
        href={project.href}
        {...linkTarget(project.href)}
        whileHover={reduce ? undefined : cardHover}
        whileTap={reduce ? undefined : cardTap}
        transition={spring}
        className={cn(
          "flex w-full min-w-0 flex-col rounded-[24px] p-2",
          cardSurface,
          focusRing,
          lead && "sm:flex-row sm:items-stretch"
        )}
      >
        {/* Stage: the browser window peeks out of it, cut off at the bottom edge. */}
        <div
          className={cn(
            "relative overflow-hidden rounded-[18px] bg-gradient-to-b from-accent-soft/70 to-cream-100 px-3.5 pt-3.5",
            lead && "sm:flex sm:w-[54%] sm:shrink-0 sm:items-end sm:px-5 sm:pt-6"
          )}
        >
          <BrowserFrame
            address={addressOf(project)}
            className="w-full rounded-b-none border-b-0 shadow-lift"
            screenClassName={cn(lead && "sm:aspect-[16/11]")}
          >
            <Parallax amount={0.08}>
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes={lead ? "(min-width: 640px) 380px, 100vw" : "(min-width: 640px) 320px, 82vw"}
                className="object-cover transition-transform duration-700 ease-ios group-hover:scale-[1.04]"
              />
            </Parallax>
          </BrowserFrame>
        </div>

        <div className={cn("flex min-w-0 flex-1 flex-col px-2.5 pt-4 pb-2", lead && "sm:px-5 sm:pt-5 sm:pb-3")}>
          <div className="flex items-center gap-3">
            <span className="font-heading text-[2rem] leading-none font-semibold tracking-tight text-ink tabular-nums">
              {pad(index)}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            <span className="text-[13px] font-medium text-muted tabular-nums">{project.year}</span>
          </div>

          <h3
            className={cn(
              "mt-3.5 font-heading text-xl font-semibold tracking-tight text-balance text-ink",
              lead && "sm:text-2xl"
            )}
          >
            {project.title}
          </h3>
          <p className={cn("mt-2 text-[15px] leading-relaxed text-pretty text-ink-soft", !lead && "line-clamp-3")}>
            {project.description}
          </p>

          <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label={t.projects.technologiesAria}>
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-pill border border-line bg-cream px-2.5 py-1 text-[13px] font-medium text-ink-soft"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="text-[15px] font-medium text-ink">{t.projects.viewProject}</span>
            <ArrowButton className="size-10" />
          </div>
        </div>
      </motion.a>
    </Reveal>
  );
}

export default ProjectCard;
