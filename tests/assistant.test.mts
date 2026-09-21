import { test } from "node:test";
import assert from "node:assert/strict";
import { answer } from "../lib/assistant.ts";
import { getContent } from "../lib/content.ts";

const bg = getContent("bg");
const en = getContent("en");

test("a question about a named direction beats the generic price list", () => {
  assert.equal(answer("колко струва балеаж", bg, "bg").id, "price-colour");
  assert.equal(answer("цена на дамско подстригване", bg, "bg").id, "price-hair");
  assert.equal(answer("колко е маникюр с гел лак", bg, "bg").id, "price-nails");
  assert.equal(answer("микронидлинг цена", bg, "bg").id, "price-face");
  assert.equal(answer("цени", bg, "bg").id, "price-all");
});

test("asking who does the work reaches the masters, not the price list", () => {
  assert.equal(answer("кой прави цвят", bg, "bg").id, "masters");
  assert.equal(answer("who does colour", en, "en").id, "masters");
});

test("the masters answer names the people, because the site is built on them", () => {
  const a = answer("кой работи при вас", bg, "bg");
  assert.equal(a.id, "masters");
  for (const m of bg.team.members) assert.match(a.text, new RegExp(m.name));
});

test("a colour question says who actually does colour", () => {
  assert.match(answer("балеаж", bg, "bg").text, /Ирина/);
  assert.match(answer("balayage", en, "en").text, /Irina/);
});

test("the Bulgarian quick replies all resolve to a real intent", () => {
  for (const chip of bg.assistant.chips) {
    assert.notEqual(answer(chip, bg, "bg").id, "fallback", `chip fell through: ${chip}`);
  }
});

test("the English quick replies all resolve to a real intent", () => {
  for (const chip of en.assistant.chips) {
    assert.notEqual(answer(chip, en, "en").id, "fallback", `chip fell through: ${chip}`);
  }
});

test("a question asked in the other language is still understood", () => {
  assert.equal(answer("what are your opening hours", bg, "bg").id, "hours");
  assert.equal(answer("колко струва подстригване", en, "en").id, "price-hair");
});

test("answers are given in the language of the page, not of the question", () => {
  assert.match(answer("what are your opening hours", bg, "bg").text, /Понеделник/);
  assert.match(answer("работно време", en, "en").text, /Monday/);
});

test("the hours answer says plainly that Sunday is closed", () => {
  assert.match(answer("работите ли в неделя", bg, "bg").text, /неделя салонът почива/i);
  assert.match(answer("are you open on sunday", en, "en").text, /closed on Sunday/i);
});

test("ruined hair is never quoted a price from a description", () => {
  const a = answer("изрусих се вкъщи и си съсипах косата", bg, "bg");
  assert.equal(a.id, "damaged");
  assert.match(a.text, /не се оценява по описание/);
  assert.ok(a.actions?.some((x) => x.href === "#chas"));
});

test("courses answer with a fee, a certificate and a start date", () => {
  const a = answer("интересува ме курс по фризьорство", bg, "bg");
  assert.equal(a.id, "courses");
  assert.match(a.text, /1900 €|1 900 €/);
  assert.match(a.text, /Свидетелство за професионална квалификация/);
  assert.match(a.text, /започва/i);
});

test("cancelling is answered with the rule, not with a shrug", () => {
  const a = answer("не мога да дойда утре", bg, "bg");
  assert.equal(a.id, "cancel");
  assert.match(a.text, /два часа/);
  assert.ok(a.actions?.some((x) => x.href.startsWith("tel:")));
});

test("an unknown question falls back with a way to reach a human", () => {
  const a = answer("обичате ли джаз", bg, "bg");
  assert.equal(a.id, "fallback");
  assert.ok(a.actions?.some((x) => x.href.startsWith("tel:")));
});

test("empty input does not throw", () => {
  assert.equal(answer("   ", bg, "bg").id, "fallback");
});

test("every answer offers a next step or a phone number", () => {
  const questions = [
    "цени",
    "работно време",
    "къде се намирате",
    "как се плаща",
    "искам час",
    "курсове",
    "кой прави цвят",
  ];
  for (const q of questions) {
    const a = answer(q, bg, "bg");
    const hasStep = (a.actions?.length ?? 0) > 0 || /\+359/.test(a.text);
    assert.ok(hasStep, `no next step for: ${q}`);
  }
});

test("no answer quotes a price the price list does not carry", () => {
  const a = answer("цени", bg, "bg");
  assert.ok(!/€\s*0\b/.test(a.text), "a zero price leaked into an answer");
});
