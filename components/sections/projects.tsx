"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { SnapCarousel } from "@/components/sections/shared/snap-carousel";
import { Stagger } from "@/components/sections/shared/stagger";
import { useData, useT } from "@/lib/i18n";
import { ProjectCard } from "./projects-parts/project-card";
import { Showcase } from "./projects-parts/showcase";

/**
 * Projects, in two layouts that share one visual language (browser-window
 * screenshot, big index number, year):
 * - From 1024px: `Showcase`, one row of tall panels where the hovered or
 *   focused panel expands and the rest stay slim.
 * - Below 1024px: cards. Tablets get a 2-column grid with the lead card across
 *   both columns. Phones get the lead card, then a horizontal snap carousel of
 *   full cards (see `SnapCarousel`), so nothing is squeezed into half a column.
 * Only one of the two is displayed, so the hidden one is skipped by assistive
 * tech and its images are not loaded.
 */
export function Projects() {
  const t = useT();
  const { projects } = useData();
  // The first featured project leads; with no featured project the first one does.
  const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
  const [leadProject, ...others] = ordered;

  return (
    <section id="projects" className="py-14 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading {...t.projects.heading} />

        <Showcase projects={ordered} className="mt-16 hidden lg:block" />

        <Stagger className="mt-10 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:hidden">
          {leadProject ? <ProjectCard project={leadProject} index={0} lead /> : null}
          <SnapCarousel>
            {others.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i + 1} />
            ))}
          </SnapCarousel>
        </Stagger>
      </div>
    </section>
  );
}

export default Projects;
