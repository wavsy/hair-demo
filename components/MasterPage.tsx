"use client";

import Link from "next/link";
import MasterBooking from "./MasterBooking";
import Photo from "./Photo";
import { useI18n } from "./I18n";
import { MASTERS, masterCopy, yearsOn } from "@/lib/masters";
import { coursesHref, masterHref } from "@/lib/routes";

/**
 * A person's page, which is where this site actually lives.
 *
 * It opens on their face at full height with their own sentence over it, and
 * then reads downward the way you would ask about someone: what are they good
 * at, show me their work, what does it cost, when are they free, what do
 * people say. The salon appears once, at the very bottom, as an address.
 */
export default function MasterPage({ index }: { index: number }) {
  const { t, lang } = useI18n();
  const meta = MASTERS[index];
  const c = masterCopy(lang, index);
  const p = t.masterPage;
  const others = MASTERS.map((m, i) => ({ m, i })).filter(({ i }) => i !== index);

  return (
    <article>
      {/* The face, full height, with their own line over it. */}
      <header className="relative flex min-h-[86svh] items-end overflow-hidden border-b border-line">
        <span className="absolute inset-0 block">
          <Photo
            src={meta.photo}
            alt={c.name}
            label={c.name}
            sizes="100vw"
            priority
            className="object-cover grayscale"
          />
        </span>
        <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />

        <div className="relative mx-auto w-full max-w-[110rem] px-6 pb-16 md:px-10 md:pb-20">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent">{c.role}</p>
          <h1 className="display mt-5 text-5xl leading-[0.95] text-bone sm:text-7xl md:text-8xl">
            {c.name}
          </h1>
          <p className="display mt-6 max-w-3xl text-2xl italic leading-snug text-accent-soft sm:text-3xl">
            {c.line}
          </p>
          <p className="mt-8 text-[13px] uppercase tracking-[0.2em] text-muted">
            {p.years(yearsOn(index))}
          </p>
        </div>
      </header>

      {/* In their own words, and what they are good at. */}
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[110rem] gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <p className="display text-2xl leading-[1.5] text-bone sm:text-3xl">{c.intro}</p>
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.28em] text-accent">{p.strengths}</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {c.strengths.map((s) => (
                <li key={s} className="py-4 text-[17px] font-light text-muted">
                  {s}
                </li>
              ))}
            </ul>
            {meta.course !== null && (
              <Link
                href={coursesHref(lang)}
                className="mt-8 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] text-bone transition hover:text-accent"
              >
                {p.teaches(t.courses.items[meta.course].title)}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Their work. Three pictures, full width, one after another. */}
      <section className="border-b border-line">
        <h2 className="sr-only">{p.works}</h2>
        {meta.works.map((src, i) => (
          <figure key={src} className="relative border-b border-line last:border-b-0">
            <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
              <Photo
                src={src}
                alt={c.works[i]}
                label={c.works[i]}
                sizes="100vw"
                className="object-cover grayscale transition-all duration-[1400ms] hover:grayscale-0"
              />
            </div>
            <figcaption className="mx-auto flex max-w-[110rem] items-baseline gap-5 px-6 py-5 md:px-10">
              <span className="display text-xl text-muted/50">0{i + 1}</span>
              <span className="text-[15px] font-light text-muted">{c.works[i]}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Price and diary, side by side. */}
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[110rem]">
          <h2 className="display text-4xl text-bone sm:text-5xl">{p.bookTitle(c.name)}</h2>
          <p className="mt-5 max-w-2xl text-[16px] font-light leading-relaxed text-muted">
            {p.bookLead}
          </p>
          <div className="mt-14">
            <MasterBooking index={index} />
          </div>
          <p className="mt-10 max-w-3xl text-[12px] font-light leading-relaxed text-muted/60">
            {t.directions.note}
          </p>
        </div>
      </section>

      {/* What people say about this person, not about the salon. */}
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[110rem]">
          <h2 className="text-[11px] uppercase tracking-[0.28em] text-accent">
            {p.reviews(c.name)}
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            {c.reviews.map((r) => (
              <blockquote key={r.author} className="border-t border-line pt-8">
                <p className="display text-xl leading-[1.55] text-bone sm:text-2xl">“{r.text}”</p>
                <footer className="mt-5 text-[12px] uppercase tracking-[0.2em] text-muted">
                  {r.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* The other four, so the visitor can change their mind cheaply. */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[110rem]">
          <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted/60">{p.others}</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {others.map(({ m, i }) => {
              const o = masterCopy(lang, i);
              return (
                <Link
                  key={m.slug}
                  href={masterHref(lang, m.slug)}
                  className="group relative aspect-[3/4] overflow-hidden border border-line"
                >
                  <Photo
                    src={m.photo}
                    alt={o.name}
                    label={o.name}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-accent">
                      {o.role}
                    </span>
                    <span className="display mt-1 block text-lg text-bone">{o.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}
