import type { Dictionary } from "@/lib/i18n/types";

export const en: Dictionary = {
  meta: {
    title: "Asadbek — Full-stack Developer, Co-founder of MA STUDIO | Portfolio",
    description:
      "Asadbek is a full-stack developer from Tashkent, Uzbekistan, and a co-founder of MA STUDIO. 3+ years of experience in full-stack web development and Linux. Studied at Mars IT School.",
  },
  nav: {
    labels: {
      home: "Home",
      about: "About",
      journey: "Journey",
      projects: "Projects",
      stack: "Stack",
      startups: "Startup",
    },
    cta: "MA\u00A0STUDIO",
    skip: "Skip to content",
    primaryAria: "Primary",
    homeAria: "back to top",
  },
  language: {
    label: "Language",
  },
  loader: {
    label: "Loading",
  },
  profile: {
    name: "Asadbek",
    role: "Full-stack Developer, Co-founder of MA\u00A0STUDIO",
    location: "Tashkent, Uzbekistan",
    tagline:
      "I'm a full-stack developer with 3+ years of experience across the web and Linux. I studied at Mars IT School, interned there and at Navi Global, then co-founded the MA\u00A0STUDIO studio with a friend.",
  },
  hero: {
    greetingBefore: "Hi, I'm ",
    greetingAfter: "",
    headline: [
      { text: "Full-stack" },
      { text: "software" },
      { text: "engineer" },
      { text: "and" },
      { text: "co-founder" },
      { text: "of" },
      { text: "MA\u00A0studio.", accent: true },
    ],
    viewProjects: "View projects",
    studioSite: "MA\u00A0STUDIO website",
  },
  about: {
    heading: {
      eyebrow: "About me",
      title: "From student to",
      accent: "studio co-founder",
      description:
        "The short version: I'm a full-stack developer, I work with Linux, I co-founded MA\u00A0STUDIO, and I have taught.",
    },
    paragraphs: [
      "I'm Asadbek, a full-stack developer from Tashkent. I learned to code at Mars IT School and then stayed on there as an intern.",
      "My next internship was at Navi Global, and after that a friend and I founded our startup, MA\u00A0STUDIO. Today I have 3+ years of experience: I build web apps end to end, from the interface to the server, and I'm at home on Linux.",
      "I have teaching experience too. Explaining something to another person is the fastest way to find out how well I understand it myself.",
    ],
    highlights: {
      fullstack: {
        title: "Full stack",
        description: "From the interface to the server: I can build a web app end to end.",
      },
      linux: {
        title: "Linux",
        description: "I'm comfortable in the terminal and on servers.",
      },
      founder: {
        title: "Co-founder",
        description: "I founded MA\u00A0STUDIO together with a friend, and we keep growing it.",
      },
      teaching: {
        title: "Teaching experience",
        description: "I have taught, so I know how to explain hard things simply.",
      },
    },
    labels: {
      story: "My story",
      howIWork: "How I work",
      currently: "Currently",
      whatIBring: "What I'm good at",
    },
    currently: {
      studio: { label: "Growing {name}", detail: "Web apps, products and MVPs" },
      fullstack: { label: "Building full-stack web apps", detail: "Frontend, backend, databases" },
      linux: { label: "Going deeper into Linux", detail: "Systems and servers" },
    },
    values: [
      { title: "Clarity over cleverness", text: "Code and interfaces that explain themselves." },
      { title: "Small steps", text: "I split big work into parts that are easy to check." },
      { title: "Always learning", text: "I don't let go until I understand how it works." },
    ],
  },
  journey: {
    heading: {
      eyebrow: "Journey",
      title: "The road",
      accent: "so far",
      description:
        "From my first lessons at Mars IT School to a studio of my own. The path so far, step by step.",
    },
    nextYear: "Next",
    nextCta: "Visit the MA\u00A0STUDIO website",
    items: {
      student: {
        title: "Studied at Mars IT School",
        description: "This is where I started programming and learned the foundations of web development.",
        tag: "Study",
      },
      "mars-intern": {
        title: "Intern at Mars IT School",
        description:
          "After my studies I stayed at the same school as an intern and put what I had learned to work.",
        tag: "Internship",
      },
      "navi-intern": {
        title: "Intern at Navi Global",
        description: "My second internship was at Navi Global: a new environment and new kinds of tasks.",
        tag: "Internship",
      },
      mastudio: {
        title: "Co-founded MA\u00A0STUDIO",
        description: "A friend and I started our own startup: a studio that builds web apps, digital products and MVPs.",
        tag: "Co-founder",
      },
      teaching: {
        title: "Teaching experience",
        description:
          "Along the way I also taught. Explaining things to others made my own understanding deeper.",
        tag: "Teaching",
      },
      fullstack: {
        title: "Full-stack developer",
        description: "3+ years of experience: I build web apps end to end and work on Linux.",
        tag: "Today",
      },
      next: {
        title: "Growing MA\u00A0STUDIO and going deeper into systems",
        description: "I keep building the studio and deepening what I know about Linux and systems.",
        tag: "What's next",
      },
    },
  },
  projects: {
    heading: {
      eyebrow: "Selected work",
      title: "Things I've built and",
      accent: "shipped",
      description:
        "A few products I designed and built end to end, from early sketches to production.",
    },
    technologiesAria: "Technologies",
    viewProject: "View project",
    code: "Code",
    cursor: "View",
    showcaseAria: "Project showcase",
    itemAria: "Project {n} of {total}: {title}",
    previous: "Previous project",
    next: "Next project",
    items: {
      learnly: {
        title: "Learnly LMS",
        description:
          "A learning platform with courses, homework review, live progress and payments.",
        imageAlt: "Analytics dashboard on a laptop screen",
      },
      "pulse-analytics": {
        title: "Pulse Analytics",
        description:
          "A real-time dashboard that turns sales and traffic data into simple, readable charts for small online shops.",
        imageAlt: "Data charts and graphs on a screen",
      },
      "studio-site": {
        title: "Studio Website",
        description:
          "A fast marketing site with a headless CMS, so the team can publish pages and case studies without a developer.",
        imageAlt: "Laptop with code editor open on a desk",
      },
      devtrack: {
        title: "DevTrack API",
        description:
          "A REST and webhook API for tracking tasks across teams, with role-based access and audit logs.",
        imageAlt: "Close-up of colorful code on a monitor",
      },
      teamspace: {
        title: "TeamSpace",
        description:
          "An internal tool for a growing startup: hiring pipeline, onboarding checklists and team directory in one place.",
        imageAlt: "Team working together on laptops",
      },
    },
  },
  stack: {
    heading: {
      eyebrow: "Tools & Stack",
      title: "What I build",
      accent: "with",
      description: "The tools I reach for every week, and how well I know each one.",
    },
    playground: {
      filterAria: "Filter tools by category",
      all: "All",
      allInfo: "Everything I reach for, colored by category.",
      toolCount: "{count} tools",
      listAria: "Tools by category",
      shake: "Shake",
      reset: "Drop again",
      hintPointer: "Drag, throw, or shake",
      hintTouch: "Tap a pill or shake",
      legendCategories: "Color shows the category",
      legendLevels: "Mark shows the level",
    },
    levels: {
      Expert: "Expert",
      Advanced: "Advanced",
      Comfortable: "Comfortable",
      Learning: "Learning",
    },
    categories: {
      frontend: {
        title: "Frontend",
        description: "Interfaces that feel quick and stay easy to change.",
      },
      backend: {
        title: "Backend",
        description: "APIs and data that are boring in the best way.",
      },
      tools: {
        title: "Tools & DevOps",
        description: "Shipping often without breaking things.",
      },
    },
  },
  startups: {
    heading: {
      eyebrow: "Startup",
      title: "The studio I",
      accent: "co-founded",
      description: "MA\u00A0STUDIO is the startup I founded together with a friend, and we keep building it.",
    },
    visit: "Visit {name}",
    items: {
      mastudio: {
        role: "Co-founder & Lead Developer",
        description:
          "The software studio my friend Miraziz and I founded. We design and build web apps, digital products and MVPs, from the first idea to launch.",
      },
    },
    foundersLabel: "Founders",
    factsLabel: "What the studio does",
    facts: {
      webApps: { title: "Web apps", text: "The full cycle, from the interface to the server." },
      products: { title: "Digital products", text: "From an idea to a working product." },
      mvp: { title: "MVPs", text: "A first version to test an idea quickly." },
    },
  },
  process: {
    heading: {
      eyebrow: "How I build",
      title: "From idea",
      accent: "to product",
      description: "One screen, four steps: from a paper sketch to a launched product.",
    },
    stages: {
      idea: {
        title: "Sketch",
        text: "I start on paper: who it is for, the one job it must do, and the smallest version worth shipping.",
      },
      wireframe: {
        title: "Design",
        text: "The sketch becomes a clear layout: structure, flow and content are settled while changes are still cheap.",
      },
      code: {
        title: "Code",
        text: "I build it from typed, reusable components, with real data and a live preview from day one.",
      },
      live: {
        title: "Launch",
        text: "It ships fast, accessible and measured, then keeps improving with what real users do.",
      },
    },
    mock: {
      note: "users must see progress at a glance!",
      greeting: "Good morning",
      sub: "Here is how today is going",
      metric: "Orders shipped",
      live: "Live",
      nav: ["Overview", "Orders"],
      rows: ["New customers", "Response time", "Rating"],
    },
  },
  story: {
    heading: {
      eyebrow: "Story",
      title: "Me in",
      accent: "one minute",
      description: "Six short frames, from the first line of code to our own studio. It plays by itself, or you can flip through at your own pace.",
    },
    playerAria: "Story player",
    progressAria: "Story progress",
    progressText: "Chapter {n} of {total}: {title}",
    controls: {
      play: "Play",
      pause: "Pause",
      previous: "Previous chapter",
      next: "Next chapter",
      replay: "Watch again",
    },
    chapters: {
      start: {
        eyebrow: "The beginning",
        title: "It all started with",
        accent: "one line of code.",
        line: "I studied at Mars IT School: that is where programming began for me.",
      },
      marsIntern: {
        eyebrow: "First internship",
        title: "From student",
        accent: "to intern.",
        line: "I stayed at Mars IT School as an intern and put what I had learned to work.",
      },
      navi: {
        eyebrow: "New ground",
        title: "New team,",
        accent: "new tasks.",
        line: "My second internship was at Navi Global: a different environment with different demands.",
      },
      studio: {
        eyebrow: "Our own studio",
        title: "With a friend, we founded",
        accent: "MA\u00A0STUDIO.",
        line: "Now we turn ideas into products ourselves.",
      },
      teaching: {
        eyebrow: "Teaching",
        title: "By teaching,",
        accent: "I learned too.",
        line: "I have teaching experience: if you can explain it, you really know it.",
      },
      today: {
        eyebrow: "Today",
        title: "Full-stack developer",
        accent: "and co-founder.",
        line: "3+ years of experience. And the road goes on.",
      },
    },
    visual: {
      hello: "Hello",
      student: "student",
      steps: ["study", "internship", "developer", "MA\u00A0STUDIO"],
      mentor: "mentor",
      chips: ["Full-stack", "Linux", "3+ years"],
    },
    outro: {
      tagline: "Full-stack · Linux · MA\u00A0STUDIO",
      cta: "Visit MA\u00A0STUDIO",
    },
  },
  footer: {
    ctaLink: "MA\u00A0STUDIO website",
    facts: ["Full-stack", "Linux", "Co-founder of MA\u00A0STUDIO"],
    navAria: "Footer",
    backToTop: "Back to top",
  },
};
