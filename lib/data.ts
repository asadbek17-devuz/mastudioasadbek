/** Single source of content for every section. */
import {
  Briefcase,
  Code2,
  Compass,
  FolderKanban,
  GraduationCap,
  Home,
  Layers,
  Rocket,
  Route,
  Terminal,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SectionId = "home" | "about" | "journey" | "projects" | "stack" | "startups";

/*
 * Stable ids. The translated text for every item lives in `lib/i18n/dictionaries/*`
 * and is keyed by these ids, so adding an item here is a compile error until all
 * three dictionaries have its text. The English strings below stay as the fallback
 * for code that reads this file directly; localized UI should use `useData()`.
 */
export type HighlightId = "fullstack" | "linux" | "founder" | "teaching";
export type ProjectSlug = "learnly" | "pulse-analytics" | "studio-site" | "devtrack" | "teamspace";
export type StackCategoryId = "frontend" | "backend" | "tools";
export type StartupSlug = "mastudio";
export type JourneyId =
  | "student"
  | "mars-intern"
  | "navi-intern"
  | "mastudio"
  | "teaching"
  | "fullstack"
  | "next";

export interface Profile {
  name: string;
  role: string;
  location: string;
  tagline: string;
}

export interface About {
  paragraphs: string[];
  highlights: { id: HighlightId; title: string; description: string }[];
}

export interface Project {
  slug: ProjectSlug;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  /** Omit when there is no public page: the card then renders without a link. */
  href?: string;
  repo?: string;
  year: number;
  featured?: boolean;
}

export type SkillLevel = "Expert" | "Advanced" | "Comfortable" | "Learning";

export interface StackItem {
  name: string;
  level?: SkillLevel;
}

export interface StackCategory {
  id: StackCategoryId;
  title: "Frontend" | "Backend" | "Tools & DevOps";
  description: string;
  items: StackItem[];
}

export interface Startup {
  slug: StartupSlug;
  name: string;
  role: string;
  description: string;
  /** Omit when there is no public page: the card then renders without a link. */
  href?: string;
}

export interface NavItem {
  id: SectionId;
  label: string;
  /** lucide-react icon component */
  icon: LucideIcon;
}

export interface JourneyMilestone {
  id: JourneyId;
  /** Text of the pill: the step number ("01"…), since the path is told in order, not by year. */
  year: string;
  title: string;
  description: string;
  /** lucide-react icon component */
  icon: LucideIcon;
  tag?: string;
  /** Accent styling for the biggest milestones. */
  highlight?: boolean;
  /** Marks the open-ended "what's next" step (dashed line, outlined node, links to the MA STUDIO site). */
  upcoming?: boolean;
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/** External site of MA STUDIO, the studio Asadbek co-founded. */
export const STUDIO_URL = "https://mastudio.uz";

/** Name of the friend Asadbek founded MA STUDIO with: the second entry of the "Founders" row. */
export const STUDIO_COFOUNDER = "Miraziz";

/** Miraziz's own portfolio. While empty, his name in the "Founders" row is plain text, not a link. */
export const STUDIO_COFOUNDER_URL = "";

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const profile: Profile = {
  name: "Asadbek",
  role: "Full-stack Developer, Co-founder of MA\u00A0STUDIO",
  location: "Tashkent, Uzbekistan",
  tagline:
    "I'm a full-stack developer with 3+ years of experience across the web and Linux. I studied at Mars IT School, interned there and at Navi Global, then co-founded the MA\u00A0STUDIO studio with a friend.",
};

export const about: About = {
  paragraphs: [
    "I'm Asadbek, a full-stack developer from Tashkent. I learned to code at Mars IT School and then stayed on there as an intern.",
    "My next internship was at Navi Global, and after that a friend and I founded our startup, MA\u00A0STUDIO. Today I have 3+ years of experience: I build web apps end to end, from the interface to the server, and I'm at home on Linux.",
    "I have teaching experience too. Explaining something to another person is the fastest way to find out how well I understand it myself.",
  ],
  highlights: [
    {
      id: "fullstack",
      title: "Full stack",
      description: "From the interface to the server: I can build a web app end to end.",
    },
    {
      id: "linux",
      title: "Linux",
      description: "I'm comfortable in the terminal and on servers.",
    },
    {
      id: "founder",
      title: "Co-founder",
      description: "I founded MA\u00A0STUDIO together with a friend, and we keep growing it.",
    },
    {
      id: "teaching",
      title: "Teaching experience",
      description: "I have taught, so I know how to explain hard things simply.",
    },
  ],
};

export const projects: Project[] = [
  {
    slug: "learnly",
    title: "Learnly LMS",
    description:
      "A learning platform with courses, homework review, live progress and payments.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    image: unsplash("photo-1460925895917-afdab827c52f"),
    imageAlt: "Analytics dashboard on a laptop screen",
    year: 2025,
    featured: true,
  },
  {
    slug: "pulse-analytics",
    title: "Pulse Analytics",
    description:
      "A real-time dashboard that turns sales and traffic data into simple, readable charts for small online shops.",
    tags: ["React", "Node.js", "WebSockets", "Charts"],
    image: unsplash("photo-1551288049-bebda4e38f71"),
    imageAlt: "Data charts and graphs on a screen",
    year: 2025,
    featured: true,
  },
  {
    slug: "studio-site",
    title: "Studio Website",
    description:
      "A fast marketing site with a headless CMS, so the team can publish pages and case studies without a developer.",
    tags: ["Next.js", "Tailwind CSS", "Sanity", "Vercel"],
    image: unsplash("photo-1498050108023-c5249f4df085"),
    imageAlt: "Laptop with code editor open on a desk",
    year: 2024,
  },
  {
    slug: "devtrack",
    title: "DevTrack API",
    description:
      "A REST and webhook API for tracking tasks across teams, with role-based access and audit logs.",
    tags: ["NestJS", "PostgreSQL", "Redis", "Docker"],
    image: unsplash("photo-1555066931-4365d14bab8c"),
    imageAlt: "Close-up of colorful code on a monitor",
    year: 2024,
  },
  {
    slug: "teamspace",
    title: "TeamSpace",
    description:
      "An internal tool for a growing startup: hiring pipeline, onboarding checklists and team directory in one place.",
    tags: ["React", "TypeScript", "Supabase", "shadcn/ui"],
    image: unsplash("photo-1519389950473-47ba0277781c"),
    imageAlt: "Team working together on laptops",
    year: 2023,
  },
];

export const stack: StackCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Interfaces that feel quick and stay easy to change.",
    items: [
      { name: "TypeScript", level: "Expert" },
      { name: "React", level: "Expert" },
      { name: "Next.js", level: "Expert" },
      { name: "Tailwind CSS", level: "Expert" },
      { name: "Framer Motion", level: "Advanced" },
      { name: "GSAP", level: "Comfortable" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "APIs and data that are boring in the best way.",
    items: [
      { name: "Node.js", level: "Advanced" },
      { name: "NestJS", level: "Advanced" },
      { name: "SQL", level: "Advanced" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "Prisma", level: "Advanced" },
      { name: "Redis", level: "Comfortable" },
      { name: "Go", level: "Learning" },
    ],
  },
  {
    id: "tools",
    title: "Tools & DevOps",
    description: "Shipping often without breaking things.",
    items: [
      { name: "Git & GitHub", level: "Expert" },
      { name: "Docker", level: "Advanced" },
      { name: "Vercel", level: "Advanced" },
      { name: "GitHub Actions", level: "Comfortable" },
      { name: "Linux", level: "Advanced" },
    ],
  },
];

/** MA STUDIO is the only startup; the list shape is kept for the sections that read `startups[0]`. */
export const startups: Startup[] = [
  {
    slug: "mastudio",
    name: "MA\u00A0STUDIO",
    role: "Co-founder & Lead Developer",
    description:
      "The software studio my friend Miraziz and I founded. We design and build web apps, digital products and MVPs, from the first idea to launch.",
    href: STUDIO_URL,
  },
];

export const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "journey", label: "Journey", icon: Route },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "stack", label: "Stack", icon: Layers },
  { id: "startups", label: "Startup", icon: Rocket },
];

/** The path so far, in order. The last item (upcoming) is the direction from here. */
export const journey: JourneyMilestone[] = [
  {
    id: "student",
    year: "01",
    title: "Studied at Mars IT School",
    description: "This is where I started programming and learned the foundations of web development.",
    icon: GraduationCap,
    tag: "Study",
  },
  {
    id: "mars-intern",
    year: "02",
    title: "Intern at Mars IT School",
    description: "After my studies I stayed at the same school as an intern and put what I had learned to work.",
    icon: Code2,
    tag: "Internship",
  },
  {
    id: "navi-intern",
    year: "03",
    title: "Intern at Navi Global",
    description: "My second internship was at Navi Global: a new environment and new kinds of tasks.",
    icon: Briefcase,
    tag: "Internship",
  },
  {
    id: "mastudio",
    year: "04",
    title: "Co-founded MA\u00A0STUDIO",
    description: "A friend and I started our own startup: a studio that builds web apps, digital products and MVPs.",
    icon: Rocket,
    tag: "Co-founder",
    highlight: true,
  },
  {
    id: "teaching",
    year: "05",
    title: "Teaching experience",
    description: "Along the way I also taught. Explaining things to others made my own understanding deeper.",
    icon: Users,
    tag: "Teaching",
  },
  {
    id: "fullstack",
    year: "06",
    title: "Full-stack developer",
    description: "3+ years of experience: I build web apps end to end and work on Linux.",
    icon: Terminal,
    tag: "Today",
    highlight: true,
  },
  {
    id: "next",
    year: "Next",
    title: "Growing MA\u00A0STUDIO and going deeper into systems",
    description: "I keep building the studio and deepening what I know about Linux and systems.",
    icon: Compass,
    tag: "What's next",
    upcoming: true,
  },
];
