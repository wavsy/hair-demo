"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import { useI18n } from "./I18n";
import { priceLabel, rangeLabel } from "@/lib/content";
import { DIRECTIONS, directionFrom } from "@/lib/pricing";

/**
 * Decision one of the demo: the services are not tipped onto the page. Four
 * cards, and the price list opens only for the direction you asked for — a
 * flat list of a hundred rows is unusable on a phone.
 */
export default function Directions() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  const choose = (di: number) => {
    // Booking runs direction → master, so a selection never spans two directions.
    if (open !== di) setPicked([]);
    setOpen(open === di ? null : di);
  };

  const toggle = (key: string) =>
    setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  const total = useMemo(() => {
    if (open === null) return { from: 0, to: 0, minutes: 0, count: 0, ranged: false };
    const items = DIRECTIONS[open].items.filter((i) => picked.includes(`${DIRECTIONS[open].slug}/${i.slug}`));
    return {
      from: items.reduce((a, i) => a + i.from, 0),
      to: items.reduce((a, i) => a + (i.to ?? i.from), 0),
      minutes: items.reduce((a, i) => a + i.duration, 0),
      count: items.length,
      ranged: items.some((i) => i.to !== undefined),
    };
  }, [open, picked]);

  const totalLabel = total.ranged
    ? rangeLabel(total.from, total.to, lang)
    : priceLabel(total.from, lang);

  const book = () => {
    window.dispatchEvent(
      new CustomEvent("onde:select", { detail: { direction: open, keys: picked } })
    );
    document.getElementById("chas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="napravleniya" className="border-b border-line bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-10">
          <div className="max-w-2xl">
            <span className="eyebrow">{t.directions.eyebrow}</span>
            <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">
              {t.directions.title}
            </h2>
            <p className="mt-6 max-w-lg text-[16px] font-light leading-relaxed text-muted">
              {t.directions.lead}
            </p>
          </div>

          <ul className="grid gap-3 text-[14px]">
            {t.directions.chips.map((c) => (
              <li key={c} className="flex items-center gap-3 font-light text-muted">
                <Icon name="check" className="size-3.5 text-accent" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {DIRECTIONS.map((d, di) => {
            const copy = t.directions.items[di];
            const on = open === di;
            const from = priceLabel(directionFrom(di), lang);
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => choose(di)}
                aria-expanded={on}
                aria-controls="pricelist"
                className={`reveal group relative flex flex-col p-7 text-left transition ${
                  on ? "bg-ink-3" : "bg-ink-2 hover:bg-ink-3"
                }`}
              >
                <span className={`transition ${on ? "text-accent" : "text-muted group-hover:text-accent"}`}>
                  <Icon name={d.icon} className="size-7" />
                </span>

                <h3 className="display mt-8 text-[1.9rem] text-bone">{copy.title}</h3>
                <p className="mt-3 flex-1 text-[14px] font-light leading-relaxed text-muted">
                  {copy.blurb}
                </p>

                <span className="mt-7 flex items-baseline justify-between border-t border-line pt-5">
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-muted/70">
                      {t.directions.from}
                    </span>
                    <span className="display mt-1 block text-2xl text-bone">{from.eur}</span>
                  </span>
                  <span className="flex items-center gap-2 text-[12px] font-light text-muted">
                    {t.directions.positions(d.items.length)}
                    <Icon
                      name="chevron"
                      className={`size-4 transition-transform ${on ? "rotate-180 text-accent" : ""}`}
                    />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* The price list itself — one direction at a time, never all four. */}
        <div
          id="pricelist"
          className={`grid transition-all duration-500 ${
            open === null ? "grid-rows-[0fr] opacity-0" : "mt-px grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden">
            {open !== null && (
              <div className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-9">
                <div className="flex items-center justify-between gap-6">
                  <h3 className="display text-2xl text-bone">
                    {t.directions.items[open].title}
                  </h3>
                  <button
                    onClick={() => setOpen(null)}
                    className="flex items-center gap-2 text-[13px] font-light text-muted transition hover:text-bone"
                  >
                    {t.directions.close}
                    <Icon name="close" className="size-3.5" />
                  </button>
                </div>

                <ul className="mt-7 divide-y divide-line border-y border-line">
                  {DIRECTIONS[open].items.map((item, ii) => {
                    const key = `${DIRECTIONS[open].slug}/${item.slug}`;
                    const copy = t.directions.items[open].prices[ii];
                    const p = rangeLabel(item.from, item.to, lang);
                    const on = picked.includes(key);
                    return (
                      <li key={key}>
                        <button
                          onClick={() => toggle(key)}
                          aria-pressed={on}
                          className="group flex w-full items-center gap-5 py-5 text-left transition"
                        >
                          <span
                            className={`grid size-6 shrink-0 place-items-center rounded-full border transition ${
                              on
                                ? "border-accent bg-accent text-ink"
                                : "border-line text-transparent group-hover:border-accent"
                            }`}
                          >
                            <Icon name="check" className="size-3" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={`block text-[16px] font-light ${on ? "text-accent-soft" : "text-bone"}`}>
                              {copy.title}
                            </span>
                            <span className="mt-1 block text-[13px] font-light text-muted">
                              {copy.note} · ~{item.duration} {t.directions.min}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="display block text-xl text-bone">{p.eur}</span>
                            <span className="mt-0.5 block text-[12px] font-light text-muted">{p.bgn}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-6 max-w-2xl text-[13px] font-light leading-relaxed text-muted/80">
                  {t.directions.note}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* The calculator: what the chosen lines add up to, before the chair. */}
        <div
          className={`sticky bottom-4 z-30 mt-6 transition-all duration-500 ${
            total.count ? "translate-y-0 opacity-100" : "hidden"
          }`}
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl border border-accent-dim bg-ink-3/95 p-5 backdrop-blur-xl sm:flex-row sm:p-6">
            <div className="flex-1 text-center sm:text-left">
              <div className="text-[12px] font-light uppercase tracking-[0.16em] text-muted">
                {t.directions.selected(total.count)} · {t.directions.about} {total.minutes}{" "}
                {t.directions.min}
              </div>
              <div className="mt-1.5 flex items-baseline justify-center gap-3 sm:justify-start">
                <span className="display text-3xl text-bone">{totalLabel.eur}</span>
                <span className="text-[13px] font-light text-muted">{totalLabel.bgn}</span>
              </div>
            </div>
            <button
              onClick={book}
              className="magnetic sweep on-light inline-flex w-full items-center justify-center gap-2 rounded-full bg-bone px-7 py-3.5 text-[15px] font-medium text-ink transition hover:bg-accent-soft sm:w-auto"
            >
              {t.directions.bookThis}
              <Icon name="arrow" className="size-4" />
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-[13px] font-light text-muted/70">
          {t.directions.currencyNote}
        </p>
      </div>
    </section>
  );
}
