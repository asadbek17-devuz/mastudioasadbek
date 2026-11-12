import type {
  HighlightId,
  JourneyId,
  MetricId,
  ProjectSlug,
  SectionId,
  SkillLevel,
  StackCategoryId,
  StackSkillId,
  StartupSlug,
  StartupStatus,
  StatId,
} from "@/lib/data";

/** Props of `<SectionHeading>`: the accent phrase is always rendered right after the title. */
export interface HeadingText {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}

export interface HeadlineWord {
  text: string;
  /** Highlighted in accent green with the marker underline. */
  accent?: boolean;
}

/**
 * Every user-facing string on the site. All three dictionaries must satisfy this
 * type, so a missing or misspelled key is a compile error.
 *
 * Strings with `{name}`-style placeholders are filled with `format()` from `@/lib/i18n`.
 */
export interface Dictionary {
  nav: {
    labels: Record<SectionId, string>;
    /** Header call-to-action. */
    cta: string;
    /** aria-label of the primary <nav>. */
    primaryAria: string;
    /** Logo link, read as "<name>, <homeAria>". */
    homeAria: string;
  };
  language: {
    /** Accessible name of the switcher and its menu. */
    label: string;
  };
  loader: {
    label: string;
  };
  profile: {
    name: string;
    fullName: string;
    role: string;
    location: string;
    city: string;
    country: string;
    tagline: string;
    intro: string;
    avatarAlt: string;
  };
  stats: Record<StatId, string>;
  /** Metric labels shared by the startups and journey sections. */
  metrics: Record<MetricId, string>;
  hero: {
    /** Text around the name: "<greetingBefore><name><greetingAfter>". */
    greetingBefore: string;
    greetingAfter: string;
    headline: HeadlineWord[];
    viewProjects: string;
    contactMe: string;
    socialsAria: string;
    /** Photo badge, a full phrase because the city is declined in uz/ru. */
    basedIn: string;
    nowEyebrow: string;
    nowLine: string;
    /** Placeholders: {name}. */
    nowAria: string;
    stackEyebrow: string;
    stackTitle: string;
    stackAria: string;
  };
  about: {
    heading: HeadingText;
    paragraphs: string[];
    highlights: Record<HighlightId, { title: string; description: string }>;
    labels: {
      story: string;
      howIWork: string;
      currently: string;
      whatIBring: string;
    };
    /** `academy.label` has a {name} placeholder (the first startup's name). */
    currently: Record<"academy" | "clients" | "learning", { label: string; detail: string }>;
    values: { title: string; text: string }[];
  };
  journey: {
    heading: HeadingText;
    /** Replaces the year on the open-ended last step. */
    nextYear: string;
    nextCta: string;
    items: Record<JourneyId, { title: string; description: string; tag: string }>;
  };
  projects: {
    heading: HeadingText;
    technologiesAria: string;
    /** Primary action of a project card / the active showcase panel. */
    viewProject: string;
    /** Label of the repository button. */
    code: string;
    /** One short word inside the cursor bubble of the desktop showcase. */
    cursor: string;
    showcaseAria: string;
    /** Placeholders: {n}, {total}, {title}. */
    itemAria: string;
    previous: string;
    next: string;
    items: Record<ProjectSlug, { title: string; description: string; imageAlt: string }>;
  };
  stack: {
    heading: HeadingText;
    legendAria: string;
    /** The interactive pile of tool pills. */
    playground: {
      /** aria-label of the category filter. */
      filterAria: string;
      all: string;
      /** Info line while no category is selected. */
      allInfo: string;
      /** Placeholders: {count}. */
      toolCount: string;
      /** aria-label of the screen-reader list of tools. */
      listAria: string;
      shake: string;
      reset: string;
      /** Hint inside the arena on mouse devices. */
      hintPointer: string;
      /** Hint inside the arena on touch devices. */
      hintTouch: string;
      legendCategories: string;
      legendLevels: string;
    };
    levels: Record<SkillLevel, string>;
    categories: Record<StackCategoryId, { title: string; description: string }>;
    skills: Record<StackSkillId, string>;
  };
  startups: {
    heading: HeadingText;
    /** Placeholders: {name}. */
    visit: string;
    /** Used in the period, e.g. "2022 — Present". */
    present: string;
    statuses: Record<StartupStatus, string>;
    items: Record<StartupSlug, { role: string; description: string }>;
  };
  contact: {
    heading: HeadingText;
    remote: string;
    formTitle: string;
    formNote: string;
    socialsAria: string;
    form: {
      labels: { name: string; email: string; message: string };
      placeholders: { name: string; email: string; message: string };
      messageHint: string;
      errors: { name: string; email: string; message: string };
      note: string;
      send: string;
      sending: string;
      sent: string;
      sentStatus: string;
      /** Placeholders: {name}. */
      subject: string;
    };
    copy: {
      copy: string;
      copied: string;
      copyAria: string;
      copiedAria: string;
      copiedStatus: string;
      emailDirect: string;
    };
  };
  footer: {
    tagline: string;
    navAria: string;
    navigate: string;
    elsewhere: string;
    backToTop: string;
    rights: string;
  };
}
