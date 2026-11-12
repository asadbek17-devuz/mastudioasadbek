import type { Dictionary } from "@/lib/i18n/types";

export const en: Dictionary = {
  nav: {
    labels: {
      home: "Home",
      about: "About",
      journey: "Journey",
      projects: "Projects",
      stack: "Stack",
      startups: "Startups",
      contact: "Contact",
    },
    cta: "Let's talk",
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
    fullName: "Asadbek",
    role: "Software Engineer & Web Developer",
    location: "Tashkent, Uzbekistan",
    city: "Tashkent",
    country: "Uzbekistan",
    tagline: "I build fast, friendly web products and help new developers ship their first ones.",
    intro:
      "I design and build web apps end to end, from the first sketch to the deployed product. Most days I write TypeScript, care a lot about small details, and teach what I learn.",
    avatarAlt: "Laptop with code on screen on a wooden desk",
  },
  stats: {
    years: "Years building for the web",
    projects: "Projects shipped",
    students: "Students mentored",
    startups: "Startups started",
  },
  metrics: {
    students: "Students",
    courses: "Courses",
    hired: "Hired after graduation",
    products: "Products launched",
    team: "Team members",
    betaUsers: "Beta users",
    mentors: "Mentors",
    projectsShipped: "Projects shipped",
    studentsMentored: "Students mentored",
  },
  hero: {
    greetingBefore: "Hi, I'm ",
    greetingAfter: "",
    headline: [
      { text: "Software" },
      { text: "engineer" },
      { text: "building" },
      { text: "clean," },
      { text: "fast" },
      { text: "web", accent: true },
      { text: "products.", accent: true },
    ],
    viewProjects: "View projects",
    contactMe: "Contact me",
    socialsAria: "Social links",
    basedIn: "Based in Tashkent",
    nowEyebrow: "Now building",
    nowLine: "Teaching web development from scratch, with real projects.",
    nowAria: "Now building: {name}. See startups",
    stackEyebrow: "Daily stack",
    stackTitle: "Tools I ship with",
    stackAria: "My daily stack. See full stack",
  },
  about: {
    heading: {
      eyebrow: "About me",
      title: "A developer who sweats the",
      accent: "small details",
      description:
        "The short version: I build web products, run an IT academy, and like keeping things simple.",
    },
    paragraphs: [
      "I'm Asadbek, a software engineer from Tashkent. I started by building small websites for friends, and it slowly turned into a career and a habit I can't stop.",
      "Today I build web applications with React, Next.js and Node.js. I like products that feel calm and quick, code that the next person can read, and teams that talk openly.",
      "Outside client work I run an IT academy, where I help beginners go from zero to their first job. Teaching keeps me honest about the basics.",
    ],
    highlights: {
      product: {
        title: "Product-minded",
        description: "I think about the user and the business, not only the ticket.",
      },
      code: {
        title: "Clean, typed code",
        description: "TypeScript everywhere, small components, and tests where they matter.",
      },
      teacher: {
        title: "Teacher at heart",
        description: "Hundreds of students mentored, from first HTML page to first offer.",
      },
      delivery: {
        title: "Ships on time",
        description: "Clear scope, short feedback loops, and no surprises at the end.",
      },
    },
    labels: {
      story: "My story",
      howIWork: "How I work",
      currently: "Currently",
      whatIBring: "What I bring",
    },
    currently: {
      academy: { label: "Running {name}", detail: "New web dev group every month" },
      clients: { label: "Building client web apps", detail: "Next.js, TypeScript, Postgres" },
      learning: { label: "Learning Go", detail: "For faster, simpler backends" },
    },
    values: [
      { title: "Clarity over cleverness", text: "Code and UI that explain themselves." },
      { title: "Small steps, shipped often", text: "You see progress every week." },
      { title: "Honest, kind feedback", text: "No jargon, no surprises." },
    ],
  },
  journey: {
    heading: {
      eyebrow: "Journey",
      title: "Milestones along the",
      accent: "way",
      description:
        "From a first line of code to an academy and a few startups. The road so far, one year at a time.",
    },
    nextYear: "Next",
    nextCta: "Let's build it together",
    items: {
      "first-code": {
        title: "Wrote my first line of code",
        description:
          "Started with HTML, CSS and a lot of curiosity, building small websites for friends and family.",
        tag: "Beginnings",
      },
      "first-client": {
        title: "First freelance client",
        description:
          "Shipped a paid website for a local business and learned that deadlines and clear scope matter as much as code.",
        tag: "Freelance",
      },
      "product-team": {
        title: "Joined a product team",
        description:
          "Moved to React and TypeScript full time, worked in sprints with designers and shipped features to real users.",
        tag: "Product",
      },
      academy: {
        title: "Founded ICO IT Academy",
        description:
          "Turned mentoring into a school: small groups, real projects and career support for beginners in Uzbekistan.",
        tag: "Founder",
      },
      graduates: {
        title: "First graduates hired",
        description:
          "Our first cohorts landed developer jobs, and the academy grew through word of mouth.",
        tag: "Teaching",
      },
      kodline: {
        title: "Co-founded Kodline",
        description:
          "Started a product studio building web apps and MVPs for local businesses and early-stage founders.",
        tag: "Startup",
      },
      growth: {
        title: "500+ students and a third startup",
        description:
          "Passed 500 students at the academy and started Mentorly to pair junior developers with experienced mentors.",
        tag: "Growth",
      },
      next: {
        title: "Your product could be next",
        description:
          "Growing the startups, building more products people enjoy using, and teaching the next 1,000 developers.",
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
          "A learning platform for an IT academy with courses, homework review, live progress and payments for 1,000+ students.",
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
          "A REST and webhook API for tracking tasks across teams, with role-based access, audit logs and 99.9% uptime.",
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
    legendAria: "Skill level legend",
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
      design: {
        title: "Design",
        description: "Enough design to make good calls on my own.",
      },
    },
    skills: {
      designSystems: "Design systems",
      prototyping: "Prototyping",
      accessibility: "Accessibility",
    },
  },
  startups: {
    heading: {
      eyebrow: "Beyond client work",
      title: "Startups &",
      accent: "ventures",
      description:
        "Companies I started or help run, mostly around education and helping developers grow.",
    },
    visit: "Visit {name}",
    present: "Present",
    statuses: {
      Active: "Active",
      Growing: "Growing",
      Building: "Building",
      Exited: "Exited",
      Paused: "Paused",
    },
    items: {
      "ico-it-academy": {
        role: "Founder & Lead Mentor",
        description:
          "An IT education academy in Uzbekistan that teaches web development from scratch, with small groups, real projects and career support.",
      },
      kodline: {
        role: "Co-founder & CTO",
        description:
          "A small product studio building web apps and MVPs for local businesses and early-stage founders.",
      },
      mentorly: {
        role: "Founder",
        description:
          "A platform that matches junior developers with experienced mentors for weekly code reviews and career calls.",
      },
    },
  },
  contact: {
    heading: {
      eyebrow: "Contact",
      title: "Let's build something",
      accent: "together",
      description:
        "Have a product idea, a site that needs care, or a team that needs one more pair of hands? Send a short note and I'll reply within a day or two.",
    },
    remote: "works remotely",
    formTitle: "Write a message",
    formNote: "All fields are required.",
    socialsAria: "Social profiles",
    form: {
      labels: { name: "Your name", email: "Email", message: "Message" },
      placeholders: {
        name: "Jasur Karimov",
        email: "name@site.com",
        message: "A few words about the project",
      },
      messageHint: "What are you building, and when do you need it?",
      errors: {
        name: "Add your name so I know who to reply to.",
        email: "This email looks incomplete, for example name@site.com.",
        message: "Write a few more words about your project (10+ characters).",
      },
      note: "Opens your email app with the message filled in.",
      send: "Send message",
      sending: "Opening mail…",
      sent: "Ready to send",
      sentStatus: "Your email app should open with the message ready to send.",
      subject: "Project inquiry from {name}",
    },
    copy: {
      copy: "Copy",
      copied: "Copied",
      copyAria: "Copy email address",
      copiedAria: "Email copied",
      copiedStatus: "Email address copied to clipboard",
      emailDirect: "Email me directly",
    },
  },
  footer: {
    tagline:
      "Software Engineer & Web Developer in Tashkent, Uzbekistan. Building calm, fast web products and teaching others to do the same.",
    navAria: "Footer",
    navigate: "Navigate",
    elsewhere: "Elsewhere",
    backToTop: "Back to top",
    rights: "All rights reserved.",
  },
};
