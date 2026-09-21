"use client";

import Link from "next/link";
import Photo from "./Photo";
import { useI18n } from "./I18n";
import { MASTERS, masterCopy } from "@/lib/masters";
import { masterHref } from "@/lib/routes";

/**
 * The home page, and almost all of it.
 *
 * There is no hero block, no service grid and no section rhythm, because the
 * salon is not the subject — the five people are. A visitor's first decision
 * here is *who*, and every other decision lives on that person's page.
 *
 * The strip is five columns that grow under the pointer. On a phone there is
 * no pointer and no room for five columns, so it becomes five tall cards.
 */
export default function Faces() {
  const { t, lang } = useI18n();

  return (
    <section
      aria-label={t.home.pick}
      className="flex min-h-[100svh] w-full flex-col md:h-[100svh] md:flex-row"
    >
      {MASTERS.map((m, i) => {
        const c = masterCopy(lang, i);
        return (
          <Link
            key={m.slug}
            href={masterHref(lang, m.slug)}
            className="group relative flex-1 overflow-hidden border-b border-line transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,.61,.36,1)] focus-visible:outline-none md:border-b-0 md:border-r md:last:border-r-0 md:hover:grow-[2.4] md:focus-visible:grow-[2.4]"
          >
            <span className="absolute inset-0 block">
              <Photo
                src={m.photo}
                alt={c.name}
                label={c.name}
                sizes="(max-width: 768px) 100vw, 40vw"
                priority={i < 3}
                className="object-cover grayscale transition-all duration-[1200ms] group-hover:scale-[1.04] group-hover:grayscale-0 group-focus-visible:grayscale-0"
              />
            </span>

            {/* Two washes: one to keep the name legible at the foot of any
                photograph, one that lifts on hover so the face comes forward. */}
            <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
            <span className="absolute inset-0 bg-ink/45 transition-opacity duration-700 group-hover:opacity-0 group-focus-visible:opacity-0" />

            <span className="relative flex h-full min-h-[58svh] flex-col justify-end p-7 md:min-h-0 md:p-8">
              <span className="block text-[11px] uppercase tracking-[0.3em] text-accent">
                {c.role}
              </span>
              <span className="display mt-3 block text-3xl leading-[1.05] text-bone md:text-4xl">
                {c.name}
              </span>
              <span className="mt-3 block max-w-[22ch] text-[15px] font-light leading-relaxed text-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:mt-4">
                {c.line}
              </span>
              <span className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-bone/70 transition group-hover:text-accent">
                {t.home.open}
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </span>
          </Link>
        );
      })}
    </section>
  );
}
