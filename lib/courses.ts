import { COURSES } from "./pricing";
import { ymd } from "./slots";

/**
 * Intakes are derived from today's date rather than written down, so the demo
 * never shows a course that started last spring. Each course opens on the
 * first Monday of a month, staggered so the three do not all begin at once.
 */
function firstMonday(year: number, month: number) {
  const d = new Date(year, month, 1);
  d.setDate(1 + ((8 - d.getDay()) % 7));
  return d;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type Intake = { date: Date; seats: number; taken: number; left: number };

export function intakesFor(courseIndex: number, count = 3): Intake[] {
  const course = COURSES[courseIndex];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const out: Intake[] = [];
  for (let step = 0; out.length < count && step < 18; step++) {
    const probe = new Date(now.getFullYear(), now.getMonth() + step, 1);
    const date = firstMonday(probe.getFullYear(), probe.getMonth());
    // An intake that has already started is no longer on offer.
    if (date <= now) continue;
    // Each course takes every third month, so two intakes never start together.
    if ((date.getMonth() + courseIndex) % COURSES.length !== 0) continue;

    const taken = hash(`${course.slug}${ymd(date)}`) % (course.seats + 1);
    out.push({ date, seats: course.seats, taken, left: course.seats - taken });
  }
  return out;
}

/** The soonest intake with a place left — what the course card leads with. */
export function nextOpenIntake(courseIndex: number) {
  return intakesFor(courseIndex, 6).find((i) => i.left > 0) ?? null;
}
