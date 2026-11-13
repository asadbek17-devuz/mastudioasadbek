import type { Dictionary } from "@/lib/i18n/types";

/*
 * Uzbek, Latin script. Apostrophes: ʻ (U+02BB) in oʻ / gʻ and ʼ (U+02BC) for the
 * tutuq belgisi (maʼlumot, eʼtibor). Keep them consistent; do not use ' or `.
 */
export const uz: Dictionary = {
  meta: {
    title: "Asadbek — Full-stack dasturchi, MA STUDIO co-founder | Portfolio",
    description:
      "Asadbek — toshkentlik full-stack dasturchi va MA STUDIO co-founder. 3 yildan ortiq tajriba: full-stack veb-dasturlash va Linux. Mars IT Schoolda oʻqigan.",
  },
  nav: {
    labels: {
      home: "Bosh sahifa",
      about: "Men haqimda",
      journey: "Yoʻl",
      projects: "Loyihalar",
      stack: "Stack",
      startups: "Startap",
    },
    cta: "MA\u00A0STUDIO",
    skip: "Asosiy kontentga oʻtish",
    primaryAria: "Asosiy navigatsiya",
    homeAria: "sahifa boshiga qaytish",
  },
  language: {
    label: "Til",
  },
  loader: {
    label: "Yuklanmoqda",
  },
  profile: {
    name: "Asadbek",
    role: "Full-stack dasturchi, MA\u00A0STUDIO co-founder",
    location: "Toshkent, Oʻzbekiston",
    tagline:
      "3 yildan ortiq tajribaga ega full-stack va Linux dasturchiman. Mars IT Schoolda oʻqidim, oʻsha yerda va Navi Globalda amaliyot oʻtadim, soʻng doʻstim bilan birga MA\u00A0STUDIO studiyasiga asos soldik.",
  },
  stats: {
    years: "Yillik full-stack tajriba",
    internships: "Amaliyot: Mars IT School va Navi Global",
    startups: "Startap co-founderi: MA\u00A0STUDIO",
  },
  hero: {
    greetingBefore: "Salom, men ",
    greetingAfter: "",
    headline: [
      { text: "Full-stack" },
      { text: "software" },
      { text: "engineer" },
      { text: "va" },
      { text: "MA\u00A0STUDIO", accent: true },
      { text: "co-founder." },
    ],
    viewProjects: "Loyihalar",
    studioSite: "MA\u00A0STUDIO sayti",
  },
  about: {
    heading: {
      eyebrow: "Men haqimda",
      title: "Oʻquvchidan",
      accent: "studiya co-founderigacha",
      description:
        "Qisqasi: full-stack dasturchiman, Linux bilan ishlayman, MA\u00A0STUDIO co-founderiman va dars ham berganman.",
    },
    paragraphs: [
      "Men Asadbek, toshkentlik full-stack dasturchiman. Dasturlashni Mars IT Schoolda oʻrgandim, keyin oʻsha yerning oʻzida amaliyotchi boʻlib qoldim.",
      "Keyingi amaliyotni Navi Globalda oʻtadim, soʻng doʻstim bilan birga oʻz startapimiz — MA\u00A0STUDIO\u00A0ga asos soldik. Bugun 3 yildan ortiq tajribam bor: veb-ilovalarni interfeysdan servergacha oʻzim quraman va Linux muhitida bemalol ishlayman.",
      "Dars berish tajribam ham bor. Biror narsani boshqaga tushuntirish uni oʻzim qanchalik tushunishimni eng tez koʻrsatadi.",
    ],
    highlights: {
      fullstack: {
        title: "Full-stack",
        description: "Interfeysdan servergacha: veb-ilovani boshidan oxirigacha oʻzim qura olaman.",
      },
      linux: {
        title: "Linux",
        description: "Terminal va serverlarda bemalol ishlayman.",
      },
      founder: {
        title: "Hammuassis",
        description: "MA\u00A0STUDIO\u00A0ga doʻstim bilan birga asos solganmiz va uni birga rivojlantiryapmiz.",
      },
      teaching: {
        title: "Dars berish tajribasi",
        description: "Dars berganman, shuning uchun murakkab narsani sodda tushuntira olaman.",
      },
    },
    labels: {
      story: "Mening hikoyam",
      howIWork: "Qanday ishlayman",
      currently: "Hozir",
      whatIBring: "Kuchli tomonlarim",
    },
    currently: {
      studio: { label: "{name} studiyasini rivojlantiryapman", detail: "Veb-ilovalar, mahsulotlar va MVP" },
      fullstack: { label: "Full-stack veb-ilovalar quryapman", detail: "Frontend, backend, maʼlumotlar bazasi" },
      linux: { label: "Linuxni chuqurroq oʻrganyapman", detail: "Tizimlar va serverlar" },
    },
    values: [
      { title: "Aniqlik muhimroq", text: "Oʻzini oʻzi tushuntiradigan kod va interfeys." },
      { title: "Kichik qadamlar", text: "Katta ishni tekshirish oson boʻlgan qismlarga boʻlaman." },
      { title: "Doim oʻrganaman", text: "Qanday ishlashini tushunmagunimcha qoʻymayman." },
    ],
  },
  journey: {
    heading: {
      eyebrow: "Yoʻl",
      title: "Bosib oʻtgan",
      accent: "yoʻlim",
      description:
        "Mars IT Schooldagi ilk darslardan oʻz studiyamizgacha. Shu paytgacha bosib oʻtgan yoʻlim, qadam-baqadam.",
    },
    nextYear: "Keyin",
    nextCta: "MA\u00A0STUDIO saytiga oʻtish",
    items: {
      student: {
        title: "Mars IT Schoolda oʻqidim",
        description: "Dasturlashni shu yerda boshladim va veb-dasturlash asoslarini oʻrgandim.",
        tag: "Oʻqish",
      },
      "mars-intern": {
        title: "Mars IT Schoolda amaliyotchi",
        description:
          "Oʻqishdan soʻng oʻsha maktabning oʻzida amaliyotchi boʻlib qoldim va oʻrganganlarimni real ishda qoʻlladim.",
        tag: "Amaliyot",
      },
      "navi-intern": {
        title: "Navi Globalda amaliyotchi",
        description: "Ikkinchi amaliyotni Navi Globalda oʻtadim: yangi muhit va yangi vazifalar.",
        tag: "Amaliyot",
      },
      mastudio: {
        title: "MA\u00A0STUDIO\u00A0ga asos soldik",
        description:
          "Doʻstim bilan birga oʻz startapimizni boshladik: veb-ilovalar, raqamli mahsulotlar va MVP yaratadigan studiya.",
        tag: "Hammuassis",
      },
      teaching: {
        title: "Dars berish tajribasi",
        description:
          "Yoʻl davomida dars ham berdim. Boshqalarga tushuntirish oʻzim bilgan narsani chuqurroq anglashimga yordam berdi.",
        tag: "Ustozlik",
      },
      fullstack: {
        title: "Full-stack va Linux dasturchi",
        description:
          "3 yildan ortiq tajriba: veb-ilovalarni boshidan oxirigacha quraman va Linux muhitida ishlayman.",
        tag: "Bugun",
      },
      next: {
        title: "MA\u00A0STUDIO\u00A0ni oʻstirish va tizimlarga chuqurroq kirish",
        description:
          "Studiyani rivojlantirishda davom etaman, Linux va tizimlar boʻyicha bilimimni chuqurlashtiraman.",
        tag: "Keyingi qadam",
      },
    },
  },
  projects: {
    heading: {
      eyebrow: "Tanlangan ishlar",
      title: "Oʻzim yaratib,",
      accent: "ishga tushirganlarim",
      description:
        "Ilk chizmalardan productiongacha, boshidan oxirigacha oʻzim loyihalab yaratgan bir nechta mahsulot.",
    },
    technologiesAria: "Texnologiyalar",
    viewProject: "Loyihani koʻrish",
    code: "Kod",
    cursor: "Koʻrish",
    showcaseAria: "Loyihalar koʻrgazmasi",
    itemAria: "{total} ta loyihadan {n}-si: {title}",
    previous: "Oldingi loyiha",
    next: "Keyingi loyiha",
    items: {
      learnly: {
        title: "Learnly LMS",
        description:
          "Taʼlim platformasi: kurslar, uy vazifalarini tekshirish, jonli progress va toʻlovlar.",
        imageAlt: "Noutbuk ekranidagi analitika paneli",
      },
      "pulse-analytics": {
        title: "Pulse Analytics",
        description:
          "Savdo va trafik maʼlumotlarini kichik onlayn doʻkonlar uchun sodda, tushunarli grafiklarga aylantiradigan real vaqt paneli.",
        imageAlt: "Ekrandagi diagramma va grafiklar",
      },
      "studio-site": {
        title: "Studiya sayti",
        description:
          "Headless CMS asosidagi tezkor marketing sayti: jamoa sahifalar va keyslarni dasturchisiz eʼlon qila oladi.",
        imageAlt: "Stol ustida turgan, kod muharriri ochilgan noutbuk",
      },
      devtrack: {
        title: "DevTrack API",
        description:
          "Jamoalar oʻrtasida vazifalarni kuzatish uchun REST va webhook API: rollarga asoslangan ruxsatlar va audit jurnallari.",
        imageAlt: "Monitordagi rangli kodning yaqindan olingan tasviri",
      },
      teamspace: {
        title: "TeamSpace",
        description:
          "Oʻsib borayotgan startap uchun ichki vosita: ishga qabul bosqichlari, onboarding cheklistlari va jamoa katalogi bir joyda.",
        imageAlt: "Noutbuklarda birga ishlayotgan jamoa",
      },
    },
  },
  stack: {
    heading: {
      eyebrow: "Vositalar va stack",
      title: "Ishda tayanadigan",
      accent: "vositalarim",
      description: "Har hafta ishlatadigan vositalarim va ularni qanchalik yaxshi bilishim.",
    },
    playground: {
      filterAria: "Vositalarni yoʻnalish boʻyicha saralash",
      all: "Hammasi",
      allInfo: "Ishlatadigan barcha vositalarim, yoʻnalishiga qarab ranglangan.",
      toolCount: "{count} ta vosita",
      listAria: "Yoʻnalishlar boʻyicha vositalar",
      shake: "Silkitish",
      reset: "Qayta tashlash",
      hintPointer: "Torting, uloqtiring yoki silkiting",
      hintTouch: "Bosing yoki silkiting",
      legendCategories: "Rang yoʻnalishni bildiradi",
      legendLevels: "Belgi darajani bildiradi",
    },
    levels: {
      Expert: "Ekspert",
      Advanced: "Ilgʻor",
      Comfortable: "Ishonchli",
      Learning: "Oʻrganyapman",
    },
    categories: {
      frontend: {
        title: "Frontend",
        description: "Tez ishlaydigan va oʻzgartirish oson boʻlgan interfeyslar.",
      },
      backend: {
        title: "Backend",
        description: "Kutilmagan holatlarsiz ishlaydigan ishonchli API va maʼlumotlar.",
      },
      tools: {
        title: "Vositalar va DevOps",
        description: "Hech narsani buzmasdan tez-tez reliz qilish.",
      },
      design: {
        title: "Dizayn",
        description: "Mustaqil toʻgʻri qaror qabul qilish uchun yetarli dizayn bilimi.",
      },
    },
    skills: {
      designSystems: "Dizayn tizimlari",
      prototyping: "Prototiplash",
      accessibility: "Accessibility",
    },
  },
  startups: {
    heading: {
      eyebrow: "Startap",
      title: "Doʻstim bilan asos solgan",
      accent: "studiyamiz",
      description: "MA\u00A0STUDIO — doʻstim bilan birga asos solgan va birga rivojlantirayotgan startapimiz.",
    },
    visit: "{name} sayti",
    items: {
      mastudio: {
        role: "Hammuassis va bosh dasturchi",
        description:
          "Doʻstim Miraziz bilan birga asos solgan dasturiy studiyamiz. Veb-ilovalar, raqamli mahsulotlar va MVPlarni ilk gʻoyadan ishga tushirishgacha loyihalab, yaratamiz.",
      },
    },
    foundersLabel: "Asoschilar",
    factsLabel: "Studiya nima bilan shugʻullanadi",
    facts: {
      webApps: { title: "Veb-ilovalar", text: "Toʻliq sikl: interfeysdan servergacha." },
      products: { title: "Raqamli mahsulotlar", text: "Gʻoyadan ishlaydigan mahsulotgacha." },
      mvp: { title: "MVP", text: "Gʻoyani tez sinab koʻrish uchun ilk versiya." },
    },
  },
  process: {
    heading: {
      eyebrow: "Qanday ishlayman",
      title: "Gʻoyadan",
      accent: "mahsulotgacha",
      description: "Tutqichni suring va bitta ekran qogʻozdagi chizmadan tayyor mahsulotga qanday aylanishini koʻring.",
    },
    sliderAria: "Mahsulot bosqichi",
    stagesAria: "Bosqichga oʻtish",
    frameAria: "Rasm: bitta mahsulot ekrani tanlangan bosqichda koʻrsatilgan",
    stages: {
      idea: {
        title: "Gʻoya",
        text: "Qogʻozdan boshlayman: mahsulot kim uchun, qaysi bitta vazifani hal qiladi va eng kichik foydali versiyasi qanday.",
      },
      wireframe: {
        title: "Karkas",
        text: "Avval tuzilma, keyin bezak: kulrang bloklar bilan joylashuv, oqim va kontentni oʻzgartirish hali arzon paytda hal qilaman.",
      },
      code: {
        title: "Kod",
        text: "Tipli, qayta ishlatiladigan komponentlardan quraman: birinchi kundan haqiqiy maʼlumot va jonli koʻrinish bilan.",
      },
      live: {
        title: "Jonli",
        text: "Mahsulot tez, qulay va oʻlchanadigan holda ishga tushadi, keyin haqiqiy foydalanuvchilarga qarab yaxshilanib boradi.",
      },
    },
    mock: {
      note: "foydalanuvchi natijani darhol koʻrsin!",
      greeting: "Xayrli tong",
      sub: "Bugungi kun qanday oʻtmoqda",
      metric: "Yetkazilgan buyurtmalar",
      live: "Jonli",
      nav: ["Umumiy", "Buyurtmalar"],
      rows: ["Yangi mijozlar", "Javob vaqti", "Reyting"],
    },
  },
  story: {
    heading: {
      eyebrow: "Hikoya",
      title: "Bir daqiqada",
      accent: "men haqimda",
      description: "Olti qisqa kadr: birinchi kod satridan oʻz studiyamizgacha. Oʻzi oʻynaydi, xohlasangiz oʻzingiz varaqlang.",
    },
    playerAria: "Hikoya pleyeri",
    progressAria: "Hikoya jarayoni",
    progressText: "{total} qismdan {n}-qism: {title}",
    controls: {
      play: "Davom ettirish",
      pause: "Pauza",
      previous: "Oldingi qism",
      next: "Keyingi qism",
      replay: "Qayta koʻrish",
    },
    chapters: {
      start: {
        eyebrow: "Boshlanish",
        title: "Hammasi bitta satr",
        accent: "koddan boshlandi.",
        line: "Mars IT Schoolda oʻqidim: dasturlash men uchun shu yerda boshlandi.",
      },
      marsIntern: {
        eyebrow: "Birinchi amaliyot",
        title: "Oʻquvchidan",
        accent: "amaliyotchiga.",
        line: "Oʻqigan maktabimda, Mars IT Schoolda amaliyotchi boʻlib, bilganlarimni ishda sinadim.",
      },
      navi: {
        eyebrow: "Yangi muhit",
        title: "Yangi jamoa,",
        accent: "yangi vazifalar.",
        line: "Ikkinchi amaliyotni Navi Globalda oʻtadim: boshqa muhit, boshqa talablar.",
      },
      studio: {
        eyebrow: "Oʻz studiyamiz",
        title: "Doʻstim bilan",
        accent: "MA\u00A0STUDIO\u00A0ga asos soldik.",
        line: "Endi gʻoyalarni oʻzimiz mahsulotga aylantiramiz.",
      },
      teaching: {
        eyebrow: "Ustozlik",
        title: "Oʻrgatib,",
        accent: "oʻzim ham oʻrgandim.",
        line: "Dars berish tajribam bor: tushuntira olsang, demak chindan bilasan.",
      },
      today: {
        eyebrow: "Bugun",
        title: "Full-stack va",
        accent: "Linux dasturchi.",
        line: "3 yildan ortiq tajriba. Yoʻl esa davom etmoqda.",
      },
    },
    visual: {
      hello: "Salom",
      student: "oʻquvchi",
      intern: "amaliyotchi",
      mentor: "ustoz",
      chips: ["Full-stack", "Linux", "3+ yil"],
    },
    outro: {
      tagline: "Full-stack · Linux · MA\u00A0STUDIO",
      cta: "MA\u00A0STUDIO sayti",
    },
  },
  footer: {
    ctaLink: "MA\u00A0STUDIO sayti",
    facts: ["Full-stack", "Linux", "MA\u00A0STUDIO co-founder"],
    navAria: "Quyi navigatsiya",
    backToTop: "Yuqoriga",
  },
};
