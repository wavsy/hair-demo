import { test } from "node:test";
import assert from "node:assert/strict";
import { MASTERS, isClosed, nextAvailability, slotsFor, ymd } from "../lib/slots.ts";

const at = (days: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
};

const sunday = () => {
  for (let i = 0; i < 7; i++) {
    const d = at(i);
    if (d.getDay() === 0) return d;
  }
  throw new Error("no Sunday in the next week");
};

test("an hour that has already passed today is never bookable", () => {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const s of slotsFor(at(0))) {
    const min = Number(s.time.slice(0, 2)) * 60 + Number(s.time.slice(3));
    if (s.free) assert.ok(min > nowMin, `${s.time} is bookable but already passed`);
  }
});

test("the same future day always looks the same", () => {
  const a = slotsFor(at(3)).map((s) => `${s.time}:${s.free}`);
  const b = slotsFor(at(3)).map((s) => `${s.time}:${s.free}`);
  assert.deepEqual(a, b);
});

test("Sunday is closed and offers no hour at all", () => {
  const d = sunday();
  assert.ok(isClosed(d));
  assert.deepEqual(slotsFor(d), []);
  for (let m = 0; m < MASTERS; m++) assert.deepEqual(slotsFor(d, m), []);
});

test("Saturday closes earlier than a weekday", () => {
  let saturday = at(0);
  for (let i = 0; i < 7; i++) {
    const d = at(i);
    if (d.getDay() === 6) saturday = d;
  }
  let weekday = at(0);
  for (let i = 0; i < 7; i++) {
    const d = at(i);
    if (d.getDay() >= 1 && d.getDay() <= 5) weekday = d;
  }
  assert.ok(slotsFor(saturday).at(-1)!.time < slotsFor(weekday).at(-1)!.time);
});

test("the next availability is a real free slot on that day", () => {
  const next = nextAvailability(3);
  assert.ok(next, "no availability at all in the next two weeks");
  assert.ok(next!.times.length > 0);
  assert.ok(!isClosed(next!.date), "offered a day the salon is shut");
  const free = slotsFor(next!.date).filter((s) => s.free).map((s) => s.time);
  for (const time of next!.times) assert.ok(free.includes(time), `${time} is not free`);
});

test("asking for one master's next availability stays within that master's diary", () => {
  for (let m = 0; m < MASTERS; m++) {
    const next = nextAvailability(3, m);
    if (!next) continue;
    const free = slotsFor(next.date, m).filter((s) => s.free).map((s) => s.time);
    for (const time of next.times) assert.ok(free.includes(time), `master ${m}: ${time} is not free`);
  }
});

test("ymd formats a date the way the ics file needs it", () => {
  assert.equal(ymd(new Date(2026, 8, 21)), "2026-09-21");
});

test("choosing a master can only narrow the free hours, never widen them", () => {
  const day = at(2);
  const any = new Set(slotsFor(day).filter((s) => s.free).map((s) => s.time));
  for (let m = 0; m < MASTERS; m++) {
    for (const s of slotsFor(day, m)) {
      if (s.free) assert.ok(any.has(s.time), `${s.time} is free for master ${m} but not for "any"`);
    }
  }
});

test('an hour open for nobody is not offered under "any master"', () => {
  const day = at(4);
  for (const s of slotsFor(day)) {
    if (!s.free) {
      for (let m = 0; m < MASTERS; m++) {
        const forMaster = slotsFor(day, m).find((x) => x.time === s.time);
        assert.equal(forMaster?.free, false, `${s.time} is taken for "any" but free for master ${m}`);
      }
    }
  }
});

test("the masters do not all keep identical diaries", () => {
  const day = at(5);
  const shapes = new Set(
    Array.from({ length: MASTERS }, (_, m) =>
      slotsFor(day, m).map((s) => (s.free ? "1" : "0")).join("")
    )
  );
  assert.ok(shapes.size > 1, "every master has the same availability");
});
