import { test } from "node:test";
import assert from "node:assert/strict";
import { intakesFor, nextOpenIntake } from "../lib/courses.ts";
import { COURSES } from "../lib/pricing.ts";

test("every course offers upcoming intakes", () => {
  COURSES.forEach((_, i) => {
    const list = intakesFor(i, 3);
    assert.equal(list.length, 3, `course ${i} offers ${list.length} intakes`);
  });
});

test("an intake is never in the past", () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  COURSES.forEach((_, i) => {
    for (const intake of intakesFor(i, 3)) {
      assert.ok(intake.date > today, `course ${i} starts on ${intake.date.toDateString()}`);
    }
  });
});

test("intakes start on a Monday and run in date order", () => {
  COURSES.forEach((_, i) => {
    const list = intakesFor(i, 3);
    for (const intake of list) assert.equal(intake.date.getDay(), 1);
    for (let n = 1; n < list.length; n++) {
      assert.ok(list[n].date > list[n - 1].date, "intakes are out of order");
    }
  });
});

test("places left never exceed the places there are", () => {
  COURSES.forEach((course, i) => {
    for (const intake of intakesFor(i, 3)) {
      assert.equal(intake.seats, course.seats);
      assert.ok(intake.left >= 0 && intake.left <= course.seats);
      assert.equal(intake.left + intake.taken, course.seats);
    }
  });
});

test("the same intake always looks the same", () => {
  const a = intakesFor(0, 3).map((i) => `${i.date.toISOString()}:${i.left}`);
  const b = intakesFor(0, 3).map((i) => `${i.date.toISOString()}:${i.left}`);
  assert.deepEqual(a, b);
});

test("the intake offered for enrolment is one that still has a place", () => {
  COURSES.forEach((_, i) => {
    const open = nextOpenIntake(i);
    if (open) assert.ok(open.left > 0);
  });
});

test("two courses never start on the same day", () => {
  const starts = COURSES.flatMap((_, i) =>
    intakesFor(i, 3).map((x) => `${i}:${x.date.toDateString()}`)
  );
  const days = starts.map((s) => s.split(":")[1]);
  assert.equal(new Set(days).size, days.length, "two intakes share a start date");
});
