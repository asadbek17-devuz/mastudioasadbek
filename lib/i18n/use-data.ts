"use client";

import { useMemo } from "react";

import * as base from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/provider";

/**
 * `lib/data` (hrefs, images, icons, numbers, tech names) merged with the text of one
 * locale. Every object keeps its original fields and shape; text fields are replaced
 * with the translation and a few `*Label` fields are added:
 *
 * - profile: + `city`, `country`
 * - stack: `title` is translated, so key layout maps by `category.id`;
 *   items get `levelLabel` (keep `level` for styling)
 * - startups: + `statusLabel` (keep `status` for styling); `period` is localized
 * - journey: the upcoming step's `year` is localized
 */
export function getData(locale: Locale) {
  const t = getDictionary(locale);

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
      period: `${startup.startYear} — ${startup.endYear ?? t.startups.present}`,
      statusLabel: t.startups.statuses[startup.status],
      metrics: startup.metrics.map((m) => ({ ...m, label: t.metrics[m.id] })),
    })),

    journey: base.journey.map((milestone) => ({
      ...milestone,
      ...t.journey.items[milestone.id],
      year: milestone.upcoming ? t.journey.nextYear : milestone.year,
      metric: milestone.metric
        ? { ...milestone.metric, label: t.metrics[milestone.metric.id] }
        : undefined,
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
 * Localized content for the current locale, memoized per locale:
 * `const { profile, stats, about, projects, stack, startups, journey, navItems } = useData();`
 */
export function useData(): LocalizedData {
  const { locale } = useLocale();
  return useMemo(() => getData(locale), [locale]);
}
