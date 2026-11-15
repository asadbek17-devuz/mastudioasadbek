"use client";

import { AppWindow, ArrowUpRight, Boxes, Rocket } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowSwap, focusRing } from "@/components/sections/shared/hover";
import { Parallax, ScrubScale } from "@/components/sections/shared/scroll-fx";
import { linkTarget } from "@/components/sections/shared/social-icons";
import { STUDIO_COFOUNDER, STUDIO_COFOUNDER_URL } from "@/lib/data";
import { format, useData, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** What the studio does. Text for each tile comes from `t.startups.facts[id]`. */
const factTiles = [
  { id: "webApps", icon: AppWindow },
  { id: "products", icon: Boxes },
  { id: "mvp", icon: Rocket },
] as const;

/**
 * One startup, one full-width feature card.
 * - < 1024: a single column: copy, founders, link, then the fact tiles.
 * - lg+: copy on the left (7/12), the fact tiles stacked on the right (5/12) and stretched
 *   to the height of the copy, so neither column ends in empty space.
 */
export function Startups() {
  const t = useT();
  const { startups, profile } = useData();
  const startup = startups[0];
  // Each founder's name leads to their own portfolio: this page for Asadbek, an external site for Miraziz.
  const founders = [
    { name: profile.name, href: "#home", external: false },
    { name: STUDIO_COFOUNDER, href: STUDIO_COFOUNDER_URL, external: true },
  ];

  return (
    <section id="startups" aria-labelledby="startups-heading" className="py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading id="startups-heading" {...t.startups.heading} />

        {startup ? (
          <Reveal className="mt-10 min-w-0 sm:mt-16">
            {/* GSAP: the card scales 0.96 -> 1 as it enters, the dots drift behind the copy. */}
            <ScrubScale from={0.96} className="w-full min-w-0">
              <article className="relative isolate grid w-full gap-8 overflow-hidden rounded-card bg-accent p-5 text-cream-50 shadow-lift sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
                <Parallax amount={0.14} className="pointer-events-none -z-10">
                  <DotPattern
                    width={18}
                    height={18}
                    cr={0.9}
                    className="fill-cream-50/15 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)] md:fill-cream-50/15"
                  />
                </Parallax>
                {/* Brand mark as a quiet watermark, cropped by the bottom-left corner. */}
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-10 -z-10">
                  <LogoMark className="h-56 w-auto text-cream-50/[0.06] sm:h-72" />
                </div>

                <div className="flex min-w-0 flex-col lg:col-span-7">
                  <p className="text-sm font-medium tracking-tight text-sage sm:text-base">{startup.role}</p>
                  <h3 className="mt-2 font-heading text-[clamp(2rem,1.5rem+2.4vw,3.25rem)] leading-none font-semibold tracking-tight">
                    {startup.name}
                  </h3>
                  <p className="mt-5 max-w-xl leading-relaxed text-pretty text-cream-50/85 sm:text-lg sm:leading-relaxed">
                    {startup.description}
                  </p>

                  <dl className="mt-8 sm:mt-10">
                    <dt className="text-[13px] font-medium tracking-[0.12em] text-cream-50/60 uppercase">
                      {t.startups.foundersLabel}
                    </dt>
                    <dd className="mt-2.5">
                      <ul className="flex flex-wrap items-center gap-3">
                        {founders.map(({ name, href, external }) => {
                          const chip =
                            "group/founder inline-flex min-h-12 max-w-full min-w-0 items-center gap-3 rounded-pill border border-cream-50/15 bg-cream-50/5 py-1.5 pr-5 pl-1.5 text-base font-medium sm:text-lg";
                          const body = (
                            <>
                              <span
                                aria-hidden="true"
                                className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-50 font-heading text-base font-semibold text-accent"
                              >
                                {name.charAt(0)}
                              </span>
                              <span className="truncate">{name}</span>
                            </>
                          );
                          return (
                            <li key={name} className="max-w-full min-w-0">
                              {href ? (
                                <a
                                  href={href}
                                  {...(external ? { target: "_blank", rel: "noopener" } : {})}
                                  className={cn(
                                    chip,
                                    "transition-[background-color,border-color,scale] duration-300 ease-ios hover:border-cream-50/40 hover:bg-cream-50/15 active:scale-[0.97]",
                                    focusRing,
                                    "focus-visible:ring-cream-50 focus-visible:ring-offset-accent"
                                  )}
                                >
                                  {body}
                                  <ArrowUpRight
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-cream-50/60 transition-transform duration-300 ease-ios group-hover/founder:translate-x-0.5 group-hover/founder:-translate-y-0.5 motion-reduce:transition-none"
                                  />
                                </a>
                              ) : (
                                <span className={chip}>{body}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </dd>
                  </dl>

                  {startup.href ? (
                    <a
                      href={startup.href}
                      {...linkTarget(startup.href)}
                      className={cn(
                        "group mt-8 inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-pill bg-cream-50 px-5 py-2.5 text-sm font-medium text-accent shadow-soft transition-[background-color,box-shadow,scale] duration-300 ease-ios hover:bg-cream hover:shadow-lift active:scale-[0.97] sm:mt-10",
                        focusRing,
                        "focus-visible:ring-cream-50 focus-visible:ring-offset-accent"
                      )}
                    >
                      {format(t.startups.visit, { name: startup.name })}
                      <ArrowSwap />
                    </a>
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-col lg:col-span-5">
                  <p className="text-[13px] font-medium tracking-[0.12em] text-cream-50/60 uppercase">
                    {t.startups.factsLabel}
                  </p>
                  <ul className="mt-3 grid flex-1 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-1 lg:grid-rows-3">
                    {factTiles.map(({ id, icon: Icon }) => (
                      <li
                        key={id}
                        className="flex min-w-0 items-start gap-3 rounded-2xl border border-cream-50/15 bg-cream-50/5 p-4 sm:flex-col lg:flex-row lg:items-center lg:px-5"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream-50/10 text-sage">
                          <Icon className="size-4" aria-hidden="true" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-base leading-6 font-semibold">{t.startups.facts[id].title}</span>
                          <span className="mt-0.5 block text-sm leading-snug text-pretty text-cream-50/70">
                            {t.startups.facts[id].text}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrubScale>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

export default Startups;
