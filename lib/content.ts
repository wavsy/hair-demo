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
    otherLang: "EN",
  },

  topbar: { tagline: "Избирате майстора, не салона" },

  status: {
    label: "Работно време",
    openUntil: (t: string) => `Отворено сега · до ${t}`,
    opensAt: (t: string) => `Отваряме в ${t}`,
    opensTomorrow: (t: string) => `Отваряме утре в ${t}`,
    closedToday: "Днес почиваме",
  },

  hero: {
    badge: "Салон за красота · ул. „Шишман“, София",
    title1: "Косата помни",
    title2: "кой я е докоснал.",
    lead: "ONDÉ е салон от петима майстори. Избирате човека, виждате цената и запазвате часа онлайн — за под минута, без обаждане.",
    ctaBook: "Запазете час",
    ctaPrices: "Вижте ценоразписа",
    statRating: "от 186 отзива",
    statMasters: "майстори",
    statMastersValue: "5",
    statYears: "на ул. „Шишман“",
    statYearsValue: "7 г.",
    instant: "Потвърждение веднага",
    slotsTitle: "Свободни часове",
    slotsChecking: "проверяваме наличността…",
    slotsSoonest: (w: string) => `най-рано ${w}`,
    today: "днес",
    tomorrow: "утре",
  },

  marquee: [
    "Подстригване", "Цвят", "Балеаж", "Кичури с фолио", "Ламиниране",
    "Официална прическа", "Маникюр", "Микронидлинг", "Курсове",
  ],

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

  why: {
    eyebrow: "Защо ONDÉ",
    title1: "Салонът е сбор",
    title2: "от пет ръце.",
    badgeValue: "5",
    badgeText: "майстори, всеки със собствен график",
    items: [
      {
        title: "Часът е при човек, не при салон",
        text: "Избирате майстора на втората стъпка и графикът се стеснява до неговия. Същият човек Ви поема и следващия път.",
        icon: "user",
      },
      {
        title: "Цената се вижда преди часа",
        text: "Всяко направление носи своя ценоразпис. Точната сума се потвърждава от майстора, преди да започне работа.",
        icon: "tag",
      },
      {
        title: "Ценоразписът не Ви залива",
        text: "Четири направления вместо сто реда в списък. Отваря се само това, което сте избрали.",
        icon: "list",
      },
      {
        title: "Курсовете са в същия салон",
        text: "Обучението върви в работните часове, върху модели в залата — не в празно помещение след работно време.",
        icon: "cap",
      },
    ],
  },

  team: {
    eyebrow: "Майстори",
    title: "Петима души. Всеки със свой график.",
    lead: "Изберете човека, а не салона. Под всяко име стои неговият собствен календар.",
    bookWith: (name: string) => `Запазете час при ${name}`,
    leads: "Води курса",
    members: [
      {
        name: "Ирина Вълчева",
        role: "Главен стилист · цвят",
        line: "Работи само с цвят. Балеаж, кичури и корекции след домашно боядисване.",
      },
      {
        name: "Боряна Митева",
        role: "Стилист · подстригване",
        line: "Дамско подстригване и официални прически. Води курса по фризьорство.",
      },
      {
        name: "Даниел Петков",
        role: "Барбер",
        line: "Мъжко подстригване с машинка и ножица, оформяне на брада.",
      },
      {
        name: "Ния Стоянова",
        role: "Ноктопластика",
        line: "Маникюр с гел лак и с изграждане. Води курса по маникюр.",
      },
      {
        name: "Елена Георгиева",
        role: "Грим и грижа за кожата",
        line: "Апаратни процедури за лицето и професионален грим. Води курса по грим.",
      },
    ],
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

  gallery: {
    eyebrow: "Галерия",
    title: "Работа, не каталог.",
    lead: "Снимки от салона и от ръцете на майсторите.",
    items: [
      { caption: "Балеаж, дълга коса" },
      { caption: "Дамско подстригване" },
      { caption: "Цвят на корен" },
      { caption: "Официална прическа" },
      { caption: "Маникюр с гел лак" },
      { caption: "Залата на ул. „Шишман“" },
    ],
  },

  reviews: {
    eyebrow: "Отзиви",
    title1: "186 души",
    title2: "се върнаха при същия майстор.",
    ratingNote: "средна оценка от 186 отзива",
    items: [
      {
        text: "Ходя при Ирина втора година. Носех ѝ коса, съсипана от домашно изрусяване, и тя ми каза честно, че ще трябват три посещения. Трябваха три.",
        author: "Маргарита Д.",
        meta: "цвят и балеаж",
      },
      {
        text: "Запазих час в 23 часа от телефона, за събота сутрин, при конкретния човек. Без обаждания, без чакане да ми отговорят в Instagram.",
        author: "Калина Н.",
        meta: "дамско подстригване",
      },
      {
        text: "Записах се на курса по маникюр, защото го водят в салона, докато той работи. Учиш върху истински клиенти, не върху пластмасова ръка.",
        author: "Станимира В.",
        meta: "курс по маникюр",
      },
    ],
  },

  faq: {
    eyebrow: "Въпроси",
    title: "Това, което хората питат най-често.",
    items: [
      {
        q: "Мога ли да избера при кого да отида?",
        a: "Да, и това е втората стъпка при записване. Щом изберете майстор, показваме само неговите свободни часове. Ако Ви е все едно, оставете „Всеки свободен“ и ще видите всички часове в салона.",
      },
      {
        q: "Защо цените са в диапазон?",
        a: "Защото дължината и състоянието на косата променят и времето, и материала. Диапазонът е честният отговор предварително. Точната сума Ви я казва майсторът, преди да започне работа.",
      },
      {
        q: "Какво става, ако закъснея или не мога да дойда?",
        a: "Обадете се. Ако предупредите поне два часа предварително, преместваме часа без условия. При закъснение над 15 минути може да се наложи да съкратим услугата, за да не изместим следващия клиент.",
      },
      {
        q: "Работите ли в неделя?",
        a: "Не. От понеделник до петък сме от 09:00 до 20:00, в събота — от 09:00 до 18:00. В неделя салонът почива.",
      },
      {
        q: "Как се плаща?",
        a: "В брой или с карта, след услугата. Цените са в евро, а левовата равностойност е по фиксирания курс 1 € = 1,95583 лв. и служи само за ориентир.",
      },
      {
        q: "Курсовете издават ли документ?",
        a: "Курсът по фризьорство завършва със Свидетелство за професионална квалификация. Курсовете по маникюр и по грим завършват с удостоверение от салона.",
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
    madeBy: "Сайт от",
    demo: "Демонстрационен сайт. Салонът е измислен.",
  },

  mobile: { call: "Обадете се", book: "Запазете час" },

  assistant: {
    open: "Асистент",
    title: "Асистент на салона",
    subtitle: "Отговаря веднага, по всяко време",
    greeting: "Здравейте. Мога да помогна с цени, свободни часове, майстори и курсове. С какво да започнем?",
    placeholder: "Напишете въпроса си…",
    send: "Изпратете",
    disclaimer: "Автоматичен асистент. Отговаря от данните на сайта.",
    chips: ["Колко струва балеаж?", "Кой прави цвят?", "Работите ли в неделя?", "Искам час"],
    fallback: "Не съм сигурен за това. Обадете се на {phone} или запазете час онлайн — ще Ви отговорим лично.",
    typing: "пише…",
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
    otherLang: "BG",
  },

  topbar: { tagline: "You pick the stylist, not the salon" },

  status: {
    label: "Opening hours",
    openUntil: (t: string) => `Open now · until ${t}`,
    opensAt: (t: string) => `Opens at ${t}`,
    opensTomorrow: (t: string) => `Opens tomorrow at ${t}`,
    closedToday: "Closed today",
  },

  hero: {
    badge: "Beauty salon · Shishman St, Sofia",
    title1: "Hair remembers",
    title2: "whose hands it met.",
    lead: "ONDÉ is five stylists. You choose the person, you see the price, and you book online — in under a minute, without calling.",
    ctaBook: "Book a chair",
    ctaPrices: "See the price list",
    statRating: "from 186 reviews",
    statMasters: "stylists",
    statMastersValue: "5",
    statYears: "on Shishman St",
    statYearsValue: "7 yrs",
    instant: "Confirmed instantly",
    slotsTitle: "Available times",
    slotsChecking: "checking availability…",
    slotsSoonest: (w: string) => `earliest ${w}`,
    today: "today",
    tomorrow: "tomorrow",
  },

  marquee: [
    "Cutting", "Colour", "Balayage", "Foil highlights", "Lamination",
    "Occasion styling", "Manicure", "Microneedling", "Courses",
  ],

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

  why: {
    eyebrow: "Why ONDÉ",
    title1: "The salon is the sum",
    title2: "of five pairs of hands.",
    badgeValue: "5",
    badgeText: "stylists, each with their own diary",
    items: [
      {
        title: "You book a person, not a salon",
        text: "You choose the stylist on the second step and the diary narrows to theirs. The same person takes you next time too.",
        icon: "user",
      },
      {
        title: "The price is visible beforehand",
        text: "Every direction carries its own price list. The exact figure is confirmed by your stylist before any work starts.",
        icon: "tag",
      },
      {
        title: "The price list doesn't drown you",
        text: "Four directions instead of a hundred rows in a list. Only the one you picked opens.",
        icon: "list",
      },
      {
        title: "The courses run in this salon",
        text: "Teaching happens during working hours, on models in the room — not in an empty space after closing.",
        icon: "cap",
      },
    ],
  },

  team: {
    eyebrow: "Stylists",
    title: "Five people. Five separate diaries.",
    lead: "Choose the person, not the salon. Under every name sits that person's own calendar.",
    bookWith: (name: string) => `Book with ${name}`,
    leads: "Teaches",
    members: [
      {
        name: "Irina Valcheva",
        role: "Lead stylist · colour",
        line: "Works with colour only. Balayage, highlights and repairs after home bleaching.",
      },
      {
        name: "Boryana Miteva",
        role: "Stylist · cutting",
        line: "Women's cutting and occasion styling. Teaches the hairdressing course.",
      },
      {
        name: "Daniel Petkov",
        role: "Barber",
        line: "Men's cutting with clipper and scissors, beard shaping.",
      },
      {
        name: "Niya Stoyanova",
        role: "Nail technician",
        line: "Gel polish and extensions. Teaches the manicure course.",
      },
      {
        name: "Elena Georgieva",
        role: "Make-up and skin",
        line: "Device treatments for the face and professional make-up. Teaches the make-up course.",
      },
    ],
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

  gallery: {
    eyebrow: "Gallery",
    title: "The work, not a catalogue.",
    lead: "Photographs from the salon and from the stylists' hands.",
    items: [
      { caption: "Balayage, long hair" },
      { caption: "Women's cut" },
      { caption: "Root colour" },
      { caption: "Occasion styling" },
      { caption: "Gel polish manicure" },
      { caption: "The room on Shishman St" },
    ],
  },

  reviews: {
    eyebrow: "Reviews",
    title1: "186 people",
    title2: "came back to the same stylist.",
    ratingNote: "average from 186 reviews",
    items: [
      {
        text: "I've been going to Irina for two years. I brought her hair ruined by home bleaching and she told me honestly it would take three visits. It took three.",
        author: "Margarita D.",
        meta: "colour and balayage",
      },
      {
        text: "I booked at 11pm from my phone, for Saturday morning, with the exact person I wanted. No phone calls, no waiting for a reply on Instagram.",
        author: "Kalina N.",
        meta: "women's cut",
      },
      {
        text: "I took the manicure course because they teach it in the salon while it's open. You learn on real clients, not on a plastic hand.",
        author: "Stanimira V.",
        meta: "manicure course",
      },
    ],
  },

  faq: {
    eyebrow: "Questions",
    title: "What people ask most often.",
    items: [
      {
        q: "Can I choose who sees me?",
        a: "Yes — that's the second step when booking. Once you pick a stylist we show only their free hours. If you don't mind who, leave it on \"Anyone free\" and you'll see every hour in the salon.",
      },
      {
        q: "Why are the prices given as a range?",
        a: "Because length and condition change both the time and the product. A range is the honest answer in advance. The exact figure comes from your stylist before any work starts.",
      },
      {
        q: "What if I'm late or can't make it?",
        a: "Call us. Give us at least two hours' notice and we move the appointment with no conditions. If you're more than 15 minutes late we may have to shorten the service so the next client isn't pushed back.",
      },
      {
        q: "Are you open on Sunday?",
        a: "No. Monday to Friday we're open 09:00 to 20:00, Saturday 09:00 to 18:00. The salon is closed on Sunday.",
      },
      {
        q: "How do I pay?",
        a: "Cash or card, after the service. Prices are in euro, and the lev equivalent uses the fixed rate €1 = BGN 1.95583 for reference only.",
      },
      {
        q: "Do the courses come with a certificate?",
        a: "The hairdressing course ends with a state certificate of professional qualification. The manicure and make-up courses end with a certificate from the salon.",
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
    madeBy: "Site by",
    demo: "Demonstration site. The salon is invented.",
  },

  mobile: { call: "Call", book: "Book" },

  assistant: {
    open: "Assistant",
    title: "Salon assistant",
    subtitle: "Answers instantly, any time",
    greeting: "Hello. I can help with prices, free times, stylists and courses. Where shall we start?",
    placeholder: "Type your question…",
    send: "Send",
    disclaimer: "Automated assistant. It answers from what is on this site.",
    chips: ["How much is balayage?", "Who does colour?", "Are you open on Sunday?", "I'd like a booking"],
    fallback: "I'm not sure about that one. Call {phone} or book online and we'll answer in person.",
    typing: "typing…",
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
