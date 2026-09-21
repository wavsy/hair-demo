"use client";

import Icon from "./Icon";
import Photo from "./Photo";
import { useI18n } from "./I18n";
import { MASTER_META } from "@/lib/content";
import { DIRECTIONS } from "@/lib/pricing";

/**
 * Decision two: the site is built around the masters, not the salon. Every
 * name carries its own "book" button, and that button hands the person over
 * to the booking form with their diary already attached.
 */
export default function Team() {
  const { t } = useI18n();

  const bookWith = (index: number) => {
    const first = MASTER_META[index].directions[0];
    const direction = DIRECTIONS.findIndex((d) => d.slug === first);
    window.dispatchEvent(
      new CustomEvent("onde:master", { detail: { master: index, direction } })
    );
    document.getElementById("chas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="ekip" className="border-b border-line bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow">{t.team.eyebrow}</span>
            <h2 className="reveal wipe display mt-5 text-4xl text-bone sm:text-5xl">
              {t.team.title}
            </h2>
          </div>
          <p className="max-w-sm text-[15px] font-light leading-relaxed text-muted">{t.team.lead}</p>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {t.team.members.map((m, i) => {
            const meta = MASTER_META[i];
            return (
              <article key={m.name} className="reveal group flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-ink-2">
                  <Photo
                    src={meta.photo}
                    alt={m.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    label={m.name}
                    className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>

                <h3 className="display mt-6 text-2xl text-bone">{m.name}</h3>
                <p className="mt-1.5 text-[12px] uppercase tracking-[0.16em] text-accent">{m.role}</p>
                <p className="mt-3 flex-1 text-[14px] font-light leading-relaxed text-muted">
                  {m.line}
                </p>

                {meta.course !== null && (
                  <p className="mt-3 text-[12px] font-light text-muted/70">
                    {t.team.leads}: {t.courses.items[meta.course].title}
                  </p>
                )}

                <button
                  onClick={() => bookWith(i)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-[13px] font-light text-bone transition hover:border-accent hover:text-accent"
                >
                  {t.team.bookWith(m.name.split(" ")[0])}
                  <Icon name="arrow" className="size-3.5" />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
