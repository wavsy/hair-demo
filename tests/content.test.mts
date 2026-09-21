import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONTENT,
  GALLERY_PHOTOS,
  MASTER_META,
  priceLabel,
  rangeLabel,
} from "../lib/content.ts";
import { COURSES, DIRECTIONS, PRICE_INDEX } from "../lib/pricing.ts";

/** Walks both dictionaries together so a missing translation fails the build. */
function compare(a: unknown, b: unknown, path: string, out: string[]) {
  if (typeof a !== typeof b) {
    out.push(`${path}: bg is ${typeof a}, en is ${typeof b}`);
    return;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return out.push(`${path}: array mismatch`);
    if (a.length !== b.length) out.push(`${path}: bg has ${a.length}, en has ${b.length}`);
    a.forEach((item, i) => b[i] !== undefined && compare(item, b[i], `${path}[${i}]`, out));
    return;
  }
  if (a && b && typeof a === "object") {
    const ka = Object.keys(a as object).sort();
    const kb = Object.keys(b as object).sort();
    for (const k of ka) if (!kb.includes(k)) out.push(`${path}.${k}: missing in en`);
    for (const k of kb) if (!ka.includes(k)) out.push(`${path}.${k}: missing in bg`);
    for (const k of ka.filter((k) => kb.includes(k))) {
      compare((a as never)[k], (b as never)[k], `${path}.${k}`, out);
    }
  }
}

test("the two dictionaries have exactly the same shape", () => {
  const problems: string[] = [];
  compare(CONTENT.bg, CONTENT.en, "t", problems);
  assert.deepEqual(problems, []);
});

test("no Bulgarian string was left in the English dictionary", () => {
  const leftovers: string[] = [];
  const walk = (v: unknown, path: string) => {
    if (typeof v === "string" && /[а-яА-Я]/.test(v)) leftovers.push(`${path}: ${v.slice(0, 40)}`);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) if (k !== "mapsQuery") walk(x, `${path}.${k}`);
    }
  };
  walk(CONTENT.en, "en");
  assert.deepEqual(leftovers, []);
});

test("every direction has copy for each of its price lines, in both languages", () => {
  for (const lang of ["bg", "en"] as const) {
    assert.equal(CONTENT[lang].directions.items.length, DIRECTIONS.length);
    DIRECTIONS.forEach((d, di) => {
      assert.equal(
        CONTENT[lang].directions.items[di].prices.length,
        d.items.length,
        `${lang}: direction ${d.slug} has ${d.items.length} prices but ${CONTENT[lang].directions.items[di].prices.length} titles`
      );
    });
  }
});

test("every course has copy in both languages", () => {
  for (const lang of ["bg", "en"] as const) {
    assert.equal(CONTENT[lang].courses.items.length, COURSES.length);
  }
});

test("every master has a photo, and every course has exactly one teacher", () => {
  assert.equal(CONTENT.bg.team.members.length, MASTER_META.length);
  assert.equal(CONTENT.en.team.members.length, MASTER_META.length);
  COURSES.forEach((_, ci) => {
    const teachers = MASTER_META.filter((m) => m.course === ci);
    assert.equal(teachers.length, 1, `course ${ci} has ${teachers.length} teachers`);
  });
});

test("every master works at least one direction that actually exists", () => {
  const slugs = new Set(DIRECTIONS.map((d) => d.slug));
  for (const [i, m] of MASTER_META.entries()) {
    assert.ok(m.directions.length > 0, `master ${i} works nothing`);
    for (const slug of m.directions) assert.ok(slugs.has(slug), `master ${i}: unknown "${slug}"`);
  }
});

test("every direction has somebody who can actually do it", () => {
  for (const d of DIRECTIONS) {
    const crew = MASTER_META.filter((m) => (m.directions as readonly string[]).includes(d.slug));
    assert.ok(crew.length > 0, `nobody works ${d.slug}`);
  }
});

test("price keys are unique, and a range never runs backwards", () => {
  const keys = PRICE_INDEX.map((p) => p.key);
  assert.equal(new Set(keys).size, keys.length, "two price lines share a key");
  for (const p of PRICE_INDEX) {
    assert.ok(p.from > 0, `${p.key} is free`);
    assert.ok(p.duration > 0, `${p.key} takes no time`);
    if (p.to !== undefined) assert.ok(p.to > p.from, `${p.key}: ${p.from} – ${p.to}`);
  }
});

test("there are six gallery captions and six gallery photographs", () => {
  assert.equal(GALLERY_PHOTOS.length, 6);
  assert.equal(CONTENT.bg.gallery.items.length, GALLERY_PHOTOS.length);
  assert.equal(CONTENT.en.gallery.items.length, GALLERY_PHOTOS.length);
});

test("prices convert at the fixed euro rate", () => {
  assert.deepEqual(priceLabel(20, "bg"), { eur: "20 €", bgn: "39,12 лв." });
  assert.deepEqual(priceLabel(20, "en"), { eur: "20 €", bgn: "BGN 39.12" });
});

test("a range reads as a range and a single price does not", () => {
  assert.equal(rangeLabel(20, 28, "bg").eur, "20 – 28 €");
  assert.equal(rangeLabel(107, undefined, "bg").eur, "107 €");
});

test("opening hours cover all seven days, and Sunday is the closed one", () => {
  for (const lang of ["bg", "en"] as const) {
    const hours = CONTENT[lang].contact.hours;
    assert.equal(hours.length, 7);
    assert.equal(hours[6].from, "", "Sunday should carry no hours");
    for (const day of hours.slice(0, 6)) assert.match(day.from, /^\d\d:\d\d$/);
  }
});
