"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import { useI18n } from "./I18n";
import { SERVICE_META, priceLabel } from "@/lib/content";

export default function Services() {
  const { t, lang } = useI18n();
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (slug: string) =>
    setPicked((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));

  const total = useMemo(() => {
    const chosen = SERVICE_META.filter((s) => picked.includes(s.slug));
    return {
      eur: chosen.reduce((a, s) => a + s.price, 0),
      minutes: chosen.reduce((a, s) => a + s.duration, 0),
      count: chosen.length,
    };
  }, [picked]);

  const label = priceLabel(total.eur, lang);

  const book = () => {
    window.dispatchEvent(new CustomEvent("lapa:select-services", { detail: picked }));
    document.getElementById("chas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="uslugi" className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
              {t.services.eyebrow}
            </span>
            <h2 className="reveal wipe mt-3 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
              {t.services.title}
            </h2>
            <p className="mt-4 text-lg text-ink-soft">{t.services.lead}</p>
          </div>

          <ul className="grid gap-3 text-[15px]">
            {t.services.chips.map((c) => (
              <li key={c} className="flex items-center gap-2.5 font-medium text-ink-soft">
                <span className="grid size-6 place-items-center rounded-full bg-mint text-brand">
                  <Icon name="check" className="size-3.5" />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICE_META.map((meta, i) => {
            const copy = t.services.items[i];
            const on = picked.includes(meta.slug);
            const p = priceLabel(meta.price, lang);
            return (
              <button
                key={meta.slug}
                type="button"
                onClick={() => toggle(meta.slug)}
                aria-pressed={on}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className={`reveal spotlight tilt group relative rounded-[1.75rem] border p-6 text-left ${
                  on
                    ? "border-brand bg-brand text-white shadow-lift"
                    : "border-ink/8 bg-white shadow-soft hover:shadow-lift"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl transition ${
                      on ? "bg-white/15 text-white" : "bg-mint text-brand"
                    }`}
                  >
                    <Icon name={meta.icon} className="size-6" />
                  </span>
                  <span
                    className={`grid size-7 place-items-center rounded-full border transition ${
                      on
                        ? "border-white bg-white text-brand"
                        : "border-ink/15 text-transparent group-hover:border-brand"
                    }`}
                  >
                    <Icon name="check" className="size-4" />
                  </span>
                </div>

                <h3 className={`mt-5 text-xl font-bold tracking-tight ${on ? "text-white" : "text-ink"}`}>
                  {copy.title}
                </h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${on ? "text-white/80" : "text-ink-soft"}`}>
                  {copy.blurb}
                </p>

                <div className={`mt-5 flex items-end justify-between border-t pt-4 ${on ? "border-white/20" : "border-ink/8"}`}>
                  <div>
                    <div className={`text-2xl font-extrabold tracking-tight ${on ? "text-white" : "text-ink"}`}>
                      {t.services.from} {p.eur}
                    </div>
                    <div className={`text-sm ${on ? "text-white/70" : "text-ink-soft"}`}>{p.bgn}</div>
                  </div>
                  <span className={`text-sm font-medium ${on ? "text-white/70" : "text-ink-soft"}`}>
                    ~{meta.duration} {t.services.min}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className={`sticky bottom-4 z-30 mt-8 transition-all duration-500 ${
            total.count ? "translate-y-0 opacity-100" : "hidden"
          }`}
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-[1.75rem] bg-ink p-5 text-white shadow-lift sm:flex-row sm:p-6">
            <div className="flex-1 text-center sm:text-left">
              <div className="text-sm text-white/60">
                {t.services.selected(total.count)} · {t.services.about} {total.minutes} {t.services.min}
              </div>
              <div className="mt-1 flex items-baseline justify-center gap-2 sm:justify-start">
                <span className="text-3xl font-extrabold tracking-tight">{label.eur}</span>
                <span className="text-white/60">{label.bgn}</span>
              </div>
            </div>
            <button
              onClick={book}
              className="magnetic sweep on-light inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink transition hover:bg-mint sm:w-auto"
            >
              {t.services.bookThis}
              <Icon name="arrow" className="size-5" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">{t.services.note}</p>
      </div>
    </section>
  );
}
