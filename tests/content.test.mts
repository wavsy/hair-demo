import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTENT, priceLabel, SERVICE_META, TEAM_PHOTOS } from "../lib/content.ts";

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

test("no English string was left in Bulgarian by accident", () => {
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

test("every service has copy in both languages", () => {
  for (const lang of ["bg", "en"] as const) {
    assert.equal(CONTENT[lang].services.items.length, SERVICE_META.length);
  }
});

test("every team member has a photo", () => {
  assert.equal(CONTENT.bg.team.members.length, TEAM_PHOTOS.length);
  assert.equal(CONTENT.en.team.members.length, TEAM_PHOTOS.length);
});

test("prices convert at the fixed euro rate", () => {
  assert.deepEqual(priceLabel(20, "bg"), { eur: "20 €", bgn: "39,12 лв." });
  assert.deepEqual(priceLabel(20, "en"), { eur: "20 €", bgn: "BGN 39.12" });
});

test("opening hours cover all seven days in both languages", () => {
  assert.equal(CONTENT.bg.contact.hours.length, 7);
  assert.equal(CONTENT.en.contact.hours.length, 7);
});
