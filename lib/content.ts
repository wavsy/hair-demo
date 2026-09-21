import { COURSES, DIRECTIONS } from "./pricing";

export type Lang = "bg" | "en";

export const SALON = {
  phone: "+359 2 950 14 20",
  phoneHref: "+35929501420",
  email: "studio@onde.bg",
  rating: 4.9,
  reviewCount: 186,
  founded: 2019,
  mapsQuery: "ул. Шишман 18, София",
  /** ул. „Цар Иван Шишман“ 18, София — geocoded with Nominatim. */
  lat: 42.69187,
  lon: 23.33023,
  bbox: "23.32523,42.68987,23.33523,42.69387",
} as const;

export const BGN_RATE = 1.95583;

export function priceLabel(eur: number, lang: Lang) {
  const bgn = (eur * BGN_RATE).toFixed(2).replace(".", lang === "bg" ? "," : ".");
  return { eur: `${eur} €`, bgn: lang === "bg" ? `${bgn} лв.` : `BGN ${bgn}` };
}

/** "20 – 28 €" for a range, "107 €" for a single price. */
export function rangeLabel(from: number, to: number | undefined, lang: Lang) {
  const low = priceLabel(from, lang);
  if (to === undefined) return low;
  const high = priceLabel(to, lang);
  return { eur: `${from} – ${to} €`, bgn: `${low.bgn} – ${high.bgn}` };
}

/**
 * Which directions each master works, and which course they lead. Booking
 * filters the list by direction, so a colourist is never offered for nails.
 */
export const MASTER_META = [
  { photo: "/images/master-1.jpg", directions: ["tsvyat", "kosa"], course: null },
  { photo: "/images/master-2.jpg", directions: ["kosa"], course: 0 },
  { photo: "/images/master-3.jpg", directions: ["kosa"], course: null },
  { photo: "/images/master-4.jpg", directions: ["nokti"], course: 1 },
  { photo: "/images/master-5.jpg", directions: ["litse"], course: 2 },
] as const;

export const GALLERY_PHOTOS = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
];

const bg = {
  lang: "bg" as Lang,
  brand: { name: "ONDÉ", sub: "Салон за красота" },
  salonName: "ONDÉ · салон за красота",
  address: "ул. „Шишман“ 18, София",
  city: "София",

  nav: {
    directions: "Направления",
    team: "Майстори",
    courses: "Курсове",
    gallery: "Галерия",
    contact: "Контакти",
    book: "Запазете час",
    menu: "Меню",
    close: "Затворете",
    masters: "Майстори",
    salon: "Салонът",
    otherLang: "EN",
  },


  home: {
    pick: "Изберете майстор",
    open: "Вижте",
    today: "днес",
    tomorrow: "утре",
  },

  masterPage: {
    years: (n: number) => `${n} години на стола`,
    strengths: "Силен в",
    teaches: (course: string) => `Води курса „${course}“`,
    works: "Работи",
    bookTitle: (name: string) => `Часовете на ${name.split(" ")[0]}`,
    bookLead: "Изберете какво ще правим и кога. Часовете, които виждате, са свободни при този човек — не някъде в салона.",
    reviews: (name: string) => `За ${name.split(" ")[0]}`,
    others: "Другите четирима",
  },

  status: {
    label: "Работно време",
    openUntil: (t: string) => `Отворено сега · до ${t}`,
    opensAt: (t: string) => `Отваряме в ${t}`,
    opensTomorrow: (t: string) => `Отваряме утре в ${t}`,
    closedToday: "Днес почиваме",
  },



  directions: {
    eyebrow: "Направления",
    title: "Четири направления. Ценоразписът се отваря, когато Ви трябва.",
    lead: "Не изсипваме сто услуги на екрана. Избирате направление и виждате точно неговия ценоразпис — с цена и време за всяка позиция.",
    chips: ["Цената е видима преди часа", "Час при конкретен майстор", "Плащане в брой или с карта"],
    from: "от",
    min: "мин",
    open: "Вижте ценоразписа",
    close: "Затворете",
    positions: (n: number) => `${n} ${n === 1 ? "позиция" : "позиции"}`,
    selected: (n: number) => `Избрани ${n} ${n === 1 ? "услуга" : "услуги"}`,
    about: "около",
    bookThis: "Запазете час за това",
    note: "Ориентировъчни цени по публикувани софийски ценоразписи, септември 2026 г. Точната сума зависи от дължината и състоянието на косата и се потвърждава от майстора, преди да започне работа.",
    currencyNote: "Цените са в евро. Левовата равностойност е по фиксирания курс 1 € = 1,95583 лв. и е само за ориентир.",
    items: [
      {
        title: "Коса",
        blurb: "Подстригване, оформяне и грижа. Дължината и структурата решават времето, затова всяка позиция носи и своето.",
        prices: [
          { title: "Дамско подстригване", note: "с измиване и оформяне" },
          { title: "Мъжко подстригване", note: "машинка и ножица" },
          { title: "Мъжко подстригване с брада", note: "с оформяне и стайлинг" },
          { title: "Оформяне на брада", note: "контур и бръснач" },
          { title: "Официална прическа", note: "за сватба, бал или снимки" },
          { title: "Ламиниране", note: "грижа, не цвят" },
        ],
      },
      {
        title: "Цвят",
        blurb: "Корен, кичури и балеаж. Цветът се прави от майстор, който работи само с цвят.",
        prices: [
          { title: "Боядисване на корен", note: "до израстъка" },
          { title: "Кичури с фолио", note: "според гъстотата" },
          { title: "Балеаж", note: "цената зависи от дължината" },
        ],
      },
      {
        title: "Нокти",
        blurb: "Маникюр и педикюр в отделно помещение от сешоарите — без шум и без лак във въздуха на салона.",
        prices: [
          { title: "Класически маникюр", note: "оформяне и полиране, без лак" },
          { title: "Маникюр с гел лак", note: "с оформяне на плочката" },
          { title: "Маникюр с изграждане", note: "гел или акрил" },
          { title: "Изграждане с типсове", note: "за къса или начупена плочка" },
          { title: "Педикюр с гел лак", note: "с оформяне и обработка" },
          { title: "Сваляне на гел лак", note: "без нова процедура" },
        ],
      },
      {
        title: "Лице",
        blurb: "Козметика и апаратни процедури, по програма след консултация. Първият път започва с преглед на кожата.",
        prices: [
          { title: "Почистване на лице", note: "ръчно, с подготовка и успокояване" },
          { title: "Масаж на лице", note: "по желание, след процедура" },
          { title: "Дълбока хидратация", note: "със серум и маска" },
          { title: "RF лифтинг", note: "апаратна процедура, на курс" },
          { title: "Микронидлинг", note: "по програма след консултация" },
          { title: "Ламиниране на вежди", note: "с оформяне и боядисване" },
        ],
      },
    ],
  },

  booking: {
    eyebrow: "Записване",
    title: "Направление, майстор, час.",
    lead: "Три избора и данните за връзка. Получавате потвърждение веднага и файл за календара.",
    steps: ["Направление", "Майстор", "Ден и час", "Данни"],
    q1: "Какво ще правим?",
    q1sub: "Изберете направление, после позициите от ценоразписа.",
    q2: "При кого?",
    q2sub: "Показваме само майсторите, които работят това направление.",
    anyMaster: "Всеки свободен",
    masterHint: (name: string) => `Показваме само часовете, в които ${name} е свободен.`,
    q3: "Кога Ви е удобно?",
    noSlots: "За този ден няма свободни часове. Изберете друг ден или ни се обадете.",
    closedDay: "В неделя салонът почива. Изберете друг ден.",
    what: "Какво ще правим",
    nothingPicked: "Изберете поне едно нещо",
    again: "Ново записване",
    demoNote: "Демонстрационен сайт. Часът не се записва никъде и никой не Ви търси.",
    q4: "Как да Ви потърсим?",
    yourName: "Вашето име",
    namePlaceholder: "Име и фамилия",
    phone: "Телефон",
    phonePlaceholder: "08XX XXX XXX",
    back: "Назад",
    next: "Напред",
    confirm: "Потвърдете часа",
    doneTitle: "Часът е запазен.",
    doneLead: (p: string) => `Потвърждението тръгва към ${p}. Очакваме Ви.`,
    cardTitle: "Вашият час",
    confirmed: "потвърден",
    when: "Кога",
    servicesLabel: "Услуги",
    master: "Майстор",
    approx: "Приблизително",
    addCalendar: "Добавете в календара",
    newBooking: "Нов час",
    phonePrefer: "Предпочитате по телефон? Обадете се на",
    icsSummary: (s: string) => `ONDÉ — ${s}`,
    icsPhone: "Телефон",
    icsAlarm: "Час в ONDÉ след 2 часа",
    weekdays: ["нед", "пон", "вт", "ср", "чет", "пет", "съб"],
    months: ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември"],
  },



  courses: {
    eyebrow: "Курсове",
    title1: "Учи се в салон,",
    title2: "не в празна зала.",
    lead: "Три курса, водени от майсторите, които ще видите на съседния стол. Програмата, датите и свободните места стоят тук, а записването е онлайн.",
    hours: "учебни часа",
    practice: "практика",
    theory: "теория",
    certificate: "Документ",
    price: "Такса",
    programme: "Програма",
    forWhom: "За кого",
    leadBy: "Води",
    starts: "Започва",
    nextIntake: "Следващ прием",
    seatsLeft: (n: number) => `остават ${n} ${n === 1 ? "място" : "места"}`,
    soldOut: "Няма свободни места",
    enroll: "Запишете се",
    enrollTitle: (c: string) => `Записване за „${c}“`,
    enrollLead: (d: string) => `Приемът започва на ${d}. Оставете данни за връзка и запазваме мястото за 48 часа.`,
    doneTitle: "Мястото е запазено.",
    doneLead: (p: string) => `Обаждаме се на ${p} до два работни дни, за да потвърдим.`,
    addCalendar: "Добавете в календара",
    cancel: "Затворете",
    icsSummary: (c: string) => `ONDÉ — начало на курс „${c}“`,
    note: "Таксите са изравнени по публикувани такси на софийски школи, септември 2026 г. Плащането е на две вноски.",
    items: [
      {
        title: "Фризьорство",
        blurb: "Пълен курс по фризьорство — подстригване, цвят, оформяне и работа с клиент.",
        forWhom: "За начинаещи, без предварителен опит.",
        certificate: "Свидетелство за професионална квалификация",
        modules: [
          "Подстригване — дамско и мъжко",
          "Цвят, кичури и балеаж",
          "Оформяне и официални прически",
          "Работа с клиент и хигиена",
        ],
      },
      {
        title: "Маникюр с гел лак",
        blurb: "Маникюр с гел лак от нулата, върху модели в работния салон.",
        forWhom: "За начинаещи и за хора, които работят сами вкъщи.",
        certificate: "Удостоверение от ONDÉ",
        modules: [
          "Подготовка на нокътната плочка",
          "Гел лак — основа, цвят, топ",
          "Дизайн и корекция",
          "Хигиена и стерилизация",
        ],
      },
      {
        title: "Професионален грим",
        blurb: "Професионален грим за снимка, сцена и всекидневие.",
        forWhom: "За стилисти и за хора, които тръгват към гримьорството.",
        certificate: "Удостоверение от ONDÉ",
        modules: [
          "Тен и коректори",
          "Око — техники според формата",
          "Дневен и вечерен грим",
          "Грим за снимка и сцена",
        ],
      },
    ],
  },




  contact: {
    eyebrow: "Контакти",
    title: "Намерете ни на „Шишман“.",
    reception: "Телефон",
    email: "Имейл",
    address: "Адрес",
    map: "Карта",
    openMap: "Отворете в OpenStreetMap →",
    closed: "почивен ден",
    note: "Входът е на улично ниво. Пред салона има зона за платено паркиране.",
    hours: [
      { day: "Понеделник", from: "09:00", to: "20:00" },
      { day: "Вторник", from: "09:00", to: "20:00" },
      { day: "Сряда", from: "09:00", to: "20:00" },
      { day: "Четвъртък", from: "09:00", to: "20:00" },
      { day: "Петък", from: "09:00", to: "20:00" },
      { day: "Събота", from: "09:00", to: "18:00" },
      { day: "Неделя", from: "", to: "" },
    ],
  },

  footer: {
    about: (y: number) => `Салон за красота на ул. „Шишман“ в София. Работим от ${y} г.`,
    colDirections: "Направления",
    colSalon: "Салонът",
    colContact: "Връзка",
    salon: ["Майстори", "Курсове", "Галерия", "Контакти"],
    hoursLine: "Понеделник–петък 09:00–20:00 · събота 09:00–18:00 · неделя почиваме",
    demoNote: "Демонстрационен сайт. Салонът е измислен.",
    madeBy: "Сайт от",
    demo: "Демонстрационен сайт. Салонът е измислен.",
  },


};

const en: typeof bg = {
  lang: "en" as Lang,
  brand: { name: "ONDÉ", sub: "Beauty salon" },
  salonName: "ONDÉ · beauty salon",
  address: "18 Shishman St, Sofia",
  city: "Sofia",

  nav: {
    directions: "Services",
    team: "Stylists",
    courses: "Courses",
    gallery: "Gallery",
    contact: "Contact",
    book: "Book a chair",
    menu: "Menu",
    close: "Close",
    masters: "Stylists",
    salon: "The salon",
    otherLang: "BG",
  },


  home: {
    pick: "Choose a stylist",
    open: "See more",
    today: "today",
    tomorrow: "tomorrow",
  },

  masterPage: {
    years: (n: number) => `${n} years in the chair`,
    strengths: "Good at",
    teaches: (course: string) => `Teaches “${course}”`,
    works: "Work",
    bookTitle: (name: string) => `${name.split(" ")[0]}'s hours`,
    bookLead: "Pick what we are doing and when. This is their own diary — the hours you see are free with this person, not somewhere in the salon.",
    reviews: (name: string) => `On ${name.split(" ")[0]}`,
    others: "The other four",
  },

  status: {
    label: "Opening hours",
    openUntil: (t: string) => `Open now · until ${t}`,
    opensAt: (t: string) => `Opens at ${t}`,
    opensTomorrow: (t: string) => `Opens tomorrow at ${t}`,
    closedToday: "Closed today",
  },



  directions: {
    eyebrow: "Services",
    title: "Four directions. The price list opens when you need it.",
    lead: "We don't tip a hundred services onto the screen. Pick a direction and you get exactly its price list — with a price and a duration on every line.",
    chips: ["Price visible before the appointment", "Book a named stylist", "Cash or card"],
    from: "from",
    min: "min",
    open: "See the price list",
    close: "Close",
    positions: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
    selected: (n: number) => `${n} ${n === 1 ? "service" : "services"} selected`,
    about: "about",
    bookThis: "Book this",
    note: "Indicative prices, aligned to published Sofia price lists, September 2026. The exact figure depends on the length and condition of the hair and is confirmed by your stylist before any work starts.",
    currencyNote: "Prices are in euro. The lev equivalent uses the fixed rate €1 = BGN 1.95583 and is for reference only.",
    items: [
      {
        title: "Hair",
        blurb: "Cutting, styling and care. Length and texture decide the time, so every line carries its own.",
        prices: [
          { title: "Women's cut", note: "wash and blow-dry included" },
          { title: "Men's cut", note: "clipper and scissors" },
          { title: "Men's cut with beard", note: "shaped and styled" },
          { title: "Beard shaping", note: "outline and razor" },
          { title: "Occasion styling", note: "weddings, proms, shoots" },
          { title: "Lamination", note: "care, not colour" },
        ],
      },
      {
        title: "Colour",
        blurb: "Roots, highlights and balayage. Colour is done by a stylist who works with nothing else.",
        prices: [
          { title: "Root colour", note: "to the regrowth line" },
          { title: "Foil highlights", note: "depends on thickness" },
          { title: "Balayage", note: "price follows the length" },
        ],
      },
      {
        title: "Nails",
        blurb: "Manicure and pedicure in a room of their own, away from the dryers — no noise, no varnish in the salon air.",
        prices: [
          { title: "Classic manicure", note: "shaped and buffed, no colour" },
          { title: "Gel polish manicure", note: "with nail shaping" },
          { title: "Manicure with extensions", note: "gel or acrylic" },
          { title: "Tip extensions", note: "for short or broken nails" },
          { title: "Gel polish pedicure", note: "shaping and footwork included" },
          { title: "Gel polish removal", note: "on its own, no new set" },
        ],
      },
      {
        title: "Skin",
        blurb: "Facials and device-led treatments, on a plan after a consultation. The first visit starts by looking at the skin.",
        prices: [
          { title: "Facial cleanse", note: "by hand, with prep and calming" },
          { title: "Facial massage", note: "optional, after a treatment" },
          { title: "Deep hydration", note: "serum and mask" },
          { title: "RF lifting", note: "device-led, taken as a course" },
          { title: "Microneedling", note: "on a plan, after a consultation" },
          { title: "Brow lamination", note: "shaped and tinted" },
        ],
      },
    ],
  },

  booking: {
    eyebrow: "Booking",
    title: "Service, stylist, time.",
    lead: "Three choices and a way to reach you. You get instant confirmation and a calendar file.",
    steps: ["Service", "Stylist", "Day & time", "Details"],
    q1: "What are we doing?",
    q1sub: "Pick a direction, then the lines from its price list.",
    q2: "With whom?",
    q2sub: "We only show the stylists who work this direction.",
    anyMaster: "Anyone free",
    masterHint: (name: string) => `Showing only the hours ${name} is free.`,
    q3: "When suits you?",
    noSlots: "No free times on this day. Pick another day or give us a call.",
    closedDay: "The salon is closed on Sunday. Please pick another day.",
    what: "What are we doing",
    nothingPicked: "Pick at least one thing",
    again: "Book again",
    demoNote: "Demonstration site. Nothing is stored and nobody will call you.",
    q4: "How do we reach you?",
    yourName: "Your name",
    namePlaceholder: "First and last name",
    phone: "Phone",
    phonePlaceholder: "+359 8XX XXX XXX",
    back: "Back",
    next: "Next",
    confirm: "Confirm the booking",
    doneTitle: "Your chair is booked.",
    doneLead: (p: string) => `Confirmation is on its way to ${p}. See you soon.`,
    cardTitle: "Your appointment",
    confirmed: "confirmed",
    when: "When",
    servicesLabel: "Services",
    master: "Stylist",
    approx: "Approximately",
    addCalendar: "Add to calendar",
    newBooking: "New booking",
    phonePrefer: "Rather do it by phone? Call",
    icsSummary: (s: string) => `ONDÉ — ${s}`,
    icsPhone: "Phone",
    icsAlarm: "ONDÉ appointment in 2 hours",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },



  courses: {
    eyebrow: "Courses",
    title1: "Learn in a working salon,",
    title2: "not in an empty room.",
    lead: "Three courses, taught by the stylists you'll see at the next chair. The programme, the dates and the places left are all here, and enrolment is online.",
    hours: "teaching hours",
    practice: "practice",
    theory: "theory",
    certificate: "Certificate",
    price: "Fee",
    programme: "Programme",
    forWhom: "Who it's for",
    leadBy: "Taught by",
    starts: "Starts",
    nextIntake: "Next intake",
    seatsLeft: (n: number) => `${n} ${n === 1 ? "place" : "places"} left`,
    soldOut: "Fully booked",
    enroll: "Enrol",
    enrollTitle: (c: string) => `Enrolling in "${c}"`,
    enrollLead: (d: string) => `The intake starts on ${d}. Leave your details and we hold the place for 48 hours.`,
    doneTitle: "Your place is held.",
    doneLead: (p: string) => `We'll call ${p} within two working days to confirm.`,
    addCalendar: "Add to calendar",
    cancel: "Close",
    icsSummary: (c: string) => `ONDÉ — "${c}" course begins`,
    note: "Fees are aligned to published fees of Sofia schools, September 2026. Payment is in two instalments.",
    items: [
      {
        title: "Hairdressing",
        blurb: "The full hairdressing course — cutting, colour, styling and working with a client.",
        forWhom: "For beginners, with no previous experience.",
        certificate: "State certificate of professional qualification",
        modules: [
          "Cutting — women's and men's",
          "Colour, highlights and balayage",
          "Styling and occasion hair",
          "Working with a client, and hygiene",
        ],
      },
      {
        title: "Gel polish manicure",
        blurb: "Gel polish from scratch, on models in the working salon.",
        forWhom: "For beginners and for people already working at home.",
        certificate: "ONDÉ certificate",
        modules: [
          "Preparing the nail plate",
          "Gel polish — base, colour, top",
          "Design and correction",
          "Hygiene and sterilisation",
        ],
      },
      {
        title: "Professional make-up",
        blurb: "Professional make-up for camera, stage and everyday wear.",
        forWhom: "For stylists and for people moving into make-up.",
        certificate: "ONDÉ certificate",
        modules: [
          "Base and concealing",
          "Eyes — technique by shape",
          "Day and evening make-up",
          "Make-up for camera and stage",
        ],
      },
    ],
  },




  contact: {
    eyebrow: "Contact",
    title: "Find us on Shishman St.",
    reception: "Phone",
    email: "Email",
    address: "Address",
    map: "Map",
    openMap: "Open in OpenStreetMap →",
    closed: "closed",
    note: "The entrance is at street level. There is paid street parking in front of the salon.",
    hours: [
      { day: "Monday", from: "09:00", to: "20:00" },
      { day: "Tuesday", from: "09:00", to: "20:00" },
      { day: "Wednesday", from: "09:00", to: "20:00" },
      { day: "Thursday", from: "09:00", to: "20:00" },
      { day: "Friday", from: "09:00", to: "20:00" },
      { day: "Saturday", from: "09:00", to: "18:00" },
      { day: "Sunday", from: "", to: "" },
    ],
  },

  footer: {
    about: (y: number) => `A beauty salon on Shishman Street in Sofia. Open since ${y}.`,
    colDirections: "Services",
    colSalon: "The salon",
    colContact: "Contact",
    salon: ["Stylists", "Courses", "Gallery", "Contact"],
    hoursLine: "Monday–Friday 09:00–20:00 · Saturday 09:00–18:00 · closed Sunday",
    demoNote: "Demonstration site. The salon is invented.",
    madeBy: "Site by",
    demo: "Demonstration site. The salon is invented.",
  },


};

export type Content = typeof bg;

export const CONTENT = { bg, en };

export function getContent(lang: Lang): Content {
  return CONTENT[lang];
}

/** Guard rails the dictionaries and the price data must keep in step. */
export const DIRECTION_COUNT = DIRECTIONS.length;
export const COURSE_COUNT = COURSES.length;
