"use client";

import { useMemo } from "react";

import * as base from "@/lib/data";
import { useT } from "@/lib/i18n/provider";
import type { Dictionary } from "@/lib/i18n/types";

/**
 * `lib/data` (hrefs, images, icons, numbers, tech names) merged with the text of one
 * locale. Every object keeps its original fields and shape; text fields are replaced
 * with the translation and a few `*Label` fields are added:
 *
 * - stack: `title` is translated, so key layout maps by `category.id`;
 *   items get `levelLabel` (keep `level` for styling)
 * - journey: the upcoming step's `year` pill is localized
 */
export function getData(t: Dictionary) {
  return {
    profile: { ...base.profile, ...t.profile },

    stats: base.stats.map((stat) => ({ ...stat, label: t.stats[stat.id] })),

    about: {
      paragraphs: t.about.paragraphs,
      highlights: base.about.highlights.map((h) => ({ ...h, ...t.about.highlights[h.id] })),
    },

    projects: base.projects.map((project) => ({ ...project, ...t.projects.items[project.slug] })),

    stack: base.stack.map((category) => ({
      ...category,
      // Widened from the English literal union: it is display text now.
      title: t.stack.categories[category.id].title as string,
      description: t.stack.categories[category.id].description,
      items: category.items.map((item) => ({
        ...item,
        name: item.labelId ? t.stack.skills[item.labelId] : item.name,
        levelLabel: item.level ? t.stack.levels[item.level] : undefined,
      })),
    })),

    startups: base.startups.map((startup) => ({
      ...startup,
      ...t.startups.items[startup.slug],
    })),

    journey: base.journey.map((milestone) => ({
      ...milestone,
      ...t.journey.items[milestone.id],
      year: milestone.upcoming ? t.journey.nextYear : milestone.year,
    })),

    navItems: base.navItems.map((item) => ({ ...item, label: t.nav.labels[item.id] })),
  };
}

export type LocalizedData = ReturnType<typeof getData>;
export type LocalizedProfile = LocalizedData["profile"];
export type LocalizedStat = LocalizedData["stats"][number];
export type LocalizedProject = LocalizedData["projects"][number];
export type LocalizedStackCategory = LocalizedData["stack"][number];
export type LocalizedStartup = LocalizedData["startups"][number];
export type LocalizedMilestone = LocalizedData["journey"][number];
export type LocalizedNavItem = LocalizedData["navItems"][number];

/**
 * Localized content for the current locale, memoized per dictionary:
 * `const { profile, stats, about, projects, stack, startups, journey, navItems } = useData();`
 */
export function useData(): LocalizedData {
  const t = useT();
  return useMemo(() => getData(t), [t]);
}
