/**
 * Every figure here is aligned to a published Sofia price list, checked in
 * September 2026. The sources are recorded in DECISIONS.md; the comment on
 * each row says which one it came from. Nothing is invented — if a service
 * has no published source, it is not on the list.
 *
 *   R  = Rosi Style        https://rosistyle.bg/cenorazpis/
 *   V  = Студио ВИКИ       https://viki77.com/hair-price/
 *   O  = ONAYA, Казанлък   https://onaya.bg/pricelist/  (quoted in BGN)
 *
 * Durations are the salon's own scheduling, not a quoted figure — the salon
 * is invented, so how long it books for a service is part of the fiction.
 */

export type PriceItem = {
  slug: string;
  /** Lower bound in euro. When `to` is absent this is the single price. */
  from: number;
  to?: number;
  /** Minutes the chair is held for. */
  duration: number;
};

export type DirectionMeta = {
  slug: string;
  icon: string;
  items: PriceItem[];
};

export const DIRECTIONS: DirectionMeta[] = [
  {
    slug: "kosa",
    icon: "scissors",
    items: [
      { slug: "zhensko", from: 20, to: 28, duration: 60 }, // R 20–25, V 23–28
      { slug: "mazhko", from: 8, duration: 30 }, // R 8
      { slug: "pricheska", from: 107, duration: 90 }, // V 107
      { slug: "laminirane", from: 40, to: 50, duration: 90 }, // R 40–50
    ],
  },
  {
    slug: "tsvyat",
    icon: "drop",
    items: [
      { slug: "koren", from: 25, to: 35, duration: 90 }, // R 25–35
      { slug: "kichuri", from: 80, to: 100, duration: 150 }, // R 80–100
      { slug: "baleaj", from: 128, to: 230, duration: 240 }, // V 128–230
    ],
  },
  {
    slug: "nokti",
    icon: "nail",
    items: [
      { slug: "klasicheski", from: 10, duration: 40 }, // O 20 лв. = 10,23 €
      { slug: "gel", from: 20, duration: 60 }, // O 40 лв. = 20,45 €
      { slug: "izgrazhdane", from: 26, duration: 90 }, // O 50 лв. = 25,57 €
      { slug: "tipsove", from: 41, duration: 120 }, // O 80 лв. = 40,90 €
      { slug: "pedikyur", from: 20, duration: 60 }, // O 40 лв. = 20,45 €
      { slug: "svalyane", from: 8, duration: 20 }, // O 15 лв. = 7,67 €
    ],
  },
  {
    slug: "litse",
    icon: "face",
    items: [
      { slug: "pochistvane", from: 36, duration: 60 }, // O 70 лв. = 35,79 €
      { slug: "masaj", from: 15, duration: 30 }, // O 30 лв. = 15,34 €
      { slug: "hidratatsia", from: 51, duration: 60 }, // O 100 лв. = 51,13 €
      { slug: "rf", from: 61, duration: 60 }, // O 120 лв. = 61,35 €
      { slug: "mikroniidling", from: 77, duration: 60 }, // O 150 лв. = 76,69 €
      { slug: "vezhdi", from: 36, duration: 45 }, // O 70 лв. = 35,79 €
    ],
  },
];

/** Flat lookup, because booking and the assistant both need it by slug. */
export const PRICE_INDEX = DIRECTIONS.flatMap((d, di) =>
  d.items.map((item, ii) => ({ ...item, direction: d.slug, di, ii, key: `${d.slug}/${item.slug}` }))
);

export function priceItem(key: string) {
  return PRICE_INDEX.find((p) => p.key === key);
}

/** The cheapest thing in a direction — what the card leads with. */
export function directionFrom(di: number) {
  return Math.min(...DIRECTIONS[di].items.map((i) => i.from));
}

export type CourseMeta = {
  slug: string;
  price: number;
  /** Teaching hours, only where the source states them. */
  hours?: number;
  practice?: number;
  theory?: number;
  /** Total places per intake. */
  seats: number;
};

/**
 * Course prices, September 2026:
 *   Дълголетие, София      фризьорство 1 900 €, 660 ч (389 практика + 271 теория),
 *                          Свидетелство за професионална квалификация
 *   My Angels              маникюр с гел лак 355 €; професионален грим 710 €, 40 ч
 * Cross-checked against Дълголетие, Казанлък (2 550 €) and Aurielle Beauty
 * Academy (грим 650 € + 155 € за удостоверение към МОН) — see DECISIONS.md.
 */
export const COURSES: CourseMeta[] = [
  { slug: "frizyorstvo", price: 1900, hours: 660, practice: 389, theory: 271, seats: 12 },
  { slug: "manikyur", price: 355, seats: 8 },
  { slug: "grim", price: 710, hours: 40, seats: 10 },
];
