export type Lang = "bg" | "en";

export const CLINIC = {
  phone: "+359 2 400 18 40",
  phoneHref: "+35924001840",
  emergency: "+359 88 400 18 40",
  emergencyHref: "+359884001840",
  email: "reg@lapa-vet.bg",
  rating: 4.9,
  reviewCount: 214,
  founded: 2012,
  mapsQuery: "ул. Кръстьо Сарафов 24, София",
} as const;

export const BGN_RATE = 1.95583;

export function priceLabel(eur: number, lang: Lang) {
  const bgn = (eur * BGN_RATE).toFixed(2).replace(".", lang === "bg" ? "," : ".");
  return { eur: `${eur} €`, bgn: lang === "bg" ? `${bgn} лв.` : `BGN ${bgn}` };
}

export const SERVICE_META = [
  { slug: "pregled", price: 20, duration: 30, icon: "stethoscope" },
  { slug: "vaksina", price: 30, duration: 20, icon: "syringe" },
  { slug: "zabi", price: 40, duration: 60, icon: "tooth" },
  { slug: "obrazna", price: 25, duration: 40, icon: "scan" },
  { slug: "laboratoria", price: 22, duration: 25, icon: "flask" },
  { slug: "hirurgia", price: 55, duration: 90, icon: "scalpel" },
] as const;

export const TEAM_PHOTOS = [
  "/images/team-1.jpg",
  "/images/team-2.jpg",
  "/images/team-3.jpg",
  "/images/team-4.jpg",
];

const bg = {
  lang: "bg" as Lang,
  brand: { name: "Лапа", sub: "Ветеринарна клиника" },
  clinicName: "Ветеринарна клиника Лапа",
  address: "ул. „Кръстьо Сарафов“ 24, кв. Лозенец, София",
  city: "София",

  nav: {
    services: "Услуги и цени",
    team: "Екип",
    reviews: "Отзиви",
    shop: "Зоомагазин",
    contact: "Контакти",
    book: "Запазете час",
    menu: "Меню",
    close: "Затворете",
    otherLang: "EN",
  },

  topbar: { emergency: "Спешен телефон 24/7" },

  status: {
    label: "Работно време",
    openUntil: (t: string) => `Отворено сега · до ${t}`,
    opensAt: (t: string) => `Отваряме в ${t}`,
    opensTomorrow: (t: string) => `Отваряме утре в ${t}`,
  },

  hero: {
    badge: "Клиника и зоомагазин · кв. Лозенец, София",
    title1: "Грижа без чакане.",
    title2: "Цена без изненади.",
    lead: "Запишете час за под минута и вижте сметката още преди да сте влезли. Нощем и в празници Ви отговаря дежурен лекар — не телефонен секретар.",
    ctaBook: "Запазете час онлайн",
    ctaEmergency: "Спешен случай 24/7",
    statReviews: "от 214 отзива",
    statYears: "в квартала",
    statYearsValue: "13 г.",
    statEmergency: "дежурен лекар",
    instant: "Потвърждение веднага",
    slotsTitle: "Свободни часове",
    slotsChecking: "проверяваме наличността…",
    slotsSoonest: (w: string) => `най-рано ${w}`,
    today: "днес",
    tomorrow: "утре",
  },

  marquee: [
    "Профилактика", "Ваксинация", "Хирургия", "Ехография", "Дигитален рентген",
    "Лаборатория на място", "Зъбна профилактика", "Микрочип и паспорт",
    "Спешен прием 24/7", "Зоомагазин",
  ],

  services: {
    eyebrow: "Услуги и цени",
    title: "Цената я виждате тук, не на касата.",
    lead: "Изберете услугите и вижте приблизителната сметка веднага. Ако по време на прегледа се наложи нещо повече, чувате цената, преди да го направим.",
    chips: ["Без скрити такси", "Плащане с карта", "Фактура при поискване"],
    from: "от",
    min: "мин",
    selected: (n: number) => `Избрани ${n} ${n === 1 ? "услуга" : "услуги"}`,
    about: "около",
    bookThis: "Запазете час за това",
    note: "Цените са в евро. Левовата равностойност е по фиксирания курс 1 € = 1,95583 лв. и е само за ориентир.",
    items: [
      { title: "Профилактичен преглед", blurb: "Пълен клиничен преглед, преценка на теглото, зъбите, ушите и кожата." },
      { title: "Ваксинация и паспорт", blurb: "Комплексна ваксина, бяс, международен паспорт и микрочип на място." },
      { title: "Зъбна профилактика", blurb: "Ултразвуково почистване на зъбен камък под кратка упойка." },
      { title: "Ехография и рентген", blurb: "Дигитален рентген и ехограф — резултатът е готов до 20 минути." },
      { title: "Лаборатория", blurb: "Кръвна картина и биохимия в клиниката, без чакане за външна лаборатория." },
      { title: "Хирургия и кастрация", blurb: "Планова хирургия с инхалационна анестезия и мониторинг. Кастрация на котарак от 55 €." },
    ],
  },

  booking: {
    eyebrow: "Онлайн записване",
    title: "Час за под минута. Без обаждане.",
    lead: "Изберете кога Ви е удобно. Получавате потвърждение веднага и SMS напомняне два часа преди прегледа.",
    steps: ["Любимец", "Услуга", "Ден и час", "Данни"],
    q1: "Кого водите?",
    petName: "Как се казва? (по желание)",
    petPlaceholder: "Например: Рекс",
    q2: "За какво идвате?",
    q2sub: "Може да изберете повече от едно.",
    q3: "Кога Ви е удобно?",
    vetLabel: "Предпочитан лекар",
    anyVet: "Всеки свободен",
    vetHint: (name: string) => `Показваме само часовете, в които ${name} е свободен.`,
    noSlots: "За този ден няма свободни часове. Изберете друг ден или ни се обадете — пазим по два слота на ден за спешни случаи.",
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
    patient: "Пациент",
    servicesLabel: "Услуги",
    vet: "Лекар",
    approx: "Приблизително",
    addCalendar: "Добавете в календара",
    newBooking: "Нов час",
    phonePrefer: "Предпочитате по телефон? Обадете се на",
    animals: [
      { id: "dog", label: "Куче", emoji: "🐕" },
      { id: "cat", label: "Котка", emoji: "🐈" },
      { id: "small", label: "Гризач / птица", emoji: "🐹" },
      { id: "exotic", label: "Влечуго", emoji: "🦎" },
    ],
    icsSummary: (p: string) => `Ветеринар — ${p} (Лапа)`,
    icsPhone: "Телефон",
    icsAlarm: "Час при ветеринар след 2 часа",
    weekdays: ["нед", "пон", "вт", "ср", "чет", "пет", "съб"],
    months: ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември"],
  },

  advantages: {
    eyebrow: "Защо при нас",
    title1: "Лекуваме животното.",
    title2: "Спокоен е и стопанинът.",
    badgeValue: "под 24 ч",
    badgeText: "средно време до свободен час за нов пациент",
    items: [
      { title: "Час за днес или утре", text: "Пазим по два слота на ден за спешни случаи. Обикновено Ви приемаме в рамките на 24 часа.", icon: "clock" },
      { title: "Спешен телефон 24/7", text: "Нощем и в празници отговаря дежурен лекар — не телефонен секретар.", icon: "phone" },
      { title: "Напомняме за ваксината", text: "SMS седмица преди падежа на ваксината и обезпаразитяването. Нищо не се изпуска.", icon: "bell" },
      { title: "Цените са ясни предварително", text: "Всяка услуга има публикувана цена. Ако нещо се промени, чувате го, преди да го направим.", icon: "tag" },
    ],
  },

  emergency: {
    badge: "Спешни случаи 24/7",
    title1: "В 3 през нощта",
    title2: "вдига лекар.",
    lead: "Не телефонен секретар и не дежурен списък. Ако случаят е спешен, отваряме клиниката и Ви чакаме на вратата.",
    listTitle: "Какво да направите, докато пътувате",
    disclaimer: "Информацията е за първите минути, докато пътувате към клиниката. Тя не замества преглед от ветеринарен лекар.",
    stats: [
      { k: "под 60 сек.", v: "средно време, докато вдигнем" },
      { k: "7 мин.", v: "докато отворим клиниката нощем" },
      { k: "всеки ден", v: "включително празници" },
      { k: "1 екип", v: "дежурен лекар и асистент" },
    ],
    cases: [
      { title: "Подут корем и напъни за повръщане без резултат", text: "При едрите породи това е разширение и усукване на стомаха (GDV). Състоянието е животозастрашаващо и шансът е най-голям, ако кучето е при лекар до два часа от първите признаци. Не давайте вода и не изчаквайте да му мине — тръгвайте и звъннете от пътя." },
      { title: "Котаракът се напъва в тоалетната без резултат", text: "Уринарната обструкция при мъжките котки убива за часове. Признаците са чести опити за уриниране, капки кървава урина, отказ от храна, повръщане и болка при пипане на корема. Това не е нещо, което се изчаква до сутринта." },
      { title: "Погълнато отровно вещество", text: "Шоколад, антифриз, ксилитол, отрова за гризачи, човешки лекарства. Не предизвиквайте повръщане на своя глава — при някои вещества това утежнява увреждането. Звъннете веднага и вземете опаковката или остатъка със себе си." },
      { title: "Задавяне или затруднено дишане", text: "Отворете устата и погледнете за видим предмет, но не бъркайте сляпо в гърлото — рискувате да го избутате по-навътре. Ако животното диша, оставете го в спокойна поза и тръгвайте към клиниката." },
      { title: "Пътен инцидент или падане от високо", text: "Преместете животното върху твърда основа, без да извивате гръбнака и без да опипвате счупеното. Външно добър вид не изключва вътрешен кръвоизлив — прегледът е задължителен същия ден." },
    ],
  },

  team: {
    eyebrow: "Екипът",
    title: "Хората, които ще Ви посрещнат.",
    lead: "Един и същ лекар води Вашия случай от първия преглед до контролния.",
    members: [
      { name: "д-р Мария Ангелова", role: "Управител, хирургия", line: "18 години практика. Специализация по мекотъканна хирургия във Виена." },
      { name: "д-р Стефан Колев", role: "Вътрешни болести", line: "Образна диагностика и кардиология. Води кардиологичните прегледи." },
      { name: "д-р Емил Ганчев", role: "Ортопедия", line: "30 години стаж. Оперира фрактури и ставни проблеми при кучета." },
      { name: "Ния Тодорова", role: "Ветеринарен асистент", line: "Посреща Ви на рецепцията и води картона на Вашия любимец." },
    ],
  },

  reviews: {
    eyebrow: "Отзиви",
    title1: "214 стопани",
    title2: "вече ни се довериха.",
    ratingNote: "средна оценка от 214 отзива",
    items: [
      { text: "Заведохме Мая в 23:30 в неделя с натравяне. Вдигнаха телефона веднага и ни чакаха на вратата. На сутринта беше добре.", author: "Ивелина П.", meta: "стопанка на Мая, померан" },
      { text: "За първи път ветеринар ми каза цената преди прегледа, а не след него. Това е причината да не сменям клиниката.", author: "Георги Д.", meta: "стопанин на Рекс, лабрадор" },
      { text: "Котката ми е ужасно стресирана навсякъде. Тук я оставят сама да излезе от чантата и чакат. Разликата е огромна.", author: "Радостина М.", meta: "стопанка на Зара, британска котка" },
    ],
  },

  shop: {
    eyebrow: "Зоомагазин на място",
    title1: "Излизате от прегледа",
    title2: "с това, което Ви трябва.",
    lead: "Без втора обиколка из града. Лекарят изписва храната или лекарството и го вземате от съседната врата.",
    items: [
      { title: "Лечебни храни", text: "Ветеринарни диети за бъбреци, стомах, стави и тегло." },
      { title: "Обезпаразитяване", text: "Таблетки, спот-он и каишки — с дозата за Вашето животно." },
      { title: "Аксесоари", text: "Нашийници, транспортни чанти, играчки и легла." },
      { title: "Микрочип и паспорт", text: "Поставяме чипа и издаваме паспорта на място." },
    ],
  },

  faq: {
    eyebrow: "Въпроси",
    title: "Това, което хората питат най-често.",
    items: [
      { q: "Трябва ли час или мога да дойда директно?", a: "Приемаме и без час, но с час чакате по-малко. Онлайн записването отнема под минута и получавате потвърждение веднага." },
      { q: "Какво да правя при спешен случай през нощта?", a: "Звъннете на дежурния телефон. Вдига ветеринарен лекар, не телефонен секретар. Ако случаят е спешен, отваряме клиниката и Ви чакаме." },
      { q: "Работите ли с котки, гризачи и влечуги?", a: "Да. Имаме отделна чакалня за котки, за да не се стресират от кучетата. Екзотичните животни приемаме след предварителна уговорка." },
      { q: "Издавате ли международен паспорт за пътуване?", a: "Да, на място — с микрочип, ваксина срещу бяс и вписване в системата. Планирайте поне 21 дни преди пътуване." },
      { q: "Как да платя?", a: "В брой или с карта. Издаваме фискален бон и фактура при поискване. Цените са в евро, с левова равностойност по фиксирания курс." },
      { q: "Мога ли да получа копие от картона на животното?", a: "Да. Всеки преглед, изследване и ваксина се записват дигитално и Ви ги изпращаме по имейл при поискване." },
    ],
  },

  contact: {
    eyebrow: "Контакти",
    title: "Намерете ни в Лозенец.",
    emergencyRow: "Спешни случаи",
    allDay: "денонощно",
    reception: "Регистратура",
    email: "Имейл",
    address: "Адрес",
    map: "Карта",
    hours: [
      { day: "Понеделник", from: "08:00", to: "20:00" },
      { day: "Вторник", from: "08:00", to: "20:00" },
      { day: "Сряда", from: "08:00", to: "20:00" },
      { day: "Четвъртък", from: "08:00", to: "20:00" },
      { day: "Петък", from: "08:00", to: "20:00" },
      { day: "Събота", from: "09:00", to: "18:00" },
      { day: "Неделя", from: "10:00", to: "16:00" },
    ],
  },

  footer: {
    about: (y: number) => `Ветеринарна клиника и зоомагазин в кв. Лозенец, София. Работим от ${y} г.`,
    colServices: "Услуги",
    colClinic: "Клиниката",
    colContact: "Връзка",
    services: ["Профилактика и ваксини", "Хирургия", "Образна диагностика", "Зоомагазин"],
    clinic: ["Екип", "Отзиви", "Контакти", "Запазете час"],
    emergencyShort: "Спешно 24/7",
    madeBy: "Сайт от",
  },

  mobile: { call: "Обадете се", book: "Запазете час" },

  assistant: {
    open: "Асистент",
    title: "Асистент на клиниката",
    subtitle: "Отговаря веднага, по всяко време",
    greeting: "Здравейте! Мога да Ви помогна с цени, работно време, спешни случаи и записване на час. С какво да започнем?",
    placeholder: "Напишете въпроса си…",
    send: "Изпратете",
    disclaimer: "Автоматичен асистент. При спешен случай звъннете на 24/7 телефона.",
    chips: ["Колко струва преглед?", "Работите ли в неделя?", "Спешен случай съм", "Искам час"],
    fallback: "Не съм сигурен за това. Мога да Ви свържа с регистратурата — обадете се на {phone} или запазете час онлайн.",
    typing: "пише…",
  },
};

const en: typeof bg = {
  lang: "en" as Lang,
  brand: { name: "Lapa", sub: "Veterinary Clinic" },
  clinicName: "Lapa Veterinary Clinic",
  address: "24 Krastyo Sarafov St, Lozenets, Sofia",
  city: "Sofia",

  nav: {
    services: "Services & prices",
    team: "Team",
    reviews: "Reviews",
    shop: "Pet shop",
    contact: "Contact",
    book: "Book a visit",
    menu: "Menu",
    close: "Close",
    otherLang: "BG",
  },

  topbar: { emergency: "Emergency line 24/7" },

  status: {
    label: "Opening hours",
    openUntil: (t: string) => `Open now · until ${t}`,
    opensAt: (t: string) => `Opens at ${t}`,
    opensTomorrow: (t: string) => `Opens tomorrow at ${t}`,
  },

  hero: {
    badge: "Clinic and pet shop · Lozenets, Sofia",
    title1: "Care without the wait.",
    title2: "Prices without surprises.",
    lead: "Book in under a minute and see the bill before you walk in. At night and on holidays a vet on call answers — never a machine.",
    ctaBook: "Book online",
    ctaEmergency: "Emergency 24/7",
    statReviews: "from 214 reviews",
    statYears: "in the neighbourhood",
    statYearsValue: "13 yrs",
    statEmergency: "vet on call",
    instant: "Confirmed instantly",
    slotsTitle: "Available times",
    slotsChecking: "checking availability…",
    slotsSoonest: (w: string) => `earliest ${w}`,
    today: "today",
    tomorrow: "tomorrow",
  },

  marquee: [
    "Wellness exams", "Vaccination", "Surgery", "Ultrasound", "Digital X-ray",
    "In-house lab", "Dental care", "Microchip & passport",
    "Emergency 24/7", "Pet shop",
  ],

  services: {
    eyebrow: "Services & prices",
    title: "You see the price here, not at the counter.",
    lead: "Pick what you need and see the estimate right away. If something extra comes up during the exam, you hear the price before we do it.",
    chips: ["No hidden fees", "Card accepted", "Invoice on request"],
    from: "from",
    min: "min",
    selected: (n: number) => `${n} ${n === 1 ? "service" : "services"} selected`,
    about: "about",
    bookThis: "Book this",
    note: "Prices are in euro. The lev equivalent uses the fixed rate €1 = BGN 1.95583 and is shown for reference only.",
    items: [
      { title: "Wellness exam", blurb: "Full clinical check-up — weight, teeth, ears and skin." },
      { title: "Vaccination & passport", blurb: "Core vaccine, rabies, EU pet passport and microchip on site." },
      { title: "Dental care", blurb: "Ultrasonic scaling of tartar under short anaesthesia." },
      { title: "Ultrasound & X-ray", blurb: "Digital X-ray and ultrasound — results within 20 minutes." },
      { title: "Laboratory", blurb: "Blood count and biochemistry in-house, no waiting on an outside lab." },
      { title: "Surgery & neutering", blurb: "Planned surgery with inhalation anaesthesia and monitoring. Male cat neutering from €55." },
    ],
  },

  booking: {
    eyebrow: "Online booking",
    title: "A slot in under a minute. No phone call.",
    lead: "Pick a time that suits you. You get instant confirmation and an SMS reminder two hours before.",
    steps: ["Pet", "Service", "Date & time", "Details"],
    q1: "Who are you bringing?",
    petName: "What's their name? (optional)",
    petPlaceholder: "For example: Rex",
    q2: "What do you need?",
    q2sub: "You can pick more than one.",
    q3: "When suits you?",
    vetLabel: "Preferred vet",
    anyVet: "Any available",
    vetHint: (name: string) => `Showing only the hours ${name} is free.`,
    noSlots: "No free times left on this day. Pick another day or call us — we keep two slots a day for emergencies.",
    q4: "How do we reach you?",
    yourName: "Your name",
    namePlaceholder: "First and last name",
    phone: "Phone",
    phonePlaceholder: "+359 8XX XXX XXX",
    back: "Back",
    next: "Next",
    confirm: "Confirm booking",
    doneTitle: "Your visit is booked.",
    doneLead: (p: string) => `The confirmation is on its way to ${p}. See you soon.`,
    cardTitle: "Your appointment",
    confirmed: "confirmed",
    when: "When",
    patient: "Patient",
    servicesLabel: "Services",
    vet: "Vet",
    approx: "Estimate",
    addCalendar: "Add to calendar",
    newBooking: "New booking",
    phonePrefer: "Prefer the phone? Call us on",
    animals: [
      { id: "dog", label: "Dog", emoji: "🐕" },
      { id: "cat", label: "Cat", emoji: "🐈" },
      { id: "small", label: "Rodent / bird", emoji: "🐹" },
      { id: "exotic", label: "Reptile", emoji: "🦎" },
    ],
    icsSummary: (p: string) => `Vet visit — ${p} (Lapa)`,
    icsPhone: "Phone",
    icsAlarm: "Vet appointment in 2 hours",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },

  advantages: {
    eyebrow: "Why us",
    title1: "We treat the animal.",
    title2: "The owner leaves calm too.",
    badgeValue: "under 24 h",
    badgeText: "average wait for a new patient's first slot",
    items: [
      { title: "A slot today or tomorrow", text: "We hold two slots a day for urgent cases. Most patients are seen within 24 hours.", icon: "clock" },
      { title: "Emergency line 24/7", text: "At night and on holidays a vet on call answers — not an answering machine.", icon: "phone" },
      { title: "We remind you about vaccines", text: "An SMS a week before the vaccine and deworming are due. Nothing gets missed.", icon: "bell" },
      { title: "Prices are clear upfront", text: "Every service has a published price. If anything changes, you hear it before we proceed.", icon: "tag" },
    ],
  },

  emergency: {
    badge: "Emergencies 24/7",
    title1: "At 3 in the morning",
    title2: "a vet picks up.",
    lead: "Not an answering machine, not a rota list. If it's urgent we open the clinic and wait for you at the door.",
    listTitle: "What to do while you're on your way",
    disclaimer: "This covers the first minutes while you travel to the clinic. It does not replace an examination by a veterinarian.",
    stats: [
      { k: "under 60 s", v: "average time before we answer" },
      { k: "7 min", v: "to open the clinic at night" },
      { k: "every day", v: "holidays included" },
      { k: "1 team", v: "vet and assistant on call" },
    ],
    cases: [
      { title: "Bloated belly and retching without result", text: "In large breeds this is gastric dilatation and volvulus (GDV). It is life-threatening and the odds are best if the dog reaches a vet within two hours of the first signs. Do not give water and do not wait it out — set off and call from the road." },
      { title: "A male cat straining in the litter box with no result", text: "Urinary obstruction in male cats kills within hours. Signs are repeated attempts to urinate, drops of bloody urine, refusing food, vomiting and pain when the belly is touched. This is not something that waits until morning." },
      { title: "Swallowed something toxic", text: "Chocolate, antifreeze, xylitol, rodent poison, human medication. Do not induce vomiting on your own — with some substances that makes the damage worse. Call right away and bring the packaging or what's left of it." },
      { title: "Choking or laboured breathing", text: "Open the mouth and look for a visible object, but do not reach blindly down the throat — you risk pushing it deeper. If the animal is breathing, keep it calm and head for the clinic." },
      { title: "Road accident or a fall from height", text: "Move the animal onto a firm surface without twisting the spine and without probing the injury. Looking fine on the outside does not rule out internal bleeding — an examination the same day is essential." },
    ],
  },

  team: {
    eyebrow: "The team",
    title: "The people who will greet you.",
    lead: "The same vet follows your case from the first visit through to the check-up.",
    members: [
      { name: "Dr Maria Angelova", role: "Director, surgery", line: "18 years in practice. Soft-tissue surgery training in Vienna." },
      { name: "Dr Stefan Kolev", role: "Internal medicine", line: "Diagnostic imaging and cardiology. Runs the cardiology clinic." },
      { name: "Dr Emil Ganchev", role: "Orthopaedics", line: "30 years of practice. Operates on fractures and joint problems in dogs." },
      { name: "Nia Todorova", role: "Veterinary assistant", line: "Greets you at reception and keeps your pet's records." },
    ],
  },

  reviews: {
    eyebrow: "Reviews",
    title1: "214 owners",
    title2: "have trusted us already.",
    ratingNote: "average rating from 214 reviews",
    items: [
      { text: "We brought Maya in at 11.30pm on a Sunday after she was poisoned. They picked up straight away and were waiting at the door. By morning she was fine.", author: "Ivelina P.", meta: "Maya's owner, Pomeranian" },
      { text: "For the first time a vet told me the price before the exam instead of after. That's why I don't change clinics.", author: "Georgi D.", meta: "Rex's owner, Labrador" },
      { text: "My cat is terrified everywhere. Here they let her come out of the carrier on her own and simply wait. The difference is enormous.", author: "Radostina M.", meta: "Zara's owner, British Shorthair" },
    ],
  },

  shop: {
    eyebrow: "Pet shop on site",
    title1: "You leave the exam",
    title2: "with what you actually need.",
    lead: "No second trip across town. The vet prescribes the food or medication and you pick it up next door.",
    items: [
      { title: "Prescription diets", text: "Veterinary diets for kidneys, stomach, joints and weight." },
      { title: "Parasite control", text: "Tablets, spot-on and collars — dosed for your animal." },
      { title: "Accessories", text: "Collars, carriers, toys and beds." },
      { title: "Microchip & passport", text: "We fit the chip and issue the passport on site." },
    ],
  },

  faq: {
    eyebrow: "Questions",
    title: "What people ask us most.",
    items: [
      { q: "Do I need an appointment or can I just walk in?", a: "Walk-ins are welcome, but with an appointment you wait less. Booking online takes under a minute and you get instant confirmation." },
      { q: "What do I do in an emergency at night?", a: "Call the emergency line. A veterinarian answers, not a machine. If it's urgent we open the clinic and wait for you." },
      { q: "Do you treat cats, rodents and reptiles?", a: "Yes. We have a separate cat waiting area so they aren't stressed by dogs. Exotics are seen by prior arrangement." },
      { q: "Do you issue EU pet passports for travel?", a: "Yes, on site — microchip, rabies vaccine and registration. Plan at least 21 days before you travel." },
      { q: "How can I pay?", a: "Cash or card. We issue a receipt, and an invoice on request. Prices are in euro, with the lev equivalent at the fixed rate." },
      { q: "Can I get a copy of my pet's records?", a: "Yes. Every exam, test and vaccine is recorded digitally and we email it to you on request." },
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Find us in Lozenets.",
    emergencyRow: "Emergencies",
    allDay: "around the clock",
    reception: "Reception",
    email: "Email",
    address: "Address",
    map: "Map",
    hours: [
      { day: "Monday", from: "08:00", to: "20:00" },
      { day: "Tuesday", from: "08:00", to: "20:00" },
      { day: "Wednesday", from: "08:00", to: "20:00" },
      { day: "Thursday", from: "08:00", to: "20:00" },
      { day: "Friday", from: "08:00", to: "20:00" },
      { day: "Saturday", from: "09:00", to: "18:00" },
      { day: "Sunday", from: "10:00", to: "16:00" },
    ],
  },

  footer: {
    about: (y: number) => `Veterinary clinic and pet shop in Lozenets, Sofia. Open since ${y}.`,
    colServices: "Services",
    colClinic: "The clinic",
    colContact: "Get in touch",
    services: ["Wellness & vaccines", "Surgery", "Diagnostic imaging", "Pet shop"],
    clinic: ["Team", "Reviews", "Contact", "Book a visit"],
    emergencyShort: "Emergency 24/7",
    madeBy: "Website by",
  },

  mobile: { call: "Call us", book: "Book" },

  assistant: {
    open: "Assistant",
    title: "Clinic assistant",
    subtitle: "Answers instantly, any time",
    greeting: "Hello! I can help with prices, opening hours, emergencies and booking a visit. Where shall we start?",
    placeholder: "Type your question…",
    send: "Send",
    disclaimer: "Automated assistant. In an emergency, call the 24/7 line.",
    chips: ["How much is an exam?", "Are you open on Sunday?", "This is an emergency", "I want an appointment"],
    fallback: "I'm not sure about that one. I can put you through to reception — call {phone} or book online.",
    typing: "typing…",
  },
};

export const CONTENT = { bg, en };
export type Content = typeof bg;

export function getContent(lang: Lang): Content {
  return CONTENT[lang];
}
