/**
 * The salon, as five people.
 *
 * The old page put the salon first and the people in a strip near the bottom.
 * Here a master is the unit the site is built out of: the home page is their
 * faces, and everything else — work, prices, free hours — hangs off one of
 * them. Nothing on this site belongs to "the salon" except the address.
 *
 * Prices are NOT repeated here. A master names the exact price lines they take,
 * and the price list stays the single source, so a figure can never disagree
 * with itself between two pages.
 *
 * The lines are named one by one rather than by direction on purpose. Irina
 * says in her own words that she does not cut; handing her the whole "hair"
 * direction because she also does colour put four haircuts on her page and
 * made her page argue with itself.
 */
import type { Lang } from "./content";

export type MasterMeta = {
  slug: string;
  /** Portrait, and the pictures of their own work. */
  photo: string;
  works: string[];
  /** The exact price keys this person takes bookings for, in the order shown. */
  services: string[];
  /** Index into COURSES, when they teach one. */
  course: number | null;
  /** The year they started doing this — used for "X години на стола". */
  since: number;
};

export const MASTERS: MasterMeta[] = [
  {
    slug: "irina",
    photo: "/images/master-1.jpg",
    works: ["/images/work-irina-1.jpg", "/images/work-irina-2.jpg", "/images/work-irina-3.jpg"],
    services: ["tsvyat/koren", "tsvyat/kichuri", "tsvyat/baleaj"],
    course: null,
    since: 2008,
  },
  {
    slug: "boryana",
    photo: "/images/master-2.jpg",
    works: ["/images/work-boryana-1.jpg", "/images/work-boryana-2.jpg", "/images/work-boryana-3.jpg"],
    services: ["kosa/zhensko", "kosa/pricheska", "kosa/laminirane"],
    course: 0,
    since: 2013,
  },
  {
    slug: "daniel",
    photo: "/images/master-3.jpg",
    works: ["/images/work-daniel-1.jpg", "/images/work-daniel-2.jpg", "/images/work-daniel-3.jpg"],
    services: ["kosa/mazhko", "kosa/mazhko-brada", "kosa/brada"],
    course: null,
    since: 2016,
  },
  {
    slug: "niya",
    photo: "/images/master-4.jpg",
    works: ["/images/work-niya-1.jpg", "/images/work-niya-2.jpg", "/images/work-niya-3.jpg"],
    services: [
      "nokti/klasicheski",
      "nokti/gel",
      "nokti/izgrazhdane",
      "nokti/tipsove",
      "nokti/pedikyur",
      "nokti/svalyane",
    ],
    course: 1,
    since: 2017,
  },
  {
    slug: "elena",
    photo: "/images/master-5.jpg",
    works: ["/images/work-elena-1.jpg", "/images/work-elena-2.jpg", "/images/work-elena-3.jpg"],
    services: [
      "litse/pochistvane",
      "litse/masaj",
      "litse/hidratatsia",
      "litse/rf",
      "litse/mikroniidling",
      "litse/vezhdi",
    ],
    course: 2,
    since: 2015,
  },
];

export type MasterCopy = {
  name: string;
  /** Two or three words under the name, never a job advert. */
  role: string;
  /** One line, for the face on the home page. */
  line: string;
  /** What they actually say about their own work. */
  intro: string;
  strengths: string[];
  /** Captions for their three pictures, in order. */
  works: string[];
  reviews: { text: string; author: string }[];
};

const bg: MasterCopy[] = [
  {
    name: "Ирина Вълчева",
    role: "Цвят",
    line: "Работи само с цвят.",
    intro:
      "Не подстригвам. Правя само цвят, защото едно нещо, правено цял ден, се прави по-добре от три. Най-често при мен идват след домашно боядисване, което не е станало — това е поправимо, но иска време и честен разговор за това колко пъти ще се наложи да се видим.",
    strengths: ["Балеаж и меки преходи", "Корекция след домашен цвят", "Сиво и студени тонове"],
    works: ["Дълга коса след цвят", "Студено русо, втора среща", "Корекция след домашен цвят"],
    reviews: [
      {
        text: "Три пъти преди това ми бяха казали, че русото е невъзможно с моята коса. Ирина ми каза колко пъти ще идвам и защо. Дойдох четири пъти и стана точно каквото беше обещала.",
        author: "Мария Д.",
      },
      {
        text: "Единственият човек, който ми е отказвал цвят, защото косата ми не е била готова. Върнах се след месец и си струваше чакането.",
        author: "Петя К.",
      },
    ],
  },
  {
    name: "Боряна Митева",
    role: "Подстригване",
    line: "Реже сухо и гледа как пада.",
    intro:
      "Подстригвам на сухо, защото мократа коса лъже за дължината. Първите десет минути не пипам ножица — гледам как пада косата ви, когато не я държи никой. Оттам нататък е по-бързо, отколкото очаквате.",
    strengths: ["Дамско подстригване на сухо", "Официални прически", "Форма за къдрава коса"],
    works: ["Дълга коса, слоеве без стъпала", "Прибрана официална прическа", "Форма за къдрава коса"],
    reviews: [
      {
        text: "Каза ми, че прическата, която искам, ще ме кара да ставам половин час по-рано всяка сутрин. Направи друга. Права беше.",
        author: "Йоана С.",
      },
      {
        text: "Единственото място, където къдравата ми коса не излиза като триъгълник.",
        author: "Ана-Мария П.",
      },
    ],
  },
  {
    name: "Даниел Петков",
    role: "Барбер",
    line: "Машинка, ножица, бръснач.",
    intro:
      "Мъжко подстригване и брада. Работя и с бръснач, което повечето места вече не правят. Ако идвате за първи път, оставете си четирийсет минути — после става за половин час.",
    strengths: ["Преход с машинка", "Оформяне с бръснач", "Брада и контур"],
    works: ["Брада с бръснач", "Контур на брадата", "Къса форма с ножица"],
    reviews: [
      {
        text: "Не ме пита „както обикновено ли“. Пита какво се е променило от миналия път.",
        author: "Стоян М.",
      },
      {
        text: "Бръснач с топла кърпа. Заради това идвам, не заради подстригването.",
        author: "Николай Г.",
      },
    ],
  },
  {
    name: "Ния Стоянова",
    role: "Нокти",
    line: "Отделна стая, без шум.",
    intro:
      "Работя в отделно помещение от сешоарите — без шум и без лак във въздуха на салона. Не бързам: плочката се подготвя, преди да се сложи каквото и да било върху нея, и точно затова държи.",
    strengths: ["Гел лак върху тънка плочка", "Изграждане и корекция", "Педикюр"],
    works: ["Гел лак, естествена дължина", "Инструментите, стерилизирани за всеки", "Оформяне на плочката"],
    reviews: [
      {
        text: "Ноктите ми се чупеха при всеки друг. Тук държат по три седмици и половина.",
        author: "Габриела Т.",
      },
      {
        text: "Тихо е. След работа това е половината причина да дойда.",
        author: "Десислава Н.",
      },
    ],
  },
  {
    name: "Елена Георгиева",
    role: "Лице",
    line: "Първо гледа кожата, после работи.",
    intro:
      "Козметика и апаратни процедури. Първият път не е процедура, а преглед — кожата казва какво ѝ трябва и почти никога това, което сте прочели някъде. Работя на курс, не на единично посещение, и го казвам още в началото.",
    strengths: ["Почистване и възстановяване", "Апаратни процедури на курс", "Вежди"],
    works: ["Почистване, втора седмица", "Хидратация със серум", "Ламиниране на вежди"],
    reviews: [
      {
        text: "Каза ми, че това, което съм си купила, не работи за моята кожа, и ми обясни защо. Не ми продаде нищо в този ден.",
        author: "Румяна В.",
      },
      {
        text: "Единственият козметик, който ми е дал план, а не пакет.",
        author: "Кристина А.",
      },
    ],
  },
];

const en: MasterCopy[] = [
  {
    name: "Irina Valcheva",
    role: "Colour",
    line: "Colour only. Nothing else.",
    intro:
      "I don't cut. I only do colour, because one thing done all day is done better than three. Most people come to me after home colour that went wrong — that is fixable, but it takes time and an honest conversation about how many visits it will take.",
    strengths: ["Balayage and soft grow-outs", "Correcting home colour", "Grey and cool tones"],
    works: ["Long hair after colour", "Cool blonde, second visit", "Correction after home colour"],
    reviews: [
      {
        text: "Three people had told me blonde was impossible with my hair. Irina told me how many visits it would take and why. It took four, and it came out exactly as she said.",
        author: "Maria D.",
      },
      {
        text: "The only person who has ever turned me away because my hair wasn't ready. I came back a month later and it was worth the wait.",
        author: "Petya K.",
      },
    ],
  },
  {
    name: "Boryana Miteva",
    role: "Cutting",
    line: "Cuts dry, watches it fall.",
    intro:
      "I cut dry, because wet hair lies about length. For the first ten minutes I don't pick up the scissors — I watch how your hair falls when nobody is holding it. After that it goes faster than you expect.",
    strengths: ["Dry cutting", "Occasion styling", "Shape for curly hair"],
    works: ["Long hair, layers without steps", "An occasion updo", "A shape for curly hair"],
    reviews: [
      {
        text: "She told me the cut I wanted would cost me half an hour every morning. She did a different one. She was right.",
        author: "Yoana S.",
      },
      {
        text: "The only place where my curly hair doesn't come out as a triangle.",
        author: "Ana-Maria P.",
      },
    ],
  },
  {
    name: "Daniel Petkov",
    role: "Barber",
    line: "Clipper, scissors, razor.",
    intro:
      "Men's cuts and beards. I still work with a razor, which most places have stopped doing. If it's your first time, leave yourself forty minutes — after that it's half an hour.",
    strengths: ["Clipper fades", "Razor finishing", "Beard and outline"],
    works: ["Beard, finished with a razor", "The beard outline", "A short scissor shape"],
    reviews: [
      {
        text: "He doesn't ask 'the usual?'. He asks what has changed since last time.",
        author: "Stoyan M.",
      },
      {
        text: "Razor and a hot towel. That's why I come, not for the haircut.",
        author: "Nikolay G.",
      },
    ],
  },
  {
    name: "Niya Stoyanova",
    role: "Nails",
    line: "Her own room. Quiet.",
    intro:
      "I work in a room away from the dryers — no noise, no varnish in the salon air. I don't rush: the nail is prepared before anything goes on it, and that is exactly why it holds.",
    strengths: ["Gel polish on thin nails", "Extensions and repairs", "Pedicure"],
    works: ["Gel polish, natural length", "Tools, sterilised for every client", "Shaping the nail"],
    reviews: [
      {
        text: "My nails broke with everyone else. Here they hold for three and a half weeks.",
        author: "Gabriela T.",
      },
      {
        text: "It's quiet. After work that's half the reason I come.",
        author: "Desislava N.",
      },
    ],
  },
  {
    name: "Elena Georgieva",
    role: "Skin",
    line: "Looks at the skin first.",
    intro:
      "Facials and device-led treatments. The first appointment isn't a treatment, it's a look at your skin — which almost never asks for what you read somewhere. I work in courses, not single visits, and I say so at the start.",
    strengths: ["Cleansing and repair", "Device treatments as a course", "Brows"],
    works: ["Cleansing, second week", "Serum hydration", "Brow lamination"],
    reviews: [
      {
        text: "She told me the thing I'd bought doesn't work for my skin, and explained why. She sold me nothing that day.",
        author: "Rumyana V.",
      },
      {
        text: "The only facialist who gave me a plan instead of a package.",
        author: "Kristina A.",
      },
    ],
  },
];

export const MASTER_COPY: Record<Lang, MasterCopy[]> = { bg, en };

export function masterCopy(lang: Lang, index: number) {
  return MASTER_COPY[lang][index];
}

export function masterBySlug(slug: string) {
  const index = MASTERS.findIndex((m) => m.slug === slug);
  return index < 0 ? null : { index, meta: MASTERS[index] };
}

/** How long they have been doing this, in whole years. */
export function yearsOn(index: number, now = new Date()) {
  return now.getFullYear() - MASTERS[index].since;
}
