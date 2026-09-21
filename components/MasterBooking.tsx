"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "./I18n";
import { priceLabel, rangeLabel } from "@/lib/content";
import { priceItem } from "@/lib/pricing";
import { MASTERS, masterCopy } from "@/lib/masters";
import { isClosed, slotsFor, ymd } from "@/lib/slots";

/**
 * One person's diary, on one screen.
 *
 * The old site asked four questions in a wizard, and the first of them was
 * "which direction" — a question that only exists because the form served the
 * whole salon. Here the person is already chosen, so what is left is what,
 * when, and who to call. All three are visible at once: nothing is hidden
 * behind a Next button, and the running total never leaves the screen.
 */
export default function MasterBooking({ index }: { index: number }) {
  const { t, lang } = useI18n();
  const b = t.booking;
  const m = masterCopy(lang, index);

  const [mounted, setMounted] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [dayPicked, setDayPicked] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => setMounted(true), []);

  /** Only the price lines this person actually works, in their own order. */
  const menu = useMemo(
    () =>
      MASTERS[index].services.map((key) => {
        const item = priceItem(key);
        if (!item) throw new Error(`${key} is on a master but not in the price list`);
        return {
          key,
          title: t.directions.items[item.di].prices[item.ii].title,
          group: t.directions.items[item.di].title,
          from: item.from,
          to: item.to,
          duration: item.duration,
        };
      }),
    [t, index]
  );

  const days = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const day = days[dayIndex];
  const slots = useMemo(() => (day ? slotsFor(day, index) : []), [day, index]);

  // Open on a day that still offers a choice; once the visitor picks a day
  // themselves, only a day with nothing free at all is overridden.
  useEffect(() => {
    if (!mounted) return;
    const free = (d: Date) => slotsFor(d, index).filter((s) => s.free).length;
    const want = dayPicked ? 1 : 2;
    const roomy = days.findIndex((d) => free(d) >= 2);
    const any = days.findIndex((d) => free(d) >= 1);
    const first = want === 2 && roomy >= 0 ? roomy : any;
    if (first >= 0 && free(days[dayIndex]) < want && free(days[first]) > free(days[dayIndex])) {
      setDayIndex(first);
    }
    setTime((current) =>
      current && slotsFor(days[dayIndex], index).some((s) => s.free && s.time === current)
        ? current
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, dayIndex, days, dayPicked, index]);

  const chosen = menu.filter((s) => picked.includes(s.key));
  const totalFrom = chosen.reduce((a, s) => a + s.from, 0);
  const totalTo = chosen.reduce((a, s) => a + (s.to ?? s.from), 0);
  const totalMin = chosen.reduce((a, s) => a + s.duration, 0);
  const price =
    totalFrom === totalTo ? priceLabel(totalFrom, lang) : rangeLabel(totalFrom, totalTo, lang);

  const ready = picked.length > 0 && !!time && name.trim().length > 1 && phone.trim().length > 5;

  const dayLabel = (d: Date, i: number) =>
    i === 0 ? t.home.today : i === 1 ? t.home.tomorrow : b.weekdays[d.getDay()];

  if (done) {
    return (
      <div id="chas" className="border border-accent/40 bg-ink-2 p-8 md:p-12">
        <p className="text-[11px] uppercase tracking-[0.28em] text-accent">{b.confirmed}</p>
        <h3 className="display mt-4 text-3xl text-bone md:text-4xl">{b.doneTitle}</h3>
        <p className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-muted">
          {b.doneLead(phone)}
        </p>
        <dl className="mt-8 grid gap-4 border-t border-line pt-8 text-[15px] sm:grid-cols-3">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted/60">{b.master}</dt>
            <dd className="mt-1.5 text-bone">{m.name}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted/60">{b.when}</dt>
            <dd className="mt-1.5 text-bone">
              {dayLabel(day, dayIndex)} {day.getDate()} {b.months[day.getMonth()]} · {time}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted/60">
              {b.servicesLabel}
            </dt>
            <dd className="mt-1.5 text-bone">{chosen.map((c) => c.title).join(", ")}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setPicked([]);
            setTime(null);
            setName("");
            setPhone("");
          }}
          className="mt-8 text-[12px] uppercase tracking-[0.2em] text-muted transition hover:text-accent"
        >
          {b.again}
        </button>
      </div>
    );
  }

  return (
    <div id="chas" className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* What */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.28em] text-accent">{b.what}</h3>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {menu.map((s) => {
            const on = picked.includes(s.key);
            const p = s.to ? rangeLabel(s.from, s.to, lang) : priceLabel(s.from, lang);
            return (
              <li key={s.key}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setPicked((v) => (on ? v.filter((k) => k !== s.key) : [...v, s.key]))
                  }
                  className="flex w-full items-baseline justify-between gap-6 py-4 text-left transition"
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden
                      className={`inline-block size-1.5 shrink-0 translate-y-[-3px] rounded-full transition ${
                        on ? "bg-accent" : "bg-line"
                      }`}
                    />
                    <span>
                      <span
                        className={`block text-[16px] font-light transition ${
                          on ? "text-accent" : "text-bone"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-muted/70">
                        {s.group} · ~{s.duration} {t.directions.min}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-[15px] font-light text-muted">
                    {p.eur}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-baseline justify-between gap-6">
          <span className="text-[12px] uppercase tracking-[0.2em] text-muted/60">
            {picked.length ? t.directions.selected(picked.length) : b.nothingPicked}
          </span>
          {picked.length > 0 && (
            <span className="text-right">
              <span className="display block text-3xl text-bone">{price.eur}</span>
              <span className="block text-[12px] text-muted">
                {price.bgn} · ~{totalMin} {t.directions.min}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* When and who */}
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.28em] text-accent">{b.when}</h3>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {days.map((d, i) => {
            const shut = isClosed(d);
            const free = slotsFor(d, index).some((s) => s.free);
            const on = i === dayIndex;
            return (
              <button
                key={ymd(d)}
                type="button"
                disabled={shut || !free}
                onClick={() => {
                  setDayIndex(i);
                  setDayPicked(true);
                }}
                className={`shrink-0 border px-4 py-3 text-center transition ${
                  on
                    ? "border-accent text-accent"
                    : shut || !free
                      ? "border-line/50 text-muted/30"
                      : "border-line text-muted hover:border-accent hover:text-bone"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.18em]">
                  {dayLabel(d, i)}
                </span>
                <span className="display mt-1 block text-xl">{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 min-h-[5.5rem]">
          {!mounted ? null : isClosed(day) ? (
            <p className="text-[15px] font-light text-muted">{b.closedDay}</p>
          ) : slots.some((s) => s.free) ? (
            <div className="flex flex-wrap gap-2">
              {slots
                .filter((s) => s.free)
                .map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    onClick={() => setTime(s.time)}
                    className={`border px-4 py-2.5 text-[14px] font-light transition ${
                      time === s.time
                        ? "border-accent text-accent"
                        : "border-line text-muted hover:border-accent hover:text-bone"
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
            </div>
          ) : (
            <p className="text-[15px] font-light text-muted">{b.noSlots}</p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) setDone(true);
          }}
          className="mt-10 border-t border-line pt-8"
        >
          <h3 className="text-[11px] uppercase tracking-[0.28em] text-accent">{b.q4}</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="block text-[12px] uppercase tracking-[0.16em] text-muted/60">
                {b.yourName}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={b.namePlaceholder}
                className="mt-2 w-full border-b border-line bg-transparent pb-2 text-[16px] font-light text-bone outline-none transition placeholder:text-muted/40 focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="block text-[12px] uppercase tracking-[0.16em] text-muted/60">
                {b.phone}
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={b.phonePlaceholder}
                inputMode="tel"
                className="mt-2 w-full border-b border-line bg-transparent pb-2 text-[16px] font-light text-bone outline-none transition placeholder:text-muted/40 focus:border-accent"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!ready}
            className="mt-8 w-full border border-accent px-8 py-4 text-[12px] uppercase tracking-[0.22em] transition enabled:text-accent enabled:hover:bg-accent enabled:hover:text-ink disabled:border-line disabled:text-muted/40"
          >
            {b.confirm}
          </button>
          <p className="mt-4 text-[12px] font-light text-muted/60">{b.demoNote}</p>
        </form>
      </div>
    </div>
  );
}
