import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTENT, priceLabel, rangeLabel } from "../lib/content.ts";
import { MASTERS, MASTER_COPY } from "../lib/masters.ts";
import { COURSES, DIRECTIONS, PRICE_INDEX, priceItem } from "../lib/pricing.ts";

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

test("every master is described in both languages, and every course has one teacher", () => {
  for (const lang of ["bg", "en"] as const) {
    assert.equal(MASTER_COPY[lang].length, MASTERS.length);
    MASTER_COPY[lang].forEach((c, i) => {
      assert.ok(c.name.trim(), `${lang}: master ${i} has no name`);
      assert.ok(c.intro.trim(), `${lang}: ${c.name} says nothing about their work`);
      assert.equal(
        c.works.length,
        MASTERS[i].works.length,
        `${lang}: ${c.name} has ${MASTERS[i].works.length} pictures and ${c.works.length} captions`
      );
      assert.ok(c.reviews.length > 0, `${lang}: nobody has said anything about ${c.name}`);
    });
  }
  COURSES.forEach((_, ci) => {
    const teachers = MASTERS.filter((m) => m.course === ci);
    assert.equal(teachers.length, 1, `course ${ci} has ${teachers.length} teachers`);
  });
});

test("master slugs are unique, because they are addresses", () => {
  const slugs = MASTERS.map((m) => m.slug);
  assert.equal(new Set(slugs).size, slugs.length, "two masters share a slug");
  for (const s of slugs) assert.match(s, /^[a-z]+$/, `"${s}" is not usable in a URL`);
});

test("every service a master offers exists in the price list", () => {
  for (const m of MASTERS) {
    assert.ok(m.services.length > 0, `${m.slug} offers nothing`);
    for (const key of m.services) {
      assert.ok(priceItem(key), `${m.slug} offers "${key}", which has no price`);
    }
  }
});

test("every price line is offered by somebody", () => {
  const offered = new Set(MASTERS.flatMap((m) => m.services));
  for (const p of PRICE_INDEX) {
    assert.ok(offered.has(p.key), `"${p.key}" has a price but nobody does it`);
  }
});

test("nobody is offered for work they say they do not do", () => {
  // Irina's own page says she does not cut. The guard is structural: a master
  // whose services span a direction must be the only kind of claim they make.
  const irina = MASTERS.find((m) => m.slug === "irina");
  assert.ok(irina);
  for (const key of irina.services) {
    assert.ok(key.startsWith("tsvyat/"), `Irina is offered "${key}" but she only does colour`);
  }
  const daniel = MASTERS.find((m) => m.slug === "daniel");
  assert.ok(daniel);
  for (const key of daniel.services) {
    assert.ok(key.startsWith("kosa/"), `Daniel is offered "${key}" but he is a barber`);
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

test("every picture a master shows has a caption and a distinct file", () => {
  const files = MASTERS.flatMap((m) => [m.photo, ...m.works]);
  assert.equal(new Set(files).size, files.length, "two slots point at the same photograph");
  for (const f of files) assert.match(f, /^\/images\/[a-z0-9-]+\.jpg$/, `odd path: ${f}`);
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
