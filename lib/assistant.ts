import { MASTER_META, SALON, priceLabel, rangeLabel, type Content, type Lang } from "./content";
import { COURSES, DIRECTIONS } from "./pricing";
import { intakesFor } from "./courses";
import { nextAvailability } from "./slots";

export type Action = { label: string; href: string };
export type Answer = { id: string; text: string; actions?: Action[] };

type Reply = (t: Content, lang: Lang) => Answer;

type Intent = {
  id: string;
  /** A question about a named direction must beat the generic price list. */
  priority?: number;
  bg: string[];
  en: string[];
  reply: Reply;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:()„“"'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** "Дамско подстригване — 20 – 28 € (39,12 лв. – 54,76 лв.), ~60 мин" */
const line = (t: Content, lang: Lang, di: number, ii: number) => {
  const item = DIRECTIONS[di].items[ii];
  const p = rangeLabel(item.from, item.to, lang);
  const title = t.directions.items[di].prices[ii].title;
  return `${title} — ${p.eur} (${p.bgn}), ~${item.duration} ${t.directions.min}`;
};

const listDirection = (t: Content, lang: Lang, di: number) =>
  DIRECTIONS[di].items.map((_, ii) => `• ${line(t, lang, di, ii)}`).join("\n");

const book = (t: Content): Action => ({ label: t.nav.book, href: "#chas" });
const call = (t: Content): Action => ({ label: t.contact.reception, href: `tel:${SALON.phoneHref}` });
const team = (t: Content): Action => ({ label: t.nav.team, href: "#ekip" });
const courses = (t: Content): Action => ({ label: t.nav.courses, href: "#kursove" });
const prices = (t: Content): Action => ({ label: t.nav.directions, href: "#napravleniya" });

function soonest(t: Content) {
  const next = nextAvailability(3);
  if (!next) return null;
  const when =
    next.offset === 0
      ? t.hero.today
      : next.offset === 1
        ? t.hero.tomorrow
        : `${t.booking.weekdays[next.date.getDay()]}, ${next.date.getDate()} ${
            t.booking.months[next.date.getMonth()]
          }`;
  return { when, times: next.times };
}

/** Who works a direction, by name — the site is built around the masters. */
const whoWorks = (t: Content, slug: string) =>
  MASTER_META.map((m, i) => ({ m, i }))
    .filter((x) => (x.m.directions as readonly string[]).includes(slug))
    .map((x) => `${t.team.members[x.i].name} (${t.team.members[x.i].role})`)
    .join(", ");

const INTENTS: Intent[] = [
  {
    id: "masters",
    priority: 3,
    bg: ["кой прави", "кой работи", "кой ще ме", "кой майстор", "при кого", "екип", "майстор", "стилист", "фризьор ли", "барбер"],
    en: ["who does", "who works", "who will", "which stylist", "with whom", "team", "stylist", "barber", "colourist", "colorist"],
    reply: (t) => ({
      id: "masters",
      text:
        (t.lang === "bg" ? "Майсторите в салона:\n" : "The stylists in the salon:\n") +
        t.team.members.map((m) => `• ${m.name} — ${m.role}. ${m.line}`).join("\n") +
        (t.lang === "bg"
          ? `\n\nМайсторът се избира на втората стъпка при записване и тогава графикът се стеснява до неговия. Ако Ви е все едно, оставете „${t.booking.anyMaster}“.`
          : `\n\nYou pick the stylist on the second step of booking, and the diary narrows to theirs. If you don't mind who, leave it on "${t.booking.anyMaster}".`),
      actions: [team(t), book(t)],
    }),
  },
  {
    id: "price-colour",
    priority: 3,
    bg: ["балеаж", "кичур", "боядисв", "боя", "цвят", "изрусяв", "русо", "корен", "омбре", "фолио"],
    en: ["balayage", "highlight", "colour", "color", "dye", "bleach", "blonde", "roots", "ombre", "foil"],
    reply: (t, l) => ({
      id: "price-colour",
      text:
        (t.lang === "bg" ? "Направление „Цвят“:\n" : "The colour list:\n") +
        listDirection(t, l, 1) +
        (t.lang === "bg"
          ? `\n\nЦветът се прави от ${whoWorks(t, "tsvyat")}. Диапазонът е заради дължината и гъстотата — точната сума я казва майсторът, преди да започне работа.`
          : `\n\nColour is done by ${whoWorks(t, "tsvyat")}. The range is there because of length and thickness — the exact figure comes from your stylist before any work starts.`),
      actions: [book(t), team(t)],
    }),
  },
  {
    id: "price-hair",
    priority: 3,
    bg: ["подстриг", "подстриж", "прическа", "ламинир", "ботокс за коса", "сешоар", "оформяне", "бретон"],
    en: ["haircut", "cut", "trim", "styling", "blow dry", "lamination", "updo", "fringe", "bangs"],
    reply: (t, l) => ({
      id: "price-hair",
      text:
        (t.lang === "bg" ? "Направление „Коса“:\n" : "The hair list:\n") +
        listDirection(t, l, 0) +
        (t.lang === "bg"
          ? `\n\nВ цената на подстригването влизат измиването и оформянето. Дължината решава времето, затова всяка позиция носи и своето.`
          : `\n\nA cut includes the wash and the blow-dry. Length decides the time, which is why every line carries its own.`),
      actions: [book(t), prices(t)],
    }),
  },
  {
    id: "price-nails",
    priority: 3,
    bg: ["маникюр", "нокт", "гел лак", "изграждане", "педикюр"],
    en: ["manicure", "nail", "gel polish", "extensions", "pedicure"],
    reply: (t, l) => ({
      id: "price-nails",
      text:
        (t.lang === "bg" ? "Направление „Нокти“:\n" : "The nails list:\n") +
        listDirection(t, l, 2) +
        (t.lang === "bg"
          ? `\n\nНоктите се правят в отделно помещение от сешоарите, при ${whoWorks(t, "nokti")}. Педикюр засега не предлагаме.`
          : `\n\nNails are done in a room of their own, away from the dryers, by ${whoWorks(t, "nokti")}. We don't offer pedicures at the moment.`),
      actions: [book(t)],
    }),
  },
  {
    id: "price-face",
    priority: 3,
    bg: ["микронидлинг", "лице", "кожа", "процедур", "почистване на лице", "грим"],
    en: ["microneedling", "face", "skin", "facial", "treatment", "make-up", "makeup"],
    reply: (t, l) => ({
      id: "price-face",
      text:
        (t.lang === "bg" ? "Направление „Лице“:\n" : "The skin list:\n") +
        listDirection(t, l, 3) +
        (t.lang === "bg"
          ? `\n\nПроцедурите се правят по програма, след консултация, при ${whoWorks(t, "litse")}. Професионалният грим се прави по уговорка — питайте на телефона.`
          : `\n\nTreatments run to a plan agreed after a consultation, with ${whoWorks(t, "litse")}. Professional make-up is by arrangement — ask us on the phone.`),
      actions: [book(t), call(t)],
    }),
  },
  {
    id: "courses",
    priority: 4,
    bg: ["курс", "обучение", "школа", "да се науча", "диплом", "свидетелство", "удостоверение", "квалификац", "записване за курс"],
    en: ["course", "training", "school", "learn", "diploma", "certificate", "qualification", "enrol", "enroll"],
    reply: (t, l) => {
      const rows = COURSES.map((meta, i) => {
        const p = priceLabel(meta.price, l);
        const hours = meta.hours ? `, ${meta.hours} ${t.courses.hours}` : "";
        const next = intakesFor(i, 3).find((x) => x.left > 0);
        const when = next
          ? ` · ${t.courses.starts.toLowerCase()} ${next.date.getDate()} ${
              t.booking.months[next.date.getMonth()]
            }, ${t.courses.seatsLeft(next.left)}`
          : ` · ${t.courses.soldOut}`;
        return `• ${t.courses.items[i].title} — ${p.eur} (${p.bgn})${hours}${when}`;
      }).join("\n");

      return {
        id: "courses",
        text:
          (t.lang === "bg" ? "Курсовете в салона:\n" : "The courses in the salon:\n") +
          rows +
          (t.lang === "bg"
            ? `\n\nКурсът по фризьорство завършва със Свидетелство за професионална квалификация, другите два — с удостоверение от салона. Записването е онлайн, без обаждане.`
            : `\n\nThe hairdressing course ends with a state certificate of professional qualification; the other two end with a salon certificate. Enrolment is online, with no phone call.`),
        actions: [courses(t)],
      };
    },
  },
  {
    id: "price-all",
    bg: ["цен", "колко струва", "колко ще струва", "тарифа", "ценоразпис", "скъпо", "бюджет"],
    en: ["price", "prices", "cost", "how much", "fee", "rate", "expensive", "price list"],
    reply: (t, l) => ({
      id: "price-all",
      text:
        (t.lang === "bg"
          ? "Четирите направления и откъде започват:\n"
          : "The four directions and where each starts:\n") +
        DIRECTIONS.map((d, di) => {
          const from = priceLabel(Math.min(...d.items.map((i) => i.from)), l);
          return `• ${t.directions.items[di].title} — ${t.directions.from} ${from.eur} (${from.bgn}), ${t.directions.positions(d.items.length)}`;
        }).join("\n") +
        (t.lang === "bg"
          ? `\n\nПълният ценоразпис на дадено направление се отваря, когато го изберете на страницата. Кажете ми кое Ви интересува и ще Ви го изброя тук.`
          : `\n\nThe full list for a direction opens when you pick it on the page. Tell me which one interests you and I'll spell it out here.`),
      actions: [prices(t), book(t)],
    }),
  },
  {
    id: "hours",
    priority: 2,
    bg: ["работно време", "работите ли", "отворен", "отворено", "затворен", "затваряте", "неделя", "събота", "почивен", "празник", "до колко", "от колко часа"],
    en: ["opening hours", "open", "closed", "sunday", "saturday", "day off", "holiday", "what time", "when do you"],
    reply: (t) => ({
      id: "hours",
      text:
        (t.lang === "bg" ? "Работно време:\n" : "Opening hours:\n") +
        t.contact.hours
          .map((h) => `• ${h.day} — ${h.from ? `${h.from} – ${h.to}` : t.contact.closed}`)
          .join("\n") +
        (t.lang === "bg"
          ? `\n\nВ неделя салонът почива. Записване онлайн приемаме по всяко време — формата работи и в почивния ден.`
          : `\n\nThe salon is closed on Sunday. Online booking is open around the clock — the form works on the closed day too.`),
      actions: [book(t)],
    }),
  },
  {
    id: "booking",
    priority: 2,
    bg: ["час", "запази", "запаз", "записв", "запиши", "свободн", "кога мога", "резерв", "график", "искам час"],
    en: ["book", "booking", "appointment", "slot", "available", "reserve", "schedule", "free time"],
    reply: (t) => {
      const s = soonest(t);
      return {
        id: "booking",
        text: s
          ? t.lang === "bg"
            ? `Най-ранните свободни часове са ${s.when}: ${s.times.join(
                ", "
              )}.\n\nЗаписването е в четири стъпки — направление, майстор, ден и час, данни за връзка. Отнема под минута и получавате потвърждение веднага, заедно с файл за календара.`
            : `The earliest free times are ${s.when}: ${s.times.join(
                ", "
              )}.\n\nBooking is four steps — direction, stylist, day and time, contact details. It takes under a minute and you get instant confirmation plus a calendar file.`
          : t.lang === "bg"
            ? `В момента онлайн не се показват свободни часове. Обадете се на ${SALON.phone} — на рецепцията виждат и разместванията за деня.`
            : `No online slots are showing right now. Call ${SALON.phone} — reception can also see the day's rearrangements.`,
        actions: [book(t), call(t)],
      };
    },
  },
  {
    id: "damaged",
    priority: 5,
    bg: ["съсипа", "изгоря", "изгорена коса", "пада коса", "накъсана", "сеч", "оранжев", "жълт нюанс", "грешка от", "поправ"],
    en: ["damaged", "ruined", "fried", "breakage", "falling out", "brassy", "orange", "went wrong", "fix my hair", "correction"],
    reply: (t) => ({
      id: "damaged",
      text:
        t.lang === "bg"
          ? `Такъв случай не се оценява по описание и по снимка. Корекциите след домашно боядисване или изрусяване понякога стават на един път, понякога на три — зависи от това колко е издържала косата.\n\nЗапишете консултация при ${whoWorks(
              t,
              "tsvyat"
            )} — тя гледа косата на живо и Ви казва честно колко посещения ще трябват и каква е сметката, преди да започне каквото и да било.`
          : `A case like this can't be judged from a description or a photo. Repairs after home colour or bleach sometimes take one session and sometimes three — it depends on how much the hair has taken.\n\nBook a consultation with ${whoWorks(
              t,
              "tsvyat"
            )} — she looks at the hair in person and tells you honestly how many visits it will take and what it will cost, before anything begins.`,
      actions: [book(t), call(t)],
    }),
  },
  {
    id: "cancel",
    priority: 4,
    bg: ["отказ", "отмен", "закъсн", "не мога да дойда", "премест", "друг ден", "болен съм"],
    en: ["cancel", "reschedule", "late", "can't make it", "cannot make it", "move my appointment", "another day"],
    reply: (t) => ({
      id: "cancel",
      text:
        t.lang === "bg"
          ? `Обадете се на ${SALON.phone}. Ако предупредите поне два часа предварително, преместваме часа без условия и без такса.\n\nПри закъснение над 15 минути може да се наложи да съкратим услугата, за да не изместим следващия клиент — казваме Ви го веднага, а не на стола.`
          : `Call ${SALON.phone}. Give us at least two hours' notice and we move the appointment with no conditions and no fee.\n\nIf you're more than 15 minutes late we may have to shorten the service so the next client isn't pushed back — we tell you that at the door, not in the chair.`,
      actions: [call(t)],
    }),
  },
  {
    id: "address",
    priority: 2,
    bg: ["адрес", "къде се намира", "къде сте", "как да стигна", "паркинг", "паркиране", "карта", "квартал", "транспорт"],
    en: ["address", "where are you", "how to get", "parking", "map", "location", "directions to"],
    reply: (t) => ({
      id: "address",
      text:
        t.lang === "bg"
          ? `Адресът е ${t.address}. Картата с точното място е най-долу на страницата.\n\n${t.contact.note} Телефонът на салона е ${SALON.phone}.`
          : `We are at ${t.address}. The map with the exact spot is at the bottom of the page.\n\n${t.contact.note} The salon's number is ${SALON.phone}.`,
      actions: [{ label: t.nav.contact, href: "#kontakti" }],
    }),
  },
  {
    id: "payment",
    priority: 2,
    bg: ["плащ", "плати", "с карта", "в брой", "фактура", "бон", "евро", "лева", "разсрочено", "вноск"],
    en: ["pay", "payment", "card", "cash", "invoice", "receipt", "euro", "lev", "instal"],
    reply: (t) => ({
      id: "payment",
      text:
        t.lang === "bg"
          ? `Плащането е в брой или с карта, след услугата.\n\nЦените са в евро, а левовата равностойност е по фиксирания курс 1 € = 1,95583 лв. и служи само за ориентир. Таксата за курс се плаща на две вноски.`
          : `You pay in cash or by card, after the service.\n\nPrices are in euro, and the lev equivalent uses the fixed rate €1 = BGN 1.95583, for reference only. A course fee is paid in two instalments.`,
      actions: [book(t)],
    }),
  },
  {
    id: "greeting",
    bg: ["здравей", "здрасти", "добър ден", "добро утро", "добър вечер", "ехо", "хей"],
    en: ["hello", "hi", "hey", "good morning", "good evening", "good afternoon"],
    reply: (t) => ({
      id: "greeting",
      text:
        t.lang === "bg"
          ? `Здравейте. Мога да помогна с цените по направления, със свободните часове, с това кой майстор какво работи и с курсовете. Кажете откъде да започнем.`
          : `Hello. I can help with prices by direction, with free times, with which stylist does what, and with the courses. Tell me where to start.`,
      actions: [prices(t), book(t)],
    }),
  },
  {
    id: "thanks",
    bg: ["благодар", "мерси", "супер", "чудесно"],
    en: ["thank", "thanks", "great", "perfect", "cheers"],
    reply: (t) => ({
      id: "thanks",
      text:
        t.lang === "bg"
          ? `Моля. Ако решите да запазите час, отнема под минута и потвърждението идва веднага.`
          : `You're welcome. If you decide to book, it takes under a minute and the confirmation is instant.`,
      actions: [book(t)],
    }),
  },
  {
    id: "affirmative",
    bg: ["да", "искам", "нека", "давай", "ок"],
    en: ["yes", "sure", "ok", "okay", "please do"],
    reply: (t) => {
      const s = soonest(t);
      return {
        id: "affirmative",
        text:
          t.lang === "bg"
            ? `Добре.${s ? ` Най-ранните свободни часове са ${s.when}: ${s.times.join(", ")}.` : ""} Формата за записване е по-надолу в страницата.`
            : `Of course.${s ? ` The earliest free times are ${s.when}: ${s.times.join(", ")}.` : ""} The booking form is further down the page.`,
        actions: [book(t)],
      };
    },
  },
];

/** Longer, more specific keywords outrank generic ones, and priority breaks ties. */
function score(q: string, keys: string[]) {
  let best = 0;
  for (const k of keys) {
    if (!q.includes(k)) continue;
    const boundary = new RegExp(`(^|\\s)${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(q);
    best = Math.max(best, k.length + (boundary ? 4 : 0));
  }
  return best;
}

export function answer(question: string, t: Content, lang: Lang): Answer {
  const q = norm(question);
  if (!q) {
    return { id: "fallback", text: t.assistant.fallback.replace("{phone}", SALON.phone) };
  }

  let bestIntent: Intent | null = null;
  let bestScore = 0;

  for (const pass of [lang, lang === "bg" ? "en" : "bg"] as Lang[]) {
    for (const intent of INTENTS) {
      const s = score(q, pass === "bg" ? intent.bg : intent.en);
      if (!s) continue;
      const weighted = s * (intent.priority ?? 1);
      if (weighted > bestScore) {
        bestScore = weighted;
        bestIntent = intent;
      }
    }
    if (bestIntent) break;
  }

  if (bestIntent) return bestIntent.reply(t, lang);

  return {
    id: "fallback",
    text: t.assistant.fallback.replace("{phone}", SALON.phone),
    actions: [book(t), call(t)],
  };
}

export const INTENT_IDS = INTENTS.map((i) => i.id);
