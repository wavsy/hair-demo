import { test } from "node:test";
import assert from "node:assert/strict";
import { answer } from "../lib/assistant.ts";
import { getContent } from "../lib/content.ts";

const bg = getContent("bg");
const en = getContent("en");

test("an emergency outranks a price question in the same sentence", () => {
  const a = answer("кучето ми е отровено, колко струва преглед", bg, "bg");
  assert.equal(a.id, "emergency");
  assert.match(a.text, /\+359 88 400 18 40/);
});

test("specific price questions beat the generic price list", () => {
  assert.equal(answer("колко струва кастрация на котка", bg, "bg").id, "price-surgery");
  assert.equal(answer("цена на ваксина", bg, "bg").id, "price-vaccine");
  assert.equal(answer("колко е зъбен камък", bg, "bg").id, "price-dental");
  assert.equal(answer("цена на ехография", bg, "bg").id, "price-imaging");
  assert.equal(answer("цени", bg, "bg").id, "price-all");
});

test("the Bulgarian quick replies all resolve to a real intent", () => {
  for (const chip of bg.assistant.chips) {
    const a = answer(chip, bg, "bg");
    assert.notEqual(a.id, "fallback", `chip fell through: ${chip}`);
  }
});

test("the English quick replies all resolve to a real intent", () => {
  for (const chip of en.assistant.chips) {
    const a = answer(chip, en, "en");
    assert.notEqual(a.id, "fallback", `chip fell through: ${chip}`);
  }
});

test("a question asked in the other language is still understood", () => {
  assert.equal(answer("what are your opening hours", bg, "bg").id, "hours");
  assert.equal(answer("колко струва преглед", en, "en").id, "price-exam");
});

test("answers are given in the language of the page, not of the question", () => {
  const a = answer("what are your opening hours", bg, "bg");
  assert.match(a.text, /Понеделник/);
  const b = answer("работно време", en, "en");
  assert.match(b.text, /Monday/);
});

test("symptoms are never answered with a diagnosis", () => {
  const a = answer("кучето повръща от вчера", bg, "bg");
  assert.equal(a.id, "symptom");
  assert.match(a.text, /не мога да поставя диагноза/);
  assert.ok(a.actions?.some((x) => x.href.startsWith("tel:")));
});

test("travel questions mention the 21 day rabies rule", () => {
  assert.match(answer("пътуване в чужбина с куче", bg, "bg").text, /21 дни/);
  assert.match(answer("travelling abroad with my dog", en, "en").text, /21 days/);
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
  const questions = ["цени", "работно време", "къде се намирате", "как се плаща", "искам час"];
  for (const q of questions) {
    const a = answer(q, bg, "bg");
    const hasStep = (a.actions?.length ?? 0) > 0 || /\+359/.test(a.text);
    assert.ok(hasStep, `no next step for: ${q}`);
  }
});
