import type { Dictionary } from "@/lib/i18n/types";

/*
 * Uzbek, Latin script. Apostrophes: ʻ (U+02BB) in oʻ / gʻ and ʼ (U+02BC) for the
 * tutuq belgisi (maʼlumot, eʼtibor). Keep them consistent; do not use ' or `.
 */
export const uz: Dictionary = {
  nav: {
    labels: {
      home: "Bosh sahifa",
      about: "Men haqimda",
      journey: "Yoʻl",
      projects: "Loyihalar",
      stack: "Stack",
      startups: "Startaplar",
      contact: "Aloqa",
    },
    cta: "Bogʻlanish",
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
    fullName: "Asadbek",
    role: "Dasturchi-muhandis va veb-dasturchi",
    location: "Toshkent, Oʻzbekiston",
    city: "Toshkent",
    country: "Oʻzbekiston",
    tagline:
      "Tez va qulay veb-mahsulotlar yarataman, yangi dasturchilarga esa ilk loyihalarini ishga tushirishda yordam beraman.",
    intro:
      "Veb-ilovalarni ilk chizmadan tayyor mahsulotgacha oʻzim loyihalab, yarataman. Asosan TypeScript tilida yozaman, mayda detallarga eʼtibor beraman va oʻrganganlarimni boshqalarga oʻrgataman.",
    avatarAlt: "Yogʻoch stol ustida turgan, ekranida kod ochilgan noutbuk",
  },
  stats: {
    years: "Yillik veb-tajriba",
    projects: "Topshirilgan loyiha",
    students: "Oʻqitilgan oʻquvchi",
    startups: "Asos solingan startap",
  },
  metrics: {
    // Singular on purpose: Uzbek nouns stay singular after a number ("500+ oʻquvchi").
    students: "Oʻquvchi",
    courses: "Kurs",
    hired: "Bitirgach ishga joylashgan",
    products: "Ishga tushirilgan mahsulot",
    team: "Jamoa aʼzosi",
    betaUsers: "Beta foydalanuvchi",
    mentors: "Mentor",
    projectsShipped: "Topshirilgan loyiha",
    studentsMentored: "Oʻqitilgan oʻquvchi",
  },
  hero: {
    greetingBefore: "Salom, men ",
    greetingAfter: "",
    headline: [
      { text: "Toza" },
      { text: "va" },
      { text: "tez" },
      { text: "veb-mahsulotlar", accent: true },
      { text: "yaratadigan" },
      { text: "dasturchi." },
    ],
    viewProjects: "Loyihalar",
    contactMe: "Bogʻlanish",
    socialsAria: "Ijtimoiy tarmoqlar",
    basedIn: "Toshkentda",
    nowEyebrow: "Hozirgi loyiha",
    nowLine: "Veb-dasturlashni noldan, real loyihalar asosida oʻrgatamiz.",
    nowAria: "Hozirgi loyiha: {name}. Startaplarni koʻrish",
    stackEyebrow: "Kundalik stack",
    stackTitle: "Men ishlatadigan vositalar",
    stackAria: "Kundalik stackim. Toʻliq roʻyxatni koʻrish",
  },
  about: {
    heading: {
      eyebrow: "Men haqimda",
      title: "Eʼtiborim doim",
      accent: "mayda detallarda",
      description:
        "Qisqasi: veb-mahsulotlar yarataman, IT akademiyani boshqaraman va ishni sodda qilishni yaxshi koʻraman.",
    },
    paragraphs: [
      "Men Asadbek, toshkentlik dasturchi-muhandisman. Hammasi doʻstlarim uchun kichik saytlar yasashdan boshlangan, keyin bu asta-sekin kasbimga va tashlab boʻlmaydigan odatimga aylandi.",
      "Hozir React, Next.js va Node.js yordamida veb-ilovalar yarataman. Menga sokin va tez ishlaydigan mahsulotlar, keyingi dasturchi oson oʻqiy oladigan kod va ochiq gaplashadigan jamoalar yoqadi.",
      "Mijozlar loyihalaridan tashqari IT akademiyani boshqaraman: yangi boshlovchilarga noldan birinchi ishigacha boʻlgan yoʻlni bosib oʻtishda yordam beraman. Dars berish asoslarni unutishga yoʻl qoʻymaydi.",
    ],
    highlights: {
      product: {
        title: "Mahsulotni oʻylayman",
        description: "Faqat vazifani emas, foydalanuvchi va biznesni ham hisobga olaman.",
      },
      code: {
        title: "Toza, tiplangan kod",
        description: "Hamma joyda TypeScript, kichik komponentlar va kerakli joyda testlar.",
      },
      teacher: {
        title: "Qalban ustozman",
        description: "Yuzlab oʻquvchiga ilk HTML sahifadan birinchi ish taklifigacha ustozlik qilganman.",
      },
      delivery: {
        title: "Oʻz vaqtida topshiraman",
        description: "Aniq hajm, tezkor fikr almashuv va oxirida kutilmagan holatlarsiz.",
      },
    },
    labels: {
      story: "Mening hikoyam",
      howIWork: "Qanday ishlayman",
      currently: "Hozir",
      whatIBring: "Kuchli tomonlarim",
    },
    currently: {
      academy: { label: "{name} rahbariman", detail: "Har oy yangi veb-dasturlash guruhi" },
      clients: {
        label: "Mijozlar uchun veb-ilovalar yarataman",
        detail: "Next.js, TypeScript, Postgres",
      },
      learning: { label: "Go tilini oʻrganaman", detail: "Tezroq va soddaroq backend uchun" },
    },
    values: [
      { title: "Aniqlik muhimroq", text: "Oʻzini oʻzi tushuntiradigan kod va interfeys." },
      { title: "Kichik qadamlar, tez-tez relizlar", text: "Natijani har hafta koʻrasiz." },
      { title: "Halol va samimiy fikr", text: "Murakkab atamalarsiz, kutilmagan holatlarsiz." },
    ],
  },
  journey: {
    heading: {
      eyebrow: "Yoʻl",
      title: "Bosib oʻtgan",
      accent: "yoʻlim",
      description:
        "Ilk kod satridan akademiya va bir nechta startapgacha. Shu paytgacha bosib oʻtilgan yoʻl, yilma-yil.",
    },
    nextYear: "Keyin",
    nextCta: "Keling, birga yarataylik",
    items: {
      "first-code": {
        title: "Ilk kod satrimni yozdim",
        description:
          "HTML, CSS va katta qiziqish bilan boshladim: doʻstlarim va oilam uchun kichik saytlar yasadim.",
        tag: "Boshlanish",
      },
      "first-client": {
        title: "Birinchi frilans mijoz",
        description:
          "Mahalliy biznes uchun ilk pullik saytni topshirdim va muddat bilan aniq hajm koddan kam ahamiyatli emasligini tushundim.",
        tag: "Frilans",
      },
      "product-team": {
        title: "Mahsulot jamoasiga qoʻshildim",
        description:
          "React va TypeScript bilan toʻliq ishlay boshladim, dizaynerlar bilan sprintlarda ishladim va real foydalanuvchilar uchun funksiyalar chiqardim.",
        tag: "Mahsulot",
      },
      academy: {
        title: "ICO IT Academy akademiyasiga asos soldim",
        description:
          "Ustozlikni maktabga aylantirdim: kichik guruhlar, real loyihalar va Oʻzbekistondagi yangi boshlovchilar uchun karyera boʻyicha yordam.",
        tag: "Asoschi",
      },
      graduates: {
        title: "Ilk bitiruvchilar ishga joylashdi",
        description:
          "Birinchi guruhlarimiz dasturchi boʻlib ishga kirdi, akademiya esa tavsiyalar orqali oʻsdi.",
        tag: "Taʼlim",
      },
      kodline: {
        title: "Kodline hammuassisi boʻldim",
        description:
          "Mahalliy bizneslar va endi boshlayotgan asoschilar uchun veb-ilovalar hamda MVP yaratadigan mahsulot studiyasini ochdik.",
        tag: "Startap",
      },
      growth: {
        title: "500+ oʻquvchi va uchinchi startap",
        description:
          "Akademiyada oʻquvchilar soni 500 dan oshdi. Junior dasturchilarni tajribali mentorlar bilan bogʻlash uchun Mentorly loyihasini boshladim.",
        tag: "Oʻsish",
      },
      next: {
        title: "Keyingisi sizning mahsulotingiz boʻlishi mumkin",
        description:
          "Startaplarni rivojlantirish, odamlar zavq bilan foydalanadigan yangi mahsulotlar yaratish va yana 1000 nafar dasturchini oʻqitish.",
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
          "IT akademiya uchun taʼlim platformasi: kurslar, uy vazifalarini tekshirish, jonli progress va 1000+ oʻquvchi uchun toʻlovlar.",
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
          "Jamoalar oʻrtasida vazifalarni kuzatish uchun REST va webhook API: rollarga asoslangan ruxsatlar, audit jurnallari va 99,9% uptime.",
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
    legendAria: "Bilim darajalari",
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
      eyebrow: "Mijozlar ishidan tashqari",
      title: "Startaplar va",
      accent: "tashabbuslar",
      description:
        "Oʻzim asos solgan yoki boshqarishda qatnashayotgan kompaniyalar. Ular asosan taʼlim va dasturchilarning oʻsishiga oid.",
    },
    visit: "{name} sayti",
    present: "hozir",
    statuses: {
      Active: "Faol",
      Growing: "Oʻsmoqda",
      Building: "Qurilmoqda",
      Exited: "Sotilgan",
      Paused: "Toʻxtatilgan",
    },
    items: {
      "ico-it-academy": {
        role: "Asoschi va bosh mentor",
        description:
          "Oʻzbekistondagi IT taʼlim akademiyasi: veb-dasturlashni noldan, kichik guruhlarda, real loyihalar va karyera boʻyicha yordam bilan oʻrgatadi.",
      },
      kodline: {
        role: "Hammuassis va CTO",
        description:
          "Mahalliy bizneslar va endi boshlayotgan asoschilar uchun veb-ilovalar va MVP yaratadigan kichik mahsulot studiyasi.",
      },
      mentorly: {
        role: "Asoschi",
        description:
          "Junior dasturchilarni tajribali mentorlar bilan bogʻlaydigan platforma: haftalik kod-revyu va karyera boʻyicha suhbatlar.",
      },
    },
  },
  contact: {
    heading: {
      eyebrow: "Aloqa",
      title: "Keling, yangi narsani",
      accent: "birga yarataylik",
      description:
        "Mahsulot gʻoyangiz, eʼtibor talab qiladigan saytingiz yoki yana bir yordamchi kerak boʻlgan jamoangiz bormi? Qisqa xabar yozing, bir-ikki kun ichida javob beraman.",
    },
    remote: "masofadan ishlayman",
    formTitle: "Xabar yozing",
    formNote: "Barcha maydonlarni toʻldirish shart.",
    socialsAria: "Ijtimoiy tarmoqlardagi profillar",
    form: {
      labels: { name: "Ismingiz", email: "Email", message: "Xabar" },
      placeholders: {
        name: "Jasur Karimov",
        email: "name@site.com",
        message: "Loyiha haqida bir necha soʻz",
      },
      messageHint: "Nima yaratmoqchisiz va u qachonga kerak?",
      errors: {
        name: "Kimga javob yozishimni bilishim uchun ismingizni kiriting.",
        email: "Email toʻliq emasga oʻxshaydi. Masalan: name@site.com.",
        message: "Loyihangiz haqida yana bir necha soʻz yozing (kamida 10 ta belgi).",
      },
      note: "Xabar tayyor holda pochta ilovangizda ochiladi.",
      send: "Xabar yuborish",
      sending: "Pochta ochilmoqda…",
      sent: "Yuborishga tayyor",
      sentStatus: "Pochta ilovangiz yuborishga tayyor xabar bilan ochilishi kerak.",
      subject: "Loyiha boʻyicha soʻrov: {name}",
    },
    copy: {
      copy: "Nusxalash",
      copied: "Nusxalandi",
      copyAria: "Email manzilni nusxalash",
      copiedAria: "Email nusxalandi",
      copiedStatus: "Email manzil buferga nusxalandi",
      emailDirect: "Email yozish",
    },
  },
  footer: {
    tagline:
      "Toshkentlik dasturchi-muhandis va veb-dasturchi. Sokin, tez veb-mahsulotlar yarataman va boshqalarga ham shuni oʻrgataman.",
    navAria: "Quyi navigatsiya",
    navigate: "Boʻlimlar",
    elsewhere: "Tarmoqlarda",
    backToTop: "Yuqoriga",
    rights: "Barcha huquqlar himoyalangan.",
  },
};
