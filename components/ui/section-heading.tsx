"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  /** Id of the <h2>, so the section can point at it with `aria-labelledby`. */
  id?: string;
  /** Kept in the dictionaries and accepted here, but no longer shown above the title. */
  eyebrow?: string;
  /** Main title text. */
  title: string;
  /**
   * Optional accent word/phrase rendered after the title: same sans face,
   * semibold, accent green.
   */
  accent?: string;
  /** Optional supporting paragraph. */
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  id,
  title,
  accent,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "flex max-w-2xl flex-col gap-3 sm:gap-4",
        centered && "mx-auto items-center text-center",
        className
      )}
    >
      <h2 id={id} className="font-heading text-[clamp(1.75rem,8vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-ink sm:text-4xl sm:leading-[calc(2.5/2.25)] md:text-5xl md:leading-[1.05]">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="font-semibold text-accent">{accent}</span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-pretty text-ink-soft sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

export default SectionHeading;
