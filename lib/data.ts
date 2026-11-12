/**
 * Single source of content for every section.
 * Copy marked "EDITABLE" is placeholder text for Asadbek to adjust.
 */
import {
  Briefcase,
  Code2,
  Compass,
  FolderKanban,
  GraduationCap,
  Home,
  Layers,
  Mail,
  Rocket,
  Route,
  Trophy,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SectionId = "home" | "about" | "journey" | "projects" | "stack" | "startups" | "contact";

export type SocialKey = "github" | "linkedin" | "telegram" | "instagram";

/*
 * Stable ids. The translated text for every item lives in `lib/i18n/dictionaries/*`
 * and is keyed by these ids, so adding an item here is a compile error until all
 * three dictionaries have its text. The English strings below stay as the fallback
 * for code that reads this file directly; localized UI should use `useData()`.
 */
export type StatId = "years" | "projects" | "students" | "startups";
export type HighlightId = "product" | "code" | "teacher" | "delivery";
export type ProjectSlug = "learnly" | "pulse-analytics" | "studio-site" | "devtrack" | "teamspace";
export type StackCategoryId = "frontend" | "backend" | "tools" | "design";
/** Stack items that are plain words rather than brand/tech names, so they get translated. */
export type StackSkillId = "designSystems" | "prototyping" | "accessibility";
export type StartupSlug = "ico-it-academy" | "kodline" | "mentorly";
export type MetricId =
  | "students"
  | "courses"
  | "hired"
  | "products"
  | "team"
  | "betaUsers"
  | "mentors"
  | "projectsShipped"
  | "studentsMentored";
export type JourneyId =
  | "first-code"
  | "first-client"
  | "product-team"
  | "academy"
  | "graduates"
  | "kodline"
  | "growth"
  | "next";

export interface Metric {
  id: MetricId;
  value: string;
  label: string;
}

export interface Social {
  key: SocialKey;
  label: string;
  href: string;
  handle: string;
}

export interface Profile {
  name: string;
  fullName: string;
  role: string;
  location: string;
  tagline: string;
  intro: string;
  email: string;
  availableForWork: boolean;
  avatar: string;
  avatarAlt: string;
  resumeHref: string;
  socials: Social[];
}

export interface Stat {
  id: StatId;
  value: number;
  suffix?: string;
  label: string;
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
  href: string;
  repo?: string;
  year: number;
  featured?: boolean;
}

export type SkillLevel = "Expert" | "Advanced" | "Comfortable" | "Learning";

export interface StackItem {
  name: string;
  /** Set for items whose name is translated (see `StackSkillId`). */
  labelId?: StackSkillId;
  level?: SkillLevel;
}

export interface StackCategory {
  id: StackCategoryId;
  title: "Frontend" | "Backend" | "Tools & DevOps" | "Design";
  description: string;
  items: StackItem[];
}

export type StartupStatus = "Active" | "Growing" | "Building" | "Exited" | "Paused";

export interface Startup {
  slug: StartupSlug;
  name: string;
  role: string;
  /** English fallback, e.g. "2022 — Present". Localized UI builds it from the years below. */
  period: string;
  startYear: number;
  /** Omit while the startup is still running. */
  endYear?: number;
  description: string;
  metrics: Metric[];
  href: string;
  status: StartupStatus;
}

export type NavIconName = "Home" | "User" | "Route" | "FolderKanban" | "Layers" | "Rocket" | "Mail";

export interface NavItem {
  id: SectionId;
  label: string;
  /** lucide-react icon name */
  iconName: NavIconName;
  /** lucide-react icon component (same icon as iconName) */
  icon: LucideIcon;
}

export interface JourneyMilestone {
  id: JourneyId;
  year: string;
  title: string;
  description: string;
  /** lucide-react icon component */
  icon: LucideIcon;
  tag?: string;
  /** Accent styling for the biggest milestones. */
  highlight?: boolean;
  metric?: Metric;
  /** Marks the open-ended "what's next" step (dashed line, outlined node, links to #contact). */
  upcoming?: boolean;
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const profile: Profile = {
  name: "Asadbek",
  fullName: "Asadbek", // EDITABLE: add surname
  role: "Software Engineer & Web Developer",
  location: "Tashkent, Uzbekistan",
  tagline: "I build fast, friendly web products and help new developers ship their first ones.",
  intro:
    "I design and build web apps end to end, from the first sketch to the deployed product. Most days I write TypeScript, care a lot about small details, and teach what I learn.",
  email: "hello@example.com", // EDITABLE
  availableForWork: true,
  avatar: unsplash("photo-1517694712202-14dd9538aa97"),
  avatarAlt: "Laptop with code on screen on a wooden desk",
  resumeHref: "#", // EDITABLE
  socials: [
    { key: "github", label: "GitHub", href: "https://github.com/", handle: "@asadbek" },
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/", handle: "in/asadbek" },
    { key: "telegram", label: "Telegram", href: "https://t.me/", handle: "@asadbek" },
    { key: "instagram", label: "Instagram", href: "https://www.instagram.com/", handle: "@asadbek" },
  ],
};

export const stats: Stat[] = [
  { id: "years", value: 5, suffix: "+", label: "Years building for the web" },
  { id: "projects", value: 40, suffix: "+", label: "Projects shipped" },
  { id: "students", value: 500, suffix: "+", label: "Students mentored" },
  { id: "startups", value: 3, label: "Startups started" },
];

export const about: About = {
  paragraphs: [
    "I'm Asadbek, a software engineer from Tashkent. I started by building small websites for friends, and it slowly turned into a career and a habit I can't stop.",
    "Today I build web applications with React, Next.js and Node.js. I like products that feel calm and quick, code that the next person can read, and teams that talk openly.",
    "Outside client work I run an IT academy, where I help beginners go from zero to their first job. Teaching keeps me honest about the basics.",
  ],
  highlights: [
    {
      id: "product",
      title: "Product-minded",
      description: "I think about the user and the business, not only the ticket.",
    },
    {
      id: "code",
      title: "Clean, typed code",
      description: "TypeScript everywhere, small components, and tests where they matter.",
    },
    {
      id: "teacher",
      title: "Teacher at heart",
      description: "Hundreds of students mentored, from first HTML page to first offer.",
    },
    {
      id: "delivery",
      title: "Ships on time",
      description: "Clear scope, short feedback loops, and no surprises at the end.",
    },
  ],
};

export const projects: Project[] = [
  {
    slug: "learnly",
    title: "Learnly LMS",
    description:
      "A learning platform for an IT academy with courses, homework review, live progress and payments for 1,000+ students.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    image: unsplash("photo-1460925895917-afdab827c52f"),
    imageAlt: "Analytics dashboard on a laptop screen",
    href: "#",
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
    href: "#",
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
    href: "#",
    year: 2024,
  },
  {
    slug: "devtrack",
    title: "DevTrack API",
    description:
      "A REST and webhook API for tracking tasks across teams, with role-based access, audit logs and 99.9% uptime.",
    tags: ["NestJS", "PostgreSQL", "Redis", "Docker"],
    image: unsplash("photo-1555066931-4365d14bab8c"),
    imageAlt: "Close-up of colorful code on a monitor",
    href: "#",
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
    href: "#",
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
      { name: "Linux", level: "Comfortable" },
    ],
  },
  {
    id: "design",
    title: "Design",
    description: "Enough design to make good calls on my own.",
    items: [
      { name: "Figma", level: "Advanced" },
      { name: "Design systems", labelId: "designSystems", level: "Advanced" },
      { name: "Prototyping", labelId: "prototyping", level: "Comfortable" },
      { name: "Accessibility", labelId: "accessibility", level: "Comfortable" },
    ],
  },
];

export const startups: Startup[] = [
  {
    slug: "ico-it-academy",
    name: "ICO IT Academy",
    role: "Founder & Lead Mentor", // EDITABLE
    period: "2022 — Present", // EDITABLE
    startYear: 2022,
    description:
      "An IT education academy in Uzbekistan that teaches web development from scratch, with small groups, real projects and career support.", // EDITABLE
    metrics: [
      { id: "students", value: "500+", label: "Students" }, // EDITABLE
      { id: "courses", value: "12", label: "Courses" }, // EDITABLE
      { id: "hired", value: "70%", label: "Hired after graduation" }, // EDITABLE
    ],
    href: "#", // EDITABLE
    status: "Active",
  },
  {
    slug: "kodline",
    name: "Kodline", // EDITABLE: placeholder startup
    role: "Co-founder & CTO",
    period: "2024 — Present",
    startYear: 2024,
    description:
      "A small product studio building web apps and MVPs for local businesses and early-stage founders.",
    metrics: [
      { id: "products", value: "15+", label: "Products launched" },
      { id: "team", value: "8", label: "Team members" },
    ],
    href: "#",
    status: "Growing",
  },
  {
    slug: "mentorly",
    name: "Mentorly", // EDITABLE: placeholder startup
    role: "Founder",
    period: "2025 — Present",
    startYear: 2025,
    description:
      "A platform that matches junior developers with experienced mentors for weekly code reviews and career calls.",
    metrics: [
      { id: "betaUsers", value: "120", label: "Beta users" },
      { id: "mentors", value: "30", label: "Mentors" },
    ],
    href: "#",
    status: "Building",
  },
];

export const navItems: NavItem[] = [
  { id: "home", label: "Home", iconName: "Home", icon: Home },
  { id: "about", label: "About", iconName: "User", icon: User },
  { id: "journey", label: "Journey", iconName: "Route", icon: Route },
  { id: "projects", label: "Projects", iconName: "FolderKanban", icon: FolderKanban },
  { id: "stack", label: "Stack", iconName: "Layers", icon: Layers },
  { id: "startups", label: "Startups", iconName: "Rocket", icon: Rocket },
  { id: "contact", label: "Contact", iconName: "Mail", icon: Mail },
];

/** Achievements roadmap, oldest first. The last item (upcoming) is the next goal. */
export const journey: JourneyMilestone[] = [
  {
    id: "first-code",
    year: "2019", // EDITABLE
    title: "Wrote my first line of code", // EDITABLE
    description:
      "Started with HTML, CSS and a lot of curiosity, building small websites for friends and family.", // EDITABLE
    icon: Code2,
    tag: "Beginnings", // EDITABLE
  },
  {
    id: "first-client",
    year: "2020", // EDITABLE
    title: "First freelance client", // EDITABLE
    description:
      "Shipped a paid website for a local business and learned that deadlines and clear scope matter as much as code.", // EDITABLE
    icon: Briefcase,
    tag: "Freelance", // EDITABLE
  },
  {
    id: "product-team",
    year: "2021", // EDITABLE
    title: "Joined a product team", // EDITABLE
    description:
      "Moved to React and TypeScript full time, worked in sprints with designers and shipped features to real users.", // EDITABLE
    icon: Users,
    tag: "Product", // EDITABLE
    metric: { id: "projectsShipped", value: "10+", label: "Projects shipped" }, // EDITABLE
  },
  {
    id: "academy",
    year: "2022", // EDITABLE
    title: "Founded ICO IT Academy", // EDITABLE
    description:
      "Turned mentoring into a school: small groups, real projects and career support for beginners in Uzbekistan.", // EDITABLE
    icon: GraduationCap,
    tag: "Founder", // EDITABLE
    highlight: true,
    metric: { id: "courses", value: "12", label: "Courses" }, // EDITABLE
  },
  {
    id: "graduates",
    year: "2023", // EDITABLE
    title: "First graduates hired", // EDITABLE
    description:
      "Our first cohorts landed developer jobs, and the academy grew through word of mouth.", // EDITABLE
    icon: Trophy,
    tag: "Teaching", // EDITABLE
    metric: { id: "hired", value: "70%", label: "Hired after graduation" }, // EDITABLE
  },
  {
    id: "kodline",
    year: "2024", // EDITABLE
    title: "Co-founded Kodline", // EDITABLE
    description:
      "Started a product studio building web apps and MVPs for local businesses and early-stage founders.", // EDITABLE
    icon: Rocket,
    tag: "Startup", // EDITABLE
    metric: { id: "projectsShipped", value: "40+", label: "Projects shipped" }, // EDITABLE
  },
  {
    id: "growth",
    year: "2025", // EDITABLE
    title: "500+ students and a third startup", // EDITABLE
    description:
      "Passed 500 students at the academy and started Mentorly to pair junior developers with experienced mentors.", // EDITABLE
    icon: Layers,
    tag: "Growth", // EDITABLE
    highlight: true,
    metric: { id: "studentsMentored", value: "500+", label: "Students mentored" }, // EDITABLE
  },
  {
    id: "next",
    year: "Next", // EDITABLE
    title: "Your product could be next", // EDITABLE
    description:
      "Growing the startups, building more products people enjoy using, and teaching the next 1,000 developers.", // EDITABLE
    icon: Compass,
    tag: "What's next", // EDITABLE
    upcoming: true,
  },
];
