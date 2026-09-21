export function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/** Deterministic "busy" pattern so a day always looks the same to everyone. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * When the chairs are open, indexed the way `Date.getDay()` counts: 0 is
 * Sunday. `null` is a closed day — Sunday the salon does not work at all,
 * and a closed day must never offer an hour.
 */
const OPEN: ([number, number] | null)[] = [
  null,
  [9 * 60, 19 * 60],
  [9 * 60, 19 * 60],
  [9 * 60, 19 * 60],
  [9 * 60, 19 * 60],
  [9 * 60, 19 * 60],
  [9 * 60, 17 * 60],
];

export function isClosed(date: Date) {
  return OPEN[date.getDay()] === null;
}

/** How many masters take appointments. Index 0..MASTERS-1; anything else means "any master". */
export const MASTERS = 5;

export function slotsFor(date: Date, master?: number) {
  const window = OPEN[date.getDay()];
  if (!window) return [];
  const [start, end] = window;

  // An hour that has already passed today must never be bookable.
  const now = new Date();
  const isToday = ymd(now) === ymd(date);
  const cutoff = isToday ? now.getHours() * 60 + now.getMinutes() + 60 : -1;

  // Each master keeps their own diary. Without a chosen master an hour is
  // offered when at least one of them is free — which is why picking a master
  // can only ever narrow the list, never widen it.
  const freeFor = (time: string, m: number) => hash(`${ymd(date)}${time}#${m}`) % 10 > 3;

  const out: { time: string; free: boolean }[] = [];
  for (let m = start; m <= end; m += 30) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const open =
      master === undefined || master < 0 || master >= MASTERS
        ? Array.from({ length: MASTERS }, (_, v) => v).some((v) => freeFor(time, v))
        : freeFor(time, master);
    out.push({ time, free: m > cutoff && open });
  }
  return out;
}

/** The next day that still has room, and its first free hours. */
export function nextAvailability(count = 3, master?: number) {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const free = slotsFor(d, master).filter((s) => s.free).map((s) => s.time);
    if (free.length) {
      return { date: d, offset: i, times: free.slice(0, count) };
    }
  }
  return null;
}
