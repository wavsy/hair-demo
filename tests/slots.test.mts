import { test } from "node:test";
import assert from "node:assert/strict";
import { nextAvailability, slotsFor, VETS, ymd } from "../lib/slots.ts";

const at = (days: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
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

test("Sunday closes earlier than a weekday", () => {
  let sunday = at(0);
  for (let i = 0; i < 7 && sunday.getDay() !== 0; i++) sunday = at(i + 1);
  const last = slotsFor(sunday).at(-1)!.time;
  assert.ok(last <= "15:00", `Sunday runs until ${last}`);
});

test("the next availability is a real free slot on that day", () => {
  const next = nextAvailability(3);
  assert.ok(next, "no availability at all in the next two weeks");
  assert.ok(next!.times.length > 0);
  const free = slotsFor(next!.date).filter((s) => s.free).map((s) => s.time);
  for (const time of next!.times) assert.ok(free.includes(time), `${time} is not free`);
});

test("ymd formats a date the way the ics file needs it", () => {
  assert.equal(ymd(new Date(2026, 8, 21)), "2026-09-21");
});

test("choosing a vet can only narrow the free hours, never widen them", () => {
  const day = at(2);
  const any = new Set(slotsFor(day).filter((s) => s.free).map((s) => s.time));
  for (let v = 0; v < VETS; v++) {
    for (const s of slotsFor(day, v)) {
      if (s.free) assert.ok(any.has(s.time), `${s.time} is free for vet ${v} but not for "any"`);
    }
  }
});

test("an hour open for nobody is not offered under \"any vet\"", () => {
  const day = at(4);
  for (const s of slotsFor(day)) {
    if (!s.free) {
      for (let v = 0; v < VETS; v++) {
        const forVet = slotsFor(day, v).find((x) => x.time === s.time);
        assert.equal(forVet?.free, false, `${s.time} is taken for "any" but free for vet ${v}`);
      }
    }
  }
});

test("the vets do not all keep identical diaries", () => {
  const day = at(5);
  const shapes = new Set(
    Array.from({ length: VETS }, (_, v) => slotsFor(day, v).map((s) => (s.free ? "1" : "0")).join(""))
  );
  assert.ok(shapes.size > 1, "every vet has the same availability");
});
