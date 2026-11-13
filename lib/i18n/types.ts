import type {
  HighlightId,
  JourneyId,
  ProjectSlug,
  SectionId,
  SkillLevel,
  StackCategoryId,
  StackSkillId,
  StartupSlug,
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
  /** Document title and meta description (`generateMetadata` in `app/[lang]/layout.tsx`). */
  meta: {
    title: string;
    description: string;
  };
  nav: {
    labels: Record<SectionId, string>;
    /** Header link to the MA STUDIO site. */
    cta: string;
    /** aria-label of the primary <nav>. */
    primaryAria: string;
    /** Keyboard-only link at the very top of the page that jumps to <main>. */
    skip: string;
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
    role: string;
    location: string;
    tagline: string;
  };
  stats: Record<StatId, string>;
  hero: {
    /** Text around the name: "<greetingBefore><name><greetingAfter>". */
    greetingBefore: string;
    greetingAfter: string;
    headline: HeadlineWord[];
    viewProjects: string;
    /** Label of the external link to the MA STUDIO site. */
    studioSite: string;
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
    /** `studio.label` has a {name} placeholder (the studio's name). */
    currently: Record<"studio" | "fullstack" | "linux", { label: string; detail: string }>;
    values: { title: string; text: string }[];
  };
  journey: {
    heading: HeadingText;
    /** Text of the pill on the open-ended last step (the others show their step number). */
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
    items: Record<StartupSlug, { role: string; description: string }>;
    /** Label of the founders row (Asadbek and, once known, his co-founder). */
    foundersLabel: string;
    /** Label above the tiles that say what the studio does. */
    factsLabel: string;
    facts: Record<"webApps" | "products" | "mvp", { title: string; text: string }>;
  };
  /** "From idea to product": the interactive stage scrubber. */
  process: {
    heading: HeadingText;
    /** Accessible name of the slider; its value is read as the stage title. */
    sliderAria: string;
    /** Accessible name of the group of stage buttons. */
    stagesAria: string;
    /** Describes the (decorative) product screen inside the browser frame. */
    frameAria: string;
    stages: Record<"idea" | "wireframe" | "code" | "live", { title: string; text: string }>;
    /** Text inside the mock product screen. */
    mock: {
      /** Sticky note on the sketch. */
      note: string;
      greeting: string;
      sub: string;
      /** Label of the number that ticks up on the live screen. */
      metric: string;
      live: string;
      nav: [string, string];
      rows: [string, string, string];
    };
  };
  /** "Me in one minute": the auto-playing story player right after the hero. */
  story: {
    heading: HeadingText;
    /** Accessible name of the player region. */
    playerAria: string;
    /** Accessible name of the segmented progress bar. */
    progressAria: string;
    /** Value of the progress bar, also announced on manual navigation. Placeholders: {n}, {total}, {title}. */
    progressText: string;
    controls: { play: string; pause: string; previous: string; next: string; replay: string };
    /** The headline is `title` followed by `accent` (shown in the highlight colour). */
    chapters: Record<
      "start" | "marsIntern" | "navi" | "studio" | "teaching" | "today",
      { eyebrow: string; title: string; accent: string; line: string }
    >;
    /** Words inside the code-drawn visuals. */
    visual: {
      hello: string;
      student: string;
      intern: string;
      mentor: string;
      chips: [string, string, string];
    };
    /** Closing frame. */
    outro: { tagline: string; cta: string };
  };
  footer: {
    ctaLink: string;
    facts: string[];
    navAria: string;
    backToTop: string;
  };
}
